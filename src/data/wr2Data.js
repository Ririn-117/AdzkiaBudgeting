// DATA CONTOH role WR II. Ganti dengan data dari REST API nanti.
export const BASE = '/dashboard/wakil-rektor-2';
export const TA = 'TA 2024/2025 Genap';
export const OTP_THRESHOLD = 20000000;

export const WR2 = {
  name: 'Dr. H. Muhammad Alfian, M.Si', short: 'Dr. H. M. Alfian, M.Si',
  role: 'Wakil Rektor II (Keuangan, Sarpras & SDM)', nip: '197408152002121003', nidn: '0015087401',
  email: 'alfian@adzkia.ac.id', phone: '+62 812-6789-0000', office: 'Gedung Rektorat Kampus Utama Lt. 3',
};

export const POS = {
  menunggu: { label: 'Meja WR II', tone: 'maroon' },
  disetujui: { label: 'Kasir Keuangan', tone: 'blue' },
  revisi: { label: 'Revisi di Unit Pemohon', tone: 'gray' },
  ditolak: { label: 'Arsip Penolakan WR II', tone: 'red' },
};
export const RESULT = {
  setuju: { label: 'Disetujui Penuh', tone: 'sky' },
  bertahap: { label: 'Disetujui Termin 1', tone: 'sky' },
  revisi: { label: 'Minta Revisi', tone: 'amber' },
  tolak: { label: 'Ditolak', tone: 'red' },
};

const pad = (n, l = 2) => String(n).padStart(l, '0');
const FC = [
  ['Prodi S1 Akuntansi Syariah', 'Fakultas EBI (FEBI)', 'FEB'], ['Prodi S1 Sistem Informasi', 'Fakultas TIK (FTIK)', 'TIK'],
  ['Prodi S1 Bahasa Arab', 'Fakultas Tarbiyah (FTK)', 'FTK'], ['Biro Kemahasiswaan', 'Biro Rektorat', 'BAK'],
  ['Lembaga Penjaminan Mutu', 'Unit Layanan', 'LPM'], ['Biro Umum & Logistik', 'Umum & Logistik', 'SPR'],
];
const PROG = ['Workshop Penguatan Kurikulum OBE', 'Seminar Nasional Ekonomi Syariah', 'Pelatihan Dosen Penulisan Jurnal', 'Kuliah Tamu Praktisi Industri', 'Pengadaan Perangkat Laboratorium', 'Persiapan Akreditasi Program Studi', 'Pengabdian Masyarakat Desa Binaan', 'Kompetisi Karya Ilmiah Mahasiswa'];
const PIC = ['Dr. Siti Marlina, M.Pd.', 'Andi Pratama, M.Kom.', 'Yuliana Putri, M.Ak.', 'Ir. Budi Santoso, M.T.', 'Dewi Lestari, M.Hum.'];
const FUND = ['Pagu RKAT Prodi', 'Pagu Sarpras Lab', 'Pagu Riset Internal', 'Pagu Operasional', 'Pagu Perjalanan Dinas'];
const MAK = ['MAK: 521211 (Bahan)', 'MAK: 532111 (Modal Peralatan)', 'MAK: 521219 (Non-Operasional)', 'MAK: 524111 (Perjalanan Dinas)'];

const base = (o) => ({ docs: [3, 3], category: 'Honor & Bahan', ...o });

