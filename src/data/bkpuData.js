// DATA CONTOH role BKPU. Ganti dengan data dari REST API nanti.
export const BASE = '/dashboard/bkpu';
export const TA = 'TA 2024/2025 Genap';
export const PAGU_UNIVERSITAS = 1615000000;

export const BKPU_PROFILE = {
  name: 'Ahmad Zaky, S.E.',
  nip: '198804152015031002',
  email: 'ahmad.zaky@adzkia.ac.id',
  phone: '+62 813-7455-8901',
  unit: 'Biro Keuangan dan Perencanaan Universitas (BKPU)',
  room: 'Gedung Rektorat Lt. 2, Ruang BKPU',
};

/* ---------- Metadata tampilan ---------- */
export const SLA_META = {
  1: { label: 'Hari ke-1 (SLA Aman)', tone: 'safe' },
  2: { label: 'Hari ke-2 (SLA Wajar)', tone: 'fair' },
  3: { label: 'Hari ke-3 (Tenggat Hari Ini)', tone: 'crit' },
};
export const STAGE_META = {
  antrean: { label: 'Menunggu Telaah', tone: 'blue' },
  ditelaah: { label: 'Sedang Ditelaah', tone: 'violet' },
  wr2: { label: 'Lolos & Diteruskan ke WR II', tone: 'green' },
  perbaikan: { label: 'Dalam Perbaikan Unit', tone: 'amber' },
  ditolak: { label: 'Ditolak / Non-RKAT', tone: 'red' },
};
export const LPJ_STAGE_META = {
  antrean: { label: 'Menunggu Pemeriksaan', tone: 'blue' },
  revisi: { label: 'Perlu Perbaikan', tone: 'amber' },
  sah: { label: 'Sah / BAP Terbit', tone: 'sky' },
};
export const RESULT_META = {
  revisi: { label: 'Revisi Diminta', tone: 'amber' },
  lolos: { label: 'Lolos Telaah WR II', tone: 'green' },
  catatan: { label: 'Catatan Bukti Pajak', tone: 'amber' },
  sah: { label: 'Sah / BAP Terbit', tone: 'green' },
  tolak: { label: 'Ditolak / Non-RKAT', tone: 'red' },
};

export const CATS = [
  'Honor & Konsumsi', 'Belanja Modal / Sarpras', 'Perjalanan Dinas / SPPD', 'Bahan & Perlengkapan', 'Sewa Gedung & Sound',
];
const UNITS = [
  ['Prodi S1 Akuntansi Syariah', 'Fak. Ekonomi & Bisnis Islam', 'AKS'],
  ['Prodi S1 Sistem Informasi', 'Fak. Teknik & Ilmu Komputer', 'SI'],
  ['Prodi S1 Pendidikan Bahasa Arab', 'Fak. Tarbiyah & Keguruan', 'PBA'],
  ['Biro Kemahasiswaan', 'Biro Rektorat', 'BKM'],
  ['Lembaga Penjaminan Mutu', 'Unit Rektorat', 'LPM'],
  ['Prodi S1 Manajemen', 'Fak. Ekonomi & Bisnis Islam', 'MNJ'],
];
const PROGRAMS = [
  'Workshop Penguatan Kurikulum OBE', 'Seminar Nasional Ekonomi Syariah', 'Pelatihan Dosen Penulisan Jurnal',
  'Kuliah Tamu Praktisi Industri', 'Pengadaan Perangkat Laboratorium', 'Persiapan Akreditasi Program Studi',
  'Pengabdian Masyarakat Desa Binaan', 'Kompetisi Karya Ilmiah Mahasiswa',
];
const PICS = ['Dr. Siti Marlina, M.Pd.', 'Andi Pratama, M.Kom.', 'Yuliana Putri, M.Ak.', 'Ir. Budi Santoso, M.T.', 'Dewi Lestari, M.Hum.'];
const pad = (n, l = 2) => String(n).padStart(l, '0');

