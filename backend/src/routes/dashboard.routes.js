import { Router } from 'express';
import { getDb } from '../database/db.js';
import { ROLES } from '../config/constants.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard (returns role-tailored dashboard data)
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const role = req.user.role;
  const activePeriod = db.prepare("SELECT * FROM budget_periods WHERE status = 'aktif' ORDER BY id DESC LIMIT 1").get();

  const recentLogs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 6').all();
  const unreadNotifs = db.prepare(`
    SELECT COUNT(*) AS cnt FROM notifications
    WHERE is_read = 0 AND (user_id = ? OR role_target = ?)
  `).get(req.user.id, role).cnt;

  if (role === ROLES.UNIT_PRODI) {
    const unit = req.user.unit_id
      ? db.prepare('SELECT * FROM units WHERE id = ?').get(req.user.unit_id)
      : null;
    const pagu = unit?.pagu_allocated || 450000000;

    const subs = db.prepare('SELECT status, total_amount FROM submissions WHERE (? IS NULL OR unit_id = ?)').all(req.user.unit_id, req.user.unit_id);
    const sumStatus = (st) => subs.filter((s) => s.status === st);
    const diajukan = subs.filter((s) => s.status !== 'draft').reduce((a, s) => a + s.total_amount, 0);
    const disetujui = sumStatus('disetujui').reduce((a, s) => a + s.total_amount, 0);
    const dicairkan = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS amt FROM disbursements
      WHERE status = 'cair' AND (? IS NULL OR unit_id = ?)
    `).get(req.user.unit_id, req.user.unit_id).amt;

    const pipeline = [
      { key: 'draft', label: 'Draft Usulan', amount: sumStatus('draft').reduce((a, s) => a + s.total_amount, 0), count: sumStatus('draft').length, tone: 'draft' },
      { key: 'verif', label: 'Dalam Verifikasi', amount: sumStatus('verifikasi').reduce((a, s) => a + s.total_amount, 0), count: sumStatus('verifikasi').length, tone: 'verif' },
      { key: 'revisi', label: 'Perlu Revisi', amount: sumStatus('revisi').reduce((a, s) => a + s.total_amount, 0), count: sumStatus('revisi').length, tone: 'revisi' },
      { key: 'setuju', label: 'Disetujui', amount: disetujui, count: sumStatus('disetujui').length, tone: 'setuju' },
      { key: 'tolak', label: 'Ditolak', amount: sumStatus('ditolak').reduce((a, s) => a + s.total_amount, 0), count: sumStatus('ditolak').length, tone: 'tolak' },
    ];

    return res.json({
      role,
      period: activePeriod,
      unreadNotifications: unreadNotifs,
      budget: { pagu, diajukan, disetujui, dicairkan, sisa: pagu - diajukan },
      totalUsulan: subs.length,
      pipeline,
      activities: recentLogs,
    });
  }

  if (role === ROLES.BKPU) {
    const queue = db.prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE workflow_stage = 'bkpu_review'").get();
    const lpjQueue = db.prepare("SELECT COUNT(*) AS cnt FROM lpjs WHERE status = 'verifikasi'").get().cnt;
    const revisiCount = db.prepare("SELECT COUNT(*) AS cnt FROM submissions WHERE status = 'revisi'").get().cnt;
    const totalVerified = db.prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE workflow_stage IN ('wr2_review', 'approved')").get();

    return res.json({
      role,
      period: activePeriod,
      unreadNotifications: unreadNotifs,
      stats: {
        antreanVerifikasi: queue.cnt,
        nilaiAntrean: queue.amt,
        antreanAuditLpj: lpjQueue,
        sedangRevisiUnit: revisiCount,
        lolosVerifikasi: totalVerified.cnt,
        nilaiLolosVerifikasi: totalVerified.amt,
      },
      pendingSubmissions: db.prepare("SELECT s.*, u.name AS unit_name FROM submissions s LEFT JOIN units u ON u.id = s.unit_id WHERE s.workflow_stage = 'bkpu_review' ORDER BY s.submitted_at ASC").all(),
      pendingLpjs: db.prepare("SELECT * FROM lpjs WHERE status = 'verifikasi' ORDER BY submitted_at ASC").all(),
      activities: recentLogs,
    });
  }

  if (role === ROLES.WAKIL_REKTOR_2) {
    const wr2Queue = db.prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE workflow_stage = 'wr2_review'").get();
    const approved = db.prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE status = 'disetujui'").get();
    const totalPagu = db.prepare("SELECT COALESCE(SUM(pagu_allocated), 0) AS amt FROM units WHERE status = 'aktif'").get().amt;
    const totalCair = db.prepare("SELECT COALESCE(SUM(amount), 0) AS amt FROM disbursements WHERE status = 'cair'").get().amt;

    return res.json({
      role,
      period: activePeriod,
      unreadNotifications: unreadNotifs,
      stats: {
        totalPaguUniversitas: totalPagu,
        menungguPersetujuan: wr2Queue.cnt,
        nilaiMenunggu: wr2Queue.amt,
        totalDisetujui: approved.amt,
        jumlahDisetujui: approved.cnt,
        totalDicairkan: totalCair,
      },
      pendingApprovals: db.prepare("SELECT s.*, u.name AS unit_name FROM submissions s LEFT JOIN units u ON u.id = s.unit_id WHERE s.workflow_stage = 'wr2_review' ORDER BY s.submitted_at ASC").all(),
      activities: recentLogs,
    });
  }

  if (role === ROLES.YAYASAN) {
    const prosesDisb = db.prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS amt FROM disbursements WHERE status = 'proses'").get();
    const cairDisb = db.prepare("SELECT COUNT(*) AS cnt, COALESCE(SUM(amount), 0) AS amt FROM disbursements WHERE status = 'cair'").get();
    const approvedTotal = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE status = 'disetujui'").get().amt;

    return res.json({
      role,
      period: activePeriod,
      unreadNotifications: unreadNotifs,
      stats: {
        anggaranDisetujui: approvedTotal,
        menungguPencairan: prosesDisb.cnt,
        nilaiMenungguPencairan: prosesDisb.amt,
        totalDicairkan: cairDisb.amt,
        jumlahTransaksiCair: cairDisb.cnt,
        sisaKewajibanCair: Math.max(0, approvedTotal - cairDisb.amt),
      },
      pendingDisbursements: db.prepare("SELECT d.*, s.code AS ref, s.title AS activity FROM disbursements d JOIN submissions s ON s.id = d.submission_id WHERE d.status = 'proses' ORDER BY d.requested_at ASC").all(),
      activities: recentLogs,
    });
  }

  if (role === ROLES.REKTOR) {
    const totalPagu = db.prepare("SELECT COALESCE(SUM(pagu_allocated), 0) AS amt FROM units WHERE status = 'aktif'").get().amt;
    const totalDiajukan = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE status != 'draft'").get().amt;
    const totalDisetujui = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS amt FROM submissions WHERE status = 'disetujui'").get().amt;
    const totalCair = db.prepare("SELECT COALESCE(SUM(amount), 0) AS amt FROM disbursements WHERE status = 'cair'").get().amt;
    const totalRealisasiLpj = db.prepare("SELECT COALESCE(SUM(realisasi_belanja), 0) AS amt FROM lpjs WHERE status = 'disetujui'").get().amt;
    const unitSummary = db.prepare(`
      SELECT u.id, u.code, u.name, u.pagu_allocated,
             COALESCE(SUM(CASE WHEN s.status = 'disetujui' THEN s.total_amount ELSE 0 END), 0) AS disetujui
      FROM units u
      LEFT JOIN submissions s ON s.unit_id = u.id
      GROUP BY u.id
      ORDER BY u.pagu_allocated DESC
    `).all();

    return res.json({
      role,
      period: activePeriod,
      unreadNotifications: unreadNotifs,
      stats: {
        totalPagu,
        totalDiajukan,
        totalDisetujui,
        totalDicairkan: totalCair,
        totalRealisasiLpj,
        serapanPersen: totalPagu > 0 ? Number(((totalCair / totalPagu) * 100).toFixed(1)) : 0,
      },
      unitSummary,
      activities: recentLogs,
    });
  }

  // ADMINISTRATOR
  const totalUsers = db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
  const activeUsers = db.prepare("SELECT COUNT(*) AS cnt FROM users WHERE status = 'aktif'").get().cnt;
  const logs24h = db.prepare("SELECT COUNT(*) AS cnt FROM audit_logs WHERE created_at >= datetime('now', '-1 day')").get().cnt;
  const roleDist = db.prepare('SELECT role, COUNT(*) AS count FROM users GROUP BY role').all();

  return res.json({
    role,
    period: activePeriod,
    unreadNotifications: unreadNotifs,
    stats: {
      totalUsers,
      activeUsers,
      activePercent: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      systemRoles: 6,
      logs24h,
    },
    roleDistribution: roleDist,
    activities: recentLogs,
  });
});

export default router;
