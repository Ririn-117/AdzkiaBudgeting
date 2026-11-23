import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Printer,
  Search,
  RotateCcw,
  Eye,
  PenTool,
  FileText,
  Download,
  Info,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Shield,
  Check,
  X,
} from 'lucide-react';
import { useYayasan } from '../../context/YayasanContext';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { useToast } from '../../components/ui/Toast';
import { BASE } from '../../data/yayasanData';

// Data statis 7 baris persis seperti di screenshot pengguna
const MOCK_SEMUA_PERMINTAAN = [
  {
    id: 'YYS-CAIR-2025-014',
    tgl: '16 Feb 2025',
    unit: 'PGMI FTK',
    pic: 'Dr. Fauzan, M.Pd.',
    picId: 'NIDN: 10129038',
    kegiatan: 'Workshop Pembuatan Modul Digital & Asesmen Autentik Berbasis AI',
    kegiatanShort: 'Workshop Pembuatan...',
    skRef: 'SK WR2/04/II/2025',
    mak: '5.2.1.08',
    kategori: 'Pendidikan & Dev',
    kategoriDotColor: '#3b82f6',
    kategoriColor: 'purple',
    nominal: 25000000,
    terminInfo: 'Termin 1 (100%)',
    realisasiKasir: 'Menunggu Putusan',
    realisasiStatus: 'pending',
    statusAlur: 'MENUNGGU OTORISASI',
    statusTone: 'red',
    actions: ['eye', 'decide'],
  },
  {
    id: 'YYS-CAIR-2025-015',
    tgl: '16 Feb 2025',
    unit: 'Teknik Informatika',
    pic: 'Rahmat Hidayat, M.Kom',
    picId: 'NIDN: 10240985',
    kegiatan: 'Upgrade Server Lab Jaringan & Cloud Computing',
    kegiatanShort: 'Upgrade Server...',
    skRef: 'SK WR2/06/II/2025',
    mak: '5.3.2.01',
    kategori: 'Pendidikan & Dev',
    kategoriDotColor: '#3b82f6',
    kategoriColor: 'purple',
    nominal: 58000000,
    terminInfo: 'Investasi Aset',
    realisasiKasir: 'Menunggu Putusan',
    realisasiStatus: 'pending',
    statusAlur: 'MENUNGGU OTORISASI',
    statusTone: 'red',
    actions: ['eye', 'decide'],
  },
  {
    id: 'YYS-CAIR-2025-013',
    tgl: '14 Feb 2025',
    unit: 'BAAK Rektorat',
    pic: 'Hj. Nurul Indah, S.Sos',
    picId: 'NIP: 19820311',
    kegiatan: 'Pelaksanaan Wisuda Sarjana & Diploma Periode I',
    kegiatanShort: 'Pelaksanaan Wisuda',
    skRef: 'SK Rektor/12/I/2025',
    mak: '5.1.2.04',
    kategori: 'Sekretariat/BSDM',
    kategoriDotColor: '#3b82f6',
    kategoriColor: 'blue',
    nominal: 18200000,
    terminInfo: 'Lengkap SPJ',
    realisasiKasir: 'Rp 18.200.000',
    trxRef: 'BSI #TRX-0921',
    realisasiStatus: 'done',
    statusAlur: 'TELAH DICAIRKAN',
    statusTone: 'green',
    actions: ['doc', 'download'],
  },
  {
    id: 'YYS-CAIR-2025-012',
    tgl: '12 Feb 2025',
    unit: 'Lembaga Mutu (LPM)',
    pic: 'Dr. Ir. Hendri, M.T.',
    picId: 'NIDN: 10041172',
    kegiatan: 'Audit Mutu Internal & Akreditasi Program Studi',
    kegiatanShort: 'Audit Mutu Internal...',
    skRef: 'SK WR1/02/I/2025',
    mak: '5.1.4.02',
    kategori: 'Sekretariat/BSDM',
    kategoriDotColor: '#3b82f6',
    kategoriColor: 'blue',
    nominal: 22000000,
    terminInfo: 'Biaya Honor Asesor',
    realisasiKasir: 'Rp 22.000.000',
    trxRef: 'BSI #TRX-9884',
    realisasiStatus: 'done',
    statusAlur: 'TELAH DICAIRKAN',
    statusTone: 'green',
    actions: ['doc', 'download'],
  },
  {
    id: 'YYS-CAIR-2025-011',
    tgl: '10 Feb 2025',
    unit: 'FEBI Manajemen',
    pic: 'Yulia Citra, S.E., M.Si.',
    picId: 'NIDN: 10180290',
    kegiatan: 'Benchmarking Kurikulum MBKM & Inkubator Bisnis Syariah',
    kegiatanShort: 'Benchmarking...',
    skRef: 'SK Dekan/09/I/2025',
    mak: '5.2.2.14',
    kategori: 'Pendidikan & Dev',
    kategoriDotColor: '#3b82f6',
    kategoriColor: 'purple',
    nominal: 32500000,
    terminInfo: 'Transportasi & Akomodasi',
    realisasiKasir: 'Rp 32.500.000',
    trxRef: 'BSI #TRX-9850',
    realisasiStatus: 'done',
    statusAlur: 'TELAH DICAIRKAN',
    statusTone: 'green',
    actions: ['doc', 'download'],
  },
  {
    id: 'YYS-CAIR-2025-008',
    tgl: '05 Feb 2025',
    unit: 'Tim Tanggap Bencana',
    pic: 'Ust. Salman, S.Pd.I',
    picId: 'Unit Sosial & Dakwah',
    kegiatan: 'Pengadaan Logistik & Dapur Umum Tanggap Bencana Pasaman',
    kegiatanShort: 'Pengadaan Logistik &...',
    skRef: 'Disposisi Ketua Yayasan',
    mak: 'Dana Kebajikan',
    kategori: 'Sosial & Ummat',
    kategoriDotColor: '#f59e0b',
    kategoriColor: 'orange',
    nominal: 15000000,
    terminInfo: 'Pencairan Tanggap Darurat',
    realisasiKasir: 'Rp 15.000.000',
    trxRef: 'BSI #TRX-9702',
    realisasiStatus: 'done',
    statusAlur: 'TELAH DICAIRKAN',
    statusTone: 'green',
    actions: ['doc', 'download'],
  },
  {
    id: 'YYS-CAIR-2025-005',
    tgl: '28 Jan 2025',
    unit: 'Biro Sarpras',
    pic: 'Eko Prasetyo, S.T.',
    picId: 'NIP: 19851020',
    kegiatan: 'Renovasi Ruang Rapat Pimpinan Gedung Rektorat Sayap Timur',
    kegiatanShort: 'Renovasi Ruang Tak...',
    skRef: 'Alasan: Di Luar RKAT Disetujui',
    mak: 'Disetujui',
    isAlertMak: true,
    kategori: 'Sekretariat/BSDM',
    kategoriDotColor: '#3b82f6',
    kategoriColor: 'blue',
    nominal: 24000000,
    terminInfo: 'Ditolak Yayasan',
    realisasiKasir: 'Rp 0',
    trxRef: 'Tidak Dicairkan',
    realisasiStatus: 'rejected',
    statusAlur: 'DITOLAK OTORISATOR',
    statusTone: 'pink',
    actions: ['info'],
  },
];

