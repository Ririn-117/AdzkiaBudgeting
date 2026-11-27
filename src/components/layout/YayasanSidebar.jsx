import { NavLink } from 'react-router-dom';
import { Landmark, LogOut, User, X } from 'lucide-react';
import { YAYASAN_MENU } from '../../constants/yayasanMenu';
import { LOGO_SRC } from '../../config/appConfig';
import { useYayasan } from '../../context/YayasanContext';
import { YAYASAN } from '../../data/yayasanData';

export default function YayasanSidebar({ open, onClose, onLogout }) {
  const { unreadNotifCount } = useYayasan();
  const badges = {
    pending: 3,
    notif: unreadNotifCount || 4,
  };

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          {LOGO_SRC ? (
            <img src={LOGO_SRC} alt="Logo Universitas Adzkia" className="sidebar-logo-img" />
          ) : (
            <div className="sidebar-logo">
              <Landmark size={20} />
            </div>
          )}
          <div>
            <strong>E-Budgeting</strong>
            <span>Univ. Adzkia Padang</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-portal-badge">
          <span className="dot" /> PORTAL OTORISATOR YAYASAN
        </div>

        <nav className="sidebar-nav">
          {YAYASAN_MENU.map((g) => (
            <div key={g.heading} className="nav-group">
              <p className="nav-heading">{g.heading}</p>
              {g.items.map(({ label, to, icon: Icon, end, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {badge && badges[badge] > 0 && (
                    <b
                      className="nav-badge"
                      style={{
                        background: badge === 'pending' ? '#b91c1c' : '#3b82f6',
                      }}
                    >
                      {badges[badge]}
                    </b>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="yys-sidebar-user">
          <div className="yys-user-profile-row">
            <div
              className="avatar"
              style={{
                background: '#450a0a',
                color: '#fca5a5',
                width: 38,
                height: 38,
              }}
            >
              <User size={20} />
            </div>
            <div>
              <strong className="yys-user-name">{YAYASAN.short}</strong>
              <span className="yys-user-role">{YAYASAN.position}</span>
              <span className="yys-user-tag">{YAYASAN.tag}</span>
            </div>
          </div>
          <button className="yys-btn-logout" onClick={onLogout}>
            <LogOut size={15} /> Keluar Sistem
          </button>
        </div>
      </aside>
    </>
  );
}
