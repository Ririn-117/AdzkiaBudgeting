import { Menu, User } from 'lucide-react';
import { WR2 } from '../../data/wr2Data';

export default function Wr2Topbar({ onMenuClick }) {
  return (
    <header className="topbar-app">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu"><Menu size={22} /></button>
      <span className="bk-chip"><i className="bk-live-dot" /> Sinkronisasi Real-time Aktif</span>
      <div className="topbar-spacer" />
      <div className="user-chip">
        <div className="user-meta bk-right"><strong>{WR2.name}</strong><span>{WR2.role}</span></div>
        <div className="avatar maroon"><User size={18} /></div>
      </div>
    </header>
  );
}