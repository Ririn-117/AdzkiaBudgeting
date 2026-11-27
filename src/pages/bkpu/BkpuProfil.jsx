import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck, Bell, Building2, Camera, CheckCircle2, Clock, FileText, IdCard, Info, KeyRound, Laptop, Lock, Mail,
  Monitor, PenLine, Phone, Save, ShieldCheck, Upload, UserRound, Network, Shield,
} from 'lucide-react';
import { BKPU_PROFILE } from '../../data/bkpuData';
import { Toggle } from '../../components/bkpu/shared';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../services/api';

const TABS = [['bio', 'Biodata & Penugasan', UserRound], ['akses', 'Kewenangan Telaah & SLA', ShieldCheck], ['paraf', 'Paraf & Pengesahan Digital', PenLine], ['aman', 'Keamanan Akun & Log Sesi', Shield]];
const PHONE_RE = /^\+?[0-9\s-]{8,20}$/;
const SESSIONS = [
  { id: 's1', name: 'PC Verifikator BKPU (Kantor)', detail: 'Google Chrome 124 • Windows 11 Enterprise', ip: 'IP: 10.15.10.45 (Intranet Rektorat)', place: 'Padang, ID', current: true },
  { id: 's2', name: 'MacBook Air M2 (Laptop Dinas)', detail: 'Google Chrome 122 • macOS Sonoma', ip: 'IP: 180.252.88.19 (VPN UA)', place: 'Padang, ID', when: 'Kemarin, 17:30', current: false },
];

function Field({ label, value, icon: Icon, big }) {
  return (
    <div className="u-field">
      <span className="u-label">{label}</span>
      <div className="u-iwrap"><input className="u-input" readOnly value={value} aria-label={label} style={{ paddingRight: '2.4rem', fontWeight: big ? 600 : 500 }} />{Icon && <Icon size={17} className="ic-right" />}</div>
    </div>
  );
}

