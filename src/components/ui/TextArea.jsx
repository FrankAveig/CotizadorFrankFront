import styles from './TextArea.module.css';

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  error,
  disabled = false,
  required = false,
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