const QUEUE = [
  base({ id: 'PGMI-2025-004', unit: 'Prodi S1 PGMI', faculty: 'Fakultas Tarbiyah (FTK)', fc: 'FTK', title: 'Workshop Pengembangan Modul Digital & Asesmen Autentik Berbasis AI untuk Guru Madrasah', pic: 'Dr. Rahmat Hidayat, M.Pd', amount: 25000000, mak: MAK[0], fund: 'Pagu Prodi PGMI', date: '16 Apr 2025', time: '09:15', entry: '18 Apr 2025', entryTime: '09:15 WIB', wait: 1, stage: 'menunggu' }),
  base({ id: 'TI-2025-008', unit: 'Prodi S1 TI', faculty: 'Fakultas TIK (FTIK)', fc: 'TIK', title: 'Pengadaan Upgrade Node Server Lab Komputer', pic: 'Fauzan Hakim, M.Kom', amount: 58000000, mak: MAK[1], fund: 'Pagu Sarpras Lab', date: '15 Apr 2025', time: '14:20', entry: '17 Apr 2025', entryTime: '14:20 WIB', wait: 2, stage: 'menunggu', category: 'Belanja Modal' }),
  base({ id: 'LPPM-2025-003', unit: 'Lembaga Riset (LPPM)', faculty: 'Unit Penelitian & Pengabdian', fc: 'LPM', title: 'Hibah Riset Dosen Pemula (10 Judul Terpilih)', pic: 'Prof. Hendra Saputra', amount: 45000000, mak: MAK[2], fund: 'Pagu Riset Internal', date: '15 Apr 2025', time: '16:45', entry: '17 Apr 2025', entryTime: '16:45 WIB', wait: 2, stage: 'menunggu', category: 'Riset & PKM' }),
  base({ id: 'MNJ-2025-012', unit: 'Prodi S1 Manajemen', faculty: 'Fakultas EBI (FEBI)', fc: 'FEB', title: 'Benchmarking Kurikulum MBKM & Kolaborasi Industri', pic: 'Arief Prasetyo, S.E.', amount: 32500000, mak: MAK[3], fund: 'Pagu Perjalanan Dinas', date: '16 Apr 2025', time: '11:05', entry: '18 Apr 2025', entryTime: '11:05 WIB', wait: 1, stage: 'menunggu', category: 'Perjalanan Dinas' }),
];

const CORE_DECIDED = [
  base({ id: 'PGMI-2025-002', unit: 'Prodi PGMI', faculty: 'Fakultas Tarbiyah (FTK)', fc: 'FTK', title: 'Simulasi Visitasi & Konsinyering Akreditasi Internasional', pic: 'Dra. Nurhasanah, M.Pd', amount: 65000000, mak: MAK[0], fund: 'Pagu RKAT Prodi', date: '08 Feb 2025', time: '10:00', stage: 'disetujui', result: 'setuju', sk: '088/UN-ADZ/KU/2025', decidedAt: '18 Feb 2025 14:22 WIB', note: 'Disetujui sesuai telaah BKPU untuk peningkatan sarana akreditasi LAMDIK. Pencairan langsung via termin SPMK.' }),
  base({ id: 'BAAK-2025-002', unit: 'Biro BAAK', faculty: 'Biro Rektorat', fc: 'BAK', title: 'Pencetakan Ijazah, Transkrip & Medali Wisuda Ke-VI', pic: 'Faisal Amri, S.Kom', amount: 18200000, mak: MAK[0], fund: 'Pagu Operasional', date: '03 Feb 2025', time: '09:00', stage: 'disetujui', result: 'setuju', sk: '039/SK-ANGG/UA/2025', decidedAt: '15 Feb 2025 10:40 WIB', note: 'Plafon logistik wisuda disetujui. Pastikan laporan pertanggungjawaban (SPJ) tuntas maksimal 7 hari pasca acara.' }),
  base({ id: 'USUL-2025-076', unit: 'LPPM Adzkia', faculty: 'Unit Penelitian & Pengabdian', fc: 'LPM', title: 'Hibah Pendanaan 12 Judul Riset Terapan', pic: 'Dr. Zulfadli, M.Sc', amount: 45000000, mak: MAK[2], fund: 'Pagu Riset Internal', date: '04 Feb 2025', time: '13:00', stage: 'disetujui', result: 'bertahap', sk: '072/SK-ANGG/UA/2025', decidedAt: '12 Feb 2025 09:15 WIB', note: 'Disetujui pencairan termin ke-1 sebesar 50%. Termin berikutnya cair setelah laporan kemajuan (monev) 70% diserahkan.' }),
  base({ id: 'USUL-2025-084', unit: 'Fakultas Tarbiyah', faculty: 'Pusat Kajian Literasi', fc: 'FTK', title: 'Seminar Internasional Literasi (3 Narasumber)', pic: 'Dr. Mulyadi, M.Pd', amount: 32500000, mak: MAK[3], fund: 'Pagu Perjalanan Dinas', date: '05 Feb 2025', time: '08:30', stage: 'revisi', result: 'revisi', decidedAt: '10 Feb 2025 16:05 WIB', note: 'Penyesuaian tarif honor pembicara luar daerah sesuai plafon SBM Yayasan. Kurangi pos cinderamata.' }),
  base({ id: 'PAI-2025-009', unit: 'Prodi PAI', faculty: 'Fakultas Tarbiyah (FTK)', fc: 'FTK', title: 'Studi Kolaborasi Kelembagaan Kurikulum PAI ke UIN Padang', pic: 'Dr. H. Rusdi Efendi, M.Ag', amount: 5500000, mak: MAK[3], fund: 'Pagu Perjalanan Dinas', date: '04 Feb 2025', time: '10:30', stage: 'revisi', result: 'revisi', decidedAt: '10 Feb 2025 15:30 WIB', note: 'Lengkapi jadwal kunjungan dan rincian perjalanan dinas.' }),
  base({ id: 'USUL-2025-069', unit: 'Biro Sarpras', faculty: 'Umum & Logistik', fc: 'SPR', title: 'Pengadaan Unit Sound System Tambahan Masjid Kampus', pic: 'Hasan Basri, S.T', amount: 24000000, mak: MAK[1], fund: 'Pagu Operasional', date: '01 Feb 2025', time: '11:00', stage: 'ditolak', result: 'tolak', decidedAt: '06 Feb 2025 11:18 WIB', note: 'Item pengadaan tidak tercantum pada RKAT tahun berjalan; alihkan ke pos pemeliharaan Sarpras atau ajukan pada RKAT Perubahan semester ganjil.' }),
];