/* ---------- Pengajuan ---------- */
const CORE = [
  {
    id: 'PGMI-2025-004', unit: 'Prodi S1 PGMI', faculty: 'Fak. Tarbiyah & Keguruan',
    title: 'Workshop Pengembangan Modul Digital & Asesmen Autentik Berbasis AI untuk Guru Madrasah',
    pic: 'Dr. Rahmat Hidayat, M.Pd', category: 'Honor & Konsumsi', amount: 25000000,
    date: '18 Apr 2025', time: '10:42', stage: 'antrean', slaDay: 1, docs: [3, 3], resubmit: true,
    note: 'Unit telah memperbarui SBM honor',
  },
  {
    id: 'TI-2025-008', unit: 'Prodi S1 Teknik Informatika', faculty: 'Fak. Teknik & Ilmu Komputer',
    title: 'Pengadaan Upgrade Node Server Lab Komputer', pic: 'Fauzan Hakim, M.Kom',
    category: 'Belanja Modal / Sarpras', amount: 58000000, date: '16 Apr 2025', time: '11:20',
    stage: 'antrean', slaDay: 3, docs: [3, 3], note: 'Batas SLA tersisa 4 jam kerja',
  },
  {
    id: 'MNJ-2025-012', unit: 'Prodi S1 Manajemen', faculty: 'Fak. Ekonomi & Bisnis Islam',
    title: 'Benchmarking Kurikulum MBKM ke Universitas Mitra', pic: 'Rina Anggraini, S.E., M.M.',
    category: 'Perjalanan Dinas / SPPD', amount: 32500000, date: '17 Apr 2025', time: '15:40',
    stage: 'antrean', slaDay: 2, docs: [2, 3], missingDoc: 'KAK', note: 'Dokumen KAK belum diunggah unit',
  },
  {
    id: 'LPPM-2025-003', unit: 'Lembaga Penelitian (LPPM)', faculty: 'Tingkat Universitas',
    title: 'Hibah Penelitian Dosen Pemula (PDP)', pic: 'Prof. Hendra Saputra, M.Sc.',
    category: 'Bantuan Penelitian Dosen', amount: 45000000, date: '17 Apr 2025', time: '10:11',
    stage: 'ditelaah', slaDay: 2, docs: [3, 3], reviewer: 'Ahmad Zaky, S.E.',
  },
  {
    id: 'BAAK-2025-002', unit: 'Biro Adm. Akademik (BAAK)', faculty: 'Layanan Sentral',
    title: 'Wisuda Sarjana & Magister Periode XI', pic: 'M. Ilham, S.Kom.', category: 'Sewa Gedung & Sound',
    amount: 18200000, date: '18 Apr 2025', time: '08:30', stage: 'antrean', slaDay: 1, docs: [3, 3],
  },
  {
    id: 'PAI-2025-009', unit: 'Prodi S1 PAI', faculty: 'Fak. Tarbiyah & Keguruan',
    title: 'Pelatihan Metodologi Tafsir Tematik', pic: 'Ust. Zulkifli, M.Ag.', category: 'Honorarium Narasumber',
    amount: 5500000, date: '18 Apr 2025', time: '09:05', stage: 'antrean', slaDay: 1, docs: [3, 3],
  },
  {
    id: 'PGMI-2025-002', unit: 'Prodi S1 PGMI', faculty: 'Fak. Tarbiyah & Keguruan',
    title: 'Pengadaan Media Pembelajaran Microteaching', pic: 'Dra. Nurhasanah, M.Pd.',
    category: 'Sarana Praktik', amount: 65000000, date: '27 Feb 2025', time: '14:05', stage: 'wr2',
    slaDay: 1, docs: [3, 3], sk: '042/SK-ANGG/UA/2025',
  },
];

function makeExtra(i, stage, amount) {
  const [unit, faculty, code] = UNITS[i % UNITS.length];
  return {
    id: `${code}-2025-${pad(100 + i, 3)}`, unit, faculty, title: PROGRAMS[i % PROGRAMS.length],
    pic: PICS[i % PICS.length], category: CATS[i % CATS.length], amount,
    date: `${pad(1 + (i % 27))} Mar 2025`, time: `${pad(8 + (i % 9))}:${pad((i * 7) % 60)}`,
    stage, slaDay: 1, docs: [3, 3],
    sk: stage === 'wr2' ? `${100 + i}/SK-ANGG/UA/2025` : null,
    note: stage === 'perbaikan' ? 'Sesuaikan tarif konsumsi dengan SBM' : '',
  };
}
// 27 usulan lolos (jumlah Rp 1.500,3 jt) + 4 usulan perbaikan (jumlah Rp 92,5 jt)
const WR2_EXTRA = Array.from({ length: 27 }, (_, i) => makeExtra(i, 'wr2', i < 26 ? 55000000 : 70300000));
const FIX_EXTRA = [30000000, 25000000, 20000000, 17500000].map((a, i) => makeExtra(40 + i, 'perbaikan', a));
export const INITIAL_SUBMISSIONS = [...CORE, ...WR2_EXTRA, ...FIX_EXTRA];

/* ---------- Detail telaah pengajuan ---------- */
export const CHECKLIST_TEXT = [
  'Proposal lengkap & ditandatangani Dekan FTK',
  'KAK / TOR mencantumkan indikator output jelas',
  'Satuan honor & konsumsi sesuai SBM Rektor 2024',
  'Sisa pagu unit mencukupi (Tersedia: Rp 164,5 Jt)',
  'Rekening giro operasional valid di SIMKEU',
];

