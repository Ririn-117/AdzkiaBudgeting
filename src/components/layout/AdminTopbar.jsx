import { ChevronRight, Menu, ShieldCheck } from 'lucide-react';
import { ROLE_LABELS } from '../../constants/roles';

export default function AdminTopbar({ user, onMenuClick }) {
  const initial = (user?.name ?? 'A').trim()[0]?.toUpperCase();
  return (
    <header className="topbar-app">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu"><Menu size={22} /></button>
      <div className="crumb">
        <ShieldCheck size={16} />
        <span className="crumb-faculty">Tata Kelola Sistem</span>
        <ChevronRight size={14} className="crumb-sep" />
        <strong>Administrator</strong>
      </div>
      <div className="topbar-spacer" />
      <div className="role-chip">Status: <strong>Aktif & Sinkron</strong></div>
      <div className="user-chip">
        <div className="avatar">{initial}</div>
        <div className="user-meta"><strong>{user?.name ?? 'Administrator'}</strong><span>{ROLE_LABELS[user?.role] ?? 'Administrator'}</span></div>
      </div>
    </header>
  );
}
