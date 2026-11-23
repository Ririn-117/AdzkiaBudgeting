import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  CheckCheck,
  RefreshCw,
  Sliders,
  PenTool,
  Download,
  BarChart3,
  Copy,
  Send,
  Bell,
  Smartphone,
  Shield,
  Check,
  AlertTriangle,
  Landmark,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import {
  NOTIFIKASI_KPI,
  NOTIFIKASI_LIST,
  NOTIFIKASI_BSI_CMS,
  YAYASAN,
  BASE,
} from '../../data/yayasanData';

export default function YayasanNotifikasi() {
  const toast = useToast();
  const navigate = useNavigate();

  // Active filter tab
  const [activeTab, setActiveTab] = useState('all');

  // Channel configuration modal
  const [configModal, setConfigModal] = useState(false);

  // Preference checkboxes
  const [prefs, setPrefs] = useState({
    nominalAlert: true,
    slaAlert: true,
    rekapAlert: false,
    emailCc: true,
  });

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyRek = () => {
    navigator.clipboard?.writeText(NOTIFIKASI_BSI_CMS.rekNo);
    toast.push(`Nomor rekening ${NOTIFIKASI_BSI_CMS.rekNo} berhasil disalin!`, 'info');
  };

  const handleTestWa = () => {
    toast.push('Sinyal uji WhatsApp Gateway berhasil dikirimkan ke nomor terdaftar.');
  };

  const handleSavePrefs = () => {
    toast.push('Preferensi saluran notifikasi berhasil disimpan.');
  };

  const handleSyncBank = () => {
    toast.push('Sinkronisasi saldo & mutasi BSI CMS selesai diperbarui.');
  };

  const handleMarkAllRead = () => {
    toast.push('Semua notifikasi ditandai sebagai telah dibaca.', 'info');
  };

  // Filter items based on tab
  const filteredList = NOTIFIKASI_LIST.filter((item) => {
    if (activeTab === 'pencairan') return item.type === 'pencairan';
    if (activeTab === 'sla') return item.type === 'peringatan';
    if (activeTab === 'unread') return item.id === 'notif-1' || item.id === 'notif-2' || item.id === 'notif-3' || item.id === 'notif-4';
    return true;
  });

  return (
    <div className="yys-page">
      {/* Top Header Label & Title */}
      <div className="yys-header-area">
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
          SISTEM YAYASAN &gt; PUSAT NOTIFIKASI &amp; DISPATCH OTORISASI
        </div>

        <div className="yys-header-row" style={{ marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="yys-title">Otorisasi &amp; Peringatan Keuangan</h1>
            <span className="yys-pill-badge red">4 Menunggu Tindakan</span>
          </div>

          <div className="yys-btn-group-header">
            <button
              type="button"
              className="yys-btn-outline"
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={14} /> Tandai Semua Dibaca
            </button>
            <button
              type="button"
              className="yys-btn-outline"
              onClick={handleSyncBank}
            >
              <RefreshCw size={14} /> Sinkronkan Bank
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              onClick={() => setConfigModal(true)}
            >
              <Sliders size={14} /> Konfigurasi Saluran
            </button>
          </div>
        </div>
      </div>

      {/* 3 KPI Metric Cards */}
      <div className="yys-kpi-grid cols-3">
        {/* Card 1: Nilai Menunggu Approval */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">NILAI MENUNGGU APPROVAL</span>
            <div className="yys-kpi-icon-wrap red">
              <CreditCard size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(NOTIFIKASI_KPI.nilaiMenunggu)}</div>
          <div className="yys-kpi-sub">
            <span>
              <strong>{NOTIFIKASI_KPI.pengajuanMenunggu} Pengajuan</strong> telah diverifikasi WR II
            </span>
          </div>
        </div>

        {/* Card 2: SLA Otorisasi Kasir */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">SLA OTORISASI KASIR</span>
            <div className="yys-kpi-icon-wrap blue">
              <Clock size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{NOTIFIKASI_KPI.slaSisaJam} Jam Sisa</div>
          <div className="yys-kpi-sub">
            <span>Batas waktu SP2D Operasional Kampus</span>
          </div>
        </div>

        {/* Card 3: Disalurkan BSI Hari Ini */}
        <div className="yys-kpi-card">
          <div className="yys-kpi-top">
            <span className="yys-kpi-title">DISALURKAN BSI HARI INI</span>
            <div className="yys-kpi-icon-wrap green">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div className="yys-kpi-value">{formatRupiah(NOTIFIKASI_KPI.disalurkanHariIni)}</div>
          <div className="yys-kpi-sub" style={{ color: '#15803d' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={13} /> SP2D Wisuda BAAK Berhasil
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Filter Row */}
      <div className="yys-notif-tabs-row">
        <div className="yys-notif-tabs">
          <button
            type="button"
            className={`yys-notif-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Semua Notifikasi (14)
          </button>
          <button
            type="button"
            className={`yys-notif-tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Belum Dibaca
            <span className="yys-pill-badge red" style={{ padding: '0 0.35rem' }}>4</span>
          </button>
          <button
            type="button"
            className={`yys-notif-tab ${activeTab === 'pencairan' ? 'active' : ''}`}
            onClick={() => setActiveTab('pencairan')}
          >
            Pencairan Kas (6)
          </button>
          <button
            type="button"
            className={`yys-notif-tab ${activeTab === 'sla' ? 'active' : ''}`}
            onClick={() => setActiveTab('sla')}
          >
            Peringatan Likuiditas (2)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', color: '#64748b' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          Auto-refresh aktif
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="yys-notif-layout">
        {/* Left Column: Notification Feed */}
        <div>
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`yys-notif-card ${item.accentBorder ? 'amber-accent' : ''}`}
            >
              {/* Card Header Tag Row */}
              <div className="yys-notif-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`yys-pill-badge ${item.tagTone}`}>
                    {item.tag}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• {item.time}</span>
                  {item.periodBadge && (
                    <span className="yys-pill-badge blue">{item.periodBadge}</span>
                  )}
                </div>

                {item.skWr2 && (
                  <span style={{ fontSize: '0.71rem', color: '#15803d', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={12} /> {item.skWr2}
                  </span>
                )}
                {item.slaAlert && (
                  <span style={{ fontSize: '0.71rem', color: '#b91c1c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertTriangle size={12} /> {item.slaAlert}
                  </span>
                )}
                {item.trxId && (
                  <span style={{ fontSize: '0.71rem', color: '#1e40af', fontWeight: 600 }}>
                    {item.trxId}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="yys-notif-card-body">
                <div className="yys-notif-main-content">
                  <h3 className="yys-notif-title">{item.title}</h3>
                  <p className="yys-notif-desc">{item.description}</p>

                  {/* Progress bar for SLA */}
                  {item.slaUsedPct && (
                    <div style={{ margin: '0.5rem 0 0.65rem' }}>
                      <div style={{ height: 6, background: '#fef3c7', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.slaUsedPct}%`, background: '#f59e0b', borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 600, display: 'block', marginTop: 3 }}>
                        {item.slaLabel}
                      </span>
                    </div>
                  )}

                  {/* 3 Mini Boxes for Rekonsiliasi */}
                  {item.boxes && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.6rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      {item.boxes.map((b) => (
                        <div
                          key={b.label}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6,
                            padding: '0.45rem 0.6rem',
                            fontSize: '0.72rem',
                          }}
                        >
                          <div style={{ color: '#64748b', fontSize: '0.67rem' }}>{b.label}</div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{b.val}</div>
                          <div style={{ color: '#15803d', fontSize: '0.67rem' }}>{b.sub}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Meta tags */}
                  {(item.kodeAkun || item.sumber) && (
                    <div className="yys-notif-meta-tags">
                      {item.kodeAkun && (
                        <span className="yys-notif-meta-item">{item.kodeAkun}</span>
                      )}
                      {item.sumber && (
                        <span className="yys-notif-meta-item">{item.sumber}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action / Nominal */}
                <div className="yys-notif-right-action">
                  {item.nominal && (
                    <div>
                      <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>
                        {item.nominalPrefix || 'NOMINAL PENCAIRAN'}
                      </span>
                      <span className="yys-notif-right-nominal" style={{ color: item.nominalTone === 'green' ? '#15803d' : '#0f172a' }}>
                        {formatRupiah(item.nominal)}
                      </span>
                    </div>
                  )}

                  {item.nominalLabel && (
                    <div>
                      <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block' }}>
                        {item.nominalLabel}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                        {item.nominalVal}
                      </strong>
                    </div>
                  )}

                  {/* Action buttons */}
                  {item.actionType === 'otorisasi' && (
                    <div className="yys-notif-btn-row">
                      <button
                        type="button"
                        className="yys-btn-otorisasi-mini"
                        onClick={() => navigate(`${BASE}/menunggu/${item.refId}`)}
                      >
                        <PenTool size={12} /> Otorisasi
                      </button>
                      <button
                        type="button"
                        className="yys-btn-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                        onClick={() => navigate(`${BASE}/menunggu/${item.refId}`)}
                      >
                        Detail
                      </button>
                    </div>
                  )}

                  {item.actionType === 'proses_segera' && (
                    <button
                      type="button"
                      className="yys-btn-proses-segera"
                      onClick={() => navigate(`${BASE}/menunggu`)}
                    >
                      ! Proses Segera
                    </button>
                  )}

                  {item.actionType === 'unduh_bukti' && (
                    <button
                      type="button"
                      className="yys-btn-outline"
                      style={{ padding: '0.35rem 0.65rem' }}
                      onClick={() => toast.push('Mengunduh Bukti Transfer BSI (#ADT-8831)...')}
                    >
                      <Download size={12} /> Unduh Bukti
                    </button>
                  )}

                  {item.actionType === 'telaah_laporan' && (
                    <button
                      type="button"
                      className="yys-btn-outline"
                      style={{ padding: '0.35rem 0.65rem' }}
                      onClick={() => navigate(`${BASE}/laporan`)}
                    >
                      <BarChart3 size={12} /> Telaah Laporan
                    </button>
                  )}

                  {item.statusBadge && (
                    <span className="yys-pill-badge green" style={{ marginTop: 4 }}>
                      {item.statusBadge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: 3 Widgets */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Card 1: Rekening Kas Utama Yayasan */}
          <div className="yys-table-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Landmark size={17} color="#1e40af" />
                <strong style={{ fontSize: '0.76rem', color: '#0f172a', letterSpacing: '0.02em' }}>
                  REKENING KAS UTAMA YAYASAN
                </strong>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#15803d', fontSize: '0.72rem', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                Online
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: '#334155' }}>
              <strong>{NOTIFIKASI_BSI_CMS.bankName}</strong>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.2rem 0' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
                  {NOTIFIKASI_BSI_CMS.rekNo}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRek}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                  title="Salin No. Rekening"
                >
                  <Copy size={14} />
                </button>
              </div>
              <span style={{ fontSize: '0.71rem', color: '#64748b' }}>{NOTIFIKASI_BSI_CMS.atasNama}</span>
            </div>

            {/* Blue Saldo CMS Box */}
            <div className="yys-bsi-cms-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.71rem', color: '#1e40af', fontWeight: 600 }}>
                  Saldo Efektif Penampungan
                </span>
                <span className="yys-pill-badge blue" style={{ padding: '0.1rem 0.4rem', fontSize: '0.62rem' }}>
                  Real-time CMS
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {formatRupiah(NOTIFIKASI_BSI_CMS.saldoEfektif)}
              </div>
              <div style={{ fontSize: '0.71rem', color: '#b91c1c', fontWeight: 600, marginTop: '0.25rem' }}>
                Komitmen Pencairan Hari Ini: - {formatRupiah(NOTIFIKASI_BSI_CMS.komitmenHariIni)}
              </div>
            </div>

            {/* Sparkline Curve */}
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.71rem', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Fluktuasi Kas Keluar (7 Hari Terakhir)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Rata-rata: {NOTIFIKASI_BSI_CMS.avgHarian}</span>
              </div>
              <svg viewBox="0 0 280 45" style={{ width: '100%', height: '42px', overflow: 'visible' }}>
                <path
                  d="M0,35 Q35,40 70,25 T140,20 T210,32 T280,10"
                  fill="none"
                  stroke="#7a0c16"
                  strokeWidth="2.5"
                />
                <circle cx="280" cy="10" r="3.5" fill="#7a0c16" />
              </svg>
            </div>
          </div>

          {/* Card 2: WhatsApp Gateway Otorisator */}
          <div className="yys-table-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Smartphone size={17} color="#15803d" />
                <strong style={{ fontSize: '0.76rem', color: '#0f172a', letterSpacing: '0.02em' }}>
                  WHATSAPP GATEWAY OTORISATOR
                </strong>
              </div>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            </div>

            <div className="yys-wa-gateway-box">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Smartphone size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>
                  {YAYASAN.short}
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>
                  {YAYASAN.phone.replace('8888', 'XXXX')}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.73rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status Node Gateway:</span>
                <strong style={{ color: '#15803d' }}>Tersambung (WABA Univ)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Pesan Terkirim Hari Ini:</span>
                <strong>6 Notifikasi</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Otorisasi OTP 2-FA:</span>
                <strong style={{ color: '#15803d' }}>Aktif</strong>
              </div>
            </div>

            <button
              type="button"
              className="yys-btn-dark"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '1rem',
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
              }}
              onClick={handleTestWa}
            >
              <Send size={13} /> Uji Kirim Sinyal WA
            </button>
          </div>

          {/* Card 3: Preferensi Saluran Cepat */}
          <div className="yys-table-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Bell size={16} color="#7a0c16" />
                <strong style={{ fontSize: '0.76rem', color: '#0f172a', letterSpacing: '0.02em' }}>
                  PREFERENSI SALURAN CEPAT
                </strong>
              </div>
              <button
                type="button"
                onClick={handleSavePrefs}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7a0c16',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Simpan
              </button>
            </div>

            <div>
              <div className="yys-pref-row">
                <input
                  type="checkbox"
                  className="yys-pref-checkbox"
                  checked={prefs.nominalAlert}
                  onChange={() => togglePref('nominalAlert')}
                />
                <div>
                  <strong style={{ fontSize: '0.76rem', color: '#0f172a', display: 'block' }}>
                    Pencairan &gt; Rp 20.000.000
                  </strong>
                  <span style={{ fontSize: '0.69rem', color: '#64748b' }}>
                    Kirim peringatan instan prioritas tinggi ke WA
                  </span>
                </div>
              </div>

              <div className="yys-pref-row">
                <input
                  type="checkbox"
                  className="yys-pref-checkbox"
                  checked={prefs.slaAlert}
                  onChange={() => togglePref('slaAlert')}
                />
                <div>
                  <strong style={{ fontSize: '0.76rem', color: '#0f172a', display: 'block' }}>
                    Peringatan Menjelang SLA 24 Jam
                  </strong>
                  <span style={{ fontSize: '0.69rem', color: '#64748b' }}>
                    Notifikasi eskalasi sebelum kliring harian berakhir
                  </span>
                </div>
              </div>

              <div className="yys-pref-row">
                <input
                  type="checkbox"
                  className="yys-pref-checkbox"
                  checked={prefs.rekapAlert}
                  onChange={() => togglePref('rekapAlert')}
                />
                <div>
                  <strong style={{ fontSize: '0.76rem', color: '#0f172a', display: 'block' }}>
                    Rekap Alokasi Kas Bebas
                  </strong>
                  <span style={{ fontSize: '0.69rem', color: '#64748b' }}>
                    Laporan periodik 3 pos neraca yayasan
                  </span>
                </div>
              </div>

              <div className="yys-pref-row">
                <input
                  type="checkbox"
                  className="yys-pref-checkbox"
                  checked={prefs.emailCc}
                  onChange={() => togglePref('emailCc')}
                />
                <div>
                  <strong style={{ fontSize: '0.76rem', color: '#0f172a', display: 'block' }}>
                    Salinan Email ke Sekretariat
                  </strong>
                  <span style={{ fontSize: '0.69rem', color: '#64748b' }}>
                    Cc: yayasan.adzkia@padang.ac.id
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
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

      {/* Modal Konfigurasi Saluran */}
      <Modal
        open={configModal}
        title="Konfigurasi Saluran Dispatch Otorisasi"
        onClose={() => setConfigModal(false)}
        footer={
          <>
            <button
              type="button"
              className="u-btn u-btn-soft"
              onClick={() => setConfigModal(false)}
            >
              Tutup
            </button>
            <button
              type="button"
              className="yys-btn-rekap"
              onClick={() => {
                toast.push('Konfigurasi saluran berhasil diperbarui.');
                setConfigModal(false);
              }}
            >
              Terapkan Konfigurasi
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
          <p>
            Konfigurasi dispatch otorisasi mengatur integrasi webhook WhatsApp Cloud API,
            SMS Gateway BSI, serta distribusi email ber-TTE resmi Ketua Yayasan.
          </p>
          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, marginTop: '0.75rem' }}>
            <div><strong>Nomor Otorisator:</strong> {YAYASAN.phone}</div>
            <div><strong>Email Induk:</strong> {YAYASAN.email}</div>
            <div><strong>Endpoint Node:</strong> https://waba.adzkia.ac.id/v1/dispatch</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
