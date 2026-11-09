import { Link } from 'react-router-dom';
import { CheckCircle2, FileClock, Wallet, Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRupiah } from '../../utils/format';
import { BUDGET_SUMMARY, RECENT_ACTIVITIES, RECENT_SUBMISSIONS, STATUS_META } from '../../data/unitDummy';
import './unit.css';

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default function UnitDashboard() {
  const { user } = useAuth();
  const { pagu, diajukan, dicairkan, terserap } = BUDGET_SUMMARY;
  const persenTerserap = Math.round((terserap / pagu) * 100);

  return (
    <div className="page-head">
      <h1>Selamat datang kembali, {user.name}</h1>
      <p className="sub">Ringkasan anggaran unit/prodi Anda. Data di bawah masih contoh.</p>

      <div className="stat-grid">
        <StatCard icon={Landmark} label="Pagu Anggaran" value={formatRupiah(pagu)} tone="tone-navy" />
        <StatCard icon={FileClock} label="Total Diajukan" value={formatRupiah(diajukan)} tone="tone-blue" />
        <StatCard icon={Wallet} label="Dana Dicairkan" value={formatRupiah(dicairkan)} tone="tone-maroon" />
        <StatCard icon={CheckCircle2} label="Terserap (SPJ)" value={formatRupiah(terserap)} tone="tone-green" />
      </div>

      <div className="card progress-card">
        <div className="progress-head">
          <strong>Penyerapan Anggaran</strong>
          <span>{persenTerserap}% dari pagu</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${persenTerserap}%` }} />
        </div>
      </div>

      <div className="dash-grid">
        <section className="card">
          <div className="section-head">
            <h2>Pengajuan Terbaru</h2>
            <Link to="/dashboard/unit-prodi/pengajuan" className="link-strong">
              Lihat semua
            </Link>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>No. Pengajuan</th>
                  <th>Kegiatan</th>
                  <th className="num">Nilai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SUBMISSIONS.map((s) => (
                  <tr key={s.id}>
                    <td className="mono">{s.id}</td>
                    <td>{s.title}</td>
                    <td className="num">{formatRupiah(s.amount)}</td>
                    <td>
                      <span className={`badge ${STATUS_META[s.status].className}`}>
                        {STATUS_META[s.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Aktivitas Terbaru</h2>
            <Link to="/dashboard/unit-prodi/notifikasi" className="link-strong">
              Semua
            </Link>
          </div>
          <ul className="activity-list">
            {RECENT_ACTIVITIES.map((a) => (
              <li key={a.id}>
                <span className="activity-dot" />
                <div>
                  <p>{a.text}</p>
                  <small>{a.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}