function makeF(i, stage, amount, result) {
  const [unit, faculty, fc] = FC[i % FC.length];
  const approve = stage === 'disetujui';
  return base({
    id: `${fc}-2025-${pad(100 + i, 3)}`, unit, faculty, fc, title: PROG[i % PROG.length], pic: PIC[i % PIC.length], amount,
    mak: MAK[i % MAK.length], fund: FUND[i % FUND.length], date: `${pad(1 + (i % 27))} Jan 2025`, time: '09:00', stage, result,
    sk: approve ? `${pad(100 + i, 3)}/SK-ANGG/UA/2025` : null,
    decidedAt: `${pad(1 + (i % 27))} Feb 2025 ${pad(8 + (i % 9))}:${pad((i * 7) % 60)} WIB`,
    note: approve ? 'Disetujui sesuai telaah BKPU dan plafon SBM.' : stage === 'revisi' ? 'Lengkapi rincian volume dan dokumen KAK.' : 'Tidak sesuai RKAT tahun berjalan.',
  });
}
const OK_FILL = Array.from({ length: 25 }, (_, i) => makeF(i, 'disetujui', i < 24 ? 57500000 : 57100000, i % 5 === 0 ? 'bertahap' : 'setuju'));
const FIX_FILL = [20000000, 14500000].map((a, i) => makeF(40 + i, 'revisi', a, 'revisi'));
const REJ_FILL = [makeF(50, 'ditolak', 19700000, 'tolak')];

export const INITIAL_SUBMISSIONS = [...QUEUE, ...CORE_DECIDED, ...OK_FILL, ...FIX_FILL, ...REJ_FILL];

export const INITIAL_LOGS = [
  { id: 'l1', tone: 'blue', title: 'Persetujuan Otorisasi Penuh', time: '10:45 WIB', text: 'Usulan HKI-2025-001 (Pendaftaran Paten Prodi Farmasi) senilai Rp 18.000.000 diterbitkan SKOA.' },
  { id: 'l2', tone: 'maroon', title: 'Disposisi Catatan Revisi', time: '09:12 WIB', text: 'Usulan BEM-2025-005 dikembalikan: "Rasionalisasi honor narasumber luar provinsi agar mengacu SBM Adzkia".' },
  { id: 'l3', tone: 'blue', title: 'Persetujuan Disposisi Bertahap', time: 'Kemarin, 16:30', text: 'Usulan SARPRAS-2025-019 (Perbaikan AC Ruang Kuliah Gedung B) senilai Rp 42.000.000 disetujui 2 termin.' },
];

