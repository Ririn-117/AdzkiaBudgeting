import { NavLink } from 'react-router-dom';
import { CalendarDays, Landmark, LogOut, X } from 'lucide-react';
import { UNIT_MENU } from '../../constants/unitMenu';
import { ROLE_LABELS } from '../../constants/roles';
import { LOGO_SRC } from '../../config/appConfig';
import { PERIOD, PROFILE } from '../../data/unitDummy';
import { useNotifications } from '../../context/NotificationContext';

export default function Sidebar({ user, open, onClose, onLogout }) {
  const { unreadCount } = useNotifications();

  // Debug: log menu structure to console – helps verify that the merged data is loaded
  console.log('UNIT_MENU length:', UNIT_MENU?.length);
  console.log('UNIT_MENU content:', UNIT_MENU);

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
          {/* Render menu groups if they exist, otherwise show a fallback message */}
          {UNIT_MENU && UNIT_MENU.length ? (
            UNIT_MENU.map((group, i) => (
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
                    {showBadge && unreadCount > 0 && <b className="nav-badge">{unreadCount}</b>}
                  </NavLink>
                ))}
              </div>
            ))
          ) : (
            <p className="nav-empty">Menu tidak tersedia</p>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-top">
            <div className="avatar">{(user?.name ?? '?').trim()[0]?.toUpperCase()}</div>
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
