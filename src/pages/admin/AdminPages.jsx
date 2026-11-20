import { useState } from 'react';
import {
  Activity, Building2, CheckCircle2, CircleDollarSign, Clock3, Download,
  KeyRound, Laptop, LockKeyhole, Plus, Save, Search, Server,
  Settings, ShieldCheck, UserPlus, UsersRound, Eye,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';

function EmptyState({ title = 'Belum ada data', text = 'Tambahkan data pertama untuk mulai mengelola entri ini.' }) {
  return <div className="admin-empty"><div className="admin-empty-icon"><Building2 size={28} /></div><strong>{title}</strong><p>{text}</p></div>;
}

function Field({ label, required, children, hint }) {
  return <label className="u-field"><span className="u-label">{label}{required && <b className="u-req">*</b>}</span>{children}{hint && <small className="u-hint">{hint}</small>}</label>;
}

function FormActions({ onCancel, submitLabel = 'Simpan' }) {
  return <><button type="button" className="u-btn u-btn-outline" onClick={onCancel}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={onCancel}><Save size={15} /> {submitLabel}</button></>;
}

function Stat({ icon: Icon, label, value, sub, tone = 'maroon' }) {
  return <div className={`admin-stat admin-stat-${tone}`}><div><span>{label}</span><p>{value}</p><small>{sub}</small></div><Icon size={22} /></div>;
}

export function AdminDashboard() {
  return (
    <div className="upage">
      <PageHeader
        title="Dashboard Administrator"
        subtitle="Tata kelola sistem terpusat dan pemantauan kepatuhan E-Budgeting."
        accent
        badge={<span className="u-tag">Root Admin</span>}
      />
      <section className="admin-welcome card">
        <div><span className="admin-status-dot">AKTIF</span><h2>Infrastruktur & Akun Terpusat</h2><p>Ringkasan operasional sistem Universitas Adzkia Padang.</p></div>
        <div className="admin-server"><Server size={18} /><div><span>NODE</span><strong>SRV-CORE-ADZ.01</strong></div></div>
      </section>
      <section className="admin-stat-grid">
        <Stat icon={UsersRound} label="Total Akun Terdaftar" value="0" sub="Belum ada data pengguna" />
        <Stat icon={CheckCircle2} label="Akun Aktif" value="0" sub="0% terverifikasi" tone="green" />
        <Stat icon={ShieldCheck} label="Role Sistem" value="6" sub="RBAC institusional" tone="navy" />
        <Stat icon={Activity} label="Aktivitas 24 Jam" value="0" sub="Belum ada kejadian" tone="slate" />
      </section>
      <section className="card admin-two-col">
        <div><h3 className="u-h2"><UsersRound size={18} /> Distribusi Akun</h3><EmptyState title="Belum ada distribusi akun" text="Data distribusi akan muncul setelah pengguna ditambahkan." /></div>
        <div><h3 className="u-h2"><Clock3 size={18} /> Aktivitas Terbaru</h3><EmptyState title="Belum ada aktivitas" text="Rekam jejak administrator akan ditampilkan di sini." /></div>
      </section>
    </div>
  );
}

export function AdminUsers() {
  const [modal, setModal] = useState(false);
  const [users] = useState([]);
  return (
    <div className="upage">
      <PageHeader title="Manajemen Pengguna" subtitle="Kelola identitas, role, status akun, dan otoritas sivitas akademika." accent
        actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Export</button><button className="u-btn u-btn-primary" onClick={() => setModal(true)}><UserPlus size={15} /> Tambah Pengguna Baru</button></>} />
      <section className="admin-stat-grid admin-stat-grid-4">
        <Stat icon={UsersRound} label="Terdaftar" value={users.length} sub="Semua pengguna" />
        <Stat icon={CheckCircle2} label="Aktif" value="0" sub="Akun terverifikasi" tone="green" />
        <Stat icon={LockKeyhole} label="Nonaktif" value="0" sub="Tidak dapat masuk" tone="slate" />
        <Stat icon={ShieldCheck} label="Terkunci 2FA" value="0" sub="Insiden keamanan" tone="navy" />
      </section>
      <section className="card">
        <div className="u-filters">
          <label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari nama lengkap, NIP, atau username..." /></label>
          <select className="u-select"><option>Semua Role</option></select>
          <select className="u-select"><option>Semua Status</option></select>
        </div>
        {users.length === 0 ? <EmptyState title="Belum ada pengguna terdaftar" text="Gunakan tombol Tambah Pengguna Baru untuk membuat akun pertama." /> :
          <div className="u-scroll"><table className="u-table"><thead><tr><th>Nama</th><th>NIP / NIPY</th><th>Role</th><th>Unit</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{users.map(u => <tr key={u.name}><td><b>{u.name}</b></td><td>{u.nip}</td><td>{u.role}</td><td>{u.unit}</td><td><span className="u-badge u-badge-green">Aktif</span></td><td><button className="u-iconbtn"><Eye size={16} /></button></td></tr>)}</tbody></table></div>}
      </section>
      <Modal open={modal} onClose={() => setModal(false)} title="Tambah Pengguna & Akun Baru" wide footer={<FormActions onCancel={() => setModal(false)} submitLabel="Simpan & Terbitkan Akun" />}>
        <div className="u-grid-2">
          <Field label="Nama Lengkap & Gelar" required><input className="u-input" placeholder="Contoh: Dr. Rahmat Hidayat, M.Kom." /></Field>
          <Field label="NIP / NIPY Kampus" required><input className="u-input" placeholder="Contoh: 198705122014021003" /></Field>
          <Field label="Email Resmi Kampus" required><input className="u-input" placeholder="nama.pegawai@adzkia.ac.id" /></Field>
          <Field label="Username SSO" required><input className="u-input" placeholder="bkpu.nama" /></Field>
          <Field label="Role & Wewenang" required><select className="u-select"><option>Pilih role</option>{['Unit / Prodi','BKPU','WR II','Yayasan','Rektor','Administrator'].map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Satuan Kerja / Unit / Prodi" required><select className="u-select"><option>Pilih satuan kerja</option></select></Field>
        </div>
        <label className="admin-check"><input type="checkbox" /> Wajibkan autentikasi dua faktor (2FA)</label>
        <label className="admin-check"><input type="checkbox" /> Kirim tembusan akun ke Biro Kepegawaian</label>
      </Modal>
    </div>
  );
}

export function AdminRoles() {
  const roles = [
    ['Unit / Prodi', 'Submitter', 'Menginput pengajuan dan bukti realisasi'],
    ['BKPU', 'Verifikator', 'Menelaah administrasi dan kepatuhan SBM'],
    ['Wakil Rektor II', 'Otorisator', 'Menyetujui usulan dan pencairan'],
    ['Yayasan', 'Otorisator Kas', 'Mengontrol pencairan dan likuiditas'],
    ['Rektor', 'Executive View', 'Memantau laporan secara konsolidasi'],
    ['Administrator', 'System Access', 'Mengelola akun, referensi, dan audit log'],
  ];
  return (
    <div className="upage">
      <PageHeader title="Role dan Matriks Hak Akses" subtitle="Kelola klasifikasi role, wewenang, dan pemisahan kewenangan sistem." accent
        actions={<button className="u-btn u-btn-primary"><Save size={15} /> Simpan Matriks</button>} />
      <section className="admin-role-grid">{roles.map(([name,type,desc]) => <article className="card admin-role-card" key={name}><div className="admin-role-icon"><ShieldCheck size={20} /></div><span className="u-badge u-badge-navy">{type}</span><h3>{name}</h3><p>{desc}</p></article>)}</section>
      <section className="card"><h3 className="u-h2">Matriks Granular Hak Akses</h3><div className="u-scroll"><table className="u-table"><thead><tr><th>Modul Sistem</th><th>Unit / Prodi</th><th>BKPU</th><th>WR II</th><th>Yayasan</th><th>Rektor</th><th>Admin</th></tr></thead><tbody>{['Usulan RKAT','Verifikasi Dokumen','Persetujuan SK','Permintaan Pencairan','LPJ & Pajak','Manajemen Akun'].map(x => <tr key={x}><td><b>{x}</b></td>{[1,2,3,4,5,6].map(i => <td key={i}><input type="checkbox" /></td>)}</tr>)}</tbody></table></div></section>
    </div>
  );
}

export function AdminPeriods() {
  const [open, setOpen] = useState(false);
  return (
    <div className="upage">
      <PageHeader title="Pengelolaan Periode Anggaran" subtitle="Atur siklus fiskal, tenggat RKAT, batas realisasi, dan pelaporan LPJ." accent
        actions={<button className="u-btn u-btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> Tambah Periode Anggaran</button>} />
      <section className="admin-stat-grid admin-stat-grid-4"><Stat icon={CalendarRangeIcon} label="Periode Terdaftar" value="0" /><Stat icon={CircleDollarSign} label="Total Transaksi" value="Rp 0" /><Stat icon={Building2} label="Unit Aktif" value="0" tone="navy" /><Stat icon={Activity} label="Status" value="Belum aktif" tone="green" /></section>
      <section className="card"><div className="u-filters"><label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari kode atau tahun periode..." /></label><select className="u-select"><option>Semua Status</option></select></div><EmptyState title="Belum ada periode anggaran" text="Tambahkan periode anggaran untuk menentukan siklus fiskal." /></section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Periode Anggaran" wide footer={<FormActions onCancel={() => setOpen(false)} submitLabel="Simpan Periode" />}>
        <div className="u-grid-2"><Field label="Kode Periode" required><input className="u-input" placeholder="TA-2025-2-GENAP" /></Field><Field label="Tahun Akademik" required><input className="u-input" placeholder="2025/2026" /></Field><Field label="Semester Fiskal" required><select className="u-select"><option>Ganjil</option><option>Genap</option></select></Field><Field label="Status" required><select className="u-select"><option>Draf</option><option>Aktif</option><option>Terkunci</option><option>Diarsipkan</option></select></Field><Field label="Tanggal Mulai" required><input className="u-input" type="date" /></Field><Field label="Tanggal Selesai" required><input className="u-input" type="date" /></Field><Field label="Batas Entri RKAT" required><input className="u-input" type="date" /></Field><Field label="Batas Akhir LPJ" required><input className="u-input" type="date" /></Field></div>
      </Modal>
    </div>
  );
}

function CalendarRangeIcon(props) { return <Clock3 {...props} />; }

export function AdminCategories() {
  const [open, setOpen] = useState(false);
  return (
    <div className="upage"><PageHeader title="Kategori Anggaran & Akun Belanja" subtitle="Kelola master data klasifikasi belanja dan kode akun." accent actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Unduh Struktur</button><button className="u-btn u-btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> Tambah Sub-Akun</button></>} />
      <section className="admin-pillar-grid"><article className="card"><span>Pilar Pendidikan</span><strong>Rp 0</strong><small>0 sub-akun belanja</small></article><article className="card"><span>Sekretariat / BSDM</span><strong>Rp 0</strong><small>0 sub-akun belanja</small></article><article className="card"><span>Sosial & Kemaslahatan</span><strong>Rp 0</strong><small>0 sub-akun belanja</small></article></section>
      <section className="card"><div className="u-filters"><label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari kode akun atau uraian belanja..." /></label><select className="u-select"><option>Semua Pilar</option></select></div><EmptyState title="Belum ada kategori anggaran" text="Tambahkan sub-akun belanja untuk membentuk struktur kategori." /></section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Sub-Akun Belanja" wide footer={<FormActions onCancel={() => setOpen(false)} />}>
        <div className="u-grid-2"><Field label="Kode Akun / MAK" required><input className="u-input" placeholder="5.1.xx.xx" /></Field><Field label="Nama Kategori" required><input className="u-input" placeholder="Nama kategori" /></Field><Field label="Pilar Yayasan" required><select className="u-select"><option>Pilih pilar</option></select></Field><Field label="Status" required><select className="u-select"><option>Aktif</option><option>Nonaktif</option></select></Field><div className="u-grid-2"><Field label="Plafon" required><input className="u-input" type="number" placeholder="0" /></Field></div></div>
      </Modal>
    </div>
  );
}

export function AdminUnits() {
  const [open, setOpen] = useState(false);
  return <div className="upage"><PageHeader title="Master Data Unit Kerja & Program Studi" subtitle="Kelola satuan kerja, pejabat penanggung jawab, dan rekening operasional." accent actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Ekspor</button><button className="u-btn u-btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> Tambah Satuan Kerja</button></>} />
    <section className="admin-stat-grid admin-stat-grid-4"><Stat icon={Building2} label="Total Satuan Kerja" value="0" /><Stat icon={CheckCircle2} label="Unit Aktif" value="0" tone="green" /><Stat icon={CircleDollarSign} label="Alokasi Plafon" value="Rp 0" tone="navy" /><Stat icon={UsersRound} label="Program Studi" value="0" tone="slate" /></section>
    <section className="card"><div className="u-filters"><label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari kode unit, prodi, atau pejabat..." /></label><select className="u-select"><option>Semua Induk</option></select><select className="u-select"><option>Semua Status</option></select></div><EmptyState title="Belum ada satuan kerja" text="Tambahkan unit kerja atau program studi pertama." /></section>
    <Modal open={open} onClose={() => setOpen(false)} title="Tambah Satuan Kerja Baru" wide footer={<FormActions onCancel={() => setOpen(false)} />}>
      <div className="u-grid-2"><Field label="Nama Satuan Kerja" required><input className="u-input" /></Field><Field label="Kode Unit" required><input className="u-input" placeholder="UNIT-01/FTK" /></Field><Field label="Induk / Fakultas" required><select className="u-select"><option>Pilih induk</option></select></Field><Field label="Jenis" required><select className="u-select"><option>Program Studi</option><option>Fakultas</option><option>Biro</option><option>Lembaga</option></select></Field><Field label="Pejabat Penanggung Jawab" required><input className="u-input" /></Field><Field label="Nomor Rekening BSI" required><input className="u-input" /></Field></div>
    </Modal>
  </div>;
}

export function AdminConfig() {
  const [tab,setTab]=useState('Umum');
  const tabs=['Umum & Institusi','Keamanan & Password','Integrasi Gateway','Notifikasi & Scheduler'];
  return <div className="upage"><PageHeader title="Konfigurasi Sistem & Parameter Teknis" subtitle="Kelola parameter identitas, keamanan, integrasi, dan penjadwalan ERP." accent badge={<span className="u-tag">Tier-1 Root</span>} actions={<><button className="u-btn u-btn-outline">Kembalikan Default</button><button className="u-btn u-btn-primary"><Save size={15} /> Simpan Konfigurasi</button></>} />
    <section className="admin-config-status card"><span><b>Versi ERP</b> v2.4.0-ERP</span><span><b>Status Dokumen</b> Security Hardened</span><span><b>Backup Terakhir</b> Belum tersedia</span></section>
    <div className="u-tabs">{tabs.map(x => <button key={x} className={`u-tab ${tab===x?'on':''}`} onClick={()=>setTab(x)}>{x}</button>)}</div>
    <section className="card"><h3 className="u-h2"><Settings size={18} /> {tab}</h3>{tab==='Umum & Institusi'?<div className="u-grid-2"><Field label="Nama Aplikasi" required><input className="u-input" defaultValue="E-Budgeting Universitas Adzkia Padang" /></Field><Field label="Mata Uang"><input className="u-input" defaultValue="Rupiah Indonesia (IDR)" /></Field><Field label="Versi Sistem"><input className="u-input" defaultValue="v2.4.0-ERP" /></Field><Field label="Lokasi Tata Usaha"><input className="u-input" placeholder="Alamat pusat tata usaha" /></Field></div>:<EmptyState title={`Konfigurasi ${tab}`} text="Parameter ini siap dihubungkan dengan konfigurasi backend." />}</section>
  </div>;
}

export function AdminAudit() {
  return <div className="upage"><PageHeader title="Audit Log & Rekam Jejak Sistem" subtitle="Pantau aktivitas operasional, autentikasi, perubahan konfigurasi, dan transaksi." accent actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Ekspor CSV</button><button className="u-btn u-btn-primary">Cetak Rekap</button></>} />
    <section className="admin-stat-grid admin-stat-grid-4"><Stat icon={ScrollIcon} label="Total Entri" value="0" /><Stat icon={Activity} label="Aktivitas Hari Ini" value="0" /><Stat icon={ShieldCheck} label="Integritas Hash" value="Belum diuji" tone="green" /><Stat icon={LockKeyhole} label="Anomali" value="0" tone="navy" /></section>
    <section className="card"><div className="u-filters"><input className="u-input" type="date" /><select className="u-select"><option>Semua Pengguna</option></select><select className="u-select"><option>Semua Modul</option></select><select className="u-select"><option>Semua Status</option></select></div><EmptyState title="Belum ada rekam jejak" text="Aktivitas sistem akan tercatat otomatis setelah backend terhubung." /></section>
  </div>;
}
function ScrollIcon(props){return <Activity {...props}/>}

export function AdminNotifications() {
  return <div className="upage"><PageHeader title="Notifikasi" subtitle="Informasi aktivitas keamanan dan kebutuhan pemeriksaan sistem." accent actions={<button className="u-btn u-btn-outline"><CheckCircle2 size={15} /> Tandai Semua Dibaca</button>} />
    <section className="card"><EmptyState title="Tidak ada notifikasi" text="Notifikasi baru akan muncul pada area ini." /></section>
  </div>;
}

export function AdminProfile() {
  return <div className="upage"><PageHeader title="Profil Saya" subtitle="Identitas, kredensial keamanan, dan pengaturan sesi administrator." accent />
    <section className="card admin-profile-head"><div className="admin-profile-avatar">A</div><div><h2>Administrator Sistem</h2><p>Super Admin Tier 1</p><span className="u-badge u-badge-green">2FA Aktif</span></div></section>
    <section className="admin-profile-grid"><div className="card"><h3 className="u-h2"><KeyRound size={18} /> Kredensial & Keamanan</h3><EmptyState title="Belum ada preferensi profil" text="Data profil dan perangkat 2FA dapat ditampilkan setelah akun dilengkapi." /></div><div className="card"><h3 className="u-h2"><Laptop size={18} /> Sesi Perangkat Aktif</h3><EmptyState title="Belum ada sesi" text="Perangkat yang telah masuk akan muncul di sini." /></div></section>
  </div>;
}
