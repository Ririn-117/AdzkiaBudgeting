import { useRef, useState } from 'react';
import {
  BadgeCheck, Bell, Camera, ClipboardList, Contact, History, IdCard, Lock, Mail, MonitorSmartphone, Network,
  PenLine, Pencil, Phone, Save, ShieldCheck, SlidersHorizontal, Smartphone, UserRound, Laptop, KeyRound, Upload, ArrowRight, ShieldAlert,
} from 'lucide-react';
import {
  ACCESS_ROWS, AUDIT_LOG, BASE, INITIAL_SESSIONS, PROFILE_FORM, PROFILE_PREFS,
} from '../../data/unitData';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const TABS = [
  ['bio', 'Biodata & Unit Kerja', UserRound],
  ['akses', 'Kewenangan & Akses RKAT', Network],
  ['ttd', 'Tanda Tangan & Verifikasi Digital', PenLine],
  ['aman', 'Keamanan & Kata Sandi', ShieldCheck],
];
const PHONE_RE = /^\+?[0-9\s-]{8,20}$/;

function ReadField({ label, value, icon: Icon, hint }) {
  return (
    <div className="u-field">
      <span className="u-label">{label}</span>
      <div className="u-iwrap">
        <input className="u-input" readOnly value={value} aria-label={label} style={{ paddingRight: '2.4rem' }} />
        {Icon && <Icon size={17} className="ic-right" />}
      </div>
      {hint && <p className="u-hint">{hint}</p>}
    </div>
  );
}

