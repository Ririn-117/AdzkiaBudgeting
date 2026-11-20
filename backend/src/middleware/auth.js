import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { getDb } from '../database/db.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: 'Autentikasi diperlukan. Token tidak ditemukan.' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const db = getDb();

    const user = db.prepare(`
      SELECT u.id, u.username, u.email, u.name, u.nidn, u.rank, u.employment_status,
             u.phone, u.role, u.unit_id, u.status, u.twofa_enabled, u.whatsapp_notif,
             u.revisi_notif, u.photo_url, u.signature_url,
             un.code AS unit_code, un.name AS unit_name, un.parent_faculty, un.pagu_allocated,
             un.bsi_account, un.bsi_bank_name
      FROM users u
      LEFT JOIN units un ON un.id = u.unit_id
      WHERE u.id = ?
    `).get(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Pengguna tidak ditemukan.' });
    }
    if (user.status !== 'aktif') {
      return res.status(403).json({ message: 'Akun Anda belum aktif atau sedang dinonaktifkan.' });
    }

    if (payload.jti) {
      const session = db.prepare('SELECT id, is_active FROM user_sessions WHERE token_jti = ?').get(payload.jti);
      if (session && !session.is_active) {
        return res.status(401).json({ message: 'Sesi telah diakhiri. Silakan login kembali.' });
      }
      if (session) {
        db.prepare("UPDATE user_sessions SET last_active_at = datetime('now') WHERE id = ?").run(session.id);
      }
    }

    req.user = user;
    req.tokenJti = payload.jti || null;
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Autentikasi diperlukan.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak. Fitur ini hanya untuk peran: ${allowedRoles.join(', ')}.`,
      });
    }
    next();
  };
}
