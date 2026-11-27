// DATA CONTOH untuk halaman Unit/Prodi. Ganti dengan data dari REST API nanti.

export const BASE = '/dashboard/unit';
export const PAGU_TERSEDIA = 164500000;
export const DEFAULT_TA = 'TA 2024/2025 Genap';
export const TA_OPTIONS = ['TA 2024/2025 Genap', 'TA 2023/2024 Ganjil'];

export const CATEGORY_OPTIONS = [
  'Akademik & Kurikulum',
  'Kemahasiswaan',
  'Penelitian & Publikasi',
  'Sarpras & Lab',
  'Pengabdian Masyarakat',
];
export const SPEND_CATEGORIES = ['Honorarium', 'Konsumsi', 'ATK & Bahan', 'Sewa Alat', 'Perjalanan', 'Lain-lain'];
export const REQUIRED_DOCS = ['Proposal', 'KAK/TOR', 'Surat Permohonan'];

/* ===================== PENGAJUAN ===================== */
export const SUBMISSION_STATUS = {
  revisi: { label: 'Perlu Revisi', tone: 'maroon' },
  verifikasi: { label: 'Verifikasi WR II', tone: 'blue' },
  disetujui: { label: 'Disetujui Penuh', tone: 'violet' },
  draft: { label: 'Draft Tersimpan', tone: 'sky' },
  ditolak: { label: 'Ditolak', tone: 'maroon' },
};

export const SUBMISSIONS = [
  {
    id: 'PGMI-2025-004', date: '18 Apr 2025', ta: 'TA 2024/2025 Genap',
    title: 'Workshop Pengembangan Modul Digital & Asesmen Autentik Berbasis AI untuk Guru Madrasah',
    pic: 'Dr. Rahmat Hidayat, M.Pd', category: 'Akademik & Kurikulum', source: 'Pagu Prodi PGMI',
    total: 25000000, status: 'revisi', locked: false,
    note: 'Sesuaikan honorarium narasumber eksternal dengan SBM Kemendikbudristek TA 2024 (maks. Rp 1.500.000/jam).',
  },
  {
    id: 'PGMI-2025-003', date: '15 Apr 2025', ta: 'TA 2024/2025 Genap',
    title: 'Praktek Pengalaman Lapangan (PPL) Mahasiswa PGMI',
    pic: 'Siti Aminah, M.Pd', category: 'Kemahasiswaan', source: 'Pagu Terpusat FTK',
    total: 40500000, status: 'verifikasi', locked: true,
    position: 'BKPU Disetujui (16 Apr) • Antrean Telaah WR2',
  },
  {
    id: 'PGMI-2025-002', date: '04 Apr 2025', ta: 'TA 2024/2025 Genap',
    title: 'Pengadaan Media Pembelajaran Microteaching Lab',
    pic: 'Nurul Hasanah, M.Pd', category: 'Sarpras & Lab', source: 'Pagu Investasi Sarpras',
    total: 65000000, status: 'disetujui', locked: false, phase: 'cairkan',
    position: 'SK: 088/UN-ADZ/KU/2025 • Siap Pencairan T1',
  },
  {
    id: 'PGMI-2025-001', date: '28 Mar 2025', ta: 'TA 2024/2025 Genap',
    title: 'Seminar Nasional Pendidikan Islam & Publikasi Bereputasi',
    pic: 'Ahmad Fauzan, M.Ag', category: 'Penelitian & Publikasi', source: 'Pagu Prodi + Mitra',
    total: 85000000, status: 'disetujui', locked: false, phase: 'lpj',
    position: 'SK: 042/UN-ADZ/KU/2025 • Realisasi 100%',
  },
  {
    id: 'PGMI-2025-005', date: '20 Mar 2025', ta: 'TA 2024/2025 Genap',
    title: 'Review Kurikulum Berbasis OBE',
    pic: 'Dr. Rahmat Hidayat, M.Pd', category: 'Akademik & Kurikulum', source: 'Pagu Prodi PGMI',
    total: 18500000, status: 'disetujui', locked: false, phase: 'lpj',
    position: 'SK: 051/UN-ADZ/KU/2025 • Realisasi 100%',
  },
  {
    id: 'PGMI-2025-006', date: '12 Mar 2025', ta: 'TA 2024/2025 Genap',
    title: 'Seminar Nasional Pendidikan Dasar',
    pic: 'Ahmad Fauzan, M.Ag', category: 'Penelitian & Publikasi', source: 'Pagu Prodi + Mitra',
    total: 41500000, status: 'disetujui', locked: false, phase: 'cairkan',
    position: 'SK: 060/UN-ADZ/KU/2025 • Siap Pencairan T1',
  },
  {
    id: 'PGMI-2025-D02', date: '19 Apr 2025', ta: 'TA 2024/2025 Genap',
    title: 'Pengadaan Media Pembelajaran Kelas', pic: 'Nurul Hasanah, M.Pd',
    category: 'Sarpras & Lab', source: 'Pagu Investasi Sarpras', total: 22000000,
    status: 'draft', locked: false, completeness: 75, completenessNote: '',
  },
  {
    id: 'PGMI-2025-D01', date: '17 Apr 2025', ta: 'TA 2024/2025 Genap',
    title: 'Kuliah Pakar: Inovasi Pembelajaran', pic: 'Hendri Pratama, M.Pd',
    category: 'Akademik & Kurikulum', source: 'Pagu Prodi PGMI', total: 13000000,
    status: 'draft', locked: false, completeness: 40, completenessNote: '(RAB Kosong)',
  },
];

