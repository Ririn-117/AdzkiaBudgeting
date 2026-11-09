// DATA CONTOH untuk tampilan. Ganti dengan data dari REST API nanti.
export const BUDGET_SUMMARY = {
  pagu: 650000000,
  diajukan: 480000000,
  dicairkan: 210000000,
  terserap: 164000000,
};

export const RECENT_SUBMISSIONS = [
  { id: 'RKAT-2026-014', title: 'Workshop Penguatan Kurikulum OBE', amount: 45000000, status: 'review' },
  { id: 'RKAT-2026-013', title: 'Pengadaan Perangkat Laboratorium', amount: 120000000, status: 'approved' },
  { id: 'RKAT-2026-012', title: 'Seminar Nasional Teknologi Informasi', amount: 75000000, status: 'revision' },
  { id: 'RKAT-2026-011', title: 'Pelatihan Dosen Penulisan Jurnal', amount: 30000000, status: 'draft' },
];

export const STATUS_META = {
  draft: { label: 'Draft', className: 'badge-gray' },
  review: { label: 'Dalam Review', className: 'badge-blue' },
  revision: { label: 'Perlu Revisi', className: 'badge-amber' },
  approved: { label: 'Disetujui', className: 'badge-green' },
};

export const RECENT_ACTIVITIES = [
  { id: 1, text: 'Pengajuan RKAT-2026-013 disetujui BKPU', time: '2 jam lalu' },
  { id: 2, text: 'Pengajuan RKAT-2026-012 diminta revisi', time: 'Kemarin' },
  { id: 3, text: 'File RAB berhasil diimpor', time: '2 hari lalu' },
  { id: 4, text: 'Dana kegiatan Workshop dicairkan sebagian', time: '4 hari lalu' },
];