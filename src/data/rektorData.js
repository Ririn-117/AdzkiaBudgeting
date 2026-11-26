// DATA CONTOH untuk role Rektor (read-only), mengikuti desain.
// Ganti dengan data dari API saat backend siap.

export const REKTOR_BASE = '/dashboard/rektor';

export const REKTOR_PROFILE = {
  name: 'Prof. Dr. H. Anhar, S.T., M.T.',
  title: 'Rektor Universitas Adzkia',
  nip: '197103152000031002',
  nidn: '0015037101',
  pangkat: 'Pembina Utama / Gol. IV/e',
  jabatanFungsional: 'Guru Besar (Profesor)',
  kepakaran: 'Rekayasa Sistem Energi & Manajemen Teknologi',
  jabatan: 'Rektor Universitas Adzkia Padang',
  masaBhakti: '15 Mei 2023 s.d. 14 Mei 2027',
  sk: 'SK Yayasan No. 012/SK/YPA/2023',
  kantor: 'Kantor Pimpinan Rektorat Lantai 3',
  email: 'rector@adzkia.ac.id',
  whatsapp: '+62 811 662 ****',
};

export const PERIOD = { ta: 'TA 2024/2025', semester: 'Genap' };

/* ====================== DASHBOARD ====================== */
export const KPI = {
  usulan: 1842000000,
  usulanProgram: 38,
  disetujui: 1565300000,
  disetujuiPersen: 84.9,
  kas: 1280000000,
  kasPersenPagu: 81.7,
  lpj: 940500000,
  lpjPersenKas: 73.4,
  sisaPagu: 285300000,
  sisaPersen: 18.3,
  efisiensiSbm: 45200000,
  koreksiPersen: 2.45,
  koreksiSbm: 276700000,
  sisaLpj: 339500000,
  silpa: 1750000,
};

export const FLOW = [
  { key: 'pagu', label: 'Pagu Disetujui WR II (SK Pagu Penuh)', amount: 1565300000, text: 'Rp 1.565.300.000 (100%)', percent: 100, tone: 'navy' },
  { key: 'kas', label: 'Pencairan Kas Riil SP2D Bank BSI', amount: 1280000000, text: 'Rp 1.280.000.000 (81,77%)', percent: 81.77, tone: 'slate' },
  { key: 'lpj', label: 'Realisasi LPJ Terverifikasi BKPU (Kuitansi Sah)', amount: 940500000, text: 'Rp 940.500.000 (60,08% dari Pagu / 73,47% dari Kas)', percent: 60.08, tone: 'green' },
  { key: 'silpa', label: 'SiLPA / Sisa Efisiensi Pengembalian Kas', amount: 1750000, text: 'Rp 1.750.000 (Telah disetor balik ke kas)', percent: 1.2, tone: 'maroon' },
];

export const PILLARS = [
  { key: 'akademik', label: 'Pendidikan & Akademik', pagu: 939180000, proker: 21, percent: 60, color: '#161a77' },
  { key: 'sarpras', label: 'Kelembagaan, Sarpras & BSDM', pagu: 417935000, proker: 11, percent: 26.7, color: '#7a0c16' },
  { key: 'sosial', label: 'Sosial, Dakwah & Mhs', pagu: 208185000, proker: 6, percent: 13.3, color: '#3b6fd4' },
];

export const UNIT_ABSORPTION = [
  { id: 'ftk', name: 'Fakultas Tarbiyah & Keguruan', note: '14 Program Kerja (Prodi PAI, PGMI, PIAUD, BK)', usulan: 820000000, disetujui: 740000000, kas: 580000000, lpj: 425000000, daya: 78.3, status: 'Tertib Administrasi FTK', tone: 'green' },
  { id: 'ftik', name: 'Fakultas Teknik & Komputer', note: '9 Program Kerja (Prodi Informatika, Sistem Info, Tek. Sipil)', usulan: 610000000, disetujui: 510000000, kas: 385000000, lpj: 280000000, daya: 75.4, status: 'Proses LPJ Termin 2 FTIK', tone: 'amber' },
  { id: 'febi', name: 'Fakultas Ekonomi & Bisnis Islam', note: '6 Program Kerja (Prodi Ekonomi Syariah, Akuntansi)', usulan: 490000000, disetujui: 380000000, kas: 280000000, lpj: 185000000, daya: 73.6, status: 'Tertib Administrasi FEBI', tone: 'green' },
  { id: 'lppm', name: 'Lembaga Penelitian & Pengabdian (LPPM)', note: 'Hibah Riset Internal Dosen, KKN Tematik & Publikasi Jurnal', usulan: 290000000, disetujui: 265000000, kas: 210000000, lpj: 160000000, daya: 79.2, status: 'Tertib Administrasi LPPM', tone: 'green' },
  { id: 'sarpras', name: 'Biro Sarana Prasarana & Keuangan', note: 'Pemeliharaan Fasilitas, Lisensi Jaringan & Operasional Umum', usulan: 382000000, disetujui: 340000000, kas: 195000000, lpj: 95000000, daya: 57.3, status: 'Termin Berjalan BSDM', tone: 'blue' },
];