const DETAIL_004 = {
  simkeu: '#8942-PGMI', sbmStatus: 'SBM-2025: Lolos Verifikasi Awal',
  entry: '18 April 2025 (10:42 WIB)', periode: TA, pengusul: 'Dr. Rahmat Hidayat, M.Pd (Kaprodi)',
  fullUnit: 'Prodi S1 Pendidikan Guru Madrasah Ibtidaiyah', facultyShort: 'Fakultas Tarbiyah & Keguruan (FTK)',
  schedule: ['15 — 17 Mei 2025', '3 Hari Penuh (Off-site & Lab AI)'],
  participants: ['40 Guru Madrasah', 'Wilayah Kota Padang & Sekitarnya'],
  location: ['Hall Smart Lab FTK', 'Kampus Universitas Adzkia'],
  iku: ['IKU 6: Mutu Kurikulum', 'IKU 9: Kemitraan Strategis'],
  summary:
    'Program ini bertujuan mentransformasi kompetensi pedagogik guru-guru madrasah binaan FTK Adzkia dalam mengintegrasikan AI Generatif untuk modul ajar berdiferensiasi dan instrumen asesmen autentik kurikulum merdeka. Luaran berupa 40 modul ber-ISBN dan MoU kemitraan sekolah laboratorium madrasah.',
  rab: [
    { name: 'Honorarium Narasumber Ahli Kurikulum AI', spec: 'Dr. Ir. Taufik Hidayat, M.Kom (Pakar EdTech Nasional)', qty: 2, unit: 'Sesi', price: 1500000, badge: 'VALID SBM', adj: 'Telah disesuaikan unit dari Rp 2.000.000 ke Rp 1.500.000/sesi' },
    { name: 'Konsumsi Workshop 3 Hari', spec: 'Snack 2x + makan siang x 50 orang (peserta & panitia)', qty: 150, unit: 'Kotak', price: 45000, badge: 'VALID SBM' },
    { name: 'ATK & Modul Cetak Panduan Eksklusif', spec: 'Buku panduan kurikulum AI spiral bound + modul kerja guru', qty: 40, unit: 'Paket', price: 75000, badge: 'VALID' },
    { name: 'Sertifikat Bernomor Resmi & Seminar Kit', spec: 'Tote bag kanvas, pen metal, ID badge & sertifikat ber-barcode 32 JP', qty: 40, unit: 'Set', price: 50000, badge: 'VALID' },
    { name: 'Sewa Smart Display & Sound Lab Khusus', spec: 'Dukungan hardware mirroring layar untuk simulasi prompt engineering', qty: 3, unit: 'Hari', price: 750000, badge: 'VALID' },
    { name: 'Honorarium Panitia Internal & Moderator Sesi', spec: '4 orang panitia pelaksana teknis prodi x Rp 500.000', qty: 4, unit: 'Orang', price: 500000, badge: 'VALID SBM' },
    { name: 'Transport Tiket PP & Akomodasi Narasumber Luar Kota', spec: 'Rute CGK - PDG PP (2 orang narasumber & asisten teknis)', qty: 2, unit: 'Paket PP', price: 3000000, badge: 'TIKET EKONOMI' },
  ],
  pagu: { induk: 210000000, real: 45500000 },
  files: [
    { name: 'Proposal_Workshop_Modul_Digital_PGMI_2025.pdf', size: '1.8 MB', meta: 'Hash SHA-256 Valid', tag: 'TTD Dekan' },
    { name: 'KAK_TermOfReference_PGMI_Adzkia.pdf', size: '850 KB', meta: 'Kriteria Capaian Jelas', tag: 'Lengkap' },
    { name: 'Surat_Pengantar_Dekanat_FTK.pdf', size: '520 KB', meta: 'No. 114/FTK-UA/IV/2025', tag: 'Sah Dekanat' },
  ],
  history: [
    { tone: 'green', title: 'Respon Unit Pelaksana: Perbaikan Telah Diunggah', who: 'Dr. Rahmat Hidayat', time: '18 April 2025 • 10:42 WIB',
      text: '"Terima kasih atas masukan Tim BKPU. Honor narasumber pakar kurikulum AI telah kami sesuaikan dari Rp 2.000.000 menjadi Rp 1.500.000/sesi sesuai SBM SK Rektor No. 42 Tahun 2024. Total anggaran efisien menjadi pas Rp 25.000.000. Mohon dapat dilanjutkan ke Wakil Rektor II."' },
    { tone: 'amber', title: 'Catatan Review BKPU: Permintaan Penyesuaian SBM', who: 'Ahmad Zaky (BKPU)', time: '16 April 2025 • 14:15 WIB',
      text: '"Item belanja Honorarium Narasumber dicantumkan Rp 2.000.000/sesi melebihi plafon SBM Universitas Adzkia (maks. Rp 1.500.000/sesi untuk jenjang pakar nasional). Harap lakukan penyesuaian nominal pada lembar RAB dan unggah kembali dokumen KAK."' },
  ],
};

export function getSubmissionDetail(sub) {
  if (sub.id === 'PGMI-2025-004') return DETAIL_004;
  const parts = [
    ['Honorarium narasumber & pemateri', 0.4], ['Konsumsi & akomodasi kegiatan', 0.3],
    ['Bahan, ATK & percetakan', 0.2], ['Sewa perangkat & dokumentasi', 0.1],
  ];
  const missing = sub.docs[0] < sub.docs[1];
  return {
    simkeu: `#${7000 + sub.id.length * 113}-${sub.id.split('-')[0]}`, sbmStatus: 'SBM-2025: Lolos Verifikasi Awal',
    entry: `${sub.date} (${sub.time} WIB)`, periode: TA, pengusul: sub.pic, fullUnit: sub.unit, facultyShort: sub.faculty,
    schedule: ['Mei 2025', 'Sesuai jadwal pada KAK'], participants: ['Sesuai KAK', 'Lingkup Universitas Adzkia'],
    location: ['Kampus Universitas Adzkia', 'Padang'], iku: ['IKU 6: Mutu Kurikulum'],
    summary: `Program "${sub.title}" diusulkan oleh ${sub.unit} untuk mendukung capaian tridharma. Rincian luaran, jadwal, dan peserta mengacu pada dokumen KAK/TOR terlampir. (Data contoh.)`,
    rab: parts.map(([name, share]) => ({ name, spec: sub.category, qty: 1, unit: 'Paket', price: Math.round(sub.amount * share), badge: 'VALID SBM' })),
    pagu: { induk: 210000000, real: 45500000 },
    files: [
      { name: `Proposal_${sub.id}.pdf`, size: '1.2 MB', meta: 'Hash SHA-256 Valid', tag: 'TTD Pimpinan' },
      missing ? null : { name: `KAK_${sub.id}.pdf`, size: '640 KB', meta: 'Kriteria Capaian Jelas', tag: 'Lengkap' },
      { name: `Surat_Pengantar_${sub.id}.pdf`, size: '410 KB', meta: 'Bernomor resmi', tag: 'Sah' },
    ].filter(Boolean),
    history: [{ tone: 'slate', title: 'Usulan Diajukan Unit', who: sub.pic, time: `${sub.date} • ${sub.time} WIB`, text: 'Usulan dan dokumen pendukung diajukan melalui sistem E-Budgeting.' }],
  };
}

