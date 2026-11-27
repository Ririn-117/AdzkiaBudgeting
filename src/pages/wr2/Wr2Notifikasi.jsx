import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, Mail, MailOpen, MessageSquare, ShieldCheck, SlidersHorizontal, Trash2, KeyRound, Pencil, Lock, BellOff } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { OTP_THRESHOLD } from '../../data/wr2Data';
import { OtpModal, Toggle } from '../../components/wr2/shared';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const TABS = [['all', 'Semua Notifikasi'], ['menunggu', 'Menunggu Otorisasi'], ['revisi', 'Revisi Dikirim Ulang'], ['status', 'Status Keputusan']];
const TONE = { maroon: ['#7a0c16', '#fff'], blue: ['#dfe9ff', '#2447a3'], sky: ['#e0ecff', '#2447a3'], gray: ['#eef0f4', '#475569'] };
const PHONE_RE = /^\+?[0-9\s-]{8,20}$/;

function Rich({ text }) { return text.split('**').map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>)); }

export default function Wr2Notifikasi() {
  const toast = useToast();
  const { notifs, setRead, markAll, removeNotif } = useWr2();
  const [tab, setTab] = useState('all');
  const [cmp, setCmp] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [otpTest, setOtpTest] = useState(false);
  const [wa, setWa] = useState(true);
  const [phone, setPhone] = useState('+62 812-6789-XXXX');
  const [editing, setEditing] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [prefs, setPrefs] = useState({ sla: true, daily: true, info: false });

  const count = (k) => (k === 'all' ? notifs.length : notifs.filter((n) => n.cat === k).length);
  const list = useMemo(() => notifs.filter((n) => tab === 'all' || n.cat === tab).sort((a, b) => b.order - a.order), [notifs, tab]);
  const savePhone = () => { if (!PHONE_RE.test(phone.replace(/X/g, '0'))) { setPhoneErr('Nomor tidak valid.'); return; } setPhoneErr(''); setEditing(false); toast.push('Nomor resmi pimpinan berhasil diperbarui di database.'); };

  return (
    <div className="upage">
      <header className="u-ph">
        <div>
          <p className="u-hint" style={{ margin: 0 }}>Sistem › <b>Notifikasi</b></p>
          <h1 style={{ fontSize: '1.7rem' }}>Pusat Notifikasi & Disposisi Pimpinan</h1>
          <p style={{ margin: '0.4rem 0 0', color: '#475569', maxWidth: 560, fontSize: '0.92rem' }}>Pemberitahuan real-time pengajuan baru masuk ke meja pimpinan, revisi yang telah dikirim ulang unit, dan pembaruan sistem anggaran.</p>
        </div>
        <div className="u-ph-actions">
          <button type="button" className="u-btn u-btn-outline" onClick={() => { markAll(); toast.push('Semua notifikasi ditandai telah dibaca.'); }}><CheckCheck size={15} /> Tandai Semua Dibaca</button>
          <button type="button" className="u-btn u-btn-navy" onClick={() => setPrefOpen(true)}><SlidersHorizontal size={15} /> Pengaturan Saluran Peringatan</button>
        </div>
      </header>

      <div className="u-tabs" role="tablist">
        {TABS.map(([k, label]) => (<button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label} <em className={k === 'menunggu' ? 'alert' : ''}>{count(k)}</em></button>))}
      </div>

      <div className="bk-two">
        <div className="bk-col">
          {list.length === 0 && <div className="card u-empty"><BellOff size={30} /><strong>Tidak ada notifikasi</strong>Semua notifikasi sudah ditinjau.</div>}
          {list.map((n) => (
            <article key={n.id} className={`u-notif ${n.tone === 'maroon' ? 'accent-maroon' : n.tone === 'blue' ? 'accent-navy' : 'accent-slate'} ${n.unread ? 'unread' : ''}`}>
              <div className="u-notif-main">
                <div className="u-notif-top">
                  <div className="u-notif-tags">
                    <b className="bk-ntag" style={{ background: TONE[n.tone][0], color: TONE[n.tone][1] }}>{n.tag}</b>
                    <span style={{ fontWeight: 700, color: '#161a77' }}>{n.ref}</span>
                    {n.unread && <span className="u-new"><i /> Baru</span>}
                  </div>
                  <time>{n.time}</time>
                </div>
                <h3>{n.title}</h3>
                <p><Rich text={n.body} /></p>
                {n.bar && <div className="u-bar maroon" style={{ margin: '0.6rem 0' }}><i style={{ width: `${n.bar}%` }} /></div>}
                <div className="u-notif-actions">
                  <div className="u-actions" style={{ flexWrap: 'wrap' }}>
                    <span className="u-footnote">{n.foot}</span>
                    {n.actions.map((a) => {
                      if (a.to) return <Link key={a.label} to={a.to} onClick={() => setRead(n.id)} className={`u-btn u-btn-sm ${a.primary ? 'u-btn-primary' : 'u-btn-soft'}`}>{a.label}</Link>;
                      if (a.compare) return <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-soft" onClick={() => { setRead(n.id); setCmp(true); }}>{a.label}</button>;
                      return <button key={a.label} type="button" className="u-btn u-btn-sm u-btn-soft" onClick={() => toast.push(a.toast)}>{a.label}</button>;
                    })}
                  </div>
                  <div className="u-actions">
                    <button type="button" className="u-iconbtn" aria-label={n.unread ? 'Tandai dibaca' : 'Tandai belum dibaca'} onClick={() => setRead(n.id, n.unread)}>{n.unread ? <MailOpen size={17} /> : <Mail size={17} />}</button>
                    <button type="button" className="u-iconbtn danger" aria-label="Hapus" onClick={() => { removeNotif(n.id); toast.push('Notifikasi dihapus.'); }}><Trash2 size={17} /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="bk-col">
          <section className="card">
            <div className="bk-sec-head tight"><h2><MessageSquare size={20} /> Saluran WhatsApp</h2><span className={`u-badge ${wa ? 'u-badge-green' : 'u-badge-gray'}`}>{wa ? 'Aktif' : 'Nonaktif'}</span></div>
            <p className="u-hint">Notifikasi mendesak dan ringkasan usulan bernilai tinggi (&gt; Rp {new Intl.NumberFormat('id-ID').format(OTP_THRESHOLD)}) otomatis diteruskan ke nomor dinas Wakil Rektor II via gateway WhatsApp Rektorat.</p>
            <div className="bk-channels"><div>
              <div>{editing ? <input className="u-input" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Nomor WhatsApp" /> : <b>{phone}</b>}<small>Nomor Resmi Pimpinan</small>{phoneErr && <p className="u-err">{phoneErr}</p>}</div>
              {editing ? <button type="button" className="u-btn u-btn-sm u-btn-primary" onClick={savePhone}>Simpan</button> : <button type="button" className="u-iconbtn" aria-label="Ubah nomor" onClick={() => setEditing(true)}><Pencil size={16} /></button>}
              <Toggle checked={wa} onChange={setWa} label="Saluran WhatsApp" />
            </div></div>
            <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Notifikasi Darurat SLA</span><b>Aktif Segera</b></p>
            <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ringkasan Harian</span><b>Setiap 08:00 WIB</b></p>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2><ShieldCheck size={20} /> Keamanan TTE BSrE</h2><span className="u-badge u-badge-sky">Tersertifikasi</span></div>
            <p className="u-hint">Tanda Tangan Elektronik terintegrasi langsung dengan Balai Sertifikasi Elektronik (BSrE) BSSN untuk penerbitan SK Anggaran dan Disposisi Keuangan yang sah.</p>
            <dl className="u-kv"><div><dt>Subjek Sertifikat</dt><dd>Dr. H. M. Alfian, M.Si</dd></div><div><dt>Penerbit</dt><dd>BSrE - BSSN RI</dd></div><div><dt>Masa Berlaku</dt><dd>Hingga 14 Nov 2026</dd></div></dl>
            <p className="u-hint"><Lock size={13} /> Integritas Kriptografi RSA 4096-bit Valid</p>
          </section>

          <section className="card">
            <h2 className="u-h2"><KeyRound size={20} /> Protokol Otentikasi</h2>
            <div className="bk-note-box" style={{ display: 'block' }}><b>Ambang Verifikasi Lanjutan: &gt; Rp {new Intl.NumberFormat('id-ID').format(OTP_THRESHOLD)}</b><br />Setiap disposisi atau persetujuan di atas batas ini mewajibkan masukan token OTP dinamis pimpinan.</div>
            <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem' }}><span>Token Fisik / Authenticator</span><b style={{ color: '#2447a3' }}>Tersinkron</b></p>
            <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Waktu Sesi Otorisasi</span><b>15 Menit Aktif</b></p>
            <button type="button" className="u-btn u-btn-soft u-btn-block" onClick={() => setOtpTest(true)}>Uji Token Otorisasi WR II</button>
          </section>
        </aside>
      </div>

      <Modal open={cmp} wide title="Bandingkan Versi: Honorarium Narasumber" onClose={() => setCmp(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setCmp(false)}>Tutup</button>}>
        <table className="u-table" style={{ minWidth: 0 }}>
          <thead><tr><th>Komponen</th><th className="num">Versi Awal</th><th className="num">Versi Revisi</th></tr></thead>
          <tbody><tr><td>Honorarium narasumber (2 sesi)</td><td className="num">Rp 4.000.000</td><td className="num">Rp 3.000.000</td></tr><tr><td>Total usulan</td><td className="num">Rp 26.000.000</td><td className="num strong">Rp 25.000.000</td></tr></tbody>
        </table>
        <p className="u-hint">Perbandingan contoh. Versi sebenarnya dimuat dari server.</p>
      </Modal>
      <Modal open={prefOpen} title="Pengaturan Saluran Peringatan" onClose={() => setPrefOpen(false)} footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setPrefOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={() => { setPrefOpen(false); toast.push('Pengaturan disimpan (simulasi).'); }}>Simpan</button></>}>
        {[['sla', 'Notifikasi darurat SLA'], ['daily', 'Ringkasan harian 08:00 WIB'], ['info', 'Pembaruan sistem anggaran']].map(([k, l]) => (<label key={k} className="u-pref-row"><span>{l}</span><Toggle checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={l} /></label>))}
      </Modal>
      <OtpModal open={otpTest} onClose={() => setOtpTest(false)} onVerified={() => { setOtpTest(false); toast.push('Token otorisasi valid (simulasi).'); }} />
    </div>
  );
}