import { useMemo, useState } from 'react';
import { Download, FileBadge2, FileCheck2, FileText, Leaf, Printer, Search, Stamp } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { exportReportPdf } from '../../utils/rektorExport';
import { KPI, LA_DECISIONS, LA_MATRIX, LA_META, LA_PLAFON, LA_TOTAL } from '../../data/rektorData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { DonutChart, FilterSelect, Legend } from '../../components/rektor/RektorParts';

const pct = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 });
const TONE = { 'Sangat Tertib': 'green', Tertib: 'blue', 'Perlu Pendampingan': 'amber' };

export default function LaporanAnggaran() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [ta, setTa] = useState('TA 2024/2025 Genap (Aktif Berjalan)');
  const [satker, setSatker] = useState('Semua Satuan Kerja (Terkonsolidasi)');
  const [status, setStatus] = useState('Semua Status Keputusan');

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LA_MATRIX.filter((r) => {
      if (term && !`${r.name} ${r.sub}`.toLowerCase().includes(term)) return false;
      if (satker !== 'Semua Satuan Kerja (Terkonsolidasi)' && !r.name.includes(`(${satker})`)) return false;
      if (status === 'Menunggu Telaah') return r.disetujui === null;
      if (status === 'Disetujui SK') return r.disetujui !== null;
      return true;
    });
  }, [q, satker, status]);

  const exportCsv = () => {
    downloadCsv('Matriks_Kinerja_Anggaran.csv', [
      ['No', 'Satker', 'Berkas', 'Diajukan', 'Disetujui WR II', 'Rasio (%)', 'Efisiensi SBM', 'Realisasi Cair', 'Kepatuhan RKAT'],
      ...rows.map((r) => [r.no, r.name, r.berkas, r.diajukan, r.disetujui ?? 'Menunggu Telaah', r.rasio, r.efisiensi, r.cair ?? '', r.kepatuhan]),
      ['', 'Konsolidasi Universitas', LA_TOTAL.berkas, LA_TOTAL.diajukan, LA_TOTAL.disetujui, LA_TOTAL.rasio, LA_TOTAL.efisiensi, LA_TOTAL.cair, ''],
    ]);
    toast.push('Matriks lengkap diekspor (CSV, dapat dibuka di Excel).');
  };
  const exportPdf = () => {
    exportReportPdf({
      filename: 'Laporan_Konsolidasi_Anggaran.pdf',
      title: `Laporan Konsolidasi Anggaran Universitas • No. ${LA_META.noDokumen}`,
      subtitle: `TA 2024/2025 Genap • Keputusan Rektor No. ${LA_META.skRektor}`,
      head: ['No', 'Satker', 'Berkas', 'Diajukan', 'Disetujui WR II', 'Rasio', 'Efisiensi SBM', 'Realisasi Cair', 'Kepatuhan'],
      body: [
        ...LA_MATRIX.map((r) => [r.no, r.name, r.berkas, formatRupiah(r.diajukan), r.disetujui === null ? 'Menunggu Telaah' : formatRupiah(r.disetujui), `${pct(r.rasio)}%`, formatRupiah(r.efisiensi), r.cair === null ? '-' : formatRupiah(r.cair), r.kepatuhan]),
        ['', 'Konsolidasi Universitas', LA_TOTAL.berkas, formatRupiah(LA_TOTAL.diajukan), formatRupiah(LA_TOTAL.disetujui), `${pct(LA_TOTAL.rasio)}%`, formatRupiah(LA_TOTAL.efisiensi), formatRupiah(LA_TOTAL.cair), ''],
      ],
    });
    toast.push('Buku laporan resmi dicetak sebagai PDF.');
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Pengawasan' }, { label: 'Laporan Anggaran' }]}
        title="Laporan Konsolidasi Anggaran Universitas"
        accent
        badge={<span className="rk-doc-ref"><FileBadge2 size={13} /> Audit Finansial Rektorat • Dokumen Resmi No. {LA_META.noDokumen}</span>}
        actions={
          <>
            <button type="button" className="u-btn u-btn-primary" onClick={exportPdf}><Printer size={15} /> Cetak Buku Laporan Resmi (PDF)</button>
            <button type="button" className="u-btn u-btn-outline" onClick={exportCsv}><Download size={15} /> Ekspor Matriks Lengkap (.xlsx)</button>
          </>
        }
      />

      <section className="card">
        <div className="rk-filters cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <FilterSelect label="Tahun Anggaran & Semester" value={ta} onChange={setTa} options={['TA 2024/2025 Genap (Aktif Berjalan)']} />
          <FilterSelect label="Satuan Kerja / Fakultas" value={satker} onChange={setSatker} options={['Semua Satuan Kerja (Terkonsolidasi)', 'FTK', 'FTIK', 'FEBI', 'LPPM', 'BAAK']} />
          <FilterSelect label="Status Ketetapan RKAT" value={status} onChange={setStatus} options={['Semua Status Keputusan', 'Disetujui SK', 'Menunggu Telaah']} />
        </div>
      </section>

      <section className="u-sum-grid cols-4">
        <SummaryCard tone="green" label="Efisiensi SBM & Rasionalisasi" icon={Leaf} value={formatRupiah(KPI.efisiensiSbm)} sub="Anggaran kampus hemat">
          <p className="u-sum-sub"><span className="u-badge u-badge-green">+2,4% Optimal</span></p>
        </SummaryCard>
        <SummaryCard tone="navy" label="Total Usulan RKAT" icon={FileText} value={formatRupiah(KPI.usulan)} sub="Lintas fakultas & lembaga">
          <p className="u-sum-sub"><b>38 Berkas Diajukan</b></p>
        </SummaryCard>
        <SummaryCard tone="slate" label="Ketetapan Sah (WR II)" icon={Stamp} value={formatRupiah(KPI.disetujui)} sub="84,9% dari usulan">
          <p className="u-sum-sub"><b>28 SK Diterbitkan</b></p>
        </SummaryCard>
        <SummaryCard tone="maroon" label="Rata-rata per Program" icon={FileCheck2} value={formatRupiah(LA_META.rataRata)} sub="Standar baku belanja">
          <p className="u-sum-sub"><b>38 Indeks Kegiatan</b></p>
        </SummaryCard>
      </section>

      <section className="rk-grid-2 even">
        <div className="card">
          <div className="rk-sec-title">
            <div><h2>Rasio Keputusan RKAT</h2><p>Total 38 usulan • proporsi ketetapan final dan proses review di tingkat pimpinan rektorat.</p></div>
          </div>
          <div className="rk-donut-wrap">
            <DonutChart label="73,7%" sub="Lulus SK" segments={LA_DECISIONS.map((s) => ({ key: s.key, percent: s.percent, color: s.color }))} />
            <Legend items={LA_DECISIONS.map((s) => ({ key: s.key, color: s.color, label: `${s.label} (${s.count})`, value: `${String(s.percent).replace('.', ',')}% ${s.note}` }))} />
          </div>
        </div>

        <div className="card">
          <div className="rk-sec-title">
            <div><h2>Matriks Realisasi Terhadap Plafon Pagu</h2><p>Audit semester berjalan • perbandingan nilai disetujui sah WR II terhadap plafon pagu alokasi definitif per unit kerja utama.</p></div>
          </div>
          <div className="rk-plafon">
            {LA_PLAFON.map((p) => (
              <div key={p.name} className="rk-plafon-row">
                <div className="head">
                  <strong>{p.name}</strong>
                  <span>{formatRupiah(p.disetujui)} / Pagu {formatRupiah(p.pagu)}<b>{pct(p.percent)}%</b></span>
                </div>
                <div className="u-bar maroon"><i style={{ width: `${p.percent}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="rk-callout">
            <Stamp size={18} />
            <div>
              Seluruh alokasi tertuang dalam Keputusan Rektor No. {LA_META.skRektor}.
              <br /><span className="rk-pill-ok">Sisa cadangan pagu: {formatRupiah(LA_META.sisaCadangan)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="rk-sec-title">
          <div><h2>Matriks Kinerja Anggaran Satuan Kerja</h2><p>Data ketetapan pagu, persetujuan, efisiensi SBM, dan realisasi disbursement.</p></div>
          <div className="u-iwrap" style={{ minWidth: 240 }}>
            <Search size={15} className="ic" />
            <input className="u-input has-ic" placeholder="Cari unit kerja..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari unit kerja" />
          </div>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1100 }}>
            <thead>
              <tr>
                <th>No & Satuan Kerja</th>
                <th>Usulan</th>
                <th className="num">Nilai Diajukan</th>
                <th className="num">Disetujui WR II</th>
                <th>Rasio</th>
                <th className="num">Efisiensi SBM</th>
                <th className="num">Realisasi Cair</th>
                <th>Kepatuhan RKAT</th>
                <th>Audit Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={9}><div className="u-empty"><strong>Tidak ada unit kerja</strong>Tidak ada data yang cocok dengan filter ini.</div></td></tr>}
              {rows.map((r) => (
                <tr key={r.no}>
                  <td className="rk-unit-cell"><strong><span className="u-id">{r.no}</span> &nbsp;{r.name}</strong><span>{r.sub}</span></td>
                  <td>{r.berkas} Berkas</td>
                  <td className="num">{formatRupiah(r.diajukan)}</td>
                  <td className="num strong">{r.disetujui === null ? <StatusBadge tone="amber">Menunggu Telaah</StatusBadge> : formatRupiah(r.disetujui)}</td>
                  <td>{pct(r.rasio)}%</td>
                  <td className="num">{formatRupiah(r.efisiensi)}</td>
                  <td className="num">{r.cair === null ? 'Rp 0' : formatRupiah(r.cair)}</td>
                  <td><StatusBadge tone={TONE[r.kepatuhan]} dot>{r.kepatuhan}</StatusBadge></td>
                  <td><button type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => toast.push(`Lembar SK ${r.no} dibuka (simulasi).`)}><FileText size={13} /> Lembar SK {r.no}</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="rk-total-label">Konsolidasi Universitas (5 Unit)</td>
                <td>{LA_TOTAL.berkas} Berkas</td>
                <td className="num">{formatRupiah(LA_TOTAL.diajukan)}</td>
                <td className="num">{formatRupiah(LA_TOTAL.disetujui)}</td>
                <td>{pct(LA_TOTAL.rasio)}%</td>
                <td className="num">{formatRupiah(LA_TOTAL.efisiensi)}</td>
                <td className="num">{formatRupiah(LA_TOTAL.cair)}</td>
                <td colSpan={2}><StatusBadge tone="green">Terverifikasi BSrE • {LA_TOTAL.bsre}% Efisiensi</StatusBadge></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="u-tfoot-bar">
          <span>Akses Eksekutif: tampilan ini terisolasi hanya untuk telaah dan pengawasan Rektorat.</span>
          <span>Pembaruan buku besar: hari ini, 09:41 WIB via Server Sentral Keuangan Adzkia</span>
        </div>
      </section>
    </div>
  );
}