/* ---------- LPJ ---------- */
const FISCAL_OK = (label, note) => ({ tone: 'ok', label, note });
const CORE_LPJ = [
  { id: 'LPJ-2025-003', date: '12 Apr 2025', time: '10:14', unit: 'Prodi S1 PGMI', faculty: 'Fak. Tarbiyah & Keguruan', title: 'Seminar Nasional Pendidikan Islam & Publikasi Bereputasi', ref: 'PGMI-2025-001', cat: 'Honor & Konsumsi', pagu: 42500000, real: 42500000, silpa: 0, silpaNote: '', fiscal: { tone: 'warn', label: '1 Catatan PPh 23', note: 'Bukti potong narsum belum paraf' }, stage: 'revisi' },
  { id: 'LPJ-2025-004', date: '14 Apr 2025', time: '09:00', unit: 'Prodi S1 TI', faculty: 'Fak. Sains & Komputer', title: 'Lokakarya Kurikulum AI & IoT', ref: 'TI-2025-002', cat: 'Bahan & Perlengkapan', pagu: 30000000, real: 28850000, silpa: 1150000, silpaNote: 'Setor Kasir BSI', fiscal: FISCAL_OK('100% Valid', 'Faktur E-Tax Sinkron'), stage: 'antrean' },
  { id: 'LPJ-2025-001', date: '28 Mar 2025', time: '11:05', unit: 'Prodi S1 PAI', faculty: 'Fak. Tarbiyah & Keguruan', title: 'Pelatihan Penulisan Jurnal Bereputasi', ref: 'PAI-2024-089', cat: 'Honor & Konsumsi', pagu: 35000000, real: 35000000, silpa: 0, silpaNote: '', fiscal: FISCAL_OK('Lengkap & Sah', 'Pajak disetor SSP BSI'), stage: 'sah' },
  { id: 'LPJ-2025-002', date: '02 Apr 2025', time: '13:20', unit: 'FEBI Manajemen', faculty: 'Fak. Ekonomi & Bisnis Islam', title: 'Benchmarking Akreditasi Lamemba', ref: 'MNJ-2025-005', cat: 'Perjalanan Dinas / SPPD', pagu: 27000000, real: 26400000, silpa: 600000, silpaNote: 'Setor Kasir BSI', fiscal: FISCAL_OK('Lengkap & Sah', 'SPPD & Boarding Pass Valid'), stage: 'sah' },
  { id: 'LPJ-2025-005', date: '16 Apr 2025', time: '10:30', unit: 'BEM Universitas', faculty: 'Organisasi Mahasiswa', title: 'Festival Seni & Olahraga Mahasiswa Adzkia', ref: 'BEM-2025-008', cat: 'Sewa Gedung & Sound', pagu: 38000000, real: 38000000, silpa: 0, silpaNote: '', fiscal: { tone: 'pending', label: 'Cek Bea Materai', note: 'Materai 10.000 nota > 5jt' }, stage: 'antrean' },
  { id: 'LPJ-2025-006', date: '17 Apr 2025', time: '14:00', unit: 'Lembaga Penjaminan Mutu', faculty: 'Unit Rektorat', title: 'Audit Mutu Internal (AMI) Siklus VI', ref: 'LPM-2025-003', cat: 'Honor & Konsumsi', pagu: 22000000, real: 22000000, silpa: 0, silpaNote: '', fiscal: FISCAL_OK('Fiskal Lengkap', 'Honor auditor internal rapi'), stage: 'antrean' },
];
function makeLpj(n, stage, real) {
  const [unit, faculty, code] = UNITS[n % UNITS.length];
  const fiscal = stage === 'revisi' ? { tone: 'warn', label: '1 Catatan Pajak', note: 'Bukti potong belum paraf' }
    : stage === 'sah' ? FISCAL_OK('Lengkap & Sah', 'Pajak disetor SSP BSI') : FISCAL_OK('Fiskal Lengkap', 'Dokumen terverifikasi');
  return {
    id: `LPJ-2025-${pad(n, 3)}`, date: `${pad(1 + (n % 28))} Apr 2025`, time: '09:00', unit, faculty,
    title: PROGRAMS[n % PROGRAMS.length], ref: `${code}-2025-${pad(100 + n, 3)}`, cat: CATS[n % CATS.length],
    pagu: real, real, silpa: 0, silpaNote: '', fiscal, stage,
  };
}
export const INITIAL_LPJS = [
  ...CORE_LPJ,
  makeLpj(7, 'antrean', 40150000), makeLpj(8, 'antrean', 36000000),
  makeLpj(9, 'revisi', 30000000), makeLpj(10, 'revisi', 20000000),
  ...Array.from({ length: 14 }, (_, i) => makeLpj(11 + i, 'sah', 44400000)),
];

