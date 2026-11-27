import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, Banknote, CalendarDays, CheckCircle2, CloudUpload, Eye, FilePlus2,
  FileText, GraduationCap, ListChecks, PlusCircle, Save, Send, Trash2, UserRound, X, ClipboardList, Calculator, FileUp,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { formatBytes } from '../../utils/csv';
import { BASE, CATEGORY_OPTIONS, PAGU_TERSEDIA, REQUIRED_DOCS, SPEND_CATEGORIES } from '../../data/unitData';
import { createSubmission } from '../../services/unitService';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const DRAFT_KEY = 'ebudgeting_draft_pengajuan';
const MAX_FILE = 10 * 1024 * 1024;
const EMPTY_FORM = {
  name: '', category: '', pic: 'Dr. Rahmat Hidayat, M.Pd (081267890123)', start: '', end: '', background: '',
};
const EMPTY_ITEM = { name: '', spec: '', cat: SPEND_CATEGORIES[0], qty: '', unit: '', price: '' };

const SBM_ROWS = [
  ['Honorarium narasumber eksternal', 'per jam', 1500000],
  ['Honorarium moderator', 'per sesi', 750000],
  ['Konsumsi makan siang', 'per kotak', 45000],
  ['Snack / coffee break', 'per kotak', 25000],
  ['Sewa ruang pertemuan', 'per hari', 1500000],
  ['Transport lokal panitia', 'per orang', 150000],
];

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PengajuanCreate() {
  const navigate = useNavigate();
  const toast = useToast();
  const fileRef = useRef(null);

  const [initial] = useState(loadDraft);
  const [form, setForm] = useState(initial?.form ?? EMPTY_FORM);
  const [items, setItems] = useState(initial?.items ?? []);
  const [docs, setDocs] = useState([]);
  const [errors, setErrors] = useState({});
  const [savedAt, setSavedAt] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [sbmOpen, setSbmOpen] = useState(false);
  const [itemForm, setItemForm] = useState(EMPTY_ITEM);
  const [itemErr, setItemErr] = useState({});

  // Simpan otomatis draft (hanya di sesi browser ini; file tidak ikut tersimpan)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, items }));
        setSavedAt(new Date());
      } catch {
        /* abaikan jika penyimpanan tidak tersedia */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [form, items]);

  const total = useMemo(() => items.reduce((a, i) => a + i.qty * i.price, 0), [items]);
  const remaining = PAGU_TERSEDIA - total;
  const enough = remaining >= 0;
  const usedPercent = Math.min(100, Math.round((total / PAGU_TERSEDIA) * 100));
  const docsOk = REQUIRED_DOCS.filter((d) => docs.some((x) => x.type === d));
  const missingDocs = REQUIRED_DOCS.filter((d) => !docsOk.includes(d));

  const setField = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));
  const timeLabel = savedAt
    ? savedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
    : '--:--';

  /* ---------- Item RAB ---------- */
  const submitItem = () => {
    const e = {};
    if (!itemForm.name.trim()) e.name = 'Nama item wajib diisi.';
    if (!(Number(itemForm.qty) > 0)) e.qty = 'Volume harus lebih dari 0.';
    if (!itemForm.unit.trim()) e.unit = 'Satuan wajib diisi.';
    if (!(Number(itemForm.price) > 0)) e.price = 'Harga satuan harus lebih dari 0.';
    setItemErr(e);
    if (Object.keys(e).length) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now(), ...itemForm, name: itemForm.name.trim(), spec: itemForm.spec.trim(), unit: itemForm.unit.trim(), qty: Number(itemForm.qty), price: Number(itemForm.price) },
    ]);
    setItemForm(EMPTY_ITEM);
    setItemOpen(false);
    toast.push('Item anggaran ditambahkan.');
  };

  /* ---------- Berkas ---------- */
  const addFiles = (fileList) => {
    const incoming = Array.from(fileList);
    const accepted = [];
    incoming.forEach((f) => {
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
        toast.push(`"${f.name}" ditolak: hanya berkas PDF yang diterima.`, 'error');
      } else if (f.size > MAX_FILE) {
        toast.push(`"${f.name}" ditolak: ukuran melebihi 10 MB.`, 'error');
      } else {
        accepted.push(f);
      }
    });
    if (!accepted.length) return;
    setDocs((prev) => {
      const used = new Set(prev.map((d) => d.type));
      const next = [...prev];
      accepted.forEach((f) => {
        const type = REQUIRED_DOCS.find((d) => !used.has(d)) ?? 'Lainnya';
        used.add(type);
        next.push({ id: `${f.name}-${f.size}-${Math.random()}`, name: f.name, size: f.size, type, url: URL.createObjectURL(f), file: f });
      });
      return next;
    });
  };

  /* ---------- Kirim / simpan ---------- */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama kegiatan wajib diisi.';
    if (!form.category) e.category = 'Pilih kategori anggaran.';
    if (!form.pic.trim()) e.pic = 'Penanggung jawab wajib diisi.';
    if (!form.start || !form.end) e.date = 'Tanggal mulai dan selesai wajib diisi.';
    else if (form.end < form.start) e.date = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    if (form.background.trim().length < 30) e.background = 'Uraikan latar belakang dan output minimal 30 karakter.';
    if (items.length === 0) e.items = 'Tambahkan minimal satu item anggaran.';
    else if (!enough) e.items = 'Total usulan melebihi pagu yang tersedia.';
    if (missingDocs.length) e.docs = `Dokumen wajib belum lengkap: ${missingDocs.join(', ')}.`;
    return e;
  };

  const saveDraft = async () => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, items }));
      setSavedAt(new Date());
    } catch {
      /* abaikan */
    }
    try {
      const created = await createSubmission({
        ...form,
        name: form.name.trim() || 'Draft Usulan Kegiatan RKAT',
        category: form.category || CATEGORY_OPTIONS[0],
        pic: form.pic.trim() || 'Dr. Rahmat Hidayat, M.Pd',
        items,
        docs,
        submit: false,
      });
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* abaikan */
      }
      toast.push(`Draft ${created.id} berhasil disimpan ke database.`);
      navigate(`${BASE}/pengajuan`);
    } catch (err) {
      toast.push(err?.message || 'Gagal menyimpan draft ke server.', 'error');
    }
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.push('Periksa kembali isian yang ditandai merah.', 'error');
      return;
    }
    try {
      const created = await createSubmission({ ...form, items, docs, submit: true });
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* abaikan */
      }
      toast.push(`Pengajuan ${created.id} berhasil dikirim ke BKPU dan tersimpan di database.`);
      navigate(`${BASE}/pengajuan`);
    } catch (err) {
      toast.push(err?.message || 'Gagal mengirim pengajuan ke server.', 'error');
    }
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Pengajuan Anggaran' }, { label: 'Form Pengajuan' }]}
        title="Buat Pengajuan Anggaran Baru"
        subtitle="Lengkapi 3 bagian pengusulan anggaran kegiatan sesuai panduan RKAT TA 2024/2025 Universitas Adzkia Padang."
        accent
        actions={
          <div className="u-pagu-box">
            <span>Pagu alokasi unit (PGMI)</span>
            <strong>{formatRupiah(PAGU_TERSEDIA)}</strong>
            <em>Tersedia</em>
          </div>
        }
      />

      {/* Bagian 1 */}
      <section className="card u-section u-section-navy">
        <div className="u-section-head">
          <span className="u-section-icon navy"><ClipboardList size={20} /></span>
          <div>
            <h2>Bagian 1: Informasi Umum Kegiatan</h2>
            <p>Parameter administratif usulan RKAT unit akademik semester berjalan</p>
          </div>
        </div>

        <div className="u-grid-2">
          <div className="u-field">
            <label className="u-label" htmlFor="periode">Periode Anggaran <small>Terkunci otomatis</small></label>
            <div className="u-iwrap">
              <CalendarDays size={17} className="ic" />
              <input id="periode" className="u-input has-ic" readOnly value="TA 2024/2025 - Semester Genap" />
            </div>
          </div>
          <div className="u-field">
            <label className="u-label" htmlFor="unit">Unit / Program Studi <small>Fakultas Tarbiyah</small></label>
            <div className="u-iwrap">
              <GraduationCap size={17} className="ic" />
              <input id="unit" className="u-input has-ic" readOnly value="Program Studi Pendidikan Guru Madrasah Ibtidaiyah (PGMI)" />
            </div>
          </div>
        </div>

        <div className="u-field">
          <label className="u-label" htmlFor="name">Nama Kegiatan / Program Kerja <span className="u-req">*</span></label>
          <input id="name" className={`u-input ${errors.name ? 'invalid' : ''}`} value={form.name} onChange={setField('name')} placeholder="Contoh: Workshop Pengembangan Modul Digital untuk Guru Madrasah" />
          {errors.name ? <p className="u-err">{errors.name}</p> : <p className="u-hint">Gunakan judul formal yang terdaftar pada Rencana Operasional (RENOP) prodi tahun 2025.</p>}
        </div>

        <div className="u-grid-2">
          <div className="u-field">
            <label className="u-label" htmlFor="category">Kategori Anggaran <span className="u-req">*</span></label>
            <select id="category" className={`u-select ${errors.category ? 'invalid' : ''}`} value={form.category} onChange={setField('category')}>
              <option value="">Pilih kategori</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="u-err">{errors.category}</p>}
          </div>
          <div className="u-field">
            <label className="u-label" htmlFor="pic">Penanggung Jawab Kegiatan <span className="u-req">*</span></label>
            <div className="u-iwrap">
              <UserRound size={17} className="ic" />
              <input id="pic" className={`u-input has-ic ${errors.pic ? 'invalid' : ''}`} value={form.pic} onChange={setField('pic')} />
            </div>
            {errors.pic && <p className="u-err">{errors.pic}</p>}
          </div>
        </div>

        <div className="u-field">
          <span className="u-label">Estimasi Rentang Waktu Pelaksanaan <span className="u-req">*</span></span>
          <div className="u-grid-2">
            <input type="date" className={`u-input ${errors.date ? 'invalid' : ''}`} value={form.start} onChange={setField('start')} aria-label="Tanggal mulai" />
            <input type="date" className={`u-input ${errors.date ? 'invalid' : ''}`} value={form.end} onChange={setField('end')} min={form.start} aria-label="Tanggal selesai" />
          </div>
          {errors.date && <p className="u-err">{errors.date}</p>}
        </div>

        <div className="u-field">
          <label className="u-label" htmlFor="background">Latar Belakang, Urgensi & Capaian Output <span className="u-req">*</span><small>Standar Instrumen Akreditasi LAMDIK</small></label>
          <textarea id="background" className={`u-textarea ${errors.background ? 'invalid' : ''}`} value={form.background} onChange={setField('background')} placeholder="Jelaskan tujuan kegiatan, alasan pentingnya, dan luaran yang diharapkan." />
          {errors.background && <p className="u-err">{errors.background}</p>}
        </div>
      </section>

      {/* Bagian 2 */}
      <section className="card u-section u-section-maroon">
        <div className="u-section-head">
          <span className="u-section-icon maroon"><Calculator size={20} /></span>
          <div>
            <h2>Bagian 2: Rincian Rencana Anggaran Biaya (RAB)</h2>
            <p>Standar Biaya Masukan (SBM) Yayasan & Universitas Adzkia 2024</p>
          </div>
          <div className="u-section-actions">
            <button type="button" className="u-btn u-btn-soft" onClick={() => setSbmOpen(true)}><ListChecks size={15} /> Cek Tarif SBM</button>
            <button type="button" className="u-btn u-btn-primary" onClick={() => setItemOpen(true)}><PlusCircle size={15} /> Tambah Item Anggaran</button>
          </div>
        </div>

        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th>No</th><th>Nama Item & Spesifikasi Detail</th><th>Kategori Belanja</th>
                <th className="num">Volume</th><th>Satuan</th><th className="num">Harga Satuan (Rp)</th>
                <th className="num">Subtotal (Rp)</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id}>
                  <td>{i + 1}</td>
                  <td>
                    <span className="u-cell-title">{it.name}</span>
                    {it.spec && <span className="u-cell-sub">{it.spec}</span>}
                  </td>
                  <td><span className="u-badge u-badge-sky">{it.cat}</span></td>
                  <td className="num strong">{it.qty}</td>
                  <td>{it.unit}</td>
                  <td className="num">{new Intl.NumberFormat('id-ID').format(it.price)}</td>
                  <td className="num strong" style={{ color: '#161a77' }}>{new Intl.NumberFormat('id-ID').format(it.qty * it.price)}</td>
                  <td>
                    <button type="button" className="u-iconbtn danger" aria-label={`Hapus ${it.name}`} onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="u-empty">
              <strong>Belum ada item anggaran</strong>
              Klik "Tambah Item Anggaran" untuk menyusun rincian biaya kegiatan.
            </div>
          )}
        </div>
        {errors.items && <p className="u-err">{errors.items}</p>}

        <div className="u-total-grid">
          <div className="u-total-box">
            <span>Total Estimasi Usulan</span>
            <strong>{formatRupiah(total)}</strong>
            <small>{items.length} Komponen Anggaran Terinput</small>
            <Banknote size={22} />
          </div>
          <div className="u-total-box">
            <span>Validasi Ketersediaan Pagu</span>
            <span className={`u-badge ${enough ? 'u-badge-green' : 'u-badge-red'} corner`}>{enough ? 'Mencukupi' : 'Melebihi Pagu'}</span>
            <strong className={enough ? '' : 'neg'}>{formatRupiah(Math.abs(remaining))}</strong>
            <small>{enough ? 'Tersisa setelah usulan ini' : 'Kekurangan dari pagu tersedia'}</small>
            <div className={`u-bar ${enough ? 'maroon' : ''}`} style={{ marginTop: '0.6rem' }}><i style={{ width: `${usedPercent}%` }} /></div>
          </div>
        </div>
      </section>

      {/* Bagian 3 */}
      <section className="card u-section u-section-slate">
        <div className="u-section-head">
          <span className="u-section-icon navy"><FileUp size={20} /></span>
          <div>
            <h2>Bagian 3: Unggah Dokumen Pendukung</h2>
            <p>Syarat verifikasi berkas kelayakan oleh Biro Keuangan & Perencanaan Universitas (BKPU)</p>
          </div>
          <span className="u-hint">Maksimal 10 MB/berkas</span>
        </div>

        <div className="u-upload-grid">
          <div
            className={`u-drop ${dragging ? 'on' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          >
            <CloudUpload size={34} />
            <strong>Tarik & lepaskan berkas PDF ke sini</strong>
            <span>
              atau{' '}
              <button type="button" className="u-link" onClick={() => fileRef.current?.click()}>pilih file dari komputer</button>
            </span>
            <div className="u-drop-tags">
              {REQUIRED_DOCS.map((d, i) => <span key={d}>{i + 1}. {d}</span>)}
            </div>
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          </div>

          <div>
            <p className="u-files-title">Daftar berkas terlampir ({docsOk.length} dari {REQUIRED_DOCS.length} wajib terpenuhi)</p>
            <div className="u-files">
              {docs.map((d) => (
                <div key={d.id} className="u-file">
                  <FileText size={26} />
                  <div className="u-file-main">
                    <strong>{d.name}</strong>
                    <span>{formatBytes(d.size)} • <CheckCircle2 size={12} /> Format PDF valid</span>
                  </div>
                  <select className="u-select" value={d.type} aria-label={`Jenis dokumen ${d.name}`} onChange={(e) => setDocs((p) => p.map((x) => (x.id === d.id ? { ...x, type: e.target.value } : x)))}>
                    {[...REQUIRED_DOCS, 'Lainnya'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <a className="u-iconbtn" href={d.url} target="_blank" rel="noreferrer" aria-label={`Lihat ${d.name}`}><Eye size={17} /></a>
                  <button type="button" className="u-iconbtn" aria-label={`Hapus ${d.name}`} onClick={() => setDocs((p) => p.filter((x) => x.id !== d.id))}><X size={17} /></button>
                </div>
              ))}
              {missingDocs.map((d) => (
                <div key={d} className="u-file warn">
                  <AlertTriangle size={24} />
                  <div className="u-file-main">
                    <strong>{d} belum terunggah</strong>
                    <span>Wajib disertakan sebelum tahap persetujuan final Rektorat</span>
                  </div>
                  <button type="button" className="u-btn u-btn-sm u-btn-soft" onClick={() => fileRef.current?.click()}>Unggah</button>
                </div>
              ))}
            </div>
            {errors.docs && <p className="u-err" style={{ marginTop: '0.5rem' }}>{errors.docs}</p>}
          </div>
        </div>
      </section>

      {/* Footer aksi */}
      <section className="card u-form-foot">
        <p className="u-autosave">
          <i /> Perubahan draft otomatis tersimpan pada <b>{timeLabel} WIB</b>
        </p>
        <div className="u-foot-actions">
          <Link to={BASE} className="u-btn u-btn-soft"><ArrowLeft size={15} /> Kembali ke Dashboard</Link>
          <button type="button" className="u-btn u-btn-outline" onClick={saveDraft}><Save size={15} /> Simpan sebagai Draft</button>
          <button type="button" className="u-btn u-btn-primary" onClick={submit}><Send size={15} /> Ajukan Anggaran ke BKPU</button>
        </div>
      </section>

      <Modal
        open={itemOpen}
        title="Tambah Item Anggaran"
        onClose={() => setItemOpen(false)}
        footer={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={() => setItemOpen(false)}>Batal</button>
            <button type="button" className="u-btn u-btn-primary" onClick={submitItem}><FilePlus2 size={15} /> Simpan Item</button>
          </>
        }
      >
        <div className="u-field">
          <label className="u-label" htmlFor="i-name">Nama item <span className="u-req">*</span></label>
          <input id="i-name" className={`u-input ${itemErr.name ? 'invalid' : ''}`} value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
          {itemErr.name && <p className="u-err">{itemErr.name}</p>}
        </div>
        <div className="u-field">
          <label className="u-label" htmlFor="i-spec">Spesifikasi detail</label>
          <input id="i-spec" className="u-input" value={itemForm.spec} onChange={(e) => setItemForm({ ...itemForm, spec: e.target.value })} />
        </div>
        <div className="u-field">
          <label className="u-label" htmlFor="i-cat">Kategori belanja</label>
          <select id="i-cat" className="u-select" value={itemForm.cat} onChange={(e) => setItemForm({ ...itemForm, cat: e.target.value })}>
            {SPEND_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="u-grid-3">
          <div className="u-field">
            <label className="u-label" htmlFor="i-qty">Volume</label>
            <input id="i-qty" type="number" min="0" className={`u-input ${itemErr.qty ? 'invalid' : ''}`} value={itemForm.qty} onChange={(e) => setItemForm({ ...itemForm, qty: e.target.value })} />
            {itemErr.qty && <p className="u-err">{itemErr.qty}</p>}
          </div>
          <div className="u-field">
            <label className="u-label" htmlFor="i-unit">Satuan</label>
            <input id="i-unit" className={`u-input ${itemErr.unit ? 'invalid' : ''}`} value={itemForm.unit} onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })} placeholder="Orang/Sesi" />
            {itemErr.unit && <p className="u-err">{itemErr.unit}</p>}
          </div>
          <div className="u-field">
            <label className="u-label" htmlFor="i-price">Harga satuan (Rp)</label>
            <input id="i-price" type="number" min="0" className={`u-input ${itemErr.price ? 'invalid' : ''}`} value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} />
            {itemErr.price && <p className="u-err">{itemErr.price}</p>}
          </div>
        </div>
        <p className="u-hint">
          Subtotal: <b>{formatRupiah((Number(itemForm.qty) || 0) * (Number(itemForm.price) || 0))}</b>
        </p>
      </Modal>

      <Modal open={sbmOpen} wide title="Tarif Standar Biaya Masukan (SBM)" onClose={() => setSbmOpen(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setSbmOpen(false)}>Tutup</button>}>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 420 }}>
            <thead><tr><th>Komponen</th><th>Satuan</th><th className="num">Batas Tarif</th></tr></thead>
            <tbody>
              {SBM_ROWS.map(([n, u, p]) => (
                <tr key={n}><td className="u-cell-title">{n}</td><td>{u}</td><td className="num strong">{formatRupiah(p)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="u-hint">Tarif di atas adalah data contoh. Gunakan dokumen SBM resmi Universitas Adzkia sebagai acuan.</p>
      </Modal>
    </div>
  );
}
