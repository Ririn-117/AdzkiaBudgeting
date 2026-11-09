import { Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { ROLE_LABELS } from '../../constants/roles';

export default function Topbar({ user, onMenuClick }) {
  const initial = user.name?.trim()?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="topbar-app">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu">
        <Menu size={22} />
      </button>

      <div className="topbar-spacer" />

      <Link to="/dashboard/unit-prodi/notifikasi" className="icon-btn" aria-label="Notifikasi">
        <Bell size={20} />
        <span className="dot" />
      </Link>

      <div className="user-chip">
        <div className="avatar">{initial}</div>
        <div className="user-meta">
          <strong>{user.name}</strong>
          <span>{ROLE_LABELS[user.role]}</span>
        </div>
      </div>
    </header>
  );
}