const DETAIL_LPJ_003 = {
  sk: 'SK: 088/UN-ADZ/KU/2025', entry: '12 April 2025 (10:14 WIB)',
  unitName: 'Prodi S1 PGMI', unitSub: 'Fakultas Tarbiyah',
  pic: 'Ahmad Fauzan, M.Ag', picSub: 'NIDN: 1018098701',
  pengusul: 'Dr. Rahmat Hidayat, M.Pd', pengusulSub: 'Dekan F. Tarbiyah',
  files: { done: 12, pending: 2 }, percent: 92.8, txFiles: 14,
  items: [
    { name: 'Honorarium Keynote Speaker Besar', spec: 'Prof. Dr. H. Salman Faris, M.A (UIN Bukittinggi)', code: 'Mata Anggaran: 5.2.1.02 (Honorarium Narasumber)', rab: 10000000, real: 10000000, doc: 'KWT-01-HON.pdf', docNote: 'BAP + Salinan NPWP', tax: 'PPh 21 (15%): Rp 1.500.000', taxNote: 'Bukti Potong: 1.1-2.2-009', ok: true },
    { name: 'Sewa Hall & Videotron Hotel Grand Zuri Padang', spec: 'Durasi: 1 Hari Penuh (Ballroom Utama + LED System)', code: 'Mata Anggaran: 5.2.2.03 (Sewa Gedung & Sarana)', rab: 15000000, real: 15000000, doc: 'INV-GZ-8890.pdf', docNote: 'Materai Rp 10.000', tax: 'Faktur Pajak PPN 11%', taxNote: 'e-Faktur Hotel Terverifikasi', ok: true },
    { name: 'Paket Seminar Kit & Prosiding Cetak Ber-ISBN', spec: '120 eks Prosiding, Tas Goodie Bag, Blocknote & Pen', code: 'Mata Anggaran: 5.2.1.05 (Belanja Bahan & Cetak)', rab: 8500000, real: 8500000, doc: 'NOTA-MITRA-04.pdf', docNote: 'Bukti Rekening Koran Transfer', tax: 'PPN Masukan Terlampir', taxNote: 'NPWP CV Mitra Grafika', ok: true },
    { name: 'Konsumsi Prasmanan 120 Peserta', spec: '1x Makan Siang Prasmanan + 2x Coffee Break (Berkah Catering)', code: 'Mata Anggaran: 5.2.2.04 (Belanja Konsumsi Acara)', rab: 9000000, real: 9000000, doc: 'KWT-CAT-900.pdf', docNote: 'Surat Pernyataan Rekanan', tax: 'PPh 23 (2%) Belum Ada', taxNote: 'Kewajiban Potong: Rp 180.000', ok: false, flag: 'Pajak Perlu Bukti' },
  ],
  taxChecks: [
    { ok: true, title: 'Kepatuhan PPh Pasal 21 (Narasumber)', text: 'Telah dilakukan pemotongan tarif 15% (bukan pegawai tetap/pakar ber-NPWP) senilai Rp 1.500.000. Diterbitkan bukti potong form BP-21.', status: 'Status SSP: NTPN Terkonfirmasi DJP' },
    { ok: true, title: 'Kepatuhan Bea Materai UU No. 10/2020', text: 'Kuitansi nominal > Rp 5.000.000 (Invoice Hotel Grand Zuri Rp 15.000.000) telah dibubuhi e-Materai sah dan tervalidasi via Peruri Portal.', status: 'Status e-Materai: Serial SN-882910' },
    { ok: true, title: 'Kepatuhan Faktur Pajak PPN (Cetak Prosiding)', text: 'CV Percetakan Mitra telah melampirkan Faktur Pajak Elektronik yang diterbitkan atas NPWP Yayasan Pendidikan Adzkia Padang.', status: 'No Faktur: 010.002-25.88219011' },
    { ok: false, title: 'Kepatuhan PPh Pasal 23 (Jasa Boga/Katering)', text: 'Sesuai PMK, jasa penyediaan konsumsi oleh pihak ketiga wajib dipotong PPh Pasal 23 sebesar 2% (Rp 180.000). Dokumen bukti setor dan NPWP vendor belum tersedia.', status: 'Status: Tunggu Bukti Setor Unit' },
  ],
  history: [
    { tone: 'maroon', title: 'Pemeriksaan Bukti oleh BKPU', time: 'Hari ini, 11:20', text: 'Verifikator Ahmad Zaky, S.E. menemukan kekurangan bukti setor PPh Pasal 23 katering.' },
    { tone: 'slate', title: 'Unggah Berkas LPJ Selesai', time: '12 Apr, 10:14', text: 'Ahmad Fauzan, M.Ag (PIC PGMI) mengunggah bundel 14 berkas kuitansi, faktur, dan BAP kegiatan.' },
    { tone: 'sky', title: 'Pelaksanaan Seminar Selesai', time: '08 Apr, 17:00', text: 'Kegiatan berlangsung di Grand Zuri Padang dengan 120 peserta terdaftar hadir.' },
    { tone: 'sky', title: 'Pencairan Dana Kasbon (100%)', time: '25 Mar, 14:30', text: 'Kasir BKPU mentransfer uang muka operasional sebesar Rp 42.500.000 ke rekening Bendahara PGMI.' },
  ],
};

