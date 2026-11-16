// DATA CONTOH untuk tampilan. Ganti dengan data dari REST API nanti.
export const PROFILE = {
  fullName: 'Dr. Rahmat Hidayat, M.Pd',
  shortName: 'Dr. Rahmat Hidayat',
  position: 'Kaprodi PGMI',
  unitCode: 'PGMI - FTK',
  faculty: 'Fakultas Tarbiyah & Keguruan',
  prodi: 'Prodi PGMI',
  prodiLong: 'Prodi PGMI - Fak. Tarbiyah & Keguruan',
};

export const PERIOD = { label: 'TA 2024/2025 Genap', status: 'Aktif' };

export const DEADLINE = { date: '30 April 2025', daysLeft: 18 };

export const UNREAD_NOTIFICATIONS = 3;

export const BUDGET = {
  pagu: 450000000,
  diajukan: 285500000,
  disetujui: 210000000,
  dicairkan: 145000000,
};

export const PIPELINE = [
  { key: 'draft', label: 'Draft Usulan', amount: 35000000, countLabel: '2 Usulan', tone: 'draft' },
  { key: 'verif', label: 'Dalam Verifikasi', amount: 40500000, countLabel: '1 Usulan', tone: 'verif' },
  { key: 'revisi', label: 'Perlu Revisi', amount: 25000000, countLabel: '1 Perhatian!', tone: 'revisi' },
  { key: 'setuju', label: 'Disetujui', amount: 210000000, countLabel: '4 Usulan', tone: 'setuju' },
  { key: 'tolak', label: 'Ditolak', amount: 0, countLabel: '0 Usulan', tone: 'tolak' },
];

export const ALERTS = [
  {
    id: 'revisi',
    tone: 'warn',
    title: 'Revisi Pengajuan Anggaran (PGMI-2025-004)',
    before: 'Memerlukan revisi rincian anggaran honorarium sebelum ',
    highlight: '25 April 2025',
    after: ' agar dapat diproses ke tahap pencairan.',
    linkLabel: 'Buka Dokumen Revisi',
    to: '/dashboard/unit-prodi/pengajuan',
  },
  {
    id: 'lpj',
    tone: 'info',
    title: 'Batas Akhir Upload LPJ (PGMI-2025-001)',
    before: 'Kegiatan Seminar Nasional Pendidikan Islam: batas akhir upload berkas LPJ keuangan adalah 10 Mei 2025.',
    highlight: '',
    after: '',
    linkLabel: 'Upload Kelengkapan SPJ',
    to: '/dashboard/unit-prodi/laporan-spj',
  },
];

export const ACTIVITIES = [
  {
    id: 1,
    tone: 'amber',
    title: 'Catatan Revisi Ditambahkan',
    time: '19 Apr, 10:15',
    before: 'Verifikator BKPU (Ahmad Fauzi, S.E.) memberikan catatan penyesuaian pada ',
    strong: 'PGMI-2025-004',
    after: '.',
  },
  {
    id: 2,
    tone: 'green',
    title: 'Pencairan Dana Berhasil',
    time: '17 Apr, 14:30',
    before: 'Dana Termin 2 sebesar Rp 45.000.000 telah dicairkan oleh Biro Keuangan ke rekening kegiatan PGMI.',
    strong: '',
    after: '',
  },
  {
    id: 3,
    tone: 'slate',
    title: 'Persetujuan WR2',
    time: '15 Apr, 09:00',
    before: 'Wakil Rektor II menyetujui pengajuan ',
    strong: 'PGMI-2025-002',
    after: ' (Pengadaan Media Pembelajaran).',
  },
];

export const HELPDESK = {
  office: 'Biro Keuangan & Perencanaan (BKPU)',
  whatsapp: '+62 812-3456-7890',
  email: 'keuangan@adzkia.ac.id',
  address: 'Gedung Rektorat Lt. 2, Kampus Adzkia',
  hours: 'Senin - Jumat (08.00 - 16.00 WIB)',
};