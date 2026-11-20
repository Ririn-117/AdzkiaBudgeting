import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BellRing, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, Download, Eye, Hourglass, History,
  ListChecks, RefreshCw, Search, ShieldCheck, SlidersHorizontal, Timer, Wallet, FileCheck2, FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBkpu } from '../../context/BkpuContext';
import { formatRupiah } from '../../utils/format';
import { BASE, LPJ_STAGE_META, PAGU_UNIVERSITAS, RESULT_META, STAGE_META, TA } from '../../data/bkpuData';
import { Donut, DocChip, SlaChip, sum } from '../../components/bkpu/shared';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';

export default function BkpuDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const { queue, lpjQueue, submissions, lpjs, logs } = useBkpu();
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('sla');

  const wr2 = submissions.filter((s) => s.stage === 'wr2');
  const fix = submissions.filter((s) => s.stage === 'perbaikan');
  const lpjFix = lpjs.filter((l) => l.stage === 'revisi');
  const queueSum = sum(queue, 'amount');
  const nearSla = queue.filter((s) => s.slaDay >= 3).length;
  const passPct = wr2.length + queue.length ? ((wr2.length / (wr2.length + queue.length)) * 100).toFixed(1) : '0';
  const donePct = submissions.length ? Math.round((wr2.length / submissions.length) * 100) : 0;

  const priority = useMemo(
    () => [...queue].sort((a, b) => (b.resubmit ? 4 : b.slaDay) - (a.resubmit ? 4 : a.slaDay)).slice(0, 2),
    [queue]
  );

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return queue
      .filter((s) => !term || `${s.id} ${s.unit} ${s.title}`.toLowerCase().includes(term))
      .sort((a, b) => (sortBy === 'sla' ? b.slaDay - a.slaDay : b.amount - a.amount));
  }, [queue, q, sortBy]);

  const lpjRows = [lpjs.find((l) => l.stage === 'antrean'), lpjs.find((l) => l.stage === 'revisi')].filter(Boolean);

  const stats = [
    { tone: 'maroon', label: 'Menunggu Verifikasi', icon: ClipboardCheck, big: queue.length, unit: 'Berkas', value: formatRupiah(queueSum), foot: [`${nearSla} Mendekati SLA`, 'Antrean RKAT'] },
    { tone: 'slate', label: 'Telah Diverifikasi', icon: CheckCircle2, big: wr2.length, unit: 'Berkas', value: formatRupiah(sum(wr2, 'amount')), foot: ['Telah diteruskan ke WR2', `${passPct}% Lolos`] },
    { tone: 'maroon', label: 'Perlu Revisi Unit', icon: ListChecks, big: fix.length, unit: 'Berkas', value: formatRupiah(sum(fix, 'amount')), foot: ['Menunggu Pemohon', 'SBM / Rincian'] },
    { tone: 'navy', label: 'Nilai Anggaran Telaah', icon: Wallet, value: formatRupiah(queueSum), sub: `${queue.length} usulan aktif dalam antrean telaah`, foot: ['Fisibilitas Kas', `${((queueSum / PAGU_UNIVERSITAS) * 100).toFixed(1)}% Pagu`] },
    { tone: 'blue', label: 'LPJ Masuk', icon: FileCheck2, big: lpjQueue.length, unit: 'LPJ', value: formatRupiah(sum(lpjQueue, 'real')), foot: ['Uji Kuitansi', 'Tahap 1 Audit'] },
    { tone: 'rose', label: 'LPJ Belum Lengkap', icon: FileText, big: lpjFix.length, unit: 'LPJ', sub: 'Cap basah & faktur pajak', link: [`${BASE}/lpj?tab=revisi`, 'Perlu Komunikasi'] },
  ];

  return (
    <div className="upage">
      <section className="card bk-hero">
        <div>
          <div className="bk-chips">
            <span className="bk-pill">Biro Keuangan dan Perencanaan Universitas (BKPU)</span>
            <span className="bk-pill ghost"><ShieldCheck size={14} /> Otoritas Verifikasi Administrasi & Kelayakan</span>
          </div>
          <h1>Selamat Bertugas, {user?.name}</h1>
          <p className="bk-hero-meta">
            <CalendarDays size={14} /> Periode Verifikasi: <b>{TA}</b>
            <span className="sep">•</span><RefreshCw size={14} /> Siklus Anggaran: <b>Masa Verifikasi Usulan & Telaah LPJ</b>
          </p>
          <p className="bk-hero-meta"><RefreshCw size={14} /> Sinkronisasi SIAKAD & ERP: <b>Hari ini, 08:30 WIB</b></p>
        </div>
        <div className="bk-sla-card">
          <Timer size={26} />
          <div>
            <span><i /> STANDAR SLA UNIVERSITAS</span>
            <strong>Maksimal 3 Hari Kerja</strong>
            <small>Per berkas RKAT & Dokumen LPJ</small>
          </div>
        </div>
      </section>

      <section className="bk-stat-grid">
        {stats.map((s) => (
          <div key={s.label} className={`bk-stat t-${s.tone}`}>
            <div className="bk-stat-top"><span>{s.label}</span><s.icon size={19} /></div>
            {s.big !== undefined && <p className="bk-stat-big">{s.big} <small>{s.unit}</small></p>}
            {s.value && <p className={s.big !== undefined ? 'bk-stat-val' : 'bk-stat-big sm'}>{s.value}</p>}
            {s.sub && <p className="bk-stat-sub">{s.sub}</p>}
            {s.foot && <p className="bk-stat-foot"><b>{s.foot[0]}</b><span>{s.foot[1]}</span></p>}
            {s.link && <Link to={s.link[0]} className="bk-stat-foot link"><b>{s.link[1]}</b><ArrowRight size={14} /></Link>}
          </div>
        ))}
      </section>

      {priority.length > 0 && (
        <section className="bk-alert">
          <span className="bk-alert-icon"><BellRing size={22} /></span>
          <div>
            <p><strong>Perhatian Khusus SLA BKPU:</strong> <span className="u-badge u-badge-maroon">{priority.length} Berkas Prioritas Tinggi</span></p>
            <p className="bk-alert-text">Terdapat pengajuan yang mendekati batas waktu audit verifikasi (maks 3 hari kerja). Segera lakukan pemeriksaan kelayakan atau terbitkan catatan perbaikan.</p>
            <div className="bk-alert-list">
              {priority.map((s) => (
                <Link key={s.id} to={`${BASE}/pengajuan/${s.id}`}>
                  <i /> <b>{s.id}</b> ({s.title.length > 28 ? `${s.title.slice(0, 28)}…` : s.title}) <em>• {s.resubmit ? 'Revisi masuk hari ini' : `Antrean Hari ke-${s.slaDay}`}</em>
                </Link>
              ))}
            </div>
          </div>
          <Link to={`${BASE}/pengajuan/${priority[0].id}`} className="u-btn u-btn-primary"><ListChecks size={15} /> Periksa Sekarang</Link>
        </section>
      )}

      <div className="bk-two">
        <div className="bk-col">
          <section className="card">
            <div className="bk-sec-head">
              <div>
                <h2><ClipboardCheck size={20} /> Pengajuan Anggaran Menunggu Telaah BKPU</h2>
                <p className="u-hint">Daftar usulan kegiatan RKAT dari program studi dan unit kerja yang memerlukan verifikasi administrasi</p>
              </div>
              <div className="bk-sec-tools">
                <div className="u-iwrap"><Search size={16} className="ic" /><input className="u-input has-ic" placeholder="Cari unit atau kode..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari usulan" /></div>
                <button type="button" className="u-btn u-btn-soft" onClick={() => setSortBy((v) => (v === 'sla' ? 'nominal' : 'sla'))}><SlidersHorizontal size={15} /> {sortBy === 'sla' ? 'Urut: SLA' : 'Urut: Nominal'}</button>
              </div>
            </div>
            <div className="u-scroll">
              <table className="u-table" style={{ minWidth: 820 }}>
                <thead><tr><th>No. & Unit Pengusul</th><th>Nama Kegiatan & Akun</th><th className="num">Total Anggaran</th><th>Tgl Masuk / SLA</th><th>Status Verifikasi</th><th>Aksi</th></tr></thead>
                <tbody>
                  {rows.slice(0, 4).map((s) => (
                    <tr key={s.id} className={s.slaDay >= 3 || s.resubmit ? 'row-err' : ''}>
                      <td><span className={`u-id ${s.resubmit ? 'maroon' : ''}`}>{s.id}</span><span className="u-cell-sub"><b>{s.unit}</b><br />{s.faculty}</span></td>
                      <td style={{ maxWidth: 240 }}><span className="u-cell-title">{s.title}</span><span className="u-cell-sub">{s.category}</span></td>
                      <td className="num strong">{formatRupiah(s.amount)}<span className="u-cell-sub">{s.docs[1]} Komponen Biaya</span></td>
                      <td>{s.date}<br /><SlaChip day={s.resubmit ? 1 : s.slaDay} /></td>
                      <td>
                        {s.resubmit ? <StatusBadge tone="blue">Resubmit Revisi</StatusBadge>
                          : <StatusBadge tone={STAGE_META[s.stage].tone}>{s.slaDay >= 3 ? 'Antrean Verifikasi' : STAGE_META[s.stage].label}</StatusBadge>}
                      </td>
                      <td>
                        <Link to={`${BASE}/pengajuan/${s.id}`} className={`u-btn u-btn-sm ${s.resubmit || s.slaDay >= 3 ? 'u-btn-primary' : s.stage === 'ditelaah' ? 'u-btn-navy' : 'u-btn-soft'}`}>
                          {s.stage === 'ditelaah' ? 'Lanjutkan' : <><Eye size={14} /> Telaah</>}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <div className="u-empty"><strong>Tidak ada usulan</strong>Antrean kosong atau kata kunci tidak cocok.</div>}
            </div>
            <div className="u-tfoot-bar">
              <span>Menampilkan {Math.min(4, rows.length)} dari {queue.length} pengajuan aktif menunggu telaah</span>
              <Link to={`${BASE}/verifikasi`} className="u-link">Lihat Semua Antrean Verifikasi <ArrowRight size={13} /></Link>
            </div>
          </section>

          <section className="card">
            <div className="bk-sec-head">
              <div>
                <h2><FileCheck2 size={20} /> Pemeriksaan Laporan Pertanggungjawaban (LPJ)</h2>
                <p className="u-hint">Verifikasi kelengkapan kuitansi pengeluaran, faktur pajak, dan bukti riil sebelum tutup buku kegiatan</p>
              </div>
              <span className="bk-pill ghost"><FileText size={14} /> Total {lpjQueue.length} Dokumen LPJ Menunggu</span>
            </div>
            <div className="u-scroll">
              <table className="u-table" style={{ minWidth: 820 }}>
                <thead><tr><th>No. LPJ & Unit</th><th>Nama Kegiatan</th><th className="num">Dana Disetujui</th><th className="num">Realisasi Dilaporkan</th><th>Status Kelengkapan Bukti</th><th>Aksi</th></tr></thead>
                <tbody>
                  {lpjRows.map((l) => (
                    <tr key={l.id}>
                      <td><span className="u-id">{l.id}</span><span className="u-cell-sub"><b>{l.unit}</b><br />Tanggal: {l.date}</span></td>
                      <td style={{ maxWidth: 220 }}><span className="u-cell-title">{l.title}</span><span className="u-cell-sub">Ref: {l.ref}</span></td>
                      <td className="num">{formatRupiah(l.pagu)}</td>
                      <td className="num strong">{formatRupiah(l.real)}<span className="u-cell-sub">{l.silpa ? `Sisa Kas: ${formatRupiah(l.silpa)}` : 'Serap 100%'}</span></td>
                      <td>{l.fiscal.tone === 'warn'
                        ? <><StatusBadge tone="red">Perlu Kelengkapan</StatusBadge><span className="u-cell-sub" style={{ color: '#b4121f' }}>{l.fiscal.note}</span></>
                        : <><StatusBadge tone="sky" icon={CheckCircle2}>Lengkap 100%</StatusBadge><span className="u-cell-sub">Siap Uji Fisik Bukti</span></>}</td>
                      <td><Link to={`${BASE}/lpj/${l.id}`} className={`u-btn u-btn-sm ${l.stage === 'revisi' ? 'u-btn-soft' : 'u-btn-primary'}`}>{l.stage === 'revisi' ? 'Tinjau Catatan' : 'Periksa LPJ'}</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="u-tfoot-bar">
              <span>Menampilkan {lpjRows.length} dari {lpjQueue.length + lpjFix.length} berkas LPJ</span>
              <Link to={`${BASE}/lpj`} className="u-link">Lihat Semua Daftar LPJ Masuk <ArrowRight size={13} /></Link>
            </div>
          </section>
        </div>

        <aside className="bk-col">
          <section className="card">
            <div className="bk-sec-head tight">
              <h2><History size={20} /> Aktivitas Pemeriksaan</h2>
              <span className="bk-live">LIVE LOG</span>
            </div>
            <p className="u-hint">Catatan telaah, disposisi, dan umpan balik yang diterbitkan verifikator BKPU hari ini</p>
            <ul className="bk-feed">
              {logs.slice(0, 3).map((l) => (
                <li key={l.id}>
                  <div className="bk-feed-head"><b className={RESULT_META[l.result].tone}>{RESULT_META[l.result].label}</b><time>{l.date.split('• ')[1] ?? l.date}</time></div>
                  <p><b>{l.unit} ({l.ref ?? l.id}):</b> {l.note}</p>
                </li>
              ))}
            </ul>
            <Link to={`${BASE}/riwayat`} className="u-btn u-btn-soft u-btn-block">Buka Riwayat Audit & Telah Lengkap</Link>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2>Statistik Telaah TA Ini</h2><b className="bk-stat-total">{submissions.length} Berkas Masuk</b></div>
            <div className="bk-donut-row">
              <Donut percent={donePct} size={110} stroke={13} color="#161a77" track="#b4121f"><b>{donePct}%</b><small>SELESAI</small></Donut>
              <ul className="bk-legend">
                <li><i className="navy" /> Diteruskan ke WR2 <b>{wr2.length} Berkas</b></li>
                <li><i className="red" /> Menunggu Telaah <b>{queue.length} Berkas</b></li>
                <li><i className="red" /> Perlu Perbaikan Unit <b>{fix.length} Berkas</b></li>
              </ul>
            </div>
            <p className="bk-note-box"><ShieldCheck size={16} /> Rata-rata kecepatan verifikasi BKPU: <b>1.4 hari kerja</b> (Di bawah target SLA 3 hari).</p>
          </section>

          <section className="bk-sbm">
            <h3><BookOpen size={18} /> Rujukan SBM Aktif</h3>
            <p>Verifikasi wajib mengacu pada Keputusan Rektor Universitas Adzkia No. 14/SK/UA/2024 perihal Standar Satuan Biaya Perjalanan Dinas, Transport, dan Honorarium TA 2024/2025.</p>
            <div className="bk-sbm-links">
              <Link to={`${BASE}/panduan-sbm`}>Buka Tabel Plafon SBM 2025</Link>
              <button type="button" onClick={() => toast.push('Unduh PDF plafon SBM (simulasi, belum ada berkas dari server).')}><Download size={14} /> Revisi 02.2025</button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}