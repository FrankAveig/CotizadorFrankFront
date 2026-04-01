import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>
            {getInitials(user?.name)}
          </div>
          <span className={styles.userName}>{user?.name || 'Usuario'}</span>
        </div>
      </div>
    </header>
  );
}
