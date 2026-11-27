import { api } from './api';
import { DEFAULT_TA } from '../data/unitData';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function formatShortDate(raw) {
  if (!raw) return 'Hari ini';
  const d = new Date(String(raw).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return String(raw);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = MONTHS_SHORT[d.getMonth()];
  const yr = d.getFullYear();
  return `${day} ${mon} ${yr}`;
}

export function formatDateTimeLabel(raw) {
  if (!raw) return 'Hari ini';
  const d = new Date(String(raw).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return String(raw);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = MONTHS_SHORT[d.getMonth()];
  const yr = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${yr} • ${hh}:${mm} WIB`;
}

export function mapSubmissionRow(s) {
  return {
    id: s.code,
    dbId: s.id,
    date: formatShortDate(s.submitted_at || s.created_at),
    ta: s.ta || DEFAULT_TA,
    title: s.title,
    pic: s.pic,
    category: s.category,
    source: s.source || 'Pagu Prodi PGMI',
    total: Number(s.total_amount || 0),
    status: s.status || 'draft',
    workflow_stage: s.workflow_stage || 'draft',
    locked: Boolean(s.locked),
    phase: s.phase || (s.status === 'disetujui' ? 'cairkan' : null),
    position: s.position_label || (s.status === 'verifikasi' ? 'Antrean Verifikasi BKPU' : ''),
    note: s.revision_note || '',
    sk_number: s.sk_number || '',
    completeness: Number(s.completeness ?? 100),
    completenessNote: s.completeness_note || '',
    start_date: s.start_date || '',
    end_date: s.end_date || '',
    background: s.background || '',
    unit_name: s.unit_name || '',
  };
}

export function mapDisbursementRow(d) {
  const rawTermin = String(d.termin || 'Termin 1');
  const [terminPart, notePart] = rawTermin.includes(' - ')
    ? rawTermin.split(' - ')
    : [rawTermin, d.termin_note || ''];
  return {
    id: d.code,
    dbId: d.id,
    date: formatShortDate(d.requested_at || d.created_at),
    activity: d.activity || d.title || '',
    ref: d.ref || d.submission_code || '',
    unit: d.unit_name || 'FTK Adzkia',
    approved: Number(d.approved_amount || d.amount || 0),
    termin: terminPart,
    terminNote: d.termin_note || notePart || 'Pencairan Anggaran',
    amount: Number(d.amount || 0),
    receipt: d.receipt_no || 'Kuitansi menunggu nomor',
    bank: d.bank_name || 'BSI Virtual Account Operasional PGMI',
    account: d.bank_account || '8871092831',
    status: d.status === 'cair' ? 'cair' : 'proses',
    statusLabel: d.status_label || (d.status === 'cair' ? 'Telah Dicairkan' : 'Menunggu Verifikasi Kasir'),
    statusNote: d.status_note || (d.status === 'cair' ? 'Telah ditransfer' : 'Diajukan'),
    sp2d: d.sp2d_number || 'Belum terbit',
    canLpj: d.status === 'cair',
  };
}

export function mapLpjRow(l) {
  const status = l.status || 'draft';
  const chipMap = {
    draft: { chip: 'DRAFT LOKAL', chipTone: 'blue', action: 'Lanjutkan Input' },
    verifikasi: { chip: 'TERKIRIM KE AUDIT', chipTone: 'blue', action: 'Detail & Bukti' },
    revisi: { chip: 'REVISI AUDITOR', chipTone: 'red', action: 'Perbaiki Bukti' },
    disetujui: { chip: 'AUDIT PASSED', chipTone: 'navy', action: 'Cetak BAP' },
  };
  const meta = chipMap[status] || chipMap.draft;
  const silpa = Number(l.silpa_amount || 0);
  return {
    id: l.code,
    dbId: l.id,
    date: formatDateTimeLabel(l.submitted_at || l.created_at),
    chip: meta.chip,
    chipTone: meta.chipTone,
    activity: l.title || l.submission_title || '',
    ref: l.ref || 'PGMI-2025-001',
    extra: l.extra_label || (l.bap_number ? `BAP: ${l.bap_number}` : 'Termin Tunggal'),
    dana: Number(l.dana_dicairkan || 0),
    realisasi: Number(l.realisasi_belanja || 0),
    silpa,
    docs: l.docs_summary || '0 dari 6 Berkas',
    progress: Number(l.progress ?? 0),
    docNote: l.doc_note || 'Belum ada bukti diunggah',
    docWarn: Boolean(l.doc_warn),
    status,
    action: meta.action,
    spent: status === 'disetujui' && silpa === 0 ? 'Terserap 100% (Selesai)' : undefined,
    bap_number: l.bap_number || '',
  };
}

export function mapNotificationRow(n, index = 0) {
  const created = n.created_at ? new Date(String(n.created_at).replace(' ', 'T')) : new Date();
  const diffMs = Math.max(0, Date.now() - created.getTime());
  const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const group = daysAgo === 0 ? 'hari-ini' : daysAgo === 1 ? 'kemarin' : 'pekan-lalu';
  return {
    id: n.id,
    group,
    cat: n.category || 'info',
    daysAgo,
    order: Number(n.id) || 100 - index,
    unread: Boolean(n.unread ?? !n.is_read),
    tag: n.tag || 'INFO',
    tagTone: n.tag_tone || 'sky',
    ref: n.ref_code || '',
    time: formatDateTimeLabel(n.created_at),
    accent: n.accent || 'navy',
    icon: n.icon || 'megaphone',
    critical: Boolean(n.critical),
    title: n.title,
    body: n.body,
    footnote: n.footnote || '',
    actions: Array.isArray(n.actions) ? n.actions : [],
  };
}

/* ===================== API CALLS ===================== */

export async function fetchSubmissions(params = {}) {
  const qs = new URLSearchParams({ size: '200', ...params }).toString();
  const data = await api.get(`/submissions?${qs}`);
  return (data?.submissions || []).map(mapSubmissionRow);
}

export async function fetchSubmissionDetail(idOrCode) {
  const data = await api.get(`/submissions/${encodeURIComponent(idOrCode)}`);
  return {
    submission: mapSubmissionRow(data.submission),
    items: (data.items || []).map((it) => ({
      id: it.id,
      code: it.account_code,
      name: it.name,
      spec: it.spec,
      cat: it.spend_category,
      qty: Number(it.qty || 0),
      unit: it.unit,
      price: Number(it.price || 0),
      subtotal: Number(it.subtotal || 0),
    })),
    documents: data.documents || [],
    timelines: (data.timelines || []).map((t) => ({
      id: t.id,
      title: t.title,
      time: formatShortDate(t.created_at),
      tone: t.tone || 'slate',
      text: t.note || '',
    })),
  };
}

export async function createSubmission({
  name,
  category,
  pic,
  start,
  end,
  background,
  items = [],
  docs = [],
  submit = false,
}) {
  const payload = {
    title: name,
    category,
    pic,
    start_date: start,
    end_date: end,
    background,
    items: items.map((it) => ({
      account_code: it.code || '',
      name: it.name,
      spec: it.spec || '',
      spend_category: it.cat || 'Lain-lain',
      qty: Number(it.qty || 0),
      unit: it.unit || 'Paket',
      price: Number(it.price || 0),
    })),
    submit,
  };
  const data = await api.post('/submissions', payload);
  const created = data.submission;

  // Upload attached PDF File objects if present
  const rawFiles = docs.filter((d) => d.file instanceof File);
  if (rawFiles.length > 0 && created?.code) {
    const fd = new FormData();
    rawFiles.forEach((d) => fd.append('files', d.file));
    fd.append('doc_types', JSON.stringify(rawFiles.map((d) => d.type)));
    try {
      await api.post(`/submissions/${encodeURIComponent(created.code)}/documents`, fd);
    } catch {
      /* dokumen gagal diunggah tetap tidak menggagalkan penyimpanan pengajuan */
    }
  }

  return mapSubmissionRow(created);
}

export async function deleteSubmission(idOrCode) {
  return api.del(`/submissions/${encodeURIComponent(idOrCode)}`);
}

export async function fetchDisbursements() {
  const data = await api.get('/disbursements');
  return {
    rows: (data?.disbursements || []).map(mapDisbursementRow),
    summary: data?.summary || null,
  };
}

export async function fetchDisbursementDetail(idOrCode) {
  const data = await api.get(`/disbursements/${encodeURIComponent(idOrCode)}`);
  return mapDisbursementRow(data.disbursement);
}

export async function createDisbursement({ ref, termin, amount }) {
  const data = await api.post('/disbursements', {
    submission_code: ref,
    termin,
    amount: Number(amount),
  });
  return mapDisbursementRow(data.disbursement);
}

export async function fetchLpjs() {
  const data = await api.get('/lpjs');
  return {
    rows: (data?.lpjs || []).map(mapLpjRow),
    summary: data?.summary || null,
  };
}

export async function fetchLpjDetail(idOrCode) {
  const data = await api.get(`/lpjs/${encodeURIComponent(idOrCode)}`);
  return {
    lpj: mapLpjRow(data.lpj),
    documents: data.documents || [],
    checklist: data.checklist || [],
  };
}

export async function createLpjRequest({ ref }) {
  const data = await api.post('/lpjs', { submission_code: ref });
  return mapLpjRow(data.lpj);
}

export async function submitLpjRequest(idOrCode) {
  const data = await api.post(`/lpjs/${encodeURIComponent(idOrCode)}/submit`);
  return mapLpjRow(data.lpj);
}

export async function parseExcelImport(fileObj) {
  const fd = new FormData();
  fd.append('file', fileObj);
  return api.post('/imports/parse', fd);
}

export async function confirmExcelImport(importId, body = {}) {
  return api.post(`/imports/${encodeURIComponent(importId)}/confirm`, body);
}