export const FAC_PAGU = [
  ['Fak. Tarbiyah & Keguruan (FTK)', 71, 'Rp 820 Jt', 'Rp 1,15 M'], ['Fak. Teknik & Komputer (FTIK)', 63, 'Rp 610 Jt', 'Rp 960 Jt'],
  ['Fak. Ekonomi & Bisnis Islam (FEBI)', 58, 'Rp 490 Jt', 'Rp 840 Jt'], ['LPPM, LPM & Unit Layanan', 60, 'Rp 530 Jt', 'Rp 870 Jt'],
];

/* ---------- Notifikasi ---------- */
export const INITIAL_NOTIFS = [
  { id: 'w1', cat: 'menunggu', unread: true, order: 6, tag: 'PRIORITAS TINGGI', tone: 'maroon', ref: 'PGMI-2025-004', time: '18 Menit Lalu', title: 'Workshop Pengembangan Modul Digital Berbasis AI', body: 'Usulan belanja sebesar **Rp 25.000.000** telah selesai ditelaah BKPU dan memenuhi ketentuan SBM 2025. Menunggu keputusan definitif pimpinan untuk realisasi.', foot: 'Posisi Dokumen: Di Meja WR II', actions: [{ label: 'Buka Lembar Keputusan', to: `${BASE}/pengajuan/PGMI-2025-004`, primary: true }] },
  { id: 'w2', cat: 'menunggu', unread: true, order: 5, tag: 'MENDEKATI BATAS SLA', tone: 'maroon', ref: 'TI-2025-008', time: '48 Jam Antrean', title: 'Pengadaan Server Lab Komputer Jurusan TI', body: 'Pengajuan senilai **Rp 58.000.000** telah berada di antrean meja WR II selama 48 jam kerja. Disarankan untuk segera diputuskan guna menghindari jeda pengadaan semester baru.', foot: 'SLA Toleransi Rektorat tersisa 6 jam', actions: [{ label: 'Tinjau Item', to: `${BASE}/pengajuan/TI-2025-008` }, { label: 'Disposisi Cepat', to: `${BASE}/pengajuan/TI-2025-008`, primary: true }] },
  { id: 'w3', cat: 'revisi', unread: true, order: 4, tag: 'REVISI TERKIRIM', tone: 'blue', ref: 'Unit Pengusul: PGMI', time: '2 Jam Lalu', title: 'Pembaruan Standar Honorarium Narasumber', body: 'Kaprodi PGMI telah memperbarui rincian tarif honorarium narasumber eksternal sesuai catatan telaah rekomendasi SBM BKPU. Total nilai anggaran disesuaikan menjadi **Rp 18.250.000**.', foot: 'Dokumen lampiran SBM telah diunggah ulang', actions: [{ label: 'Bandingkan Versi', compare: true }] },
  { id: 'w4', cat: 'status', unread: false, order: 3, tag: 'TTE TERVERIFIKASI', tone: 'sky', ref: 'SK No. 042/SK-ANGG/UA/2025', time: '4 Jam Lalu', title: 'Pengesahan SK Pengadaan Media Microteaching Selesai', body: 'Surat Keputusan Otorisasi untuk pengadaan sarana Microteaching senilai **Rp 65.000.000** telah berhasil diterbitkan via TTE BSrE dan otomatis diteruskan ke Kasir Rektorat untuk pencairan termin I.', foot: 'Status: Antrean Transfer Bank Nagari Syariah', actions: [{ label: 'Unduh SK Resmi', toast: 'Unduh SK resmi (simulasi, belum ada berkas dari server).' }] },
  { id: 'w5', cat: 'status', unread: false, order: 2, tag: 'PERINGATAN PAGU', tone: 'gray', ref: 'Fakultas Tarbiyah & Keguruan', time: 'Kemarin, 16:30 WIB', title: 'Ambang Batas Serapan Anggaran Fakultas Terlampaui', body: 'Fakultas Tarbiyah & Keguruan telah mencapai realisasi belanja sebesar **70%** dari total pagu semester genap (Rp 420.000.000 dari total Rp 600.000.000). Usulan belanja berikutnya memerlukan evaluasi cadangan pimpinan.', foot: 'Sisa Pagu Terbuka: Rp 180.000.000', bar: 70, actions: [{ label: 'Buka Analisis Pagu', to: `${BASE}/laporan` }] },
  { id: 'w6', cat: 'menunggu', unread: false, order: 1, tag: 'ANTREAN BARU', tone: 'blue', ref: 'LPPM-2025-003', time: 'Kemarin, 16:45 WIB', title: 'Hibah Riset Dosen Pemula (10 Judul Terpilih)', body: 'Usulan senilai **Rp 45.000.000** lolos telaah BKPU dan masuk ke antrean otorisasi WR II.', foot: 'Lolos Telaah BKPU (SBM Sesuai)', actions: [{ label: 'Tinjau Item', to: `${BASE}/pengajuan/LPPM-2025-003` }] },
];

