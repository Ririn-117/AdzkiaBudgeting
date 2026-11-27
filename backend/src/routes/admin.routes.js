import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, runTransaction } from '../database/db.js';
import { ROLES } from '../config/constants.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

router.use(requireAuth, requireRole(ROLES.ADMINISTRATOR));

// Users Management
router.get('/users', (req, res) => {
  const { q = '', role = '', status = '' } = req.query;
  const users = getDb().prepare(`
    SELECT u.id, u.username, u.email, u.name, u.nidn, u.rank, u.employment_status,
           u.phone, u.role, u.unit_id, u.status, u.twofa_enabled, u.created_at,
           un.name AS unit_name, un.code AS unit_code
    FROM users u
    LEFT JOIN units un ON un.id = u.unit_id
    WHERE (? = '' OR LOWER(u.name || ' ' || u.username || ' ' || u.nidn || ' ' || u.email) LIKE ?)
      AND (? = '' OR u.role = ?)
      AND (? = '' OR u.status = ?)
    ORDER BY u.id ASC
  `).all(q, `%${String(q).toLowerCase()}%`, role, role, status, status);
  res.json({ users });
});

router.post('/users', (req, res) => {
  const { username, email, password = 'password123', name, nidn = '', role, unit_id = null, status = 'aktif', twofa_enabled = false } = req.body || {};
  if (!username || !email || !name || !role) {
    return res.status(400).json({ message: 'Username, email, nama, dan role wajib diisi.' });
  }
  const db = getDb();
  const exists = db.prepare('SELECT id FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?').get(username.toLowerCase(), email.toLowerCase());
  if (exists) return res.status(409).json({ message: 'Username atau email sudah digunakan.' });

  const hash = bcrypt.hashSync(String(password), 10);
  const info = db.prepare(`
    INSERT INTO users (username, email, password_hash, name, nidn, role, unit_id, status, twofa_enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(username.trim(), email.trim().toLowerCase(), hash, name.trim(), nidn, role, unit_id || null, status, twofa_enabled ? 1 : 0);

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Manajemen Pengguna', action: 'create', title: `Tambah pengguna ${name} (${role})`, ipAddress: req.ip });
  res.status(201).json({
    user: db.prepare('SELECT id, username, email, name, nidn, role, unit_id, status, twofa_enabled FROM users WHERE id = ?').get(info.lastInsertRowid),
  });
});

router.put('/users/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

  const { name, nidn, role, unit_id, status, twofa_enabled } = req.body || {};
  db.prepare(`
    UPDATE users
    SET name = COALESCE(?, name), nidn = COALESCE(?, nidn), role = COALESCE(?, role),
        unit_id = COALESCE(?, unit_id), status = COALESCE(?, status),
        twofa_enabled = COALESCE(?, twofa_enabled), updated_at = datetime('now')
    WHERE id = ?
  `).run(name ?? null, nidn ?? null, role ?? null, unit_id ?? null, status ?? null, twofa_enabled !== undefined ? (twofa_enabled ? 1 : 0) : null, req.params.id);

  res.json({
    user: db.prepare('SELECT id, username, email, name, nidn, role, unit_id, status, twofa_enabled FROM users WHERE id = ?').get(req.params.id),
  });
});

router.delete('/users/:id', (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri.' });
  }
  const info = getDb().prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  res.json({ message: 'Pengguna dihapus.' });
});

// Role & Permission Matrix
router.get('/roles', (_req, res) => {
  const permissions = getDb().prepare('SELECT * FROM role_permissions ORDER BY module, role').all();
  res.json({ permissions });
});

router.put('/roles', (req, res) => {
  const { permissions = [] } = req.body || {};
  if (!Array.isArray(permissions)) {
    return res.status(400).json({ message: 'Format matriks hak akses tidak valid.' });
  }

  runTransaction((tx) => {
    const upsert = tx.prepare(`
      INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete, can_verify, can_approve)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        can_view = VALUES(can_view),
        can_create = VALUES(can_create),
        can_edit = VALUES(can_edit),
        can_delete = VALUES(can_delete),
        can_verify = VALUES(can_verify),
        can_approve = VALUES(can_approve)
    `);
    for (const p of permissions) {
      upsert.run(
        p.role, p.module,
        p.can_view ? 1 : 0, p.can_create ? 1 : 0, p.can_edit ? 1 : 0,
        p.can_delete ? 1 : 0, p.can_verify ? 1 : 0, p.can_approve ? 1 : 0
      );
    }
  });

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Hak Akses', action: 'update', title: 'Pembaruan matriks hak akses RBAC', ipAddress: req.ip });
  res.json({ message: 'Matriks hak akses berhasil disimpan.' });
});

// System Configs
router.get('/configs', (_req, res) => {
  const configs = getDb().prepare('SELECT * FROM system_configs ORDER BY tab, `key`').all();
  res.json({ configs });
});

router.put('/configs', (req, res) => {
  const { configs = [] } = req.body || {};
  runTransaction((tx) => {
    const stmt = tx.prepare("UPDATE system_configs SET value = ?, updated_at = NOW() WHERE `key` = ?");
    for (const c of configs) {
      stmt.run(String(c.value ?? ''), c.key);
    }
  });
  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Konfigurasi', action: 'update', title: 'Pembaruan konfigurasi sistem', ipAddress: req.ip });
  res.json({ message: 'Konfigurasi sistem berhasil disimpan.' });
});

// Audit Logs
router.get('/audit-logs', (req, res) => {
  const { module = '', status = '', date = '', page = '1', size = '30' } = req.query;
  const rows = getDb().prepare(`
    SELECT * FROM audit_logs
    WHERE (? = '' OR module = ?)
      AND (? = '' OR status = ?)
      AND (? = '' OR date(created_at) = ?)
    ORDER BY id DESC
  `).all(module, module, status, status, date, date);

  const p = Math.max(1, Number(page));
  const s = Math.max(1, Number(size));
  res.json({
    logs: rows.slice((p - 1) * s, p * s),
    total: rows.length,
  });
});

export default router;