export const UNIT_TOTAL = {
  usulan: 1842000000,
  disetujui: 1565300000,
  kas: 1280000000,
  lpj: 940500000,
  daya: 73.4,
  status: 'WTP Internal',
};

export const EWS = [
  {
    id: 'ews-1', tone: 'warn', tag: 'MENDEKATI BATAS TELAAH', unit: 'FTIK',
    title: 'Pengadaan Upgrade Server Laboratorium Komputasi Terpadu',
    text: 'Nilai Pagu: Rp 58.000.000 • Tersisa 1 hari dari batas maksimal telaah teknis BKPU/WR II sebelum masuk masa penetapan tender.',
    action: 'Pratinjau Dokumen', to: `${REKTOR_BASE}/notifikasi`,
  },
  {
    id: 'ews-2', tone: 'danger', tag: 'CATATAN BUKTI PAJAK BELUM LENGKAP', unit: 'FTK',
    title: 'LPJ Seminar Nasional Pendidikan Karakter & Islam',
    text: 'Nilai LPJ: Rp 24.500.000 • Catatan Auditor: Bukti SSP PPh Pasal 23 honor narasumber luar (Rp 180.000) belum diunggah bendahara unit.',
    action: 'Lihat Detail Temuan', to: `${REKTOR_BASE}/laporan-lpj`,
  },
  {
    id: 'ews-3', tone: 'success', tag: 'PENCAIRAN BERHASIL (KLIRING BSI)', unit: 'BAAK',
    title: 'Pencairan SP2D Termin 2 Pelaksanaan Wisuda Sarjana Angkatan IV',
    text: 'Nilai Transaksi: Rp 18.200.000 • Nomor Kliring: BSI-TRX-2024099021. Dana efektif tersedia di bendahara panitia.',
    action: 'Rekapitulasi SP2D', to: `${REKTOR_BASE}/laporan-pencairan`,
  },
];

/* ====================== MONITORING ANGGARAN ====================== */
export const MON_FILTERS = {
  periode: ['TA 2024/2025 Genap'],
  satker: ['Semua Fakultas & Lembaga', 'FTK', 'FTIK', 'FEBI', 'LPPM', 'Sarpras'],
  pilar: ['Semua Pilar Renstra', 'Pendidikan Unggul', 'Sarpras & SDM', 'Riset & Publikasi'],
  status: ['Semua', 'Selesai & LPJ Sah', 'Menanti LPJ', 'Pencairan Bertahap', 'Menunggu SP2D Kasir'],
};

export const MON_BY_UNIT = [
  { unit: 'FTK', disetujui: 450000000, kas: 380000000, lpj: 300000000 },
  { unit: 'FTIK', disetujui: 400000000, kas: 330000000, lpj: 250000000 },
  { unit: 'FEBI', disetujui: 320000000, kas: 240000000, lpj: 170000000 },
  { unit: 'LPPM', disetujui: 265000000, kas: 210000000, lpj: 160000000 },
  { unit: 'Sarpras', disetujui: 130000000, kas: 120000000, lpj: 60500000 },
];

export const STATUS_DOCS = [
  { key: 'cair', label: 'Cair & Berjalan', count: 26, percent: 68.4, color: '#0f9d63' },
  { key: 'kasir', label: 'Proses Kasir (SP2D)', count: 5, percent: 13.2, color: '#3b6fd4' },
  { key: 'lpj', label: 'Pemeriksaan LPJ Sah', count: 5, percent: 13.2, color: '#f59e0b' },
  { key: 'tolak', label: 'Koreksi / Ditolak WR II', count: 2, percent: 5.2, color: '#b4121f' },
];

