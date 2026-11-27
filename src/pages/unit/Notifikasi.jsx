import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, BadgeCheck, CalendarX2, CheckCheck, MailOpen, Mail, Megaphone, ShieldCheck, SlidersHorizontal, Trash2, Wallet, BellOff,
} from 'lucide-react';
import { BASE, NOTIF_GROUPS } from '../../data/unitData';
import { useNotifications } from '../../context/NotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const ICONS = { alert: AlertTriangle, wallet: Wallet, calendar: CalendarX2, badge: BadgeCheck, megaphone: Megaphone, shield: ShieldCheck };
const TABS = [
  ['all', 'Semua Notifikasi'],
  ['unread', 'Belum Dibaca'],
  ['tindakan', 'Perlu Tindakan / Revisi'],
  ['keuangan', 'Pencairan & Keuangan'],
  ['info', 'Info & Sistem'],
];
const PERIODS = [['7', '7 Hari Terakhir'], ['30', '30 Hari Terakhir'], ['all', 'Semua Waktu']];

// Teks dengan **tebal** sederhana
function Rich({ text }) {
  return text.split('**').map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>));
}

export default function Notifikasi() {
  const toast = useToast();
  const { items, setRead, markAllRead, remove } = useNotifications();
  const [tab, setTab] = useState('all');
  const [period, setPeriod] = useState('7');
  const [sort, setSort] = useState('new');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState({ revisi: true, cair: true, lpj: true, info: false });

  const count = (key) =>
    items.filter((n) => (key === 'all' ? true : key === 'unread' ? n.unread : n.cat === key)).length;

  const visible = useMemo(() => {
    const list = items
      .filter((n) => (tab === 'all' ? true : tab === 'unread' ? n.unread : n.cat === tab))
      .filter((n) => period === 'all' || n.daysAgo <= Number(period));
    return list.sort((a, b) => (sort === 'new' ? b.order - a.order : a.order - b.order));
  }, [items, tab, period, sort]);

  const groups = Object.keys(NOTIF_GROUPS)
    .map((key) => ({ key, ...NOTIF_GROUPS[key], list: visible.filter((n) => n.group === key) }))
    .filter((g) => g.list.length > 0);

  const act = (a) => {
    if (a.toast) toast.push(a.toast);
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Sistem' }, { label: 'Notifikasi & Riwayat Aktivitas' }]}
        title="Pusat Notifikasi & Riwayat Aktivitas"
        subtitle="Pantau perkembangan verifikasi pengajuan anggaran, instruksi revisi BKPU/WR2, pencairan dana kasir, dan pengingat batas waktu pertanggungjawaban (LPJ)."
        accent
        actions={
          <>
            <button type="button" className="u-btn u-btn-soft" onClick={() => { markAllRead(); toast.push('Semua notifikasi ditandai telah dibaca.'); }}><CheckCheck size={15} /> Tandai Semua Telah Dibaca</button>
            <button type="button" className="u-btn u-btn-navy" onClick={() => setSettingsOpen(true)}><SlidersHorizontal size={15} /> Pengaturan Notifikasi</button>
          </>
        }
      />

      <section className="card">
        <div className="u-tabs" role="tablist">
          {TABS.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>
              {label} <em className={k === 'unread' ? 'alert' : ''}>{count(k)}</em>
            </button>
          ))}
        </div>
        <div className="u-filters" style={{ marginTop: '1rem', justifyContent: 'space-between' }}>
          <label className="u-inline-select">Tampilkan:
            <select className="u-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="u-inline-select">Urutkan:
            <select className="u-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Waktu Terbaru</option>
              <option value="old">Waktu Terlama</option>
            </select>
          </label>
        </div>
      </section>

      {groups.length === 0 && (
        <div className="card u-empty">
          <BellOff size={30} />
          <strong>Tidak ada notifikasi</strong>
          Tidak ada notifikasi yang cocok dengan filter ini.
        </div>
      )}

      {groups.map((g) => {
        const unread = g.list.filter((n) => n.unread).length;
        return (
          <section key={g.key} className="u-notif-group">
            <div className="u-group-head">
              <span><i className={`dot ${g.dot}`} /> <b>{g.label.toUpperCase()}</b> {g.date}</span>
              <span className={`u-badge ${unread ? 'u-badge-maroon' : 'u-badge-sky'}`}>{unread ? `${unread} Baru` : `${g.list.length} Notifikasi`}</span>
            </div>
            {g.list.map((n) => {
              const Icon = ICONS[n.icon];
              return (
                <article key={n.id} className={`u-notif accent-${n.accent} ${n.unread ? 'unread' : ''}`}>
                  <span className={`u-notif-icon accent-${n.accent}`}><Icon size={22} /></span>
                  <div className="u-notif-main">
                    <div className="u-notif-top">
                      <div className="u-notif-tags">
                        <span className={`u-badge u-badge-${n.tagTone === 'sky' ? 'sky' : n.tagTone}`} style={n.tagTone === 'navy' || n.tagTone === 'maroon' || n.tagTone === 'red' ? { background: { navy: '#161a77', maroon: '#7a0c16', red: '#b4121f' }[n.tagTone], color: '#fff' } : undefined}>{n.tag}</span>
                        <span className="u-ref">{n.ref}</span>
                        {n.critical && <span className="u-crit">Kritis</span>}
                        {n.unread && <span className="u-new"><i /> Baru</span>}
                      </div>
                      <time>{n.time}</time>
                    </div>
                    <h3>{n.title}</h3>
                    <p><Rich text={n.body} /></p>
                    {(n.actions.length > 0 || n.footnote) && (
                      <div className="u-notif-actions">
                        <div className="u-actions" style={{ flexWrap: 'wrap' }}>
                          {n.actions.map((a) =>
                            a.to ? (
                              <Link key={a.label} to={a.to} onClick={() => setRead(n.id)} className={`u-btn u-btn-sm ${a.primary === 'maroon' ? 'u-btn-primary' : a.primary === 'navy' ? 'u-btn-navy' : 'u-btn-outline'}`}>{a.label}</Link>
                            ) : (
                              <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => act(a)}>{a.label}</button>
                            )
                          )}
                          {n.footnote && <span className="u-footnote">{n.footnote}</span>}
                        </div>
                        <div className="u-actions">
                          <button type="button" className="u-iconbtn" aria-label={n.unread ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'} onClick={() => setRead(n.id, n.unread)}>
                            {n.unread ? <MailOpen size={17} /> : <Mail size={17} />}
                          </button>
                          <button type="button" className="u-iconbtn danger" aria-label="Hapus notifikasi" onClick={() => { remove(n.id); toast.push('Notifikasi dihapus.'); }}><Trash2 size={17} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        );
      })}

      <Modal
        open={settingsOpen}
        title="Pengaturan Notifikasi"
        onClose={() => setSettingsOpen(false)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setSettingsOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={() => { setSettingsOpen(false); toast.push('Pengaturan notifikasi berhasil disimpan ke database.'); }}>Simpan Pengaturan</button></>}
      >
        {[['revisi', 'Catatan revisi dari BKPU / WR2'], ['cair', 'Pencairan dana & SP2D'], ['lpj', 'Pengingat batas waktu LPJ'], ['info', 'Pengumuman & info sistem']].map(([k, label]) => (
          <label key={k} className="u-pref-row">
            <span>{label}</span>
            <span className="u-toggle"><input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} /><span /></span>
          </label>
        ))}
      </Modal>
    </div>
  );
}
