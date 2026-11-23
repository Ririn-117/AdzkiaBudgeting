import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban, BookOpen, CheckCircle2, Download, Eye, FileText, Gavel, Printer, QrCode, RotateCcw, Search, Timer } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, RESULT } from '../../data/wr2Data';
import { BigPager, sum, uniq } from '../../components/wr2/shared';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const PAGE = 5;
const CHIPS = [['all', 'Semua', null], ['disetujui', 'Disetujui', 'disetujui'], ['revisi', 'Minta Revisi', 'revisi'], ['ditolak', 'Ditolak', 'ditolak']];

export default function Wr2Riwayat() {
  const toast = useToast();
  const { submissions } = useWr2();
  const decided = useMemo(() => submissions.filter((s) => s.stage !== 'menunggu'), [submissions]);
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('');
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);
  const [letter, setLetter] = useState(null);

  const count = (stage) => (stage ? decided.filter((s) => s.stage === stage).length : decided.length);
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const stage = CHIPS.find((c) => c[0] === tab)[2];
    const list = decided.filter((s) => (!stage || s.stage === stage) && (!t || `${s.id} ${s.sk ?? ''} ${s.unit} ${s.title}`.toLowerCase().includes(t)) && (!unit || s.unit === unit));
    return sort === 'new' ? list : [...list].reverse();
  }, [decided, tab, q, unit, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const cur = Math.min(page, pageCount);
  const view = rows.slice((cur - 1) * PAGE, cur * PAGE);
  const ok = decided.filter((s) => s.stage === 'disetujui');
  const exportCsv = () => {
    downloadCsv('Log_Otorisasi_WR2.csv', [['No. Usulan', 'No. SK', 'Unit', 'Kegiatan', 'Nilai', 'Hasil', 'Waktu', 'Catatan'], ...rows.map((s) => [s.id, s.sk ?? '-', s.unit, s.title, s.amount, RESULT[s.result].label, s.decidedAt, s.note])]);
    toast.push(`${rows.length} log diekspor ke CSV.`);
  };

  return (
    <div className="upage">
      <header className="u-ph">
        <div>
          <p className="u-hint" style={{ margin: 0 }}>Riwayat & Laporan › <b style={{ color: '#7a0c16' }}>Riwayat Keputusan</b></p>
          <h1 style={{ fontSize: '1.7rem' }}>Riwayat Keputusan & Otorisasi Anggaran WR II</h1>
          <p style={{ margin: '0.4rem 0 0', color: '#475569', maxWidth: 560, fontSize: '0.92rem' }}><span className="u-badge u-badge-sky">AUDIT TRAIL SAH</span> Rekam jejak resmi keputusan pengesahan SK otorisasi belanja, disposisi revisi, dan penolakan anggaran Universitas Adzkia Padang berbasis tata kelola kepatuhan RKAT.</p>
        </div>
        <div className="u-ph-actions">
          <button type="button" className="u-btn u-btn-soft" onClick={() => window.print()}><BookOpen size={15} /> Cetak Buku Register</button>
          <button type="button" className="u-btn u-btn-primary" onClick={exportCsv}><Download size={15} /> Ekspor Log Otorisasi</button>
        </div>
      </header>

      <div className="u-sum-grid">
        <div className="u-sum u-sum-slate"><div className="u-sum-top"><span>Total Keputusan Terbit</span><Gavel size={19} /></div><p className="u-sum-value">{decided.length} <small>Berkas SK</small></p><p className="u-sum-sub"><CheckCircle2 size={13} /> 100% diproses per RKAT</p></div>
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Disetujui (Terbit SK)</span><CheckCircle2 size={19} /></div><p className="u-sum-value">{ok.length} <small>Berkas ({decided.length ? ((ok.length / decided.length) * 100).toFixed(1) : 0}%)</small></p><p className="u-sum-sub"><b style={{ color: '#161a77' }}>{formatRupiah(sum(ok, 'amount'))}</b> teralokasi</p></div>
        <div className="u-sum u-sum-rose"><div className="u-sum-top"><span>Perlu Revisi Dokumen</span><RotateCcw size={19} /></div><p className="u-sum-value">{count('revisi')} <small>Pengembalian</small></p><p className="u-sum-sub">Plafon SBM & rincian RAB</p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>Ditolak / Non-RKAT</span><Ban size={19} /></div><p className="u-sum-value">{count('ditolak')} <small>Berkas</small></p><p className="u-sum-sub" style={{ color: '#b4121f' }}>Di luar plafon belanja modal</p></div>
        <div className="u-sum u-sum-blue"><div className="u-sum-top"><span>SLA Putusan WR II</span><Timer size={19} /></div><p className="u-sum-value">1.2 <small>Hari Kerja</small></p><p className="u-sum-sub">Pasca telaah BKPU selesai</p></div>
      </div>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari No. SK (cth: 088/UN-ADZ/KU), No. Usulan, Unit, atau Nama Kegiatan..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari" /></div>
          {CHIPS.map(([k, label, stage]) => (<button key={k} type="button" className={`u-tab ${tab === k ? 'on maroon' : ''}`} onClick={() => { setTab(k); setPage(1); }}>{label} ({count(stage)})</button>))}
        </div>
        <div className="u-filters" style={{ marginTop: '0.6rem' }}>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={(e) => { setUnit(e.target.value); setPage(1); }} aria-label="Unit"><option value="">Semua Fakultas & Unit Kerja</option>{uniq(decided, 'unit').map((u) => <option key={u}>{u}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} aria-label="Periode" defaultValue="all"><option value="all">Semua Waktu (Tahun Anggaran 2024/2025)</option></select>
          <select className="u-select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutan"><option value="new">Keputusan Terbaru (Desc)</option><option value="old">Keputusan Terlama (Asc)</option></select>
        </div>
      </section>

      <section className="card">
        <div className="bk-ledger-head"><span><b>Buku Register Ketetapan Anggaran WR II</b> <span className="u-badge u-badge-sky">{view.length} Data Ditampilkan</span></span><span className="u-hint">Persetujuan Sah Ber-QR • Tersinkronisasi SIKEU-Adzkia</span></div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1100 }}>
            <thead><tr><th>No. Usulan & No. SK</th><th>Unit Pemohon</th><th>Nama Kegiatan & Ringkasan</th><th className="num">Nilai Anggaran</th><th>Hasil Keputusan</th><th>Waktu Putusan</th><th>Catatan Otorisator WR II</th><th>Verifikasi</th><th>Aksi</th></tr></thead>
            <tbody>
              {view.map((s) => (
                <tr key={s.id}>
                  <td><span className="u-id" style={{ color: '#0f172a' }}>{s.id}</span>{s.sk ? <span className="u-cell-sub"><FileText size={12} /> {s.sk}</span> : <span className={`u-badge ${s.stage === 'ditolak' ? 'u-badge-red' : 'u-badge-gray'}`}>{s.stage === 'ditolak' ? 'Ditolak Definitif' : 'SK Ditunda (Disposisi)'}</span>}</td>
                  <td style={{ maxWidth: 150 }}><b>{s.unit}</b><span className="u-cell-sub">{s.faculty}</span></td>
                  <td style={{ maxWidth: 250 }}><span className="u-cell-title">{s.title}</span></td>
                  <td className="num strong" style={s.stage === 'ditolak' ? { textDecoration: 'line-through', color: '#b4121f' } : undefined}>{formatRupiah(s.amount)}<span className="u-cell-sub">{s.stage === 'ditolak' ? 'Tidak Disahkan' : s.result === 'bertahap' ? 'Termin 1' : s.stage === 'revisi' ? 'Dalam Penyesuaian' : 'Plafon 100%'}</span></td>
                  <td><span className={`u-badge u-badge-${RESULT[s.result].tone}`}>{RESULT[s.result].label}</span></td>
                  <td>{s.decidedAt}</td>
                  <td style={{ maxWidth: 260, fontStyle: 'italic', color: s.stage === 'ditolak' ? '#b4121f' : '#334155' }}>"{s.note}"</td>
                  <td>{s.sk ? <><QrCode size={20} style={{ color: '#3b4a8f' }} /><span className="u-cell-sub">TTE WR2</span></> : <span className="u-cell-sub">{s.stage === 'ditolak' ? 'BATAL' : 'TERKUNCI'}</span>}</td>
                  <td>
                    <div className="u-actions">
                      {s.stage === 'disetujui' && <><Link to={`${BASE}/pengajuan/${s.id}`} className="u-iconbtn" aria-label={`Lihat ${s.id}`}><Eye size={17} /></Link><button type="button" className="u-iconbtn" aria-label="Cetak SK" onClick={() => toast.push(`Cetak SK ${s.sk} (simulasi).`)}><Printer size={17} /></button></>}
                      {s.stage === 'revisi' && <Link to={`${BASE}/pengajuan/${s.id}`} className="u-btn u-btn-soft u-btn-sm">Buka Revisi</Link>}
                      {s.stage === 'ditolak' && <button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => setLetter(s)}>BAP Penolakan</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Tidak ada keputusan</strong>Ubah filter untuk melihat data lain.</div>}
        </div>
        <div className="u-tfoot-bar"><span>Menampilkan <b>{rows.length ? 1 + (cur - 1) * PAGE : 0} - {Math.min(cur * PAGE, rows.length)}</b> dari total <b>{rows.length}</b> keputusan definitif WR2</span><BigPager page={cur} pageCount={pageCount} onChange={setPage} /></div>
      </section>

      <Modal open={Boolean(letter)} title="Berita Acara Penolakan" onClose={() => setLetter(null)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setLetter(null)}>Tutup</button>}>
        {letter && (<><p className="u-hint">{letter.id} • {letter.decidedAt}</p><p><b>{letter.title}</b> ({letter.unit}) senilai {formatRupiah(letter.amount)} ditolak.</p><p>{letter.note}</p></>)}
      </Modal>
    </div>
  );
}