export default function BkpuProfil() {
  const toast = useToast();
  const photoRef = useRef(null);
  const parafRef = useRef(null);
  const [tab, setTab] = useState('bio');
  const [saved, setSaved] = useState({ phone: BKPU_PROFILE.phone, prefs: { new: true, sla: true, lpj: true, otp: true } });
  const [phone, setPhone] = useState(saved.phone);
  const [prefs, setPrefs] = useState(saved.prefs);
  const [phoneErr, setPhoneErr] = useState('');
  const [photo, setPhoto] = useState(null);
  const [paraf, setParaf] = useState(null);
  const [sessions, setSessions] = useState(SESSIONS);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState({});
  const [pwModal, setPwModal] = useState(false);

  const dirty = phone !== saved.phone || JSON.stringify(prefs) !== JSON.stringify(saved.prefs);

  useEffect(() => {
    let active = true;
    api.get('/auth/me')
      .then((res) => {
        if (!active || !res?.user) return;
        const nextPhone = res.user.phone || BKPU_PROFILE.phone;
        setPhone(nextPhone);
        setSaved((prev) => ({ ...prev, phone: nextPhone }));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const save = async () => {
    if (!PHONE_RE.test(phone.trim())) { setPhoneErr('Nomor tidak valid. Contoh: +62 813-7455-8901'); return; }
    setPhoneErr('');
    try {
      await api.put('/auth/profile', {
        phone: phone.trim(),
        twofa_enabled: prefs.otp,
        whatsapp_notif: prefs.new,
        revisi_notif: prefs.lpj,
      });
      setSaved({ phone: phone.trim(), prefs });
      toast.push('Pengaturan akun berhasil disimpan ke database.');
    } catch (err) {
      toast.push(err?.message || 'Gagal menyimpan pengaturan.', 'error');
    }
  };
  const cancel = () => { setPhone(saved.phone); setPrefs(saved.prefs); setPhoneErr(''); };

  const pickImage = (setter, maxMb, label) => (e) => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast.push(`${label} harus berupa gambar (PNG/JPG).`, 'error'); return; }
    if (f.size > maxMb * 1024 * 1024) { toast.push(`${label} melebihi ${maxMb} MB.`, 'error'); return; }
    setter(URL.createObjectURL(f));
    toast.push(`${label} berhasil diperbarui.`);
  };

  const changePw = async () => {
    const e = {};
    if (!pw.current) e.current = 'Kata sandi saat ini wajib diisi.';
    if (pw.next.length < 8) e.next = 'Kata sandi baru minimal 8 karakter.';
    if (pw.confirm !== pw.next) e.confirm = 'Konfirmasi tidak sama.';
    setPwErr(e);
    if (Object.keys(e).length) return;
    try {
      await api.put('/auth/change-password', { current: pw.current, next: pw.next });
      setPw({ current: '', next: '', confirm: '' }); setPwModal(false);
      toast.push('Kata sandi berhasil diperbarui di database.');
    } catch (err) {
      toast.push(err?.message || 'Gagal memperbarui kata sandi.', 'error');
    }
  };

  const prefRows = [
    ['new', 'Notifikasi Usulan Masuk Baru', 'Kirimkan ringkasan via Email dinas dan pesan WhatsApp resmi'],
    ['sla', 'Peringatan Kritis SLA 3 Hari', 'Peringatan bila telaah belum selesai dalam 48 jam penerimaan usulan', 'PENTING'],
    ['lpj', 'Notifikasi Pengiriman LPJ Baru', 'Update saat unit mengunggah kelengkapan bukti SPJ kegiatan'],
    ['otp', 'Otorisasi 2-Langkah Rekomendasi WR II', 'Wajibkan OTP Authenticator saat meneruskan telaah persetujuan'],
  ];

  return (
    <div className="upage">
      <header className="u-ph">
        <div>
          <h1 style={{ fontSize: '1.7rem' }}>Profil Pengguna & Pengaturan Verifikator</h1>
          <p style={{ margin: '0.5rem 0' }}><span className="bk-pill"><BadgeCheck size={14} /> Verifikator Resmi Terdaftar (SK Rektor No. 042/SK/UA/2024)</span></p>
          <p style={{ margin: 0, color: '#475569', maxWidth: 620, fontSize: '0.92rem' }}>Kelola identitas verifikator anggaran universitas, spesimen paraf digital, hak akses telaah, dan preferensi keamanan sistem e-budgeting.</p>
        </div>
        <div className="u-ph-actions">
          <span className="bk-pill ghost"><i className="bk-live-dot" /> Sesi Aktif: Intranet Rektorat</span>
          <span className="bk-pill ghost"><Clock size={14} /> Sinkron: 14:02 WIB</span>
        </div>
      </header>

      <section className="card bk-prof-card">
        <div className="u-photo-wrap">
          {photo ? <img src={photo} alt="Foto profil" /> : <div className="u-photo-ph">AZ</div>}
          <button type="button" aria-label="Ganti foto" onClick={() => photoRef.current?.click()}><Camera size={16} /></button>
        </div>
        <div className="u-profile-info">
          <h2>{BKPU_PROFILE.name} <span className="bk-pill ghost">Pegawai Tetap Yayasan</span></h2>
          <p><span className="u-tag" style={{ background: '#7a0c16' }}>Verifikator Keuangan & Anggaran (BKPU)</span></p>
          <div className="u-profile-meta">
            <span><IdCard size={14} /> NIP: <b>{BKPU_PROFILE.nip}</b></span>
            <span><Mail size={14} /> {BKPU_PROFILE.email}</span>
            <span><Phone size={14} /> {saved.phone}</span>
            <span><Building2 size={14} /> Unit Kerja: {BKPU_PROFILE.unit} • {BKPU_PROFILE.room.split(',')[0]}</span>
          </div>
        </div>
        <button type="button" className="u-btn u-btn-soft" onClick={() => photoRef.current?.click()}><Camera size={15} /> Ubah Foto Profil</button>
        <input ref={photoRef} type="file" accept="image/*" hidden onChange={pickImage(setPhoto, 2, 'Foto profil')} />
      </section>

      <div className="u-tabs" role="tablist">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}><Icon size={15} /> {label} {k === 'paraf' && !paraf && <i className="bk-dot" />}</button>
        ))}
      </div>

      <div className="u-profile-grid">
        <div className="u-profile-left">
          {tab === 'bio' && (
            <section className="card">
              <div className="bk-sec-head tight"><div><h2><FileText size={20} /> Informasi Kepegawaian & SK Verifikator</h2><p className="u-hint">Terintegrasi otomatis dengan Pangkalan Data Kepegawaian (SIMPEG UA)</p></div><span className="u-badge u-badge-sky">Status: Terverifikasi</span></div>
              <div className="u-grid-2" style={{ marginTop: '1rem' }}>
                <Field label="Nama Lengkap & Gelar" value={BKPU_PROFILE.name} icon={CheckCircle2} big />
                <Field label="NIP Pegawai / NRP Yayasan" value={BKPU_PROFILE.nip} />
                <Field label="Jabatan Fungsional" value="Verifikator Anggaran Ahli Pertama" />
                <Field label="Pangkat & Golongan Ruang" value="Penata Muda Tingkat I (III/b)" big />
                <Field label="Status Kepegawaian" value="Pegawai Tetap Yayasan (PTY)" />
                <Field label="Ruang Penugasan / Kerja" value={BKPU_PROFILE.room} />
                <div className="u-field">
                  <label className="u-label" htmlFor="bk-phone">Nomor WhatsApp / Seluler Resmi</label>
                  <input id="bk-phone" className={`u-input ${phoneErr ? 'invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  {phoneErr ? <p className="u-err">{phoneErr}</p> : <p className="u-hint">Tercermin pada lembar disposisi telaah.</p>}
                </div>
              </div>
              <div className="bk-scope">
                <p><ShieldCheck size={16} /> <b>Ruang Lingkup Hak Akses & Otoritas Telaah</b></p>
                <div className="bk-scope-grid">
                  <div><span>Level Telaah</span><b>Pemeriksa Kepatuhan SBM</b><small>Validasi RAB & Bukti LPJ</small></div>
                  <div><span>Lingkup Unit</span><b>Seluruh Unit UA</b><small>FTK, FEBI, FTIK, Pasca & Lembaga</small></div>
                  <div><span>Batas Persetujuan</span><b>Telaah & Rekomendasi</b><small>Diteruskan ke WR II (Non-eksekutor)</small></div>
                </div>
              </div>
            </section>
          )}

          {tab === 'akses' && (
            <section className="card">
              <h2 className="u-h2"><ShieldCheck size={20} /> Kewenangan Telaah & SLA</h2>
              <div className="u-scroll">
                <table className="u-table" style={{ minWidth: 460 }}>
                  <thead><tr><th>Modul</th><th>Hak Akses</th></tr></thead>
                  <tbody>
                    {[['Verifikasi pengajuan anggaran', 'Telaah, minta revisi, teruskan ke WR II, tolak'], ['Pemeriksaan LPJ', 'Uji kuitansi, pajak, sahkan & terbitkan BAP'], ['Riwayat & audit', 'Lihat dan ekspor log telaah'], ['Persetujuan alokasi & pencairan', 'Tidak ada (kewenangan WR II)']].map(([a, b]) => <tr key={a}><td className="u-cell-title">{a}</td><td>{b}</td></tr>)}
                  </tbody>
                </table>
              </div>
              <p className="u-hint" style={{ marginTop: '0.7rem' }}>Standar SLA telaah: maksimal 3 hari kerja per berkas. Perubahan kewenangan hanya melalui SK Rektor.</p>
            </section>
          )}

          {tab === 'paraf' && (
            <section className="card">
              <h2 className="u-h2"><PenLine size={20} /> Paraf & Pengesahan Digital</h2>
              <div className="u-sign-grid">
                <div className="u-sign-box">{paraf ? <img src={paraf} alt="Spesimen paraf" /> : <span>Belum ada spesimen paraf</span>}</div>
                <div>
                  <p className="u-hint" style={{ marginBottom: '0.7rem' }}>Unggah gambar paraf (PNG/JPG, maks. 1 MB) dengan latar putih atau transparan. Paraf akan muncul pada lembar telaah dan disposisi.</p>
                  <button type="button" className="u-btn u-btn-navy" onClick={() => parafRef.current?.click()}><Upload size={15} /> Unggah Spesimen Paraf</button>
                  <input ref={parafRef} type="file" accept="image/*" hidden onChange={pickImage(setParaf, 1, 'Spesimen paraf')} />
                </div>
              </div>
            </section>
          )}

          {tab === 'aman' && (
            <section className="card">
              <h2 className="u-h2"><KeyRound size={20} /> Keamanan Akun</h2>
              <div className="bk-lastpw"><Lock size={18} /> Kata Sandi Terakhir Diubah <b>28 Hari Lalu</b></div>
              <button type="button" className="u-btn u-btn-primary" onClick={() => setPwModal(true)}><KeyRound size={15} /> Ubah Kata Sandi</button>
              <p className="u-hint" style={{ marginTop: '0.8rem' }}>Riwayat sesi perangkat tersedia di panel kanan.</p>
            </section>
          )}
        </div>

        <aside className="u-profile-right">
          <section className="card">
            <div className="bk-panel-head"><span className="bk-ico blue"><Bell size={20} /></span><div><h2>Notifikasi & Kepatuhan SLA</h2><p>Batas maksimal telaah BKPU: 3 Hari Kerja</p></div></div>
            <div className="u-pref-list">
              {prefRows.map(([k, title, desc, tag]) => (
                <label key={k} className="u-pref-card"><div><strong>{title} {tag && <span className="u-badge u-badge-red">{tag}</span>}</strong><p>{desc}</p></div><Toggle checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={title} /></label>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><div className="bk-panel-head"><span className="bk-ico blue"><Network size={20} /></span><div><h2>Sesi Perangkat & Keamanan</h2><p>Riwayat akses akun verifikator anggaran</p></div></div>
              <button type="button" className="u-link" style={{ color: '#b4121f' }} onClick={() => { setSessions((p) => p.filter((s) => s.current)); toast.push('Sesi perangkat lain diputuskan (simulasi).'); }}>Putuskan Lainnya</button></div>
            <div className="u-sessions">
              {sessions.map((s) => (
                <div key={s.id} className="u-session">
                  {s.current ? <Monitor size={22} /> : <Laptop size={22} />}
                  <div>
                    <strong>{s.name} {s.current ? <span className="u-badge u-badge-navy">Sedang Aktif</span> : <time className="u-hint">{s.when}</time>}</strong>
                    <p>{s.detail}</p><p>{s.ip} • {s.place}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="bk-lastpw"><Lock size={16} /> Kata Sandi Terakhir Diubah <b>28 Hari Lalu</b></p>
          </section>
        </aside>
      </div>

      <section className="card u-form-foot">
        <p className="u-autosave" style={{ flex: 1 }}><Info size={16} /> Perubahan pada spesimen paraf dan kontak resmi akan langsung tercermin pada lembar disposisi telaah.</p>
        <div className="u-foot-actions">
          <button type="button" className="u-btn u-btn-soft" onClick={cancel} disabled={!dirty}>Batalkan Perubahan</button>
          <button type="button" className="u-btn u-btn-primary" onClick={save} disabled={!dirty}><Save size={15} /> Simpan Pengaturan Akun</button>
        </div>
      </section>

      <Modal open={pwModal} title="Ubah Kata Sandi" onClose={() => setPwModal(false)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setPwModal(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={changePw}>Perbarui</button></>}>
        {[['current', 'Kata sandi saat ini', 'current-password'], ['next', 'Kata sandi baru (minimal 8 karakter)', 'new-password'], ['confirm', 'Konfirmasi kata sandi baru', 'new-password']].map(([k, label, ac]) => (
          <div className="u-field" key={k}><label className="u-label" htmlFor={`bk-pw-${k}`}>{label}</label><input id={`bk-pw-${k}`} type="password" autoComplete={ac} className={`u-input ${pwErr[k] ? 'invalid' : ''}`} value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />{pwErr[k] && <p className="u-err">{pwErr[k]}</p>}</div>
        ))}
      </Modal>
    </div>
  );
}