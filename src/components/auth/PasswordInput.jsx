import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  id,
  value,
  onChange,
  disabled,
  hasError,
  icon: Icon = Lock,
  ...rest
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-wrap">
      <Icon size={18} className="input-icon" />
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input has-icon has-toggle ${hasError ? 'input-error' : ''}`}
        {...rest}
      />
      <button
        type="button"
        className="toggle-btn"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        disabled={disabled}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}