import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Building2, Camera, Download, IdCard, KeyRound, Mail, Monitor, PenLine, Pencil, Save, ShieldCheck, Shield, Smartphone, Upload, UserRound, Gavel, ShieldAlert, ClipboardCheck, Ban, RefreshCw } from 'lucide-react';
import { WR2 } from '../../data/wr2Data';
import { Toggle } from '../../components/wr2/shared';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../services/api';

const TABS = [['bio', 'Biodata & Penugasan', UserRound], ['akses', 'Kewenangan & Ambang Otorisasi', Gavel], ['tte', 'Tanda Tangan Elektronik (TTE)', PenLine], ['aman', 'Keamanan Akun & Log Sesi', Shield]];
const SESSIONS = [
  { id: 's1', name: 'PC Ruang Kerja WR II (Intranet Rektorat)', detail: 'Windows 11 Enterprise • IP: 10.12.4.45 (Padang, Sumbar)', tag: 'Sedang Aktif', sub: 'Browser Edge 122', current: true },
  { id: 's2', name: 'iPad Pro 12.9 Pimpinan (Mobile Disposisi)', detail: 'iPadOS 17.4 • Aplikasi Adzkia Executive Portal', tag: 'Aktif 18 menit lalu', sub: 'Koneksi VPN Kampus', current: false },
];
const PHONE_RE = /^\+?[0-9\s-]{8,20}$/;

