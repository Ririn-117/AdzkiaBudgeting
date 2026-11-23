import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  FileText,
  Building,
  User,
  Hash,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Check,
  Ban,
  Clock,
  Calendar,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useYayasan } from '../../context/YayasanContext';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { formatRupiah } from '../../utils/format';
import { BASE } from '../../data/yayasanData';

export default function YayasanKeputusan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { pending, approveRequest, rejectRequest, rekeningKas } = useYayasan();

  // Find item by ID or default to first item
  const item = pending.find((p) => p.id === id) || pending[0];

  const [tindakan, setTindakan] = useState('penuh');
  const [catatan, setCatatan] = useState(
    'Disetujui untuk ditransfer penuh oleh kasir ke rekening operasional PGMI guna persiapan workshop narasumber nasional.'
  );
  const [verified, setVerified] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  if (!item) {
    return (
      <div className="yys-page">
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Pengajuan tidak ditemukan atau telah selesai diproses.</h3>
          <Link to={`${BASE}/menunggu`} className="u-btn u-btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Kembali ke Antrean Menunggu
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verified) {
      toast.push('Harap centang konfirmasi verifikasi likuiditas kas.', 'error');
      return;
    }

    if (tindakan === 'tolak') {
      rejectRequest(item.id, catatan || 'Permintaan pencairan ditolak oleh Ketua Yayasan.');
      toast.push(`Permintaan ${item.id} telah ditolak & dikembalikan.`, 'info');
      navigate(`${BASE}/menunggu`);
      return;
    }

    approveRequest(item.id, catatan);
    toast.push(`Instruksi Kasir SP2D untuk ${item.id} berhasil disahkan & diterbitkan!`);
    navigate(`${BASE}/menunggu`);
  };

  const handleTolakDirect = () => {
    rejectRequest(item.id, catatan || 'Permintaan pencairan ditolak oleh Ketua Yayasan.');
    toast.push(`Permintaan ${item.id} dikembalikan ke WR II / Prodi.`, 'info');
    navigate(`${BASE}/menunggu`);
  };

  return (
    <div className="yys-page">
      {/* Header & Breadcrumb */}
      <div className="yys-header-area">
        <div className="yys-breadcrumb">
          <Link to={BASE}>Portal Yayasan</Link>
          <span>&gt;</span>
          <Link to={`${BASE}/menunggu`}>Menunggu Persetujuan</Link>
          <span>&gt;</span>
          <span className="active">{item.id}</span>
        </div>
        <div className="yys-header-row">
          <div>
            <div className="yys-title-row">
              <h1 className="yys-title">Lembar Keputusan Pencairan Yayasan</h1>
              <span className="yys-pill-badge red" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem' }}>
                MENUNGGU OTORISASI AKHIR
              </span>
            </div>
            <p className="yys-subtitle">
              Dokumen otorisasi pencairan kas bank yayasan atas beban alokasi RAPB Tahun Anggaran 2024/2025.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              type="button"
              className="u-btn u-btn-soft"
              onClick={() => navigate(`${BASE}/menunggu`)}
            >
              <ArrowLeft size={15} /> Kembali ke Daftar
            </button>
            <button
              type="button"
              className="u-btn u-btn-soft"
              onClick={() => window.print()}
            >
              <Printer size={15} /> Cetak Lembar Otorisasi
            </button>
          </div>
        </div>
      </div>

      {/* Main 2 Column Grid */}
      <div className="yys-detail-grid">
        {/* Left Column (65%) */}
        <div>
          {/* Section 1: Header Doc ID & Program Info */}
          <div className="yys-detail-header-card">
            <div className="yys-doc-id-row">
              <div className="yys-doc-id-box">
                <FileText size={24} />
              </div>
              <div className="yys-doc-id-meta" style={{ flex: 1 }}>
                <span className="yys-doc-id-label">NOMOR PENGAJUAN YAYASAN</span>
                <span className="yys-doc-id-number">{item.id}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="yys-pill-badge blue" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {item.kategoriPilar === 'Sosial & Pengabdian' ? 'SOSIAL DAN PENGABDIAN' : 'PENDIDIKAN DAN PENGEMBANGAN'}
                </span>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                  Kategori Yayasan {item.kodeKategori || '#YYS-EDU-04'}
                </div>
              </div>
            </div>

            {/* Nama Program */}
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
                NAMA PROGRAM / KEGIATAN
              </span>
              <h2 style={{ margin: '0.2rem 0 0.5rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35 }}>
                {item.program}
              </h2>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.45 }}>
                {item.deskripsi || item.keperluan}
              </p>
            </div>

            {/* 4 Detail Boxes */}
            <div className="yys-meta-grid-4">
              <div className="yys-meta-box">
                <Building size={18} className="yys-meta-box-icon" />
                <div className="yys-meta-box-content">
                  <span className="yys-meta-box-label">Unit Pengusul (Fakultas • Prodi)</span>
                  <strong className="yys-meta-box-value">{item.unitDetail || item.unit}</strong>
                  <span className="yys-meta-box-sub">{item.faculty}</span>
                </div>
              </div>

              <div className="yys-meta-box">
                <User size={18} className="yys-meta-box-icon" />
                <div className="yys-meta-box-content">
                  <span className="yys-meta-box-label">Penanggung Jawab Kegiatan (PIC)</span>
                  <strong className="yys-meta-box-value">{item.pic}</strong>
                  <span className="yys-meta-box-sub">{item.picDetail || 'Penanggung Jawab Teknis Program'}</span>
                </div>
              </div>

              <div className="yys-meta-box">
                <Hash size={18} className="yys-meta-box-icon" />
                <div className="yys-meta-box-content">
                  <span className="yys-meta-box-label">Referensi Usulan Anggaran Awal</span>
                  <strong className="yys-meta-box-value">{item.ref} (RKA Tahun Berjalan)</strong>
                  <span className="yys-meta-box-sub">SK Otorisasi WR II: No. {item.skWr2}</span>
                </div>
              </div>

              <div className="yys-meta-box">
                <CreditCard size={18} className="yys-meta-box-icon" />
                <div className="yys-meta-box-content">
                  <span className="yys-meta-box-label">Rekening Penampung Tujuan</span>
                  <strong className="yys-meta-box-value">{item.rekeningTujuan || 'BSI 8871-0928-31'}</strong>
                  <span className="yys-meta-box-sub">{item.rekeningTujuanAn || 'a.n. Rekening Operasional Unit (Valid)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Komputasi & Likuiditas */}
          <div className="yys-komputasi-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
                  KOMPUTASI & LIKUIDITAS
                </span>
                <h3 style={{ margin: '0.1rem 0 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Ringkasan Beban Kas & Termin Pencairan
                </h3>
              </div>
              <span className="yys-pill-badge green" style={{ fontSize: '0.72rem' }}>
                ● Kas Yayasan Siap Transfer
              </span>
            </div>

            {/* Maroon Banner */}
            <div className="yys-banner-maroon">
              <div className="yys-banner-maroon-left">
                <span className="yys-banner-maroon-tag">
                  NOMINAL PENCAIRAN YANG DIMINTA ({item.termin ? item.termin.toUpperCase() : 'TERMIN 100% TUNGGAL'})
                </span>
                <div className="yys-banner-maroon-val">
                  {formatRupiah(item.nilaiDiminta)},00
                </div>
                <span className="yys-banner-maroon-sub">
                  Terbilang: {item.terbilang || 'Dua Puluh Lima Juta Rupiah Bersih (Beban Pajak PPh 21 Ditanggung Panitia Sesuai SBM)'}
                </span>
              </div>

              <div className="yys-banner-maroon-badge">
                <span>SKEMA REALISASI</span>
                <strong>{item.skemaRealisasi || 'Sekaligus (Lunas)'}</strong>
                <small>{item.skemaSub || 'Tanpa Termin Lanjutan'}</small>
              </div>
            </div>

            {/* 4 Submetrics */}
            <div className="yys-submetrics-4">
              <div className="yys-submetric-card">
                <div className="yys-submetric-label">Pagu Disetujui WR II</div>
                <div className="yys-submetric-val">{formatRupiah(item.paguDisetujui || item.nilaiDiminta)}</div>
                <div className="yys-submetric-sub">Alokasi Definitif</div>
              </div>

              <div className="yys-submetric-card">
                <div className="yys-submetric-label">Dicairkan Terdahulu</div>
                <div className="yys-submetric-val">Rp 0</div>
                <div className="yys-submetric-sub" style={{ color: '#64748b' }}>Belum Ada Riwayat</div>
              </div>

              <div className="yys-submetric-card">
                <div className="yys-submetric-label">Beban Pencairan Ini</div>
                <div className="yys-submetric-val" style={{ color: '#7a0c16' }}>{formatRupiah(item.nilaiDiminta)}</div>
                <div className="yys-submetric-sub">
                  {item.sisaPagu > 0 ? '60% Porsi Pagu' : '100% Porsi Pagu'}
                </div>
              </div>

              <div className="yys-submetric-card">
                <div className="yys-submetric-label">Sisa Pagu Pasca Cair</div>
                <div className="yys-submetric-val" style={{ color: item.sisaPagu > 0 ? '#1d4ed8' : '#15803d' }}>
                  {formatRupiah(item.sisaPagu)}
                </div>
                <div className="yys-submetric-sub">
                  {item.sisaPagu > 0 ? 'Tersisa Termin 2' : 'Pagu Terserap Penuh'}
                </div>
              </div>
            </div>

            {/* Sumber Rekening Pengeluaran */}
            <div className="yys-sumber-rek-bar">
              <div className="yys-sumber-rek-left">
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 7,
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Landmark size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.67rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    SUMBER REKENING PENGELUARAN YAYASAN
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                    {rekeningKas.giroUtama || 'BSI Giro Utama Yayasan Adzkia (100-2918-251)'}
                  </strong>
                  <div style={{ fontSize: '0.71rem', color: '#64748b' }}>
                    Saldo Tercatat: {formatRupiah(rekeningKas.saldoTercatat || 1482390150)} • Status: Likuid & Aman
                  </div>
                </div>
              </div>

              <span className="yys-pill-badge green" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                <Check size={13} /> Validasi Saldo: Memenuhi
              </span>
            </div>
          </div>

          {/* Section 3: Audit Trail Dokumen */}
          <div className="yys-audit-docs-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
                  AUDIT TRAIL DOKUMEN
                </span>
                <h3 style={{ margin: '0.1rem 0 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Verifikasi Berkas & Tanda Tangan Elektronik
                </h3>
              </div>
              <span className="yys-pill-badge blue" style={{ fontSize: '0.72rem' }}>
                {(item.auditDocs && item.auditDocs.length) || 4} dari {(item.auditDocs && item.auditDocs.length) || 4} Dokumen Sah
              </span>
            </div>

            {/* List 4 Documents */}
            {(item.auditDocs || []).map((doc, idx) => (
              <div key={doc.id || idx} className="yys-doc-item">
                <div className="yys-doc-left">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 7,
                      background: doc.tone === 'red' ? '#fee2e2' : '#eff6ff',
                      color: doc.tone === 'red' ? '#991b1b' : '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={17} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a', display: 'block' }}>
                      {doc.name}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {doc.ref} • <span style={{ color: '#15803d', fontWeight: 600 }}>✓ {doc.validText}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="u-btn u-btn-sm u-btn-soft"
                  onClick={() => setPreviewDoc(doc)}
                >
                  {doc.actionLabel || 'Pratinjau PDF'}
                </button>
              </div>
            ))}
          </div>

          {/* Section 4: Riwayat Alur Permintaan & Telaah */}
          <div className="yys-timeline-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Riwayat Alur Permintaan & Telaah
              </h3>
              <span style={{ fontSize: '0.73rem', color: '#64748b' }}>TA 2024/2025 Genap</span>
            </div>

            <div className="yys-timeline-list">
              {(item.timeline || []).map((tl, i) => (
                <div key={i} className="yys-tl-item">
                  <div className={`yys-tl-dot ${tl.tone === 'red' ? 'red' : ''}`}>
                    {tl.tone === 'red' ? (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    ) : (
                      <Check size={12} />
                    )}
                  </div>
                  <div className="yys-tl-header">
                    <span className="yys-tl-date">{tl.date}</span>
                    <span
                      className="yys-pill-badge"
                      style={{
                        background: tl.tone === 'red' ? '#fee2e2' : '#fef3c7',
                        color: tl.tone === 'red' ? '#991b1b' : '#b45309',
                        fontSize: '0.67rem',
                      }}
                    >
                      {tl.tag}
                    </span>
                  </div>
                  <p className="yys-tl-text">{tl.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (35%) */}
        <div>
          {/* Card 1: Plafon Kategori Yayasan */}
          <div className="yys-table-card" style={{ padding: '1.15rem 1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                Plafon Kategori Yayasan
              </h4>
              <span className="yys-pill-badge green" style={{ fontSize: '0.68rem' }}>
                Kuota Aman
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px dashed #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Kategori: {item.kategoriPilar}</span>
                <strong>Pagu Rp 750 Jt</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Sisa Alokasi Yayasan:</span>
                <strong style={{ color: '#15803d', fontSize: '0.85rem' }}>
                  {formatRupiah((item.plafonCategory && item.plafonCategory.sisaCategory) || 325000000)}
                </strong>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem 0.8rem', borderRadius: 7, fontSize: '0.72rem', color: '#475569', lineHeight: 1.45, borderLeft: '3px solid #3b82f6' }}>
              ℹ Persetujuan ini akan menerbitkan Surat Perintah Pencairan Dana (SP2D Kasir) ke Bagian Keuangan Rektorat untuk proses kliring / transfer perbankan.
            </div>
          </div>

          {/* Card 2: Form Keputusan Otorisator */}
          <form className="yys-form-decision-card" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7a0c16' }} />
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                Form Keputusan Otorisator
              </h3>
            </div>

            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
              TINDAKAN OTORISASI
            </span>

            {/* 4 Radio Options */}
            <div className="yys-radio-group">
              <label className={`yys-radio-label ${tindakan === 'penuh' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="tindakan"
                  value="penuh"
                  checked={tindakan === 'penuh'}
                  onChange={() => setTindakan('penuh')}
                />
                <div className="yys-radio-info">
                  <strong>Setujui Pencairan Penuh</strong>
                  <span style={{ color: '#7a0c16', fontWeight: 700 }}>
                    {formatRupiah(item.nilaiDiminta)} (100% Pagu)
                  </span>
                </div>
              </label>

              <label className={`yys-radio-label ${tindakan === 'bertahap' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="tindakan"
                  value="bertahap"
                  checked={tindakan === 'bertahap'}
                  onChange={() => setTindakan('bertahap')}
                />
                <div className="yys-radio-info">
                  <strong>Setujui Pencairan Bertahap</strong>
                  <span>Otorisasi sebagian (misal: 50% termin 1)</span>
                </div>
              </label>

              <label className={`yys-radio-label ${tindakan === 'tolak' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="tindakan"
                  value="tolak"
                  checked={tindakan === 'tolak'}
                  onChange={() => setTindakan('tolak')}
                />
                <div className="yys-radio-info">
                  <strong style={{ color: '#991b1b' }}>Tolak Permintaan Pencairan</strong>
                  <span>Kembalikan ke WR II / Prodi</span>
                </div>
              </label>

              <label className={`yys-radio-label ${tindakan === 'tunda' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name="tindakan"
                  value="tunda"
                  checked={tindakan === 'tunda'}
                  onChange={() => setTindakan('tunda')}
                />
                <div className="yys-radio-info">
                  <strong>Tunda / Klarifikasi Kasir</strong>
                  <span>Minta konfirmasi jadwal likuiditas giro</span>
                </div>
              </label>
            </div>

            {/* Catatan Lembar Keputusan */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                <span>Catatan Lembar Keputusan</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>Maks. 250 karakter</span>
              </div>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                maxLength={250}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.77rem',
                  lineHeight: 1.4,
                  fontFamily: 'inherit',
                  color: '#334155',
                }}
              />
            </div>

            {/* Checkbox verification */}
            <div style={{ background: '#f8fafc', padding: '0.65rem 0.75rem', borderRadius: 7, border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.72rem', color: '#334155', lineHeight: 1.4 }}>
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span>
                  Saya menyatakan telah memverifikasi ketersediaan likuiditas kas Yayasan Pendidikan Adzkia dan menyetujui penerbitan instruksi transfer bank resmi.
                </span>
              </label>
            </div>

            {/* Submit Action Buttons */}
            <button type="submit" className="yys-btn-submit-decision">
              <Check size={16} /> Setujui & Terbitkan Instruksi Kasir
            </button>

            <button type="button" className="yys-btn-reject-decision" onClick={handleTolakDirect}>
              <Ban size={14} /> Tolak Permintaan
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.85rem' }}>
              Tercatat pada Buku Induk Pengeluaran Yayasan • ID #APPR-YYS-8921
            </div>
          </form>
        </div>
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

      {/* Modal Preview Document */}
      {previewDoc && (
        <Modal
          open={!!previewDoc}
          title={`Pratinjau Dokumen: ${previewDoc.name}`}
          onClose={() => setPreviewDoc(null)}
          footer={
            <button type="button" className="u-btn u-btn-primary" onClick={() => setPreviewDoc(null)}>
              Tutup Pratinjau
            </button>
          }
        >
          <div style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#334155' }}>
            <p><strong>Nomor Referensi:</strong> {previewDoc.ref}</p>
            <p><strong>Status Validasi:</strong> <span style={{ color: '#15803d', fontWeight: 600 }}>{previewDoc.validText}</span></p>
            <div style={{ padding: '2rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, textAlign: 'center', color: '#64748b', marginTop: '1rem' }}>
              <FileText size={36} color="#7a0c16" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
              <p style={{ margin: 0 }}>Salinan digital dokumen {previewDoc.name} telah diverifikasi dan tersimpan pada arsip cloud universitas.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
