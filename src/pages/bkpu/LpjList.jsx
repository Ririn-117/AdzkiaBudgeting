import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle, AlertTriangle, BookOpen, CheckCheck, CheckCircle2, Download, Hourglass, ListChecks, Printer,
  Search, ShieldCheck, SlidersHorizontal, Wallet, FileCheck2, Receipt, ArrowRight, ClipboardCheck,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, CATS, LPJ_STAGE_META, TA } from '../../data/bkpuData';
import { BigPager, sum, uniq } from '../../components/bkpu/shared';
import { useToast } from '../../components/ui/Toast';

const SIZES = [6, 10, 20];
const TAB_MAP = { all: null, antrean: 'antrean', revisi: 'revisi', sah: 'sah' };

function Fiscal({ f }) {
  if (f.tone === 'warn') return <><span className="u-badge u-badge-red"><AlertTriangle size={12} /> {f.label}</span><span className="u-cell-sub">{f.note}</span></>;
  if (f.tone === 'pending') return <><span className="u-badge u-badge-sky"><Hourglass size={12} /> {f.label}</span><span className="u-cell-sub">{f.note}</span></>;
  return <><span className="u-badge u-badge-sky"><CheckCircle2 size={12} /> {f.label}</span><span className="u-cell-sub">{f.note}</span></>;
}

