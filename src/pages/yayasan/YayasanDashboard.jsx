import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  BellRing,
  Hourglass,
  ShieldCheck,
  GraduationCap,
  Building2,
  HeartHandshake,
  PenTool,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Shield,
  Home,
  Check,
  Clock,
  Landmark,
  Download,
} from 'lucide-react';
import { useYayasan } from '../../context/YayasanContext';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { formatRupiah } from '../../utils/format';
import { BASE, TA, YAYASAN } from '../../data/yayasanData';

export default function YayasanDashboard() {
  const {
    summary,
    categories,
    chartData,
    pending,
    logs,
    rekeningKas,
    approveRequest,
    rejectRequest,
  } = useYayasan();

  const toast = useToast();
  const navigate = useNavigate();

  // Top 3 pending requests for the main dashboard overview
  const dashboardPending = pending.slice(0, 3);

  // Modal states
  const [downloadModal, setDownloadModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [tteAgreed, setTteAgreed] = useState(false);

  const openReview = (item) => {
    setActiveItem(item);
    setReviewNote('');
    setTteAgreed(false);
  };

  const handleApprove = () => {
    if (!tteAgreed) {
      toast.push('Harap centang persetujuan otorisasi digital (TTE).', 'error');
      return;
    }
    approveRequest(activeItem.id, reviewNote);
    toast.push(`Pengajuan ${activeItem.id} berhasil disetujui & diteruskan ke Kasir BSI.`);
    setActiveItem(null);
  };

  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast.push('Harap berikan catatan revisi atau penyesuaian.', 'error');
      return;
    }
    rejectRequest(activeItem.id, reviewNote);
    toast.push(`Pengajuan ${activeItem.id} dikembalikan untuk penyesuaian.`, 'info');
    setActiveItem(null);
  };

  return (
    <div className="yys-page">
      {/* Breadcrumb & Title with Right Download Button */}
      <div className="yys-header-area">
        <div className="yys-breadcrumb">
          <Link to={BASE}>
            <Home size={14} style={{ verticalAlign: 'middle', marginRight: 2 }} /> Beranda
          </Link>
          <span>/</span>
          <span className="active">Dashboard Yayasan</span>
        </div>
        <div className="yys-header-row">
          <h1 className="yys-title">Dashboard Pengawasan & Persetujuan Pencairan Yayasan</h1>
          <button
            type="button"
            className="yys-btn-rekap"
            onClick={() => setDownloadModal(true)}
          >
            <Download size={15} /> Unduh Rekap Likuiditas
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="yys-dashboard-kpi-grid">
        {/* Card 1 */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TOTAL ANGGARAN LEGAL (WR2/RKAT)</span>
            <div className="yys-kpi-icon-wrap blue">
              <FileText size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(summary.totalAnggaranLegal)}</div>
          <div className="yys-kpi-sub">
            <Check size={14} color="#15803d" />
            <span>38 Program Kerja Aktif</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TELAH DICAIRKAN (KASIR SP2D)</span>
            <div className="yys-kpi-icon-wrap blue">
              <CreditCard size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(summary.telahDicairkan)}</div>
          <div className="yys-kpi-sub">
            <span className="yys-pill-badge blue">69.5%</span>
            <span>Realisasi kumulatif</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">MENUNGGU PERSETUJUAN</span>
            <div className="yys-kpi-icon-wrap red">
              <BellRing size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">
            <span className="num-large">3</span>
            <span className="unit-text">Permintaan</span>
          </div>
          <div className="yys-kpi-sub">
            <span className="yys-pill-badge red">Butuh Otorisasi Yayasan</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">TOTAL NILAI MENUNGGU</span>
            <div className="yys-kpi-icon-wrap red">
              <Hourglass size={17} />
            </div>
          </div>
          <div className="yys-kpi-value maroon">
            {formatRupiah(summary.totalNilaiMenunggu || 127500000)}
          </div>
          <div className="yys-kpi-sub">
            <span>Verifikasi Lapangan WR2 Valid</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">ALOKASI KAS BEBAS</span>
            <div className="yys-kpi-icon-wrap blue">
              <ShieldCheck size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(summary.alokasiKasBebas)}</div>
          <div className="yys-kpi-sub">
            <span className="yys-online-dot" />
            <span>Likuiditas Cadangan Aman</span>
          </div>
        </div>
      </div>

      {/* Ringkasan Anggaran 3 Kategori Resmi Yayasan */}
      <section className="yys-section">
        <div className="yys-section-head">
          <div className="yys-section-title">
            <span className="dot" />
            <span>Ringkasan Anggaran 3 Kategori Resmi Yayasan</span>
          </div>
          <span className="yys-section-sub">
            Statuta & RKAT Yayasan Pendidikan Adzkia TA 2024/2025
          </span>
        </div>

        <div className="yys-pilar-grid">
          {categories.map((p) => {
            const IconComponent =
              p.iconType === 'academic'
                ? GraduationCap
                : p.iconType === 'building'
                ? Building2
                : HeartHandshake;

            return (
              <div key={p.id} className="yys-pilar-card">
                <div>
                  <div className="yys-pilar-card-top">
                    <span className={`yys-pill-badge ${p.badgeTone}`}>
                      {p.pilarBadge}
                    </span>
                    <div className="yys-pilar-icon">
                      <IconComponent size={18} />
                    </div>
                  </div>
                  <h3 className="yys-pilar-heading">{p.title}</h3>
                  <p className="yys-pilar-sub">{p.subtitle}</p>

                  <div className="yys-pilar-stats">
                    <div className="yys-pilar-row">
                      <span className="label">Pagu Anggaran Disetujui</span>
                      <span className="value">{formatRupiah(p.pagu)}</span>
                    </div>
                    <div className="yys-pilar-row">
                      <span className="label">Total Dicairkan (SP2D)</span>
                      <span className={`value ${p.id === 'pilar-1' ? 'red' : 'blue'}`}>
                        {formatRupiah(p.dicairkan)}
                      </span>
                    </div>
                    <div className="yys-pilar-row">
                      <span className="label">Sisa Saldo Kas Kategori</span>
                      <span className="value blue">{formatRupiah(p.sisa)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="yys-pilar-progress-header">
                    <span className="label">Rasio Penyerapan</span>
                    <span className="pct">{p.rasio}%</span>
                  </div>
                  <div className="yys-pilar-bar-bg">
                    <div
                      className="yys-pilar-bar-fill"
                      style={{
                        width: `${p.rasio}%`,
                        background: p.progressColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visualisasi Komparasi Likuiditas & Pembagian Kategori */}
      <section className="yys-chart-card">
        <div className="yys-chart-head">
          <div>
            <h2 className="yys-chart-title">Visualisasi Komparasi Likuiditas & Pembagian Kategori</h2>
            <p className="yys-chart-desc">
              Perbandingan proporsional antara Pagu Legal Disetujui, Realisasi Pencairan Kasir, dan Cadangan Likuiditas Bebas.
            </p>
          </div>
          <div className="yys-chart-legend">
            <div className="yys-legend-item">
              <span className="yys-legend-color navy" />
              <span>Anggaran Disetujui (Legal RKAT)</span>
            </div>
            <div className="yys-legend-item">
              <span className="yys-legend-color maroon" />
              <span>Telah Dicairkan (SP2D Kasir)</span>
            </div>
            <div className="yys-legend-item">
              <span className="yys-legend-color cyan" />
              <span>Sisa Belum Dicairkan (Kas Tersedia)</span>
            </div>
          </div>
        </div>

        <div className="yys-barchart-wrap">
          {/* Y Axis Labels */}
          <div className="yys-y-axis">
            <span>1.2M</span>
            <span>900Jt</span>
            <span>600Jt</span>
            <span>300Jt</span>
            <span>0</span>
          </div>

          {/* Gridlines */}
          <div className="yys-gridlines">
            <div className="yys-gridline" />
            <div className="yys-gridline" />
            <div className="yys-gridline" />
            <div className="yys-gridline" />
            <div className="yys-gridline" />
          </div>

          {/* Bars clusters */}
          <div className="yys-clusters-container">
            {chartData.map((c) => (
              <div key={c.label} className="yys-cluster">
                <div className="yys-bars-group">
                  {/* Bar 1: Pagu */}
                  <div className="yys-bar-item">
                    <span className="yys-bar-tag">{c.paguLabel}</span>
                    <div
                      className="yys-bar-rect navy"
                      style={{ height: `${c.paguPct}%` }}
                      title={`Pagu: ${formatRupiah(c.pagu)}`}
                    />
                  </div>

                  {/* Bar 2: Dicairkan */}
                  <div className="yys-bar-item">
                    <span className="yys-bar-tag maroon">{c.dicairkanLabel}</span>
                    <div
                      className="yys-bar-rect maroon"
                      style={{ height: `${c.dicairkanPct}%` }}
                      title={`Telah Dicairkan: ${formatRupiah(c.dicairkan)}`}
                    />
                  </div>

                  {/* Bar 3: Sisa */}
                  <div className="yys-bar-item">
                    <span className="yys-bar-tag cyan">{c.sisaLabel}</span>
                    <div
                      className="yys-bar-rect cyan"
                      style={{ height: `${c.sisaPct}%` }}
                      title={`Sisa: ${formatRupiah(c.sisa)}`}
                    />
                  </div>
                </div>
                <div className="yys-cluster-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Column Layout: Left 65%, Right 35% */}
      <div className="yys-bottom-grid">
        {/* Left Column: Permintaan Pencairan Menunggu Keputusan */}
        <section className="yys-table-card">
          <div className="yys-table-head-area">
            <div className="yys-table-title-wrap">
              <div className="yys-table-icon">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="yys-table-title">Permintaan Pencairan Menunggu Keputusan Yayasan</h3>
                <p className="yys-table-sub">
                  3 Berkas Membutuhkan Tanda Tangan Digital & Otorisasi
                </p>
              </div>
            </div>
            <span className="yys-pill-badge red">Prioritas Tinggi</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="yys-table">
              <thead>
                <tr>
                  <th>Identifikasi Pengajuan</th>
                  <th>Unit & Program Kerja</th>
                  <th>Kategori Pilar</th>
                  <th>Nilai Diminta</th>
                  <th>Sisa Pagu</th>
                  <th>Keputusan</th>
                </tr>
              </thead>
              <tbody>
                {dashboardPending.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="yys-row-id">{p.id}</span>
                      <span className="yys-row-ref">{p.ref}</span>
                      <span className="yys-row-termin">{p.termin}</span>
                    </td>
                    <td>
                      <span className="yys-row-unit">{p.unit}</span>
                      <span className="yys-row-prog" title={p.program}>
                        {p.program.length > 35 ? `${p.program.substring(0, 32)}...` : p.program}
                      </span>
                      <span className="yys-row-prior">
                        Pencairan Sblm: {formatRupiah(p.pencairanSblm)}
                      </span>
                    </td>
                    <td>
                      <span className="yys-pill-badge red" style={{ whiteSpace: 'nowrap' }}>
                        {p.kategoriPilar}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.84rem' }}>{formatRupiah(p.nilaiDiminta)}</strong>
                    </td>
                    <td>
                      <span style={{ color: p.sisaPagu > 0 ? '#1e40af' : '#64748b', fontWeight: p.sisaPagu > 0 ? 700 : 400 }}>
                        {formatRupiah(p.sisaPagu)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="yys-btn-action"
                        onClick={() => openReview(p)}
                      >
                        <PenTool size={14} /> Tinjau & Putuskan
                      </button>
                    </td>
                  </tr>
                ))}
                {dashboardPending.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      <CheckCircle2 size={32} color="#15803d" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                      <strong>Semua antrean pencairan telah diputuskan</strong>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.74rem' }}>Tidak ada berkas yang tertunda saat ini.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="yys-table-foot-banner">
            <div className="left-info">
              <Shield size={16} color="#64748b" />
              <span>Semua berkas telah melewati audit teknis WR2 & verifikasi kelayakan bendahara.</span>
            </div>
            <Link to={`${BASE}/permintaan`} className="right-link">
              Lihat Rekapitulasi Menyeluruh <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Right Column: Rekening Kas & Log Persetujuan Terkini */}
        <aside className="yys-right-col">
          {/* Card 1: Rekening Penampungan Kas */}
          <div className="yys-rekening-card">
            <div className="yys-rek-head">
              <div className="yys-rek-brand-wrap">
                <div className="yys-rek-icon">
                  <Landmark size={18} />
                </div>
                <div>
                  <div className="yys-rek-label">REKENING PENAMPUNGAN KAS</div>
                  <div className="yys-rek-bank">{rekeningKas.bank}</div>
                </div>
              </div>
              <span className="yys-online-dot" title="Koneksi API Aktif" />
            </div>

            <div className="yys-rek-rows">
              <div className="yys-rek-row">
                <span className="label">No. Rekening Giro Yayasan</span>
                <span className="val mono">{rekeningKas.noRek}</span>
              </div>
              <div className="yys-rek-row">
                <span className="label">Atas Nama</span>
                <span className="val">{rekeningKas.atasNama}</span>
              </div>
              <div className="yys-rek-row">
                <span className="label">Status Konektivitas API</span>
                <span className="val" style={{ color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Check size={13} /> {rekeningKas.statusKoneksi}
                </span>
              </div>
            </div>

            <div className="yys-rek-notice">{rekeningKas.desc}</div>
          </div>

          {/* Card 2: Log Persetujuan Terkini */}
          <div className="yys-log-card">
            <div className="yys-log-head">
              <div className="yys-log-title">
                <Clock size={16} />
                <span>Log Persetujuan Terkini</span>
              </div>
              <span className="yys-pill-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>
                Bulan Ini
              </span>
            </div>

            <div className="yys-log-list">
              {logs.slice(0, 3).map((l) => (
                <div key={l.id} className="yys-log-item">
                  <div className="yys-log-item-top">
                    <span className={`yys-pill-badge ${l.tone}`}>
                      {l.status}
                    </span>
                    <span className="yys-log-item-time">{l.time}</span>
                  </div>
                  <div className="yys-log-item-title">{l.title}</div>
                  <div className="yys-log-item-meta">
                    <span>{l.ref}</span>
                    <span className="nominal">{formatRupiah(l.nominal)}</span>
                  </div>
                  <p className="yys-log-quote">"{l.note}"</p>
                </div>
              ))}
            </div>

            <Link to={`${BASE}/riwayat`} className="yys-btn-archive">
              <BookOpen size={15} /> Buka Arsip Keputusan Lengkap
            </Link>
          </div>
        </aside>
      </div>

      {/* Footer bar */}
      <footer className="yys-footer-bar">
        <span>© 2025 Yayasan Pendidikan Adzkia • Universitas Adzkia Padang. Hak Cipta Dilindungi.</span>
        <div className="yys-footer-right">
          <span className="yys-footer-badge">
            <Shield size={14} color="#64748b" /> Audit Trail Keuangan Terverifikasi
          </span>
          <span>v2.4.0-ERP</span>
        </div>
      </footer>

      {/* Modal Tinjau & Putuskan */}
      {activeItem && (
        <Modal
          open={!!activeItem}
          title={`Lembar Keputusan Otorisasi: ${activeItem.id}`}
          onClose={() => setActiveItem(null)}
          footer={
            <>
              <button
                type="button"
                className="u-btn u-btn-soft"
                onClick={() => setActiveItem(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="u-btn u-btn-navy"
                onClick={handleReject}
              >
                Minta Revisi
              </button>
              <button
                type="button"
                className="yys-btn-action"
                onClick={handleApprove}
              >
                <PenTool size={14} /> Sahkan & Otorisasi Pencairan
              </button>
            </>
          }
        >
          <div style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#1e293b' }}>
            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Nomor Dokumen:</span>
                <strong style={{ color: '#7a0c16' }}>{activeItem.id} ({activeItem.ref})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Unit / Pemohon:</span>
                <strong>{activeItem.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Nama Program / Kegiatan:</span>
                <strong style={{ maxWidth: '60%', textAlign: 'right' }}>{activeItem.program}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Nominal Pencairan:</span>
                <strong style={{ fontSize: '1rem', color: '#15803d' }}>{formatRupiah(activeItem.nilaiDiminta)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tahapan / Termin:</span>
                <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{activeItem.termin}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, fontSize: '0.78rem' }}>
                Catatan Pengesahan / Catatan Revisi:
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Tuliskan disposisi atau instruksi khusus untuk bendahara/kasir kampus..."
                rows={3}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.77rem', fontWeight: 600, color: '#991b1b' }}>
                <input
                  type="checkbox"
                  checked={tteAgreed}
                  onChange={(e) => setTteAgreed(e.target.checked)}
                />
                Saya mengesahkan pencairan dana ini dengan Tanda Tangan Elektronik (TTE) resmi Ketua Yayasan Pendidikan Adzkia.
              </label>
            </div>
          </div>
        </Modal>
      )}

      {/* Download Rekapitulasi Likuiditas Modal */}
      <Modal
        open={downloadModal}
        title="Unduh Rekapitulasi Likuiditas Yayasan"
        onClose={() => setDownloadModal(false)}
        footer={
          <>
            <button
              type="button"
              className="u-btn u-btn-soft"
              onClick={() => setDownloadModal(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              onClick={() => {
                toast.push('Rekapitulasi Likuiditas berhasil diunduh (PDF).');
                setDownloadModal(false);
              }}
            >
              Ekspor Laporan PDF
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#334155' }}>
          <p style={{ margin: '0 0 0.75rem' }}>
            Laporan ini menyajikan ringkasan eksekutif posisi keuangan Yayasan Pendidikan Adzkia TA 2024/2025 Genap:
          </p>
          <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1rem' }}>
            <li>Total Pagu Legal RKAT: <strong>{formatRupiah(summary.totalAnggaranLegal)}</strong></li>
            <li>Realisasi Dicairkan Kasir: <strong>{formatRupiah(summary.telahDicairkan)} (69.5%)</strong></li>
            <li>Cadangan Kas Bebas: <strong>{formatRupiah(summary.alokasiKasBebas)}</strong></li>
            <li>Rekening Sumber: <strong>{rekeningKas.bank} ({rekeningKas.noRek})</strong></li>
          </ul>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
            Tanda Tangan Elektronik resmi disahkan oleh Ketua Yayasan ({YAYASAN.name}).
          </p>
        </div>
      </Modal>
    </div>
  );
}
