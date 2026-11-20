import { Router } from 'express';
import { getDb } from '../database/db.js';
import { LPJ_CHECKLIST, LPJ_STATUS, ROLES } from '../config/constants.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadEvidence } from '../utils/upload.js';
import { createNotification, logAudit } from '../utils/audit.js';

const router = Router();

function findLpj(idOrCode) {
  return getDb().prepare(`
    SELECT l.*, s.code AS ref, u.name AS unit_name
    FROM lpjs l
    JOIN submissions s ON s.id = l.submission_id
    LEFT JOIN units u ON u.id = l.unit_id
    WHERE l.code = ? OR l.id = ?
  `).get(idOrCode, Number(idOrCode) || -1);
}

// GET /api/lpjs
router.get('/', requireAuth, (req, res) => {
  const { q = '', status = '', page = '1', size = '20' } = req.query;
  const db = getDb();
  const unitFilter = req.user.role === ROLES.UNIT_PRODI ? req.user.unit_id : null;

  const allRows = db.prepare(`
    SELECT l.*, s.code AS ref, u.name AS unit_name
    FROM lpjs l
    JOIN submissions s ON s.id = l.submission_id
    LEFT JOIN units u ON u.id = l.unit_id
    WHERE (? IS NULL OR l.unit_id = ?)
      AND (? = '' OR LOWER(l.code || ' ' || l.title || ' ' || s.code) LIKE ?)
      AND (? = '' OR l.status = ?)
    ORDER BY l.created_at DESC
  `).all(unitFilter, unitFilter, q, `%${String(q).toLowerCase()}%`, status, status);

  const totalRealisasi = allRows.reduce((a, r) => a + r.realisasi_belanja, 0);
  const totalDana = allRows.reduce((a, r) => a + r.dana_dicairkan, 0);
  const auditRows = allRows.filter((r) => r.status === 'verifikasi');
  const revisiRows = allRows.filter((r) => r.status === 'revisi');
  const verifiedRows = allRows.filter((r) => r.status === 'disetujui');

  const p = Math.max(1, Number(page));
  const s = Math.max(1, Number(size));

  res.json({
    lpjs: allRows.slice((p - 1) * s, p * s),
    total: allRows.length,
    summary: {
      total: { amount: totalRealisasi, cair: totalDana, percent: totalDana > 0 ? Number(((totalRealisasi / totalDana) * 100).toFixed(1)) : 0 },
      audit: { amount: auditRows.reduce((a, r) => a + r.realisasi_belanja, 0), docs: auditRows.length },
      revisi: { amount: revisiRows.reduce((a, r) => a + r.realisasi_belanja, 0), flagged: revisiRows.length },
      verified: { amount: verifiedRows.reduce((a, r) => a + r.realisasi_belanja, 0), final: verifiedRows.length },
    },
  });
});

// GET /api/lpjs/:idOrCode
router.get('/:idOrCode', requireAuth, (req, res) => {
  const row = findLpj(req.params.idOrCode);
  if (!row) return res.status(404).json({ message: 'Laporan LPJ tidak ditemukan.' });
  const documents = getDb().prepare('SELECT * FROM lpj_documents WHERE lpj_id = ? ORDER BY id ASC').all(row.id);
  const uploadedSet = new Set(documents.map((d) => d.checklist_item));
  const checklist = LPJ_CHECKLIST.map((item) => ({
    item,
    uploaded: uploadedSet.has(item),
    documents: documents.filter((d) => d.checklist_item === item),
  }));
  res.json({ lpj: row, documents, checklist });
});

