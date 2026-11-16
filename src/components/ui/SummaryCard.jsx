export default function SummaryCard({ tone = 'navy', label, icon: Icon, value, sub, children }) {
  return (
    <div className={`u-sum u-sum-${tone}`}>
      <div className="u-sum-top">
        <span>{label}</span>
        {Icon && <Icon size={19} />}
      </div>
      <p className="u-sum-value">{value}</p>
      {sub && <p className="u-sum-sub">{sub}</p>}
      {children}
    </div>
  );
}
