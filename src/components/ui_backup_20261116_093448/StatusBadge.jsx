export default function StatusBadge({ tone = 'gray', icon: Icon, dot = false, children }) {
  return (
    <span className={`u-badge u-badge-${tone}`}>
      {dot && <i className="u-badge-dot" />}
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}
