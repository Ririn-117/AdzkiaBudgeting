import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getDb } from '../database/db.js';
import { env } from '../config/env.js';
import { ROLES } from '../config/constants.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../utils/upload.js';
import { createNotification, logAudit } from '../utils/audit.js';

const router = Router();

function sanitizeUser(row) {
  if (!row) return null;
  const { password_hash, ...safe } = row;
  return safe;
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { identifier, password, role } = req.body || {};
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/username dan kata sandi wajib diisi.' });
  }

  const db = getDb();
  const key = String(identifier).trim().toLowerCase();
  const found = db.prepare(`
    SELECT u.*, un.code AS unit_code, un.name AS unit_name, un.parent_faculty, un.pagu_allocated
    FROM users u
    LEFT JOIN units un ON un.id = u.unit_id
    WHERE LOWER(u.username) = ? OR LOWER(u.email) = ?
  `).get(key, key);

  if (!found || !bcrypt.compareSync(String(password), found.password_hash)) {
    return res.status(401).json({ message: 'Email/username atau kata sandi salah.' });
  }
  if (found.status !== 'aktif') {
    const msg = found.status === 'pending'
      ? 'Akun Anda masih menunggu verifikasi Administrator. Silakan coba lagi setelah akun disetujui.'
      : 'Akun Anda belum aktif atau sedang dinonaktifkan.';
    return res.status(403).json({ message: msg });
  }
  if (role && found.role !== role) {
    return res.status(403).json({ message: 'Peran yang dipilih tidak sesuai dengan akun Anda.' });
  }

  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: found.id, role: found.role, jti },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  const userAgent = req.headers['user-agent'] || 'Browser / REST Client';
  const ip = req.ip || '127.0.0.1';
  db.prepare(`
    INSERT INTO user_sessions (user_id, token_jti, device, ip_address)
    VALUES (?, ?, ?, ?)
  `).run(found.id, jti, userAgent.slice(0, 120), ip);

  logAudit({
    userId: found.id,
    userName: found.name,
    userRole: found.role,
    module: 'Autentikasi',
    action: 'login',
    title: 'Login berhasil',
    detail: `Login sebagai ${found.role}`,
    ipAddress: ip,
    tone: 'sky',
  });

  res.json({ token, user: sanitizeUser(found) });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { fullName, email, unit, role, password } = req.body || {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Nama lengkap, email, dan kata sandi wajib diisi.' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: 'Kata sandi minimal 8 karakter.' });
  }

  const db = getDb();
  const cleanEmail = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@adzkia\.ac\.id$/i.test(cleanEmail)) {
    return res.status(400).json({ message: 'Gunakan email institusi berakhiran @adzkia.ac.id.' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
  if (exists) {
    return res.status(409).json({ message: 'Email tersebut sudah terdaftar.' });
  }

  // Administrator tidak boleh didaftarkan secara mandiri.
  const selfRegisterRoles = Object.values(ROLES).filter((r) => r !== ROLES.ADMINISTRATOR);
  if (role && !selfRegisterRoles.includes(role)) {
    return res.status(400).json({ message: 'Role yang diajukan tidak valid untuk pendaftaran mandiri.' });
  }
  const assignedRole = role || ROLES.UNIT_PRODI;

  let unitId = null;
  if (unit) {
    const unitRow = db.prepare('SELECT id FROM units WHERE code = ? OR name = ?').get(unit, unit);
    if (!unitRow) {
      return res.status(400).json({ message: 'Unit / program studi tidak ditemukan.' });
    }
    unitId = unitRow.id;
  }
  if (assignedRole === ROLES.UNIT_PRODI && !unitId) {
    return res.status(400).json({ message: 'Unit / program studi wajib dipilih untuk role Unit/Prodi.' });
  }

  // Username unik dari bagian depan email (tanpa akhiran acak jika masih tersedia).
  const baseUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9._-]/g, '') || 'user';
  let username = baseUsername;
  const usernameTaken = db.prepare('SELECT 1 FROM users WHERE LOWER(username) = ?');
  for (let i = 2; usernameTaken.get(username); i += 1) {
    username = `${baseUsername}${i}`;
  }

  const hash = bcrypt.hashSync(String(password), 10);

  // Unit/Prodi langsung aktif; role pimpinan/keuangan menunggu persetujuan Administrator.
  const autoActive = assignedRole === ROLES.UNIT_PRODI;
  const status = autoActive ? 'aktif' : 'pending';

  const info = db.prepare(`
    INSERT INTO users (username, email, password_hash, name, role, unit_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(username, cleanEmail, hash, String(fullName).trim(), assignedRole, unitId, status);

  createNotification({
    roleTarget: ROLES.ADMINISTRATOR,
    category: autoActive ? 'info' : 'tindakan',
    tag: 'PENDAFTARAN BARU',
    tagTone: 'navy',
    refCode: `USR-${info.lastInsertRowid}`,
    title: `Pendaftaran Akun Baru: ${fullName}`,
    body: autoActive
      ? `Pengguna **${fullName}** (${cleanEmail}) mendaftar dengan peran **${assignedRole}** dan akun langsung aktif.`
      : `Pengguna **${fullName}** (${cleanEmail}) mengajukan pendaftaran akun dengan peran **${assignedRole}** dan menunggu persetujuan.`,
    accent: 'navy',
    icon: 'badge',
  });

  logAudit({
    userId: info.lastInsertRowid,
    userName: String(fullName).trim(),
    userRole: assignedRole,
    module: 'Autentikasi',
    action: 'register',
    title: autoActive ? 'Pendaftaran akun (langsung aktif)' : 'Pendaftaran akun diajukan',
    detail: `Email: ${cleanEmail}, username: ${username}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    message: autoActive
      ? `Pendaftaran berhasil. Akun Anda sudah aktif, silakan masuk menggunakan email ${cleanEmail} atau username "${username}".`
      : 'Pendaftaran berhasil diajukan. Akun Anda akan diverifikasi oleh Administrator sebelum dapat digunakan.',
    user: { username, email: cleanEmail, role: assignedRole, status },
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ message: 'Email wajib diisi.' });
  }

  const db = getDb();
  const cleanEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT id, email FROM users WHERE LOWER(email) = ?').get(cleanEmail);

  if (user) {
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO password_resets (user_id, email, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(user.id, user.email, token, expiresAt);
  }

  res.json({
    message: `Jika ${String(email).trim()} terdaftar, tautan untuk mengatur ulang kata sandi akan dikirim ke email tersebut.`,
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword || String(newPassword).length < 8) {
    return res.status(400).json({ message: 'Token dan kata sandi baru (minimal 8 karakter) wajib diisi.' });
  }

  const db = getDb();
  const reset = db.prepare(`
    SELECT * FROM password_resets WHERE token = ? AND used = 0
  `).get(token);

  if (!reset || new Date(reset.expires_at) < new Date()) {
    return res.status(400).json({ message: 'Token reset kata sandi tidak valid atau sudah kedaluwarsa.' });
  }

  const hash = bcrypt.hashSync(String(newPassword), 10);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(hash, reset.user_id);
  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(reset.id);

  res.json({ message: 'Kata sandi berhasil diperbarui.' });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  if (req.tokenJti) {
    getDb().prepare('UPDATE user_sessions SET is_active = 0 WHERE token_jti = ?').run(req.tokenJti);
  }
  res.json({ message: 'Berhasil keluar dari sesi.' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const permissions = db.prepare('SELECT * FROM role_permissions WHERE role = ?').all(req.user.role);
  res.json({ user: req.user, permissions });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req, res) => {
  const { phone, twofa_enabled, whatsapp_notif, revisi_notif, name } = req.body || {};
  const db = getDb();

  db.prepare(`
    UPDATE users
    SET phone = COALESCE(?, phone),
        name = COALESCE(?, name),
        twofa_enabled = COALESCE(?, twofa_enabled),
        whatsapp_notif = COALESCE(?, whatsapp_notif),
        revisi_notif = COALESCE(?, revisi_notif),
        updated_at = datetime('now')
    WHERE id = ?
  `).run(
    phone ?? null,
    name ?? null,
    twofa_enabled !== undefined ? (twofa_enabled ? 1 : 0) : null,
    whatsapp_notif !== undefined ? (whatsapp_notif ? 1 : 0) : null,
    revisi_notif !== undefined ? (revisi_notif ? 1 : 0) : null,
    req.user.id
  );

  logAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    module: 'Profil',
    action: 'update',
    title: 'Pembaruan profil & preferensi',
    detail: 'Data kontak dan preferensi notifikasi diperbarui',
    ipAddress: req.ip || '127.0.0.1',
  });

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: 'Pembaruan profil disimpan.', user: sanitizeUser(updated) });
});

