export default function TextField({ id, label, icon: Icon, error, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {Icon && <Icon size={18} className="input-icon" />}
        <input
          id={id}
          className={`input ${Icon ? 'has-icon' : ''} ${error ? 'input-error' : ''}`}
          aria-invalid={Boolean(error)}
          {...rest}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}