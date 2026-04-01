import styles from './Pagination.module.css';

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}) {
  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label="Página anterior"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Anterior
      </button>

      <span className={styles.info}>
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        type="button"
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label="Página siguiente"
      >
        Siguiente
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
