import { NavLink } from 'react-router-dom';
import { CalendarDays, Landmark, LogOut, X } from 'lucide-react';
import { UNIT_MENU } from '../../constants/unitMenu';
import { ROLE_LABELS } from '../../constants/roles';
import { LOGO_SRC } from '../../config/appConfig';
import { PERIOD, PROFILE, UNREAD_NOTIFICATIONS } from '../../data/unitDummy';

export default function Sidebar({ user, open, onClose, onLogout }) {
  const initial = (user?.name ?? '?').trim()[0]?.toUpperCase();

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

        <div className="period-badge">
          <CalendarDays size={15} />
          <span>{PERIOD.label}</span>
          <em>{PERIOD.status}</em>
        </div>

        <nav className="sidebar-nav">
          {UNIT_MENU.map((group, i) => (
            <div key={group.heading ?? i} className="nav-group">
              {group.heading && <p className="nav-heading">{group.heading}</p>}
              {group.items.map(({ label, to, icon: Icon, end, showBadge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link ${group.indent ? 'indent' : ''} ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {showBadge && UNREAD_NOTIFICATIONS > 0 && (
                    <b className="nav-badge">{UNREAD_NOTIFICATIONS}</b>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-top">
            <div className="avatar">{initial}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{PROFILE.position}</span>
            </div>
          </div>
          <div className="sidebar-user-bottom">
            <span className="role-tag">{ROLE_LABELS[user?.role]?.replace(' / ', '/')}</span>
            <button onClick={onLogout}>
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}