export const LEDGER = [
  {
    id: 'FTK-2024-001', unit: 'FTK - Prodi PGMI',
    title: 'Workshop Pengembangan Modul Digital & Asesmen Autentik Berbasis AI',
    ketua: 'Dr. Nurhasanah, M.Pd.', pilar: 'Pendidikan Unggul', unitKey: 'FTK',
    diajukan: 28500000, disetujui: 25000000, kas: 25000000, kasLabel: '100,0% Cair',
    lpj: 24620000, lpjLabel: '98,5% Diperiksa', sisa: 380000,
    status: 'Verifikasi LPJ BKPU', statusTone: 'amber', statusKey: 'Menanti LPJ',
    detail: {
      kode: 'FTK-2024-001',
      prodi: 'Program Studi Pendidikan Guru Madrasah Ibtidaiyah (PGMI) FTK',
      termin: 'Termin 1 (100%) Lunas',
      tingkat: '98,5%',
      statusLpj: 'Tahap Pemeriksaan Bukti Fiskal BKPU',
      catatan: 'Kuitansi sah yang telah diunggah dan diverifikasi kasir mencapai Rp 24.620.000. Sisa kas sebesar Rp 380.000 terkonfirmasi disetorkan kembali ke Rekening Penampung Kasir Univ. Adzkia.',
      rab: [
        { item: 'Honor Narasumber Pakar AI Eksternal', vol: '4 Jam', sbm: 3600000, real: 3600000 },
        { item: 'Konsumsi Workshop Dosen & Panitia', vol: '45 Paket x 2 Hari', sbm: 4950000, real: 4850000 },
        { item: 'Paket Data & Token Akses API AI Peserta', vol: '40 Akun', sbm: 4000000, real: 4000000 },
        { item: 'Penggandaan Buku Panduan Asesmen', vol: '45 Eksemplar', sbm: 2250000, real: 2200000 },
        { item: 'Sertifikat Berpenomoran & Seminar Kit', vol: '45 Peserta', sbm: 3200000, real: 3170000 },
        { item: 'Sewa Sound & Multi Display Lab Multimedia', vol: '2 Hari', sbm: 4000000, real: 3800000 },
        { item: 'Biaya Dokumentasi & Pelaporan LPJ', vol: '1 Berkas', sbm: 3000000, real: 3000000 },
      ],
      timeline: [
        { time: '12 Jan 2025, 09:20 WIB', title: 'Pengajuan Proposal Prodi PGMI', text: 'Diunggah oleh Sekprodi dengan lampiran TOR & draft RAB Rp 28.500.000.', tone: 'slate' },
        { time: '15 Jan 2025, 14:15 WIB', title: 'Telaah Kelayakan BKPU (Audit Anggaran)', text: 'Koreksi batasan SBM pada konsumsi dan modul. Rekomendasi nominal disetujui: Rp 25.000.000.', tone: 'slate' },
        { time: '18 Jan 2025, 11:00 WIB', title: 'Keputusan SK WR II (Disetujui Penuh)', text: 'WR II menandatangani Nota Dinas Otorisasi No: ND-084/WR2/UA/2025.', tone: 'green' },
        { time: '22 Jan 2025, 16:30 WIB', title: 'Penerbitan SP2D Kasir (Bank BSI Mandiri Univ)', text: 'Transfer dana tunai termin 100% lunas langsung ke Rekening BSI Panitia Prodi.', tone: 'green' },
        { time: 'Saat ini (Berjalan)', title: 'Verifikasi Kuitansi & Dokumen LPJ Fisik', text: 'BKPU meneliti 18 kuitansi pajak dan nota asli. Rekonsiliasi sisa dana Rp 380.000.', tone: 'amber' },
      ],
      docs: ['Proposal_PGMI_2025.pdf', 'SK_WRII_Otorisasi.pdf', 'Kuitansi_SP2D_Kasir.pdf'],
    },
  },
  {
    id: 'FTIK-2024-008', unit: 'FTIK - Informatika',
    title: 'Pengadaan Lisensi Lab Cloud Computing & Server AI',
    ketua: 'Ilham Pratama, M.Kom.', pilar: 'Sarpras & SDM', unitKey: 'FTIK',
    diajukan: 75000000, disetujui: 68000000, kas: 68000000, kasLabel: '100,0% Cair',
    lpj: 68000000, lpjLabel: '100,0% Kuitansi Sah', sisa: 0,
    status: 'Selesai & LPJ Sah', statusTone: 'green', statusKey: 'Selesai & LPJ Sah',
  },
  {
    id: 'FEBI-2024-004', unit: 'FEBI - Perbankan Syariah',
    title: 'Kuliah Pakar & Sertifikasi Keuangan Islam BNSP',
    ketua: 'Rina Wahyuni, M.E.Sy.', pilar: 'Pendidikan Unggul', unitKey: 'FEBI',
    diajukan: 90000000, disetujui: 75000000, kas: 37500000, kasLabel: '50,0% (Termin 1)',
    lpj: 37500000, lpjLabel: '100% Termin 1 Sah', sisa: 37500000,
    status: 'Kas Cair Menanti LPJ', statusTone: 'blue', statusKey: 'Menanti LPJ',
    note: 'LPJ Termin 2 belum diunggah (batas H+7 acara).',
  },
  {
    id: 'LPPM-2024-012', unit: 'Lembaga LPPM',
    title: 'Bantuan Insentif Publikasi Jurnal Scopus Q2-Q3 Dosen',
    ketua: 'Prof. Dr. Hendri, M.Sc.', pilar: 'Riset & Publikasi', unitKey: 'LPPM',
    diajukan: 42000000, disetujui: 36500000, kas: 25000000, kasLabel: '68,5% (Termin 1)',
    lpj: 0, lpjLabel: 'Belum ada LPJ', sisa: 11500000,
    status: 'Pencairan Bertahap', statusTone: 'blue', statusKey: 'Pencairan Bertahap',
  },
  {
    id: 'BAAK-2024-002', unit: 'Biro Sarpras Kampus',
    title: 'Peremajaan Genset & Perangkat Smart Classroom Gd. B',
    ketua: 'Ir. Zulkifli, S.T.', pilar: 'Sarpras & SDM', unitKey: 'Sarpras',
    diajukan: 120000000, disetujui: 95000000, kas: 0, kasLabel: 'Menunggu SP2D',
    lpj: 0, lpjLabel: 'Pra pencairan', sisa: 95000000,
    status: 'Menunggu SP2D Kasir', statusTone: 'gray', statusKey: 'Menunggu SP2D Kasir',
  },
];

