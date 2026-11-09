import { ChevronDown } from 'lucide-react';

export default function SelectField({
  id,
  label,
  icon: Icon,
  error,
  placeholder,
  options,
  value,
  ...rest
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {Icon && <Icon size={18} className="input-icon" />}
        <select
          id={id}
          value={value}
          className={`input has-toggle select ${Icon ? 'has-icon' : ''} ${
            value ? '' : 'is-placeholder'
          } ${error ? 'input-error' : ''}`}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="select-chevron" />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}