import { useState, useEffect } from 'react';
import { useDebounce } from '../../core/hooks/useDebounce';
import styles from './SearchInput.module.css';

export default function SearchInput({
  value: externalValue,
  onChange,
  placeholder = 'Buscar...',
  debounceMs = 400,
}) {
  const [localValue, setLocalValue] = useState(externalValue ?? '');
  const debouncedValue = useDebounce(localValue, debounceMs);

  useEffect(() => {
    if (externalValue !== undefined && externalValue !== localValue) {
      setLocalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    onChange?.(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="text"
        className={styles.input}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
      />
      {localValue && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => setLocalValue('')}
          aria-label="Limpiar búsqueda"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