export function getLpjDetail(l) {
  if (l.id === 'LPJ-2025-003') return DETAIL_LPJ_003;
  const half = Math.round(l.real / 2);
  return {
    sk: `SK: ${100 + l.id.length}/UN-ADZ/KU/2025`, entry: `${l.date} (${l.time} WIB)`,
    unitName: l.unit, unitSub: l.faculty, pic: 'PIC Kegiatan', picSub: l.unit, pengusul: 'Pimpinan Unit', pengusulSub: l.faculty,
    files: { done: 8, pending: 0 }, percent: 100, txFiles: 8,
    items: [
      { name: 'Honorarium & jasa kegiatan', spec: l.title, code: 'Mata Anggaran: 5.2.1.02', rab: half, real: half, doc: 'KWT-01.pdf', docNote: 'BAP + Salinan NPWP', tax: 'Pajak telah dipotong', taxNote: 'Bukti potong lengkap', ok: true },
      { name: 'Belanja barang & perlengkapan', spec: l.title, code: 'Mata Anggaran: 5.2.2.03', rab: l.real - half, real: l.real - half, doc: 'NOTA-02.pdf', docNote: 'Bukti transfer', tax: 'PPN Masukan Terlampir', taxNote: 'Faktur sinkron', ok: true },
    ],
    taxChecks: [
      { ok: true, title: 'Kepatuhan PPh Pasal 21', text: 'Pemotongan dan bukti setor telah lengkap.', status: 'Status SSP: Terkonfirmasi' },
      { ok: true, title: 'Kepatuhan Bea Materai', text: 'Kuitansi di atas Rp 5.000.000 telah bermaterai sah.', status: 'Status e-Materai: Valid' },
    ],
    history: [
      { tone: 'slate', title: 'Unggah Berkas LPJ Selesai', time: l.date, text: `${l.unit} mengunggah bundel kuitansi, faktur, dan BAP kegiatan.` },
    ],
  };
}