/* ---------- Laporan ---------- */
export const ENTITIES = [
  ['FTK (Tarbiyah & Keguruan)', 580, 820, 'Fakultas terbesar'], ['FTIK (Teknik & Komputer)', 385, 610, 'Pengadaan IT Lab'],
  ['FEBI (Ekonomi & Bisnis)', 280, 490, 'Seminar & Inkubator'], ['Lembaga & Biro Rektorat', 320.3, 740, 'LPPM, Sarpras, BPM'],
];
export const TREND = [['JAN', 210], ['FEB', 340], ['MAR', 680], ['APR*', 612]];
const MX = [
  ['FTK', 'Prodi Pendidikan Guru Madrasah Ibtidaiyah (PGMI)', 'Fakultas Tarbiyah dan Keguruan', '02.01.04', 380, 310, 295, 275, 'Sangat Baik', 'sky'],
  ['TIK', 'Prodi Teknik Informatika (TI)', 'Fakultas Teknik & Komputer', '03.02.01', 420, 315, 265, 210, 'Moderat', 'gray'],
  ['FEB', 'Prodi Manajemen & Bisnis Syariah', 'Fakultas Ekonomi & Bisnis Islam', '04.01.02', 310, 240, 195, 160, 'Sesuai Tahapan', 'blue'],
  ['LPM', 'Lembaga Penelitian & Pengabdian (LPPM)', 'Lembaga Rektorat', '01.03.01', 290, 265, 210.3, 180, 'Tinggi', 'sky'],
  ['BAK', 'Biro Administrasi Akademik & Kemahasiswaan (BAAK)', 'Biro Rektorat', '01.02.01', 192, 182, 155, 130, 'Tepat Waktu', 'blue'],
  ['SPR', 'Biro Pemeliharaan & Sarana Prasarana (Sarpras)', 'Biro Rektorat', '01.04.03', 250, 230, 195, 95, 'Perlu Akselerasi', 'red'],
];
const MX_FILL = ['Prodi Akuntansi Syariah', 'Prodi Sistem Informasi', 'Prodi Bahasa Arab', 'Biro Kemahasiswaan', 'Lembaga Penjaminan Mutu', 'Biro Umum & Logistik', 'Prodi Hukum Ekonomi Syariah', 'Prodi Farmasi'].map((name, i) => {
  const pagu = 140 + i * 9;
  return [FC[i % FC.length][2], name, FC[i % FC.length][1], `05.0${(i % 9) + 1}.0${(i % 5) + 1}`, pagu, pagu - 20, pagu - 40, Math.round(pagu * (0.4 + (i % 4) * 0.1)), 'Sesuai Tahapan', 'blue'];
});
export const UNITS_MATRIX = [...MX, ...MX_FILL].map(([code, name, fac, kode, pagu, usul, setuju, real, status, tone]) => ({
  code, name, fac, kode, pagu: pagu * 1e6, usul: usul * 1e6, setuju: Math.round(setuju * 1e6), real: real * 1e6, status, tone,
}));