import { AlarmClock, ArrowLeftRight, ChevronRight, Landmark, Menu } from 'lucide-react';
import { ROLE_LABELS } from '../../constants/roles';
import { DEADLINE, PROFILE } from '../../data/unitDummy';

export default function Topbar({ user, onMenuClick }) {
  const initial = (user?.name ?? '?').trim()[0]?.toUpperCase();

  return (
    <header className="topbar-app">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu">
        <Menu size={22} />
      </button>

      <div className="crumb">
        <Landmark size={16} />
        <span className="crumb-faculty">{PROFILE.faculty}</span>
        <ChevronRight size={14} className="crumb-sep" />
        <strong>{PROFILE.prodi}</strong>
      </div>

      <div className="topbar-spacer" />

      <div className="deadline-chip">
        <AlarmClock size={18} />
        <div>
          <strong>Batas Pengajuan: {DEADLINE.date}</strong>
          <span>Sisa {DEADLINE.daysLeft} Hari</span>
        </div>
      </div>

      <div className="role-chip">
        <ArrowLeftRight size={14} />
        Peran: <strong>{ROLE_LABELS[user.role]?.replace(' / ', '/')}</strong>
      </div>

      <div className="user-chip">
        <div className="avatar">{initial}</div>
        <div className="user-meta">
          <strong>{PROFILE.shortName}</strong>
          <span>{PROFILE.unitCode}</span>
        </div>
      </div>
    </header>
  );
}