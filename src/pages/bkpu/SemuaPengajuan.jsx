import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ClipboardList, Download, FileCheck2, FileText, Hourglass, RefreshCw, Repeat2, Search, SlidersHorizontal, Zap, ArrowRight, Info, Inbox, FolderOpen,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, CATS, STAGE_META, TA } from '../../data/bkpuData';
import { BigPager, sum, uniq } from '../../components/bkpu/shared';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';

const SIZES = [7, 10, 20];
const NOMINAL = { '': () => true, lt20: (n) => n < 20e6, mid: (n) => n >= 20e6 && n <= 50e6, gt50: (n) => n > 50e6 };
const TAB_STAGES = { all: null, antrean: ['antrean', 'ditelaah'], wr2: ['wr2'], perbaikan: ['perbaikan', 'ditolak'] };

function Position({ s }) {
  if (s.stage === 'antrean' || s.stage === 'ditelaah') {
    if (s.resubmit) return <><b>Meja BKPU (Revisi Masuk)</b><span className="u-cell-sub">Unit telah memperbarui SBM honor</span></>;
    if (s.stage === 'ditelaah') return <><b>Sedang Ditelaah (In Progress)</b><span className="u-cell-sub">Oleh: {s.reviewer ?? 'Ahmad Zaky, S.E.'}</span></>;
    if (s.slaDay >= 3) return <><b className="red">Antrean BKPU (Hari ke-3)</b><span className="u-cell-sub red">Batas SLA tersisa 4 jam kerja</span></>;
    return <><b>Antrean Masuk Meja BKPU</b><span className="u-cell-sub">Hari ke-{s.slaDay} (Dalam SLA)</span></>;
  }
  if (s.stage === 'wr2') return <><b>Disetujui WR II</b><span className="u-cell-sub">No. SK: {s.sk ?? '-'}</span></>;
  if (s.stage === 'perbaikan') return <><b className="red">Dalam Perbaikan Unit</b><span className="u-cell-sub">Catatan: {s.decisionNote || s.note || 'Sesuaikan dengan SBM'}</span></>;
  return <><b className="red">Ditolak BKPU</b><span className="u-cell-sub">{s.decisionNote || 'Non-RKAT'}</span></>;
}

function StatusChip({ s }) {
  if (s.stage === 'wr2') return <span className="u-badge u-badge-sky">Lolos & Disetujui</span>;
  if (s.stage === 'perbaikan') return <span className="u-badge u-badge-violet"><RefreshCw size={12} /> Menunggu Respon Unit</span>;
  if (s.stage === 'ditolak') return <span className="u-badge u-badge-red">Ditolak</span>;
  if (s.stage === 'ditelaah') return <span className="u-badge u-badge-violet">Sedang Ditelaah</span>;
  if (s.resubmit) return <span className="u-badge u-badge-sky"><Repeat2 size={12} /> Perlu Telaah Ulang</span>;
  if (s.slaDay >= 3) return <span className="u-badge u-badge-red"><Zap size={12} /> Mendekati Batas SLA</span>;
  return <span className="u-badge u-badge-blue"><Hourglass size={12} /> Antrean Telaah</span>;
}

