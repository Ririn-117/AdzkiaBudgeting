import { Link } from 'react-router-dom';
import {
  AlarmClock, ArrowRight, BadgeCheck, BellRing, CalendarDays, CheckCircle2, CircleDollarSign, Download,
  FileText, FileCheck2, Landmark, Printer, Receipt, ShieldCheck, TrendingUp, Wallet, Workflow, PiggyBank, ScrollText, Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRupiah } from '../../utils/format';
import { downloadCsv } from '../../utils/csv';
import { exportReportPdf } from '../../utils/rektorExport';
import {
  EWS, FLOW, KPI, PERIOD, PILLARS, REKTOR_BASE, REKTOR_PROFILE, UNIT_ABSORPTION, UNIT_TOTAL,
} from '../../data/rektorData';
import PageHeader from '../../components/ui/PageHeader';
import SummaryCard from '../../components/ui/SummaryCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { DonutChart, Legend, ReadOnlyTag } from '../../components/rektor/RektorParts';

const EWS_ICON = { warn: AlarmClock, danger: Receipt, success: CheckCircle2 };
const pct = (n) => n.toLocaleString('id-ID', { maximumFractionDigits: 2 });

export default function RektorDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const name = user?.name && user.name !== 'Rektor' ? user.name : REKTOR_PROFILE.name;

  const exportPdf = () => {
    exportReportPdf({
      filename: 'Ringkasan_Eksekutif_E-Budgeting.pdf',
      title: `Ringkasan Eksekutif E-Budgeting • ${PERIOD.ta} ${PERIOD.semester}`,
      subtitle: 'Universitas Adzkia Padang • Mode pengawasan eksekutif (read-only)',
      head: ['Satker', 'Pagu Usulan', 'Pagu Disetujui', 'Kas Dicairkan', 'Realisasi LPJ Sah', 'Daya Serap LPJ', 'Status Audit'],
      body: [
        ...UNIT_ABSORPTION.map((u) => [u.name, formatRupiah(u.usulan), formatRupiah(u.disetujui), formatRupiah(u.kas), formatRupiah(u.lpj), `${pct(u.daya)}%`, u.status]),
        ['Konsolidasi Universitas (5 Satker)', formatRupiah(UNIT_TOTAL.usulan), formatRupiah(UNIT_TOTAL.disetujui), formatRupiah(UNIT_TOTAL.kas), formatRupiah(UNIT_TOTAL.lpj), `${pct(UNIT_TOTAL.daya)}%`, UNIT_TOTAL.status],
      ],
    });
    toast.push('Ringkasan eksekutif diunduh sebagai PDF.');
  };

  const exportData = () => {
    downloadCsv('Data_Konsolidasi_E-Budgeting.csv', [
      ['Satker', 'Pagu Usulan', 'Pagu Disetujui', 'Kas Dicairkan', 'Realisasi LPJ Sah', 'Daya Serap LPJ (%)', 'Status Audit'],
      ...UNIT_ABSORPTION.map((u) => [u.name, u.usulan, u.disetujui, u.kas, u.lpj, u.daya, u.status]),
      ['Konsolidasi Universitas', UNIT_TOTAL.usulan, UNIT_TOTAL.disetujui, UNIT_TOTAL.kas, UNIT_TOTAL.lpj, UNIT_TOTAL.daya, UNIT_TOTAL.status],
    ]);
    toast.push('Data konsolidasi diekspor (CSV, dapat dibuka di Excel).');
  };

  return (
    <div className="upage">
      <PageHeader
        crumbs={[{ label: 'Pengawasan' }, { label: 'Dashboard Eksekutif' }]}
        title="Dashboard Eksekutif"
        accent
        badge={<ReadOnlyTag />}
        subtitle="Konsol pemantauan strategis & realisasi anggaran institusional."
      />

      {/* Hero */}
      <section className="card rk-hero">
        <div>
          <div className="hero-chips" style={{ marginBottom: '0.9rem' }}>
            <span className="chip"><CalendarDays size={14} /> {PERIOD.ta} {PERIOD.semester}</span>
            <span className="chip"><ShieldCheck size={14} /> Sinkronisasi SIMKEU & CMS Bank BSI Real-Time • Update 24 menit lalu</span>
          </div>
          <h1>Selamat Datang,<br /><span>{name}</span></h1>
          <p>
            Evaluasi komprehensif aliran fiskal, ketepatan realisasi belanja, dan akuntabilitas pelaporan antar-satker.
            Seluruh agregasi rincian program kerja mengacu pada Rencana Strategis (RENSTRA) Adzkia 2020–2025 dengan fokus
            penguatan Tri Dharma Perguruan Tinggi, akreditasi, dan transformasi <i>Good University Governance</i>.
          </p>
          <div className="rk-hero-actions">
            <button type="button" className="u-btn u-btn-primary" onClick={exportPdf}><Printer size={15} /> Cetak Ringkasan Eksekutif (PDF)</button>
            <button type="button" className="u-btn u-btn-outline" onClick={exportData}><Download size={15} /> Ekspor Data Konsolidasi (.xlsx)</button>
          </div>
          <div className="rk-hero-meta">
            <span><Landmark size={13} /> Total Fakultas: 4 Fakultas (12 Prodi)</span>
            <span>Satker Lembaga/Biro: 5 Satuan Kerja</span>
            <span><BadgeCheck size={13} /> Status SP2D Terkunci: 100% Kliring BSI</span>
          </div>
        </div>
        <aside className="rk-hero-card">
          <span>Efisiensi Belanja SBM</span>
          <strong>{formatRupiah(KPI.efisiensiSbm)}</strong>
          <small>Penghematan riil dari telaah tim verifikasi kepatuhan BKPU terhadap usulan RKAT unit.</small>
          <em className="pill">Rasio koreksi usulan biaya {String(KPI.koreksiPersen).replace('.', ',')}%</em>
        </aside>
      </section>

      {/* KPI */}
      <section className="u-sum-grid">
        <SummaryCard tone="navy" label="1. Total Usulan RKAT" icon={FileText} value={formatRupiah(KPI.usulan)} sub={`${KPI.usulanProgram} Program Kerja Diusulkan`}>
          <p className="rk-kpi-def">Total pagu rencana kegiatan yang diajukan oleh seluruh 4 Fakultas dan 3 Lembaga/Biro.</p>
        </SummaryCard>
        <SummaryCard tone="slate" label="2. Anggaran Disetujui" icon={FileCheck2} value={formatRupiah(KPI.disetujui)} sub={`Lolos Verifikasi SK: ${String(KPI.disetujuiPersen).replace('.', ',')}%`}>
          <p className="rk-kpi-def">Pagu resmi yang disahkan WR II / SK Rektor sebagai batas maksimal plafon pengeluaran.</p>
        </SummaryCard>
        <SummaryCard tone="blue" label="3. Kas Dicairkan (SP2D)" icon={Wallet} value={formatRupiah(KPI.kas)} sub={`${String(KPI.kasPersenPagu).replace('.', ',')}% dari Pagu Disetujui`}>
          <p className="rk-kpi-def">Likuiditas kas riil yang telah ditransfer Bendahara melalui BSI ke rekening penanggung jawab.</p>
        </SummaryCard>
        <SummaryCard tone="green" label="4. Realisasi Sah (LPJ)" icon={CircleDollarSign} value={formatRupiah(KPI.lpj)} sub={`${String(KPI.lpjPersenKas).replace('.', ',')}% dari Kas Dicairkan`}>
          <p className="rk-kpi-def">Nilai kuitansi & bukti riil kegiatan yang telah diverifikasi akuntansinya secara formal (Audit Clean).</p>
        </SummaryCard>
        <SummaryCard tone="maroon" label="5. Sisa Pagu Belum Cair" icon={PiggyBank} value={formatRupiah(KPI.sisaPagu)} sub={`${String(KPI.sisaPersen).replace('.', ',')}% Saldo Terkunci`}>
          <p className="rk-kpi-def">Selisih sisa pagu disetujui yang belum diajukan SPP/SPM termin lanjutannya oleh satker.</p>
        </SummaryCard>
      </section>

      {/* Arus finansial + Pilar */}
      <section className="rk-grid-2">
        <div className="card">
          <div className="rk-sec-title">
            <div>
              <h2 className="u-h2" style={{ marginBottom: 0 }}><TrendingUp size={18} /> Progresi Arus Finansial Tri Fasilitator Institusi</h2>
              <p>Komparasi komprehensif antara Pagu Disahkan, Aliran Likuiditas Kas, dan Kuitansi Sah</p>
            </div>
          </div>
          <div className="rk-flow">
            {FLOW.map((f) => (
              <div key={f.key} className={`rk-flow-row rk-flow-${f.tone}`}>
                <div className="rk-flow-head"><span>{f.label}</span><em>{f.text}</em></div>
                <div className="rk-flow-track"><i style={{ width: `${f.percent}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="rk-callout">
            <Info size={18} />
            <div>
              <strong>Catatan Evaluasi Akuntabilitas Fiskal:</strong>
              Terdapat selisih {formatRupiah(KPI.sisaLpj)} dana tunai di tangan unit kerja yang sedang dalam tahap pelaksanaan
              kegiatan atau penyusunan kuitansi LPJ termin akhir. Seluruhnya terpantau dalam jadwal kepatuhan baku 14 hari kalender kerja.
              <br /><span className="rk-pill-ok">Kepatuhan Mandat Yayasan: Renstra Sesuai Target</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="rk-sec-title">
            <div>
              <h2 className="u-h2" style={{ marginBottom: 0 }}><Workflow size={18} /> Distribusi Anggaran Pilar Renstra</h2>
              <p>Alokasi proporsional pagu SK per rumpun strategis</p>
            </div>
          </div>
          <div className="rk-donut-wrap">
            <DonutChart
              label={String(KPI.usulanProgram)}
              sub="Program"
              segments={PILLARS.map((p) => ({ key: p.key, percent: p.percent, color: p.color }))}
            />
            <Legend
              items={PILLARS.map((p) => ({
                key: p.key,
                color: p.color,
                label: (
                  <span className="rk-pillar">
                    <span>{p.label} • {String(p.percent).replace('.', ',')}%</span>
                    <small>Pagu: {formatRupiah(p.pagu)} • {p.proker} Proker</small>
                  </span>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Panel serapan */}
      <section className="card">
        <div className="rk-sec-title">
          <div>
            <h2 className="u-h2" style={{ marginBottom: 0 }}>Panel Serapan per Fakultas & Satuan Kerja</h2>
            <p>Matriks daya serap kas dan status akuntabilitas SPJ per unit pengusul</p>
          </div>
          <span className="u-badge u-badge-navy">5 Entitas Utama Terkonsolidasi</span>
        </div>
        <div className="u-scroll">
          <table className="u-table">
            <thead>
              <tr>
                <th>Fakultas / Satuan Kerja</th>
                <th className="num">Pagu Usulan</th>
                <th className="num">Pagu Disetujui</th>
                <th className="num">Kas Dicairkan</th>
                <th className="num">Realisasi LPJ Sah</th>
                <th>Daya Serap LPJ</th>
                <th>Status Audit</th>
              </tr>
            </thead>
            <tbody>
              {UNIT_ABSORPTION.map((u) => (
                <tr key={u.id}>
                  <td className="rk-unit-cell"><strong>{u.name}</strong><span>{u.note}</span></td>
                  <td className="num">{formatRupiah(u.usulan)}</td>
                  <td className="num">{formatRupiah(u.disetujui)}</td>
                  <td className="num">{formatRupiah(u.kas)}</td>
                  <td className="num strong">{formatRupiah(u.lpj)}</td>
                  <td>
                    <div className="rk-daya">
                      <div className={`u-bar ${u.daya < 60 ? 'maroon' : 'green'}`}><i style={{ width: `${u.daya}%` }} /></div>
                      <b>{pct(u.daya)}%</b>
                    </div>
                  </td>
                  <td><StatusBadge tone={u.tone} dot>{u.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="rk-total-label">Konsolidasi Universitas (5 Satker)</td>
                <td className="num">{formatRupiah(UNIT_TOTAL.usulan)}</td>
                <td className="num">{formatRupiah(UNIT_TOTAL.disetujui)}</td>
                <td className="num">{formatRupiah(UNIT_TOTAL.kas)}</td>
                <td className="num">{formatRupiah(UNIT_TOTAL.lpj)}</td>
                <td>Rata-rata {pct(UNIT_TOTAL.daya)}%</td>
                <td><StatusBadge tone="green">{UNIT_TOTAL.status}</StatusBadge></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* EWS */}
      <section className="card">
        <div className="rk-sec-title">
          <div>
            <h2 className="u-h2" style={{ marginBottom: 0 }}><BellRing size={18} /> Early Warning System (EWS) • Perhatian Rektor</h2>
            <p>Notifikasi anomali, keterlambatan pelaporan SPJ, atau usulan strategis berskala besar yang butuh perhatian supervisi pimpinan.</p>
          </div>
          <span className="u-badge u-badge-maroon">2 Indikasi SLA / Dokumen</span>
        </div>
        <div className="rk-ews">
          {EWS.map((e) => {
            const Icon = EWS_ICON[e.tone];
            return (
              <article key={e.id} className={`rk-ews-item ${e.tone}`}>
                <span className="rk-ews-icon"><Icon size={20} /></span>
                <div className="rk-ews-body">
                  <div className="rk-ews-tags">
                    <StatusBadge tone={e.tone === 'warn' ? 'amber' : e.tone === 'danger' ? 'red' : 'green'}>{e.tag}</StatusBadge>
                    <span className="u-ref">{e.unit}</span>
                  </div>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                  <Link to={e.to} className="u-link">{e.action} <ArrowRight size={13} style={{ verticalAlign: '-2px' }} /></Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="rk-ews-foot"><ScrollText size={13} style={{ verticalAlign: '-2px' }} /> Sistem Pelaporan Terintegrasi SIMKEU v4.2 Adzkia • Notifikasi dikirim otomatis ke surel WR II & Dekan terkait • Kode enkripsi ledger: SHA-256 • Status: SIMKEU SYNC (Oversight Mode) • Audit Ready</p>
      </section>

      <p className="rk-count-line"><Link to={`${REKTOR_BASE}/monitoring-anggaran`} className="u-link">Buka Monitoring Anggaran multidimensi <ArrowRight size={13} style={{ verticalAlign: '-2px' }} /></Link></p>
    </div>
  );
}