// Rincian RAB contoh untuk halaman detail (dibagi dari total).
export function buildRab(total) {
  const parts = [
    ['Honorarium narasumber & pemateri', 'Honorarium', 0.4],
    ['Konsumsi kegiatan', 'Konsumsi', 0.3],
    ['ATK, modul & sertifikat', 'ATK & Bahan', 0.2],
    ['Sewa perangkat & dokumentasi', 'Sewa Alat', 0.1],
  ];
  return parts.map(([name, cat, share]) => ({ name, cat, subtotal: Math.round(total * share) }));
}

/* ===================== PENCAIRAN ===================== */
export const DISBURSEMENT_SUMMARY = {
  disetujui: { amount: 210000000, programs: 4, sk: 'SK WR2 No. 048/KEP/WR2/2025' },
  dicairkan: { amount: 145000000, percent: 69, stages: '2 Tahap Lunas' },
  proses: { amount: 35000000, note: 'SP2D Terbit: Menunggu Kliring' },
  siap: { amount: 30000000, note: 'Tersedia hingga 30 Apr 2025' },
};

export const DISBURSEMENTS = [
  {
    id: 'PC-2025-006', date: '17 Apr 2025', activity: 'Pengadaan Media Pembelajaran Microteaching Lab',
    ref: 'PGMI-2025-002', unit: 'FTK Adzkia', approved: 65000000, termin: 'Termin 1', terminNote: 'Uang Muka 70%',
    amount: 45500000, receipt: 'Kuitansi No. 104', bank: 'BSI Virtual Account Operasional PGMI',
    account: '8871092831', status: 'proses', statusLabel: 'Proses Kasir / SP2D Terbit',
    statusNote: 'Est. Cair: 21 Apr 2025', sp2d: '0108/SP2D-KU/ADZ/2025',
  },
  {
    id: 'PC-2025-003', date: '02 Feb 2025', activity: 'Seminar Nasional Pendidikan Islam & Publikasi',
    ref: 'PGMI-2025-001', unit: 'Lembaga Penelitian FTK', approved: 85000000, termin: 'Termin 2', terminNote: 'Pelunasan 50%',
    amount: 42500000, receipt: 'Kuitansi No. 062', bank: 'BSI Virtual Account Operasional PGMI',
    account: '8871092831', status: 'cair', statusLabel: 'Telah Dicairkan',
    statusNote: 'Realisasi Kas: 04 Feb 2025', sp2d: '0092/SP2D-KU/ADZ/2025', canLpj: true,
  },
  {
    id: 'PC-2025-001', date: '18 Jan 2025', activity: 'Seminar Nasional Pendidikan Islam & Publikasi',
    ref: 'PGMI-2025-001', unit: 'Lembaga Penelitian FTK', approved: 85000000, termin: 'Termin 1', terminNote: 'Uang Muka 50%',
    amount: 42500000, receipt: 'Kuitansi No. 011', bank: 'BSI Virtual Account Operasional PGMI',
    account: '8871092831', status: 'cair', statusLabel: 'Telah Dicairkan',
    statusNote: 'Realisasi Kas: 20 Jan 2025', sp2d: '0031/SP2D-KU/ADZ/2025',
  },
];

/* ===================== LPJ ===================== */
export const LPJ_SUMMARY = {
  total: { amount: 112500000, cair: 145000000, percent: 77.5 },
  audit: { amount: 42500000, docs: 1 },
  revisi: { amount: 24500000, flagged: 1 },
  verified: { amount: 70000000, final: 2 },
};

