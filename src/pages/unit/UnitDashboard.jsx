import { Link } from 'react-router-dom';
import {
  AlarmClock,
  AlertCircle,
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  GraduationCap,
  Headset,
  History,
  Mail,
  MapPin,
  MessageSquare,
  PiggyBank,
  Send,
  ShieldCheck,
  Wallet,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRupiah } from '../../utils/format';
import { ACTIVITIES, ALERTS, BUDGET, DEADLINE, HELPDESK, PIPELINE, PROFILE } from '../../data/unitDummy';
import './unit.css';

function StatCard({ tone, label, icon: Icon, value, footIcon: FootIcon, foot, children }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-top">
        <span>{label}</span>
        <Icon size={20} />
      </div>
      <p className="stat-value">{value}</p>
      {children ?? (
        <p className="stat-foot">
          <FootIcon size={15} /> {foot}
        </p>
      )}
    </div>
  );
}

export default function UnitDashboard() {
  const { user } = useAuth();
  const fullName = user?.name ?? PROFILE.fullName;

  const sisa = BUDGET.pagu - BUDGET.diajukan;
  const sisaPersen = (sisa / BUDGET.pagu) * 100;
  const sisaPersenLabel = sisaPersen.toLocaleString('id-ID', { maximumFractionDigits: 1 });
  const totalUsulan = 8;

  return (
    <div className="dash">
      {/* Hero */}
      <section className="card hero">
        <div className="hero-chips">
          <span className="chip"><GraduationCap size={14} /> {PROFILE.prodiLong}</span>
          <span className="chip"><CalendarDays size={14} /> Periode Aktif: TA 2024/2025 Genap</span>
        </div>
        <h1>
          Selamat Datang kembali,
          <br />
          <span className="accent">{fullName}</span>
        </h1>
        <p className="hero-deadline">
          <AlarmClock size={16} /> Tenggat Pengajuan: Sisa {DEADLINE.daysLeft} Hari ({DEADLINE.date})
        </p>
        <p className="hero-sub">
          Kelola usulan program studi, pantau realisasi belanja, dan lengkapi laporan LPJ tepat waktu.
        </p>
      </section>

      {/* Kartu angka */}
      <section className="stat-grid">
        <StatCard
          tone="navy" label="Total Pagu Anggaran" icon={Wallet}
          value={formatRupiah(BUDGET.pagu)} footIcon={ShieldCheck} foot="Alokasi Resmi RKAT 2025"
        />
        <StatCard
          tone="slate" label="Total Diajukan" icon={Send}
          value={formatRupiah(BUDGET.diajukan)} footIcon={ShieldCheck} foot="6 usulan kegiatan terdaftar"
        />
        <StatCard
          tone="green" label="Anggaran Disetujui" icon={CheckCircle2}
          value={formatRupiah(BUDGET.disetujui)} footIcon={ShieldCheck} foot="4 kegiatan BKPU & WR2"
        />
        <StatCard
          tone="indigo" label="Telah Dicairkan" icon={CircleDollarSign}
          value={formatRupiah(BUDGET.dicairkan)} footIcon={CheckCircle2} foot="3 termin terealisasi"
        />
        <StatCard tone="maroon" label="Sisa Pagu Anggaran" icon={PiggyBank} value={formatRupiah(sisa)}>
          <div className="stat-progress">
            <span>{sisaPersenLabel}% pagu tersisa</span>
            <div className="bar"><i style={{ width: `${sisaPersen}%` }} /></div>
          </div>
        </StatCard>
      </section>

      {/* Pipeline */}
      <section className="card">
        <div className="section-head">
          <h2><Workflow size={20} /> Status Pipeline Usulan Anggaran</h2>
          <span className="muted">Total {totalUsulan} Pengajuan Terdata</span>
        </div>
        <div className="pipeline">
          {PIPELINE.map((p) => (
            <div key={p.key} className={`pipe pipe-${p.tone}`}>
              <div>
                <span className="pipe-label">{p.label}</span>
                <strong className="pipe-amount">{formatRupiah(p.amount)}</strong>
              </div>
              <span className="pipe-count">{p.countLabel}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Peringatan */}
      <section className="card">
        <div className="section-head">
          <h2 className="warn-title"><BellRing size={20} /> Peringatan & Tenggat Kritis</h2>
          <span className="live-dot" />
        </div>
        <div className="alert-list">
          {ALERTS.map((a) => (
            <div key={a.id} className={`alert-box alert-${a.tone}`}>
              <strong><AlertCircle size={15} /> {a.title}</strong>
              <p>
                {a.before}
                {a.highlight && <mark>{a.highlight}</mark>}
                {a.after}
              </p>
              <Link to={a.to}>
                {a.linkLabel} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Log aktivitas */}
      <section className="card">
        <div className="section-head">
          <h2><History size={20} /> Log Aktivitas Keuangan</h2>
          <span className="muted strong">Terbaru</span>
        </div>
        <ul className="timeline">
          {ACTIVITIES.map((a) => (
            <li key={a.id} className={`tl-${a.tone}`}>
              <span className="tl-dot" />
              <div className="tl-body">
                <div className="tl-head">
                  <strong>{a.title}</strong>
                  <time>{a.time}</time>
                </div>
                <p>
                  {a.before}
                  {a.strong && <b>{a.strong}</b>}
                  {a.after}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Helpdesk */}
      <section className="card">
        <div className="help-head">
          <div className="help-icon"><Headset size={22} /></div>
          <div>
            <h2>Helpdesk & Bantuan Anggaran</h2>
            <p className="muted">{HELPDESK.office}</p>
          </div>
        </div>
        <p className="help-text">
          Butuh konsultasi terkait nomenklatur akun belanja, format RAB, atau kendala pencairan dana termin?
        </p>
        <div className="help-row help-wa">
          <MessageSquare size={18} />
          <span>WhatsApp Hotline BKPU</span>
          <strong>{HELPDESK.whatsapp}</strong>
        </div>
        <div className="help-row help-mail">
          <Mail size={18} />
          <span>Email Layanan Anggaran</span>
          <strong className="mono">{HELPDESK.email}</strong>
        </div>
        <div className="help-foot">
          <span><MapPin size={14} /> {HELPDESK.address}</span>
          <span><Clock size={14} /> {HELPDESK.hours}</span>
        </div>
      </section>
    </div>
  );
}