export default function YayasanSemua() {
  const navigate = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [waktuFilter, setWaktuFilter] = useState('');

  // Filtering
  const filtered = MOCK_SEMUA_PERMINTAAN.filter((row) => {
    if (tab === 'menunggu' && !row.statusAlur.includes('MENUNGGU')) return false;
    if (tab === 'transfer' && !row.statusAlur.includes('ANTREAN')) return false;
    if (tab === 'cair' && !row.statusAlur.includes('TELAH DICAIRKAN')) return false;
    if (tab === 'tolak' && !row.statusAlur.includes('DITOLAK')) return false;

    if (kategoriFilter && row.kategori !== kategoriFilter) return false;

    if (q) {
      const match =
        row.id.toLowerCase().includes(q.toLowerCase()) ||
        row.kegiatan.toLowerCase().includes(q.toLowerCase()) ||
        row.unit.toLowerCase().includes(q.toLowerCase()) ||
        row.pic.toLowerCase().includes(q.toLowerCase());
      if (!match) return false;
    }

    return true;
  });

  const handleReset = () => {
    setQ('');
    setKategoriFilter('');
    setWaktuFilter('');
    toast.push('Filter pencarian berhasil direset.', 'info');
  };

  const handleExport = () => {
    downloadCsv('Semua_Permintaan_Pencairan_Yayasan.csv', [
      [
        'No. Permintaan',
        'Tgl',
        'Unit',
        'PIC',
        'Kegiatan',
        'Ref SK',
        'Kategori',
        'Nominal Diminta',
        'Realisasi Kasir',
        'Status',
      ],
      ...filtered.map((r) => [
        r.id,
        r.tgl,
        r.unit,
        r.pic,
        r.kegiatan,
        r.skRef,
        r.kategori,
        r.nominal,
        r.realisasiKasir,
        r.statusAlur,
      ]),
    ]);
    toast.push('Rekap pencairan dana (.xlsx) berhasil diunduh.');
  };

  const handleCetakLedger = () => {
    toast.push('Mempersiapkan Ledger Buku Kas Utama BSI Yayasan untuk dicetak...');
  };

  return (
    <div className="yys-page">
      {/* Header & Breadcrumb */}
      <div className="yys-header-area">
        <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Persetujuan Pencairan</span>
          <span>&gt;</span>
          <span style={{ color: '#7a0c16', fontWeight: 600 }}>Semua Permintaan</span>
        </div>

        <div className="yys-header-row" style={{ marginTop: '0.2rem' }}>
          <div>
            <h1 className="yys-title">Semua Permintaan Pencairan Kas Yayasan</h1>
            <p className="yys-subtitle">
              Pelacakan siklus pencairan dana universitas dari pengajuan unit, disposisi yayasan, hingga realisasi transfer bank kasir.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            {/* Buku Kas Utama BSI Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '0.4rem 0.8rem',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: '#334155',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCard size={15} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  BUKU KAS UTAMA
                </span>
                <strong style={{ fontSize: '0.76rem', color: '#0f172a' }}>
                  BSI Yayasan (No. *8829)
                </strong>
              </div>
            </div>

            {/* Cetak Ledger Button */}
            <button
              type="button"
              className="yys-btn-outline"
              onClick={handleCetakLedger}
            >
              <Printer size={14} /> Cetak Ledger
            </button>
          </div>
        </div>
      </div>

      {/* 5 Top Summary Cards */}
      <div className="yys-kpi-grid cols-5">
        {/* Card 1: TOTAL MASUK */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TOTAL MASUK</span>
            <div className="yys-kpi-icon-wrap blue">
              <Layers size={17} />
            </div>
          </div>
          <div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              <span className="num-large" style={{ color: '#0f172a' }}>22</span>
              <span className="unit-text">Permintaan</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#991b1b', display: 'block' }}>
              Rp 1.407.500.000
            </strong>
          </div>
          <div className="yys-kpi-sub" style={{ marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem' }}>
            <span style={{ color: '#64748b' }}>Tingkat Realisasi</span>
            <strong style={{ color: '#0f172a' }}>87.7%</strong>
          </div>
        </div>

        {/* Card 2: MENUNGGU OTORISASI */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">MENUNGGU OTORISASI</span>
            <div className="yys-kpi-icon-wrap red">
              <Clock size={17} />
            </div>
          </div>
          <div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              <span className="num-large" style={{ color: '#0f172a' }}>3</span>
              <span className="unit-text">Pengajuan</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
              Rp 110.000.000
            </strong>
          </div>
          <div className="yys-kpi-sub" style={{ marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem' }}>
            <span style={{ color: '#b91c1c', fontWeight: 600 }}>● Prioritas Segera</span>
            <span style={{ color: '#64748b' }}>3 Berkas</span>
          </div>
        </div>

        {/* Card 3: ANTREAN TRANSFER */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">ANTREAN TRANSFER</span>
            <div className="yys-kpi-icon-wrap blue">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              <span className="num-large" style={{ color: '#0f172a' }}>2</span>
              <span className="unit-text">Disetujui</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
              Rp 45.000.000
            </strong>
          </div>
          <div className="yys-kpi-sub" style={{ marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem' }}>
            <span style={{ color: '#64748b' }}>Menunggu Kasir</span>
            <span style={{ color: '#2563eb', fontWeight: 600 }}>Proses Bank</span>
          </div>
        </div>

        {/* Card 4: TELAH DICAIRKAN */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TELAH DICAIRKAN</span>
            <div className="yys-kpi-icon-wrap green">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              <span className="num-large" style={{ color: '#0f172a' }}>16</span>
              <span className="unit-text">SP2D Sukses</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#15803d', display: 'block' }}>
              Rp 1.235.000.000
            </strong>
          </div>
          <div className="yys-kpi-sub" style={{ marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem' }}>
            <span style={{ color: '#15803d' }}>Terverifikasi Bank</span>
            <strong style={{ color: '#0f172a' }}>100% Kliring</strong>
          </div>
        </div>

        {/* Card 5: DITOLAK / BATAL */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">DITOLAK / BATAL</span>
            <div className="yys-kpi-icon-wrap red">
              <XCircle size={17} />
            </div>
          </div>
          <div>
            <div className="yys-kpi-value" style={{ margin: '0.2rem 0' }}>
              <span className="num-large" style={{ color: '#0f172a' }}>1</span>
              <span className="unit-text">Pengajuan</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#b91c1c', display: 'block' }}>
              Rp 17.500.000
            </strong>
          </div>
          <div className="yys-kpi-sub" style={{ marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem' }}>
            <span style={{ color: '#b91c1c' }}>Ketidaksesuaian</span>
            <span style={{ color: '#b91c1c', fontWeight: 600 }}>Di Luar RKAT</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Container */}
      <div className="yys-table-card">
        {/* Tab Row */}
        <div className="yys-tab-row">
          <div className="yys-tab-group">
            <button
              type="button"
              className={`yys-tab-btn ${tab === 'all' ? 'active' : ''}`}
              onClick={() => setTab('all')}
            >
              Semua Permintaan <span className="yys-tab-badge">22</span>
            </button>
            <button
              type="button"
              className={`yys-tab-btn ${tab === 'menunggu' ? 'active' : ''}`}
              onClick={() => setTab('menunggu')}
            >
              Menunggu Otorisasi <span className="yys-tab-badge">3</span>
            </button>
            <button
              type="button"
              className={`yys-tab-btn ${tab === 'transfer' ? 'active' : ''}`}
              onClick={() => setTab('transfer')}
            >
              Disetujui Siap Transfer <span className="yys-tab-badge">2</span>
            </button>
            <button
              type="button"
              className={`yys-tab-btn ${tab === 'cair' ? 'active' : ''}`}
              onClick={() => setTab('cair')}
            >
              Telah Dicairkan <span className="yys-tab-badge">16</span>
            </button>
            <button
              type="button"
              className={`yys-tab-btn ${tab === 'tolak' ? 'active' : ''}`}
              onClick={() => setTab('tolak')}
            >
              Ditolak <span className="yys-tab-badge">1</span>
            </button>
          </div>

          <button
            type="button"
            className="yys-btn-outline"
            onClick={handleExport}
          >
            <FileSpreadsheet size={14} /> Ekspor Rekap (.xlsx)
          </button>
        </div>

        {/* Filter Bar */}
        <div className="yys-filter-box" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.65rem', flex: 1, flexWrap: 'wrap' }}>
            <div className="yys-filter-search" style={{ maxWidth: 380, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="yys-filter-input"
                style={{ paddingLeft: 30 }}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari kode YYS, nama kegiatan, fakultas/unit, atau PIC..."
              />
            </div>

            <select
              className="yys-filter-select"
              style={{ width: 'auto' }}
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              <option value="">Semua Kategori Yayasan</option>
              <option value="Pendidikan & Dev">Pendidikan &amp; Dev</option>
              <option value="Sekretariat/BSDM">Sekretariat/BSDM</option>
              <option value="Sosial & Ummat">Sosial &amp; Ummat</option>
            </select>

            <select
              className="yys-filter-select"
              style={{ width: 'auto' }}
              value={waktuFilter}
              onChange={(e) => setWaktuFilter(e.target.value)}
            >
              <option value="">Semua Waktu (2025)</option>
              <option value="feb">Februari 2025</option>
              <option value="jan">Januari 2025</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.73rem', color: '#64748b' }}>
            <span>Menampilkan: <b>{filtered.length}</b> dari 22 data</span>
            <button
              type="button"
              className="yys-btn-outline"
              onClick={handleReset}
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="yys-table">
            <thead>
              <tr>
                <th>NO. PERMINTAAN &amp; TGL</th>
                <th>UNIT &amp; PIC</th>
                <th>NAMA KEGIATAN &amp; REF SK</th>
                <th>KATEGORI YAYASAN</th>
                <th>NOMINAL DIMINTA</th>
                <th>REALISASI KASIR</th>
                <th>STATUS ALUR</th>
                <th style={{ textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  {/* Col 1: NO. PERMINTAAN & TGL */}
                  <td>
                    <span className="yys-row-id">{r.id}</span>
                    <span className="yys-row-ref" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Calendar size={12} /> {r.tgl}
                    </span>
                  </td>

                  {/* Col 2: UNIT & PIC */}
                  <td>
                    <span className="yys-row-unit">{r.unit}</span>
                    <span className="yys-row-ref">{r.pic}</span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{r.picId}</span>
                  </td>

                  {/* Col 3: NAMA KEGIATAN & REF SK */}
                  <td style={{ maxWidth: 260 }}>
                    <span className="yys-row-prog" title={r.kegiatan}>
                      {r.kegiatanShort || r.kegiatan}
                    </span>
                    {r.isAlertMak ? (
                      <span
                        className="yys-pill-badge red"
                        style={{ fontSize: '0.66rem', marginTop: 3, display: 'inline-block' }}
                      >
                        {r.skRef}
                      </span>
                    ) : (
                      <span className="yys-row-ref" style={{ marginTop: 2 }}>
                        {r.skRef} • MAK: {r.mak}
                      </span>
                    )}
                  </td>

                  {/* Col 4: KATEGORI YAYASAN */}
                  <td>
                    <span
                      className="yys-pill-badge"
                      style={{
                        background:
                          r.kategoriColor === 'purple'
                            ? '#ede9fe'
                            : r.kategoriColor === 'orange'
                            ? '#ffedd5'
                            : '#dbeafe',
                        color:
                          r.kategoriColor === 'purple'
                            ? '#4338ca'
                            : r.kategoriColor === 'orange'
                            ? '#c2410c'
                            : '#1e40af',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: r.kategoriDotColor || '#3b82f6',
                        }}
                      />
                      {r.kategori}
                    </span>
                  </td>

                  {/* Col 5: NOMINAL DIMINTA */}
                  <td>
                    <strong
                      style={{
                        fontSize: '0.84rem',
                        color: r.realisasiStatus === 'rejected' ? '#b91c1c' : '#0f172a',
                        display: 'block',
                      }}
                    >
                      {formatRupiah(r.nominal)}
                    </strong>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{r.terminInfo}</div>
                  </td>

                  {/* Col 6: REALISASI KASIR */}
                  <td>
                    {r.realisasiStatus === 'pending' ? (
                      <span
                        style={{
                          fontSize: '0.71rem',
                          color: '#92400e',
                          background: '#fef3c7',
                          border: '1px solid #fde68a',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Clock size={11} /> {r.realisasiKasir}
                      </span>
                    ) : r.realisasiStatus === 'rejected' ? (
                      <div>
                        <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>Rp 0</strong>
                        <div style={{ fontSize: '0.68rem', color: '#b91c1c', fontWeight: 600 }}>Tidak Dicairkan</div>
                      </div>
                    ) : (
                      <div>
                        <strong style={{ fontSize: '0.82rem', color: '#15803d' }}>{r.realisasiKasir}</strong>
                        <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 600 }}>{r.trxRef}</div>
                      </div>
                    )}
                  </td>

                  {/* Col 7: STATUS ALUR */}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      className="yys-pill-badge"
                      style={{
                        background:
                          r.statusTone === 'green'
                            ? '#dcfce7'
                            : '#fee2e2',
                        color:
                          r.statusTone === 'green'
                            ? '#15803d'
                            : '#991b1b',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.25rem 0.65rem',
                      }}
                    >
                      {r.statusTone === 'green' ? (
                        <Check size={11} />
                      ) : r.statusTone === 'pink' ? (
                        <X size={11} />
                      ) : (
                        <span style={{ width: 6, height: 6, borderRadius: 1, background: '#991b1b', display: 'inline-block' }} />
                      )}
                      {r.statusAlur}
                    </span>
                  </td>

                  {/* Col 8: AKSI */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                      {r.actions.includes('eye') && (
                        <button
                          type="button"
                          className="yys-btn-outline"
                          style={{ padding: '0.3rem 0.55rem', borderRadius: 6 }}
                          title="Lihat Detail Permohonan"
                          onClick={() => navigate(`${BASE}/menunggu/${r.id}`)}
                        >
                          <Eye size={13} color="#1e40af" />
                        </button>
                      )}
                      {r.actions.includes('decide') && (
                        <button
                          type="button"
                          className="yys-btn-action"
                          style={{ background: '#7a0c16', color: '#ffffff', padding: '0.3rem 0.55rem', borderRadius: 6 }}
                          title="Tinjau & Putuskan"
                          onClick={() => navigate(`${BASE}/menunggu/${r.id}`)}
                        >
                          <PenTool size={13} />
                        </button>
                      )}
                      {r.actions.includes('doc') && (
                        <button
                          type="button"
                          className="yys-btn-outline"
                          style={{ padding: '0.3rem 0.55rem', borderRadius: 6 }}
                          title="Bukti SP2D"
                          onClick={() => toast.push(`Menampilkan Bukti Kasir SP2D ${r.id}...`)}
                        >
                          <FileText size={13} />
                        </button>
                      )}
                      {r.actions.includes('download') && (
                        <button
                          type="button"
                          className="yys-btn-outline"
                          style={{ padding: '0.3rem 0.55rem', borderRadius: 6 }}
                          title="Unduh Berkas"
                          onClick={() => toast.push(`Mengunduh berkas lampiran ${r.id}...`)}
                        >
                          <Download size={13} />
                        </button>
                      )}
                      {r.actions.includes('info') && (
                        <button
                          type="button"
                          className="yys-btn-outline"
                          style={{ width: 28, height: 28, padding: 0, borderRadius: '50%', justifyContent: 'center' }}
                          title="Informasi Penolakan"
                          onClick={() => toast.push('Pengajuan ditolak karena berada di luar RKAT yang telah disahkan.')}
                        >
                          <Info size={14} color="#64748b" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="yys-table-foot-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>Menampilkan 1 - 7 dari 22 berkas pencairan kas</span>
            <span>•</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Per halaman:</span>
              <select
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 4,
                  padding: '0.15rem 0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              className="yys-btn-outline"
              style={{ width: 26, height: 26, padding: 0, justifyContent: 'center' }}
              disabled
            >
              &lt;
            </button>
            <span
              style={{
                width: 26,
                height: 26,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#7a0c16',
                color: '#fff',
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              1
            </span>
            <button
              type="button"
              className="yys-btn-outline"
              style={{ width: 26, height: 26, padding: 0, justifyContent: 'center' }}
            >
              2
            </button>
            <button
              type="button"
              className="yys-btn-outline"
              style={{ width: 26, height: 26, padding: 0, justifyContent: 'center' }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="yys-footer-bar">
        <span>© 2025 Yayasan Pendidikan Adzkia • Universitas Adzkia Padang. Hak Cipta Dilindungi.</span>
        <div className="yys-footer-right">
          <span className="yys-footer-badge">
            <Shield size={14} color="#15803d" /> Audit Trail Keuangan Terverifikasi
          </span>
          <span>v2.4.0-ERP</span>
        </div>
      </footer>
    </div>
  );
}