export const LPJ_STATUS = {
  draft: { label: 'Draft LPJ', tone: 'navy', dot: true },
  verifikasi: { label: 'Verifikasi SPI', tone: 'blue' },
  revisi: { label: 'Perlu Revisi', tone: 'red' },
  disetujui: { label: 'Disetujui SPI', tone: 'violet' },
};

export const LPJS = [
  {
    id: 'LPJ-2025-004', date: '18 Apr 2025 • 09:40 WIB', chip: 'DRAFT LOKAL', chipTone: 'blue',
    activity: 'Workshop Pengembangan Modul Digital & Asesmen Autentik', ref: 'PGMI-2025-004',
    extra: 'Termin Tunggal', dana: 21000000, realisasi: 20850000, silpa: 150000,
    docs: '4 dari 6 Berkas', progress: 66, docNote: '2 Kuitansi belum diunggah', status: 'draft', action: 'Lanjutkan Input',
  },
  {
    id: 'LPJ-2025-003', date: '12 Apr 2025 • 14:15 WIB', chip: 'TERKIRIM KE AUDIT', chipTone: 'blue',
    activity: 'Seminar Nasional Pendidikan Islam & Publikasi', ref: 'PGMI-2025-001',
    extra: 'Deadline 10 Mei 2025', dana: 42500000, realisasi: 42500000, silpa: 0,
    docs: '14 Dokumen Lengkap', docNote: 'Kuitansi + Faktur + Berita Acara', status: 'verifikasi', action: 'Detail & Bukti',
    spent: 'Terserap 100% (Sisa Rp 0)',
  },
  {
    id: 'LPJ-2025-002', date: '28 Feb 2025 • 16:30 WIB', chip: 'REVISI AUDITOR', chipTone: 'red',
    activity: 'Pengadaan Media Pembelajaran Microteaching Lab', ref: 'PGMI-2025-002',
    extra: 'Sarpras Kampus', dana: 45500000, realisasi: 44900000, silpa: 600000,
    docs: '8 Dokumen (Ada Catatan)', docNote: 'Bukti potong PPh 21 belum distempel mitra percetakan',
    docWarn: true, status: 'revisi', action: 'Perbaiki Bukti',
  },
  {
    id: 'LPJ-2025-001', date: '10 Feb 2025 • 11:05 WIB', chip: 'AUDIT PASSED', chipTone: 'navy',
    activity: 'Pelatihan Penulisan Jurnal Bereputasi', ref: 'PGMI-2024-089',
    extra: 'BAP: 042/BAP-LPJ/ADZ/2025', dana: 35000000, realisasi: 35000000, silpa: 0,
    docs: '12 Dokumen Lengkap', docNote: 'Arsip Disahkan SPI & WR II', status: 'disetujui', action: 'Cetak BAP',
    spent: 'Terserap 100% (Selesai)',
  },
];