// POST /api/lpjs
router.post('/', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), (req, res) => {
  const { submission_code, submission_id, extra_label = 'Termin Tunggal' } = req.body || {};
  const db = getDb();
  const sub = db.prepare('SELECT * FROM submissions WHERE id = ? OR code = ?').get(Number(submission_id) || -1, submission_code || '');
  if (!sub) return res.status(404).json({ message: 'Kegiatan tidak ditemukan.' });
  if (sub.status !== 'disetujui') {
    return res.status(400).json({ message: 'Hanya kegiatan yang sudah disetujui yang dapat dibuatkan LPJ.' });
  }

  const disbursed = db.prepare("SELECT COALESCE(SUM(amount), 0) AS amt FROM disbursements WHERE submission_id = ? AND status = 'cair'").get(sub.id).amt;
  const count = db.prepare('SELECT COUNT(*) AS cnt FROM lpjs').get().cnt;
  const code = `LPJ-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

  const info = db.prepare(`
    INSERT INTO lpjs (
      code, submission_id, unit_id, user_id, title, extra_label,
      dana_dicairkan, realisasi_belanja, silpa_amount, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'draft')
  `).run(code, sub.id, sub.unit_id, req.user.id, sub.title, extra_label, disbursed, disbursed);

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'LPJ', action: 'create', title: `Draft LPJ ${code} dibuat`, ipAddress: req.ip });
  res.status(201).json({ lpj: findLpj(info.lastInsertRowid) });
});

// PUT /api/lpjs/:idOrCode
router.put('/:idOrCode', requireAuth, (req, res) => {
  const row = findLpj(req.params.idOrCode);
  if (!row) return res.status(404).json({ message: 'Laporan LPJ tidak ditemukan.' });
  if (row.status === LPJ_STATUS.DISETUJUI) {
    return res.status(400).json({ message: 'LPJ yang sudah disetujui final tidak dapat diubah.' });
  }

  const { realisasi_belanja, silpa_amount, extra_label } = req.body || {};
  const realisasi = realisasi_belanja !== undefined ? Number(realisasi_belanja) : row.realisasi_belanja;
  const silpa = silpa_amount !== undefined ? Number(silpa_amount) : Math.max(0, row.dana_dicairkan - realisasi);

  getDb().prepare(`
    UPDATE lpjs
    SET realisasi_belanja = ?, silpa_amount = ?, extra_label = COALESCE(?, extra_label), updated_at = datetime('now')
    WHERE id = ?
  `).run(realisasi, silpa, extra_label ?? null, row.id);

  res.json({ lpj: findLpj(row.id) });
});

// POST /api/lpjs/:idOrCode/documents
router.post('/:idOrCode/documents', requireAuth, uploadEvidence.single('file'), (req, res) => {
  const row = findLpj(req.params.idOrCode);
  if (!row) return res.status(404).json({ message: 'Laporan LPJ tidak ditemukan.' });
  if (!req.file) return res.status(400).json({ message: 'Berkas bukti wajib diunggah.' });

  const checklistItem = req.body.checklist_item || LPJ_CHECKLIST[0];
  const fileUrl = `/uploads/lpj/${req.file.filename}`;
  const db = getDb();

  db.prepare(`
    INSERT INTO lpj_documents (lpj_id, checklist_item, file_name, file_path, file_size, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(row.id, checklistItem, req.file.originalname, fileUrl, req.file.size, req.body.note || '');

  const distinctItems = db.prepare('SELECT COUNT(DISTINCT checklist_item) AS cnt FROM lpj_documents WHERE lpj_id = ?').get(row.id).cnt;
  const progress = Math.min(100, Math.round((distinctItems / LPJ_CHECKLIST.length) * 100));
  const docsSummary = `${distinctItems} dari ${LPJ_CHECKLIST.length} Berkas`;

  db.prepare(`
    UPDATE lpjs
    SET progress = ?, docs_summary = ?, doc_note = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(progress, docsSummary, progress === 100 ? 'Seluruh berkas wajib terunggah' : `${LPJ_CHECKLIST.length - distinctItems} berkas belum diunggah`, row.id);

  res.status(201).json({ message: 'Bukti LPJ berhasil diunggah.', lpj: findLpj(row.id) });
});

// POST /api/lpjs/:idOrCode/submit
router.post('/:idOrCode/submit', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), (req, res) => {
  const row = findLpj(req.params.idOrCode);
  if (!row) return res.status(404).json({ message: 'Laporan LPJ tidak ditemukan.' });
  if (![LPJ_STATUS.DRAFT, LPJ_STATUS.REVISI].includes(row.status)) {
    return res.status(400).json({ message: 'LPJ sudah dikirim untuk audit.' });
  }

  getDb().prepare(`
    UPDATE lpjs
    SET status = 'verifikasi', doc_warn = 0, submitted_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(row.id);

  createNotification({
    roleTarget: ROLES.BKPU,
    category: 'tindakan',
    tag: 'AUDIT LPJ',
    tagTone: 'navy',
    refCode: `Ref: ${row.code}`,
    title: `LPJ Menunggu Verifikasi SPI/BKPU: ${row.title}`,
    body: `Laporan pertanggungjawaban **${row.code}** telah dikirim oleh unit pelaksana.`,
    accent: 'navy',
    icon: 'shield',
  });

  res.json({ message: 'LPJ berhasil dikirim untuk verifikasi SPI/BKPU.', lpj: findLpj(row.id) });
});

// POST /api/lpjs/:idOrCode/verify
router.post('/:idOrCode/verify', requireAuth, requireRole(ROLES.BKPU, ROLES.WAKIL_REKTOR_2, ROLES.ADMINISTRATOR), (req, res) => {
  const row = findLpj(req.params.idOrCode);
  if (!row) return res.status(404).json({ message: 'Laporan LPJ tidak ditemukan.' });

  const { decision, note = '', bap_number = '' } = req.body || {};
  if (!['approve', 'revisi'].includes(decision)) {
    return res.status(400).json({ message: 'Decision harus approve atau revisi.' });
  }

  const db = getDb();
  if (decision === 'approve') {
    const bap = bap_number || `${String(row.id).padStart(3, '0')}/BAP-LPJ/ADZ/${new Date().getFullYear()}`;
    db.prepare(`
      UPDATE lpjs
      SET status = 'disetujui', bap_number = ?, extra_label = ?, doc_note = 'Arsip Disahkan SPI & WR II',
          doc_warn = 0, progress = 100, verified_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).run(bap, `BAP: ${bap}`, row.id);
  } else {
    if (!String(note).trim()) return res.status(400).json({ message: 'Catatan revisi auditor wajib diisi.' });
    db.prepare(`
      UPDATE lpjs
      SET status = 'revisi', doc_note = ?, doc_warn = 1, updated_at = datetime('now')
      WHERE id = ?
    `).run(note, row.id);
  }

  createNotification({
    userId: row.user_id,
    roleTarget: ROLES.UNIT_PRODI,
    category: decision === 'approve' ? 'keuangan' : 'tindakan',
    tag: decision === 'approve' ? 'LPJ DISETUJUI' : 'REVISI LPJ',
    tagTone: decision === 'approve' ? 'navy' : 'red',
    refCode: `Ref: ${row.code}`,
    title: decision === 'approve' ? `LPJ Disahkan SPI/BKPU: ${row.title}` : `Perbaikan Bukti LPJ Diperlukan: ${row.title}`,
    body: decision === 'approve' ? `BAP LPJ telah diterbitkan.` : note,
    accent: decision === 'approve' ? 'navy' : 'red',
    icon: decision === 'approve' ? 'badge' : 'alert',
  });

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'LPJ', action: decision, title: `Verifikasi LPJ ${row.code}: ${decision}`, detail: note, ipAddress: req.ip });
  res.json({ message: `Verifikasi LPJ (${decision}) berhasil.`, lpj: findLpj(row.id) });
});

export default router;
