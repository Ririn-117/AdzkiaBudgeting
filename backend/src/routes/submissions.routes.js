import { Router } from 'express';
import { getDb, runTransaction } from '../database/db.js';
import { ROLES, SUBMISSION_STATUS, WORKFLOW_STAGE, REQUIRED_DOCS } from '../config/constants.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadPdf } from '../utils/upload.js';
import { createNotification, logAudit } from '../utils/audit.js';

const router = Router();

function findSubmission(idOrCode) {
  const db = getDb();
  return db.prepare(`
    SELECT s.*, u.name AS unit_name, u.code AS unit_code, bp.label AS ta
    FROM submissions s
    LEFT JOIN units u ON u.id = s.unit_id
    LEFT JOIN budget_periods bp ON bp.id = s.period_id
    WHERE s.code = ? OR s.id = ?
  `).get(idOrCode, Number(idOrCode) || -1);
}

function generateSubmissionCode(db, unitCode = 'UNIT') {
  const prefix = unitCode.includes('pgmi') ? 'PGMI' : unitCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'RKAT';
  const year = new Date().getFullYear();
  const row = db.prepare('SELECT COUNT(*) AS cnt FROM submissions').get();
  return `${prefix}-${year}-${String(row.cnt + 1).padStart(3, '0')}`;
}

// GET /api/submissions
router.get('/', requireAuth, (req, res) => {
  const { q = '', ta = '', status = '', category = '', unit_id = '', page = '1', size = '20' } = req.query;
  const db = getDb();

  let unitFilter = unit_id ? Number(unit_id) : null;
  if (req.user.role === ROLES.UNIT_PRODI && req.user.unit_id) {
    unitFilter = req.user.unit_id;
  }

  const allRows = db.prepare(`
    SELECT s.*, u.name AS unit_name, u.code AS unit_code, bp.label AS ta
    FROM submissions s
    LEFT JOIN units u ON u.id = s.unit_id
    LEFT JOIN budget_periods bp ON bp.id = s.period_id
    WHERE (? IS NULL OR s.unit_id = ?)
      AND (? = '' OR LOWER(s.code || ' ' || s.title || ' ' || s.pic) LIKE ?)
      AND (? = '' OR bp.label = ?)
      AND (? = '' OR s.status = ?)
      AND (? = '' OR s.category = ?)
    ORDER BY s.created_at DESC
  `).all(
    unitFilter, unitFilter,
    q, `%${String(q).toLowerCase()}%`,
    ta, ta,
    status, status,
    category, category
  );

  const p = Math.max(1, Number(page));
  const s = Math.max(1, Number(size));
  const paginated = allRows.slice((p - 1) * s, p * s);

  res.json({
    submissions: paginated,
    total: allRows.length,
    page: p,
    size: s,
    pageCount: Math.max(1, Math.ceil(allRows.length / s)),
  });
});

// GET /api/submissions/summary
router.get('/summary', requireAuth, (req, res) => {
  const db = getDb();
  const unitFilter = req.user.role === ROLES.UNIT_PRODI ? req.user.unit_id : null;
  const rows = db.prepare(`
    SELECT status, COUNT(*) AS count, COALESCE(SUM(total_amount), 0) AS total
    FROM submissions
    WHERE (? IS NULL OR unit_id = ?)
    GROUP BY status
  `).all(unitFilter, unitFilter);

  const byStatus = {};
  let grandTotal = 0;
  let totalCount = 0;
  for (const r of rows) {
    byStatus[r.status] = { count: r.count, total: r.total };
    grandTotal += r.total;
    totalCount += r.count;
  }
  res.json({ totalCount, grandTotal, byStatus });
});

// GET /api/submissions/:idOrCode
router.get('/:idOrCode', requireAuth, (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });

  const db = getDb();
  const items = db.prepare('SELECT * FROM submission_items WHERE submission_id = ? ORDER BY id ASC').all(sub.id);
  const documents = db.prepare('SELECT * FROM submission_documents WHERE submission_id = ? ORDER BY id ASC').all(sub.id);
  const timelines = db.prepare('SELECT * FROM submission_timelines WHERE submission_id = ? ORDER BY id DESC').all(sub.id);

  res.json({ submission: sub, items, documents, timelines });
});

