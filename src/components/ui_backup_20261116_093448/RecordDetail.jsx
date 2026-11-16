import { Link } from 'react-router-dom';
import { AlertCircle, Info } from 'lucide-react';
import PageHeader from './PageHeader';

// Kerangka halaman detail yang dipakai bersama (Pengajuan, Pencairan, LPJ).
export default function RecordDetail({
  crumbs,
  title,
  subtitle,
  badge,
  actions,
  fields = [],
  notes = [],
  timeline = [],
  timelineTitle = 'Riwayat Proses',
  children,
}) {
  return (
    <div className="upage">
      <PageHeader crumbs={crumbs} title={title} subtitle={subtitle} badge={badge} actions={actions} accent />

      {notes.map((n) => (
        <div key={n.title} className={`u-note u-note-${n.tone ?? 'info'}`}>
          {n.tone === 'warn' || n.tone === 'danger' ? <AlertCircle size={18} /> : <Info size={18} />}
          <div>
            <strong>{n.title}</strong>
            <p>{n.text}</p>
            {n.to && (
              <Link to={n.to} className="u-link">
                {n.linkLabel}
              </Link>
            )}
          </div>
        </div>
      ))}

      <div className="u-detail-grid">
        <section className="card">
          <h2 className="u-h2">Informasi</h2>
          <dl className="u-dl">
            {fields.map((f) => (
              <div key={f.label} className={f.wide ? 'wide' : ''}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {timeline.length > 0 && (
          <section className="card">
            <h2 className="u-h2">{timelineTitle}</h2>
            <ul className="u-timeline">
              {timeline.map((t) => (
                <li key={t.title + t.time} className={`tl-${t.tone ?? 'slate'}`}>
                  <i />
                  <div>
                    <div className="u-tl-head">
                      <strong>{t.title}</strong>
                      <time>{t.time}</time>
                    </div>
                    <p>{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {children}
    </div>
  );
}