export default function Wr2Profil() {
  const toast = useToast();
  const photoRef = useRef(null);
  const sigRef = useRef(null);
  const [tab, setTab] = useState('bio');
  const [saved, setSaved] = useState({ phone: WR2.phone, prefs: { otp: true, wa: true, sla: true } });
  const [phone, setPhone] = useState(WR2.phone);
  const [prefs, setPrefs] = useState(saved.prefs);
  const [err, setErr] = useState('');
  const [photo, setPhoto] = useState(null);
  const [sig, setSig] = useState(null);
  const [sessions, setSessions] = useState(SESSIONS);
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState({});

  const dirty = phone !== saved.phone || JSON.stringify(prefs) !== JSON.stringify(saved.prefs);

  useEffect(() => {
    let active = true;
    api.get('/auth/me')
      .then((res) => {
        if (!active || !res?.user) return;
        const nextPhone = res.user.phone || WR2.phone;
        setPhone(nextPhone);
        setSaved((prev) => ({ ...prev, phone: nextPhone }));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const save = async () => {
    if (!PHONE_RE.test(phone.trim())) { setErr('Nomor tidak valid.'); setEditOpen(true); return; }
    setErr('');
    try {
      await api.put('/auth/profile', {
        phone: phone.trim(),
        twofa_enabled: prefs.otp,
        whatsapp_notif: prefs.wa,
      });
      setSaved({ phone: phone.trim(), prefs });
      toast.push('Pengaturan otorisator berhasil disimpan ke database.');
    } catch (e) {
      toast.push(e?.message || 'Gagal menyimpan pengaturan.', 'error');
    }
  };
  const cancel = () => { setPhone(saved.phone); setPrefs(saved.prefs); setErr(''); };
  const pick = (setter, mb, label) => (e) => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast.push(`${label} harus berupa gambar.`, 'error'); return; }
    if (f.size > mb * 1024 * 1024) { toast.push(`${label} melebihi ${mb} MB.`, 'error'); return; }
    setter(URL.createObjectURL(f)); toast.push(`${label} berhasil diperbarui.`);
  };
  const changePw = async () => {
    const e = {};
    if (!pw.current) e.current = 'Wajib diisi.';
    if (pw.next.length < 8) e.next = 'Minimal 8 karakter.';
    if (pw.confirm !== pw.next) e.confirm = 'Konfirmasi tidak sama.';
    setPwErr(e);
    if (Object.keys(e).length) return;
    try {
      await api.put('/auth/change-password', { current: pw.current, next: pw.next });
      setPw({ current: '', next: '', confirm: '' }); setPwOpen(false);
      toast.push('Kata sandi berhasil diperbarui di database.');
    } catch (errObj) {
      toast.push(errObj?.message || 'Gagal memperbarui kata sandi.', 'error');
    }
  };

  const prefRows = [
    ['otp', 'Wajibkan Verifikasi OTP Tingkat Tinggi', 'Kirimkan kode OTP autentikator untuk pengesahan anggaran dengan nominal di atas Rp 20.000.000.'],
    ['wa', 'Notifikasi Instan WhatsApp Pimpinan', 'Kirim notifikasi langsung saat berkas usulan anggaran baru selesai diverifikasi dan lolos telaah BKPU.'],
    ['sla', 'Peringatan Keterlambatan SLA 48 Jam', 'Berikan tanda darurat pada antrean disposisi bila pengajuan belum diperiksa lebih dari dua hari kerja.'],
  ];

  return (
    <div className="upage">
      <header className="u-ph">
        <div><p className="u-hint" style={{ margin: 0 }}>Sistem › <b>Profil Saya</b></p><h1 style={{ fontSize: '1.7rem' }}>Profil Pimpinan & Pengaturan Otorisator WR II</h1></div>
        <span className="bk-pill ghost"><i className="bk-live-dot" /> Akun Terverifikasi & Aktif (SK Yayasan & Rektorat No. 001/SK-PIMP/UA/2024)</span>
      </header>

      <section className="card bk-prof-card">
        <div className="u-photo-wrap">{photo ? <img src={photo} alt="Foto profil" /> : <div className="u-photo-ph">MA</div>}<button type="button" aria-label="Ganti foto" onClick={() => photoRef.current?.click()}><Camera size={16} /></button></div>
        <div className="u-profile-info">
          <h2>{WR2.name} <span className="bk-pill">WR II</span></h2>
          <p style={{ color: '#2447a3' }}>Wakil Rektor II (Bidang Keuangan, Perencanaan, Kepegawaian & Sarpras)</p>
          <div className="u-profile-meta"><span><IdCard size={14} /> NIP: {WR2.nip} / NIDN: {WR2.nidn}</span><span><Building2 size={14} /> {WR2.office}</span><span><Mail size={14} /> {WR2.email}</span></div>
        </div>
        <button type="button" className="u-btn u-btn-soft" onClick={() => toast.push('Unduh berkas SK (simulasi, belum ada berkas dari server).')}><Download size={15} /> Unduh Berkas SK</button>
        <button type="button" className="u-btn u-btn-primary" onClick={() => setEditOpen(true)}><Pencil size={15} /> Perbarui Data Diri</button>
        <input ref={photoRef} type="file" accept="image/*" hidden onChange={pick(setPhoto, 2, 'Foto profil')} />
      </section>

      <div className="u-tabs" role="tablist">{TABS.map(([k, label, Icon]) => (<button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}><Icon size={15} /> {label}</button>))}</div>

      <div className="u-profile-grid">
        <div className="u-profile-left">
          {tab === 'bio' && (
            <>
              <section className="card">
                <div className="bk-note-box" style={{ justifyContent: 'space-between', margin: 0 }}><span><RefreshCw size={16} /> <b>SIMPEG Universitas Adzkia</b> — Tersinkronisasi otomatis • Status Data Sah</span><span className="u-badge u-badge-sky">Validasi Terakhir: Hari ini, 08:30 WIB</span></div>
                <div className="u-grid-2" style={{ marginTop: '1rem' }}>
                  <div className="bk-tiles" style={{ gridTemplateColumns: '1fr', margin: 0 }}><div><span>Pangkat / Golongan ASN/Yayasan</span><b>Pembina Utama Muda (IV/c)</b><small>Jabatan Fungsional: Lektor Kepala (700 AK)</small></div></div>
                  <div className="bk-tiles" style={{ gridTemplateColumns: '1fr', margin: 0 }}><div><span>Masa Bakti Jabatan Rektorat</span><b>Periode 2023 - 2027</b><small>Tahun Ke-2 (SK No. 04/SK/YAY/2023)</small></div></div>
                </div>
              </section>
              <section className="card">
                <h2 className="u-h2"><ShieldCheck size={20} /> Ruang Lingkup Otoritas WR II</h2>
                <p className="u-hint">Kewenangan eksekutif otorisasi anggaran berdasar Statuta Universitas.</p>
                <ul className="bk-checks">
                  {[[ShieldCheck, 'Otorisator Keuangan Utama Tingkat Universitas', 'Memegang mandat persetujuan realisasi APBU (Anggaran Pendapatan & Belanja Universitas) seluruh fakultas, prodi, dan biro teknis operasional.'], [ClipboardCheck, 'Pengesahan SK Alokasi & SPK Operasional Sarpras', 'Pemberian nomor ketetapan dan pengesahan Surat Perintah Kerja belanja modal fisik, laboratorium komputer, dan pemeliharaan gedung.'], [Ban, 'Hak Veto & Penolakan Pengajuan Tidak Sesuai RKAT', 'Hak absolut untuk mengembalikan usulan dengan catatan revisi atau menolak pengajuan program yang keluar dari indikator kinerja renstra kampus.']].map(([Icon, t, d]) => (
                    <li key={t}><label style={{ alignItems: 'flex-start' }}><Icon size={18} style={{ color: '#7a0c16', flexShrink: 0 }} /><span><b>{t}</b><br /><span className="u-hint">{d}</span></span></label></li>
                  ))}
                </ul>
                <div className="bk-scope"><p><b>Ambang Batas Otorisasi Mandiri WR II</b> <span style={{ marginLeft: 'auto', color: '#7a0c16', fontWeight: 800 }}>Maks. Rp 100.000.000</span></p>
                  <div className="wr2-stack"><i style={{ background: '#7a0c16', width: '60%' }} /><i style={{ background: '#3f5a8a', width: '40%' }} /></div>
                  <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>0 s/d Rp 100 Jt: Mandiri WR II</span><span>&gt; Rp 100 Jt: Paraf Pengantar + Rektor</span></p></div>
              </section>
            </>
          )}
          {tab === 'akses' && (<section className="card"><h2 className="u-h2"><Gavel size={20} /> Kewenangan & Ambang Otorisasi</h2><table className="u-table" style={{ minWidth: 420 }}><thead><tr><th>Nilai Usulan</th><th>Ketentuan</th></tr></thead><tbody><tr><td>Sampai Rp 20.000.000</td><td>Diputuskan WR II (TTE)</td></tr><tr><td>&gt; Rp 20.000.000</td><td>WR II + verifikasi OTP</td></tr><tr><td>&gt; Rp 100.000.000</td><td>Paraf pengantar WR II + keputusan Rektor</td></tr></tbody></table></section>)}
          {tab === 'tte' && (
            <section className="card">
              <h2 className="u-h2"><PenLine size={20} /> Tanda Tangan Elektronik (TTE)</h2>
              <div className="u-sign-grid">
                <div className="u-sign-box">{sig ? <img src={sig} alt="Spesimen paraf" /> : <span>Belum ada spesimen paraf</span>}</div>
                <div><p className="u-hint" style={{ marginBottom: '0.7rem' }}>Unggah spesimen paraf (PNG/JPG, maks. 1 MB). Sertifikat BSrE berlaku hingga 14 Nov 2026.</p><button type="button" className="u-btn u-btn-navy" onClick={() => sigRef.current?.click()}><Upload size={15} /> Unggah Spesimen</button><input ref={sigRef} type="file" accept="image/*" hidden onChange={pick(setSig, 1, 'Spesimen paraf')} /></div>
              </div>
            </section>
          )}
          {tab === 'aman' && (<section className="card"><h2 className="u-h2"><KeyRound size={20} /> Keamanan Akun</h2><p className="u-hint">Riwayat sesi perangkat ada di bagian bawah halaman ini.</p><button type="button" className="u-btn u-btn-primary" onClick={() => setPwOpen(true)}><KeyRound size={15} /> Ubah Kata Sandi</button></section>)}

          <section className="card">
            <div className="bk-sec-head tight"><div><h2>Sesi Perangkat Terdaftar</h2><p className="u-hint">Akses yang memiliki izin penandatanganan dan persetujuan</p></div><button type="button" className="u-link" style={{ color: '#b4121f' }} onClick={() => { setSessions((p) => p.filter((s) => s.current)); toast.push('Sesi lain diputus (simulasi).'); }}>Putus Sesi Lain</button></div>
            <div className="u-sessions">{sessions.map((s) => (<div key={s.id} className="u-session">{s.current ? <Monitor size={22} /> : <Smartphone size={22} />}<div style={{ flex: 1 }}><strong>{s.name}</strong><p>{s.detail}</p></div><div style={{ textAlign: 'right' }}><span className={`u-badge ${s.current ? 'u-badge-sky' : 'u-badge-gray'}`}>{s.tag}</span><p>{s.sub}</p></div></div>))}</div>
          </section>
        </div>

        <aside className="u-profile-right">
          <section className="card">
            <div className="bk-panel-head"><span className="bk-ico blue"><ShieldAlert size={20} /></span><div><h2>Protokol Keamanan Otorisasi</h2><p>Proteksi berlapis tindakan pengesahan anggaran</p></div></div>
            <div className="u-pref-list">{prefRows.map(([k, t, d]) => (<label key={k} className="u-pref-card"><div><strong>{t}</strong><p>{d}</p></div><Toggle checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={t} /></label>))}</div>
          </section>
          <div className="wr2-photo"><small>PUSAT ADMINISTRASI & KEUANGAN</small><b>Gedung Rektorat Universitas Adzkia</b></div>
        </aside>
      </div>

      <section className="card u-form-foot">
        <p className="u-autosave" style={{ flex: 1 }}><ShieldCheck size={16} /> Setiap perubahan pengaturan otorisator dicatat ke dalam Log Audit Keuangan Universitas.</p>
        <div className="u-foot-actions"><button type="button" className="u-btn u-btn-soft" onClick={cancel} disabled={!dirty}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={save} disabled={!dirty}><Save size={15} /> Simpan Pengaturan Profil</button></div>
      </section>

      <Modal open={editOpen} title="Perbarui Data Diri" onClose={() => setEditOpen(false)} footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setEditOpen(false)}>Tutup</button><button type="button" className="u-btn u-btn-primary" onClick={() => { if (!PHONE_RE.test(phone.trim())) { setErr('Nomor tidak valid.'); return; } setErr(''); setEditOpen(false); }}>Simpan</button></>}>
        <div className="u-field"><label className="u-label" htmlFor="wr-phone">Nomor WhatsApp / Seluler Resmi</label><input id="wr-phone" className={`u-input ${err ? 'invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} />{err && <p className="u-err">{err}</p>}</div>
        <p className="u-hint">Data kepegawaian lain disinkronkan dari SIMPEG dan tidak dapat diubah di sini. Klik "Simpan Pengaturan Profil" untuk menyimpan.</p>
      </Modal>
      <Modal open={pwOpen} title="Ubah Kata Sandi" onClose={() => setPwOpen(false)} footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setPwOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={changePw}>Perbarui</button></>}>
        {[['current', 'Kata sandi saat ini'], ['next', 'Kata sandi baru (minimal 8 karakter)'], ['confirm', 'Konfirmasi kata sandi baru']].map(([k, l]) => (<div className="u-field" key={k}><label className="u-label" htmlFor={`wp-${k}`}>{l}</label><input id={`wp-${k}`} type="password" className={`u-input ${pwErr[k] ? 'invalid' : ''}`} value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />{pwErr[k] && <p className="u-err">{pwErr[k]}</p>}</div>))}
      </Modal>
    </div>
  );
}