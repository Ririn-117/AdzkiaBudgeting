import { useMemo, useState } from 'react';
import { AlertTriangle, BadgeCheck, CheckCircle2, ClipboardCheck, Download, FileSearch, FileText, Landmark, PiggyBank, Printer, Receipt, Search, Wallet } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { exportReportPdf } from '../../utils/rektorExport';
import { LPJ_RECON, LPJ_ROWS, LPJ_STATUS_OPTIONS, LPJ_SUMMARY as S, LPJ_TAX } from '../../data/rektorData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { FilterSelect, ReadOnlyTag, StackBar } from '../../components/rektor/RektorParts';

const UNITS = ['Semua Unit & Lembaga', ...new Set(LPJ_ROWS.map((r) => r.unit))];

export default function LaporanLpj() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [unit, setUnit] = useState(UNITS[0]);
  const [detail, setDetail] = useState(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LPJ_ROWS.filter((r) =>
      (!status || r.statusKey === status) &&
      (unit === UNITS[0] || r.unit === unit) &&
      (!term || `${r.id} ${r.title} ${r.ref}`.toLowerCase().includes(term)));
  }, [q, status, unit]);

  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  const d = detail?.detail;

  const exportCsv = () => {
    downloadCsv('Rekap_Audit_LPJ.csv', [
      ['No. LPJ', 'Tanggal', 'Unit', 'Kegiatan', 'Referensi', 'Pencairan Disetujui', 'Realisasi LPJ', 'SiLPA', 'Pajak', 'Status Audit BKPU'],
      ...rows.map((r) => [r.id, r.tgl, `${r.unit} / ${r.fak}`, r.title, r.ref, r.cair, r.real, r.silpa, r.pajak, r.status]),
    ]);
    toast.push('Rekap audit LPJ diekspor (CSV, dapat dibuka di Excel).');
  };
  const printBap = () => {
    exportReportPdf({
      filename: 'Berita_Acara_Rekonsiliasi_LPJ.pdf',
      title: 'Berita Acara Rekonsiliasi Kas: Pencairan vs Pertanggungjawaban LPJ',
      subtitle: 'TA 2024/2025 Genap • BKPU & SPI Pengawasan • Mode read-only',
      head: ['No. LPJ', 'Unit', 'Kegiatan', 'Pencairan', 'Realisasi LPJ', 'SiLPA', 'Pajak', 'Status Audit'],
      body: rows.map((r) => [r.id, r.unit, r.title, formatRupiah(r.cair), formatRupiah(r.real), formatRupiah(r.silpa), r.pajak, r.status]),
    });
    toast.push('Berita acara rekonsiliasi dicetak sebagai PDF.');
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Pengawasan' }, { label: 'Fiskal & Akuntabilitas • BKPU & SPI' }, { label: 'Laporan LPJ' }]}
        title="Laporan Pertanggungjawaban (LPJ) & Kepatuhan Fiskal"
        accent
        badge={<ReadOnlyTag />}
        actions={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={exportCsv}><Download size={15} /> Unduh Rekap Audit LPJ (.xlsx)</button>
            <button type="button" className="u-btn u-btn-primary" onClick={printBap}><Printer size={15} /> Cetak Berita Acara Rekonsiliasi</button>
          </>
        }
      />

      <section className="card">
        <div className="rk-filters cols-5" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr' }}>
          <label className="u-field">
            <span className="rk-filter-label">Cari Nomor LPJ / Judul</span>
            <div className="u-iwrap"><Search size={15} className="ic" /><input className="u-input has-ic" placeholder="Cari nomor LPJ / judul..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </label>
          <FilterSelect label="Periode Akademik" value="TA 2024/2025 Genap" onChange={() => {}} options={['TA 2024/2025 Genap']} />
          <FilterSelect label="Status Audit BKPU" value={status} onChange={setStatus} options={LPJ_STATUS_OPTIONS} />
          <FilterSelect label="Unit / Fakultas" value={unit} onChange={setUnit} options={UNITS} />
        </div>
      </section>

      <section className="u-sum-grid">
        <SummaryCard tone="green" label="BAP Terbit (Bebas Temuan)" icon={BadgeCheck} value={formatRupiah(S.bap.amount)} sub={`${S.bap.laporan} Laporan`}>
          <p className="u-sum-sub">100% sah fisik</p>
        </SummaryCard>
        <SummaryCard tone="maroon" label="Klarifikasi Bukti / PPh" icon={AlertTriangle} value={formatRupiah(S.klarifikasi.amount)} sub={`${S.klarifikasi.dokumen} Dokumen`}>
          <p className="u-sum-sub">Revisi pajak</p>
        </SummaryCard>
        <SummaryCard tone="rose" label="SiLPA Disetor ke Kas" icon={PiggyBank} value={formatRupiah(S.silpa.amount)} sub={`${S.silpa.unit} Unit`}>
          <p className="u-sum-sub">Disiplin 100% kliring</p>
        </SummaryCard>
        <SummaryCard tone="navy" label="Total LPJ Masuk" icon={ClipboardCheck} value={formatRupiah(S.total.amount)} sub={`${S.total.berkas} Berkas`}>
          <p className="u-sum-sub">Nilai riil</p>
        </SummaryCard>
        <SummaryCard tone="blue" label="Uji Kuitansi (BKPU)" icon={FileSearch} value={formatRupiah(S.uji.amount)} sub={`${S.uji.dokumen} Dokumen`}>
          <p className="u-sum-sub">Proses uji fisik</p>
        </SummaryCard>
      </section>

      <section className="rk-grid-2">
        <div className="card">
          <div className="rk-sec-title">
            <div><h2>Rekonsiliasi Kas: Pencairan vs Pertanggungjawaban LPJ</h2><p>Perbandingan rasio dana kas operasional yang telah dicairkan oleh kasir bendahara terhadap belanja riil yang telah teruji fisiknya oleh BKPU.</p></div>
            <span className="u-badge u-badge-navy">SLA Pertanggungjawaban: 30 Hari</span>
          </div>
          <div className="rk-recon-stats">
            <span>Total Pencairan Disalurkan: <b>{formatRupiah(S.pencairan.amount)} (100%)</b></span>
            <span>Sisa Kas Belum LPJ: <b>{formatRupiah(S.sisaKas.amount)} (26,5%)</b></span>
          </div>
          <StackBar segments={LPJ_RECON} />
          <div className="rk-recon-legend">
            {LPJ_RECON.map((s) => <span key={s.key}><i style={{ background: s.color }} />{s.label} ({String(s.percent).replace('.', ',')}%)</span>)}
          </div>
          <div className="u-sum-grid cols-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '1.1rem' }}>
            <SummaryCard tone="blue" label="Pencairan Kasir (SP2D)" icon={Wallet} value={formatRupiah(S.pencairan.amount)} sub={`${S.pencairan.kegiatan} Kegiatan Total`} />
            <SummaryCard tone="green" label="LPJ Terdaftar Fisik" icon={Receipt} value={formatRupiah(S.terdaftar.amount)} sub="73,5% dari nilai cair" />
            <SummaryCard tone="maroon" label="Kas Sisa Belum LPJ" icon={Landmark} value={formatRupiah(S.sisaKas.amount)} sub="Semua < 30 hari batas" />
          </div>
        </div>

        <div className="card">
          <div className="rk-sec-title">
            <div><h2>Kepatuhan Perpajakan</h2><p>Tingkat sinkronisasi e-Bupot Unifikasi dan validitas faktur pajak belanja institusi.</p></div>
          </div>
          <div className="rk-tax-big"><strong>{String(LPJ_TAX.persen).replace('.', ',')}%</strong><span>TERVALIDASI DJP</span></div>
          {LPJ_TAX.rows.map((t) => (
            <div key={t.label} className="rk-tax-row"><span>{t.label}</span><StatusBadge tone={t.tone}>{t.value}</StatusBadge></div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="rk-sec-title">
          <div><h2>Daftar Pertanggungjawaban Riil & Uji BKPU</h2><p>{rows.length} dari 24 berkas terdata • data terintegrasi sistem Akuntansi Keuangan UnAdzkia</p></div>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1150 }}>
            <thead>
              <tr>
                <th>No. LPJ & Tanggal</th>
                <th>Unit & Fakultas</th>
                <th>Program Kerja / Referensi</th>
                <th className="num">Pencairan Disetujui</th>
                <th className="num">Realisasi LPJ</th>
                <th>Sisa Kas (SiLPA)</th>
                <th>Pajak</th>
                <th>Status Audit BKPU</th>
                <th>Aksi Pengawasan</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={9}><div className="u-empty"><strong>Tidak ada berkas LPJ</strong>Tidak ada data yang cocok dengan filter ini.</div></td></tr>}
              {rows.map((r) => (
                <tr key={r.id} className={r.statusKey === 'klarifikasi' ? 'row-warn' : ''}>
                  <td><span className="u-id">{r.id}</span><span className="u-cell-sub">{r.tgl}</span></td>
                  <td className="rk-unit-cell"><strong>{r.unit}</strong><span>{r.fak}</span></td>
                  <td className="rk-act"><strong>{r.title}</strong><span>{r.ref}</span></td>
                  <td className="num">{formatRupiah(r.cair)}</td>
                  <td className="num strong">{formatRupiah(r.real)}</td>
                  <td>{r.silpaLabel}</td>
                  <td><StatusBadge tone={r.pajakTone}>{r.pajak}</StatusBadge></td>
                  <td><StatusBadge tone={r.statusTone} dot>{r.status}</StatusBadge></td>
                  <td>
                    <button type="button" className={`u-btn u-btn-sm ${r.detail ? 'u-btn-primary' : 'u-btn-outline'}`} onClick={() => (r.detail ? setDetail(r) : toast.push(`Berkas ${r.id} dibuka (simulasi, tidak ada temuan).`))}>
                      <FileText size={13} /> {r.statusKey === 'klarifikasi' ? 'Perlu Klarifikasi Bukti' : 'Tinjau Berkas'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="rk-total-label">Total Konsolidasi Sampel (5 dari 24)</td>
                <td className="num">{formatRupiah(sum('cair'))}</td>
                <td className="num">{formatRupiah(sum('real'))}</td>
                <td>{formatRupiah(sum('silpa'))}</td>
                <td colSpan={3}><span className="u-hint">Seluruh SiLPA tercatat masuk Rekening Penampung UnAdzkia (Bank Nagari Syariah)</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="u-tfoot-bar"><span>Menampilkan <b>{rows.length}</b> dari <b>24</b> berkas pertanggungjawaban terdaftar</span><span>Mode audit eksekutif (read-only)</span></div>
      </section>

      <Modal
        open={Boolean(detail)}
        wide
        title={detail ? `Audit Eksekutif • ${detail.id}` : ''}
        onClose={() => setDetail(null)}
        footer={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={() => toast.push('Lembar uji petik dicetak (simulasi).')}><Printer size={14} /> Cetak Lembar Uji Petik</button>
            <button type="button" className="u-btn u-btn-navy" onClick={() => setDetail(null)}>Tutup</button>
          </>
        }
      >
        {d && (
          <>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>{d.judul}</h3>
              <p className="rk-doc-meta" style={{ margin: '0.25rem 0 0' }}>{d.unit}</p>
            </div>
            <div className="u-note u-note-warn">
              <AlertTriangle size={18} />
              <div><strong>{d.catatanJudul}</strong><p>{d.catatan}</p><p style={{ marginTop: '0.4rem' }}>Pemeriksa: {d.pemeriksa}</p></div>
            </div>
            <div className="rk-detail-head">
              <div><span>Pencairan Awal</span><strong>{formatRupiah(detail.cair)}</strong><small>SP2D: {d.sp2d}</small></div>
              <div><span>Belanja Riil</span><strong>{formatRupiah(detail.real)}</strong><small>100% terserap</small></div>
              <div><span>SiLPA / Kas Balik</span><strong>Rp 0 (Nihil)</strong><small>Tertib pembukuan</small></div>
            </div>
            <div>
              <p className="rk-sub-h">Daftar Bukti Fisik Terunggah ({d.jumlahBerkas} Berkas) • Semua faktur asli terarsip di BKPU</p>
              <ul className="rk-bukti">
                {d.bukti.map((b) => (
                  <li key={b.title} className={b.ok ? '' : 'warn'}>
                    {b.ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <div className="main"><strong>{b.title}</strong><span>{b.sub}</span></div>
                    <div className="amt">{formatRupiah(b.amount)}<small>{b.ok ? 'Valid' : 'Tinjau Pajak'}</small></div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="rk-sub-h">Pengesahan Faktual & Tanda Tangan</p>
              <div className="rk-sign">
                <div><span>Penanggung Jawab Kegiatan</span><strong>{d.pj.nama}</strong><small>{d.pj.jabatan}</small><em>TTD & Stempel Sah</em></div>
                <div><span>Mengetahui Dekan Fakultas</span><strong>{d.dekan.nama}</strong><small>{d.dekan.jabatan}</small><em>Disahkan Faktual</em></div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
