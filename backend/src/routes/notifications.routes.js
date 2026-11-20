import { Router } from 'express';
import { getDb } from '../database/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, (req, res) => {
  const { category = '', unread = '' } = req.query;
  const rows = getDb().prepare(`
    SELECT * FROM notifications
    WHERE (user_id = ? OR role_target = ?)
      AND (? = '' OR category = ?)
      AND (? = '' OR is_read = ?)
    ORDER BY created_at DESC, id DESC
  `).all(
    req.user.id, req.user.role,
    category, category,
    unread, unread === 'true' ? 0 : unread === 'false' ? 1 : 0
  );

  const mapped = rows.map((r) => ({
    ...r,
    unread: Boolean(!r.is_read),
    actions: JSON.parse(r.actions_json || '[]'),
  }));

  res.json({
    notifications: mapped,
    unreadCount: mapped.filter((n) => n.unread).length,
  });
});

// PUT /api/notifications/read-all
router.put('/read-all', requireAuth, (req, res) => {
  getDb().prepare(`
    UPDATE notifications SET is_read = 1
    WHERE user_id = ? OR role_target = ?
  `).run(req.user.id, req.user.role);
  res.json({ message: 'Semua notifikasi ditandai telah dibaca.' });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', requireAuth, (req, res) => {
  const { read = true } = req.body || {};
  const info = getDb().prepare(`
    UPDATE notifications SET is_read = ?
    WHERE id = ? AND (user_id = ? OR role_target = ?)
  `).run(read ? 1 : 0, req.params.id, req.user.id, req.user.role);
  if (!info.changes) return res.status(404).json({ message: 'Notifikasi tidak ditemukan.' });
  res.json({ message: 'Status notifikasi diperbarui.' });
});

// DELETE /api/notifications/:id
router.delete('/:id', requireAuth, (req, res) => {
  const info = getDb().prepare(`
    DELETE FROM notifications
    WHERE id = ? AND (user_id = ? OR role_target = ?)
  `).run(req.params.id, req.user.id, req.user.role);
  if (!info.changes) return res.status(404).json({ message: 'Notifikasi tidak ditemukan.' });
  res.json({ message: 'Notifikasi dihapus.' });
});

export default router;