// POST /api/auth/profile/photo
router.post('/profile/photo', requireAuth, uploadImage.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File foto wajib diunggah.' });
  const photoUrl = `/uploads/profiles/${req.file.filename}`;
  getDb().prepare("UPDATE users SET photo_url = ?, updated_at = datetime('now') WHERE id = ?").run(photoUrl, req.user.id);
  res.json({ message: 'Foto profil diperbarui.', photo_url: photoUrl });
});

// POST /api/auth/profile/signature
router.post('/profile/signature', requireAuth, uploadImage.single('signature'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File spesimen tanda tangan wajib diunggah.' });
  const sigUrl = `/uploads/profiles/${req.file.filename}`;
  getDb().prepare("UPDATE users SET signature_url = ?, updated_at = datetime('now') WHERE id = ?").run(sigUrl, req.user.id);
  res.json({ message: 'Spesimen tanda tangan diperbarui.', signature_url: sigUrl });
});

// PUT /api/auth/change-password
router.put('/change-password', requireAuth, (req, res) => {
  const { current, next } = req.body || {};
  if (!current || !next || String(next).length < 8) {
    return res.status(400).json({ message: 'Kata sandi saat ini dan kata sandi baru (min. 8 karakter) wajib diisi.' });
  }
  const db = getDb();
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(String(current), user.password_hash)) {
    return res.status(400).json({ message: 'Kata sandi saat ini tidak sesuai.' });
  }
  const hash = bcrypt.hashSync(String(next), 10);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(hash, req.user.id);

  logAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    module: 'Keamanan',
    action: 'change_password',
    title: 'Perubahan kata sandi akun',
    ipAddress: req.ip || '127.0.0.1',
    tone: 'maroon',
  });

  res.json({ message: 'Kata sandi berhasil diperbarui.' });
});

// GET /api/auth/sessions
router.get('/sessions', requireAuth, (req, res) => {
  const sessions = getDb().prepare(`
    SELECT id, device, ip_address, location, is_active, last_active_at, created_at,
           CASE WHEN token_jti = ? THEN 1 ELSE 0 END AS current
    FROM user_sessions
    WHERE user_id = ? AND is_active = 1
    ORDER BY last_active_at DESC
  `).all(req.tokenJti || '', req.user.id);
  res.json({ sessions });
});

// DELETE /api/auth/sessions/:id
router.delete('/sessions/:id', requireAuth, (req, res) => {
  const db = getDb();
  const info = db.prepare('UPDATE user_sessions SET is_active = 0 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (info.changes === 0) return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
  res.json({ message: 'Perangkat berhasil dikeluarkan.' });
});

export default router;
