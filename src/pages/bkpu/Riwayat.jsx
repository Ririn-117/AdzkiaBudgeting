import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Download, Eye, FileCheck2, FileText, Gauge, Gavel, HandCoins, ListChecks, Printer, RotateCcw, Search,
  ShieldCheck, ClipboardCheck, XCircle, AlertTriangle, Building2, Flag, CheckCircle2, Scale,
} from 'lucide-react';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, RESULT_META } from '../../data/bkpuData';
import { BigPager, Donut, uniq } from '../../components/bkpu/shared';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const PAGE_SIZE = 6;

export default function Riwayat() {
  const toast = useToast();
  const { logs } = useBkpu();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('');
  const [result, setResult] = useState('');
  const [unit, setUnit] = useState('');
  const [month, setMonth] = useState('');
  const [page, setPage] = useState(1);
  const [letter, setLetter] = useState(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return logs.filter((l) => (!term || `${l.id} ${l.title} ${l.unit} ${l.note}`.toLowerCase().includes(term)) && (!kind || l.kind === kind) && (!result || l.result === result) && (!unit || l.unit === unit) && (!month || l.month === month));
  }, [logs, q, kind, result, unit, month]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const view = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const upd = (set) => (e) => { set(e.target.value); setPage(1); };
  const clear = () => { setQ(''); setKind(''); setResult(''); setUnit(''); setMonth(''); setPage(1); };

  const exportCsv = (name) => {
    downloadCsv(name, [['No. Berkas', 'Tanggal', 'Jenis', 'Kegiatan', 'Unit', 'Nilai', 'Hasil', 'Catatan', 'Verifikator'], ...rows.map((l) => [l.id, l.date, l.kind, l.title, l.unit, l.amount, RESULT_META[l.result].label, l.note, l.verifier])]);
    toast.push(`${rows.length} log diekspor ke CSV.`);
  };

  const flagIcon = { warn: Flag, ok: ShieldCheck, danger: AlertTriangle };

  return (
    <div className="upage">
      <header className="u-ph">
        <div>
          <p className="u-eyebrow" style={{ color: '#7a0c16', fontWeight: 700 }}>AUDIT TRAIL & VERIFIKASI KEUANGAN BKPU</p>
          <h1 style={{ fontSize: '1.7rem' }}>Riwayat Pemeriksaan & Log Telaah BKPU</h1>
          <p style={{ margin: '0.4rem 0 0', color: '#475569', maxWidth: 520, fontSize: '0.92rem' }}>Arsip keputusan telaah kelayakan anggaran dan evaluasi audit LPJ yang telah diselesaikan oleh verifikator BKPU.</p>
        </div>
        <div className="u-ph-actions">
          <button type="button" className="u-btn u-btn-outline" onClick={() => window.print()}><Printer size={15} /> Cetak Log Audit</button>
          <button type="button" className="u-btn u-btn-primary" onClick={() => exportCsv('Laporan_Triwulan_BKPU.csv')}><Download size={15} /> Unduh Laporan Triwulan</button>
        </div>
      </header>

      <div className="u-sum-grid cols-4">
        <div className="u-sum u-sum-slate"><div className="u-sum-top"><span>Total Pemeriksaan Tuntas</span><ClipboardCheck size={19} /></div><p className="u-sum-value">{logs.length} <small>Berkas</small></p><p className="u-sum-sub"><b style={{ color: '#2447a3' }}>TA 2024/2025 Genap</b> • Kumulatif semester</p></div>
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Lolos Verifikasi Anggaran</span><HandCoins size={19} /></div><p className="u-sum-value">84 <small>Usulan</small></p><p className="u-sum-sub"><span className="u-badge u-badge-sky">71.2%</span> Diteruskan ke WR II</p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>LPJ Disahkan (BAP)</span><FileCheck2 size={19} /></div><p className="u-sum-value">26 <small>LPJ</small></p><p className="u-sum-sub"><CheckCircle2 size={13} /> Tuntas Rekonsiliasi & Pajak</p></div>
        <div className="u-sum u-sum-blue"><div className="u-sum-top"><span>Rata-rata Durasi Telaah</span><Gauge size={19} /></div><p className="u-sum-value">1.4 <small>Hari</small></p><p className="u-sum-sub"><b style={{ color: '#b4121f' }}>53% Lebih Cepat</b> (Target SLA ≤ 3 Hari)</p></div>
      </div>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari no. berkas, kegiatan, unit, atau catatan..." value={q} onChange={upd(setQ)} aria-label="Cari log" /></div>
          <select className="u-select" style={{ width: 'auto' }} value={kind} onChange={upd(setKind)} aria-label="Jenis"><option value="">Jenis: Semua Pemeriksaan</option><option>ANGGARAN</option><option>AUDIT LPJ</option></select>
          <select className="u-select" style={{ width: 'auto' }} value={result} onChange={upd(setResult)} aria-label="Hasil"><option value="">Hasil: Semua Status</option>{Object.entries(RESULT_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={upd(setUnit)} aria-label="Unit"><option value="">Unit: Semua Fakultas/Unit</option>{uniq(logs, 'unit').map((u) => <option key={u}>{u}</option>)}</select>
          <input type="month" className="u-input" style={{ width: 'auto' }} value={month} onChange={upd(setMonth)} aria-label="Bulan" />
          <button type="button" className="u-iconbtn" onClick={clear} aria-label="Hapus semua filter"><RotateCcw size={18} /></button>
        </div>
      </section>

      <section className="card">
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1150 }}>
            <thead><tr><th>No. Berkas & Tanggal</th><th>Jenis & Nama Kegiatan</th><th>Unit Pemohon</th><th className="num">Nilai Anggaran</th><th>Hasil Telaah</th><th>Catatan Verifikator & Kepatuhan SBM</th><th>Verifikator</th><th>Aksi</th></tr></thead>
            <tbody>
              {view.map((l) => {
                const rm = RESULT_META[l.result];
                const FlagIcon = flagIcon[l.flag?.tone] ?? Flag;
                return (
                  <tr key={l.id}>
                    <td><span className="u-id" style={{ color: l.kind === 'ANGGARAN' ? '#7a0c16' : '#161a77' }}>{l.id}</span><span className="u-cell-sub">{l.date}</span></td>
                    <td style={{ maxWidth: 230 }}><span className={`u-badge ${l.kind === 'ANGGARAN' ? 'u-badge-gray' : 'u-badge-maroon'}`}>{l.kind}</span> <b>{l.title}</b><span className="u-cell-sub">{l.sub}</span></td>
                    <td><span className="bk-unit-tag"><Building2 size={12} /> {l.unit}</span></td>
                    <td className="num strong">{formatRupiah(l.amount)}</td>
                    <td><span className={`u-badge u-badge-${rm.tone}`}><i className="u-badge-dot" /> {rm.label}</span></td>
                    <td style={{ maxWidth: 320 }}>{l.note}{l.flag && <span className={`bk-flag ${l.flag.tone}`}><FlagIcon size={12} /> {l.flag.text}</span>}</td>
                    <td><b>{l.verifier}</b><span className="u-cell-sub">{l.role}</span></td>
                    <td>
                      {l.result === 'tolak'
                        ? <button type="button" className="u-btn u-btn-danger u-btn-sm" onClick={() => setLetter(l)}><XCircle size={14} /> Surat Penolakan</button>
                        : l.result === 'sah'
                          ? <button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => toast.push(`Unduh BAP ${l.id} (simulasi, belum ada berkas dari server).`)}><Download size={14} /> Unduh BAP</button>
                          : l.to ? <Link to={l.to} className="u-btn u-btn-soft u-btn-sm">{l.result === 'catatan' ? <><ListChecks size={14} /> Catatan Audit</> : l.kind === 'ANGGARAN' && l.result === 'revisi' ? <><Eye size={14} /> Buka Berkas</> : <><FileText size={14} /> Lembar Telaah</>}</Link>
                          : <button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => toast.push(`Detail ${l.id} (data contoh, tidak ada halaman detail).`)}><Eye size={14} /> Buka Berkas</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Tidak ada log</strong>Ubah filter untuk melihat log lain.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan {rows.length ? 1 + (current - 1) * PAGE_SIZE : 0} - {Math.min(current * PAGE_SIZE, rows.length)} dari {rows.length} log telaah selesai</span>
          <BigPager page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      <section className="card bk-sbm-card">
        <span className="bk-ico maroon"><Gavel size={24} /></span>
        <div>
          <h2>Tingkat Kepatuhan Standar Biaya Masukan (SBM) <span className="u-badge u-badge-sky">Kuartal II 2025</span></h2>
          <p>Berdasarkan Peraturan Rektor No. 14/2024 tentang Standarisasi Biaya Operasional dan Honorarium Universitas Adzkia. Seluruh berkas yang diteruskan ke WR II wajib memenuhi ketentuan ambang batas tarif resmi.</p>
        </div>
        <div className="bk-comp"><Donut percent={98.2} size={64} stroke={8} color="#7a0c16"><b>98%</b></Donut><div><strong>98.2%</strong><small>Kepatuhan Anggaran</small></div></div>
        <Link to={`${BASE}/panduan-sbm`} className="u-link">Lihat Matriks Regulasi SBM <ArrowRight size={13} /></Link>
      </section>

      <Modal open={Boolean(letter)} title="Surat Penolakan Usulan" onClose={() => setLetter(null)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setLetter(null)}>Tutup</button><button type="button" className="u-btn u-btn-primary" onClick={() => { toast.push('Unduh surat penolakan (simulasi).'); setLetter(null); }}><Download size={15} /> Unduh Surat</button></>}>
        {letter && (
          <>
            <p className="u-hint">No. Berkas: <b>{letter.id}</b> • {letter.date}</p>
            <p><b>Perihal:</b> Penolakan usulan "{letter.title}" ({letter.unit}) senilai {formatRupiah(letter.amount)}.</p>
            <p>{letter.note}</p>
            <p className="u-hint"><Scale size={12} /> Ditandatangani: {letter.verifier} ({letter.role}). Data contoh.</p>
          </>
        )}
      </Modal>
    </div>
  );
}