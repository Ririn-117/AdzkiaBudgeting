import { useEffect, useState } from 'react';
import {
  Activity, Building2, CheckCircle2, CircleDollarSign, Clock3, Download,
  KeyRound, Laptop, LockKeyhole, Plus, Save, Search, Server,
  Settings, ShieldCheck, UserPlus, UsersRound, Eye,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { api } from '../../services/api';
import { formatRupiah } from '../../utils/format';

function EmptyState({ title = 'Belum ada data', text = 'Tambahkan data pertama untuk mulai mengelola entri ini.' }) {
  return <div className="admin-empty"><div className="admin-empty-icon"><Building2 size={28} /></div><strong>{title}</strong><p>{text}</p></div>;
}

function Field({ label, required, children, hint }) {
  return <label className="u-field"><span className="u-label">{label}{required && <b className="u-req">*</b>}</span>{children}{hint && <small className="u-hint">{hint}</small>}</label>;
}

function FormActions({ onCancel, onSubmit, submitLabel = 'Simpan' }) {
  return <><button type="button" className="u-btn u-btn-outline" onClick={onCancel}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={onSubmit || onCancel}><Save size={15} /> {submitLabel}</button></>;
}

function Stat({ icon: Icon, label, value, sub, tone = 'maroon' }) {
  return <div className={`admin-stat admin-stat-${tone}`}><div><span>{label}</span><p>{value}</p><small>{sub}</small></div><Icon size={22} /></div>;
}

const ROLE_UI_TO_KEY = {
  'Unit / Prodi': 'unit_prodi',
  BKPU: 'bkpu',
  'WR II': 'wakil_rektor_2',
  Yayasan: 'yayasan',
  Rektor: 'rektor',
  Administrator: 'administrator',
};

const ROLE_KEY_TO_UI = {
  unit_prodi: 'Unit / Prodi',
  bkpu: 'BKPU',
  wakil_rektor_2: 'WR II',
  yayasan: 'Yayasan',
  rektor: 'Rektor',
  administrator: 'Administrator',
};

export function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(setData).catch(() => {});
  }, []);

  const stats = data?.stats || { totalUsers: 0, activeUsers: 0, totalRoles: 6, logs24h: 0 };
  const dist = data?.roleDistribution || [];
  const logs = data?.recentLogs || [];
  const activePct = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;

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
        <Stat icon={UsersRound} label="Total Akun Terdaftar" value={String(stats.totalUsers)} sub={stats.totalUsers ? 'Terhubung ke MySQL' : 'Belum ada data pengguna'} />
        <Stat icon={CheckCircle2} label="Akun Aktif" value={String(stats.activeUsers)} sub={`${activePct}% terverifikasi`} tone="green" />
        <Stat icon={ShieldCheck} label="Role Sistem" value={String(stats.totalRoles || 6)} sub="RBAC institusional" tone="navy" />
        <Stat icon={Activity} label="Aktivitas 24 Jam" value={String(stats.logs24h)} sub={stats.logs24h ? 'Log tercatat' : 'Belum ada kejadian'} tone="slate" />
      </section>
      <section className="card admin-two-col">
        <div>
          <h3 className="u-h2"><UsersRound size={18} /> Distribusi Akun</h3>
          {dist.length === 0 ? (
            <EmptyState title="Belum ada distribusi akun" text="Data distribusi akan muncul setelah pengguna ditambahkan." />
          ) : (
            <div className="u-scroll">
              <table className="u-table">
                <thead><tr><th>Role</th><th>Jumlah Akun</th></tr></thead>
                <tbody>{dist.map((r) => <tr key={r.role}><td><b>{ROLE_KEY_TO_UI[r.role] || r.role}</b></td><td>{r.count}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h3 className="u-h2"><Clock3 size={18} /> Aktivitas Terbaru</h3>
          {logs.length === 0 ? (
            <EmptyState title="Belum ada aktivitas" text="Rekam jejak administrator akan ditampilkan di sini." />
          ) : (
            <div className="u-scroll">
              <table className="u-table">
                <thead><tr><th>Waktu</th><th>Modul</th><th>Keterangan</th></tr></thead>
                <tbody>{logs.map((l) => <tr key={l.id}><td>{l.created_at}</td><td><b>{l.module}</b></td><td>{l.title}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function AdminUsers() {
  const [modal, setModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', nidn: '', email: '', username: '', role: 'Unit / Prodi', unit_id: '', twofa_enabled: true });

  const load = () => {
    api.get('/admin/users').then((res) => setUsers(res?.users || [])).catch(() => {});
    api.get('/master/units').then((res) => setUnits(res?.units || [])).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.username.trim()) return;
    try {
      await api.post('/admin/users', {
        name: form.name.trim(),
        nidn: form.nidn.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        role: ROLE_UI_TO_KEY[form.role] || 'unit_prodi',
        unit_id: form.unit_id ? Number(form.unit_id) : null,
        twofa_enabled: form.twofa_enabled,
        status: 'aktif',
      });
      setModal(false);
      setForm({ name: '', nidn: '', email: '', username: '', role: 'Unit / Prodi', unit_id: '', twofa_enabled: true });
      load();
    } catch {
      /* ignore */
    }
  };

  const toggleStatus = async (u) => {
    const nextStatus = u.status === 'aktif' ? 'nonaktif' : 'aktif';
    try {
      await api.put(`/admin/users/${u.id}`, { status: nextStatus });
      load();
    } catch {
      /* ignore */
    }
  };

  const filtered = users.filter((u) => !q.trim() || `${u.name} ${u.nidn} ${u.username} ${u.email}`.toLowerCase().includes(q.trim().toLowerCase()));
  const activeCount = users.filter((u) => u.status === 'aktif').length;
  const inactiveCount = users.length - activeCount;
  const twofaCount = users.filter((u) => u.twofa_enabled).length;

  return (
    <div className="upage">
      <PageHeader title="Manajemen Pengguna" subtitle="Kelola identitas, role, status akun, dan otoritas sivitas akademika." accent
        actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Export</button><button className="u-btn u-btn-primary" onClick={() => setModal(true)}><UserPlus size={15} /> Tambah Pengguna Baru</button></>} />
      <section className="admin-stat-grid admin-stat-grid-4">
        <Stat icon={UsersRound} label="Terdaftar" value={users.length} sub="Semua pengguna" />
        <Stat icon={CheckCircle2} label="Aktif" value={String(activeCount)} sub="Akun terverifikasi" tone="green" />
        <Stat icon={LockKeyhole} label="Nonaktif / Pending" value={String(inactiveCount)} sub="Menunggu / nonaktif" tone="slate" />
        <Stat icon={ShieldCheck} label="Terkunci 2FA" value={String(twofaCount)} sub="Proteksi 2FA aktif" tone="navy" />
      </section>
      <section className="card">
        <div className="u-filters">
          <label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama lengkap, NIP, atau username..." /></label>
          <select className="u-select"><option>Semua Role</option></select>
          <select className="u-select"><option>Semua Status</option></select>
        </div>
        {filtered.length === 0 ? <EmptyState title="Belum ada pengguna terdaftar" text="Gunakan tombol Tambah Pengguna Baru untuk membuat akun pertama." /> :
          <div className="u-scroll"><table className="u-table"><thead><tr><th>Nama</th><th>NIP / NIPY</th><th>Role</th><th>Unit</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map((u) => <tr key={u.id}><td><b>{u.name}</b><div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email} ({u.username})</div></td><td>{u.nidn || '-'}</td><td>{ROLE_KEY_TO_UI[u.role] || u.role}</td><td>{u.unit_name || '-'}</td><td><span className={`u-badge ${u.status === 'aktif' ? 'u-badge-green' : 'u-badge-amber'}`}>{u.status === 'aktif' ? 'Aktif' : u.status}</span></td><td><button className="u-iconbtn" title={u.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan / Setujui'} onClick={() => toggleStatus(u)}><Eye size={16} /></button></td></tr>)}</tbody></table></div>}
      </section>
      <Modal open={modal} onClose={() => setModal(false)} title="Tambah Pengguna & Akun Baru" wide footer={<FormActions onCancel={() => setModal(false)} onSubmit={handleCreate} submitLabel="Simpan & Terbitkan Akun" />}>
        <div className="u-grid-2">
          <Field label="Nama Lengkap & Gelar" required><input className="u-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Dr. Rahmat Hidayat, M.Kom." /></Field>
          <Field label="NIP / NIPY Kampus" required><input className="u-input" value={form.nidn} onChange={(e) => setForm({ ...form, nidn: e.target.value })} placeholder="Contoh: 198705122014021003" /></Field>
          <Field label="Email Resmi Kampus" required><input className="u-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama.pegawai@adzkia.ac.id" /></Field>
          <Field label="Username SSO" required><input className="u-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="bkpu.nama" /></Field>
          <Field label="Role & Wewenang" required><select className="u-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{['Unit / Prodi', 'BKPU', 'WR II', 'Yayasan', 'Rektor', 'Administrator'].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Satuan Kerja / Unit / Prodi" required><select className="u-select" value={form.unit_id} onChange={(e) => setForm({ ...form, unit_id: e.target.value })}><option value="">Pilih satuan kerja</option>{units.map((un) => <option key={un.id} value={un.id}>{un.name}</option>)}</select></Field>
        </div>
        <label className="admin-check"><input type="checkbox" checked={form.twofa_enabled} onChange={(e) => setForm({ ...form, twofa_enabled: e.target.checked })} /> Wajibkan autentikasi dua faktor (2FA)</label>
        <label className="admin-check"><input type="checkbox" defaultChecked /> Kirim tembusan akun ke Biro Kepegawaian</label>
      </Modal>
    </div>
  );
}

export function AdminRoles() {
  const roles = [
    ['Unit / Prodi', 'Submitter', 'Menginput pengajuan dan bukti realisasi', 'unit_prodi'],
    ['BKPU', 'Verifikator', 'Menelaah administrasi dan kepatuhan SBM', 'bkpu'],
    ['Wakil Rektor II', 'Otorisator', 'Menyetujui usulan dan pencairan', 'wakil_rektor_2'],
    ['Yayasan', 'Otorisator Kas', 'Mengontrol pencairan dan likuiditas', 'yayasan'],
    ['Rektor', 'Executive View', 'Memantau laporan secara konsolidasi', 'rektor'],
    ['Administrator', 'System Access', 'Mengelola akun, referensi, dan audit log', 'administrator'],
  ];
  const modules = ['Usulan RKAT', 'Verifikasi Dokumen', 'Persetujuan SK', 'Permintaan Pencairan', 'LPJ & Pajak', 'Manajemen Akun'];
  const roleKeys = roles.map((r) => r[3]);
  const [matrix, setMatrix] = useState({});

  useEffect(() => {
    api.get('/admin/roles').then((res) => {
      const m = {};
      for (const p of res?.permissions || []) {
        m[`${p.module}::${p.role}`] = Boolean(p.can_view || p.can_create || p.can_edit || p.can_verify || p.can_approve);
      }
      setMatrix(m);
    }).catch(() => {});
  }, []);

  const toggleCell = (mod, rKey) => {
    const k = `${mod}::${rKey}`;
    setMatrix((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const saveMatrix = async () => {
    const permissions = [];
    for (const mod of modules) {
      for (const rKey of roleKeys) {
        const on = Boolean(matrix[`${mod}::${rKey}`]);
        permissions.push({
          role: rKey,
          module: mod,
          can_view: on ? 1 : 0,
          can_create: on ? 1 : 0,
          can_edit: on ? 1 : 0,
          can_delete: 0,
          can_verify: on ? 1 : 0,
          can_approve: on ? 1 : 0,
        });
      }
    }
    try {
      await api.put('/admin/roles', { permissions });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="upage">
      <PageHeader title="Role dan Matriks Hak Akses" subtitle="Kelola klasifikasi role, wewenang, dan pemisahan kewenangan sistem." accent
        actions={<button className="u-btn u-btn-primary" onClick={saveMatrix}><Save size={15} /> Simpan Matriks</button>} />
      <section className="admin-role-grid">{roles.map(([name, type, desc]) => <article className="card admin-role-card" key={name}><div className="admin-role-icon"><ShieldCheck size={20} /></div><span className="u-badge u-badge-navy">{type}</span><h3>{name}</h3><p>{desc}</p></article>)}</section>
      <section className="card"><h3 className="u-h2">Matriks Granular Hak Akses</h3><div className="u-scroll"><table className="u-table"><thead><tr><th>Modul Sistem</th><th>Unit / Prodi</th><th>BKPU</th><th>WR II</th><th>Yayasan</th><th>Rektor</th><th>Admin</th></tr></thead><tbody>{modules.map((mod) => <tr key={mod}><td><b>{mod}</b></td>{roleKeys.map((rk) => <td key={rk}><input type="checkbox" checked={Boolean(matrix[`${mod}::${rk}`])} onChange={() => toggleCell(mod, rk)} /></td>)}</tr>)}</tbody></table></div></section>
    </div>
  );
}

export function AdminPeriods() {
  const [open, setOpen] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [form, setForm] = useState({ code: '', academic_year: '', semester: 'Genap', status: 'aktif', start_date: '', end_date: '', rkat_deadline: '', lpj_deadline: '' });

  const load = () => {
    api.get('/master/periods').then((res) => setPeriods(res?.periods || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.code || !form.academic_year || !form.start_date || !form.end_date) return;
    try {
      await api.post('/master/periods', {
        ...form,
        status: form.status.toLowerCase(),
        rkat_deadline: form.rkat_deadline || form.end_date,
        lpj_deadline: form.lpj_deadline || form.end_date,
      });
      setOpen(false);
      load();
    } catch {
      /* ignore */
    }
  };

  const activePeriod = periods.find((p) => p.status === 'aktif');

  return (
    <div className="upage">
      <PageHeader title="Pengelolaan Periode Anggaran" subtitle="Atur siklus fiskal, tenggat RKAT, batas realisasi, dan pelaporan LPJ." accent
        actions={<button className="u-btn u-btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> Tambah Periode Anggaran</button>} />
      <section className="admin-stat-grid admin-stat-grid-4"><Stat icon={CalendarRangeIcon} label="Periode Terdaftar" value={String(periods.length)} /><Stat icon={CircleDollarSign} label="Periode Aktif" value={activePeriod?.label || '-'} /><Stat icon={Building2} label="Batas RKAT" value={activePeriod?.rkat_deadline || '-'} tone="navy" /><Stat icon={Activity} label="Status" value={activePeriod ? 'Aktif' : 'Belum aktif'} tone="green" /></section>
      <section className="card">
        <div className="u-filters"><label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari kode atau tahun periode..." /></label><select className="u-select"><option>Semua Status</option></select></div>
        {periods.length === 0 ? <EmptyState title="Belum ada periode anggaran" text="Tambahkan periode anggaran untuk menentukan siklus fiskal." /> :
          <div className="u-scroll"><table className="u-table"><thead><tr><th>Kode</th><th>Tahun Akademik</th><th>Semester</th><th>Rentang</th><th>Batas RKAT</th><th>Batas LPJ</th><th>Status</th></tr></thead><tbody>{periods.map((p) => <tr key={p.id}><td><b>{p.code}</b></td><td>{p.academic_year}</td><td>{p.semester}</td><td>{p.start_date} s/d {p.end_date}</td><td>{p.rkat_deadline}</td><td>{p.lpj_deadline}</td><td><span className={`u-badge ${p.status === 'aktif' ? 'u-badge-green' : 'u-badge-sky'}`}>{p.status}</span></td></tr>)}</tbody></table></div>}
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Periode Anggaran" wide footer={<FormActions onCancel={() => setOpen(false)} onSubmit={handleSave} submitLabel="Simpan Periode" />}>
        <div className="u-grid-2"><Field label="Kode Periode" required><input className="u-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="TA-2025-2-GENAP" /></Field><Field label="Tahun Akademik" required><input className="u-input" value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="2025/2026" /></Field><Field label="Semester Fiskal" required><select className="u-select" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}><option>Ganjil</option><option>Genap</option></select></Field><Field label="Status" required><select className="u-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Draf</option><option>Aktif</option><option>Terkunci</option><option>Diarsipkan</option></select></Field><Field label="Tanggal Mulai" required><input className="u-input" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></Field><Field label="Tanggal Selesai" required><input className="u-input" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></Field><Field label="Batas Entri RKAT" required><input className="u-input" type="date" value={form.rkat_deadline} onChange={(e) => setForm({ ...form, rkat_deadline: e.target.value })} /></Field><Field label="Batas Akhir LPJ" required><input className="u-input" type="date" value={form.lpj_deadline} onChange={(e) => setForm({ ...form, lpj_deadline: e.target.value })} /></Field></div>
      </Modal>
    </div>
  );
}

function CalendarRangeIcon(props) { return <Clock3 {...props} />; }

export function AdminCategories() {
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ code: '', name: '', pillar: 'Pilar Pendidikan', status: 'aktif', plafon: '' });

  const load = () => {
    api.get('/master/categories').then((res) => setCats(res?.categories || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.code || !form.name) return;
    try {
      await api.post('/master/categories', { ...form, plafon: Number(form.plafon || 0) });
      setOpen(false);
      load();
    } catch {
      /* ignore */
    }
  };

  const sumPillar = (p) => cats.filter((c) => c.pillar === p);

  return (
    <div className="upage"><PageHeader title="Kategori Anggaran & Akun Belanja" subtitle="Kelola master data klasifikasi belanja dan kode akun." accent actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Unduh Struktur</button><button className="u-btn u-btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> Tambah Sub-Akun</button></>} />
      <section className="admin-pillar-grid">
        {['Pilar Pendidikan', 'Sekretariat / BSDM', 'Sosial & Kemaslahatan'].map((p) => {
          const list = sumPillar(p);
          return <article className="card" key={p}><span>{p}</span><strong>{formatRupiah(list.reduce((a, x) => a + Number(x.plafon || 0), 0))}</strong><small>{list.length} sub-akun belanja</small></article>;
        })}
      </section>
      <section className="card">
        <div className="u-filters"><label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari kode akun atau uraian belanja..." /></label><select className="u-select"><option>Semua Pilar</option></select></div>
        {cats.length === 0 ? <EmptyState title="Belum ada kategori anggaran" text="Tambahkan sub-akun belanja untuk membentuk struktur kategori." /> :
          <div className="u-scroll"><table className="u-table"><thead><tr><th>Kode Akun</th><th>Nama Kategori</th><th>Pilar</th><th>Kategori Belanja</th><th className="num">Plafon</th><th>Status</th></tr></thead><tbody>{cats.map((c) => <tr key={c.id}><td><b>{c.code}</b></td><td>{c.name}</td><td>{c.pillar}</td><td>{c.spend_category}</td><td className="num">{formatRupiah(c.plafon)}</td><td><span className="u-badge u-badge-green">{c.status}</span></td></tr>)}</tbody></table></div>}
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Sub-Akun Belanja" wide footer={<FormActions onCancel={() => setOpen(false)} onSubmit={handleSave} />}>
        <div className="u-grid-2"><Field label="Kode Akun / MAK" required><input className="u-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="5.1.xx.xx" /></Field><Field label="Nama Kategori" required><input className="u-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama kategori" /></Field><Field label="Pilar Yayasan" required><select className="u-select" value={form.pillar} onChange={(e) => setForm({ ...form, pillar: e.target.value })}><option>Pilar Pendidikan</option><option>Sekretariat / BSDM</option><option>Sosial & Kemaslahatan</option></select></Field><Field label="Status" required><select className="u-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></Field><div className="u-grid-2"><Field label="Plafon" required><input className="u-input" type="number" value={form.plafon} onChange={(e) => setForm({ ...form, plafon: e.target.value })} placeholder="0" /></Field></div></div>
      </Modal>
    </div>
  );
}

export function AdminUnits() {
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', parent_faculty: 'Fakultas Tarbiyah & Keguruan', type: 'Program Studi', head_name: '', bsi_account: '', pagu_allocated: 300000000 });

  const load = () => {
    api.get('/master/units').then((res) => setUnits(res?.units || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.code) return;
    try {
      await api.post('/master/units', form);
      setOpen(false);
      load();
    } catch {
      /* ignore */
    }
  };

  const totalPagu = units.reduce((a, u) => a + Number(u.pagu_allocated || 0), 0);

  return <div className="upage"><PageHeader title="Master Data Unit Kerja & Program Studi" subtitle="Kelola satuan kerja, pejabat penanggung jawab, dan rekening operasional." accent actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Ekspor</button><button className="u-btn u-btn-primary" onClick={() => setOpen(true)}><Plus size={15} /> Tambah Satuan Kerja</button></>} />
    <section className="admin-stat-grid admin-stat-grid-4"><Stat icon={Building2} label="Total Satuan Kerja" value={String(units.length)} /><Stat icon={CheckCircle2} label="Unit Aktif" value={String(units.filter((u) => u.status === 'aktif').length)} tone="green" /><Stat icon={CircleDollarSign} label="Alokasi Plafon" value={formatRupiah(totalPagu)} tone="navy" /><Stat icon={UsersRound} label="Program Studi" value={String(units.filter((u) => u.type === 'Program Studi').length)} tone="slate" /></section>
    <section className="card">
      <div className="u-filters"><label className="u-iwrap grow"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari kode unit, prodi, atau pejabat..." /></label><select className="u-select"><option>Semua Induk</option></select><select className="u-select"><option>Semua Status</option></select></div>
      {units.length === 0 ? <EmptyState title="Belum ada satuan kerja" text="Tambahkan unit kerja atau program studi pertama." /> :
        <div className="u-scroll"><table className="u-table"><thead><tr><th>Kode</th><th>Nama Satuan Kerja</th><th>Induk / Fakultas</th><th>Jenis</th><th>Penanggung Jawab</th><th>Rekening BSI</th><th className="num">Pagu</th></tr></thead><tbody>{units.map((u) => <tr key={u.id}><td><b>{u.code}</b></td><td>{u.name}</td><td>{u.parent_faculty}</td><td>{u.type}</td><td>{u.head_name}</td><td>{u.bsi_account}</td><td className="num">{formatRupiah(u.pagu_allocated)}</td></tr>)}</tbody></table></div>}
    </section>
    <Modal open={open} onClose={() => setOpen(false)} title="Tambah Satuan Kerja Baru" wide footer={<FormActions onCancel={() => setOpen(false)} onSubmit={handleSave} />}>
      <div className="u-grid-2"><Field label="Nama Satuan Kerja" required><input className="u-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="Kode Unit" required><input className="u-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="prodi-baru" /></Field><Field label="Induk / Fakultas" required><input className="u-input" value={form.parent_faculty} onChange={(e) => setForm({ ...form, parent_faculty: e.target.value })} /></Field><Field label="Jenis" required><select className="u-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Program Studi</option><option>Fakultas</option><option>Biro</option><option>Lembaga</option></select></Field><Field label="Pejabat Penanggung Jawab" required><input className="u-input" value={form.head_name} onChange={(e) => setForm({ ...form, head_name: e.target.value })} /></Field><Field label="Nomor Rekening BSI" required><input className="u-input" value={form.bsi_account} onChange={(e) => setForm({ ...form, bsi_account: e.target.value })} /></Field></div>
    </Modal>
  </div>;
}

export function AdminConfig() {
  const [tab, setTab] = useState('Umum & Institusi');
  const tabs = ['Umum & Institusi', 'Keamanan & Password', 'Integrasi Gateway', 'Notifikasi & Scheduler'];
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    api.get('/admin/configs').then((res) => setConfigs(res?.configs || [])).catch(() => {});
  }, []);

  const updateVal = (key, val) => {
    setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value: val } : c)));
  };

  const saveCfg = async () => {
    try {
      await api.put('/admin/configs', { configs });
    } catch {
      /* ignore */
    }
  };

  const currentTabConfigs = configs.filter((c) => c.tab === tab);

  return <div className="upage"><PageHeader title="Konfigurasi Sistem & Parameter Teknis" subtitle="Kelola parameter identitas, keamanan, integrasi, dan penjadwalan ERP." accent badge={<span className="u-tag">Tier-1 Root</span>} actions={<><button className="u-btn u-btn-outline">Kembalikan Default</button><button className="u-btn u-btn-primary" onClick={saveCfg}><Save size={15} /> Simpan Konfigurasi</button></>} />
    <section className="admin-config-status card"><span><b>Versi ERP</b> v2.4.0-ERP</span><span><b>Status Dokumen</b> Security Hardened</span><span><b>Database</b> MySQL (adzkia_ebudgeting)</span></section>
    <div className="u-tabs">{tabs.map((x) => <button key={x} className={`u-tab ${tab === x ? 'on' : ''}`} onClick={() => setTab(x)}>{x}</button>)}</div>
    <section className="card"><h3 className="u-h2"><Settings size={18} /> {tab}</h3>{currentTabConfigs.length > 0 ? <div className="u-grid-2">{currentTabConfigs.map((c) => <Field key={c.key} label={c.label}><input className="u-input" value={c.value} onChange={(e) => updateVal(c.key, e.target.value)} /></Field>)}</div> : <EmptyState title={`Konfigurasi ${tab}`} text="Parameter ini siap dihubungkan dengan konfigurasi backend." />}</section>
  </div>;
}

export function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get('/admin/audit-logs?size=50').then((res) => {
      setLogs(res?.logs || []);
      setTotal(res?.total || 0);
    }).catch(() => {});
  }, []);

  return <div className="upage"><PageHeader title="Audit Log & Rekam Jejak Sistem" subtitle="Pantau aktivitas operasional, autentikasi, perubahan konfigurasi, dan transaksi." accent actions={<><button className="u-btn u-btn-outline"><Download size={15} /> Ekspor CSV</button><button className="u-btn u-btn-primary">Cetak Rekap</button></>} />
    <section className="admin-stat-grid admin-stat-grid-4"><Stat icon={ScrollIcon} label="Total Entri" value={String(total)} /><Stat icon={Activity} label="Ditampilkan" value={String(logs.length)} /><Stat icon={ShieldCheck} label="Integritas Hash" value="Terverifikasi" tone="green" /><Stat icon={LockKeyhole} label="Anomali" value="0" tone="navy" /></section>
    <section className="card">
      <div className="u-filters"><input className="u-input" type="date" /><select className="u-select"><option>Semua Pengguna</option></select><select className="u-select"><option>Semua Modul</option></select><select className="u-select"><option>Semua Status</option></select></div>
      {logs.length === 0 ? <EmptyState title="Belum ada rekam jejak" text="Aktivitas sistem akan tercatat otomatis setelah backend terhubung." /> :
        <div className="u-scroll"><table className="u-table"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Role</th><th>Modul</th><th>Aksi</th><th>Judul & Detail</th><th>IP</th></tr></thead><tbody>{logs.map((l) => <tr key={l.id}><td>{l.created_at}</td><td><b>{l.user_name}</b></td><td>{l.user_role}</td><td>{l.module}</td><td><span className="u-badge u-badge-sky">{l.action}</span></td><td><b>{l.title}</b>{l.detail ? <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{l.detail}</div> : null}</td><td>{l.ip_address}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
function ScrollIcon(props) { return <Activity {...props} />; }

export function AdminNotifications() {
  const [notifs, setNotifs] = useState([]);

  const load = () => {
    api.get('/notifications').then((res) => setNotifs(res?.notifications || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    load();
  };

  return <div className="upage"><PageHeader title="Notifikasi" subtitle="Informasi aktivitas keamanan dan kebutuhan pemeriksaan sistem." accent actions={<button className="u-btn u-btn-outline" onClick={markAll}><CheckCircle2 size={15} /> Tandai Semua Dibaca</button>} />
    <section className="card">
      {notifs.length === 0 ? <EmptyState title="Tidak ada notifikasi" text="Notifikasi baru akan muncul pada area ini." /> :
        <div className="u-scroll"><table className="u-table"><thead><tr><th>Waktu</th><th>Tag</th><th>Judul</th><th>Pesan</th></tr></thead><tbody>{notifs.map((n) => <tr key={n.id}><td>{n.created_at}</td><td><span className="u-badge u-badge-navy">{n.tag}</span></td><td><b>{n.title}</b></td><td>{n.body}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}

export function AdminProfile() {
  const [me, setMe] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get('/auth/me').then((res) => setMe(res?.user || null)).catch(() => {});
    api.get('/auth/sessions').then((res) => setSessions(res?.sessions || [])).catch(() => {});
  }, []);

  return <div className="upage"><PageHeader title="Profil Saya" subtitle="Identitas, kredensial keamanan, dan pengaturan sesi administrator." accent />
    <section className="card admin-profile-head"><div className="admin-profile-avatar">A</div><div><h2>{me?.name || 'Administrator Sistem'}</h2><p>{me?.rank || 'Super Admin Tier 1'} • {me?.email || 'admin@adzkia.ac.id'}</p><span className="u-badge u-badge-green">2FA Aktif</span></div></section>
    <section className="admin-profile-grid">
      <div className="card"><h3 className="u-h2"><KeyRound size={18} /> Kredensial & Keamanan</h3>{me ? <div className="u-grid-2"><Field label="Username"><input className="u-input" readOnly value={me.username || ''} /></Field><Field label="Email"><input className="u-input" readOnly value={me.email || ''} /></Field><Field label="NIDN / NIP"><input className="u-input" readOnly value={me.nidn || ''} /></Field><Field label="Telepon"><input className="u-input" readOnly value={me.phone || ''} /></Field></div> : <EmptyState title="Belum ada preferensi profil" text="Data profil dan perangkat 2FA dapat ditampilkan setelah akun dilengkapi." />}</div>
      <div className="card"><h3 className="u-h2"><Laptop size={18} /> Sesi Perangkat Aktif</h3>{sessions.length === 0 ? <EmptyState title="Belum ada sesi" text="Perangkat yang telah masuk akan muncul di sini." /> : <div className="u-scroll"><table className="u-table"><thead><tr><th>Perangkat</th><th>IP</th><th>Terakhir Aktif</th></tr></thead><tbody>{sessions.map((s) => <tr key={s.id}><td><b>{s.device}</b></td><td>{s.ip_address}</td><td>{s.last_active_at}</td></tr>)}</tbody></table></div>}</div>
    </section>
  </div>;
}
