import { Calendar, Menu, User } from 'lucide-react';
import { YAYASAN } from '../../data/yayasanData';

export default function YayasanTopbar({ onMenuClick }) {
  return (
    <header className="topbar-app" style={{ gap: '1rem', flexWrap: 'wrap' }}>
      <button className="menu-btn" onClick={onMenuClick} aria-label="Buka menu">
        <Menu size={22} />
      </button>

      <span className="yys-topbar-pill ta">
        <Calendar size={14} /> TA 2024/2025 Genap (Aktif)
      </span>

      <span className="yys-topbar-pill sync">
        <span className="green-dot" /> Sinkronisasi Perbankan Real-time
      </span>

      <div className="topbar-spacer" />

      <div className="user-chip">
        <div
          className="avatar"
          style={{
            background: '#450a0a',
            color: '#fca5a5',
            width: 36,
            height: 36,
          }}
        >
          <User size={18} />
        </div>
        <div className="user-meta" style={{ textAlign: 'left' }}>
          <strong style={{ fontSize: '0.82rem' }}>{YAYASAN.name}</strong>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {YAYASAN.role}
          </span>
        </div>
      </div>
    </header>
  );
}