/* ====================== LAPORAN ANGGARAN ====================== */
export const LA_META = {
  noDokumen: '412/LPR/REK/ADZ/2025',
  skRektor: '018/KEP-REK/2025',
  sisaCadangan: 314700000,
  rataRata: 41192105,
};

export const LA_DECISIONS = [
  { key: 'setuju', label: 'Disetujui SK', count: 28, percent: 73.7, note: 'dari total usulan', color: '#0f9d63' },
  { key: 'telaah', label: 'Menunggu Telaah', count: 4, percent: 10.5, note: 'di WR II', color: '#3b6fd4' },
  { key: 'revisi', label: 'Revisi Unit', count: 4, percent: 10.5, note: 'penyesuaian', color: '#f59e0b' },
  { key: 'tolak', label: 'Ditolak / Non RKAT', count: 2, percent: 5.3, note: 'tidak lolos', color: '#b4121f' },
];

export const LA_PLAFON = [
  { name: 'Fakultas Tarbiyah dan Keguruan (FTK)', disetujui: 740000000, pagu: 820000000, percent: 90.2 },
  { name: 'Fakultas Teknik & Ilmu Komputer (FTIK)', disetujui: 510000000, pagu: 610000000, percent: 83.6 },
  { name: 'Fakultas Ekonomi & Bisnis Islam (FEBI)', disetujui: 380000000, pagu: 490000000, percent: 77.5 },
  { name: 'Lembaga Penelitian & Pengabdian (LPPM)', disetujui: 265300000, pagu: 290000000, percent: 91.4 },
];

export const LA_MATRIX = [
  { no: '01', name: 'Fakultas Tarbiyah dan Keguruan (FTK)', sub: 'Kode Unit: UNIT-01/FTK • 4 Program Studi Aktif', berkas: 14, diajukan: 812000000, disetujui: 740000000, rasio: 91.1, efisiensi: 21400000, cair: 480000000, kepatuhan: 'Sangat Tertib' },
  { no: '02', name: 'Fakultas Teknik & Ilmu Komputer (FTIK)', sub: 'Kode Unit: UNIT-02/FTIK • Lab Komputasi & Rekayasa', berkas: 10, diajukan: 585000000, disetujui: 510000000, rasio: 87.1, efisiensi: 12800000, cair: 320000000, kepatuhan: 'Sangat Tertib' },
  { no: '03', name: 'Fakultas Ekonomi dan Bisnis Islam (FEBI)', sub: 'Kode Unit: UNIT-03/FEBI • Akuntansi & Perbankan Syariah', berkas: 7, diajukan: 445000000, disetujui: 380000000, rasio: 85.3, efisiensi: 8000000, cair: 210000000, kepatuhan: 'Tertib' },
  { no: '04', name: 'Lembaga Penelitian & Pengabdian (LPPM)', sub: 'Kode Unit: UNIT-04/LPPM • Hibah Dikti & Pengabdian Nagari', berkas: 5, diajukan: 280000000, disetujui: 265300000, rasio: 94.7, efisiensi: 3000000, cair: 175000000, kepatuhan: 'Sangat Tertib' },
  { no: '05', name: 'Biro Adm. Akademik & Kemahasiswaan (BAAK)', sub: 'Kode Unit: UNIT-05/BAAK • Layanan Wisuda & Ormawa Kampus', berkas: 2, diajukan: 120000000, disetujui: null, rasio: 0, efisiensi: 0, cair: null, kepatuhan: 'Perlu Pendampingan' },
];

export const LA_TOTAL = { berkas: 38, diajukan: 1842000000, disetujui: 1565300000, rasio: 84.9, efisiensi: 45200000, cair: 1185000000, bsre: 88 };

/* ====================== LAPORAN PENCAIRAN ====================== */
export const PENCAIRAN_SUMMARY = {
  total: { berkas: 22, amount: 1407500000 },
  transfer: { berkas: 16, amount: 1235000000 },
  antrean: { berkas: 2, amount: 45000000 },
  yayasan: { berkas: 3, amount: 110000000 },
  silpa: { setoran: 1, amount: 1750000 },
  saldoBsi: 2382550000,
  sinkron: '14:15 WIB',
  rekening: '712.9090.881',
  atasNama: 'Yayasan Pendidikan Adzkia / Rektorat Univ Adzkia Padang • KCP Padang Khatib Sulaiman',
};

export const PENCAIRAN_TABS = [
  { key: 'all', label: 'Semua Pencairan', count: 22 },
  { key: 'sukses', label: 'Sukses Transfer BSI', count: 16 },
  { key: 'antrean', label: 'Antrean Kasir', count: 2 },
  { key: 'yayasan', label: 'Menunggu Otorisasi Yayasan', count: 3 },
];

