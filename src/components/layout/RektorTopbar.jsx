import { ChevronRight, Eye, Menu, ShieldCheck } from 'lucide-react';
import { PERIOD, REKTOR_PROFILE } from '../../data/rektorData';

export default function RektorTopbar({ user, onMenuClick }) {
  const name = user?.name && user.name !== 'Rektor' ? user.name : REKTOR_PROFILE.name;
  const initial = name.replace(/^(Prof\.|Dr\.|H\.|\s)+/g, '').trim()[0]?.toUpperCase() ?? 'R';

  return (
    <header className="topbar-app">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu"><Menu size={22} /></button>
      <div className="crumb">
        <ShieldCheck size={16} />
        <span className="crumb-faculty">Audit & Oversight Dashboard</span>
        <ChevronRight size={14} className="crumb-sep" />
        <strong>Rektorat Universitas Adzkia</strong>
      </div>
      <div className="topbar-spacer" />
      <div className="rk-live-chip">
        <i /> {PERIOD.ta} • Data Terkonsolidasi Real-time
      </div>
      <div className="role-chip"><Eye size={14} /> Mode: <strong>Read-Only</strong></div>
      <div className="user-chip">
        <div className="avatar">{initial}</div>
        <div className="user-meta"><strong>{name}</strong><span>{REKTOR_PROFILE.title}</span></div>
      </div>
    </header>
  );
}
