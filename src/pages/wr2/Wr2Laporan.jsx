import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Eye, Info, Lightbulb, Printer, Search, ShieldCheck, TrendingUp, CheckCircle2, AlertCircle, GitCompare } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, ENTITIES, TREND, UNITS_MATRIX } from '../../data/wr2Data';
import { BigPager, Segments, fmtJt, fmtM, sum } from '../../components/wr2/shared';
import Modal from '../../components/ui/Modal';
import { OtpModal } from '../../components/wr2/shared';
import { useToast } from '../../components/ui/Toast';

const PAGE = 6;

export default function Wr2Laporan() {
  const toast = useToast();
  const { submissions, queue } = useWr2();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [cmp, setCmp] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [otp, setOtp] = useState(false);

  const by = (s) => submissions.filter((x) => x.stage === s);
  const ok = by('disetujui');
  const rows = useMemo(() => UNITS_MATRIX.filter((u) => `${u.name} ${u.fac}`.toLowerCase().includes(q.trim().toLowerCase())), [q]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const cur = Math.min(page, pageCount);
  const view = rows.slice((cur - 1) * PAGE, cur * PAGE);
  const tot = (k) => view.reduce((a, u) => a + u[k], 0);
  const parts = [{ value: ok.length, color: '#7a0c16' }, { value: queue.length, color: '#3f5a8a' }, { value: by('revisi').length, color: '#9bb5ee' }, { value: by('ditolak').length, color: '#b4121f' }];
  const maxTrend = Math.max(...TREND.map((t) => t[1]));
  const exportCsv = () => {
    downloadCsv('Laporan_Anggaran_Eksekutif.csv', [['Unit', 'Pagu Awal', 'Usulan Masuk', 'Disetujui WR II', 'Realisasi SP2D', 'Sisa Pagu', 'Serapan %'], ...UNITS_MATRIX.map((u) => [u.name, u.pagu, u.usul, u.setuju, u.real, u.pagu - u.setuju, ((u.real / u.pagu) * 100).toFixed(1)])]);
    toast.push('Dokumen eksekutif diekspor ke CSV.');
  };

  return (
    <div className="upage">
      <header className="u-ph">
        <div>
          <p className="u-hint" style={{ margin: 0 }}>RIWAYAT & LAPORAN › <b>Laporan Anggaran WR II</b></p>
          <h1 style={{ fontSize: '1.7rem' }}>Laporan & Evaluasi Anggaran Universitas Adzkia</h1>
        </div>
        <div className="u-ph-actions">
          <select className="u-select" style={{ width: 'auto' }} aria-label="Periode" defaultValue="genap" onChange={(e) => { if (e.target.value !== 'genap') { toast.push('Data semester ganjil belum tersedia (contoh).', 'error'); e.target.value = 'genap'; } }}><option value="genap">Semester Genap (2024/2025)</option><option value="ganjil">Semester Ganjil (2023/2024)</option></select>
          <button type="button" className="u-btn u-btn-navy" onClick={() => setCmp(true)}><GitCompare size={15} /> Bandingkan Periode</button>
          <button type="button" className="u-btn u-btn-primary" onClick={exportCsv}><Download size={15} /> Unduh Dokumen Eksekutif</button>
        </div>
      </header>

      <div className="u-note"><ShieldCheck size={20} /><div><strong>Status Audit SBM/BKPU: Sinkron per 14 April 2025 <span className="u-badge u-badge-sky">Terverifikasi</span></strong><p>Penyelarasan plafon Standar Biaya Masukan dengan pagu kas besar telah selesai di 4 Fakultas & 3 Lembaga Biro Rektorat. Pembaruan otomatis 10 menit lalu.</p></div></div>

      <div className="u-sum-grid">
        <div className="u-sum u-sum-slate"><div className="u-sum-top"><span>Total Pagu Diajukan</span></div><p className="u-sum-value">{fmtM(sum(submissions, 'amount'))}</p><p className="u-sum-sub">Total RKAT {submissions.length} Kegiatan</p></div>
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Disetujui WR II</span></div><p className="u-sum-value">{fmtM(sum(ok, 'amount'))}</p><p className="u-sum-sub">Telah diterbitkan SKK • Rasio lolos {submissions.length ? ((ok.length / submissions.length) * 100).toFixed(1) : 0}%</p></div>
        <div className="u-sum u-sum-blue"><div className="u-sum-top"><span>Realisasi SP2D Kasir</span></div><p className="u-sum-value">Rp 1.280,0 M</p><p className="u-sum-sub">Dana cair ke rekening unit • Serapan efektif 81.7% SKK</p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>Menunggu Putusan</span></div><p className="u-sum-value">{fmtJt(sum(queue, 'amount'))}</p><p className="u-sum-sub">{queue.length} berkas perlu paraf WR II</p></div>
        <div className="u-sum u-sum-rose"><div className="u-sum-top"><span>Rasionalisasi SBM</span></div><p className="u-sum-value">Rp 45,2 Jt</p><p className="u-sum-sub">Efisiensi telaah tim anggaran • +2.4% Cadangan</p></div>
      </div>

      <div className="wr2-three">
        <section className="card">
          <div className="bk-sec-head tight"><h2>Distribusi Realisasi per Entitas</h2><span className="u-badge u-badge-sky">TA 2024/2025</span></div>
          {ENTITIES.map(([name, real, pagu, note]) => { const p = (real / pagu) * 100; return (
            <div key={name} className="wr2-fac"><p><b>{name}</b><b>Rp {real.toLocaleString('id-ID')} Jt / Rp {pagu} Jt</b></p><div className="u-bar maroon"><i style={{ width: `${p}%` }} /></div><small>{note} <span>{p.toFixed(1)}% Terpakai</span></small></div>
          ); })}
          <p className="bk-note-box"><Info size={15} /> Ambang batas serapan semester genap: 60% — <b>Target Tercapai</b></p>
        </section>
        <section className="card">
          <div className="bk-sec-head tight"><h2>Status Usulan Anggaran</h2><span className="u-hint">Total {submissions.length} Usulan</span></div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Segments parts={parts}><b style={{ fontSize: '1.6rem' }}>{submissions.length}</b><small>PENGAJUAN</small></Segments></div>
          <ul className="wr2-legend">
            <li><i style={{ background: '#7a0c16' }} /> {ok.length} Disetujui</li><li><i style={{ background: '#3f5a8a' }} /> {queue.length} Menunggu</li>
            <li><i style={{ background: '#9bb5ee' }} /> {by('revisi').length} Revisi</li><li><i style={{ background: '#b4121f' }} /> {by('ditolak').length} Ditolak</li>
          </ul>
          <Link to={`${BASE}/riwayat`} className="u-link">Lihat Riwayat Audit <ArrowRight size={13} /></Link>
        </section>
        <section className="card">
          <div className="bk-sec-head tight"><h2>Tren Alur Pengajuan</h2><TrendingUp size={18} /></div>
          <p className="u-hint">Puncak volume anggaran per bulan (Jan – Apr 2025).</p>
          <div className="wr2-chart">{TREND.map(([m, v]) => (<div key={m}><b>{v}M</b><i style={{ height: `${(v / maxTrend) * 100}%` }} /><span>{m}</span></div>))}</div>
          <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Rata-rata/Bulan</span><b>Rp 460,5 Jt</b></p>
        </section>
      </div>

      <section className="u-note" style={{ display: 'block', background: '#e3ebfb' }}>
        <h2 className="u-h2"><Lightbulb size={20} /> Catatan Strategis Kebijakan Wakil Rektor II <span className="u-badge u-badge-sky">Prioritas Rapat Pimpinan</span></h2>
        <div className="u-grid-2">
          <div className="card"><b><CheckCircle2 size={15} /> Apresiasi Kinerja Serapan Tarbiyah & Keguruan (FTK)</b><p className="u-hint">FTK telah merealisasikan 70.7% pagu anggaran secara tertib administrasi LPJ. Menjadi rujukan kepatuhan format SBM bagi unit lain pada pelaporan semester ini.</p></div>
          <div className="card"><b><AlertCircle size={15} /> Akselerasi Pengadaan Laboratorium FTIK & Sarpras</b><p className="u-hint">Pengadaan peralatan lab komputer dan perbaikan infrastruktur kampus teridentifikasi lambat cair. Tim BAAK & Sarpras diinstruksikan menuntaskan termin kontrak sebelum <b>30 April 2025</b>.</p></div>
        </div>
      </section>

      <section className="card">
        <div className="bk-sec-head tight">
          <div><h2>Matriks Ringkasan Anggaran per Unit Kerja</h2><p className="u-hint">Konsolidasi unit operasional, pagu alokasi RKAT, persetujuan pimpinan, serta sisa kas tersisa.</p></div>
          <div className="bk-sec-tools"><div className="u-iwrap"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari nama unit / prodi..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari unit" /></div><button type="button" className="u-btn u-btn-soft" onClick={() => window.print()}><Printer size={15} /> Cetak Ringkasan</button></div>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1000 }}>
            <thead><tr><th>Unit / Fakultas / Biro</th><th className="num">Pagu Awal</th><th className="num">Usulan Masuk</th><th className="num">Disetujui WR II</th><th className="num">Realisasi SP2D</th><th className="num">Sisa Pagu</th><th>Serapan</th><th>Status Kinerja</th><th>Aksi</th></tr></thead>
            <tbody>
              {view.map((u) => { const p = (u.real / u.pagu) * 100; return (
                <tr key={u.name}>
                  <td style={{ maxWidth: 260 }}><span className="bk-unit-tag">{u.code}</span> <b>{u.name}</b><span className="u-cell-sub">{u.fac} • Kode: {u.kode}</span></td>
                  <td className="num">{formatRupiah(u.pagu)}</td><td className="num">{formatRupiah(u.usul)}</td><td className="num strong">{formatRupiah(u.setuju)}</td><td className="num strong">{formatRupiah(u.real)}</td><td className="num">{formatRupiah(u.pagu - u.setuju)}</td>
                  <td style={{ minWidth: 110 }}><b>{p.toFixed(1)}%</b><div className="u-bar maroon"><i style={{ width: `${Math.min(100, p)}%` }} /></div></td>
                  <td><span className={`u-badge u-badge-${u.tone}`}>{u.status}</span></td>
                  <td><Link to={`${BASE}/laporan/${u.code}`} className="u-iconbtn" aria-label={`Detail ${u.name}`}><Eye size={17} /></Link></td>
                </tr>
              ); })}
            </tbody>
            <tfoot><tr><td>Total Konsolidasi Halaman Ini ({view.length} Unit)</td><td className="num">{formatRupiah(tot('pagu'))}</td><td className="num">{formatRupiah(tot('usul'))}</td><td className="num">{formatRupiah(tot('setuju'))}</td><td className="num">{formatRupiah(tot('real'))}</td><td className="num">{formatRupiah(tot('pagu') - tot('setuju'))}</td><td colSpan={3}>{tot('pagu') ? ((tot('real') / tot('pagu')) * 100).toFixed(1) : 0}% Avg</td></tr></tfoot>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Unit tidak ditemukan</strong>Coba kata kunci lain.</div>}
        </div>
        <div className="u-tfoot-bar"><span>Menampilkan {view.length} dari {rows.length} unit kerja aktif TA 2024/2025</span><BigPager page={cur} pageCount={pageCount} onChange={setPage} /></div>
      </section>

      <section className="card u-form-foot">
        <div><b>Pemberian Otorisasi Eksekutif (Paraf Elektronik)</b><p className="u-hint" style={{ margin: 0 }}>Dokumen laporan keuangan ini disahkan oleh <b>Dr. H. M. Alfian, M.Si</b> (Wakil Rektor II) menggunakan tanda tangan bersertifikat BSrE.</p></div>
        <div className="u-foot-actions"><Link to={`${BASE}/riwayat`} className="u-btn u-btn-soft">Riwayat Persetujuan</Link><button type="button" className="u-btn u-btn-primary" onClick={() => setFinalOpen(true)}>Validasi Final RKAT</button></div>
      </section>

      <Modal open={cmp} title="Bandingkan Periode" onClose={() => setCmp(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setCmp(false)}>Tutup</button>}>
        <table className="u-table" style={{ minWidth: 0 }}>
          <thead><tr><th>Indikator</th><th className="num">Genap 2024/2025</th><th className="num">Ganjil 2023/2024</th></tr></thead>
          <tbody><tr><td>Pagu diajukan</td><td className="num">Rp 1.842,0 M</td><td className="num">Rp 1.710,0 M</td></tr><tr><td>Disetujui WR II</td><td className="num">Rp 1.565,3 M</td><td className="num">Rp 1.402,0 M</td></tr><tr><td>Realisasi SP2D</td><td className="num">Rp 1.280,0 M</td><td className="num">Rp 1.190,0 M</td></tr></tbody>
        </table>
        <p className="u-hint">Data periode ganjil adalah contoh.</p>
      </Modal>
      <Modal open={finalOpen} title="Validasi Final RKAT" onClose={() => setFinalOpen(false)} footer={<><button type="button" className="u-btn u-btn-outline" onClick={() => setFinalOpen(false)}>Batal</button><button type="button" className="u-btn u-btn-primary" onClick={() => { setFinalOpen(false); setOtp(true); }}>Lanjut ke OTP</button></>}>
        <p>Validasi final akan mengunci RKAT TA 2024/2025 Genap untuk perubahan lebih lanjut dan mencatatnya di log audit. Lanjutkan?</p>
      </Modal>
      <OtpModal open={otp} onClose={() => setOtp(false)} onVerified={() => { setOtp(false); toast.push('Validasi final RKAT berhasil disimpan di database.'); }} />
    </div>
  );
}