import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, BadgeCheck, BellRing, Check, CheckCircle2, Clock, Copy, Download, Eye, FileClock, Hourglass,
  Landmark, Pencil, PlusCircle, Printer, Search, UploadCloud, Wrench, ExternalLink, Table2,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, DEFAULT_TA, LPJS, LPJ_STATUS, LPJ_SUMMARY as S, SUBMISSIONS, TA_OPTIONS } from '../../data/unitData';
import { fetchLpjs, createLpjRequest, fetchSubmissions } from '../../services/unitService';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const PAGE_SIZE = 5;
const ACCOUNT = '7182-9901-2244';

export default function Lpj() {
  const toast = useToast();
  const [rows, setRows] = useState(LPJS);
  const [approvedSubs, setApprovedSubs] = useState(() => SUBMISSIONS.filter((s) => s.status === 'disetujui'));
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [ta, setTa] = useState(DEFAULT_TA);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    let active = true;
    fetchLpjs()
      .then(({ rows: dbRows }) => {
        if (active && dbRows.length > 0) setRows(dbRows);
      })
      .catch(() => {});
    fetchSubmissions({ status: 'disetujui' })
      .then((list) => {
        if (active && list.length > 0) setApprovedSubs(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => (!term || `${r.id} ${r.activity} ${r.ref}`.toLowerCase().includes(term)) && (!status || r.status === status) && (!ta || ta === DEFAULT_TA));
  }, [rows, q, status, ta]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const view = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const sum = (key) => filtered.reduce((a, r) => a + r[key], 0);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT.replaceAll('-', ''));
      toast.push('Nomor rekening disalin.');
    } catch {
      toast.push('Tidak dapat menyalin otomatis. Salin nomor rekening secara manual.', 'error');
    }
  };

  const exportCsv = () => {
    downloadCsv('Rekap_LPJ.csv', [
      ['No. LPJ', 'Kegiatan', 'Ref', 'Dana Tercairkan', 'Realisasi', 'Sisa Silpa', 'Status'],
      ...filtered.map((r) => [r.id, r.activity, r.ref, r.dana, r.realisasi, r.silpa, LPJ_STATUS[r.status].label]),
    ]);
    toast.push('Rekap LPJ diekspor ke CSV.');
  };

  const downloadReceipt = () => {
    downloadCsv('Format_Kuitansi.csv', [
      ['No. Kuitansi', 'Tanggal', 'Penerima', 'Uraian', 'Jumlah (Rp)', 'PPh 21 (Rp)', 'Materai'],
      ['', '', '', '', '', '', ''],
    ]);
    toast.push('Format kuitansi diunduh.');
  };

  const createLpj = async () => {
    const target = approvedSubs.find((s) => s.id === ref);
    if (!target) { setErr('Pilih kegiatan yang sudah disetujui.'); return; }
    try {
      const created = await createLpjRequest({ ref: target.id });
      setRows((p) => [created, ...p]);
      setOpen(false); setRef(''); setErr('');
      toast.push(`${created.id} berhasil dibuat di database.`);
    } catch (e) {
      toast.push(e?.message || 'Gagal membuat LPJ di server.', 'error');
    }
  };

  const actionIcon = { draft: Pencil, verifikasi: Eye, revisi: Wrench, disetujui: Printer };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Modul Keuangan' }, { label: 'Pertanggungjawaban & Realisasi' }, { label: 'Laporan Pertanggungjawaban (LPJ)' }]}
        title="Laporan Pertanggungjawaban (LPJ) Kegiatan"
        accent
        actions={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={downloadReceipt}><Download size={15} /> Unduh Format Kuitansi</button>
            <button type="button" className="u-btn u-btn-primary" onClick={() => setOpen(true)}><PlusCircle size={15} /> Buat LPJ Baru</button>
          </>
        }
      />

      <div className="u-note u-note-danger u-alert-lpj">
        <BellRing size={22} />
        <div>
          <strong><span className="u-badge u-badge-red" style={{ marginRight: '0.5rem' }}>Tenggat wajib SPI</span>Seminar Nasional Pendidikan Islam & Publikasi (Ref: PGMI-2025-001)</strong>
          <p>Jatuh tempo pelaporan: <b style={{ color: '#b4121f' }}>10 Mei 2025 (Sisa 22 Hari)</b>. Keterlambatan verifikasi LPJ ini akan menangguhkan verifikasi pencairan termin kegiatan akademik berikutnya.</p>
        </div>
        <Link to={`${BASE}/laporan-spj/LPJ-2025-003`} className="u-btn u-btn-primary"><UploadCloud size={15} /> Unggah Kelengkapan LPJ</Link>
      </div>

      <div className="u-sum-grid cols-4">
        <SummaryCard tone="navy" label="Total Realisasi Dilaporkan" icon={Landmark} value={formatRupiah(S.total.amount)}>
          <div className="u-bar-row"><span className="u-sum-sub">Pagu tercairkan: {formatRupiah(S.total.cair)}</span><b>{String(S.total.percent).replace('.', ',')}%</b></div>
          <div className="u-bar"><i style={{ width: `${S.total.percent}%` }} /></div>
          <p className="u-sum-sub" style={{ color: '#0b6b44' }}><CheckCircle2 size={13} /> Status penyerapan belanja sehat</p>
        </SummaryCard>
        <SummaryCard tone="slate" label="Menunggu Audit SPI" icon={Hourglass} value={formatRupiah(S.audit.amount)}>
          <p className="u-sum-sub">Beban dokumen: <b>{S.audit.docs} Dokumen LPJ</b></p>
          <p className="u-sum-sub"><Clock size={13} /> Sedang ditinjau Auditor Internal SPI</p>
        </SummaryCard>
        <SummaryCard tone="maroon" label="Perlu Revisi Bukti" icon={AlertTriangle} value={formatRupiah(S.revisi.amount)}>
          <p className="u-sum-sub">Status pengembalian: <span className="u-badge u-badge-red">{S.revisi.flagged} LPJ ditandai</span></p>
          <p className="u-sum-sub" style={{ color: '#7a0c16' }}>Kekurangan cap basah & PPh 21</p>
        </SummaryCard>
        <SummaryCard tone="blue" label="Telah Diverifikasi SPI" icon={BadgeCheck} value={formatRupiah(S.verified.amount)}>
          <p className="u-sum-sub">Selesai & BAP diterbitkan: <b>{S.verified.final} LPJ Final</b></p>
          <p className="u-sum-sub">Arsip tuntas di BKPU Univ. Adzkia</p>
        </SummaryCard>
      </div>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow">
            <Search size={17} className="ic" />
            <input className="u-input has-ic" placeholder="Cari nama kegiatan, nomor LPJ, atau nomor kuitansi..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari LPJ" />
          </div>
          <label className="u-inline-select">Status:
            <select className="u-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Semua Status ({rows.length})</option>
              {Object.entries(LPJ_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
          <select className="u-select" style={{ width: 'auto' }} value={ta} onChange={(e) => { setTa(e.target.value); setPage(1); }} aria-label="Tahun akademik">
            {TA_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <button type="button" className="u-btn u-btn-soft" onClick={exportCsv}><Table2 size={15} /> Ekspor Rekap LPJ</button>
        </div>

        <div className="u-scroll" style={{ marginTop: '1rem' }}>
          <table className="u-table" style={{ minWidth: 1050 }}>
            <thead>
              <tr><th>No. LPJ & Tanggal</th><th>Kegiatan & No. Pengajuan</th><th className="num">Dana Tercairkan</th><th className="num">Realisasi Belanja</th><th>Bukti Transaksi</th><th>Status LPJ</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {view.map((r) => {
                const meta = LPJ_STATUS[r.status];
                const Icon = actionIcon[r.status];
                return (
                  <tr key={r.id} className={r.status === 'revisi' ? 'row-err' : ''}>
                    <td>
                      <Link to={`${BASE}/laporan-spj/${r.id}`} className="u-id">{r.id}</Link>
                      <span className="u-cell-sub">{r.date}</span>
                      <span className={`u-badge u-badge-${r.chipTone}`} style={{ marginTop: '0.4rem' }}>{r.chip}</span>
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      <span className="u-cell-title">{r.activity}</span>
                      <span className="u-cell-sub">Ref: {r.ref} • {r.extra}</span>
                    </td>
                    <td className="num">{formatRupiah(r.dana)}</td>
                    <td className="num"><b>{formatRupiah(r.realisasi)}</b><span className="u-cell-sub">{r.spent ?? `Sisa Silpa: ${formatRupiah(r.silpa)}`}</span></td>
                    <td style={{ minWidth: 190 }}>
                      <b>{r.docs}</b> {r.progress != null && <b style={{ color: '#7a0c16', float: 'right' }}>{r.progress}%</b>}
                      {r.progress != null && <div className="u-bar maroon" style={{ margin: '0.35rem 0' }}><i style={{ width: `${r.progress}%` }} /></div>}
                      <span className="u-cell-sub" style={r.docWarn || r.progress != null ? { color: '#b4121f' } : undefined}>{r.docNote}</span>
                    </td>
                    <td><StatusBadge tone={meta.tone} dot={meta.dot}>{meta.label}</StatusBadge></td>
                    <td>
                      <div className="u-actions">
                        <Link to={`${BASE}/laporan-spj/${r.id}`} className={`u-btn u-btn-sm ${r.status === 'revisi' ? 'u-btn-primary' : r.status === 'draft' ? 'u-btn-soft' : 'u-btn-outline'}`}>
                          <Icon size={14} /> {r.action}
                        </Link>
                        {r.status === 'disetujui' && <Link to={`${BASE}/laporan-spj/${r.id}`} className="u-iconbtn" aria-label={`Buka ${r.id}`}><ExternalLink size={16} /></Link>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr><td colSpan={2}>Total seluruh realisasi LPJ terdata</td><td className="num">{formatRupiah(sum('dana'))}</td><td className="num">{formatRupiah(sum('realisasi'))}</td><td colSpan={3} className="num" style={{ fontWeight: 500 }}>Akumulasi sisa pengembalian silpa: <b style={{ color: '#7a0c16' }}>{formatRupiah(sum('silpa'))}</b></td></tr>
            </tfoot>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Tidak ada LPJ</strong>Ubah filter atau buat LPJ baru.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan <b>{filtered.length ? 1 + (current - 1) * PAGE_SIZE : 0}-{Math.min(current * PAGE_SIZE, filtered.length)}</b> dari <b>{filtered.length}</b> Laporan Pertanggungjawaban</span>
          <Pagination page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      <section className="card">
        <div className="u-help-head">
          <span className="u-section-icon navy"><Landmark size={20} /></span>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Ketentuan Pengembalian Sisa Anggaran (Silpa)</h2>
            <p className="u-hint">Prosedur resmi rekonsiliasi kas lebih bayar kegiatan Prodi Universitas Adzkia</p>
          </div>
        </div>
        <p className="u-body-text">Sesuai Surat Edaran Rektor No. 114/UN.ADZ/KU/2024, sisa dana kegiatan yang tidak terserap wajib disetor kembali ke Rekening Penampung Kas Rektorat selambat-lambatnya 7 hari kerja setelah kegiatan selesai. Bukti transfer/slip setoran wajib dilampirkan pada formulir unggahan LPJ online.</p>
        <div className="u-bank">
          <span className="u-bank-logo">BSI</span>
          <div><span>Bank Syariah Indonesia (BSI)</span><strong>{ACCOUNT}</strong><span>A.N. Universitas Adzkia - Rekening Penampungan Silpa</span></div>
          <button type="button" className="u-btn u-btn-outline" onClick={copyAccount}><Copy size={15} /> Salin No. Rekening</button>
        </div>
        <p className="u-checks"><span><Check size={13} /> Dilengkapi Berita Acara Rekonsiliasi Kas</span><span><Check size={13} /> Bebas Biaya Kliring Antarbank</span></p>
      </section>

      <Modal open={open} title="Buat LPJ Baru" onClose={() => setOpen(false)} footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={createLpj}><FileClock size={15} /> Buat Draft LPJ</button></>}>
        <div className="u-field">
          <label className="u-label" htmlFor="l-ref">Kegiatan yang disetujui</label>
          <select id="l-ref" className={`u-select ${err ? 'invalid' : ''}`} value={ref} onChange={(e) => { setRef(e.target.value); setErr(''); }}>
            <option value="">Pilih kegiatan</option>
            {approvedSubs.map((s) => <option key={s.id} value={s.id}>{s.id} - {s.title}</option>)}
          </select>
          {err && <p className="u-err">{err}</p>}
        </div>
        <p className="u-hint">Draft dibuat kosong. Unggah kuitansi, faktur, dan berita acara di halaman detail LPJ.</p>
      </Modal>
    </div>
  );
}