/* ---------- Riwayat (log telaah selesai) ---------- */
const CORE_LOGS = [
  { id: 'USUL-2025-084', ref: 'PGMI-2025-004', kind: 'ANGGARAN', month: '2025-04', date: '18 Apr 2025 • 10:45', title: 'Workshop Modul Digital', sub: 'Pengembangan Bahan Ajar Berbasis LMS', unit: 'Prodi S1 PGMI', amount: 25000000, result: 'revisi', note: 'Penyesuaian tarif honor narasumber eksternal menjadi Rp 1.500.000/sesi sesuai SBM SK Rektor No. 14/2024.', flag: { tone: 'warn', text: 'Selisih Standar Biaya Masukan: Rp 500.000' }, verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: `${BASE}/pengajuan/PGMI-2025-004` },
  { id: 'USUL-2025-081', ref: 'TI-2025-008', kind: 'ANGGARAN', month: '2025-04', date: '15 Apr 2025 • 09:15', title: 'Upgrade Server Node Lab Komputer', sub: 'Infrastruktur Server Virtualisasi Praktikum', unit: 'Prodi S1 TI', amount: 58000000, result: 'lolos', note: 'Spesifikasi teknis & 3 penawaran vendor pembanding wajar dan lengkap. Pos akun belanja modal hardware terpenuhi.', flag: { tone: 'ok', text: 'Kepatuhan 100% SBM' }, verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: `${BASE}/pengajuan/TI-2025-008` },
  { id: 'LPJ-2025-019', ref: 'LPJ-2025-003', kind: 'AUDIT LPJ', month: '2025-04', date: '12 Apr 2025 • 14:20', title: 'Seminar Nasional Pendidikan Islam', sub: 'Pertanggungjawaban Konsumsi & Prosiding', unit: 'Prodi S1 PGMI', amount: 42500000, result: 'catatan', note: 'Ditemukan kekurangan bukti potong PPh 23 katering Rp 180.000. Diminta kelengkapan bukti setor kas negara sebelum BAP diterbitkan.', flag: { tone: 'danger', text: 'Kurang Bayar PPh 23' }, verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: `${BASE}/lpj/LPJ-2025-003` },
  { id: 'LPJ-2025-018', ref: 'LPJ-2025-001', kind: 'AUDIT LPJ', month: '2025-04', date: '10 Apr 2025 • 11:30', title: 'Pelatihan Metodologi Tafsir Tematik', sub: 'Honorarium Pemateri & Kit Peserta 45 Org', unit: 'Prodi S1 PAI', amount: 35000000, result: 'sah', note: 'Kuitansi bermaterai lengkap, bukti transfer narasumber valid, PPh 21 telah disetor melalui kode billing BNI. Rekonsiliasi selesai 100%.', flag: { tone: 'ok', text: 'Nomor BAP: BAP-044/BKPU-LPJ/IV/2025' }, verifier: 'Siti Mardhiyah, M.Ak', role: 'Auditor Keuangan', to: `${BASE}/lpj/LPJ-2025-001` },
  { id: 'USUL-2025-076', ref: 'LPPM-2025-003', kind: 'ANGGARAN', month: '2025-04', date: '08 Apr 2025 • 16:00', title: 'Hibah Penelitian Dosen Pemula (12 Judul)', sub: 'Alokasi Termin I (60%) Pengambilan Data Lapangan', unit: 'LPPM Adzkia', amount: 45000000, result: 'lolos', note: 'Sesuai pagu RKAT bidang riset dan KAK penelitian terstandar. Biaya survei dan sampel memenuhi batasan SBM Dikti & Yayasan.', flag: { tone: 'ok', text: 'Pagu RKAT Riset Terpakai: 41.5%' }, verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: `${BASE}/pengajuan/LPPM-2025-003` },
  { id: 'USUL-2025-069', ref: null, kind: 'ANGGARAN', month: '2025-04', date: '02 Apr 2025 • 13:10', title: 'Pengadaan Sound System Masjid Kampus', sub: 'Paket Mixer Digital, Wireless Mic & Column Speaker', unit: 'Biro Sarpras', amount: 22000000, result: 'tolak', note: 'Belum terdaftar dalam matriks program kerja RKAT 2025. Direkomendasikan diajukan melalui mekanisme revisi anggaran perubahan atau dialihkan ke pos pemeliharaan Sarpras.', flag: { tone: 'danger', text: 'Status: Ditutup • Tidak Dapat Diteruskan' }, verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: null },
];
const MONTHS = [['Jan', '2025-01'], ['Feb', '2025-02'], ['Mar', '2025-03'], ['Apr', '2025-04']];
function makeLog(i) {
  const [unit] = UNITS[i % UNITS.length];
  const isLpj = i % 4 === 3;
  const [mon, month] = MONTHS[i % 4];
  const result = (isLpj ? ['sah', 'sah', 'catatan'] : ['lolos', 'lolos', 'revisi', 'tolak'])[i % (isLpj ? 3 : 4)];
  const notes = {
    lolos: 'Dokumen lengkap dan rincian biaya sesuai SBM. Diteruskan ke Wakil Rektor II.',
    revisi: 'Penyesuaian tarif belanja diminta sesuai SBM Rektor. Unit diminta mengunggah ulang RAB.',
    tolak: 'Program belum terdaftar dalam matriks RKAT 2025 sehingga tidak dapat diteruskan.',
    sah: 'Bukti transaksi dan kepatuhan pajak lengkap. BAP diterbitkan.',
    catatan: 'Bukti setor pajak belum lengkap. Unit diminta melengkapi.',
  };
  return {
    id: `${isLpj ? 'LPJ' : 'USUL'}-2025-${pad(200 + i, 3)}`, ref: null, kind: isLpj ? 'AUDIT LPJ' : 'ANGGARAN', month,
    date: `${pad(1 + (i % 28))} ${mon} 2025 • ${pad(8 + (i % 9))}:${pad((i * 11) % 60)}`,
    title: PROGRAMS[i % PROGRAMS.length], sub: CATS[i % CATS.length], unit, amount: 10000000 + (i % 10) * 3500000,
    result, note: notes[result], flag: null, verifier: i % 5 === 0 ? 'Siti Mardhiyah, M.Ak' : 'Ahmad Zaky, S.E.',
    role: i % 5 === 0 ? 'Auditor Keuangan' : 'BKPU Anggaran', to: null,
  };
}
export const INITIAL_LOGS = [...CORE_LOGS, ...Array.from({ length: 112 }, (_, i) => makeLog(i))];