export const PENCAIRAN_ROWS = [
  { sp2d: 'SP2D-2025/08812', req: 'REQ: YYS-CAIR-2025-014', unit: 'S1 PGMI (Pendidikan Guru MI)', va: 'BSI VA: 8871 0928-31', kegiatan: 'Workshop Kurikulum OBE Berbasis Karakter', sk: 'SK: 042/SK-WR2/UA/I/2025', pagu: 35000000, cair: 25000000, termin: 'Termin 1 (70%)', waktu: '12 Feb 2025 10:42:18 WIB', status: 'sukses', trx: 'TRX-BSI-9923847' },
  { sp2d: 'SP2D-2025/08810', req: 'REQ: YYS-CAIR-2025-012', unit: 'LPPM Adzkia', va: 'BSI VA: 8871 0021-99', kegiatan: 'Hibah Riset Kolaboratif Dosen Batch I', sk: 'SK: 038/SK-WR2/UA/I/2025', pagu: 120000000, cair: 120000000, termin: 'Termin Tunggal (100%)', waktu: '11 Feb 2025 14:11:05 WIB', status: 'sukses', trx: 'TRX-BSI-9921102' },
  { sp2d: 'SP2D-2025/08815', req: 'REQ: YYS-CAIR-2025-018', unit: 'Biro Sistem Informasi & TI', va: 'BSI VA: 8871 0044-11', kegiatan: 'Peremajaan Server Backup Cloud & Lisensi', sk: 'SK: 049/SK-WR2/UA/II/2025', pagu: 45000000, cair: 45000000, termin: 'Termin Tunggal (100%)', waktu: 'Dalam Proses Kasir • Batch Siang', status: 'antrean', trx: 'Menunggu Eksekusi CMS' },
  { sp2d: 'SP2D-2025/08819', req: 'REQ: YYS-CAIR-2025-021', unit: 'Fakultas Tarbiyah & Keguruan', va: 'BSI VA: 8871 0010-02', kegiatan: 'Pengadaan Peralatan Lab Microteaching', sk: 'SK: 052/SK-WR2/UA/II/2025', pagu: 110000000, cair: 110000000, termin: 'Termin 1 (70%)', waktu: 'Belum Dicairkan • Tahap Review Bendahara Yayasan', status: 'yayasan', trx: 'Verifikasi Saldo Bank' },
  { sp2d: 'SP2D-2025/08808', req: 'REQ: YYS-CAIR-2025-009', unit: 'Biro Akademik (BAAK)', va: 'BSI VA: 8871 0089-20', kegiatan: 'Pencetakan Ijazah & Perlengkapan Wisuda', sk: 'SK: 031/SK-WR2/UA/I/2025', pagu: 85000000, cair: 85000000, termin: 'Termin Tunggal (100%)', waktu: '10 Feb 2025 09:15:33 WIB', status: 'sukses', trx: 'TRX-BSI-9892014' },
  { sp2d: 'SP2D-2025/08805', req: 'REQ: YYS-CAIR-2025-006', unit: 'Fakultas Sains & Humaniora', va: 'BSI VA: 8871 0033-01', kegiatan: 'Seminar Internasional Islamic Science', sk: 'SK: 025/SK-WR2/UA/I/2025', pagu: 60000000, cair: 18000000, termin: 'Termin 2 (30%)', waktu: '08 Feb 2025 11:20:19 WIB', status: 'sukses', trx: 'TRX-BSI-9883100' },
];

export const PENCAIRAN_STATUS = {
  sukses: { label: 'Sukses Transfer BSI', tone: 'green' },
  antrean: { label: 'Antrean Kasir', tone: 'blue' },
  yayasan: { label: 'Menunggu Yayasan', tone: 'amber' },
};

/* ====================== LAPORAN LPJ ====================== */
export const LPJ_SUMMARY = {
  pencairan: { amount: 1280000000, kegiatan: 31 },
  terdaftar: { amount: 940500000, persen: 73.5 },
  sisaKas: { amount: 339500000 },
  bap: { laporan: 16, amount: 683000000 },
  klarifikasi: { dokumen: 3, amount: 92500000 },
  silpa: { unit: 2, amount: 1750000 },
  total: { berkas: 24, amount: 940500000 },
  uji: { dokumen: 5, amount: 165000000 },
};

export const LPJ_RECON = [
  { key: 'bap', label: 'BAP Sah', percent: 53.4, color: '#0f9d63' },
  { key: 'uji', label: 'Uji BKPU', percent: 12.9, color: '#3b6fd4' },
  { key: 'pph', label: 'Revisi PPh', percent: 7.2, color: '#f59e0b' },
  { key: 'belum', label: 'Belum LPJ', percent: 26.5, color: '#cbd2e6' },
];

export const LPJ_TAX = {
  persen: 98.2,
  rows: [
    { label: 'PPh Pasal 21 (Honor Dosen/Narsum)', value: '100% Tervalidasi', tone: 'green' },
    { label: 'PPh Pasal 23 (Jasa Katering/Sewa)', value: '92,4% (3 Pending)', tone: 'amber' },
    { label: 'PPN Faktur Pajak Masukan', value: '99,1% Kliring', tone: 'green' },
  ],
};

