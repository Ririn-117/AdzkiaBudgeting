import fs from 'fs';
import { Router } from 'express';
import * as XLSX from 'xlsx';
import { getDb, runTransaction } from '../database/db.js';
import { IMPORT_COLUMNS, ROLES, SUBMISSION_STATUS, WORKFLOW_STAGE } from '../config/constants.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadExcel } from '../utils/upload.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

function inferSpendCategory(code = '', name = '') {
  const text = `${code} ${name}`.toLowerCase();
  if (text.includes('honor') || text.includes('pemateri') || text.includes('narasumber') || text.includes('moderator')) return 'Honorarium';
  if (text.includes('konsumsi') || text.includes('snack') || text.includes('makan')) return 'Konsumsi';
  if (text.includes('atk') || text.includes('modul') || text.includes('sertifikat') || text.includes('cetak')) return 'ATK & Bahan';
  if (text.includes('sewa') || text.includes('sound') || text.includes('dekorasi') || text.includes('dokumentasi')) return 'Sewa Alat';
  if (text.includes('transport') || text.includes('perjalanan')) return 'Perjalanan';
  return 'Lain-lain';
}

// GET /api/imports/template
router.get('/template', requireAuth, (_req, res) => {
  const wb = XLSX.utils.book_new();
  const data = [
    IMPORT_COLUMNS.map(([, label]) => label),
    ['5.2.1.01', 'Honor Pemateri Pelatihan Guru', 2, 'Org', 2500000, 'Contoh: pemateri eksternal'],
    ['5.2.1.02', 'Konsumsi Snack & Makan Siang', 60, 'Kotak', 40000, 'Paket konsumsi peserta'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Template_RKAT');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Template_RKAT_2024.2.xlsx"');
  res.send(buf);
});

// POST /api/imports/parse
router.post('/parse', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), uploadExcel.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Berkas Excel (.xlsx/.xls) wajib diunggah.' });
  }

  const fileBuffer = fs.readFileSync(req.file.path);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Skip header row (row 1 in Excel)
  const dataRows = rawRows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

  const parsedRows = dataRows.map((cols, idx) => {
    const rowNum = idx + 2;
    const code = String(cols[0] ?? '').trim();
    const name = String(cols[1] ?? '').trim();
    const rawQty = cols[2];
    const unit = String(cols[3] ?? '').trim() || 'Paket';
    const rawPrice = cols[4];
    const spec = String(cols[5] ?? '').trim();

    const qty = Number(rawQty);
    const price = Number(rawPrice);

    const errors = [];
    const warnings = [];

    if (!code) errors.push('Kode akun belanja kosong');
    if (!name) errors.push('Nama item belanja kosong');
    if (rawPrice === '' || Number.isNaN(price) || price < 0) {
      errors.push(`Kolom harga satuan tidak valid ("${rawPrice}")`);
    } else if (price === 0) {
      warnings.push('Harga satuan bernilai 0');
    }

    if (rawQty === '' || Number.isNaN(qty)) {
      errors.push(`Volume tidak valid ("${rawQty}")`);
    } else if (qty <= 0) {
      warnings.push('Volume bernilai 0, baris akan diabaikan jika tidak diperbaiki');
    }

    let level = 'valid';
    let message = null;
    if (errors.length > 0) {
      level = 'error';
      message = errors.join(' dan ');
    } else if (warnings.length > 0) {
      level = 'warning';
      message = warnings.join('; ');
    }

    return {
      row: rowNum,
      code,
      name,
      qty: Number.isNaN(qty) ? 0 : qty,
      unit,
      price: Number.isNaN(price) ? null : price,
      rawPrice: Number.isNaN(price) ? String(rawPrice) : null,
      spec,
      spend_category: inferSpendCategory(code, name),
      subtotal: level === 'valid' ? qty * price : 0,
      level,
      message,
    };
  });

  const validRows = parsedRows.filter((r) => r.level === 'valid');
  const errorCount = parsedRows.filter((r) => r.level === 'error').length;
  const warningCount = parsedRows.filter((r) => r.level === 'warning').length;
  const totalValidAmount = validRows.reduce((acc, r) => acc + r.subtotal, 0);

  const db = getDb();
  const info = db.prepare(`
    INSERT INTO excel_imports (
      user_id, unit_id, file_name, total_rows, valid_rows, error_rows, warning_rows, total_valid_amount, parsed_rows_json, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'parsed')
  `).run(
    req.user.id, req.user.unit_id || null, req.file.originalname,
    parsedRows.length, validRows.length, errorCount, warningCount, totalValidAmount,
    JSON.stringify(parsedRows)
  );

  res.json({
    importId: info.lastInsertRowid,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    stats: {
      total: parsedRows.length,
      valid: validRows.length,
      issues: errorCount + warningCount,
      errors: errorCount,
      warnings: warningCount,
      sum: totalValidAmount,
    },
    rows: parsedRows,
  });
});

