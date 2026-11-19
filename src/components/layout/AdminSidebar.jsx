import { NavLink } from 'react-router-dom';
import { CalendarDays, Landmark, LogOut, ShieldCheck, X } from 'lucide-react';
import { ADMIN_MENU } from '../../constants/adminMenu';
import { LOGO_SRC } from '../../config/appConfig';

export default function AdminSidebar({ user, open, onClose, onLogout }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          {LOGO_SRC ? (
            <img src={LOGO_SRC} alt="Logo Universitas Adzkia" className="sidebar-logo-img" />
          ) : (
            <div className="sidebar-logo"><Landmark size={20} /></div>
          )}
          <div><strong>Portal Administrator</strong><span>Universitas Adzkia</span></div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button>
        </div>

        <div className="period-badge">
          <CalendarDays size={15} /><span>TA 2024/2025</span><em>Genap</em>
        </div>

        <nav className="sidebar-nav">
          {ADMIN_MENU.map((group, i) => (
            <div key={group.heading ?? i} className="nav-group">
              {group.heading && <p className="nav-heading">{group.heading}</p>}
              {group.items.map(({ label, to, icon: Icon, end, showBadge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} /><span>{label}</span>
                  {showBadge && <b className="nav-badge">2</b>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-top">
            <div className="avatar">{(user?.name ?? 'A').trim()[0]?.toUpperCase()}</div>
            <div><strong>{user?.name ?? 'Administrator'}</strong><span>Super Admin Tier 1</span></div>
          </div>
          <div className="sidebar-user-bottom">
            <span className="role-tag"><ShieldCheck size={12} /> Root Admin</span>
            <button onClick={onLogout}><LogOut size={14} /> Keluar</button>
          </div>
        </div>
      </aside>
    </>
  );
}
