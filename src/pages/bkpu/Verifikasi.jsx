import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Banknote, CheckCircle2, ClipboardList, Download, Eye, FileClock, FolderOpen, Gauge, Hourglass,
  ListChecks, Mail, MessageSquare, Printer, RefreshCw, Search, ShieldCheck, Timer,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, TA } from '../../data/bkpuData';
import { DisposisiModal, DocChip, SlaChip, fmtJt, sum, uniq } from '../../components/bkpu/shared';
import Pagination from '../../components/ui/Pagination';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

const NOMINAL = { '': () => true, lt20: (n) => n < 20e6, mid: (n) => n >= 20e6 && n <= 50e6, gt50: (n) => n > 50e6 };
const PAGE_SIZE = 10;

export default function Verifikasi() {
  const toast = useToast();
  const navigate = useNavigate();
  const { queue, submissions } = useBkpu();
  const [q, setQ] = useState('');
  const [nominal, setNominal] = useState('');
  const [sort, setSort] = useState('sla');
  const [unit, setUnit] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [dispOpen, setDispOpen] = useState(false);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return queue
      .filter((s) => (!term || `${s.id} ${s.title} ${s.pic}`.toLowerCase().includes(term)) && NOMINAL[nominal](s.amount) && (!unit || s.unit === unit))
      .sort((a, b) => (sort === 'sla' ? b.slaDay - a.slaDay : sort === 'nominal' ? b.amount - a.amount : 0));
  }, [queue, q, nominal, sort, unit]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const view = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const allChecked = view.length > 0 && view.every((s) => selected.includes(s.id));
  const toggle = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const nearSla = queue.filter((s) => s.slaDay >= 3).length;
  const fixCount = submissions.filter((s) => s.stage === 'perbaikan').length;
  const wr2Count = submissions.filter((s) => s.stage === 'wr2').length;
  const resubmits = queue.filter((s) => s.resubmit);

  const exportCsv = () => {
    downloadCsv('Antrean_Verifikasi_BKPU.csv', [
      ['No. Usulan', 'Tanggal', 'Unit', 'Program', 'PIC', 'Total', 'SLA'],
      ...(selected.length ? rows.filter((s) => selected.includes(s.id)) : rows).map((s) => [s.id, s.date, s.unit, s.title, s.pic, s.amount, `Hari ke-${s.slaDay}`]),
    ]);
    toast.push('Antrean diekspor ke CSV.');
  };

  const tabs = [
    ['Menunggu Verifikasi', queue.length, ClipboardList, null],
    ['Semua Pengajuan', submissions.length, FolderOpen, `${BASE}/pengajuan`],
    ['Perlu Revisi Unit', fixCount, ListChecks, `${BASE}/pengajuan?tab=perbaikan`],
    ['Diteruskan ke WR2', wr2Count, ShieldCheck, `${BASE}/pengajuan?tab=wr2`],
  ];

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Dashboard', to: BASE }, { label: 'Verifikasi Anggaran' }, { label: 'Menunggu Verifikasi' }]}
        title="Verifikasi Pengajuan Anggaran Unit & Program Studi"
        actions={<>
          <Link to={`${BASE}/panduan-sbm`} className="u-btn u-btn-outline"><BookOpen size={15} /> Panduan SBM 2025</Link>
          <button type="button" className="u-btn u-btn-navy" onClick={exportCsv}><Download size={15} /> Unduh Lembar Telaah Kolektif</button>
        </>}
      />

      <div className="u-sum-grid cols-4">
        <div className="u-sum u-sum-maroon">
          <div className="u-sum-top"><span>Antrean Verifikasi</span></div>
          <div className="bk-sum-row"><p className="u-sum-value">{queue.length} <small>Usulan</small></p><span className="bk-ico maroon"><ClipboardList size={22} /></span></div>
          <p className="u-sum-sub" style={{ color: '#b4121f' }}><Timer size={13} /> {nearSla} berkas mendekati SLA</p>
        </div>
        <div className="u-sum u-sum-blue">
          <div className="u-sum-top"><span>Total Nilai Usulan</span></div>
          <div className="bk-sum-row"><p className="u-sum-value">{fmtJt(sum(queue, 'amount'))}</p><span className="bk-ico blue"><Banknote size={22} /></span></div>
          <p className="u-sum-sub">Kebutuhan alokasi termin</p>
        </div>
        <div className="u-sum u-sum-navy">
          <div className="u-sum-top"><span>Rata-rata Respon</span></div>
          <div className="bk-sum-row"><p className="u-sum-value">1,4 Hari</p><span className="bk-ico violet"><Gauge size={22} /></span></div>
          <p className="u-sum-sub"><CheckCircle2 size={13} /> Sesuai target SLA (≤3 Hari)</p>
        </div>
        <div className="u-sum u-sum-rose">
          <div className="u-sum-top"><span>Revisi Dikirim Ulang</span></div>
          <div className="bk-sum-row"><p className="u-sum-value">{resubmits.length} <small>Berkas</small></p><span className="bk-ico violet"><Mail size={22} /></span></div>
          <p className="u-sum-sub">{resubmits[0] ? `${resubmits[0].unit} (Revisi Catatan)` : 'Tidak ada revisi masuk'}</p>
        </div>
      </div>

      <div className="card bk-tabs-card">
        <div className="u-tabs" role="tablist">
          {tabs.map(([label, n, Icon, to], i) => (
            <button key={label} type="button" role="tab" aria-selected={i === 0} className={`u-tab ${i === 0 ? 'on maroon' : ''}`} onClick={() => to && navigate(to)}>
              <Icon size={15} /> {label} <em>{n}</em>
            </button>
          ))}
        </div>
      </div>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari nomor usulan, nama kegiatan, atau nama PIC..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari" /></div>
          <button type="button" className="u-btn u-btn-soft" onClick={exportCsv}><Download size={15} /> Ekspor Excel</button>
        </div>
        <div className="u-filters" style={{ marginTop: '0.6rem' }}>
          <select className="u-select" style={{ width: 'auto' }} value={nominal} onChange={(e) => { setNominal(e.target.value); setPage(1); }} aria-label="Nominal">
            <option value="">Semua Nominal</option><option value="lt20">Di bawah Rp 20 Jt</option><option value="mid">Rp 20 – 50 Jt</option><option value="gt50">Di atas Rp 50 Jt</option>
          </select>
          <select className="u-select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutan">
            <option value="sla">Urut: SLA Terlama (Prioritas)</option><option value="nominal">Urut: Nominal Terbesar</option><option value="new">Urut: Waktu Masuk</option>
          </select>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={(e) => { setUnit(e.target.value); setPage(1); }} aria-label="Unit">
            <option value="">Semua Fakultas & Unit</option>{uniq(queue, 'unit').map((u) => <option key={u}>{u}</option>)}
          </select>
          <select className="u-select" style={{ width: 'auto' }} aria-label="Tahun akademik" defaultValue={TA}><option>{TA}</option></select>
          <button type="button" className="u-btn u-btn-soft" onClick={() => { setQ(''); setNominal(''); setUnit(''); setSort('sla'); setPage(1); }}><RefreshCw size={15} /> Reset</button>
        </div>
      </section>

      <section className="card">
        <div className="bk-bulk">
          <label><input type="checkbox" className="u-check" checked={allChecked} onChange={() => setSelected(allChecked ? [] : view.map((s) => s.id))} /> Pilih Semua ({rows.length} Antrean)</label>
          <span>{selected.length} terpilih untuk tindakan massal</span>
          <button type="button" className="u-link" disabled={!selected.length} onClick={() => setDispOpen(true)}><Printer size={14} /> Cetak Disposisi Terpilih</button>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1100 }}>
            <thead><tr><th style={{ width: 34 }} /><th>No. Usulan & Tgl</th><th>Unit / Pemohon</th><th>Program Kerja & PIC</th><th className="num">Total Anggaran</th><th>SLA Telaah BKPU</th><th>Dokumen TOR</th><th>Status Berkas</th><th>Aksi Verifikasi</th></tr></thead>
            <tbody>
              {view.map((s) => (
                <tr key={s.id} className={s.slaDay >= 3 ? 'row-err' : selected.includes(s.id) ? 'row-sel' : ''}>
                  <td><input type="checkbox" className="u-check" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} aria-label={`Pilih ${s.id}`} /></td>
                  <td><span className="u-id" style={{ color: '#161a77' }}>{s.id}{s.slaDay >= 3 && <b className="bk-bang">!</b>}</span><span className="u-cell-sub">{s.date}</span></td>
                  <td style={{ maxWidth: 190 }}><span className="u-cell-title">{s.unit}</span><span className="u-cell-sub">{s.faculty}</span></td>
                  <td style={{ maxWidth: 260 }}><Link to={`${BASE}/pengajuan/${s.id}`} className="u-cell-title u-title-link">{s.title}</Link><span className="u-cell-sub">PIC: {s.pic}</span></td>
                  <td className="num strong">{formatRupiah(s.amount)}<span className="u-cell-sub">{s.category}</span></td>
                  <td><SlaChip day={s.slaDay} /></td>
                  <td><DocChip docs={s.docs} missing={s.missingDoc} /></td>
                  <td>
                    {s.resubmit ? <span className="u-badge u-badge-blue"><RefreshCw size={12} /> Revisi Dikirim Ulang</span>
                      : s.stage === 'ditelaah' ? <span className="u-badge u-badge-violet">Sedang Ditelaah</span>
                      : s.missingDoc ? <span className="u-badge u-badge-gray">Dokumen Belum Lengkap</span>
                      : <span className="u-badge u-badge-sky"><Hourglass size={12} /> Menunggu Telaah</span>}
                  </td>
                  <td>
                    <div className="u-actions">
                      <Link to={`${BASE}/pengajuan/${s.id}`} className="u-btn u-btn-primary u-btn-sm"><FileClock size={14} /> Periksa Usulan</Link>
                      {s.missingDoc
                        ? <button type="button" className="u-iconbtn" aria-label="Minta kelengkapan" onClick={() => toast.push(`Permintaan kelengkapan ${s.missingDoc} dikirim ke ${s.pic} (simulasi).`)}><MessageSquare size={17} /></button>
                        : <Link to={`${BASE}/pengajuan/${s.id}`} className="u-iconbtn" aria-label={`Lihat ${s.id}`}><Eye size={17} /></Link>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Antrean kosong</strong>Tidak ada usulan yang menunggu verifikasi.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan <b>{rows.length ? 1 + (current - 1) * PAGE_SIZE : 0}-{Math.min(current * PAGE_SIZE, rows.length)}</b> dari <b>{rows.length}</b> usulan menunggu verifikasi
            <span className="u-rows-select">Beban kerja harian {Math.min(100, Math.round((queue.length / 6) * 100))}% termuat</span></span>
          <Pagination page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      <DisposisiModal open={dispOpen} onClose={() => setDispOpen(false)} refs={selected} />
    </div>
  );
}