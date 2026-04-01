import { useState } from 'react';
import styles from './Input.module.css';

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  maxLength,
  min,
  max,
  step,
  autoComplete,
  showPasswordToggle,
  error,
  disabled = false,
  required = false,
  className = '',
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const usePasswordToggle =
    type === 'password' && showPasswordToggle !== false;
  const inputType =
    usePasswordToggle && passwordVisible ? 'text' : type;

  const inputClassName = `${styles.input} ${error ? styles.inputError : ''} ${usePasswordToggle ? styles.inputWithToggle : ''}`.trim();

  const inputEl = (
    <input
      id={name}
      name={name}
      type={inputType}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      autoComplete={autoComplete}
      disabled={disabled}
      required={required}
      className={inputClassName}
    />
  );

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {usePasswordToggle ? (
        <div className={styles.inputWrap}>
          {inputEl}
          <button
            type="button"
            className={styles.toggleVisibility}
            disabled={disabled}
            onClick={() => setPasswordVisible((v) => !v)}
            aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      ) : (
        inputEl
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
