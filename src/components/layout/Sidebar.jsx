import { NavLink } from 'react-router-dom';
import { Landmark, LogOut, X } from 'lucide-react';
import { UNIT_MENU } from '../../constants/unitMenu';

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Landmark size={20} />
          </div>
          <div>
            <strong>E-Budgeting</strong>
            <span>Universitas Adzkia</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {UNIT_MENU.map((group) => (
            <div key={group.heading} className="nav-group">
              <p className="nav-heading">{group.heading}</p>
              {group.items.map(({ label, to, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button className="nav-link logout" onClick={onLogout}>
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </aside>
    </>
  );
}