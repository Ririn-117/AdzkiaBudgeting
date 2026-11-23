import { Router } from 'express';
import { getDb } from '../database/db.js';
import { ROLES } from '../config/constants.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// Public/auth list of units (needed for register page too)
router.get('/units', (req, res) => {
  const { q = '', type = '', status = '' } = req.query;
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM units
    WHERE (? = '' OR LOWER(name || ' ' || code || ' ' || head_name) LIKE ?)
      AND (? = '' OR type = ?)
      AND (? = '' OR status = ?)
    ORDER BY id ASC
  `).all(q, `%${String(q).toLowerCase()}%`, type, type, status, status);
  res.json({ units: rows });
});

router.post('/units', requireAuth, requireRole(ROLES.ADMINISTRATOR), (req, res) => {
  const { code, name, parent_faculty, type, head_name, bsi_account, bsi_bank_name, pagu_allocated, status } = req.body || {};
  if (!code || !name) return res.status(400).json({ message: 'Kode unit dan nama satuan kerja wajib diisi.' });
  const db = getDb();
  const exists = db.prepare('SELECT id FROM units WHERE code = ?').get(code);
  if (exists) return res.status(409).json({ message: 'Kode unit sudah terdaftar.' });

  const info = db.prepare(`
    INSERT INTO units (code, name, parent_faculty, type, head_name, bsi_account, bsi_bank_name, pagu_allocated, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    code, name, parent_faculty || '', type || 'Program Studi', head_name || '',
    bsi_account || '', bsi_bank_name || 'BSI Virtual Account Operasional', Number(pagu_allocated || 0), status || 'aktif'
  );
  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Unit/Prodi', action: 'create', title: `Tambah satuan kerja ${name}`, ipAddress: req.ip });
  res.status(201).json({ unit: db.prepare('SELECT * FROM units WHERE id = ?').get(info.lastInsertRowid) });
});

router.put('/units/:id', requireAuth, requireRole(ROLES.ADMINISTRATOR), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM units WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Satuan kerja tidak ditemukan.' });
  const { name, parent_faculty, type, head_name, bsi_account, bsi_bank_name, pagu_allocated, status } = req.body || {};
  db.prepare(`
    UPDATE units
    SET name = COALESCE(?, name), parent_faculty = COALESCE(?, parent_faculty), type = COALESCE(?, type),
        head_name = COALESCE(?, head_name), bsi_account = COALESCE(?, bsi_account),
        bsi_bank_name = COALESCE(?, bsi_bank_name), pagu_allocated = COALESCE(?, pagu_allocated),
        status = COALESCE(?, status)
    WHERE id = ?
  `).run(name ?? null, parent_faculty ?? null, type ?? null, head_name ?? null, bsi_account ?? null, bsi_bank_name ?? null, pagu_allocated ?? null, status ?? null, req.params.id);
  res.json({ unit: db.prepare('SELECT * FROM units WHERE id = ?').get(req.params.id) });
});

