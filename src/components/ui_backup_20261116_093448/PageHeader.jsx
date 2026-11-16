import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ crumbs = [], title, subtitle, badge, actions, accent = false }) {
  return (
    <header className="u-ph">
      <div>
        {crumbs.length > 0 && (
          <nav className="u-crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="u-crumb-item">
                {i > 0 && <ChevronRight size={12} />}
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span className="cur">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className={accent ? 'accent' : ''}>
          {title}
          {badge}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="u-ph-actions">{actions}</div>}
    </header>
  );
}
