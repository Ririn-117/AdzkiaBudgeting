import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, Check, CheckCheck, Inbox, Mail, MailOpen, Megaphone, MessageSquare, RefreshCw, Receipt,
  Send, SlidersHorizontal, Stamp, Timer, Trash2, UserCheck, Lock, Radio, ShieldCheck, BellOff,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { BASE, NOTIF_GROUPS } from '../../data/bkpuData';
import { DisposisiModal, Donut, Toggle } from '../../components/bkpu/shared';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const ICONS = { timer: Timer, refresh: RefreshCw, receipt: Receipt, inbox: Inbox, stamp: Stamp, megaphone: Megaphone };
const TONE = { red: '#b4121f', navy: '#161a77', sky: '#2447a3', gray: '#64748b' };
const PERIODS = [['7', '7 Hari Terakhir'], ['30', '30 Hari Terakhir'], ['all', 'Semua Waktu']];
const CONTACTS = [['RH', 'Dr. Rahmat Hidayat', 'Kaprodi PGMI • No: PGMI-2025-004'], ['FA', 'Fauzan Akbar, M.Kom', 'Kaprodi TI • No: TI-2025-008'], ['SM', 'Siti Maryam, S.E.', 'Bendahara FEBI • No: MNJ-2025-012']];

function Rich({ text }) { return text.split('**').map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>)); }