/* ---------- Notifikasi ---------- */
export const NOTIF_GROUPS = {
  'hari-ini': { label: 'Hari Ini — 18 April 2025', right: 'Pemberitahuan Penting', dot: 'maroon' },
  kemarin: { label: 'Kemarin — 17 April 2025', right: 'Notifikasi Telah Ditinjau', dot: 'navy' },
  'pekan-lalu': { label: 'Pekan Lalu', right: 'Arsip Sistem', dot: 'sky' },
};
export const INITIAL_NOTIFS = [
  { id: 'bn1', group: 'hari-ini', daysAgo: 0, order: 6, unread: true, tag: 'SLA URGENT', tone: 'red', icon: 'timer', ref: 'No: TI-2025-008', refUnit: 'Prodi S1 Teknik Informatika', time: '10:14 WIB', right: 'Sisa 4 Jam Kerja',
    title: 'Pengadaan Upgrade Node Server Lab Komputer', body: 'Usulan anggaran sebesar **Rp 58.000.000** memasuki **Hari ke-3 telaah**. SLA verifikasi BKPU Universitas Adzkia tersisa 4 jam kerja hari ini sebelum otomatis tereskalasi ke Kabiro Keuangan.',
    meta: ['10:14 WIB', 'Pengaju: Fauzan Akbar, M.Kom'], actions: [{ label: 'Disposisi', dispose: 'TI-2025-008' }, { label: 'Telaah Sekarang', to: `${BASE}/pengajuan/TI-2025-008`, primary: true }] },
  { id: 'bn2', group: 'hari-ini', daysAgo: 0, order: 5, unread: true, tag: 'RESUBMIT REVISI', tone: 'navy', icon: 'refresh', ref: 'No: PGMI-2025-004', refUnit: 'Prodi PGMI (Fakultas Tarbiyah)', time: '09:30 WIB',
    title: 'Revisi Honorarium Narasumber Lokakarya Pembelajaran', body: 'Kaprodi PGMI (Dr. Rahmat Hidayat) telah memperbarui rincian belanja Honorarium Narasumber sesuai Standar Biaya Masukan (SBM) menjadi **Rp 1.500.000/sesi** dan mengunggah KAK perbaikan bertandatangan.',
    meta: ['2 Berkas Lampiran Baru', 'Revisi Tahap 1 Selesai'], actions: [{ label: 'Buka Catatan Riwayat', to: `${BASE}/riwayat` }, { label: 'Periksa Hasil Revisi', to: `${BASE}/pengajuan/PGMI-2025-004`, primary: true }] },
  { id: 'bn3', group: 'hari-ini', daysAgo: 0, order: 4, unread: true, tag: 'LPJ SIAP UJI', tone: 'navy', icon: 'receipt', ref: 'No: LPJ-2025-004', refUnit: 'Prodi S1 Teknik Informatika', time: '08:15 WIB',
    title: 'Pemeriksaan Fisik Kuitansi Lokakarya Kurikulum 2025', body: 'Bendahara prodi telah mengunggah **12 berkas kuitansi asli** dan bukti setor pengembalian Silpa sebesar **Rp 1.150.000** ke rekening Kas Operasional Universitas. Dokumen siap diverifikasi keabsahan fisiknya.',
    meta: ['12 Bukti Transaksi', 'Silpa Terkonfirmasi'], actions: [{ label: 'Mulai Audit Kuitansi', to: `${BASE}/lpj/LPJ-2025-004`, primary: true }] },
  { id: 'bn4', group: 'kemarin', daysAgo: 1, order: 3, unread: false, tag: 'USULAN BARU', tone: 'sky', icon: 'inbox', ref: 'No: MNJ-2025-012', refUnit: 'Prodi S1 Manajemen (FEBI)', time: '15:40 WIB',
    title: 'Benchmarking Kurikulum MBKM ke Universitas Mitra', body: 'Pengajuan kegiatan dengan alokasi **Rp 32.500.000** telah disetujui Dekan Fakultas Ekonomi & Bisnis Islam dan masuk ke dalam antrean telaah BKPU.',
    meta: ['Disetujui Dekan FEBI', 'Hari ke-1 Telaah'], actions: [{ label: 'Lihat Detail Usulan', to: `${BASE}/pengajuan/MNJ-2025-012` }] },
  { id: 'bn5', group: 'kemarin', daysAgo: 1, order: 2, unread: false, tag: 'DISPOSISI WR II', tone: 'sky', icon: 'stamp', ref: 'No: PGMI-2025-002', refUnit: 'Prodi PGMI', time: '11:20 WIB',
    title: 'Persetujuan Pengadaan Media Laboratorium Microteaching', body: 'Wakil Rektor II telah menerbitkan SK persetujuan definitif atas usulan senilai **Rp 65.000.000** berdasarkan lembar rekomendasi telaah kepatuhan BKPU. Dana siap diproses pencairannya.',
    meta: ['Disetujui WR II', 'SK Terbit Otomatis'], actions: [{ label: 'Unduh Salinan SK', toast: 'Unduh salinan SK (simulasi, belum ada berkas dari server).' }] },
  { id: 'bn6', group: 'pekan-lalu', daysAgo: 6, order: 1, unread: false, tag: 'SISTEM', tone: 'gray', icon: 'megaphone', ref: 'Biro Administrasi Umum & Keuangan (BAUK)', refUnit: '', time: '12 April 2025',
    title: 'Batas Akhir Entry Usulan RKAT TA 2024/2025 Genap', body: 'Tenggat entry RKAT TA 2024/2025 Genap bagi seluruh unit kerja dan fakultas berakhir pada 30 April 2025 pukul 23:59 WIB. Dimohon seluruh tim verifikator BKPU mempercepat telaah antrean agar tidak terjadi penumpukan verifikasi menjelang penutupan buku universitas.',
    meta: ['Terbaca oleh seluruh Verifikator Keuangan'], actions: [{ label: 'Tutup Notifikasi', dismiss: true }] },
];

/* ---------- Panduan SBM ---------- */
export const SBM_ROWS = [
  ['Honorarium', 'Narasumber pakar nasional', 'per sesi', 1500000],
  ['Honorarium', 'Narasumber internal / moderator', 'per sesi', 750000],
  ['Honorarium', 'Panitia pelaksana teknis', 'per orang', 500000],
  ['Konsumsi', 'Makan siang prasmanan', 'per kotak/porsi', 45000],
  ['Konsumsi', 'Snack / coffee break', 'per kotak', 25000],
  ['Sewa', 'Smart display & sound', 'per hari', 750000],
  ['Sewa', 'Ruang pertemuan (hotel)', 'per hari', 15000000],
  ['Perjalanan Dinas', 'Tiket pesawat kelas ekonomi (PP)', 'per orang', 3000000],
  ['Perjalanan Dinas', 'Transport lokal panitia', 'per orang', 150000],
  ['Bahan & Cetak', 'ATK & modul peserta', 'per paket', 75000],
];