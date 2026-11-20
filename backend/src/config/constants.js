export const ROLES = {
  UNIT_PRODI: 'unit_prodi',
  BKPU: 'bkpu',
  WAKIL_REKTOR_2: 'wakil_rektor_2',
  YAYASAN: 'yayasan',
  REKTOR: 'rektor',
  ADMINISTRATOR: 'administrator',
};

export const ROLE_LABELS = {
  [ROLES.UNIT_PRODI]: 'Unit / Prodi',
  [ROLES.BKPU]: 'BKPU',
  [ROLES.WAKIL_REKTOR_2]: 'Wakil Rektor II',
  [ROLES.YAYASAN]: 'Yayasan',
  [ROLES.REKTOR]: 'Rektor',
  [ROLES.ADMINISTRATOR]: 'Administrator',
};

export const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  VERIFIKASI: 'verifikasi',
  REVISI: 'revisi',
  DISETUJUI: 'disetujui',
  DITOLAK: 'ditolak',
};

export const WORKFLOW_STAGE = {
  DRAFT: 'draft',
  BKPU_REVIEW: 'bkpu_review',
  REVISI_UNIT: 'revisi_unit',
  WR2_REVIEW: 'wr2_review',
  YAYASAN_REVIEW: 'yayasan_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const DISBURSEMENT_STATUS = {
  PROSES: 'proses',
  CAIR: 'cair',
  DITOLAK: 'ditolak',
};

export const LPJ_STATUS = {
  DRAFT: 'draft',
  VERIFIKASI: 'verifikasi',
  REVISI: 'revisi',
  DISETUJUI: 'disetujui',
};

export const REQUIRED_DOCS = ['Proposal', 'KAK/TOR', 'Surat Permohonan'];

export const LPJ_CHECKLIST = [
  'Kuitansi asli bermeterai',
  'Faktur / nota pembelian',
  'Berita acara kegiatan',
  'Daftar hadir peserta',
  'Bukti potong pajak (PPh)',
  'Dokumentasi kegiatan',
];

export const SPEND_CATEGORIES = [
  'Honorarium',
  'Konsumsi',
  'ATK & Bahan',
  'Sewa Alat',
  'Perjalanan',
  'Lain-lain',
];

export const IMPORT_COLUMNS = [
  ['A', 'Kode Akun'],
  ['B', 'Nama Item Belanja'],
  ['C', 'Volume (Angka)'],
  ['D', 'Satuan Unit'],
  ['E', 'Harga Satuan (Rp)'],
  ['F', 'Keterangan / Spek'],
];