/* ===================== NOTIFIKASI ===================== */
export const NOTIF_GROUPS = {
  'hari-ini': { label: 'Hari Ini', date: '12 April 2025', dot: 'maroon' },
  kemarin: { label: 'Kemarin', date: '11 April 2025', dot: 'navy' },
  'pekan-lalu': { label: 'Pekan Lalu', date: 'Awal Periode RKAT', dot: 'sky' },
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1', group: 'hari-ini', cat: 'tindakan', daysAgo: 0, order: 6, unread: true,
    tag: 'PERLU TINDAKAN', tagTone: 'maroon', ref: 'Ref: PGMI-2025-004', time: '25 menit yang lalu', accent: 'maroon', icon: 'alert',
    title: 'Catatan Revisi dari BKPU: Pengajuan Workshop Pengembangan Modul Digital',
    body: 'Verifikator Anggaran (Ahmad Zaky, S.E.) meminta penyesuaian komponen **honorarium narasumber eksternal** agar merujuk ke SBM Kemendikbudristek TA 2024. Pagu usulan melebihi standar Rp 1.500.000/jam. Batas submit revisi: **25 April 2025**.',
    actions: [
      { label: 'Buka & Perbaiki Revisi', to: `${BASE}/pengajuan/PGMI-2025-004`, primary: 'maroon' },
      { label: 'Lihat Catatan Lengkap', to: `${BASE}/pengajuan/PGMI-2025-004` },
    ],
  },
  {
    id: 'n2', group: 'hari-ini', cat: 'keuangan', daysAgo: 0, order: 5, unread: true,
    tag: 'PENCAIRAN KASIR', tagTone: 'navy', ref: 'SP2D: 0092/SP2D-KU/ADZ/2025', time: '2 jam yang lalu', accent: 'slate', icon: 'wallet',
    title: 'Pencairan Dana Termin 2 Berhasil Ditransfer (Kasir Rektorat)',
    body: 'Dana pelaksanaan kegiatan **Seminar Nasional Pendidikan Islam & Publikasi Bereputasi (Ref: PGMI-2025-001)** sebesar **Rp 42.500.000** telah didelegasikan dan masuk ke BSI Virtual Account Operasional PGMI (VA: 988-1002-7721).',
    actions: [
      { label: 'Lihat Bukti Transfer & SP2D', to: `${BASE}/pencairan/PC-2025-003`, primary: 'navy' },
      { label: 'Unduh Kuitansi PDF', toast: 'Unduh kuitansi PDF (simulasi, belum ada berkas dari server).' },
    ],
  },
  {
    id: 'n3', group: 'hari-ini', cat: 'tindakan', daysAgo: 0, order: 4, unread: true,
    tag: 'BATAS WAKTU LPJ', tagTone: 'red', ref: 'Kegiatan Selesai: 28 Maret 2025', time: 'Hari ini, 08:15 WIB', accent: 'red', icon: 'calendar', critical: true,
    title: 'Pengingat Batas Akhir Unggah LPJ: Sisa 22 Hari',
    body: 'Sesuai Standar Operasional Keuangan No. 04/UN-ADZ/PR/2024, kegiatan **Seminar Nasional Pendidikan Islam** wajib melengkapi kuitansi asli bermeterai, BAP, serta daftar hadir peserta maksimal tanggal **10 Mei 2025** sebelum pengajuan berikutnya diproses.',
    actions: [
      { label: 'Unggah Dokumen LPJ Sekarang', to: `${BASE}/laporan-spj/LPJ-2025-003`, primary: 'navy' },
      { label: 'Cek Kelengkapan Berkas', to: `${BASE}/laporan-spj` },
    ],
  },
  {
    id: 'n4', group: 'kemarin', cat: 'keuangan', daysAgo: 1, order: 3, unread: false,
    tag: 'DISETUJUI WR II', tagTone: 'sky', ref: 'SK No: 088/UN-ADZ/KU/2025', time: 'Kemarin, 14:20 WIB', accent: 'navy', icon: 'badge',
    title: 'Persetujuan Usulan Anggaran oleh Wakil Rektor II Bidang Keuangan',
    body: 'Usulan **Pengadaan Media Pembelajaran Microteaching Lab (PGMI-2025-002)** telah ditandatangani secara elektronik dan disetujui penuh dengan total pagu dialokasikan senilai **Rp 65.000.000**.',
    actions: [{ label: 'Lihat Salinan SK & Rincian Mata Anggaran', to: `${BASE}/pengajuan/PGMI-2025-002` }],
  },
  {
    id: 'n5', group: 'pekan-lalu', cat: 'info', daysAgo: 3, order: 2, unread: false,
    tag: 'PENGUMUMAN REKTORAT', tagTone: 'sky', ref: 'Kalender RKAT', time: '3 hari yang lalu', accent: 'gray', icon: 'megaphone',
    title: 'Sistem Telah Membuka Periode Pengusulan RKAT TA 2024/2025 Genap',
    body: 'Pengusulan rencana kerja dan anggaran tahunan resmi dibuka serentak bagi seluruh Fakultas dan Program Studi di lingkungan Universitas Adzkia. Periode entri data modul akan ditutup otomatis pada tanggal 30 April 2025 pukul 23:59 WIB.',
    footnote: 'Disiarkan oleh Biro Perencanaan & Sistem Informasi (BPSI)',
    actions: [],
  },
  {
    id: 'n6', group: 'pekan-lalu', cat: 'info', daysAgo: 5, order: 1, unread: false,
    tag: 'AUDIT KEPATUHAN SPI', tagTone: 'navy', ref: 'LHP-019/SPI-ADZ/2025', time: '5 hari yang lalu', accent: 'navy', icon: 'shield',
    title: 'Hasil Telaah Audit Internal: Evaluasi Realisasi Triwulan I PGMI',
    body: 'Satuan Pengawas Internal (SPI) telah mengunggah Laporan Hasil Pemeriksaan Triwulan I. Kepatuhan pembukuan berkas Prodi PGMI memperoleh predikat "Sangat Patuh (A)" dengan rekomendasi tertib administrasi pada kuitansi sewa transportasi.',
    actions: [{ label: 'Unduh Lembar Rekomendasi SPI', toast: 'Unduh lembar rekomendasi SPI (simulasi, belum ada berkas dari server).' }],
  },
];