export default function SemuaPengajuan() {
  const toast = useToast();
  const { submissions, queue } = useBkpu();
  const [params, setParams] = useSearchParams();
  const tab = TAB_STAGES[params.get('tab')] !== undefined ? (params.get('tab') ?? 'all') : 'all';
  const [q, setQ] = useState('');
  const [stage, setStage] = useState('');
  const [unit, setUnit] = useState('');
  const [nominal, setNominal] = useState('');
  const [cat, setCat] = useState('');
  const [adv, setAdv] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(SIZES[0]);

  const counts = {
    all: submissions.length,
    antrean: queue.length,
    wr2: submissions.filter((s) => s.stage === 'wr2').length,
    perbaikan: submissions.filter((s) => s.stage === 'perbaikan' || s.stage === 'ditolak').length,
  };

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return submissions
      .filter((s) => !TAB_STAGES[tab] || TAB_STAGES[tab].includes(s.stage))
      .filter((s) => (!term || `${s.id} ${s.title} ${s.pic} ${s.unit}`.toLowerCase().includes(term)) && (!stage || s.stage === stage) && (!unit || s.unit === unit) && NOMINAL[nominal](s.amount) && (!cat || s.category === cat))
      .sort((a, b) => b.slaDay - a.slaDay);
  }, [submissions, tab, q, stage, unit, nominal, cat]);

  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pageCount);
  const view = rows.slice((current - 1) * size, current * size);
  const reset = () => { setQ(''); setStage(''); setUnit(''); setNominal(''); setCat(''); setPage(1); };

  const exportCsv = () => {
    downloadCsv('Rekap_Pengajuan_BKPU.csv', [
      ['No. Usulan', 'Tanggal', 'Unit', 'Program', 'PIC', 'Plafon', 'Status'],
      ...rows.map((s) => [s.id, s.date, s.unit, s.title, s.pic, s.amount, STAGE_META[s.stage].label]),
    ]);
    toast.push(`${rows.length} usulan diekspor ke CSV.`);
  };

  const tabs = [['all', 'Semua Usulan'], ['antrean', 'Antrean BKPU'], ['wr2', 'Lolos ke WR II'], ['perbaikan', 'Perlu Perbaikan']];

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'BKPU Audit Console' }, { label: TA }]}
        title="Semua Pengajuan Anggaran Unit & Lembaga"
        subtitle="Monitoring dan penelusuran seluruh siklus usulan belanja unit kerja, fakultas, dan lembaga se-Universitas Adzkia."
        actions={<>
          <button type="button" className="u-btn u-btn-soft" onClick={() => setAdv((v) => !v)}><SlidersHorizontal size={15} /> Filter Lanjutan</button>
          <button type="button" className="u-btn u-btn-navy" onClick={exportCsv}><Download size={15} /> Unduh Rekap Excel</button>
        </>}
      />

      <div className="u-sum-grid cols-4">
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Total Keseluruhan Usulan</span><FolderOpen size={19} /></div><p className="u-sum-value">{submissions.length} <small>Usulan Berkas</small></p><p className="u-sum-sub">Akumulasi Nilai: <b>{formatRupiah(sum(submissions, 'amount'))}</b></p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>Menunggu / Sedang Ditelaah</span><ClipboardList size={19} /></div><p className="u-sum-value">{queue.length} <small>Berkas Antrean</small></p><p className="u-sum-sub">Nominal Aktif: <b style={{ color: '#7a0c16' }}>{formatRupiah(sum(queue, 'amount'))}</b></p></div>
        <div className="u-sum u-sum-blue"><div className="u-sum-top"><span>Disetujui WR II / Selesai</span><FileCheck2 size={19} /></div><p className="u-sum-value">{counts.wr2} <small>SK Otorisasi Terbit</small></p><p className="u-sum-sub">Plafon Otorisasi: <b>{formatRupiah(sum(submissions.filter((s) => s.stage === 'wr2'), 'amount'))}</b></p></div>
        <div className="u-sum u-sum-rose"><div className="u-sum-top"><span>Dalam Perbaikan Unit</span><RefreshCw size={19} /></div><p className="u-sum-value">{submissions.filter((s) => s.stage === 'perbaikan').length} <small>Revisi SBM / RKA</small></p><p className="u-sum-sub">Pagu Pending: <b>{formatRupiah(sum(submissions.filter((s) => s.stage === 'perbaikan'), 'amount'))}</b></p></div>
      </div>

      <section className="card">
        <div className="bk-tab-row">
          <div className="u-tabs" role="tablist">
            {tabs.map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on maroon' : ''}`} onClick={() => { setParams(k === 'all' ? {} : { tab: k }); setPage(1); }}>
                {label} <em className={k === 'antrean' || k === 'perbaikan' ? 'alert' : ''}>{counts[k]}</em>
              </button>
            ))}
          </div>
          <span className="u-hint"><Info size={13} /> SLA Telaah BKPU: Maks. 3 Hari Kerja per berkas</span>
        </div>
        <div className="u-filters" style={{ marginTop: '0.8rem' }}>
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari No. Usulan, nama program kerja, PIC, atau unit..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari" /></div>
          <select className="u-select" style={{ width: 'auto' }} value={stage} onChange={(e) => { setStage(e.target.value); setPage(1); }} aria-label="Status siklus"><option value="">Semua Status Siklus</option>{Object.entries(STAGE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={(e) => { setUnit(e.target.value); setPage(1); }} aria-label="Unit"><option value="">Semua Fakultas / Unit</option>{uniq(submissions, 'unit').map((u) => <option key={u}>{u}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} value={nominal} onChange={(e) => { setNominal(e.target.value); setPage(1); }} aria-label="Nominal"><option value="">Rentang Nominal (Semua)</option><option value="lt20">Di bawah Rp 20 Jt</option><option value="mid">Rp 20 – 50 Jt</option><option value="gt50">Di atas Rp 50 Jt</option></select>
          <button type="button" className="u-btn u-btn-soft" onClick={reset} aria-label="Reset filter"><RefreshCw size={15} /></button>
        </div>
        {adv && (
          <div className="u-filters" style={{ marginTop: '0.6rem' }}>
            <select className="u-select" style={{ width: 'auto' }} value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} aria-label="Kategori belanja"><option value="">Semua Kategori Belanja</option>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
        )}
      </section>

      <section className="card">
        <div className="bk-ledger-head">
          <span><b>Ledger Pengajuan Anggaran Univ. Adzkia</b> | {view.length} entri dalam halaman</span>
          <span>Urutan: <b>Prioritas SLA / Waktu Masuk</b></span>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1050 }}>
            <thead><tr><th>No. Usulan & Tgl</th><th>Unit / Fakultas</th><th>Program Kerja & PIC</th><th className="num">Plafon Anggaran</th><th>Posisi Workflow Berkas</th><th>Status Telaah BKPU</th><th>Aksi</th></tr></thead>
            <tbody>
              {view.map((s) => {
                const crit = (s.stage === 'antrean' && s.slaDay >= 3);
                const open = s.stage === 'antrean' || s.stage === 'ditelaah';
                return (
                  <tr key={s.id} className={crit ? 'row-err' : ''}>
                    <td><Link to={`${BASE}/pengajuan/${s.id}`} className="u-id">{s.id}</Link><span className="u-cell-sub">{s.date} • {s.time}</span></td>
                    <td style={{ maxWidth: 190 }}><span className="bk-unit-tag">{s.unit}</span><span className="u-cell-sub">{s.faculty}</span></td>
                    <td style={{ maxWidth: 250 }}><span className="u-cell-title">{s.title}</span><span className="u-cell-sub">PIC: {s.pic}</span></td>
                    <td className="num strong">{formatRupiah(s.amount)}<span className="u-cell-sub">{s.category}</span></td>
                    <td style={{ maxWidth: 210 }}><Position s={s} /></td>
                    <td><StatusChip s={s} /></td>
                    <td>
                      <Link to={`${BASE}/pengajuan/${s.id}`} className={`u-btn u-btn-sm ${open ? (s.stage === 'ditelaah' ? 'u-btn-navy' : 'u-btn-primary') : 'u-btn-soft'}`}>
                        {s.stage === 'ditelaah' ? 'Lanjutkan' : open ? (crit ? <>Telaah Cepat <Zap size={13} /></> : <>Telaah Berkas <ArrowRight size={13} /></>) : s.stage === 'perbaikan' ? 'Riwayat Catatan' : 'Lembar Telaah'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {view.length === 0 && <div className="u-empty"><Inbox size={28} /><strong>Tidak ada usulan</strong>Ubah filter untuk melihat usulan lain.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan <b>{rows.length ? 1 + (current - 1) * size : 0} - {Math.min(current * size, rows.length)}</b> dari <b>{rows.length}</b> total usulan anggaran aktif
            <span className="u-rows-select"><select className="u-select" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} aria-label="Baris per halaman">{SIZES.map((n) => <option key={n} value={n}>{n} baris</option>)}</select></span></span>
          <BigPager page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>
    </div>
  );
}