export default function LpjList({ initialTab = 'all' }) {
  const toast = useToast();
  const { lpjs } = useBkpu();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') && TAB_MAP[params.get('tab')] !== undefined ? params.get('tab') : initialTab;
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('');
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(SIZES[0]);

  const by = (s) => lpjs.filter((l) => l.stage === s);
  const counts = { all: lpjs.length, antrean: by('antrean').length, revisi: by('revisi').length, sah: by('sah').length };

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return lpjs.filter((l) => (!TAB_MAP[tab] || l.stage === TAB_MAP[tab]) && (!term || `${l.id} ${l.title} ${l.ref} ${l.unit}`.toLowerCase().includes(term)) && (!unit || l.unit === unit) && (!cat || l.cat === cat));
  }, [lpjs, tab, q, unit, cat]);

  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pageCount);
  const view = rows.slice((current - 1) * size, current * size);
  const silpaRows = lpjs.filter((l) => l.silpa > 0);

  const setTab = (k) => { setParams(k === 'all' ? {} : { tab: k }); setPage(1); };
  const exportCsv = () => {
    downloadCsv('Rekapitulasi_LPJ.csv', [
      ['No. LPJ', 'Unit', 'Kegiatan', 'Ref', 'Pagu', 'Realisasi', 'Silpa', 'Status'],
      ...rows.map((l) => [l.id, l.unit, l.title, l.ref, l.pagu, l.real, l.silpa, LPJ_STAGE_META[l.stage].label]),
    ]);
    toast.push(`${rows.length} LPJ diekspor ke CSV.`);
  };

  return (
    <div className="upage">
      <div className="u-note">
        <ShieldCheck size={20} />
        <div className="bk-sop">
          <div><strong>SOP Verifikasi LPJ Semester Genap 2024/2025</strong><p>Batas uji fisik kuitansi asli dan faktur pajak maksimal 5 hari kerja sejak dokumen fisik diserahkan ke Meja BKPU.</p></div>
          <span><span className="u-badge u-badge-sky">Biro Keuangan (BKPU)</span> <span className="u-hint">Audit Periode Berjalan</span></span>
        </div>
      </div>

      <header className="u-ph">
        <div>
          <p className="u-eyebrow" style={{ color: '#7a0c16', fontWeight: 700 }}>MODUL PERTANGGUNGJAWABAN FINANSIAL</p>
          <h1 style={{ fontSize: '1.7rem' }}>{tab === 'antrean' ? 'LPJ Menunggu Pemeriksaan' : 'Semua Laporan Pertanggungjawaban (LPJ)'}</h1>
          <p style={{ margin: '0.4rem 0 0', color: '#475569', maxWidth: 620, fontSize: '0.92rem' }}>Monitoring pengumpulan, pemeriksaan kuitansi fisik, kepatuhan fiskal & pajak (PPh 21/23/PPN), serta penyelesaian Silpa belanja unit {TA.replace('TA ', 'TA ')}.</p>
        </div>
        <div className="u-ph-actions">
          <Link to={`${BASE}/panduan-sbm`} className="u-btn u-btn-soft"><BookOpen size={15} /> Panduan Audit Kuitansi</Link>
          <button type="button" className="u-btn u-btn-primary" onClick={exportCsv}><Download size={15} /> Ekspor Rekapitulasi LPJ</button>
        </div>
      </header>

      <div className="u-sum-grid cols-4">
        <div className="u-sum u-sum-slate"><div className="u-sum-top"><span>Total LPJ Terdaftar</span><FileCheck2 size={19} /></div><p className="u-sum-value">{lpjs.length}</p><p className="bk-sum-strip">Realisasi <b>{formatRupiah(sum(lpjs, 'real'))}</b></p></div>
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Menunggu Uji Fisik</span><ClipboardCheck size={19} /></div><p className="u-sum-value">{counts.antrean} <small>Dokumen</small></p><p className="bk-sum-strip">Estimasi Nilai <b>{formatRupiah(sum(by('antrean'), 'real'))}</b></p></div>
        <div className="u-sum u-sum-blue"><div className="u-sum-top"><span>Selesai & BAP Terbit</span><CheckCheck size={19} /></div><p className="u-sum-value">{counts.sah} <small>Bebas Temuan</small></p><p className="bk-sum-strip">Tuntas Sah <b>{formatRupiah(sum(by('sah'), 'real'))}</b></p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>Revisi & Catatan Pajak</span><AlertCircle size={19} /></div><p className="u-sum-value">{counts.revisi} <small>Butuh Klarifikasi</small></p><p className="bk-sum-strip">PPh 21 / PPh 23 <b style={{ color: '#b4121f' }}>{formatRupiah(sum(by('revisi'), 'real'))}</b></p></div>
      </div>

      <section className="card">
        <div className="u-tabs" role="tablist">
          {[['all', 'Semua LPJ'], ['antrean', 'Antrean Audit Fisik'], ['revisi', 'Perlu Revisi Bukti & Pajak'], ['sah', 'Selesai Sah (BAP Terbit)']].map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label} <em className={k === 'revisi' ? 'alert' : ''}>{counts[k]}</em></button>
          ))}
        </div>
        <div className="u-filters" style={{ marginTop: '0.8rem' }}>
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari No. LPJ, nama kegiatan, kode pengajuan, atau bendahara unit..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari LPJ" /></div>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={(e) => { setUnit(e.target.value); setPage(1); }} aria-label="Unit"><option value="">Semua Unit Kerja / Prodi</option>{uniq(lpjs, 'unit').map((u) => <option key={u}>{u}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} aria-label="Kategori belanja"><option value="">Semua Kategori Belanja</option>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
          <button type="button" className="u-btn u-btn-soft" onClick={() => { setQ(''); setUnit(''); setCat(''); setPage(1); }}><SlidersHorizontal size={15} /> Reset Filter</button>
        </div>
      </section>

      <section className="card">
        <div className="bk-ledger-head">
          <span><b>Daftar Dokumen Pertanggungjawaban Masuk</b> <span className="u-badge u-badge-sky">Menampilkan {view.length} dari {rows.length} berkas</span></span>
          <span className="bk-dots"><i className="navy" /> 100% Cocok Kuitansi <i className="red" /> Catatan Pajak</span>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1150 }}>
            <thead><tr><th>No. LPJ & Tgl</th><th>Unit Kerja</th><th>Nama Kegiatan & Ref Pengajuan</th><th className="num">Pagu Disetujui</th><th className="num">Realisasi LPJ</th><th>Status Silpa</th><th>Kepatuhan Fiskal</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {view.map((l) => {
                const meta = LPJ_STAGE_META[l.stage];
                return (
                  <tr key={l.id}>
                    <td><Link to={`${BASE}/lpj/${l.id}`} className="u-id">{l.id}</Link><span className="u-cell-sub">{l.date}</span></td>
                    <td style={{ maxWidth: 160 }}><span className="u-cell-title">{l.unit}</span><span className="u-cell-sub">{l.faculty}</span></td>
                    <td style={{ maxWidth: 240 }}><span className="u-cell-title">{l.title}</span><span className="u-cell-sub">Ref: {l.ref}</span></td>
                    <td className="num">{formatRupiah(l.pagu)}</td>
                    <td className="num strong">{formatRupiah(l.real)}</td>
                    <td>{l.silpa ? <><span className="u-badge u-badge-sky">{formatRupiah(l.silpa)}</span><span className="u-cell-sub">{l.silpaNote}</span></> : <span className="u-badge u-badge-gray">Rp 0 (Nihil)</span>}</td>
                    <td style={{ maxWidth: 170 }}><Fiscal f={l.fiscal} /></td>
                    <td><span className={`u-badge u-badge-${meta.tone}`}>{meta.label}</span></td>
                    <td>
                      <Link to={`${BASE}/lpj/${l.id}`} className={`u-btn u-btn-sm ${l.stage === 'antrean' ? 'u-btn-primary' : l.stage === 'revisi' ? 'u-btn-soft' : 'u-btn-outline'}`}>
                        {l.stage === 'antrean' ? <>Mulai Periksa <ListChecks size={13} /></> : l.stage === 'revisi' ? <>Periksa Detail <ArrowRight size={13} /></> : <><Printer size={13} /> Lihat BAP</>}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Tidak ada LPJ</strong>Ubah filter atau pilih tab lain.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span>Baris per halaman: <span className="u-rows-select" style={{ border: 'none', marginLeft: 0, paddingLeft: 0 }}><select className="u-select" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} aria-label="Baris per halaman">{SIZES.map((n) => <option key={n} value={n}>{n}</option>)}</select></span> {rows.length ? 1 + (current - 1) * size : 0}-{Math.min(current * size, rows.length)} dari {rows.length} berkas</span>
          <BigPager page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      <div className="bk-two-eq">
        <section className="card">
          <div className="bk-silpa-head">
            <span className="bk-ico navy"><Wallet size={22} /></span>
            <div>
              <p className="bk-eyebrow">REKENING PENAMPUNGAN SILPA UNIVERSITAS ADZKIA</p>
              <h2>Rekapitulasi Sisa Kas Belanja Unit (Silpa)</h2>
              <p className="u-hint">Dana yang tidak terserap wajib disetorkan kembali via Virtual Account BSI Yayasan Pendidikan Adzkia sebelum Berita Acara Pemeriksaan (BAP) diterbitkan.</p>
            </div>
            <div className="bk-silpa-total"><span>TOTAL SILPA MASUK</span><strong>{formatRupiah(sum(silpaRows, 'silpa'))}</strong><small>{silpaRows.length} Unit Tertib Setor</small></div>
          </div>
          <div className="bk-silpa-list">
            {silpaRows.map((l, i) => (
              <div key={l.id}><Receipt size={18} /><div><b>{l.unit}</b><small>TRX-BSI-99{23847 - i * 11736}</small></div><div className="r"><b>{formatRupiah(l.silpa)}</b><small>Tervalidasi Kasir</small></div></div>
            ))}
            {silpaRows.length === 0 && <p className="u-hint">Belum ada setoran Silpa.</p>}
          </div>
        </section>
        <section className="card">
          <p className="bk-eyebrow">CHECKLIST VERIFIKATOR</p>
          <h2>Pedoman Kuitansi Sah BKPU</h2>
          <ul className="bk-guide">
            <li><CheckCircle2 size={17} /> Kuitansi bertanggal basah & ada stempel resmi rekanan penyedia jasa.</li>
            <li><CheckCircle2 size={17} /> Faktur pajak PPh 21 (Dosen/Narsum) dilampiri fotokopi NPWP aktif.</li>
            <li><CheckCircle2 size={17} /> Pembelian &gt; Rp 5.000.000 wajib bermaterai Rp 10.000 sesuai UU No 10/2020.</li>
          </ul>
          <button type="button" className="u-btn u-btn-outline u-btn-block" onClick={() => toast.push('Template BAP Audit LPJ (.docx) belum tersedia dari server (simulasi).')}><Download size={15} /> Download Template BAP Audit LPJ (.docx)</button>
        </section>
      </div>
    </div>
  );
}