/* ===================== IMPORT EXCEL ===================== */
export const IMPORT_COLUMNS = [
  ['A', 'Kode Akun'], ['B', 'Nama Item Belanja'], ['C', 'Volume (Angka)'],
  ['D', 'Satuan Unit'], ['E', 'Harga Satuan (Rp)'], ['F', 'Keterangan / Spek'],
];

export const IMPORT_ROWS = [
  { row: 4, code: '5.2.1.01', name: 'Honor Pemateri Pelatihan Guru', qty: 2, unit: 'Org', price: 2500000 },
  { row: 5, code: '5.2.1.02', name: 'Konsumsi Snack & Makan Siang', qty: 60, unit: 'Kotak', price: 40000 },
  {
    row: 6, code: '', name: 'Spanduk Banner 4×1 Meter', qty: 2, unit: 'Buah', price: null, rawPrice: '[ERROR_FORMAT]',
    level: 'error', message: 'Kode akun belanja kosong dan kolom harga satuan mengandung karakter teks "dua ratus ribu"',
  },
  {
    row: 7, code: '5.2.2.03', name: 'Cetak Panduan Praktikum', qty: 0, unit: 'Eks', price: 35000,
    level: 'warning', message: 'Volume bernilai 0, baris akan diabaikan jika tidak diperbaiki',
  },
  { row: 8, code: '5.2.3.01', name: 'Transport Lokal Panitia Lapangan', qty: 5, unit: 'Orang', price: 150000 },
  { row: 9, code: '5.2.1.03', name: 'Honorarium Moderator Seminar', qty: 2, unit: 'Org', price: 2000000 },
  { row: 10, code: '5.2.2.01', name: 'ATK Peserta Workshop', qty: 60, unit: 'Paket', price: 60000 },
  { row: 11, code: '5.2.2.02', name: 'Sertifikat Peserta', qty: 50, unit: 'Lembar', price: 50000 },
  { row: 12, code: '5.2.3.02', name: 'Sewa Sound System', qty: 3, unit: 'Hari', price: 1000000 },
  { row: 13, code: '5.2.3.03', name: 'Dokumentasi Foto & Video', qty: 1, unit: 'Paket', price: 2000000 },
  { row: 14, code: '5.2.2.04', name: 'Penggandaan Modul', qty: 100, unit: 'Eks', price: 30000 },
  { row: 15, code: '5.2.3.04', name: 'Dekorasi Panggung', qty: 1, unit: 'Paket', price: 2500000 },
];

/* ===================== PROFIL ===================== */
export const PROFILE_FORM = {
  fullName: 'Dr. Rahmat Hidayat, M.Pd',
  nidn: '1024088501 / 198508242011011002',
  rank: 'Pembina (IV/a) / Lektor Kepala',
  employment: 'Dosen Tetap Yayasan (TMT: 01-01-2011)',
  email: 'r.hidayat@adzkia.ac.id',
  phone: '+62 812-6789-0123',
};
export const PROFILE_PREFS = { twofa: true, whatsapp: true, revisi: true };

export const INITIAL_SESSIONS = [
  { id: 's1', device: 'Chrome 122 - macOS', detail: 'IP: 10.15.22.45 (Jaringan Intranet Kampus)', since: 'Aktif sejak: Hari ini, 09:42 WIB', current: true },
  { id: 's2', device: 'Mobile App E-Budgeting', detail: 'Samsung Galaxy S23 (IP: 180.252.88.19)', since: 'Kemarin 21:15', current: false },
];

export const AUDIT_LOG = [
  { id: 'a1', title: 'Pembaruan Rekening Virtual Prodi', meta: '02 April 2025, 14:20 WIB • Oleh Dr. Rahmat H.', tone: 'maroon' },
  { id: 'a2', title: 'Perpanjangan Sertifikat BSrE', meta: '15 Januari 2025, 08:30 WIB • Diverifikasi Puskom', tone: 'slate' },
  { id: 'a3', title: 'Aktivasi 2FA via Authenticator', meta: '02 September 2024, 11:05 WIB • Keamanan Sistem', tone: 'sky' },
  { id: 'a4', title: 'Login dari perangkat baru', meta: '28 Agustus 2024, 19:40 WIB • Mobile App', tone: 'sky' },
];

export const ACCESS_ROWS = [
  ['Daftar & detail pengajuan RKAT', 'Lihat, buat, ubah (sebelum diverifikasi)'],
  ['Import RAB dari Excel', 'Unggah dan konfirmasi'],
  ['Pencairan dana', 'Ajukan pencairan termin'],
  ['Laporan LPJ', 'Buat, unggah bukti, perbaiki revisi'],
  ['Persetujuan anggaran', 'Tidak ada (kewenangan BKPU, WR2, Rektor)'],
];