export default function Profil() {
  const toast = useToast();
  const photoRef = useRef(null);
  const sigRef = useRef(null);

  const [tab, setTab] = useState('bio');
  const [saved, setSaved] = useState({ phone: PROFILE_FORM.phone, prefs: PROFILE_PREFS });
  const [phone, setPhone] = useState(PROFILE_FORM.phone);
  const [prefs, setPrefs] = useState(PROFILE_PREFS);
  const [phoneErr, setPhoneErr] = useState('');
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [auditOpen, setAuditOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState({});

  const dirty = phone !== saved.phone || JSON.stringify(prefs) !== JSON.stringify(saved.prefs);

  const save = () => {
    if (!PHONE_RE.test(phone.trim())) { setPhoneErr('Nomor tidak valid. Contoh: +62 812-6789-0123'); return; }
    setPhoneErr('');
    setSaved({ phone: phone.trim(), prefs });
    toast.push('Pembaruan profil disimpan (simulasi, belum tersimpan di server).');
  };
  const cancel = () => { setPhone(saved.phone); setPrefs(saved.prefs); setPhoneErr(''); };

  const pickImage = (setter, maxMb, label) => (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast.push(`${label} harus berupa gambar (PNG/JPG).`, 'error'); return; }
    if (f.size > maxMb * 1024 * 1024) { toast.push(`${label} melebihi ${maxMb} MB.`, 'error'); return; }
    setter(URL.createObjectURL(f));
    toast.push(`${label} diperbarui (pratinjau lokal).`);
  };

  const changePassword = () => {
    const e = {};
    if (!pw.current) e.current = 'Kata sandi saat ini wajib diisi.';
    if (pw.next.length < 8) e.next = 'Kata sandi baru minimal 8 karakter.';
    if (pw.confirm !== pw.next) e.confirm = 'Konfirmasi tidak sama.';
    setPwErr(e);
    if (Object.keys(e).length) return;
    setPw({ current: '', next: '', confirm: '' });
    toast.push('Kata sandi diperbarui (simulasi, belum terhubung ke server).');
  };

  const prefRows = [
    ['twofa', ShieldCheck, 'Otentikasi Dua Faktor (2FA)', 'Wajibkan kode keamanan OTP setiap menyetujui kuitansi belanja di atas Rp 10.000.000'],
    ['whatsapp', Bell, 'Notifikasi WhatsApp Real-time (Pencairan SP2D)', `Kirim ringkasan otomatis ke ${phone} saat bendahara yayasan mentransfer dana`],
    ['revisi', Mail, 'Peringatan Revisi Berkas oleh BKPU / Auditor', 'Dapatkan surat teguran & catatan perbaikan via email ketika usulan dikembalikan oleh verifikator'],
  ];

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Sistem' }, { label: 'Profil Saya' }]}
        title="Profil Pengguna & Pengaturan Akun"
        subtitle="Kelola identitas pejabat pengusul anggaran, unit penugasan, spesimen tanda tangan digital, dan preferensi keamanan akun Universitas Adzkia."
        actions={<div className="u-verified"><i /><div><b>Akun Terverifikasi & Aktif</b><span>SK Rektor No. 142/SK/UA/2024 (2024-2028)</span></div></div>}
      />

      <section className="card u-profile-card">
        <div className="u-photo-wrap">
          {photo ? <img src={photo} alt="Foto profil" /> : <div className="u-photo-ph">RH</div>}
          <button type="button" aria-label="Ganti foto" onClick={() => photoRef.current?.click()}><Camera size={16} /></button>
        </div>
        <div className="u-profile-info">
          <h2>Dr. Rahmat Hidayat, M.Pd <span className="u-tag">Kaprodi / Pengusul RKAT</span></h2>
          <p>Ketua Program Studi S1 Pendidikan Guru Madrasah Ibtidaiyah (PGMI)</p>
          <div className="u-profile-meta">
            <span><IdCard size={14} /> NIDN: <b>1024088501</b></span>
            <span><Network size={14} /> FTK Universitas Adzkia Padang</span>
            <span><BadgeCheck size={14} /> KPA Terdaftar</span>
            <span><Mail size={14} /> <span className="u-mono">r.hidayat@adzkia.ac.id</span></span>
            <span><Phone size={14} /> <span className="u-mono">{saved.phone}</span></span>
          </div>
        </div>
        <button type="button" className="u-btn u-btn-navy" onClick={() => photoRef.current?.click()}><Contact size={15} /> Ubah Foto Profil</button>
        <input ref={photoRef} type="file" accept="image/*" hidden onChange={pickImage(setPhoto, 2, 'Foto profil')} />
      </section>

      <div className="u-tabs" role="tablist">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on maroon' : ''}`} onClick={() => setTab(k)}><Icon size={15} /> {label}</button>
        ))}
      </div>

      <div className="u-profile-grid">
        <div className="u-profile-left">
          {tab === 'bio' && (
            <>
              <section className="card">
                <div className="u-step-head">
                  <div>
                    <h2 className="u-h2" style={{ marginBottom: '0.2rem !important' }}><IdCard size={20} /> Informasi Data Diri & Kepegawaian</h2>
                    <p className="u-hint">Sinkronisasi otomatis dengan basis data SIMPEG Universitas Adzkia</p>
                  </div>
                  <span className="u-badge u-badge-sky">Sinkron: 12 menit lalu</span>
                </div>
                <div className="u-grid-2" style={{ marginTop: '1rem' }}>
                  <ReadField label="Nama Lengkap & Gelar Akademik" value={PROFILE_FORM.fullName} icon={BadgeCheck} hint="Data master dilindungi kebijakan BKN/Kemenag." />
                  <ReadField label="NIDN / NIP Kampus" value={PROFILE_FORM.nidn} icon={Lock} hint="Nomor Induk Dosen Nasional terdaftar di PDDikti." />
                  <ReadField label="Pangkat / Jabatan Fungsional" value={PROFILE_FORM.rank} />
                  <ReadField label="Status Kepegawaian & TMT" value={PROFILE_FORM.employment} />
                  <ReadField label="Email Resmi Institusi" value={PROFILE_FORM.email} icon={ShieldCheck} hint="Digunakan untuk akses SSO & korespondensi formal RKAT." />
                  <div className="u-field">
                    <label className="u-label" htmlFor="phone">Nomor WhatsApp / Seluler Aktif</label>
                    <div className="u-iwrap">
                      <input id="phone" className={`u-input ${phoneErr ? 'invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} style={{ paddingRight: '2.4rem' }} />
                      <Pencil size={16} className="ic-right" />
                    </div>
                    {phoneErr ? <p className="u-err">{phoneErr}</p> : <p className="u-hint">Penerima kode OTP otorisasi pencairan SP2D.</p>}
                  </div>
                </div>
              </section>

              <section className="card">
                <h2 className="u-h2" style={{ marginBottom: '0.2rem !important' }}><SlidersHorizontal size={20} /> Preferensi Otorisasi & Pemberitahuan Anggaran</h2>
                <p className="u-hint">Konfigurasi kanal pesan instan dan persetujuan bertingkat saat dana dicairkan</p>
                <div className="u-pref-list">
                  {prefRows.map(([k, Icon, title, desc]) => (
                    <label key={k} className="u-pref-card">
                      <Icon size={20} />
                      <div><strong>{title}</strong><p>{desc}</p></div>
                      <span className="u-toggle"><input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} /><span /></span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="card u-form-foot" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="u-btn u-btn-soft" onClick={cancel} disabled={!dirty}>Batalkan Perubahan</button>
                <button type="button" className="u-btn u-btn-primary" onClick={save} disabled={!dirty}><Save size={15} /> Simpan Pembaruan Profil</button>
              </section>
            </>
          )}

          {tab === 'akses' && (
            <section className="card">
              <h2 className="u-h2"><Network size={20} /> Kewenangan & Akses RKAT</h2>
              <div className="u-scroll">
                <table className="u-table" style={{ minWidth: 420 }}>
                  <thead><tr><th>Modul / Fitur</th><th>Hak Akses</th></tr></thead>
                  <tbody>{ACCESS_ROWS.map(([a, b]) => <tr key={a}><td className="u-cell-title">{a}</td><td>{b}</td></tr>)}</tbody>
                </table>
              </div>
              <p className="u-hint" style={{ marginTop: '0.7rem' }}>Perubahan kewenangan hanya dapat dilakukan oleh BAUK melalui SK penugasan.</p>
            </section>
          )}

          {tab === 'ttd' && (
            <section className="card">
              <h2 className="u-h2"><PenLine size={20} /> Tanda Tangan & Verifikasi Digital</h2>
              <div className="u-sign-grid">
                <div className="u-sign-box">
                  {signature ? <img src={signature} alt="Spesimen tanda tangan" /> : <span>Belum ada spesimen tanda tangan</span>}
                </div>
                <div>
                  <p className="u-hint" style={{ marginBottom: '0.7rem' }}>Unggah gambar tanda tangan (PNG/JPG, maks. 1 MB) dengan latar putih atau transparan.</p>
                  <button type="button" className="u-btn u-btn-navy" onClick={() => sigRef.current?.click()}><Upload size={15} /> Unggah Spesimen</button>
                  <input ref={sigRef} type="file" accept="image/*" hidden onChange={pickImage(setSignature, 1, 'Spesimen tanda tangan')} />
                </div>
              </div>
              <div className="u-note u-note-success" style={{ marginTop: '1rem' }}>
                <BadgeCheck size={18} />
                <div><strong>Sertifikat Elektronik BSrE aktif</strong><p>Berlaku hingga 15 Januari 2026. Diperpanjang melalui Puskom.</p></div>
              </div>
            </section>
          )}

          {tab === 'aman' && (
            <section className="card">
              <h2 className="u-h2"><KeyRound size={20} /> Ubah Kata Sandi</h2>
              <div className="u-pw-form">
                {[['current', 'Kata sandi saat ini', 'current-password'], ['next', 'Kata sandi baru (minimal 8 karakter)', 'new-password'], ['confirm', 'Konfirmasi kata sandi baru', 'new-password']].map(([k, label, ac]) => (
                  <div className="u-field" key={k}>
                    <label className="u-label" htmlFor={`pw-${k}`}>{label}</label>
                    <input id={`pw-${k}`} type="password" autoComplete={ac} className={`u-input ${pwErr[k] ? 'invalid' : ''}`} value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />
                    {pwErr[k] && <p className="u-err">{pwErr[k]}</p>}
                  </div>
                ))}
                <button type="button" className="u-btn u-btn-primary" onClick={changePassword}><Save size={15} /> Perbarui Kata Sandi</button>
              </div>
            </section>
          )}
        </div>

        <aside className="u-profile-right">
          <section className="card">
            <h2 className="u-h2"><ShieldAlert size={20} /> Hak Akses Anggaran</h2>
            <dl className="u-kv">
              <div><dt>Peran Sistem</dt><dd>Unit Pengusul (Kaprodi)</dd></div>
              <div><dt>Tingkat Otoritas</dt><dd style={{ color: '#0b6b44' }}>Tingkat I (Pengusul Murni)</dd></div>
              <div><dt>Persetujuan Dekan</dt><dd>Fakultas Tarbiyah</dd></div>
              <div><dt>Tahun Anggaran Aktif</dt><dd style={{ color: '#7a0c16' }}>2024/2025 Genap</dd></div>
            </dl>
            <div className="u-note" style={{ marginTop: '0.8rem' }}>
              <ClipboardList size={18} />
              <p style={{ margin: 0 }}>Perubahan unit pengusul atau perpanjangan SK penugasan harus divalidasi oleh Biro Administrasi Umum & Kepegawaian (BAUK).</p>
            </div>
          </section>

          <section className="card">
            <h2 className="u-h2"><MonitorSmartphone size={20} /> Sesi Perangkat Aktif <i className="u-live" /></h2>
            <div className="u-sessions">
              {sessions.map((s) => (
                <div key={s.id} className="u-session">
                  {s.current ? <Laptop size={22} /> : <Smartphone size={22} />}
                  <div>
                    <strong>{s.device} {s.current && <span className="u-badge u-badge-green">Sesi ini</span>}</strong>
                    <p>{s.detail}</p>
                    <p>{s.since}</p>
                    {!s.current && (
                      <button type="button" className="u-link" onClick={() => { setSessions((p) => p.filter((x) => x.id !== s.id)); toast.push(`Perangkat "${s.device}" dikeluarkan (simulasi).`); }}>Keluarkan Perangkat</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="u-h2"><History size={20} /> Catatan Audit Akun</h2>
            <ul className="u-timeline">
              {AUDIT_LOG.slice(0, 3).map((a) => (
                <li key={a.id} className={`tl-${a.tone}`}><i /><div><strong style={{ fontSize: '0.88rem' }}>{a.title}</strong><p style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.meta}</p></div></li>
              ))}
            </ul>
            <button type="button" className="u-link" onClick={() => setAuditOpen(true)}>Lihat Rekam Jejak Selengkapnya <ArrowRight size={13} /></button>
          </section>
        </aside>
      </div>

      <Modal open={auditOpen} wide title="Rekam Jejak Akun" onClose={() => setAuditOpen(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setAuditOpen(false)}>Tutup</button>}>
        <ul className="u-timeline">
          {AUDIT_LOG.map((a) => (
            <li key={a.id} className={`tl-${a.tone}`}><i /><div><strong>{a.title}</strong><p>{a.meta}</p></div></li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
