import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote, ClipboardCheck, Download, Eye, FileClock, FileText, Lock, MessageSquareWarning,
  Pencil, RotateCcw, Route, Search, ShieldCheck, Trash2, X, AlertCircle, BadgeCheck, FilePen, UserRound,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import {
  BASE, CATEGORY_OPTIONS, DEFAULT_TA, SUBMISSIONS, SUBMISSION_STATUS, TA_OPTIONS,
} from '../../data/unitData';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import SummaryCard from '../../components/ui/SummaryCard';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const PAGE_SIZES = [6, 10, 20];

function StatusCell({ s }) {
  const meta = SUBMISSION_STATUS[s.status];
  return (
    <div className="u-status-cell">
      <StatusBadge tone={meta.tone} dot={s.status === 'revisi'}>
        {meta.label}
      </StatusBadge>
      {s.status === 'revisi' && (
        <p className="u-status-note">
          <MessageSquareWarning size={14} />
          <span>
            <b>Catatan BKPU:</b> {s.note}
          </span>
        </p>
      )}
      {(s.status === 'verifikasi' || s.status === 'disetujui') && <p className="u-status-text">{s.position}</p>}
      {s.status === 'draft' && (
        <div className="u-draft-progress">
          <div className="u-bar">
            <i style={{ width: `${s.completeness}%` }} />
          </div>
          <span>
            Kelengkapan {s.completeness}% {s.completenessNote}
          </span>
        </div>
      )}
    </div>
  );
}