// POST /api/submissions
router.post('/', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), (req, res) => {
  const { title, category, pic, source, start_date, end_date, background, items = [], submit = false, period_id } = req.body || {};
  if (!title || !category || !pic) {
    return res.status(400).json({ message: 'Nama kegiatan, kategori, dan penanggung jawab wajib diisi.' });
  }

  const db = getDb();
  const activePeriod = period_id
    ? db.prepare('SELECT * FROM budget_periods WHERE id = ?').get(period_id)
    : db.prepare("SELECT * FROM budget_periods WHERE status = 'aktif' ORDER BY id DESC LIMIT 1").get();

  const unitId = req.user.unit_id || req.body.unit_id || null;
  const unitRow = unitId ? db.prepare('SELECT * FROM units WHERE id = ?').get(unitId) : null;

  const computedItems = (Array.isArray(items) ? items : []).map((it) => {
    const qty = Number(it.qty || 0);
    const price = Number(it.price || 0);
    return {
      account_code: it.account_code || it.code || '',
      name: String(it.name || '').trim(),
      spec: String(it.spec || '').trim(),
      spend_category: it.spend_category || it.cat || 'Lain-lain',
      qty,
      unit: it.unit || 'Paket',
      price,
      subtotal: qty * price,
    };
  });
  const totalAmount = computedItems.reduce((acc, it) => acc + it.subtotal, 0);

  if (submit) {
    if (computedItems.length === 0) {
      return res.status(400).json({ message: 'Tambahkan minimal satu item anggaran sebelum mengajukan.' });
    }
    if (unitRow && unitRow.pagu_allocated > 0 && totalAmount > unitRow.pagu_allocated) {
      return res.status(400).json({ message: 'Total usulan melebihi pagu unit yang tersedia.' });
    }
  }

  const code = generateSubmissionCode(db, unitRow?.code);
  const status = submit ? SUBMISSION_STATUS.VERIFIKASI : SUBMISSION_STATUS.DRAFT;
  const stage = submit ? WORKFLOW_STAGE.BKPU_REVIEW : WORKFLOW_STAGE.DRAFT;
  const completeness = submit ? 100 : (computedItems.length > 0 ? 75 : 40);

  const created = runTransaction((tx) => {
    const info = tx.prepare(`
      INSERT INTO submissions (
        code, period_id, unit_id, user_id, title, pic, category, source,
        start_date, end_date, background, total_amount, status, workflow_stage,
        locked, position_label, completeness, completeness_note, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      code, activePeriod?.id || null, unitId, req.user.id,
      String(title).trim(), String(pic).trim(), category, source || `Pagu ${unitRow?.name || 'Unit'}`,
      start_date || '', end_date || '', background || '', totalAmount,
      status, stage, submit ? 1 : 0,
      submit ? 'Antrean Verifikasi BKPU' : 'Draft Tersimpan',
      completeness, computedItems.length === 0 ? '(RAB Kosong)' : '',
      submit ? new Date().toISOString() : null
    );
    const subId = info.lastInsertRowid;

    const insertItem = tx.prepare(`
      INSERT INTO submission_items (submission_id, account_code, name, spec, spend_category, qty, unit, price, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const it of computedItems) {
      insertItem.run(subId, it.account_code, it.name, it.spec, it.spend_category, it.qty, it.unit, it.price, it.subtotal);
    }

    tx.prepare(`
      INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      subId, req.user.id, req.user.role,
      submit ? 'submit' : 'draft',
      submit ? 'Diajukan ke BKPU' : 'Draft Disimpan',
      submit ? 'Usulan diajukan dan masuk antrean verifikasi BKPU.' : `Kelengkapan data ${completeness}%.`,
      'slate'
    );

    return subId;
  });

  if (submit) {
    createNotification({
      roleTarget: ROLES.BKPU,
      category: 'tindakan',
      tag: 'USULAN BARU',
      tagTone: 'navy',
      refCode: `Ref: ${code}`,
      title: `Pengajuan Anggaran Baru: ${title}`,
      body: `Unit **${unitRow?.name || 'Prodi'}** mengajukan usulan **${code}** senilai **Rp ${totalAmount.toLocaleString('id-ID')}** untuk diverifikasi.`,
      accent: 'navy',
      icon: 'badge',
    });
  }

  logAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    module: 'Pengajuan',
    action: submit ? 'submit' : 'create_draft',
    title: `${submit ? 'Pengajuan' : 'Draft'} ${code} dibuat`,
    detail: title,
    ipAddress: req.ip,
  });

  res.status(201).json({ submission: findSubmission(created) });
});

// PUT /api/submissions/:idOrCode
router.put('/:idOrCode', requireAuth, (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });
  if (sub.locked) {
    return res.status(409).json({ message: 'Berkas terkunci selama proses verifikasi dan tidak dapat diubah.' });
  }

  const { title, category, pic, source, start_date, end_date, background, items } = req.body || {};
  const db = getDb();

  runTransaction((tx) => {
    let totalAmount = sub.total_amount;
    if (Array.isArray(items)) {
      tx.prepare('DELETE FROM submission_items WHERE submission_id = ?').run(sub.id);
      const insertItem = tx.prepare(`
        INSERT INTO submission_items (submission_id, account_code, name, spec, spend_category, qty, unit, price, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      totalAmount = 0;
      for (const it of items) {
        const qty = Number(it.qty || 0);
        const price = Number(it.price || 0);
        const subtotal = qty * price;
        totalAmount += subtotal;
        insertItem.run(sub.id, it.account_code || it.code || '', it.name, it.spec || '', it.spend_category || it.cat || 'Lain-lain', qty, it.unit || 'Paket', price, subtotal);
      }
    }

    tx.prepare(`
      UPDATE submissions
      SET title = COALESCE(?, title), category = COALESCE(?, category), pic = COALESCE(?, pic),
          source = COALESCE(?, source), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date),
          background = COALESCE(?, background), total_amount = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(title ?? null, category ?? null, pic ?? null, source ?? null, start_date ?? null, end_date ?? null, background ?? null, totalAmount, sub.id);
  });

  res.json({ submission: findSubmission(sub.id) });
});

// DELETE /api/submissions/:idOrCode
router.delete('/:idOrCode', requireAuth, (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });
  if (sub.status !== SUBMISSION_STATUS.DRAFT) {
    return res.status(400).json({ message: 'Hanya pengajuan berstatus draft yang dapat dihapus.' });
  }
  getDb().prepare('DELETE FROM submissions WHERE id = ?').run(sub.id);
  res.json({ message: `Draft ${sub.code} berhasil dihapus.` });
});

// POST /api/submissions/:idOrCode/documents
router.post('/:idOrCode/documents', requireAuth, uploadPdf.array('files', 10), (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Pilih minimal satu berkas PDF.' });
  }

  const db = getDb();
  const docTypes = req.body.doc_types ? (Array.isArray(req.body.doc_types) ? req.body.doc_types : [req.body.doc_types]) : [];
  const insertDoc = db.prepare(`
    INSERT INTO submission_documents (submission_id, doc_type, file_name, file_path, file_size, mime_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const inserted = [];
  req.files.forEach((f, idx) => {
    const docType = docTypes[idx] || REQUIRED_DOCS[idx] || 'Lainnya';
    const fileUrl = `/uploads/documents/${f.filename}`;
    const info = insertDoc.run(sub.id, docType, f.originalname, fileUrl, f.size, f.mimetype);
    inserted.push({ id: info.lastInsertRowid, doc_type: docType, file_name: f.originalname, file_path: fileUrl, file_size: f.size });
  });

  res.status(201).json({ documents: inserted });
});

// POST /api/submissions/:idOrCode/submit (Unit submits draft or revisi)
router.post('/:idOrCode/submit', requireAuth, requireRole(ROLES.UNIT_PRODI, ROLES.ADMINISTRATOR), (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });
  if (![SUBMISSION_STATUS.DRAFT, SUBMISSION_STATUS.REVISI].includes(sub.status)) {
    return res.status(400).json({ message: 'Pengajuan ini sudah dalam proses verifikasi atau selesai.' });
  }

  const db = getDb();
  const itemCount = db.prepare('SELECT COUNT(*) AS cnt FROM submission_items WHERE submission_id = ?').get(sub.id).cnt;
  if (itemCount === 0) {
    return res.status(400).json({ message: 'RAB tidak boleh kosong sebelum diajukan.' });
  }

  runTransaction((tx) => {
    tx.prepare(`
      UPDATE submissions
      SET status = ?, workflow_stage = ?, locked = 1, position_label = 'Antrean Verifikasi BKPU',
          revision_note = '', completeness = 100, completeness_note = '',
          submitted_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).run(SUBMISSION_STATUS.VERIFIKASI, WORKFLOW_STAGE.BKPU_REVIEW, sub.id);

    tx.prepare(`
      INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
      VALUES (?, ?, ?, 'submit', 'Diajukan ke BKPU', 'Usulan diajukan untuk telaah administrasi & SBM oleh BKPU.', 'slate')
    `).run(sub.id, req.user.id, req.user.role);
  });

  createNotification({
    roleTarget: ROLES.BKPU,
    category: 'tindakan',
    tag: 'VERIFIKASI BKPU',
    tagTone: 'navy',
    refCode: `Ref: ${sub.code}`,
    title: `Usulan Menunggu Verifikasi: ${sub.title}`,
    body: `Usulan **${sub.code}** telah diajukan oleh ${req.user.name}.`,
    accent: 'navy',
    icon: 'badge',
  });

  res.json({ message: 'Pengajuan berhasil dikirim ke BKPU.', submission: findSubmission(sub.id) });
});

// POST /api/submissions/:idOrCode/verify (BKPU review)
router.post('/:idOrCode/verify', requireAuth, requireRole(ROLES.BKPU, ROLES.ADMINISTRATOR), (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });

  const { decision, note = '' } = req.body || {};
  if (!['approve', 'revisi', 'reject'].includes(decision)) {
    return res.status(400).json({ message: 'Decision harus approve, revisi, atau reject.' });
  }
  if (decision === 'revisi' && !String(note).trim()) {
    return res.status(400).json({ message: 'Catatan revisi wajib diisi.' });
  }

  runTransaction((tx) => {
    if (decision === 'approve') {
      tx.prepare(`
        UPDATE submissions
        SET status = ?, workflow_stage = ?, locked = 1,
            position_label = 'BKPU Disetujui • Antrean Telaah WR2', updated_at = datetime('now')
        WHERE id = ?
      `).run(SUBMISSION_STATUS.VERIFIKASI, WORKFLOW_STAGE.WR2_REVIEW, sub.id);

      tx.prepare(`
        INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
        VALUES (?, ?, ?, 'verify', 'Verifikasi BKPU Selesai', ?, 'slate')
      `).run(sub.id, req.user.id, req.user.role, note || 'Rincian RAB sesuai SBM Universitas Adzkia. Diteruskan ke WR II.');
    } else if (decision === 'revisi') {
      tx.prepare(`
        UPDATE submissions
        SET status = ?, workflow_stage = ?, locked = 0, revision_note = ?,
            position_label = 'Dikembalikan oleh BKPU (Perlu Revisi)', updated_at = datetime('now')
        WHERE id = ?
      `).run(SUBMISSION_STATUS.REVISI, WORKFLOW_STAGE.REVISI_UNIT, note, sub.id);

      tx.prepare(`
        INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
        VALUES (?, ?, ?, 'revisi', 'Catatan Revisi Ditambahkan', ?, 'amber')
      `).run(sub.id, req.user.id, req.user.role, `Verifikator BKPU: ${note}`);
    } else {
      tx.prepare(`
        UPDATE submissions
        SET status = ?, workflow_stage = ?, locked = 1, revision_note = ?,
            position_label = 'Ditolak oleh BKPU', updated_at = datetime('now')
        WHERE id = ?
      `).run(SUBMISSION_STATUS.DITOLAK, WORKFLOW_STAGE.REJECTED, note, sub.id);

      tx.prepare(`
        INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
        VALUES (?, ?, ?, 'reject', 'Usulan Ditolak', ?, 'maroon')
      `).run(sub.id, req.user.id, req.user.role, note || 'Usulan ditolak pada tahap verifikasi BKPU.');
    }
  });

  if (decision === 'approve') {
    createNotification({
      roleTarget: ROLES.WAKIL_REKTOR_2,
      category: 'tindakan',
      tag: 'TELAAH WR II',
      tagTone: 'navy',
      refCode: `Ref: ${sub.code}`,
      title: `Usulan Lolos Verifikasi BKPU: ${sub.title}`,
      body: `Usulan **${sub.code}** telah diverifikasi BKPU dan menunggu persetujuan Wakil Rektor II.`,
      accent: 'navy',
      icon: 'badge',
    });
  } else {
    createNotification({
      userId: sub.user_id,
      roleTarget: ROLES.UNIT_PRODI,
      category: 'tindakan',
      tag: decision === 'revisi' ? 'PERLU TINDAKAN' : 'DITOLAK',
      tagTone: 'maroon',
      refCode: `Ref: ${sub.code}`,
      title: `${decision === 'revisi' ? 'Catatan Revisi dari BKPU' : 'Pengajuan Ditolak'}: ${sub.title}`,
      body: note || 'Silakan periksa kembali rincian pengajuan Anda.',
      accent: 'maroon',
      icon: 'alert',
    });
  }

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Verifikasi', action: decision, title: `Verifikasi BKPU ${sub.code}: ${decision}`, detail: note, ipAddress: req.ip });
  res.json({ message: `Verifikasi (${decision}) berhasil disimpan.`, submission: findSubmission(sub.id) });
});

// POST /api/submissions/:idOrCode/approve (WR II / Yayasan / Rektor approval)
router.post('/:idOrCode/approve', requireAuth, requireRole(ROLES.WAKIL_REKTOR_2, ROLES.YAYASAN, ROLES.REKTOR, ROLES.ADMINISTRATOR), (req, res) => {
  const sub = findSubmission(req.params.idOrCode);
  if (!sub) return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });

  const { decision, note = '', sk_number = '' } = req.body || {};
  if (!['approve', 'revisi', 'reject'].includes(decision)) {
    return res.status(400).json({ message: 'Decision harus approve, revisi, atau reject.' });
  }

  const generatedSk = sk_number || `${String(sub.id).padStart(3, '0')}/UN-ADZ/KU/${new Date().getFullYear()}`;

  runTransaction((tx) => {
    if (decision === 'approve') {
      tx.prepare(`
        UPDATE submissions
        SET status = ?, workflow_stage = ?, locked = 0, phase = 'cairkan',
            sk_number = ?, position_label = ?, approved_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ?
      `).run(SUBMISSION_STATUS.DISETUJUI, WORKFLOW_STAGE.APPROVED, generatedSk, `SK: ${generatedSk} • Siap Pencairan T1`, sub.id);

      tx.prepare(`
        INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
        VALUES (?, ?, ?, 'approve', 'Persetujuan WR II', ?, 'green')
      `).run(sub.id, req.user.id, req.user.role, `Usulan disetujui penuh. SK: ${generatedSk}. ${note}`.trim());
    } else if (decision === 'revisi') {
      tx.prepare(`
        UPDATE submissions
        SET status = ?, workflow_stage = ?, locked = 0, revision_note = ?,
            position_label = 'Dikembalikan oleh WR II (Perlu Revisi)', updated_at = datetime('now')
        WHERE id = ?
      `).run(SUBMISSION_STATUS.REVISI, WORKFLOW_STAGE.REVISI_UNIT, note, sub.id);

      tx.prepare(`
        INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
        VALUES (?, ?, ?, 'revisi', 'Catatan Revisi WR II', ?, 'amber')
      `).run(sub.id, req.user.id, req.user.role, note || 'Perlu perbaikan sesuai arahan Wakil Rektor II.');
    } else {
      tx.prepare(`
        UPDATE submissions
        SET status = ?, workflow_stage = ?, locked = 1, revision_note = ?,
            position_label = 'Ditolak oleh Pimpinan', updated_at = datetime('now')
        WHERE id = ?
      `).run(SUBMISSION_STATUS.DITOLAK, WORKFLOW_STAGE.REJECTED, note, sub.id);

      tx.prepare(`
        INSERT INTO submission_timelines (submission_id, actor_id, actor_role, action, title, note, tone)
        VALUES (?, ?, ?, 'reject', 'Usulan Ditolak', ?, 'maroon')
      `).run(sub.id, req.user.id, req.user.role, note || 'Usulan ditolak.');
    }
  });

  createNotification({
    userId: sub.user_id,
    roleTarget: ROLES.UNIT_PRODI,
    category: decision === 'approve' ? 'keuangan' : 'tindakan',
    tag: decision === 'approve' ? 'DISETUJUI WR II' : 'PERLU TINDAKAN',
    tagTone: decision === 'approve' ? 'sky' : 'maroon',
    refCode: decision === 'approve' ? `SK No: ${generatedSk}` : `Ref: ${sub.code}`,
    title: decision === 'approve' ? `Persetujuan Usulan Anggaran: ${sub.title}` : `Arahan Revisi/Penolakan: ${sub.title}`,
    body: decision === 'approve'
      ? `Usulan **${sub.code}** disetujui penuh dengan SK **${generatedSk}** senilai **Rp ${Number(sub.total_amount).toLocaleString('id-ID')}**.`
      : note || 'Silakan periksa kembali usulan Anda.',
    accent: decision === 'approve' ? 'navy' : 'maroon',
    icon: decision === 'approve' ? 'badge' : 'alert',
  });

  logAudit({ userId: req.user.id, userName: req.user.name, userRole: req.user.role, module: 'Persetujuan', action: decision, title: `Persetujuan ${sub.code}: ${decision}`, detail: generatedSk, ipAddress: req.ip, tone: 'green' });
  res.json({ message: `Keputusan (${decision}) berhasil disimpan.`, submission: findSubmission(sub.id) });
});

export default router;
