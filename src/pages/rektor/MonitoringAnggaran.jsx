import { useMemo, useState } from 'react';
import { AlertTriangle, Banknote, CheckCircle2, ClipboardList, Download, Eye, FileCheck2, FileText, PiggyBank, Printer, RotateCcw, Scissors, Wallet } from 'lucide-react';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { exportReportPdf } from '../../utils/rektorExport';
import { KPI, LEDGER, MON_BY_UNIT, MON_FILTERS, STATUS_DOCS } from '../../data/rektorData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../components/ui/Toast';
import { DonutChart, FilterSelect, Legend, ReadOnlyTag } from '../../components/rektor/RektorParts';

const DEFAULTS = { satker: MON_FILTERS.satker[0], pilar: MON_FILTERS.pilar[0], status: MON_FILTERS.status[0] };

export default function MonitoringAnggaran() {
  const toast = useToast();
  const [f, setF] = useState(DEFAULTS);
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () => LEDGER.filter((r) =>
      (f.satker === DEFAULTS.satker || r.unitKey === f.satker) &&
      (f.pilar === DEFAULTS.pilar || r.pilar === f.pilar) &&
      (f.status === DEFAULTS.status || r.statusKey === f.status)),
    [f]
  );
  const set = (k) => (v) => { setF((p) => ({ ...p, [k]: v })); setPage(1); };
  const filtered = JSON.stringify(f) !== JSON.stringify(DEFAULTS);

  const max = 500_000_000;

  const exportCsv = () => {
    downloadCsv('Monitoring_Anggaran_Konsolidasi.csv', [
      ['Kode', 'Unit', 'Kegiatan', 'Ketua', 'Pilar', 'Diajukan', 'Disetujui WR II', 'Kas Dicairkan', 'LPJ Sah', 'Sisa Anggaran', 'Status'],
      ...rows.map((r) => [r.id, r.unit, r.title, r.ketua, r.pilar, r.diajukan, r.disetujui, r.kas, r.lpj, r.sisa, r.status]),
    ]);
    toast.push('Laporan konsolidasi diekspor (CSV, dapat dibuka di Excel).');
  };
  const printRecap = () => {
    exportReportPdf({
      filename: 'Rekap_Audit_Monitoring_Anggaran.pdf',
      title: 'Rekap Audit Monitoring Anggaran & Realisasi • TA 2024/2025 Genap',
      subtitle: 'Universitas Adzkia Padang • Mode pengawasan eksekutif (read-only)',
      head: ['Kode', 'Unit', 'Kegiatan', 'Diajukan', 'Disetujui WR II', 'Kas Dicairkan', 'LPJ Sah', 'Sisa', 'Status'],
      body: rows.map((r) => [r.id, r.unit, r.title, formatRupiah(r.diajukan), formatRupiah(r.disetujui), formatRupiah(r.kas), formatRupiah(r.lpj), formatRupiah(r.sisa), r.status]),
    });
    toast.push('Rekap audit dicetak sebagai PDF.');
  };

  const d = detail?.detail;

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Pengawasan' }, { label: 'Monitoring Anggaran' }]}
        title="Monitoring Anggaran & Realisasi Multidimensi"
        accent
        badge={<ReadOnlyTag>Audit & Oversight Dashboard • Rektorat</ReadOnlyTag>}
        actions={
          <>
            <button type="button" className="u-btn u-btn-outline" onClick={exportCsv}><Download size={15} /> Unduh Laporan Konsolidasi (Excel)</button>
            <button type="button" className="u-btn u-btn-primary" onClick={printRecap}><Printer size={15} /> Cetak Rekap Audit</button>
          </>
        }
      />

      {/* Filter */}
      <section className="card">
        <div className="rk-filters">
          <FilterSelect label="Periode Anggaran" value="TA 2024/2025 Genap" onChange={() => {}} options={MON_FILTERS.periode} />
          <FilterSelect label="Satuan Kerja" value={f.satker} onChange={set('satker')} options={MON_FILTERS.satker} />
          <FilterSelect label="Kategori Pilar" value={f.pilar} onChange={set('pilar')} options={MON_FILTERS.pilar} />
          <FilterSelect label="Status Verifikasi" value={f.status} onChange={set('status')} options={MON_FILTERS.status} />
          <button type="button" className="u-btn u-btn-soft" onClick={() => { setF(DEFAULTS); setPage(1); }} disabled={!filtered}><RotateCcw size={14} /> Reset Filter</button>
        </div>
        <div className="u-chips">
          <span className="u-chip">38 Usulan Aktif</span>
          <span>Menampilkan {rows.length} dari 38 program kerja (sampel data).</span>
        </div>
      </section>

      {/* KPI */}
      <section className="rk-grid-kpi-6">
        <SummaryCard tone="navy" label="Total Usulan Pagu" icon={ClipboardList} value={formatRupiah(KPI.usulan)} sub="38 Program Kerja Diajukan">
          <p className="u-sum-sub">Fakultas & Unit • <b>100% Tercatat</b></p>
        </SummaryCard>
        <SummaryCard tone="slate" label="Disetujui WR II" icon={FileCheck2} value={formatRupiah(KPI.disetujui)} sub="84,9% Kuota Lolos Otorisasi">
          <p className="u-sum-sub"><Scissors size={12} /> Koreksi SBM <b>{formatRupiah(KPI.koreksiSbm)}</b></p>
        </SummaryCard>
        <SummaryCard tone="blue" label="Kas Dicairkan (SP2D)" icon={Wallet} value={formatRupiah(KPI.kas)} sub="81,7% dari Total Disetujui">
          <p className="u-sum-sub">Kas masuk rekening BSI Mandiri Univ</p>
        </SummaryCard>
        <SummaryCard tone="green" label="Faktual LPJ Sah" icon={CheckCircle2} value={formatRupiah(KPI.lpj)} sub="73,4% Akuntabilitas Kuitansi" />
        <SummaryCard tone="rose" label="Sisa LPJ Berjalan" icon={Banknote} value={formatRupiah(KPI.sisaLpj)} sub="Cadangan Kasir Aman Likuid" />
        <SummaryCard tone="maroon" label="Saldo Komitmen Cair" icon={PiggyBank} value={formatRupiah(KPI.sisaPagu)} sub="Termin Lanjutan Menanti SP2D" />
      </section>

      {/* Grafik */}
      <section className="rk-grid-2">
        <div className="card">
          <div className="rk-sec-title">
            <div>
              <h2>Komparasi Realisasi per Satuan Kerja Institusi</h2>
              <p>Pagu Otorisasi WR II vs Kas Dicairkan vs Berkas LPJ Tervalidasi</p>
            </div>
          </div>
          <div className="rk-bars">
            <div className="rk-bars-axis" aria-hidden="true">
              {['500 Jt', '375 Jt', '250 Jt', '125 Jt', '0'].map((t) => <span key={t}>{t}</span>)}
            </div>
            <div className="rk-bars-plot">
              {MON_BY_UNIT.map((u) => (
                <div key={u.unit} className="rk-bar-group">
                  <i className="rk-bar navy" style={{ height: `${(u.disetujui / max) * 100}%` }} title={`${u.unit} • Disetujui WR II ${formatRupiah(u.disetujui)}`} />
                  <i className="rk-bar blue" style={{ height: `${(u.kas / max) * 100}%` }} title={`${u.unit} • Kas Dicairkan ${formatRupiah(u.kas)}`} />
                  <i className="rk-bar maroon" style={{ height: `${(u.lpj / max) * 100}%` }} title={`${u.unit} • LPJ Faktual Sah ${formatRupiah(u.lpj)}`} />
                  <span className="name">{u.unit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rk-chart-legend">
            <span><i style={{ background: '#161a77' }} /> Disetujui WR II</span>
            <span><i style={{ background: '#3b6fd4' }} /> Kas Dicairkan</span>
            <span><i style={{ background: '#7a0c16' }} /> LPJ Faktual Sah</span>
          </div>
          <div className="rk-callout">
            <AlertTriangle size={18} />
            <div><strong>Catatan Auditor:</strong> Tarbiyah (FTK) memiliki serapan & kepatuhan LPJ tercepat (73%), Sarpras masih dalam siklus pengadaan fisik termin II.</div>
          </div>
        </div>

        <div className="card">
          <div className="rk-sec-title">
            <div>
              <h2>Distribusi Status Berkas</h2>
              <p>Posisi siklus penganggaran 38 program aktif</p>
            </div>
          </div>
          <div className="rk-donut-wrap">
            <DonutChart label="38" sub="Program" segments={STATUS_DOCS.map((s) => ({ key: s.key, percent: s.percent, color: s.color }))} />
            <Legend items={STATUS_DOCS.map((s) => ({ key: s.key, color: s.color, label: s.label, value: `${s.count} Dokumen (${String(s.percent).replace('.', ',')}%)` }))} />
          </div>
          <div className="rk-mutu"><span>Konsolidasi</span><span>100% Valid</span></div>
        </div>
      </section>

      {/* Ledger */}
      <section className="card">
        <div className="rk-sec-title">
          <div>
            <h2>Ledger Monitoring Anggaran & Realisasi Faktual</h2>
            <p>Daftar kegiatan dengan rincian serapan kas, persentase LPJ, dan status akuntabilitas.</p>
          </div>
          <span className="u-badge u-badge-navy">Akses Peninjauan: Rektorat (Membaca Saja)</span>
        </div>
        <div className="u-scroll">
          <table className="u-table" style={{ minWidth: 1180 }}>
            <thead>
              <tr>
                <th>Unit & Kode</th>
                <th>Program Kerja / Kegiatan</th>
                <th>Kategori Pilar</th>
                <th className="num">Diajukan</th>
                <th className="num">Disetujui WR II</th>
                <th className="num">Kas Dicairkan</th>
                <th className="num">LPJ Sah</th>
                <th className="num">Sisa Anggaran</th>
                <th>Status Alur</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={10}><div className="u-empty"><strong>Tidak ada program kerja</strong>Tidak ada data yang cocok dengan filter ini.</div></td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><span className="u-cell-title">{r.unit}</span><span className="u-cell-sub u-id">{r.id}</span></td>
                  <td className="rk-act"><strong>{r.title}</strong><span>Ketua: {r.ketua}</span></td>
                  <td><StatusBadge tone="navy">{r.pilar}</StatusBadge></td>
                  <td className="num">{formatRupiah(r.diajukan)}</td>
                  <td className="num">{formatRupiah(r.disetujui)}</td>
                  <td className="num">{formatRupiah(r.kas)}<span className="rk-sub-pct">{r.kasLabel}</span></td>
                  <td className="num strong">{formatRupiah(r.lpj)}<span className="rk-sub-pct">{r.lpjLabel}</span>{r.note && <span className="rk-note-inline">{r.note}</span>}</td>
                  <td className="num">{formatRupiah(r.sisa)}</td>
                  <td><StatusBadge tone={r.statusTone} dot>{r.status}</StatusBadge></td>
                  <td><button type="button" className="u-btn u-btn-sm u-btn-outline" onClick={() => setDetail(r)}><Eye size={13} /> Detail Audit</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="rk-total-label">Total Konsolidasi (38 Program Sample)</td>
                <td className="num">{formatRupiah(KPI.usulan)}</td>
                <td className="num">{formatRupiah(KPI.disetujui)}</td>
                <td className="num">{formatRupiah(KPI.kas)}</td>
                <td className="num">{formatRupiah(KPI.lpj)}</td>
                <td className="num">{formatRupiah(KPI.sisaPagu)}</td>
                <td colSpan={2}><span className="u-hint">Data otomatis terhubung API Bank & LPJ</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="u-tfoot-bar">
          <span>Menampilkan <b>{rows.length ? `1–${rows.length}` : '0'}</b> dari <b>38</b> program kerja universitas periode TA 2024/2025 Genap</span>
          <Pagination page={page} pageCount={3} onChange={(p) => { setPage(p); if (p !== 1) toast.push('Halaman lain hanya tersedia saat terhubung ke API (data contoh).', 'error'); }} />
        </div>
      </section>

      {/* Detail */}
      <Modal
        open={Boolean(detail)}
        wide
        title={detail ? `Audit Rektorat • ${detail.id}` : ''}
        onClose={() => setDetail(null)}
        footer={<button type="button" className="u-btn u-btn-navy" onClick={() => setDetail(null)}>Tutup</button>}
      >
        {detail && (
          <>
            <div>
              <h3 style={{ fontSize: '1.05rem', lineHeight: 1.35 }}>{detail.title}</h3>
              <p className="rk-doc-meta" style={{ margin: '0.25rem 0 0' }}>{d?.prodi ?? detail.unit} • Ketua: {detail.ketua}</p>
            </div>
            <div className="rk-detail-head">
              <div><span>Pagu Disetujui</span><strong>{formatRupiah(detail.disetujui)}</strong><small>Usulan: {formatRupiah(detail.diajukan)}</small></div>
              <div><span>Kas Cair (SP2D)</span><strong>{formatRupiah(detail.kas)}</strong><small>{d?.termin ?? detail.kasLabel}</small></div>
              <div><span>Status LPJ Berkas</span><strong>{formatRupiah(detail.lpj)}</strong><small>{d ? `Sisa kas: ${formatRupiah(detail.sisa)}` : detail.lpjLabel}</small></div>
            </div>
            {d && (
              <div className="u-note u-note-info">
                <FileText size={18} />
                <div><strong>Tingkat Pertanggungjawaban Fiskal: {d.tingkat} • {d.statusLpj}</strong><p>{d.catatan}</p></div>
              </div>
            )}
            {detail.note && <div className="u-note u-note-warn"><AlertTriangle size={18} /><div><strong>Perhatian</strong><p>{detail.note}</p></div></div>}
            {!d && <p className="u-hint">Rincian RAB, jejak kronologi, dan dokumen digital untuk program ini tersedia saat terhubung ke API.</p>}
            {d && (
              <>
                <div>
                  <p className="rk-sub-h">Ringkasan 7 Item RAB Hasil Otorisasi WR II (Sesuai SBM 2024)</p>
                  <div className="u-scroll">
                    <table className="u-table" style={{ minWidth: 520 }}>
                      <thead><tr><th>Item Kegiatan</th><th>Vol / Sat</th><th className="num">Harga SBM</th><th className="num">Realisasi</th></tr></thead>
                      <tbody>
                        {d.rab.map((i) => (
                          <tr key={i.item}><td>{i.item}</td><td>{i.vol}</td><td className="num">{formatRupiah(i.sbm)}</td><td className="num strong">{formatRupiah(i.real)}</td></tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr><td colSpan={2}>Total</td><td className="num">{formatRupiah(d.rab.reduce((a, i) => a + i.sbm, 0))}</td><td className="num">{formatRupiah(d.rab.reduce((a, i) => a + i.real, 0))}</td></tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div>
                  <p className="rk-sub-h">Jejak Kronologi Audit Berkas</p>
                  <ul className="u-timeline">
                    {d.timeline.map((t) => (
                      <li key={t.title} className={`tl-${t.tone}`}>
                        <i />
                        <div>
                          <div className="u-tl-head"><strong>{t.title}</strong><time>{t.time}</time></div>
                          <p>{t.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="rk-sub-h">Dokumen Berkas Digital (Pratinjau Khusus Rektorat)</p>
                  <div className="rk-docs">{d.docs.map((x) => <span key={x} className="rk-doc"><FileText size={14} /> {x}</span>)}</div>
                  <p className="rk-doc-meta" style={{ marginTop: '0.5rem' }}>Akses terbaca sah • Log ditandatangani Rektor</p>
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