export default function PengajuanList() {
  const toast = useToast();

  const [rows, setRows] = useState(SUBMISSIONS);
  const [q, setQ] = useState('');
  const [ta, setTa] = useState(DEFAULT_TA);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(PAGE_SIZES[0]);
  const [selected, setSelected] = useState([]);
  const [toDelete, setToDelete] = useState(null);

  const withReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!term || `${r.id} ${r.title} ${r.pic}`.toLowerCase().includes(term)) &&
        (!ta || r.ta === ta) &&
        (!status || r.status === status) &&
        (!category || r.category === category)
    );
  }, [rows, q, ta, status, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pageCount);
  const view = filtered.slice((current - 1) * size, current * size);

  const sumBy = (key) => {
    const list = rows.filter((r) => r.status === key);
    return { n: list.length, total: list.reduce((a, r) => a + r.total, 0) };
  };
  const verif = sumBy('verifikasi');
  const revisi = sumBy('revisi');
  const setuju = sumBy('disetujui');
  const draft = sumBy('draft');
  const grandTotal = rows.reduce((a, r) => a + r.total, 0);

  const allChecked = view.length > 0 && view.every((r) => selected.includes(r.id));
  const toggleAll = () =>
    setSelected((prev) =>
      allChecked ? prev.filter((id) => !view.some((r) => r.id === id)) : [...new Set([...prev, ...view.map((r) => r.id)])]
    );
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const reset = () => {
    setQ('');
    setTa(DEFAULT_TA);
    setStatus('');
    setCategory('');
    setPage(1);
  };

  const exportCsv = () => {
    const source = selected.length ? rows.filter((r) => selected.includes(r.id)) : filtered;
    downloadCsv('Daftar_Pengajuan_RKAT.csv', [
      ['No. Usulan', 'Tanggal', 'Program Kerja', 'PIC', 'Kategori', 'Sumber Dana', 'Total RAB', 'Status'],
      ...source.map((r) => [r.id, r.date, r.title, r.pic, r.category, r.source, r.total, SUBMISSION_STATUS[r.status].label]),
    ]);
    toast.push(`${source.length} usulan diekspor ke CSV.`);
  };

  const confirmDelete = () => {
    setRows((prev) => prev.filter((r) => r.id !== toDelete.id));
    setSelected((prev) => prev.filter((id) => id !== toDelete.id));
    toast.push(`Draft ${toDelete.id} dihapus.`);
    setToDelete(null);
  };

  const detail = (id) => `${BASE}/pengajuan/${id}`;

  const renderAction = (s) => {
    switch (s.status) {
      case 'revisi':
        return (
          <>
            <Link to={detail(s.id)} className="u-btn u-btn-primary u-btn-sm"><FilePen size={14} /> Revisi</Link>
            <Link to={detail(s.id)} className="u-iconbtn" aria-label={`Lihat ${s.id}`}><Eye size={17} /></Link>
          </>
        );
      case 'verifikasi':
        return (
          <>
            <Link to={detail(s.id)} className="u-btn u-btn-soft u-btn-sm"><Route size={14} /> Lacak</Link>
            <Link to={detail(s.id)} className="u-iconbtn" aria-label={`Lihat ${s.id}`}><Eye size={17} /></Link>
          </>
        );
      case 'disetujui':
        return (
          <>
            {s.phase === 'cairkan' ? (
              <Link to={`${BASE}/pencairan`} className="u-btn u-btn-navy u-btn-sm"><Banknote size={14} /> Cairkan</Link>
            ) : (
              <Link to={`${BASE}/laporan-spj`} className="u-btn u-btn-soft u-btn-sm"><ClipboardCheck size={14} /> LPJ</Link>
            )}
            <Link to={detail(s.id)} className="u-iconbtn" aria-label={`Lihat ${s.id}`}><Eye size={17} /></Link>
          </>
        );
      default:
        return (
          <>
            <Link to={`${BASE}/pengajuan/baru`} className="u-btn u-btn-outline u-btn-sm"><Pencil size={14} /> Lanjut</Link>
            <button type="button" className="u-iconbtn danger" aria-label={`Hapus ${s.id}`} onClick={() => setToDelete(s)}>
              <Trash2 size={17} />
            </button>
          </>
        );
    }
  };

  const chips = [
    q && { key: 'q', label: `Teks: "${q}"`, clear: () => withReset(setQ)('') },
    ta && { key: 'ta', label: `TA: ${ta}`, clear: () => withReset(setTa)('') },
    status && { key: 's', label: `Status: ${SUBMISSION_STATUS[status].label}`, clear: () => withReset(setStatus)('') },
    category && { key: 'c', label: `Kategori: ${category}`, clear: () => withReset(setCategory)('') },
  ].filter(Boolean);

  return (
    <div className="upage">
      <div className="u-syncbar">
        <span className="u-sync">Sinkronisasi Data: Hari ini, 09:42 WIB</span>
      </div>

      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Penganggaran' }, { label: 'Daftar Pengajuan Anggaran' }]}
        title="Daftar Pengajuan Anggaran RKAT"
        badge={<span className="u-tag">{DEFAULT_TA}</span>}
      />

      <div className="u-note">
        <ShieldCheck size={20} />
        <div>
          <strong>Protokol Keamanan Data Verifikasi Keuangan</strong>
          <p>
            Pengajuan yang sedang dalam proses verifikasi BKPU atau WR2 terkunci otomatis untuk menjaga integritas data
            audit keuangan dan kesesuaian SBM Universitas Adzkia.
          </p>
        </div>
      </div>

      <div className="u-sum-grid">
        <SummaryCard tone="navy" label="Total Usulan" icon={FileText} value={`${rows.length} Kegiatan`} sub={formatRupiah(grandTotal)} />
        <SummaryCard tone="slate" label="Dalam Verifikasi" icon={FileClock} value={`${verif.n} Pengajuan`} sub={`${formatRupiah(verif.total)} (WR2)`} />
        <SummaryCard tone="maroon" label="Perlu Revisi" icon={AlertCircle} value={`${revisi.n} Pengajuan`} sub={`${formatRupiah(revisi.total)} (BKPU)`} />
        <SummaryCard tone="blue" label="Disetujui Penuh" icon={BadgeCheck} value={`${setuju.n} Pengajuan`} sub={formatRupiah(setuju.total)} />
        <SummaryCard tone="rose" label="Draft Disimpan" icon={FilePen} value={`${draft.n} Pengajuan`} sub={formatRupiah(draft.total)} />
      </div>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow">
            <Search size={17} className="ic" />
            <input
              className="u-input has-ic"
              placeholder="Cari no. usulan, kegiatan, atau PIC..."
              value={q}
              onChange={(e) => withReset(setQ)(e.target.value)}
              aria-label="Cari pengajuan"
            />
          </div>
          <select className="u-select" style={{ width: 'auto' }} value={ta} onChange={(e) => withReset(setTa)(e.target.value)} aria-label="Tahun akademik">
            <option value="">Semua TA</option>
            {TA_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="u-select" style={{ width: 'auto' }} value={status} onChange={(e) => withReset(setStatus)(e.target.value)} aria-label="Status">
            <option value="">Semua Status</option>
            {Object.entries(SUBMISSION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="u-select" style={{ width: 'auto' }} value={category} onChange={(e) => withReset(setCategory)(e.target.value)} aria-label="Kategori">
            <option value="">Semua Kategori</option>
            {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button type="button" className="u-btn u-btn-soft" onClick={reset}><RotateCcw size={15} /> Reset</button>
          <button type="button" className="u-btn u-btn-navy" onClick={exportCsv}><Download size={15} /> Ekspor</button>
        </div>
        <div className="u-chips">
          <span>Filter Aktif:</span>
          {chips.length === 0 && <span>tidak ada</span>}
          {chips.map((c) => (
            <span key={c.key} className="u-chip">
              {c.label}
              <button type="button" onClick={c.clear} aria-label={`Hapus filter ${c.label}`}><X size={13} /></button>
            </span>
          ))}
          {chips.length > 0 && <button type="button" className="u-link" onClick={reset}>Hapus Semua Filter</button>}
          <span className="end">
            Menampilkan <b>{filtered.length}</b> dari <b>{rows.length}</b> usulan anggaran
            {selected.length > 0 && <> • <b>{selected.length}</b> dipilih</>}
          </span>
        </div>
      </section>

      <section className="card">
        <div className="u-scroll">
          <table className="u-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="Pilih semua pada halaman ini" />
                </th>
                <th>No. Usulan & Tanggal</th>
                <th>Program Kerja & PIC</th>
                <th>Kategori & Sumber</th>
                <th className="num">Total RAB</th>
                <th>Status & Posisi Berkas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {view.map((s) => (
                <tr key={s.id} className={selected.includes(s.id) ? 'row-sel' : ''}>
                  <td>
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleOne(s.id)} aria-label={`Pilih ${s.id}`} />
                  </td>
                  <td>
                    <span className={`u-id ${s.status === 'revisi' ? 'maroon' : ''}`}>{s.id}</span>
                    <span className="u-cell-sub">{s.date}</span>
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <Link to={detail(s.id)} className="u-cell-title u-title-link">
                      {s.title} {s.locked && <Lock size={13} aria-label="Terkunci" />}
                    </Link>
                    <span className="u-cell-sub"><UserRound size={12} /> PIC: {s.pic}</span>
                  </td>
                  <td>
                    <span className="u-cell-title">{s.category}</span>
                    <span className="u-cell-sub">{s.source}</span>
                  </td>
                  <td className="num strong">{formatRupiah(s.total)}</td>
                  <td style={{ minWidth: 220 }}><StatusCell s={s} /></td>
                  <td><div className="u-actions">{renderAction(s)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 && (
            <div className="u-empty">
              <strong>Tidak ada usulan yang cocok</strong>
              Ubah kata kunci atau hapus filter untuk melihat semua usulan.
            </div>
          )}
        </div>

        <div className="u-tfoot-bar">
          <span>
            Menampilkan <b>{filtered.length ? (current - 1) * size + 1 : 0} - {Math.min(current * size, filtered.length)}</b> dari <b>{filtered.length}</b> usulan
            <span className="u-rows-select">
              Tampilkan:
              <select className="u-select" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} aria-label="Baris per halaman">
                {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} baris</option>)}
              </select>
            </span>
          </span>
          <Pagination page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      <Modal
        open={Boolean(toDelete)}
        title="Hapus draft usulan?"
        onClose={() => setToDelete(null)}
        footer={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={() => setToDelete(null)}>Batal</button>
            <button type="button" className="u-btn u-btn-primary" onClick={confirmDelete}>Hapus Draft</button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Draft <b>{toDelete?.id}</b> ({toDelete?.title}) akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

    </div>
  );
}