export const LPJ_ROWS = [
  {
    id: 'LPJ-2025-003', tgl: '12 Feb 2025', unit: 'Prodi PGMI', fak: 'Fak. Tarbiyah & Keguruan',
    title: 'Seminar Nasional Kurikulum Merdeka', ref: 'REF-FTK-2025-018',
    cair: 42500000, real: 42500000, silpa: 0, silpaLabel: 'Nihil (100% Serap)',
    pajak: 'Catatan PPh 23', pajakTone: 'amber', status: 'Perlu Klarifikasi Bukti', statusTone: 'amber', statusKey: 'klarifikasi',
    detail: {
      judul: 'Seminar Nasional Kurikulum Merdeka',
      unit: 'Prodi Pendidikan Guru Madrasah Ibtidaiyah (PGMI) • Fak. Tarbiyah & Keguruan',
      catatanJudul: 'Catatan Auditor BKPU: Butuh Kelengkapan PPh 23',
      catatan: 'Realisasi konsumsi katering prasmanan (PT Berkah Rasa Padang) sebesar Rp 9.000.000 belum menyertakan lampiran Bukti Potong PPh 23 (tarif 2% = Rp 180.000). Dokumen fisik kuitansi lainnya telah diverifikasi 100% sah.',
      pemeriksa: 'Ahmad Zaky, S.E. (Auditor Madya BKPU) • 13 Feb 2025',
      sp2d: '#104/I/2025',
      bukti: [
        { title: 'Honorarium Narasumber Utama (Prof. Syamsul R., Ph.D)', sub: 'Kuitansi + Bukti Potong PPh 21 (Dipotong 5% Rp 250.000)', amount: 5000000, ok: true },
        { title: 'Konsumsi Makan Siang & Snack Peserta (250 Pax)', sub: 'Kuitansi Berstempel • Belum PPh 23 (Rp 180.000)', amount: 9000000, ok: false },
        { title: 'Prosiding Seminar, Sertifikat & Seminar Kit (CV Mandiri Grafika)', sub: 'Faktur Pajak Elektronik Seri 010.024-25.109882', amount: 16250000, ok: true },
        { title: 'Sewa Gedung Convention Hall & Audio Visual', sub: 'Kuitansi Resmi + Bukti Setor PPh 4 ayat 2 Final', amount: 12250000, ok: true },
      ],
      jumlahBerkas: 14,
      pj: { nama: 'Dr. Fauzan Ahmad, M.Pd.', jabatan: 'Ka. Prodi PGMI UnAdzkia' },
      dekan: { nama: 'Prof. Dr. Hj. Ramlah, M.Ag.', jabatan: 'Dekan Tarbiyah & Keguruan' },
    },
  },
  { id: 'LPJ-2025-001', tgl: '08 Feb 2025', unit: 'LPPM', fak: 'Lembaga Universitas', title: 'Hibah Riset Dosen Pemula', ref: 'REF-LPPM-2025-004', cair: 180000000, real: 178750000, silpa: 1250000, silpaLabel: 'Rp 1.250.000 (Setor)', pajak: '100% Cocok Faktur Pajak', pajakTone: 'green', status: 'Sah / BAP Terbit', statusTone: 'green', statusKey: 'bap' },
  { id: 'LPJ-2025-002', tgl: '10 Feb 2025', unit: 'Prodi Informatika', fak: 'Fak. Sains & Humaniora', title: 'Pengadaan Modul Cloud', ref: 'REF-FST-2025-009', cair: 65000000, real: 64500000, silpa: 500000, silpaLabel: 'Rp 500.000 (Setor)', pajak: 'Bebas Temuan Pajak', pajakTone: 'green', status: 'Sah / BAP Terbit', statusTone: 'green', statusKey: 'bap' },
  { id: 'LPJ-2025-004', tgl: '14 Feb 2025', unit: 'Biro Penjaminan Mutu (BPM)', fak: 'Rektorat', title: 'Workshop Borang Akreditasi', ref: 'REF-BPM-2025-003', cair: 38000000, real: 38000000, silpa: 0, silpaLabel: 'Nihil', pajak: 'Dalam Validasi DJP', pajakTone: 'blue', status: 'Dalam Uji Kuitansi', statusTone: 'blue', statusKey: 'uji' },
  { id: 'LPJ-2025-005', tgl: '15 Feb 2025', unit: 'LPPM / Pengabdian', fak: 'Lembaga Universitas', title: 'Pelepasan KKN Tematik', ref: 'REF-LPPM-2025-012', cair: 127000000, real: 127000000, silpa: 0, silpaLabel: 'Nihil', pajak: '100% Cocok Faktur Pajak', pajakTone: 'green', status: 'Sah / BAP Terbit', statusTone: 'green', statusKey: 'bap' },
];

