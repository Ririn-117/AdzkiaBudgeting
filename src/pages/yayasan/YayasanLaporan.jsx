import { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  BookOpen,
  Search,
  RotateCcw,
  Scale,
  Receipt,
  Wallet,
  CheckSquare,
  Shield,
  Check,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import {
  LAPORAN_SUMMARY,
  LAPORAN_PILAR,
  LAPORAN_TABLE_DATA,
  YAYASAN,
} from '../../data/yayasanData';

export default function YayasanLaporan() {
  const toast = useToast();

  // Filters
  const [periode, setPeriode] = useState('Kuartal I & II (Januari - Juni 2025)');
  const [kategori, setKategori] = useState('Semua');
  const [tipeAkun, setTpeAkun] = useState('Semua');
  const [search, setSearch] = useState('');

  // Modals
  const [modalBukuKas, setModalBukuKas] = useState(false);
  const [modalPdf, setModalPdf] = useState(false);

  const handleReset = () => {
    setPeriode('Kuartal I & II (Januari - Juni 2025)');
    setKategori('Semua');
    setTpeAkun('Semua');
    setSearch('');
    toast.push('Filter rekapitulasi laporan dikembalikan ke default.', 'info');
  };

  const handleExportXlsx = () => {
    toast.push('Mengunduh Laporan Rekonsiliasi (.XLSX) Detail...');
  };

  // Filtered rows
  const filteredData = LAPORAN_TABLE_DATA.filter((row) => {
    const matchSearch =
      search === '' ||
      row.unit.toLowerCase().includes(search.toLowerCase()) ||
      row.program.toLowerCase().includes(search.toLowerCase());
    const matchKat =
      kategori === 'Semua' ||
      row.pilar.toLowerCase().includes(kategori.toLowerCase());
    return matchSearch && matchKat;
  });

  return (
    <div className="yys-page">
      {/* Official Top Tag & Breadcrumb Area */}
      <div className="yys-header-area">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="yys-official-badge">
            <Shield size={12} /> DOKUMEN RESMI OTORITAS YAYASAN
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            • Periode Semester Ganjil - Genap 2024/2025
          </span>
        </div>

        {/* Title & 3 Action Buttons */}
        <div className="yys-header-row" style={{ marginTop: '0.25rem' }}>
          <h1 className="yys-title">Laporan Rekonsiliasi & Akuntabilitas Anggaran Yayasan</h1>
          <div className="yys-btn-group-header">
            <button
              type="button"
              className="yys-btn-outline"
              onClick={() => setModalBukuKas(true)}
            >
              <BookOpen size={14} /> Cetak Buku Kas
            </button>
            <button
              type="button"
              className="yys-btn-dark"
              onClick={handleExportXlsx}
            >
              <FileSpreadsheet size={14} /> Ekspor XLSX Detail
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              onClick={() => setModalPdf(true)}
            >
              <Printer size={14} /> Cetak Eksekutif PDF
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="yys-kpi-grid cols-4">
        {/* Card 1: Alokasi Legal RKAT */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">1. ALOKASI LEGAL RKAT</span>
            <div className="yys-kpi-icon-wrap blue">
              <Scale size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(LAPORAN_SUMMARY.alokasiLegalRkat)}</div>
          <div className="yys-kpi-sub">
            <span>{LAPORAN_SUMMARY.alokasiSub}</span>
            <span className="yys-pill-badge blue">{LAPORAN_SUMMARY.alokasiBadge}</span>
          </div>
        </div>

        {/* Card 2: Realisasi Kas Keluar (Kasir) */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">2. REALISASI KAS KELUAR (KASIR)</span>
            <div className="yys-kpi-icon-wrap red">
              <Receipt size={17} />
            </div>
          </div>
          <div className="yys-kpi-value maroon">{formatRupiah(LAPORAN_SUMMARY.realisasiKasKeluar)}</div>
          <div className="yys-kpi-sub">
            <span>{LAPORAN_SUMMARY.realisasiSub}</span>
            <span className="yys-pill-badge red">{LAPORAN_SUMMARY.realisasiBadge}</span>
          </div>
        </div>

        {/* Card 3: Kas Belum Dicairkan (Reserve) */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">3. KAS BELUM DICAIRKAN (RESERVE)</span>
            <div className="yys-kpi-icon-wrap blue">
              <Wallet size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(LAPORAN_SUMMARY.kasBelumDicairkan)}</div>
          <div className="yys-kpi-sub">
            <span>{LAPORAN_SUMMARY.kasBelumSub}</span>
            <span className="yys-pill-badge blue">{LAPORAN_SUMMARY.kasBelumBadge}</span>
          </div>
        </div>

        {/* Card 4: Faktual Kwitansi/LPJ Unit */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">4. FAKTUAL KWITANSI/LPJ UNIT</span>
            <div className="yys-kpi-icon-wrap blue">
              <CheckSquare size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(LAPORAN_SUMMARY.faktualLpjUnit)}</div>
          <div className="yys-kpi-sub">
            <span>{LAPORAN_SUMMARY.faktualSub}</span>
            <span className="yys-pill-badge green">{LAPORAN_SUMMARY.faktualBadge}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="yys-laporan-filter-grid">
        <div>
          <label className="yys-filter-label">Rentang Periode / Kuartal</label>
          <select
            className="yys-filter-select"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          >
            <option>Kuartal I & II (Januari - Juni 2025)</option>
            <option>Kuartal I (Januari - Maret 2025)</option>
            <option>Kuartal II (April - Juni 2025)</option>
            <option>Kuartal III & IV (Juli - Desember 2025)</option>
          </select>
        </div>

        <div>
          <label className="yys-filter-label">Kategori Yayasan</label>
          <select
            className="yys-filter-select"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="Semua">Semua Pilar (Pendidikan, BSDM, Sosial)</option>
            <option value="Pendidikan">Pendidikan & Riset</option>
            <option value="BSDM">Sekretariat & BSDM</option>
            <option value="Sosial">Sosial & Dakwah</option>
          </select>
        </div>

        <div>
          <label className="yys-filter-label">Tipe Akun Beban (COA)</label>
          <select
            className="yys-filter-select"
            value={tipeAkun}
            onChange={(e) => setTpeAkun(e.target.value)}
          >
            <option value="Semua">Semua Tipe Akun Beban</option>
            <option value="5.1">5.1 Beban Akademik & Pengajaran</option>
            <option value="5.2">5.2 Beban Operasional & Sarpras</option>
            <option value="5.3">5.3 Beban Sosial & PKM</option>
          </select>
        </div>

        <div>
          <label className="yys-filter-label">Pencarian Cepat</label>
          <div className="yys-search-wrap">
            <Search size={14} className="icon" />
            <input
              type="text"
              className="yys-filter-input"
              placeholder="Cari nama anggaran / unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            className="yys-btn-outline"
            onClick={handleReset}
            style={{ width: '100%', justifyContent: 'center', height: '36px' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* 3 Pillar Summary Cards */}
      <div className="yys-pilar-grid">
        {LAPORAN_PILAR.map((p) => (
          <div key={p.id} className="yys-pilar-card">
            <div>
              <div className="yys-pilar-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: p.dotColor,
                      display: 'inline-block',
                    }}
                  />
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{p.title}</strong>
                </div>
                <span className="yys-pill-badge blue">{p.badge}</span>
              </div>
              <p className="yys-pilar-sub">{p.subtitle}</p>

              <div className="yys-pilar-stats">
                <div className="yys-pilar-row">
                  <span className="label">Pagu Disetujui:</span>
                  <span className="value">{formatRupiah(p.pagu)}</span>
                </div>
                <div className="yys-pilar-row">
                  <span className="label">Dicairkan Kasir:</span>
                  <span className={`value ${p.dicairkanTone}`}>
                    {formatRupiah(p.dicairkan)} ({p.dicairkanPct})
                  </span>
                </div>
                <div className="yys-pilar-row">
                  <span className="label">Faktual LPJ Sah:</span>
                  <span className="value" style={{ color: '#15803d' }}>
                    {formatRupiah(p.faktualLpj)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="yys-dual-bar-wrap" style={{ marginBottom: '0.35rem' }}>
                <div
                  className={`yys-dual-bar-segment ${p.dicairkanTone === 'maroon' ? 'maroon' : 'blue'}`}
                  style={{ width: `${p.barMaroonPct}%` }}
                />
                <div
                  className="yys-dual-bar-segment cyan"
                  style={{ width: `${p.barCyanPct}%` }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.71rem',
                  color: '#64748b',
                }}
              >
                <span>Terserap Valid: {p.terserapValid}</span>
                <span>SILPA Kas: {p.silpaKas}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Matriks Rekonsiliasi Anggaran per Unit Kerja */}
      <section className="yys-table-card">
        <div className="yys-table-head-area">
          <div>
            <h3 className="yys-table-title">Matriks Rekonsiliasi Anggaran per Unit Kerja</h3>
            <p className="yys-table-sub">
              Audit komparatif 7 Unit Pelaksana Teknis & Akademik Universitas Adzkia
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#15803d' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#15803d' }} />
              Faktual LPJ Lengkap
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#b45309' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
              LPJ Verifikasi Sebagian
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="yys-table yys-rekon-table">
            <thead>
              <tr>
                <th>UNIT KERJA / PROGRAM</th>
                <th>PILAR YAYASAN</th>
                <th>ANGGARAN SAH (RKAT)</th>
                <th>REALISASI KASIR (CAIR)</th>
                <th>KAS BELUM DICAIRKAN</th>
                <th>KWITANSI LPJ SAH</th>
                <th>SILPA / RETUR</th>
                <th>STATUS KEPATUHAN</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.81rem' }}>
                      {row.unit}
                    </strong>
                    <span style={{ fontSize: '0.71rem', color: '#64748b' }}>{row.program}</span>
                  </td>
                  <td>
                    <span className="yys-pill-badge blue" style={{ whiteSpace: 'nowrap' }}>
                      {row.pilar}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.82rem' }}>{formatRupiah(row.anggaranSah)}</strong>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.82rem', color: '#991b1b' }}>
                      {formatRupiah(row.realisasiKasir)}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: '#1e40af', fontWeight: 600 }}>
                      {formatRupiah(row.kasBelumCair)}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.82rem', color: '#15803d' }}>
                      {formatRupiah(row.kwitansiLpj)}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: '#c2410c', fontWeight: 600 }}>
                      {formatRupiah(row.silpaRetur)}
                    </span>
                  </td>
                  <td>
                    <span className={`yys-pill-badge ${row.statusTone}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Total Konsolidasi Row */}
              <tr className="yys-rekon-total">
                <td>TOTAL KONSOLIDASI (TA 2024/2025)</td>
                <td>-</td>
                <td>{formatRupiah(LAPORAN_SUMMARY.alokasiLegalRkat)}</td>
                <td style={{ color: '#991b1b' }}>{formatRupiah(LAPORAN_SUMMARY.realisasiKasKeluar)}</td>
                <td style={{ color: '#1e40af' }}>{formatRupiah(LAPORAN_SUMMARY.kasBelumDicairkan)}</td>
                <td style={{ color: '#15803d' }}>{formatRupiah(LAPORAN_SUMMARY.faktualLpjUnit)}</td>
                <td style={{ color: '#c2410c' }}>{formatRupiah(LAPORAN_SUMMARY.silpaBerjalan)}</td>
                <td>
                  <span className="yys-pill-badge blue">Audit Siap</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

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

      {/* Modal Cetak Buku Kas */}
      <Modal
        open={modalBukuKas}
        title="Cetak Buku Kas Yayasan"
        onClose={() => setModalBukuKas(false)}
        footer={
          <>
            <button
              type="button"
              className="u-btn u-btn-soft"
              onClick={() => setModalBukuKas(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              onClick={() => {
                toast.push('Buku Kas Umum Yayasan berhasil dipersiapkan untuk dicetak.');
                setModalBukuKas(false);
              }}
            >
              Cetak Sekarang
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
          <p>
            Buku Kas Umum Yayasan Pendidikan Adzkia TA 2024/2025 merangkum seluruh pencatatan
            transaksi penerimaan dan pengeluaran perbankan BSI secara kronologis.
          </p>
          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, marginTop: '0.75rem' }}>
            <div><strong>Akun Penampungan:</strong> Bank Syariah Indonesia (BSI) - 7102938491</div>
            <div><strong>Otorisator:</strong> {YAYASAN.name}</div>
            <div><strong>Total Realisasi:</strong> {formatRupiah(LAPORAN_SUMMARY.realisasiKasKeluar)}</div>
          </div>
        </div>
      </Modal>

      {/* Modal Cetak Eksekutif PDF */}
      <Modal
        open={modalPdf}
        title="Cetak Laporan Eksekutif PDF"
        onClose={() => setModalPdf(false)}
        footer={
          <>
            <button
              type="button"
              className="u-btn u-btn-soft"
              onClick={() => setModalPdf(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              onClick={() => {
                toast.push('Laporan Eksekutif PDF berhasil diunduh.');
                setModalPdf(false);
              }}
            >
              Unduh PDF Resmi
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
          <p>
            Dokumen Rekonsiliasi & Akuntabilitas Anggaran ini dilengkapi stempel pengesahan digital
            dan lembar audit trail resmi Yayasan Pendidikan Adzkia.
          </p>
          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, marginTop: '0.75rem' }}>
            <div><strong>Format Dokumen:</strong> Adobe PDF High Resolution (.pdf)</div>
            <div><strong>Total Pagu Konsolidasi:</strong> {formatRupiah(LAPORAN_SUMMARY.alokasiLegalRkat)}</div>
            <div><strong>Terserap Valid:</strong> 64.78% Cair (92.9% LPJ Sah)</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
