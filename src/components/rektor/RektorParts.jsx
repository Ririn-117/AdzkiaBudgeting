import { Eye } from 'lucide-react';

// Penanda halaman read-only
export function ReadOnlyTag({ children = 'Mode Pengawasan Eksekutif (Read-Only)' }) {
  return <span className="rk-readonly"><Eye size={13} /> {children}</span>;
}

// Grafik donat SVG. segments: [{ percent, color }]
export function DonutChart({ segments, size = 168, thickness = 22, label, sub }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const arcs = segments.reduce((acc, s) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    const len = (s.percent / 100) * c;
    return [...acc, { ...s, start, end: start + len, len }];
  }, []);
  return (
    <div className="rk-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef0f8" strokeWidth={thickness} />
        {arcs.map((s) => (
          <circle
            key={s.key ?? s.color}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${Math.max(s.len - 2, 0)} ${c - Math.max(s.len - 2, 0)}`}
            strokeDashoffset={-s.start}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      <div className="rk-donut-center">
        <strong>{label}</strong>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  );
}

// Bilah bertumpuk horizontal. segments: [{ percent, color, label }]
export function StackBar({ segments }) {
  return (
    <div className="rk-stack" role="img" aria-label={segments.map((s) => `${s.label} ${s.percent}%`).join(', ')}>
      {segments.map((s) => (
        <i key={s.key ?? s.label} style={{ width: `${s.percent}%`, background: s.color }} title={`${s.label} ${s.percent}%`} />
      ))}
    </div>
  );
}

export function Legend({ items }) {
  return (
    <ul className="rk-legend">
      {items.map((i) => (
        <li key={i.key ?? i.label}><i style={{ background: i.color }} />{i.label}{i.value && <b>{i.value}</b>}</li>
      ))}
    </ul>
  );
}

export function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="u-field">
      <span className="rk-filter-label">{label}</span>
      <select className="u-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </label>
  );
}

// Teks dengan **tebal** sederhana
export function Rich({ text }) {
  return text.split('**').map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>));
}