export const LPJ_STATUS_OPTIONS = [
  ['', 'Semua Status Audit (24)'],
  ['bap', 'BAP Terbit (Bebas Temuan)'],
  ['klarifikasi', 'Perlu Klarifikasi Bukti'],
  ['uji', 'Dalam Uji Kuitansi'],
];

/* ====================== NOTIFIKASI ====================== */
export const NOTIF_TABS = [
  { key: 'all', label: 'Semua Peringatan' },
  { key: 'unread', label: 'Belum Dibaca' },
  { key: 'kritis', label: 'Peringatan Kritis SLA & Pagu' },
  { key: 'realisasi', label: 'Realisasi & Pencairan' },
];

export const NOTIF_INITIAL = [
  {
    id: 'n1', cat: 'kritis', unread: true, accent: 'amber', icon: 'gauge', tag: 'PAGU MENIPIS • 78,3%', tagTone: 'amber',
    unit: 'Fakultas Tarbiyah & Keguruan', time: '15 menit yang lalu', order: 8,
    title: 'Peringatan Serapan Anggaran: FTK Mendekati Ambang Batas Pagu Semester Genap',
    body: 'Fakultas Tarbiyah & Keguruan telah merealisasikan belanja sebesar **Rp 580.000.000** dari total alokasi Rp 740.000.000 (78,3%). Dengan sisa 3,5 bulan kalender akademik, proyeksi serapan diprediksi akan menembus 100% lebih awal. Rekomendasi eksekutif: persiapan evaluasi pos cadangan pimpinan rujukan rapat senat.',
    meter: { label: 'Realisasi Pos Anggaran Terpakai', text: 'Rp 580 Jt / Rp 740 Jt (78,3%)', percent: 78.3, foot: 'Sisa Pagu Bersih: Rp 160.000.000 • Laju Realisasi Tinggi' },
    actions: [{ label: 'Buka Rincian DIPA FTK', to: `${REKTOR_BASE}/monitoring-anggaran` }],
    footnote: 'Kode Akun Induk: 5.2.1.04.FTK',
  },
  {
    id: 'n2', cat: 'kritis', unread: true, accent: 'red', icon: 'alarm', tag: 'BATAS WAKTU SLA WR II TERLAMPAUI (48 JAM)', tagTone: 'red', critical: true,
    unit: 'FTIK Komputer', time: '1 jam yang lalu', order: 7,
    title: 'Eskalasi Batas Waktu: Usulan Pengadaan Server Cloud Lab Komputer FTIK',
    body: 'Berkas Usulan Belanja Server Komputasi Lab FTIK senilai **Rp 58.000.000** telah tertahan selama 48 jam 12 menit pada meja otorisasi Wakil Rektor II. Batas toleransi SLA sistem institusi adalah 48 jam. Pengadaan berpotensi melewati masa cut-off vendor penyedia perangkat keras server.',
    meter: { label: 'ESKALASI LEVEL 1 • Target SLA Persetujuan: Maksimal 48 Jam', text: 'Overdue (+12 menit)', percent: 100, tone: 'red', foot: 'Status saat ini: Overdue • Memerlukan disposisi atensi Rektor' },
    actions: [{ label: 'Lihat Portofolio Usulan', to: `${REKTOR_BASE}/monitoring-anggaran` }],
    footnote: '#PROP-FTIK-2025-089 • PJ Kegiatan: Dr. Irfan Pratama, M.Kom',
  },
  {
    id: 'n3', cat: 'realisasi', unread: true, accent: 'green', icon: 'wallet', tag: 'PENCAIRAN SP2D BERHASIL', tagTone: 'green',
    unit: 'Kasir Rektorat • Bank BSI', time: '3 jam yang lalu', order: 6,
    title: 'Transfer Kasir Selesai: Logistik Wisuda BAAK & Pelatihan Dosen LPPM',
    body: 'Bagian Keuangan Rektorat telah menyelesaikan validasi dan transfer langsung rekening giro Bank Syariah Indonesia (BSI) untuk 2 nomor SPM tervalidasi: SP2D No. 0422/SP2D/ADZ/2025 (**Rp 18.200.000** Perlengkapan Wisuda Terpadu BAAK) dan SP2D No. 0423/SP2D/ADZ/2025 (**Rp 14.500.000** Honorarium Narasumber LPPM).',
    chips: ['Wisuda Ke-VIII (BAAK) • Rp 18.200.000 • Reff BSI: #9901428', 'Pelatihan Metodologi (LPPM) • Rp 14.500.000 • Reff BSI: #9901429'],
    actions: [{ label: 'Unduh Rekap Transfer Kasir BSI', toast: 'Rekap transfer kasir BSI diunduh (simulasi).' }],
    footnote: 'Pemberitahuan telah terdistribusi ke BAAK & LPPM',
  },
  {
    id: 'n4', cat: 'lainnya', unread: false, accent: 'maroon', icon: 'shield', tag: 'TEMUAN AUDIT PRA-KEPATUHAN', tagTone: 'maroon',
    unit: 'BKPU Adzkia', time: 'Kemarin, 16:40 WIB', order: 5,
    title: 'Kepatuhan Perpajakan LPJ: Pemotongan PPh 23 Belum Dilampirkan Prodi PGSD',
    body: 'Hasil penelaahan dokumen pertanggungjawaban (LPJ) kegiatan Seminar Nasional Pendidikan Anak oleh Badan Keuangan & Penjaminan Mutu (BKPU) menemukan belum dilampirkannya bukti setor PPh Pasal 23 jasa katering sebesar **Rp 180.000**. Unit telah diberi tenggat perbaikan 3 hari sebelum berkas dikunci secara permanen pada laporan tahunan.',
    actions: [{ label: 'Tinjau Catatan Auditor BKPU', to: `${REKTOR_BASE}/laporan-lpj` }],
    footnote: 'Status: Masa Sanggah & Revisi Mandiri',
  },
  {
    id: 'n5', cat: 'realisasi', unread: false, accent: 'navy', icon: 'landmark', tag: 'REKONSILIASI BANK', tagTone: 'navy',
    unit: 'YAYASAN PENDIDIKAN ADZKIA', time: '2 hari yang lalu', order: 4,
    title: 'Sinkronisasi Buku Kas Triwulanan Selesai Tanpa Selisih (Zero Discrepancy)',
    body: 'Bendahara Yayasan Pendidikan Adzkia mengonfirmasi seluruh saldo penampungan rekening giro operasional BSI universitas dan alokasi dana SPP mahasiswa periode registrasi genap telah terkonsolidasi penuh dengan buku besar SIMKEU Institusi. Tingkat kesesuaian akuntansi tercatat **100%**.',
    actions: [{ label: 'Tinjau Berita Acara Rekonsiliasi Kas', toast: 'Berita acara rekonsiliasi dibuka (simulasi).' }],
    footnote: 'BA Rekon No: 12/YPA-SIMKEU/II/2025',
  },
];

