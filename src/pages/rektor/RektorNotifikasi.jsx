import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlarmClock, BadgeCheck, BellOff, CheckCheck, Gauge, Landmark, Mail, MailOpen, MessageCircle, ShieldCheck, SlidersHorizontal, UserRound, Wallet,
} from 'lucide-react';
import { NOTIF_ARCHIVE, NOTIF_SIDE, NOTIF_TABS } from '../../data/rektorData';
import { useRektorNotifications } from '../../context/RektorNotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { ReadOnlyTag, Rich } from '../../components/rektor/RektorParts';

const ICONS = { gauge: Gauge, alarm: AlarmClock, wallet: Wallet, shield: ShieldCheck, landmark: Landmark };
const TAG_TONE = { amber: 'amber', red: 'red', green: 'green', maroon: 'maroon', navy: 'navy' };

export default function RektorNotifikasi() {
  const toast = useToast();
  const { items, archiveLoaded, setRead, markAllRead, loadArchive } = useRektorNotifications();
  const [tab, setTab] = useState('all');
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [prefs, setPrefs] = useState({ digest: true, email: true, wa: true });

  const pool = archiveLoaded ? items : [...items, ...NOTIF_ARCHIVE];
  const match = (n, key) => (key === 'all' ? true : key === 'unread' ? n.unread : n.cat === key);
  const count = (key) => pool.filter((n) => match(n, key)).length;
  const visible = useMemo(
    () => items.filter((n) => match(n, tab)).sort((a, b) => b.order - a.order),
    [items, tab]
  );
  const unread = items.filter((n) => n.unread).length;

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Pengawasan Rektorat' }, { label: 'Notifikasi & Peringatan Dini' }]}
        title="Pusat Notifikasi & Peringatan Dini Eksekutif"
        accent
        badge={<ReadOnlyTag>Protokol Audit: Read Only</ReadOnlyTag>}
        subtitle="Pemberitahuan terpusat mengenai akselerasi serapan RKAT, eskalasi batas waktu telaah, dan keterbukaan tata kelola keuangan universitas."
        actions={
          <>
            <button type="button" className="u-btn u-btn-soft" onClick={() => { markAllRead(); toast.push('Semua notifikasi ditandai telah dibaca.'); }}><CheckCheck size={15} /> Tandai Semua Telah Dibaca</button>
            <button type="button" className="u-btn u-btn-navy" onClick={() => setPrefsOpen(true)}><SlidersHorizontal size={15} /> Preferensi Saluran Ringkasan</button>
          </>
        }
      />

      <div className="rk-grid-main">
        <div className="rk-stack-col">
          <section className="card">
            <div className="u-tabs" role="tablist">
              {NOTIF_TABS.map((t) => (
                <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`u-tab ${tab === t.key ? 'on' : ''}`} onClick={() => setTab(t.key)}>
                  {t.label} <em className={t.key === 'unread' || t.key === 'kritis' ? 'alert' : ''}>{count(t.key)}</em>
                </button>
              ))}
            </div>
          </section>

          {visible.length === 0 && (
            <div className="card u-empty"><BellOff size={30} /><strong>Tidak ada notifikasi</strong>Tidak ada peringatan yang cocok dengan filter ini.</div>
          )}

          {visible.map((n) => {
            const Icon = ICONS[n.icon];
            return (
              <article key={n.id} className={`rk-notif accent-${n.accent} ${n.unread ? 'unread' : ''}`}>
                <span className={`rk-notif-icon accent-${n.accent}`}><Icon size={22} /></span>
                <div className="rk-notif-main">
                  <div className="rk-notif-top">
                    <div className="left">
                      <StatusBadge tone={TAG_TONE[n.tagTone]}>{n.tag}</StatusBadge>
                      <span className="rk-notif-unit">{n.unit}</span>
                      {n.unread && <span className="u-new"><i /> Baru</span>}
                    </div>
                    <time>{n.time}</time>
                  </div>
                  <h3>{n.title}</h3>
                  <p><Rich text={n.body} /></p>

                  {n.meter && (
                    <div className="rk-meter">
                      <div className="row"><span>{n.meter.label}</span><span>{n.meter.text}</span></div>
                      <div className={`u-bar ${n.meter.tone === 'red' ? 'maroon' : 'green'}`}><i style={{ width: `${n.meter.percent}%`, background: n.meter.tone === 'red' ? '#b4121f' : '#f59e0b' }} /></div>
                      <small>{n.meter.foot}</small>
                    </div>
                  )}
                  {n.chips && <div className="rk-chips-row">{n.chips.map((c) => <span key={c}>{c}</span>)}</div>}

                  <div className="rk-notif-foot">
                    <div className="u-actions" style={{ flexWrap: 'wrap' }}>
                      {n.actions.map((a) =>
                        a.to ? (
                          <Link key={a.label} to={a.to} onClick={() => setRead(n.id)} className="u-btn u-btn-sm u-btn-outline">{a.label}</Link>
                        ) : (
                          <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => { setRead(n.id); toast.push(a.toast); }}>{a.label}</button>
                        )
                      )}
                      {n.footnote && <span className="foot-note">{n.footnote}</span>}
                    </div>
                    <button type="button" className="u-iconbtn" aria-label={n.unread ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'} onClick={() => setRead(n.id, n.unread)}>
                      {n.unread ? <MailOpen size={17} /> : <Mail size={17} />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <p className="rk-count-line">Menampilkan {items.length} dari {pool.length} catatan peringatan resmi periode TA 2024/2025</p>
          {!archiveLoaded && (
            <div className="rk-more"><button type="button" className="u-btn u-btn-outline" onClick={loadArchive}>Muat Arsip Lebih Lama</button></div>
          )}
        </div>

        <aside className="rk-stack-col">
          <div className="rk-sync">
            <BadgeCheck size={22} />
            <div><span>INTEGRITAS KAS YAYASAN</span><strong>100% SINKRON</strong><span>Rekonsiliasi BSI & SIMKEU Valid</span></div>
          </div>

          <section className="card rk-side-card">
            <h3>Saluran Diseminasi Pimpinan</h3>
            <p className="rk-cap" style={{ marginBottom: '0.8rem' }}>Pusat peringatan terintegrasi otomatis mengirimkan rangkuman eksekutif pagi setiap hari kerja.</p>
            <div className="rk-kv"><span><Mail size={13} style={{ verticalAlign: '-2px' }} /> Email SSO Rektorat</span><b>{NOTIF_SIDE.email}</b></div>
            <div className="rk-kv"><span><MessageCircle size={13} style={{ verticalAlign: '-2px' }} /> WhatsApp Pimpinan</span><b>{NOTIF_SIDE.whatsapp}</b></div>
            <div className="rk-kv"><span>Jadwal Digest Harian</span><b>Pukul {NOTIF_SIDE.digest}</b></div>
            <button type="button" className="u-btn u-btn-soft u-btn-block" style={{ marginTop: '0.8rem' }} onClick={() => setPrefsOpen(true)}>Ubah Konfigurasi Notifikasi</button>
          </section>

          <section className="card rk-side-card">
            <h3>Beban Pengawasan Saat Ini</h3>
            {NOTIF_SIDE.beban.map((b) => <div key={b.label} className="rk-kv"><span>{b.label}</span><b>{b.value}</b></div>)}
            <div className="rk-kv"><span>Belum dibaca</span><b>{unread}</b></div>
            <p className="rk-cap" style={{ marginTop: '0.6rem' }}>Integritas kas terjamin. Tidak ada saldo program yang defisit maupun pengeluaran di luar pagu yang telah disahkan senat.</p>
          </section>

          <section className="card rk-side-card">
            <h3>Kontak Penting Keuangan</h3>
            {NOTIF_SIDE.kontak.map((k) => (
              <div key={k.name} className="rk-contact">
                <span className="ic"><UserRound size={16} /></span>
                <div><strong>{k.name}</strong><span>{k.role}</span></div>
              </div>
            ))}
          </section>
        </aside>
      </div>

      <Modal
        open={prefsOpen}
        title="Preferensi Saluran Ringkasan"
        onClose={() => setPrefsOpen(false)}
        footer={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={() => setPrefsOpen(false)}>Batal</button>
            <button type="button" className="u-btn u-btn-primary" onClick={() => { setPrefsOpen(false); toast.push('Preferensi saluran disimpan (simulasi).'); }}>Simpan Preferensi</button>
          </>
        }
      >
        {[
          ['digest', `Digest harian pukul ${NOTIF_SIDE.digest}`],
          ['email', `Kirim ke email SSO (${NOTIF_SIDE.email})`],
          ['wa', 'Kirim ke WhatsApp Pimpinan'],
        ].map(([k, label]) => (
          <label key={k} className="u-pref-row">
            <span>{label}</span>
            <span className="u-toggle"><input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} /><span /></span>
          </label>
        ))}
      </Modal>
    </div>
  );
}
