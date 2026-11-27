import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCheck, CheckCircle2, ClipboardCheck, Download, Info, Search, User } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, OTP_THRESHOLD, TA } from '../../data/wr2Data';
import { OtpModal, sum, uniq } from '../../components/wr2/shared';
import Pagination from '../../components/ui/Pagination';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const NOMINAL = { '': () => true, lt30: (n) => n < 30e6, mid: (n) => n >= 30e6 && n <= 50e6, gt50: (n) => n > 50e6 };
const PAGE = 10;

export default function Wr2Menunggu() {
  const toast = useToast();
  const navigate = useNavigate();
  const { queue, decide } = useWr2();
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('');
  const [nominal, setNominal] = useState('');
  const [sort, setSort] = useState('old');
  const [sel, setSel] = useState([]);
  const [page, setPage] = useState(1);
  const [bulk, setBulk] = useState(false);
  const [tte, setTte] = useState(false);
  const [otp, setOtp] = useState(false);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return queue
      .filter((s) => (!t || `${s.id} ${s.title} ${s.pic} ${s.unit}`.toLowerCase().includes(t)) && (!unit || s.unit === unit) && NOMINAL[nominal](s.amount))
      .sort((a, b) => (sort === 'old' ? b.wait - a.wait : a.wait - b.wait));
  }, [queue, q, unit, nominal, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const cur = Math.min(page, pageCount);
  const view = rows.slice((cur - 1) * PAGE, cur * PAGE);
  const chosen = queue.filter((s) => sel.includes(s.id));
  const allChecked = view.length > 0 && view.every((s) => sel.includes(s.id));
  const toggle = (id) => setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const hasFilter = q || unit || nominal;

  const finish = () => {
    decide(chosen, 'setuju', 'Disetujui kolektif sesuai telaah BKPU.');
    toast.push(`${chosen.length} usulan disetujui kolektif dan disimpan di database.`);
    setSel([]); setBulk(false); setOtp(false); setTte(false);
  };
  const confirmBulk = () => {
    if (!tte) { toast.push('Centang pernyataan TTE terlebih dulu.', 'error'); return; }
    if (chosen.some((s) => s.amount > OTP_THRESHOLD)) setOtp(true); else finish();
  };
  const exportCsv = () => {
    downloadCsv('Antrean_Persetujuan_WR2.csv', [['No. Usulan', 'Unit', 'Kegiatan', 'PIC', 'Total', 'Lama Menunggu (hari)'], ...rows.map((s) => [s.id, s.unit, s.title, s.pic, s.amount, s.wait])]);
    toast.push('Antrean diekspor ke CSV.');
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Persetujuan Anggaran' }, { label: 'Menunggu Persetujuan' }]}
        title="Pengajuan Anggaran Menunggu Persetujuan Wakil Rektor II"
        subtitle="Daftar usulan kegiatan yang telah dinyatakan Lolos Telaah Administrasi & Kepatuhan SBM oleh BKPU dan siap untuk keputusan disposisi/otorisasi definitif."
        actions={<>
          <button type="button" className="u-btn u-btn-soft" onClick={exportCsv}><Download size={15} /> Ekspor Antrean (.xlsx)</button>
          <button type="button" className="u-btn u-btn-primary" disabled={!sel.length} onClick={() => setBulk(true)}><CheckCheck size={15} /> Persetujuan Kolektif ({sel.length})</button>
        </>}
      />

      <section className="wr2-banner">
        <span className="wr2-banner-icon"><ClipboardCheck size={26} /></span>
        <div>
          <p><span className="u-badge u-badge-maroon">ANTREAN OTORISASI PRIMER</span> • {TA}</p>
          <h2>Terdapat <u>{queue.length} Pengajuan</u> (Total Nilai: {formatRupiah(sum(queue, 'amount'))})</h2>
          <p>Seluruh berkas telah diverifikasi BKPU dan memenuhi Standar Biaya Masukan (SBM) Adzkia. Batas waktu respons SLA pimpinan: ≤ 3 hari kalender.</p>
        </div>
        <div className="wr2-banner-stats">
          <div><span>Tertua di Antrean</span><b>{queue.length ? Math.max(...queue.map((s) => s.wait)) : 0} Hari</b></div>
          <div><span>Verifikasi BKPU</span><b><CheckCircle2 size={16} /> 100%</b></div>
        </div>
      </section>

      <section className="card">
        <div className="u-filters">
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari nomor usulan, kegiatan, PIC, atau unit" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari" /></div>
          <select className="u-select" style={{ width: 'auto' }} aria-label="Tahun akademik" defaultValue={TA}><option>{TA}</option></select>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={(e) => { setUnit(e.target.value); setPage(1); }} aria-label="Unit"><option value="">Semua Fakultas / Unit</option>{uniq(queue, 'unit').map((u) => <option key={u}>{u}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} value={nominal} onChange={(e) => { setNominal(e.target.value); setPage(1); }} aria-label="Nominal"><option value="">Rentang Nominal (Semua)</option><option value="lt30">Di bawah Rp 30 Jt</option><option value="mid">Rp 30 – 50 Jt</option><option value="gt50">Di atas Rp 50 Jt</option></select>
          <select className="u-select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutan"><option value="old">Lama Menunggu (Terlama)</option><option value="new">Lama Menunggu (Terbaru)</option></select>
        </div>
        <div className="u-chips">
          <span>Filter Aktif:</span>
          <span className="u-chip">Status: <b style={{ color: '#7a0c16' }}>Menunggu Persetujuan WR2</b></span>
          <span className="u-chip">Verifikasi: <b>Lolos BKPU</b></span>
          {hasFilter && <button type="button" className="u-link" onClick={() => { setQ(''); setUnit(''); setNominal(''); setPage(1); }}>Reset Filter</button>}
          <span className="end">Menampilkan <b>{rows.length}</b> dari <b>{queue.length}</b> pengajuan</span>
        </div>
      </section>

      <section className="card">
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1100 }}>
            <thead><tr><th style={{ width: 34 }}><input type="checkbox" className="u-check" checked={allChecked} onChange={() => setSel(allChecked ? [] : view.map((s) => s.id))} aria-label="Pilih semua" /></th><th>No. Usulan & Tanggal</th><th>Unit / Fakultas</th><th>Nama Kegiatan & PIC</th><th className="num">Total Anggaran</th><th>Tgl Masuk WR2</th><th>Verifikasi BKPU</th><th>Antrean</th><th>Tindakan</th></tr></thead>
            <tbody>
              {view.map((s) => (
                <tr key={s.id} className={sel.includes(s.id) ? 'row-sel' : ''}>
                  <td><input type="checkbox" className="u-check" checked={sel.includes(s.id)} onChange={() => toggle(s.id)} aria-label={`Pilih ${s.id}`} /></td>
                  <td><span className="u-id" style={{ color: '#161a77' }}>{s.id}</span><span className="u-cell-sub">{s.date}</span></td>
                  <td style={{ maxWidth: 160 }}><span className="u-cell-title">{s.unit}</span><span className="bk-unit-tag">{s.faculty}</span></td>
                  <td style={{ maxWidth: 280 }}><span className="u-cell-title">{s.title}</span><span className="u-cell-sub"><User size={12} /> {s.pic}</span></td>
                  <td className="num strong">{formatRupiah(s.amount)}<span className="u-cell-sub">{s.mak}</span></td>
                  <td>{s.entry}<span className="u-cell-sub">{s.entryTime}</span></td>
                  <td><span className="u-badge u-badge-green"><CheckCircle2 size={12} /> Lolos Telaah BKPU (SBM Sesuai)</span></td>
                  <td><span className={`u-badge ${s.wait >= 2 ? 'u-badge-amber' : 'u-badge-sky'}`}>{s.wait} Hari</span></td>
                  <td><Link to={`${BASE}/pengajuan/${s.id}`} className="u-btn u-btn-primary u-btn-sm">Tinjau Keputusan <ArrowRight size={13} /></Link></td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={4} className="num">Total Kumulatif Menunggu Otorisasi WR II:</td><td className="num">{formatRupiah(sum(rows, 'amount'))}</td><td colSpan={4} style={{ fontWeight: 500 }}>({rows.length} berkas terverifikasi siap putus)</td></tr></tfoot>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Antrean kosong</strong>Tidak ada usulan yang menunggu persetujuan.</div>}
        </div>
        <div className="u-tfoot-bar">
          <span><Info size={14} /> SOP Otorisasi: Keputusan WR2 mengikat untuk penerbitan SK Pagu Kegiatan & Pencairan Tahap I BKPU.</span>
          <span>Halaman {cur} dari {pageCount} <Pagination page={cur} pageCount={pageCount} onChange={setPage} /></span>
        </div>
      </section>

      <Modal open={bulk} title="Persetujuan Kolektif" onClose={() => setBulk(false)}
        footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setBulk(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={confirmBulk}>Setujui {chosen.length} Usulan</button></>}>
        <p className="u-hint">Total nilai: <b>{formatRupiah(sum(chosen, 'amount'))}</b></p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem' }}>{chosen.map((s) => <li key={s.id}>{s.id} — {s.title} ({formatRupiah(s.amount)})</li>)}</ul>
        <label className="bk-checks"><span style={{ display: 'flex', gap: '0.5rem' }}><input type="checkbox" className="u-check" checked={tte} onChange={(e) => setTte(e.target.checked)} /> Bubuhkan Tanda Tangan Elektronik (TTE BSrE) pada seluruh SK</span></label>
      </Modal>
      <OtpModal open={otp} onClose={() => setOtp(false)} onVerified={() => { finish(); navigate(`${BASE}/riwayat`); }} />
    </div>
  );
}