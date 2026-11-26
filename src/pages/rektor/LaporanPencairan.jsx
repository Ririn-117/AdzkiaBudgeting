import { useMemo, useState } from 'react';
import { Banknote, Building2, Clock4, Download, FileCheck2, Landmark, Printer, Receipt, Search, ShieldCheck, Wallet } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { exportReportPdf } from '../../utils/rektorExport';
import { PENCAIRAN_ROWS, PENCAIRAN_STATUS, PENCAIRAN_SUMMARY as S, PENCAIRAN_TABS } from '../../data/rektorData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { FilterSelect, ReadOnlyTag } from '../../components/rektor/RektorParts';

const UNITS = ['Semua Fakultas & Lembaga', ...new Set(PENCAIRAN_ROWS.map((r) => r.unit))];
const TERMIN = ['Semua Jenis Termin', 'Termin Tunggal', 'Termin 1', 'Termin 2'];

export default function LaporanPencairan() {
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState(UNITS[0]);
  const [termin, setTermin] = useState(TERMIN[0]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PENCAIRAN_ROWS.filter((r) =>
      (tab === 'all' || r.status === tab) &&
      (unit === UNITS[0] || r.unit === unit) &&
      (termin === TERMIN[0] || r.termin.startsWith(termin)) &&
      (!term || `${r.sp2d} ${r.trx} ${r.req}`.toLowerCase().includes(term)));
  }, [tab, q, unit, termin]);

  const totalPagu = rows.reduce((a, r) => a + r.pagu, 0);
  const totalCair = rows.reduce((a, r) => a + (r.status === 'sukses' ? r.cair : 0), 0);

  const exportCsv = () => {
    downloadCsv('Buku_Kas_Pencairan.csv', [
      ['No. SP2D', 'Ref Permintaan', 'Unit', 'Rekening', 'Kegiatan', 'SK WR II', 'Pagu SK', 'Nominal Cair', 'Termin', 'Waktu Eksekusi', 'Status', 'Ref TRX BSI'],
      ...rows.map((r) => [r.sp2d, r.req, r.unit, r.va, r.kegiatan, r.sk, r.pagu, r.cair, r.termin, r.waktu, PENCAIRAN_STATUS[r.status].label, r.trx]),
    ]);
    toast.push('Buku kas diekspor (CSV, dapat dibuka di Excel).');
  };
  const exportPdf = () => {
    exportReportPdf({
      filename: 'Rekap_Pencairan_SP2D.pdf',
      title: 'Laporan Realisasi Pencairan Kas Universitas • BSI-CMS 2025/GENAP',
      subtitle: 'Buku Kas Keluar Semester Genap 2024/2025 • Mode read-only',
      head: ['No. SP2D', 'Unit', 'Kegiatan', 'Pagu SK', 'Nominal Cair', 'Termin', 'Waktu Eksekusi', 'Status'],
      body: rows.map((r) => [r.sp2d, r.unit, r.kegiatan, formatRupiah(r.pagu), formatRupiah(r.cair), r.termin, r.waktu, PENCAIRAN_STATUS[r.status].label]),
    });
    toast.push('Rekap pencairan dicetak sebagai PDF.');
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Pengawasan' }, { label: 'Laporan Pencairan' }]}
        title="Laporan Realisasi Pencairan Kas Universitas"
        accent
        badge={<ReadOnlyTag>Modul Akuntabilitas Kas • Ref: BSI-CMS 2025/GENAP</ReadOnlyTag>}
        actions={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={exportCsv}><Download size={15} /> Ekspor Buku Kas (.xlsx)</button>
            <button type="button" className="u-btn u-btn-primary" onClick={exportPdf}><Printer size={15} /> Cetak Rekap Pencairan (PDF)</button>
          </>
        }
      />

      <section className="rk-bank">
        <div className="saldo">
          <span>Saldo Kas Operasional (BSI)</span>
          <strong>{formatRupiah(S.saldoBsi)}</strong>
          <small>Sinkronisasi pukul {S.sinkron} • Rekening Kas Utama Rektorat • CMS Terintegrasi</small>
          <div className="rk-gate"><span><ShieldCheck size={12} /> SLA Kliring: Real-time</span><span><Landmark size={12} /> Host-to-Host Connected</span><span>Status gateway perbankan: Aktif</span></div>
        </div>
        <div className="acc">
          <span>Bank Syariah Indonesia (BSI) • Giro Utama</span>
          <b>{S.rekening}</b>
          <small>a.n. {S.atasNama}</small>
        </div>
      </section>

      <section className="u-sum-grid">
        <SummaryCard tone="navy" label="Total SP2D Diterbitkan" icon={Receipt} value={formatRupiah(S.total.amount)} sub={`${S.total.berkas} Berkas`}>
          <p className="u-sum-sub">Pagu SK terbit</p>
        </SummaryCard>
        <SummaryCard tone="green" label="Telah Transfer BSI" icon={Banknote} value={formatRupiah(S.transfer.amount)} sub={`${S.transfer.berkas} Berkas`}>
          <p className="u-sum-sub">100% kliring BSI</p>
        </SummaryCard>
        <SummaryCard tone="blue" label="Antrean Kasir Rektorat" icon={Clock4} value={formatRupiah(S.antrean.amount)} sub={`${S.antrean.berkas} Berkas`}>
          <p className="u-sum-sub">Siap cetak bukti</p>
        </SummaryCard>
        <SummaryCard tone="slate" label="Otorisasi Yayasan" icon={Building2} value={formatRupiah(S.yayasan.amount)} sub={`${S.yayasan.berkas} Berkas`}>
          <p className="u-sum-sub">Verifikasi saldo BSI</p>
        </SummaryCard>
        <SummaryCard tone="maroon" label="Kas Masuk (SiLPA)" icon={Wallet} value={formatRupiah(S.silpa.amount)} sub={`${S.silpa.setoran} Setoran`}>
          <p className="u-sum-sub">Telah disetor ke kasir</p>
        </SummaryCard>
      </section>

      <section className="card">
        <div className="u-tabs" role="tablist">
          {PENCAIRAN_TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`u-tab ${tab === t.key ? 'on' : ''}`} onClick={() => setTab(t.key)}>
              {t.label} <em>{t.count}</em>
            </button>
          ))}
        </div>
        <div className="rk-filters cols-3" style={{ marginTop: '1rem', gridTemplateColumns: '1.3fr 1fr 1fr 1fr' }}>
          <label className="u-field">
            <span className="rk-filter-label">Pencarian No. SP2D / Ref TRX</span>
            <div className="u-iwrap"><Search size={15} className="ic" /><input className="u-input has-ic" placeholder="Cari SP2D atau TRX BSI..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </label>
          <FilterSelect label="Satuan Kerja / Unit" value={unit} onChange={setUnit} options={UNITS} />
          <FilterSelect label="Rekening Sumber Bank" value="Semua Rekening Kas" onChange={() => {}} options={['Semua Rekening Kas']} />
          <FilterSelect label="Tipe Termin Penyaluran" value={termin} onChange={setTermin} options={TERMIN} />
        </div>
      </section>

      <section className="card">
        <div className="rk-sec-title">
          <div><h2>Buku Kas Keluar Semester Genap 2024/2025</h2><p>16 transaksi kliring BSI terotorisasi Kasir & Yayasan</p></div>
          <span className="u-badge u-badge-navy">Akses Eksekutif: 100% Read-Only</span>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1250 }}>
            <thead>
              <tr>
                <th>No. SP2D & Ref Permintaan</th>
                <th>Unit & Rekening Penerima</th>
                <th>Nama Kegiatan & SK WR II</th>
                <th className="num">Pagu SK</th>
                <th className="num">Nominal Cair</th>
                <th>Termin</th>
                <th>Waktu Eksekusi Kasir</th>
                <th>Status Kasir & BSI</th>
                <th>Audit & Bukti</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={9}><div className="u-empty"><strong>Tidak ada transaksi</strong>Tidak ada SP2D yang cocok dengan filter ini.</div></td></tr>}
              {rows.map((r) => (
                <tr key={r.sp2d} className={r.status === 'antrean' ? 'row-queue' : r.status === 'yayasan' ? 'row-warn' : ''}>
                  <td><span className="u-id">{r.sp2d}</span><span className="u-cell-sub">{r.req}</span></td>
                  <td className="rk-unit-cell"><strong>{r.unit}</strong><span>{r.va}</span></td>
                  <td className="rk-act"><strong>{r.kegiatan}</strong><span>{r.sk}</span></td>
                  <td className="num">{formatRupiah(r.pagu)}</td>
                  <td className="num strong">{formatRupiah(r.cair)}</td>
                  <td>{r.termin}</td>
                  <td>{r.waktu}</td>
                  <td>
                    <StatusBadge tone={PENCAIRAN_STATUS[r.status].tone} dot>{PENCAIRAN_STATUS[r.status].label}</StatusBadge>
                    <span className="rk-trx" style={{ display: 'block', marginTop: '0.3rem' }}>{r.trx}</span>
                  </td>
                  <td>
                    <button type="button" className="u-btn u-btn-sm u-btn-outline" disabled={r.status !== 'sukses'} onClick={() => toast.push(`Bukti CMS ${r.sp2d} dibuka (simulasi).`)}>
                      <FileCheck2 size={13} /> {r.status === 'sukses' ? 'Bukti CMS' : 'Menunggu TRX'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="rk-total-label">Total Realisasi Pencairan Terpilih</td>
                <td className="num">{formatRupiah(totalPagu)}</td>
                <td className="num">{formatRupiah(totalCair)}</td>
                <td colSpan={4}><span className="u-hint">Total cair dihitung dari transaksi berstatus sukses transfer BSI.</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan <b>{rows.length ? `1–${rows.length}` : '0'}</b> dari <b>22</b> transaksi SP2D aktif (sampel data)</span>
          <span>Seluruh 22 SP2D: pagu {formatRupiah(S.total.amount)} • cair {formatRupiah(S.transfer.amount)}</span>
        </div>
      </section>
    </div>
  );
}
