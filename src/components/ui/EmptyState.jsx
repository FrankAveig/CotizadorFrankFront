import styles from './EmptyState.module.css';

export default function EmptyState({ title, message, icon, action }) {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {!icon && (
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 18h40" stroke="currentColor" strokeWidth="2" />
            <circle cx="24" cy="30" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M24 34v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {message && <p className={styles.message}>{message}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
