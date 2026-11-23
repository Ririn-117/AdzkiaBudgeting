import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, FolderOpen, Gavel, Network, Search, ShieldCheck, SlidersHorizontal, Timer, User } from 'lucide-react';
import { useWr2 } from '../../context/Wr2Context';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { BASE, FAC_PAGU, POS } from '../../data/wr2Data';
import { BigPager, fmtJt, sum, uniq } from '../../components/wr2/shared';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

const PAGE = 6;
const TABS = [['all', 'Semua Pengajuan', null], ['menunggu', 'Menunggu Otorisasi WR II', 'menunggu'], ['disetujui', 'Telah Disetujui', 'disetujui'], ['revisi', 'Perlu Revisi / Dikembalikan', 'revisi'], ['ditolak', 'Ditolak Definitif', 'ditolak']];

export default function Wr2Semua() {
  const toast = useToast();
  const { submissions } = useWr2();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t[0] === params.get('tab')) ? params.get('tab') : 'all';
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('');
  const [fund, setFund] = useState('');
  const [adv, setAdv] = useState(false);
  const [page, setPage] = useState(1);
  const [tteOpen, setTteOpen] = useState(false);

  const by = (s) => submissions.filter((x) => x.stage === s);
  const count = (stage) => (stage ? by(stage).length : submissions.length);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const stage = TABS.find((x) => x[0] === tab)[2];
    return submissions.filter((s) => (!stage || s.stage === stage) && (!t || `${s.id} ${s.title} ${s.pic}`.toLowerCase().includes(t)) && (!unit || s.unit === unit) && (!fund || s.fund === fund));
  }, [submissions, tab, q, unit, fund]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const cur = Math.min(page, pageCount);
  const view = rows.slice((cur - 1) * PAGE, cur * PAGE);
  const exportCsv = () => {
    downloadCsv('Matriks_Rekapitulasi_WR2.csv', [['No. Usulan', 'Unit', 'Kegiatan', 'PIC', 'Total', 'Sumber Dana', 'Posisi'], ...rows.map((s) => [s.id, s.unit, s.title, s.pic, s.amount, s.fund, POS[s.stage].label])]);
    toast.push(`${rows.length} usulan diekspor ke CSV.`);
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Persetujuan Anggaran' }, { label: 'Semua Pengajuan' }]}
        title="Semua Pengajuan Anggaran Universitas Adzkia"
        actions={<>
          <button type="button" className="u-btn u-btn-soft" onClick={() => setAdv((v) => !v)}><SlidersHorizontal size={15} /> Filter Kustom</button>
          <button type="button" className="u-btn u-btn-navy" onClick={exportCsv}><Download size={15} /> Unduh Matriks Rekapitulasi</button>
        </>}
      />

      <div className="u-sum-grid cols-4">
        <div className="u-sum u-sum-slate"><div className="u-sum-top"><span>Total Usulan Masuk</span><FolderOpen size={19} /></div><p className="u-sum-value">{submissions.length} <small>Berkas</small></p><p className="u-sum-sub">Nilai Bruto <b>{formatRupiah(sum(submissions, 'amount'))}</b></p></div>
        <div className="u-sum u-sum-maroon"><div className="u-sum-top"><span>Menunggu Otorisasi WR II</span><Gavel size={19} /></div><p className="u-sum-value">{count('menunggu')} <small>Berkas Siap Putus</small></p><p className="u-sum-sub">Komitmen Tertunda <b>{formatRupiah(sum(by('menunggu'), 'amount'))}</b></p></div>
        <div className="u-sum u-sum-navy"><div className="u-sum-top"><span>Telah Disetujui WR II</span><CheckCircle2 size={19} /></div><p className="u-sum-value">{count('disetujui')} <small>SK Terbit</small></p><p className="u-sum-sub">Alokasi Sah Terbit <b>{formatRupiah(sum(by('disetujui'), 'amount'))}</b></p></div>
        <div className="u-sum u-sum-rose"><div className="u-sum-top"><span>Proses di Bawah WR II</span><Network size={19} /></div><p className="u-sum-value">{count('revisi') + count('ditolak')} <small>Unit / BKPU</small></p><p className="u-sum-sub">Dalam Verifikasi/Revisi <b>{formatRupiah(sum(by('revisi'), 'amount') + sum(by('ditolak'), 'amount'))}</b></p></div>
      </div>

      <section className="card">
        <div className="u-tabs" role="tablist">
          {TABS.map(([k, label, stage]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={`u-tab ${tab === k ? 'on maroon' : ''}`} onClick={() => { setParams(k === 'all' ? {} : { tab: k }); setPage(1); }}>{label} <em className={k !== 'all' && tab !== k ? 'alert' : ''}>{count(stage)}</em></button>
          ))}
        </div>
        <div className="u-filters" style={{ marginTop: '0.8rem' }}>
          <div className="u-iwrap grow"><Search size={17} className="ic" /><input className="u-input has-ic" placeholder="Cari nomor usulan, nama kegiatan, atau nama PIC" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Cari" /></div>
          <select className="u-select" style={{ width: 'auto' }} value={unit} onChange={(e) => { setUnit(e.target.value); setPage(1); }} aria-label="Unit"><option value="">Semua Unit / Fakultas</option>{uniq(submissions, 'unit').map((u) => <option key={u}>{u}</option>)}</select>
          <select className="u-select" style={{ width: 'auto' }} value={fund} onChange={(e) => { setFund(e.target.value); setPage(1); }} aria-label="Sumber dana"><option value="">Semua Sumber Dana</option>{uniq(submissions, 'fund').map((u) => <option key={u}>{u}</option>)}</select>
        </div>
        {adv && <p className="u-hint" style={{ marginTop: '0.6rem' }}>Filter kustom lanjutan (rentang tanggal & nominal) menyusul saat data tersambung ke server.</p>}
      </section>

      <section className="card">
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 980 }}>
            <thead><tr><th>No. Usulan & Tgl</th><th>Unit Pemohon</th><th>Nama Kegiatan & PIC</th><th className="num">Total Usulan</th><th>Posisi Berkas</th></tr></thead>
            <tbody>
              {view.map((s) => (
                <tr key={s.id} className={s.stage === 'menunggu' || s.stage === 'ditolak' ? 'row-err' : ''}>
                  <td><Link to={`${BASE}/pengajuan/${s.id}`} className="u-id maroon">{s.id}</Link><span className="u-cell-sub">{s.date}</span></td>
                  <td><span className="bk-unit-tag">{s.unit}</span><span className="u-cell-sub">{s.faculty}</span></td>
                  <td style={{ maxWidth: 320 }}><span className="u-cell-title">{s.title}</span><span className="u-cell-sub"><User size={12} /> {s.pic}</span></td>
                  <td className="num strong" style={s.stage === 'ditolak' ? { textDecoration: 'line-through', color: '#b4121f' } : undefined}>{formatRupiah(s.amount)}<span className="u-cell-sub">{s.fund}</span></td>
                  <td><span className={`u-badge u-badge-${POS[s.stage].tone}`}>{POS[s.stage].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 && <div className="u-empty"><strong>Tidak ada pengajuan</strong>Ubah filter untuk melihat data lain.</div>}
        </div>
        <div className="u-tfoot-bar"><span>Menampilkan <b>{rows.length ? 1 + (cur - 1) * PAGE : 0} - {Math.min(cur * PAGE, rows.length)}</b> dari <b>{rows.length}</b> total pengajuan • Halaman {cur} dari {pageCount}</span><BigPager page={cur} pageCount={pageCount} onChange={setPage} /></div>
      </section>

      <div className="wr2-three">
        <section className="card">
          <div className="bk-sec-head tight"><h2>Pagu Berdasarkan Fakultas</h2><span className="u-hint">TA 24/25</span></div>
          {FAC_PAGU.map(([name, p, real]) => (<div key={name} className="wr2-fac"><p><b>{name}</b><b>{real} ({p}%)</b></p><div className="u-bar maroon"><i style={{ width: `${p}%` }} /></div></div>))}
          <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Terplot APBU</span><b>{fmtJt(sum(submissions, 'amount'))}</b></p>
        </section>
        <section className="card">
          <div className="bk-sec-head tight"><h2><Timer size={20} /> SLA Pemrosesan WR II</h2><span className="u-badge u-badge-sky">Target: ≤ 48 Jam</span></div>
          <div className="wr2-kpis"><div><b>14.2</b><span>JAM RERATA RESPON</span></div><div><b>98.4%</b><span>KEPATUHAN WAKTU</span></div></div>
          <p className="bk-note-box">{count('menunggu')} berkas menunggu keputusan saat ini telah masuk rata-rata 18 jam lalu dari telaah BKPU.</p>
        </section>
        <section className="card">
          <div className="bk-sec-head tight"><h2><ShieldCheck size={20} /> Integritas Otorisasi Digital</h2><span className="u-badge u-badge-sky">BSrE Aktif</span></div>
          <p className="u-hint">Seluruh penerbitan Surat Keputusan (SK) dan lembar disposisi pimpinan terenkripsi menggunakan sertifikat elektronik resmi Universitas Adzkia Padang.</p>
          <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total SK Diterbitkan Musim Ini:</span><b>{count('disetujui')} Berkas</b></p>
          <p className="u-hint" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Status Token TTE WR II:</span><b style={{ color: '#2447a3' }}>Siap Digunakan</b></p>
          <button type="button" className="u-btn u-btn-soft u-btn-block" onClick={() => setTteOpen(true)}><ShieldCheck size={15} /> Cek Log Verifikasi TTE</button>
        </section>
      </div>

      <Modal open={tteOpen} title="Log Verifikasi TTE" onClose={() => setTteOpen(false)} footer={<button type="button" className="u-btn u-btn-primary" onClick={() => setTteOpen(false)}>Tutup</button>}>
        <p className="u-hint">Sertifikat: BSrE - BSSN RI, berlaku hingga 14 Nov 2026. Integritas kriptografi RSA 4096-bit valid.</p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem' }}>{by('disetujui').filter((s) => s.sk).slice(0, 6).map((s) => <li key={s.id}>SK {s.sk} — {s.id} ({s.decidedAt})</li>)}</ul>
      </Modal>
    </div>
  );
}