// Arsip lebih lama (dimuat saat tombol "Muat Arsip Lebih Lama" ditekan)
export const NOTIF_ARCHIVE = [
  {
    id: 'n6', cat: 'realisasi', unread: false, accent: 'green', icon: 'wallet', tag: 'PENCAIRAN SP2D BERHASIL', tagTone: 'green',
    unit: 'Kasir Rektorat • Bank BSI', time: '4 hari yang lalu', order: 3,
    title: 'Transfer Kasir Selesai: Hibah Riset Kolaboratif Dosen Batch I',
    body: 'SP2D-2025/08810 senilai **Rp 120.000.000** untuk LPPM telah terkliring melalui Bank BSI (TRX-BSI-9921102).',
    actions: [{ label: 'Buka Laporan Pencairan', to: `${REKTOR_BASE}/laporan-pencairan` }],
  },
  {
    id: 'n7', cat: 'lainnya', unread: false, accent: 'maroon', icon: 'shield', tag: 'BAP LPJ TERBIT', tagTone: 'maroon',
    unit: 'BKPU Adzkia', time: '5 hari yang lalu', order: 2,
    title: 'Berita Acara Pemeriksaan LPJ Hibah Riset Dosen Pemula Diterbitkan',
    body: 'LPJ-2025-001 (**Rp 178.750.000**) dinyatakan sah tanpa temuan. SiLPA Rp 1.250.000 telah disetor ke rekening penampung.',
    actions: [{ label: 'Buka Laporan LPJ', to: `${REKTOR_BASE}/laporan-lpj` }],
  },
  {
    id: 'n8', cat: 'lainnya', unread: false, accent: 'navy', icon: 'landmark', tag: 'KETETAPAN RKAT', tagTone: 'navy',
    unit: 'Wakil Rektor II', time: '1 minggu yang lalu', order: 1,
    title: 'Keputusan Rektor No. 018/KEP-REK/2025 tentang Pagu Definitif Unit Kerja Diterbitkan',
    body: 'Seluruh alokasi pagu definitif TA 2024/2025 Genap telah ditetapkan sebesar **Rp 1.565.300.000** untuk 28 program kerja.',
    actions: [{ label: 'Buka Laporan Anggaran', to: `${REKTOR_BASE}/laporan-anggaran` }],
  },
];

export const NOTIF_SIDE = {
  digest: '07:30 WIB',
  email: 'rector@adzkia.ac.id',
  whatsapp: '+62 811 662 **** (Aktif)',
  beban: [
    { label: 'Total Usulan Aktif', value: '38 Berkas' },
    { label: 'Lolos Telaah & Terbit SK', value: '28 Berkas (73,7%)' },
    { label: 'Transaksi Terkendala Likuiditas', value: '0 Insiden' },
  ],
  kontak: [
    { name: 'Dr. H. Alfian, S.E., M.Si., Ak.', role: 'Wakil Rektor II • Otorisator Keuangan Kampus' },
    { name: 'Nurul Hidayati, M.Ak., CA.', role: 'Kepala Bagian BKPU • Auditor Internal Institusi' },
    { name: 'Unit Layanan BSI Rektorat', role: 'Kasir Utama Perbankan • Disbursement & Giro Operasional' },
  ],
};
