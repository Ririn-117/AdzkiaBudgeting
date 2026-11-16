import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Banknote, Building2, CalendarDays, CheckCircle2, Download, Eye, FileCheck2, History,
  Hourglass, Info, Landmark, PlusCircle, Search, Wallet, BadgeCheck, CreditCard, FolderOpen, Receipt,
} from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, DEFAULT_TA, DISBURSEMENTS, DISBURSEMENT_SUMMARY as S, SUBMISSIONS, TA_OPTIONS } from '../../data/unitData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';

const PAGE_SIZE = 5;
const TERMINS = ['Termin 1 - Uang Muka', 'Termin 2 - Pelunasan'];

export default function Pencairan() {
  const toast = useToast();
  const [rows, setRows] = useState(DISBURSEMENTS);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [ta, setTa] = useState(DEFAULT_TA);
  const [page, setPage] = useState(1);
  const [reqOpen, setReqOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const [req, setReq] = useState({ ref: '', termin: TERMINS[0], amount: '' });
  const [reqErr, setReqErr] = useState({});

  const approved = SUBMISSIONS.filter((s) => s.status === 'disetujui');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) => (!term || `${r.id} ${r.activity} ${r.ref}`.toLowerCase().includes(term)) && (!status || r.status === status) && (!ta || ta === DEFAULT_TA)
    );
  }, [rows, q, status, ta]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const view = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const accumulated = filtered.reduce((a, r) => a + r.amount, 0);

  const exportCsv = () => {
    downloadCsv('Pencairan_Dana.csv', [
      ['No. Pencairan', 'Tanggal', 'Kegiatan', 'Ref Pengajuan', 'Pagu Disetujui', 'Termin', 'Nominal', 'Rekening', 'Status'],
      ...filtered.map((r) => [r.id, r.date, r.activity, r.ref, r.approved, `${r.termin} (${r.terminNote})`, r.amount, `${r.bank} ${r.account}`, r.statusLabel]),
    ]);
    toast.push('Data pencairan diekspor ke CSV.');
  };

  const submitRequest = () => {
    const e = {};
    const target = approved.find((s) => s.id === req.ref);
    if (!target) e.ref = 'Pilih kegiatan yang sudah disetujui.';
    const amount = Number(req.amount);
    if (!(amount > 0)) e.amount = 'Nominal harus lebih dari 0.';
    else if (target && amount > target.total) e.amount = 'Nominal melebihi pagu yang disetujui.';
    setReqErr(e);
    if (Object.keys(e).length) return;

    const next = {
      id: `PC-2025-${String(rows.length + 4).padStart(3, '0')}`,
      date: '12 Apr 2025',
      activity: target.title,
      ref: target.id,
      unit: 'FTK Adzkia',
      approved: target.total,
      termin: req.termin.split(' - ')[0],
      terminNote: req.termin.split(' - ')[1],
      amount,
      receipt: 'Kuitansi menunggu nomor',
      bank: 'BSI Virtual Account Operasional PGMI',
      account: '8871092831',
      status: 'proses',
      statusLabel: 'Menunggu Verifikasi Kasir',
      statusNote: 'Diajukan hari ini',
      sp2d: 'Belum terbit',
    };
    setRows((prev) => [next, ...prev]);
    setReq({ ref: '', termin: TERMINS[0], amount: '' });
    setReqOpen(false);
    toast.push(`Pengajuan pencairan ${next.id} dicatat (simulasi, belum tersimpan di server).`);
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Modul Keuangan' }, { label: 'Realisasi Perbendaharaan' }]}
        title="Pencairan Dana Anggaran"
        subtitle="Kelola dan pantau pengajuan pencairan dana untuk kegiatan yang telah memperoleh persetujuan resmi Wakil Rektor II (WR2) Bidang Keuangan dan Administrasi."
        actions={
          <>
            <button type="button" className="u-btn u-btn-soft" onClick={() => setHistOpen(true)}><History size={15} /> Riwayat SP2D</button>
            <button type="button" className="u-btn u-btn-primary" onClick={() => setReqOpen(true)}><PlusCircle size={15} /> Ajukan Pencairan Baru</button>
          </>
        }
      />

      <div className="u-sum-grid cols-4">
        <SummaryCard tone="navy" label="Total Anggaran Disetujui" icon={Wallet} value={formatRupiah(S.disetujui.amount)}>
          <p className="u-sum-sub"><span className="u-badge u-badge-sky">{S.disetujui.programs} Program Kerja</span> {DEFAULT_TA.replace('TA ', 'TA ')}</p>
          <p className="u-sum-sub u-sum-foot"><span>{S.disetujui.sk}</span><BadgeCheck size={16} /></p>
        </SummaryCard>
        <SummaryCard tone="slate" label="Total Telah Dicairkan" icon={CheckCircle2} value={formatRupiah(S.dicairkan.amount)}>
          <div className="u-bar-row"><div className="u-bar"><i style={{ width: `${S.dicairkan.percent}%` }} /></div><b>{S.dicairkan.percent}%</b></div>
          <p className="u-sum-sub u-sum-foot"><span>Realisasi Kas Kasir Universitas</span><span>{S.dicairkan.stages}</span></p>
        </SummaryCard>
        <SummaryCard tone="maroon" label="Sedang dalam Proses" icon={Hourglass} value={formatRupiah(S.proses.amount)}>
          <p className="u-sum-sub"><span className="u-badge u-badge-maroon">1 Pengajuan Aktif</span> Menunggu Kasir</p>
          <p className="u-sum-foot u-sum-sub"><span>{S.proses.note}</span><Link to={`${BASE}/pencairan/PC-2025-006`} className="u-link">Lacak <ArrowRight size={12} /></Link></p>
        </SummaryCard>
        <SummaryCard tone="rose" label="Sisa Siap Dicairkan" icon={Landmark} value={formatRupiah(S.siap.amount)}>
          <p className="u-sum-sub"><span className="u-badge u-badge-sky">Sisa Kuota PGMI</span> 1 Kegiatan</p>
          <p className="u-sum-foot u-sum-sub"><span>{S.siap.note}</span><span style={{ color: '#2447a3', fontWeight: 700 }}>Termin 2 Lab</span></p>
        </SummaryCard>
      </div>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow">
            <Search size={17} className="ic" />
            <input className="u-input has-ic" placeholder="Cari nama kegiatan atau nomor pencairan..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari pencairan" />
          </div>
          <button type="button" className="u-btn u-btn-soft" onClick={exportCsv}><Download size={15} /> Ekspor Excel</button>
          <label className="u-inline-select">Status:
            <select className="u-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Semua Status</option>
              <option value="proses">Menunggu Transfer / Proses</option>
              <option value="cair">Telah Dicairkan</option>
            </select>
          </label>
          <label className="u-inline-select">Tahun:
            <select className="u-select" value={ta} onChange={(e) => { setTa(e.target.value); setPage(1); }}>
              {TA_OPTIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>

        <div className="u-scroll" style={{ marginTop: '1rem' }}>
          <table className="u-table" style={{ minWidth: 1050 }}>
            <thead>
              <tr><th>No. Pencairan & Tgl</th><th>Nama Kegiatan & Induk Pengajuan</th><th className="num">Pagu Disetujui</th><th>Termin / Tahap</th><th className="num">Nominal Pencairan</th><th>Rekening Tujuan</th><th>Status Pencairan</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.id}>
                  <td><Link to={`${BASE}/pencairan/${r.id}`} className="u-id">{r.id}</Link><span className="u-cell-sub"><CalendarDays size={12} /> {r.date}</span></td>
                  <td style={{ maxWidth: 260 }}>
                    <span className="u-cell-title">{r.activity}</span>
                    <span className="u-cell-sub"><Link to={`${BASE}/pengajuan/${r.ref}`} className="u-link" style={{ fontWeight: 600 }}>Ref: {r.ref}</Link> • {r.unit}</span>
                  </td>
                  <td className="num">{formatRupiah(r.approved)}</td>
                  <td><b>{r.termin}</b><span className="u-cell-sub">{r.terminNote}</span></td>
                  <td className="num"><b style={{ color: r.status === 'proses' ? '#7a0c16' : '#0f172a' }}>{formatRupiah(r.amount)}</b><span className="u-cell-sub">{r.receipt}</span></td>
                  <td><b style={{ fontSize: '0.8rem' }}>{r.bank}</b><span className="u-cell-sub"><CreditCard size={12} /> {r.account}</span></td>
                  <td>
                    {r.status === 'proses'
                      ? <StatusBadge tone="blue" dot>{r.statusLabel}</StatusBadge>
                      : <StatusBadge tone="green" icon={CheckCircle2}>{r.statusLabel}</StatusBadge>}
                    <span className="u-cell-sub">{r.statusNote}</span>
                  </td>
                  <td>
                    <div className="u-actions">
                      {r.status === 'proses' ? (
                        <Link to={`${BASE}/pencairan/${r.id}`} className="u-btn u-btn-soft u-btn-sm"><Eye size={14} /> Detail</Link>
                      ) : (
                        <>
                          <button type="button" className="u-btn u-btn-soft u-btn-sm" onClick={() => toast.push(`Bukti transfer ${r.id} (simulasi, belum ada berkas dari server).`)}>Bukti Transfer</button>
                          {r.canLpj ? <Link to={`${BASE}/laporan-spj`} className="u-btn u-btn-primary u-btn-sm">Lanjut LPJ <ArrowRight size={13} /></Link>
                            : <Link to={`${BASE}/pencairan/${r.id}`} className="u-iconbtn" aria-label={`Buka ${r.id}`}><FolderOpen size={17} /></Link>}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={4} className="num">Total Akumulasi Pencairan:</td><td className="num">{formatRupiah(accumulated)}</td><td colSpan={3} style={{ fontWeight: 500 }}>Menampilkan {filtered.length} dari {rows.length} transaksi perbendaharaan aktif</td></tr>
            </tfoot>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Tidak ada transaksi</strong>Ubah filter atau ajukan pencairan baru.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan <b>{filtered.length ? 1 + (current - 1) * PAGE_SIZE : 0}-{Math.min(current * PAGE_SIZE, filtered.length)}</b> transaksi pencairan</span>
          <Pagination page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      <div className="u-note">
        <Info size={20} />
        <div>
          <strong>Ketentuan Pengajuan Termin Pencairan Dana Universitas Adzkia</strong>
          <p>Pencairan Termin 2 (Pelunasan 30%-50%) hanya dapat diproses setelah Laporan Pertanggungjawaban (LPJ) keuangan Termin 1 diverifikasi minimal 80% oleh Satuan Pengawas Internal (SPI) dan diverifikasi oleh Bagian Keuangan Rektorat.</p>
        </div>
      </div>

      <Modal
        open={reqOpen}
        title="Ajukan Pencairan Baru"
        onClose={() => setReqOpen(false)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setReqOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={submitRequest}><Banknote size={15} /> Kirim Pengajuan</button></>}
      >
        <div className="u-field">
          <label className="u-label" htmlFor="r-ref">Kegiatan yang disetujui</label>
          <select id="r-ref" className={`u-select ${reqErr.ref ? 'invalid' : ''}`} value={req.ref} onChange={(e) => setReq({ ...req, ref: e.target.value })}>
            <option value="">Pilih kegiatan</option>
            {approved.map((s) => <option key={s.id} value={s.id}>{s.id} - {s.title}</option>)}
          </select>
          {reqErr.ref && <p className="u-err">{reqErr.ref}</p>}
        </div>
        <div className="u-field">
          <label className="u-label" htmlFor="r-termin">Termin</label>
          <select id="r-termin" className="u-select" value={req.termin} onChange={(e) => setReq({ ...req, termin: e.target.value })}>
            {TERMINS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="u-field">
          <label className="u-label" htmlFor="r-amount">Nominal pencairan (Rp)</label>
          <input id="r-amount" type="number" min="0" className={`u-input ${reqErr.amount ? 'invalid' : ''}`} value={req.amount} onChange={(e) => setReq({ ...req, amount: e.target.value })} />
          {reqErr.amount && <p className="u-err">{reqErr.amount}</p>}
        </div>
        <p className="u-hint">Pencairan Termin 2 mensyaratkan LPJ Termin 1 terverifikasi minimal 80%.</p>
      </Modal>

      <Modal open={histOpen} wide title="Riwayat SP2D" onClose={() => setHistOpen(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setHistOpen(false)}>Tutup</button>}>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 520 }}>
            <thead><tr><th>No. SP2D</th><th>Pencairan</th><th className="num">Nominal</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="u-mono">{r.sp2d}</td><td>{r.id}</td><td className="num strong">{formatRupiah(r.amount)}</td>
                  <td>{r.status === 'cair' ? <span className="u-badge u-badge-green">Cair</span> : <span className="u-badge u-badge-blue">Proses</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="u-hint"><Receipt size={12} /> Data contoh.</p>
      </Modal>
    </div>
  );
}