// POST /api/imports/:id/confirm
router.post('/:id/confirm', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), (req, res) => {
  const db = getDb();
  const imp = db.prepare('SELECT * FROM excel_imports WHERE id = ?').get(req.params.id);
  if (!imp) return res.status(404).json({ message: 'Data hasil parsing import tidak ditemukan.' });
  if (imp.status === 'confirmed') {
    return res.status(400).json({ message: 'Import ini sudah pernah dikonfirmasi.' });
  }

  const parsedRows = JSON.parse(imp.parsed_rows_json || '[]');
  const validRows = parsedRows.filter((r) => r.level === 'valid');
  if (validRows.length === 0) {
    return res.status(400).json({ message: 'Tidak ada baris valid untuk diimpor.' });
  }

  const { submission_id, title = `Import RKAT (${imp.file_name})`, category = 'Akademik & Kurikulum', pic = req.user.name } = req.body || {};

  const targetSubId = runTransaction((tx) => {
    let subId = submission_id ? Number(submission_id) : null;
    if (!subId) {
      const activePeriod = tx.prepare("SELECT id FROM budget_periods WHERE status = 'aktif' ORDER BY id DESC LIMIT 1").get();
      const count = tx.prepare('SELECT COUNT(*) AS cnt FROM submissions').get().cnt;
      const code = `IMP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
      const info = tx.prepare(`
        INSERT INTO submissions (
          code, period_id, unit_id, user_id, title, pic, category, source,
          total_amount, status, workflow_stage, position_label, completeness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Import Excel', ?, ?, ?, 'Draft Tersimpan', 75)
      `).run(
        code, activePeriod?.id || null, req.user.unit_id || null, req.user.id,
        title, pic, category, imp.total_valid_amount, SUBMISSION_STATUS.DRAFT, WORKFLOW_STAGE.DRAFT
      );
      subId = info.lastInsertRowid;
    }

    const insertItem = tx.prepare(`
      INSERT INTO submission_items (submission_id, account_code, name, spec, spend_category, qty, unit, price, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of validRows) {
      insertItem.run(subId, r.code, r.name, r.spec || '', r.spend_category, r.qty, r.unit, r.price, r.subtotal);
    }

    const newTotal = tx.prepare('SELECT COALESCE(SUM(subtotal), 0) AS total FROM submission_items WHERE submission_id = ?').get(subId).total;
    tx.prepare("UPDATE submissions SET total_amount = ?, updated_at = datetime('now') WHERE id = ?").run(newTotal, subId);
    tx.prepare("UPDATE excel_imports SET status = 'confirmed', submission_id = ? WHERE id = ?").run(subId, imp.id);
    return subId;
  });

  logAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    module: 'Import Excel',
    action: 'confirm',
    title: `Import ${validRows.length} item anggaran dari ${imp.file_name}`,
    ipAddress: req.ip,
    tone: 'green',
  });

  res.json({
    message: `${validRows.length} item valid berhasil diimpor.`,
    submissionId: targetSubId,
  });
});

export default router;