export default function BkpuNotifikasi() {
  const toast = useToast();
  const { notifs, queue, lpjQueue, setNotifRead, markAllNotifs, removeNotif } = useBkpu();
  const [tab, setTab] = useState('all');
  const [period, setPeriod] = useState('7');
  const [sort, setSort] = useState('new');
  const [dispose, setDispose] = useState(null);
  const [prefOpen, setPrefOpen] = useState(false);
  const [channels, setChannels] = useState({ email: true, telegram: true, wa: true });
  const [prefs, setPrefs] = useState({ sla: true, resubmit: true, lpj: true, info: false });

  const unread = notifs.filter((n) => n.unread).length;
  const visible = useMemo(
    () => notifs.filter((n) => (tab === 'all' || n.unread) && (period === 'all' || n.daysAgo <= Number(period))).sort((a, b) => (sort === 'new' ? b.order - a.order : a.order - b.order)),
    [notifs, tab, period, sort]
  );
  const groups = Object.keys(NOTIF_GROUPS).map((k) => ({ k, ...NOTIF_GROUPS[k], list: visible.filter((n) => n.group === k) })).filter((g) => g.list.length);
  const crit = queue.filter((s) => s.slaDay >= 3).length;

  return (
    <div className="upage">
      <header className="u-ph">
        <div>
          <p className="u-eyebrow"><span style={{ background: '#7a0c16', color: '#fff' }}>AUDIT & VERIFIKASI</span> Tahun Akademik 2024/2025 Genap</p>
          <h1 style={{ fontSize: '1.7rem' }}>Pusat Notifikasi & Agenda Verifikasi</h1>
          <p style={{ margin: '0.4rem 0 0', color: '#475569', maxWidth: 560, fontSize: '0.92rem' }}>Pantau usulan anggaran baru masuk, resubmit revisi unit, LPJ yang siap diperiksa, serta peringatan batas waktu SLA verifikasi BKPU.</p>
        </div>
        <div className="u-ph-actions">
          <button type="button" className="u-btn u-btn-outline" onClick={() => { markAllNotifs(); toast.push('Semua notifikasi ditandai telah dibaca.'); }}><CheckCheck size={15} /> Tandai Semua Dibaca</button>
          <button type="button" className="u-btn u-btn-primary" onClick={() => setPrefOpen(true)}><SlidersHorizontal size={15} /> Pengaturan Notifikasi</button>
        </div>
      </header>

      <div className="bk-two">
        <div className="bk-col">
          <section className="card bk-notif-bar">
            <div className="u-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'all'} className={`u-tab ${tab === 'all' ? 'on' : ''}`} onClick={() => setTab('all')}>Semua Notifikasi <em>{notifs.length}</em></button>
              <button type="button" role="tab" aria-selected={tab === 'unread'} className={`u-tab ${tab === 'unread' ? 'on' : ''}`} onClick={() => setTab('unread')}>Belum Dibaca <em className="alert">{unread}</em></button>
            </div>
            <select className="u-select" style={{ width: 'auto' }} value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Periode">{PERIODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            <select className="u-select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan"><option value="new">Waktu Terbaru</option><option value="old">Waktu Terlama</option></select>
          </section>

          {groups.length === 0 && <div className="card u-empty"><BellOff size={30} /><strong>Tidak ada notifikasi</strong>Semua notifikasi sudah ditinjau.</div>}

          {groups.map((g) => (
            <section key={g.k} className="u-notif-group">
              <div className="u-group-head"><span><i className={`dot ${g.dot}`} /> <b>{g.label.toUpperCase()}</b></span><span className="u-hint">{g.right.replace(/^\d+ /, '')}</span></div>
              {g.list.map((n) => {
                const Icon = ICONS[n.icon];
                return (
                  <article key={n.id} className={`u-notif accent-${n.tone === 'red' ? 'red' : n.tone === 'navy' ? 'navy' : 'slate'} ${n.unread ? 'unread' : ''}`}>
                    <span className={`u-notif-icon ${n.tone === 'red' ? 'accent-red' : ''}`}><Icon size={22} /></span>
                    <div className="u-notif-main">
                      <div className="u-notif-top">
                        <div className="u-notif-tags">
                          <b className="bk-ntag" style={{ background: n.tone === 'sky' ? '#e0ecff' : n.tone === 'gray' ? '#eef0f4' : '#fde4e4', color: TONE[n.tone] }}>{n.tag}</b>
                          <span className="u-ref">{n.ref}</span>{n.refUnit && <span style={{ color: '#2447a3', fontWeight: 600, fontSize: '0.8rem' }}>{n.refUnit}</span>}
                          {n.unread && <span className="u-new"><i /> Baru</span>}
                        </div>
                        <time style={n.right ? { color: '#b4121f', fontWeight: 700 } : undefined}>{n.right ?? n.time}</time>
                      </div>
                      <h3>{n.title}</h3>
                      <p><Rich text={n.body} /></p>
                      <div className="u-notif-actions">
                        <div className="u-actions" style={{ flexWrap: 'wrap' }}>
                          <span className="u-footnote">{n.meta.join(' • ')}</span>
                          {n.actions.map((a) => {
                            if (a.to) return <Link key={a.label} to={a.to} onClick={() => setNotifRead(n.id)} className={`u-btn u-btn-sm ${a.primary ? 'u-btn-navy' : 'u-btn-outline'}`}>{a.label} {a.primary && <ArrowRight size={13} />}</Link>;
                            if (a.dispose) return <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => setDispose(a.dispose)}>{a.label}</button>;
                            if (a.dismiss) return <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => { removeNotif(n.id); toast.push('Notifikasi ditutup.'); }}>{a.label}</button>;
                            return <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => toast.push(a.toast)}>{a.label}</button>;
                          })}
                        </div>
                        <div className="u-actions">
                          <button type="button" className="u-iconbtn" aria-label={n.unread ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'} onClick={() => setNotifRead(n.id, n.unread)}>{n.unread ? <MailOpen size={17} /> : <Mail size={17} />}</button>
                          <button type="button" className="u-iconbtn danger" aria-label="Hapus" onClick={() => { removeNotif(n.id); toast.push('Notifikasi dihapus.'); }}><Trash2 size={17} /></button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          ))}
        </div>

        <aside className="bk-col">
          <section className="card">
            <div className="bk-sec-head tight"><h2><Timer size={20} /> Beban SLA Hari Ini</h2><span className="u-badge u-badge-sky">Maks 3 Hari</span></div>
            <div className="bk-sla-load">
              <div><span>USULAN AKTIF DITELAAH</span><p><b>{queue.length}</b> Pengajuan</p></div>
              <Donut percent={queue.length ? (crit / queue.length) * 100 : 0} size={76} stroke={9} color="#b4121f"><b style={{ fontSize: '0.78rem' }}>{crit} Kritis</b></Donut>
            </div>
            <ul className="bk-legend wide">
              <li><i className="red" /> Mendekati Batas (kurang dari 6 jam) <b className="red">{crit} Usulan</b></li>
              <li><i className="navy" /> Dalam Batas Wajar (Hari 1-2) <b className="blue">{queue.length - crit} Usulan</b></li>
              <li><i className="red" /> Antrean Verifikasi LPJ <b>{lpjQueue.length} Berkas</b></li>
            </ul>
            <Link to={`${BASE}/sla`} className="u-btn u-btn-soft u-btn-block">Lihat Matriks SLA Lengkap <ArrowRight size={14} /></Link>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><Radio size={20} /> Saluran Pengingat</h2><span className="u-hint">Realtime</span></div>
            <p className="u-hint">Notifikasi sistem disinkronkan secara otomatis ke saluran resmi verifikator.</p>
            <div className="bk-channels">
              {[['email', Mail, 'Email SSO Kampus', 'a.zaky@adzkia.ac.id'], ['telegram', Send, 'Telegram Bot BKPU', '@AdzkiaFinBot'], ['wa', MessageSquare, 'WhatsApp Gateway', 'Server Rektorat (Notif Cepat)']].map(([k, Icon, name, sub]) => (
                <div key={k}><span className="bk-ico blue"><Icon size={18} /></span><div><b>{name}</b><small>{sub}</small></div><span className={`u-badge ${channels[k] ? 'u-badge-green' : 'u-badge-gray'}`}>{channels[k] ? 'Aktif' : 'Nonaktif'}</span><Toggle checked={channels[k]} onChange={(v) => setChannels({ ...channels, [k]: v })} label={name} /></div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="u-h2"><UserCheck size={20} /> Klarifikasi Dokumen Cepat</h2>
            <p className="u-hint">Hubungi penanggung jawab pengajuan secara langsung untuk percepatan konfirmasi berkas revisi.</p>
            <ul className="bk-contacts">
              {CONTACTS.map(([init, name, sub]) => (
                <li key={name}><span className="bk-avatar">{init}</span><div><b>{name}</b><small>{sub}</small></div><button type="button" className="u-iconbtn" aria-label={`Kirim pesan ke ${name}`} onClick={() => toast.push(`Pesan klarifikasi dikirim ke ${name} (simulasi).`)}><MessageSquare size={17} /></button></li>
              ))}
            </ul>
            <p className="bk-note-box"><Lock size={15} /> Jam respon klarifikasi resmi unit kerja: Senin - Jumat (08.00 - 16.00 WIB).</p>
          </section>
        </aside>
      </div>

      <DisposisiModal open={Boolean(dispose)} onClose={() => setDispose(null)} refs={dispose ? [dispose] : []} />
      <Modal open={prefOpen} title="Pengaturan Notifikasi" onClose={() => setPrefOpen(false)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setPrefOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={() => { setPrefOpen(false); toast.push('Pengaturan notifikasi disimpan (simulasi).'); }}>Simpan</button></>}>
        {[['sla', 'Peringatan SLA 3 hari'], ['resubmit', 'Revisi unit dikirim ulang'], ['lpj', 'LPJ baru siap diperiksa'], ['info', 'Pengumuman sistem']].map(([k, l]) => (
          <label key={k} className="u-pref-row"><span>{l}</span><Toggle checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={l} /></label>
        ))}
      </Modal>
    </div>
  );
}