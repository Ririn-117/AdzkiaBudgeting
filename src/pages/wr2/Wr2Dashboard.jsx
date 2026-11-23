import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BellRing, CheckCircle2, ClipboardCheck, Printer, RotateCcw, ShieldCheck, SlidersHorizontal, Wallet } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { BASE, FAC_PAGU, OTP_THRESHOLD, TA, WR2 } from '../../data/wr2Data';
import { sum } from '../../components/wr2/shared';
import SummaryCard from '../../components/ui/SummaryCard';
import Modal from '../../components/ui/Modal';

export default function Wr2Dashboard() {
  const { submissions, queue, logs } = useWr2();
  const [ambang, setAmbang] = useState(false);
  const by = (s) => submissions.filter((x) => x.stage === s);
  const ok = by('disetujui'), fix = by('revisi'), rej = by('ditolak');
  const late = queue.filter((s) => s.wait >= 2).length;
  const total = submissions.length || 1;
  const pct = (n) => Math.round((n / total) * 100);
  const prio = [...queue].sort((a, b) => b.wait - a.wait).slice(0, 2);
  const stack = [['#3f5a8a', ok.length], ['#7a0c16', queue.length], ['#9bb5ee', fix.length], ['#b4121f', rej.length]];

  return (
    <div className="upage">
      <section className="card bk-hero">
        <div>
          <div className="bk-chips">
            <span className="bk-pill"><ShieldCheck size={14} /> Portal Otorisator Utama</span>
            <span className="bk-pill ghost">SK Rektorat No. 001/SK-PIMP/UA/2024</span>
          </div>
          <p className="u-hint" style={{ margin: '0.6rem 0 0' }}>Batas Otorisasi: &gt; Rp {new Intl.NumberFormat('id-ID').format(OTP_THRESHOLD)}</p>
          <h1>Selamat Datang, {WR2.name}</h1>
          <p style={{ margin: 0, color: '#475569', maxWidth: 640 }}>Pusat Otorisasi & Disposisi Anggaran Operasional & Investasi {TA}. Evaluasi keselarasan pagu SBM, telaah BKPU, serta validasi likuiditas yayasan secara akuntabel.</p>
        </div>
        <div className="u-ph-actions">
          <button type="button" className="u-btn u-btn-soft" onClick={() => window.print()}><Printer size={15} /> Cetak Ringkasan Eksekutif</button>
          <button type="button" className="u-btn u-btn-navy" onClick={() => setAmbang(true)}><SlidersHorizontal size={15} /> Ambang Otorisasi</button>
        </div>
      </section>

      <div className="u-sum-grid cols-4">
        <SummaryCard tone="maroon" label="Menunggu Keputusan" icon={ClipboardCheck} value={`${queue.length} Pengajuan Unit`} sub={`Nominal tertahan: ${formatRupiah(sum(queue, 'amount'))}`}>
          <p className="u-sum-sub"><b style={{ color: '#b4121f' }}>{late} Usulan &gt; 48 Jam</b> • <Link to={`${BASE}/menunggu`} className="u-link">Periksa List <ArrowRight size={12} /></Link></p>
        </SummaryCard>
        <SummaryCard tone="blue" label="Disetujui Periode Ini" icon={CheckCircle2} value={`${ok.length} Kegiatan Lolos`} sub={formatRupiah(sum(ok, 'amount'))}>
          <p className="u-sum-sub">SK Terbit / Siap Kasir • <b>94.2% Tepat SBM</b></p>
        </SummaryCard>
        <SummaryCard tone="slate" label="Perlu Revisi / Retur" icon={RotateCcw} value={`${fix.length} Pengajuan`} sub={formatRupiah(sum(fix, 'amount'))}>
          <p className="u-sum-sub">Koreksi Volume & KAK • Tenggat 7 Hari</p>
        </SummaryCard>
        <SummaryCard tone="navy" label="Serapan Pagu RKAT" icon={Wallet} value="Rp 2,45 M" sub="terealisasi">
          <div className="u-bar"><i style={{ width: '64.2%' }} /></div>
          <p className="u-sum-sub">64.2% • Pagu Total Rp 3.820.000.000 • Sisa Rp 1,37 M</p>
        </SummaryCard>
      </div>

      {prio.length > 0 && (
        <section className="bk-alert">
          <span className="bk-alert-icon"><BellRing size={22} /></span>
          <div>
            <p><span className="u-badge u-badge-maroon">PRIORITAS EKSEKUTIF SEGERA</span> <b>{prio.length} Pengajuan Melampaui SLA Standar WR2</b></p>
            <p className="bk-alert-text">{prio.map((s) => s.id).join(' & ')} Siap Otorisasi Final</p>
          </div>
          {prio.map((s, i) => (
            <Link key={s.id} to={`${BASE}/pengajuan/${s.id}`} className={`u-btn ${i === 0 ? 'u-btn-primary' : 'u-btn-navy'}`}>
              {s.unit} • {formatRupiah(s.amount)} — {i === 0 ? 'Disposisi Sekarang' : 'Tinjau Berkas'}
            </Link>
          ))}
        </section>
      )}

      <div className="bk-two">
        <section className="card">
          <div className="bk-sec-head tight">
            <div><h2><ClipboardCheck size={20} /> Daftar Pengajuan Menunggu Keputusan WR2</h2><p className="u-hint">Urutan berdasarkan urgensi pelaksanaan kegiatan dan lama tunggu telaah di meja pimpinan.</p></div>
            <span className="u-badge u-badge-sky">Total {queue.length} Usulan Tertunda</span>
          </div>
          <div className="u-scroll">
            <table className="u-table" style={{ minWidth: 760 }}>
              <thead><tr><th>No. Usulan & Unit</th><th>Nama Kegiatan & Kategori</th><th className="num">Total Anggaran</th><th>Verifikasi BKPU</th><th>Lama Tunggu</th><th>Aksi Disposisi</th></tr></thead>
              <tbody>
                {[...queue].sort((a, b) => b.wait - a.wait).map((s) => (
                  <tr key={s.id}>
                    <td><span className="u-id">{s.id}</span><span className="u-cell-sub">{s.unit} - {s.fc}</span><span className="u-badge u-badge-sky">{s.category}</span></td>
                    <td style={{ maxWidth: 260 }}><span className="u-cell-title">{s.title}</span><span className="u-cell-sub">Pelaksanaan: {s.entry}</span></td>
                    <td className="num strong">{formatRupiah(s.amount)}<span className="u-cell-sub">{s.mak.replace('MAK: ', 'Pos Akun ')}</span></td>
                    <td><span className="u-badge u-badge-green"><CheckCircle2 size={12} /> SBM Sesuai</span><span className="u-cell-sub">Telaah BKPU Clear</span></td>
                    <td><span className={`u-badge ${s.wait >= 2 ? 'u-badge-red' : 'u-badge-sky'}`}>{s.wait} Hari</span></td>
                    <td><Link to={`${BASE}/pengajuan/${s.id}`} className="u-btn u-btn-primary u-btn-sm">Tinjau Usulan</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {queue.length === 0 && <div className="u-empty"><strong>Tidak ada antrean</strong>Semua usulan telah diputuskan.</div>}
          </div>
          <div className="u-tfoot-bar">
            <span>Total Anggaran Tertahan: <b>{formatRupiah(sum(queue, 'amount'))}</b> • {queue.length} Kegiatan Terpilih</span>
            <Link to={`${BASE}/menunggu`} className="u-link">Buka Konsol Disposisi Multi-Pengajuan <ArrowRight size={13} /></Link>
          </div>
        </section>

        <aside className="bk-col">
          <section className="card">
            <div className="bk-sec-head tight"><h2>Serapan Pagu Fakultas</h2><span className="u-badge u-badge-sky">Genap</span></div>
            {FAC_PAGU.map(([name, p, real, pagu]) => (
              <div key={name} className="wr2-fac">
                <p><b>{name}</b><b>{p}%</b></p>
                <div className="u-bar"><i style={{ width: `${p}%` }} /></div>
                <small>Terserap: {real} <span>Pagu: {pagu}</span></small>
              </div>
            ))}
            <Link to={`${BASE}/laporan`} className="u-btn u-btn-soft u-btn-block">Lihat Analitik Ledger Lengkap</Link>
          </section>

          <section className="card">
            <h2 className="u-h2">Komposisi Pengajuan</h2>
            <div className="wr2-stack">{stack.map(([c, n]) => <i key={c} style={{ background: c, width: `${pct(n)}%` }} />)}</div>
            <ul className="wr2-legend">
              <li><i style={{ background: '#3f5a8a' }} /> Disetujui <b>{ok.length} Usulan ({pct(ok.length)}%)</b></li>
              <li><i style={{ background: '#7a0c16' }} /> Menunggu <b>{queue.length} Usulan ({pct(queue.length)}%)</b></li>
              <li><i style={{ background: '#9bb5ee' }} /> Perlu Revisi <b>{fix.length} Usulan ({pct(fix.length)}%)</b></li>
              <li><i style={{ background: '#b4121f' }} /> Ditolak <b>{rej.length} Usulan ({pct(rej.length)}%)</b></li>
            </ul>
          </section>

          <section className="card">
            <div className="bk-sec-head tight"><h2>Log Disposisi WR2</h2><span className="u-hint"><i className="bk-live-dot" /> Real-time</span></div>
            <ul className="u-timeline">
              {logs.slice(0, 3).map((l) => (
                <li key={l.id} className={l.tone === 'maroon' ? 'tl-maroon' : ''}>
                  <i />
                  <div><div className="u-tl-head"><strong>{l.title}</strong><time>{l.time}</time></div><p>{l.text}</p></div>
                </li>
              ))}
            </ul>
            <Link to={`${BASE}/riwayat`} className="u-btn u-btn-soft u-btn-block">Buka Seluruh Riwayat Disposisi</Link>
          </section>
        </aside>
      </div>

      <Modal open={ambang} title="Ambang Otorisasi" onClose={() => setAmbang(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setAmbang(false)}>Tutup</button>}>
        <table className="u-table" style={{ minWidth: 0 }}>
          <thead><tr><th>Nilai Usulan</th><th>Ketentuan</th></tr></thead>
          <tbody>
            <tr><td>Sampai Rp 20.000.000</td><td>Diputuskan WR II (TTE)</td></tr>
            <tr><td>&gt; Rp 20.000.000</td><td>WR II + verifikasi OTP</td></tr>
            <tr><td>&gt; Rp 100.000.000</td><td>Paraf pengantar WR II + keputusan Rektor</td></tr>
          </tbody>
        </table>
      </Modal>
    </div>
  );
}