router.delete('/units/:id', requireAuth, requireRole(ROLES.ADMINISTRATOR), (req, res) => {
  const info = getDb().prepare('DELETE FROM units WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'Satuan kerja tidak ditemukan.' });
  res.json({ message: 'Satuan kerja dihapus.' });
});

// Budget Periods
router.get('/periods', requireAuth, (req, res) => {
  const { q = '', status = '' } = req.query;
  const rows = getDb().prepare(`
    SELECT * FROM budget_periods
    WHERE (? = '' OR LOWER(code || ' ' || academic_year || ' ' || label) LIKE ?)
      AND (? = '' OR status = ?)
    ORDER BY start_date DESC
  `).all(q, `%${String(q).toLowerCase()}%`, status, status);
  res.json({ periods: rows });
});

router.post('/periods', requireAuth, requireRole(ROLES.ADMINISTRATOR), (req, res) => {
  const { code, academic_year, semester, label, status, start_date, end_date, rkat_deadline, lpj_deadline } = req.body || {};
  if (!code || !academic_year || !semester || !start_date || !end_date) {
    return res.status(400).json({ message: 'Data periode anggaran belum lengkap.' });
  }
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO budget_periods (code, academic_year, semester, label, status, start_date, end_date, rkat_deadline, lpj_deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(code, academic_year, semester, label || `TA ${academic_year} ${semester}`, status || 'draf', start_date, end_date, rkat_deadline || end_date, lpj_deadline || end_date);
  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Periode Anggaran', action: 'create', title: `Tambah periode ${code}`, ipAddress: req.ip });
  res.status(201).json({ period: db.prepare('SELECT * FROM budget_periods WHERE id = ?').get(info.lastInsertRowid) });
});

router.put('/periods/:id', requireAuth, requireRole(ROLES.ADMINISTRATOR), (req, res) => {
  const db = getDb();
  const { status, rkat_deadline, lpj_deadline, label } = req.body || {};
  const info = db.prepare(`
    UPDATE budget_periods
    SET status = COALESCE(?, status), rkat_deadline = COALESCE(?, rkat_deadline),
        lpj_deadline = COALESCE(?, lpj_deadline), label = COALESCE(?, label)
    WHERE id = ?
  `).run(status ?? null, rkat_deadline ?? null, lpj_deadline ?? null, label ?? null, req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'Periode anggaran tidak ditemukan.' });
  res.json({ period: db.prepare('SELECT * FROM budget_periods WHERE id = ?').get(req.params.id) });
});

// Budget Categories
router.get('/categories', requireAuth, (req, res) => {
  const { q = '', pillar = '' } = req.query;
  const rows = getDb().prepare(`
    SELECT * FROM budget_categories
    WHERE (? = '' OR LOWER(code || ' ' || name) LIKE ?)
      AND (? = '' OR pillar = ?)
    ORDER BY code ASC
  `).all(q, `%${String(q).toLowerCase()}%`, pillar, pillar);
  res.json({ categories: rows });
});

router.post('/categories', requireAuth, requireRole(ROLES.ADMINISTRATOR, ROLES.BKPU), (req, res) => {
  const { code, name, pillar, spend_category, plafon, status } = req.body || {};
  if (!code || !name) return res.status(400).json({ message: 'Kode akun dan nama kategori wajib diisi.' });
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO budget_categories (code, name, pillar, spend_category, plafon, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(code, name, pillar || 'Pilar Pendidikan', spend_category || 'Lain-lain', Number(plafon || 0), status || 'aktif');
  res.status(201).json({ category: db.prepare('SELECT * FROM budget_categories WHERE id = ?').get(info.lastInsertRowid) });
});

router.put('/categories/:id', requireAuth, requireRole(ROLES.ADMINISTRATOR, ROLES.BKPU), (req, res) => {
  const db = getDb();
  const { name, pillar, spend_category, plafon, status } = req.body || {};
  const info = db.prepare(`
    UPDATE budget_categories
    SET name = COALESCE(?, name), pillar = COALESCE(?, pillar),
        spend_category = COALESCE(?, spend_category), plafon = COALESCE(?, plafon), status = COALESCE(?, status)
    WHERE id = ?
  `).run(name ?? null, pillar ?? null, spend_category ?? null, plafon ?? null, status ?? null, req.params.id);
  if (!info.changes) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
  res.json({ category: db.prepare('SELECT * FROM budget_categories WHERE id = ?').get(req.params.id) });
});

// SBM Tariffs
router.get('/sbm', requireAuth, (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM sbm_tariffs ORDER BY id ASC').all();
  res.json({ tariffs: rows });
});

router.post('/sbm', requireAuth, requireRole(ROLES.ADMINISTRATOR, ROLES.BKPU), (req, res) => {
  const { component, unit, max_rate, spend_category, year } = req.body || {};
  if (!component || !unit || !(Number(max_rate) > 0)) {
    return res.status(400).json({ message: 'Komponen, satuan, dan batas tarif wajib diisi.' });
  }
  const db = getDb();
  const info = db.prepare(`
    INSERT INTO sbm_tariffs (component, unit, max_rate, spend_category, year)
    VALUES (?, ?, ?, ?, ?)
  `).run(component, unit, Number(max_rate), spend_category || 'Lain-lain', year || '2024');
  res.status(201).json({ tariff: db.prepare('SELECT * FROM sbm_tariffs WHERE id = ?').get(info.lastInsertRowid) });
});

export default router;
