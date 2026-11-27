import { Router } from 'express';
import { getDb } from '../database/db.js';
import { DISBURSEMENT_STATUS, ROLES } from '../config/constants.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadEvidence } from '../utils/upload.js';
import { createNotification, logAudit } from '../utils/audit.js';

const router = Router();

function findDisbursement(idOrCode) {
  return getDb().prepare(`
    SELECT d.*, s.code AS ref, s.title AS activity, s.total_amount AS approved, u.name AS unit_name
    FROM disbursements d
    JOIN submissions s ON s.id = d.submission_id
    LEFT JOIN units u ON u.id = d.unit_id
    WHERE d.code = ? OR d.id = ?
  `).get(idOrCode, Number(idOrCode) || -1);
}

// GET /api/disbursements
router.get('/', requireAuth, (req, res) => {
  const { q = '', status = '', page = '1', size = '20' } = req.query;
  const db = getDb();
  const unitFilter = req.user.role === ROLES.UNIT_PRODI ? req.user.unit_id : null;

  const allRows = db.prepare(`
    SELECT d.*, s.code AS ref, s.title AS activity, s.total_amount AS approved, u.name AS unit_name
    FROM disbursements d
    JOIN submissions s ON s.id = d.submission_id
    LEFT JOIN units u ON u.id = d.unit_id
    WHERE (? IS NULL OR d.unit_id = ?)
      AND (? = '' OR LOWER(d.code || ' ' || s.title || ' ' || s.code) LIKE ?)
      AND (? = '' OR d.status = ?)
    ORDER BY d.created_at DESC
  `).all(unitFilter, unitFilter, q, `%${String(q).toLowerCase()}%`, status, status);

  const approvedTotal = db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) AS amt, COUNT(*) AS programs
    FROM submissions
    WHERE status = 'disetujui' AND (? IS NULL OR unit_id = ?)
  `).get(unitFilter, unitFilter);

  const dicairkanAmt = allRows.filter((r) => r.status === 'cair').reduce((a, r) => a + r.amount, 0);
  const prosesAmt = allRows.filter((r) => r.status === 'proses').reduce((a, r) => a + r.amount, 0);
  const siapAmt = Math.max(0, approvedTotal.amt - dicairkanAmt - prosesAmt);

  const p = Math.max(1, Number(page));
  const s = Math.max(1, Number(size));

  res.json({
    disbursements: allRows.slice((p - 1) * s, p * s),
    total: allRows.length,
    summary: {
      disetujui: { amount: approvedTotal.amt, programs: approvedTotal.programs },
      dicairkan: {
        amount: dicairkanAmt,
        percent: approvedTotal.amt > 0 ? Math.round((dicairkanAmt / approvedTotal.amt) * 100) : 0,
      },
      proses: { amount: prosesAmt },
      siap: { amount: siapAmt },
    },
  });
});

// GET /api/disbursements/:idOrCode
router.get('/:idOrCode', requireAuth, (req, res) => {
  const row = findDisbursement(req.params.idOrCode);
  if (!row) return res.status(404).json({ message: 'Transaksi pencairan tidak ditemukan.' });
  res.json({ disbursement: row });
});

// POST /api/disbursements
router.post('/', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), (req, res) => {
  const { submission_code, submission_id, termin = 'Termin 1 - Uang Muka', amount } = req.body || {};
  const db = getDb();

  const sub = db.prepare(`
    SELECT s.*, u.bsi_account, u.bsi_bank_name
    FROM submissions s
    LEFT JOIN units u ON u.id = s.unit_id
    WHERE s.id = ? OR s.code = ?
  `).get(Number(submission_id) || -1, submission_code || '');

  if (!sub) return res.status(404).json({ message: 'Kegiatan tidak ditemukan.' });
  if (sub.status !== 'disetujui') {
    return res.status(400).json({ message: 'Hanya kegiatan yang sudah disetujui yang dapat diajukan pencairan.' });
  }

  const nominal = Number(amount);
  if (!(nominal > 0)) return res.status(400).json({ message: 'Nominal pencairan harus lebih dari 0.' });

  const existingSum = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM disbursements
    WHERE submission_id = ? AND status != 'ditolak'
  `).get(sub.id).total;

  if (existingSum + nominal > sub.total_amount) {
    return res.status(400).json({
      message: `Nominal melebihi sisa pagu kegiatan yang disetujui (Sisa: Rp ${(sub.total_amount - existingSum).toLocaleString('id-ID')}).`,
    });
  }

  // Termin 2 rule: LPJ Termin 1 must be verified >= 80%
  if (String(termin).toLowerCase().includes('termin 2')) {
    const lpj = db.prepare('SELECT progress, status FROM lpjs WHERE submission_id = ? ORDER BY id DESC LIMIT 1').get(sub.id);
    if (!lpj || (lpj.progress < 80 && lpj.status !== 'disetujui')) {
      return res.status(400).json({
        message: 'Pencairan Termin 2 mensyaratkan LPJ Termin 1 terverifikasi minimal 80%.',
      });
    }
  }

  const [terminPart, terminNotePart = ''] = String(termin).split(' - ');
  const count = db.prepare('SELECT COUNT(*) AS cnt FROM disbursements').get().cnt;
  const code = `PC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

  const info = db.prepare(`
    INSERT INTO disbursements (
      code, submission_id, unit_id, requested_by, termin, termin_note, amount,
      bank_name, bank_account, status, status_label, status_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'proses', 'Menunggu Verifikasi Kasir', 'Diajukan hari ini')
  `).run(
    code, sub.id, sub.unit_id, req.user.id,
    terminPart.trim(), terminNotePart.trim(), nominal,
    sub.bsi_bank_name || 'BSI Virtual Account Operasional',
    sub.bsi_account || '8871092831'
  );

  createNotification({
    roleTarget: ROLES.YAYASAN,
    category: 'keuangan',
    tag: 'PENCAIRAN BARU',
    tagTone: 'navy',
    refCode: `Ref: ${code}`,
    title: `Permohonan Pencairan ${terminPart}: ${sub.title}`,
    body: `Diajukan pencairan senilai **Rp ${nominal.toLocaleString('id-ID')}** untuk **${sub.code}**.`,
    accent: 'navy',
    icon: 'wallet',
  });

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Pencairan', action: 'request', title: `Pengajuan pencairan ${code}`, detail: `Rp ${nominal.toLocaleString('id-ID')}`, ipAddress: req.ip });
  res.status(201).json({ disbursement: findDisbursement(info.lastInsertRowid) });
});

// POST /api/disbursements/:idOrCode/process (Yayasan / BKPU / WR2 issues SP2D & disburses)
router.post('/:idOrCode/process', requireAuth, requireRole(ROLES.YAYASAN, ROLES.BKPU, ROLES.WAKIL_REKTOR_2, ROLES.ADMINISTRATOR), uploadEvidence.single('proof'), (req, res) => {
  let row = findDisbursement(req.params.idOrCode);
  if (!row && req.body?.title) {
    const db = getDb();
    const firstSub = db.prepare('SELECT id, unit_id, user_id FROM submissions ORDER BY id ASC LIMIT 1').get();
    if (firstSub) {
      db.prepare(`
        INSERT INTO disbursements (code, submission_id, unit_id, requested_by, termin, amount, status, status_label)
        VALUES (?, ?, ?, ?, 'Termin 1', ?, 'proses', 'Menunggu Verifikasi Kasir')
      `).run(String(req.params.idOrCode), firstSub.id, firstSub.unit_id, firstSub.user_id, Number(req.body.amount || 0));
      row = findDisbursement(req.params.idOrCode);
    }
  }
  if (!row) return res.status(404).json({ message: 'Transaksi pencairan tidak ditemukan.' });

  const { decision = 'cair', sp2d_number, receipt_no, note } = req.body || {};
  if (![DISBURSEMENT_STATUS.CAIR, DISBURSEMENT_STATUS.PROSES, DISBURSEMENT_STATUS.DITOLAK].includes(decision)) {
    return res.status(400).json({ message: 'Status pencairan harus cair, proses, atau ditolak.' });
  }

  const db = getDb();
  const generatedSp2d = sp2d_number || (row.sp2d_number !== 'Belum terbit' ? row.sp2d_number : `${String(row.id).padStart(4, '0')}/SP2D-KU/ADZ/${new Date().getFullYear()}`);
  const generatedReceipt = receipt_no || (row.receipt_no !== 'Kuitansi menunggu nomor' ? row.receipt_no : `Kuitansi No. ${String(row.id + 100).padStart(3, '0')}`);
  const proofPath = req.file ? `/uploads/lpj/${req.file.filename}` : row.transfer_proof_path;

  const statusLabel = decision === 'cair' ? 'Telah Dicairkan' : decision === 'proses' ? 'Proses Kasir / SP2D Terbit' : 'Ditolak';
  const statusNote = note || (decision === 'cair' ? `Realisasi Kas: ${new Date().toLocaleDateString('id-ID')}` : 'Menunggu kliring');

  db.prepare(`
    UPDATE disbursements
    SET status = ?, status_label = ?, status_note = ?, sp2d_number = ?, receipt_no = ?,
        transfer_proof_path = ?, disbursed_at = CASE WHEN ? = 'cair' THEN datetime('now') ELSE disbursed_at END
    WHERE id = ?
  `).run(decision, statusLabel, statusNote, generatedSp2d, generatedReceipt, proofPath, decision, row.id);

  if (decision === 'cair') {
    db.prepare("UPDATE submissions SET phase = 'lpj' WHERE id = ?").run(row.submission_id);
    createNotification({
      userId: row.requested_by,
      roleTarget: ROLES.UNIT_PRODI,
      category: 'keuangan',
      tag: 'PENCAIRAN KASIR',
      tagTone: 'navy',
      refCode: `SP2D: ${generatedSp2d}`,
      title: `Pencairan Dana ${row.termin} Berhasil Ditransfer`,
      body: `Dana sebesar **Rp ${Number(row.amount).toLocaleString('id-ID')}** untuk **${row.activity}** telah masuk ke ${row.bank_name} (${row.bank_account}).`,
      accent: 'slate',
      icon: 'wallet',
    });
  }

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Pencairan', action: decision, title: `Pencairan ${row.code}: ${statusLabel}`, detail: generatedSp2d, ipAddress: req.ip, tone: 'green' });
  res.json({ message: `Status pencairan diperbarui menjadi ${statusLabel}.`, disbursement: findDisbursement(row.id) });
});

export default router;
