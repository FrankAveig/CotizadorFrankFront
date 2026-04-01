import { useClientAuth } from '../../context/ClientAuthContext';
import styles from './PortalHeader.module.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function PortalHeader({ onToggleSidebar }) {
  const { client } = useClientAuth();

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
            {getInitials(client?.contactName)}
          </div>
          <span className={styles.userName}>
            {client?.contactName || 'Cliente'}
          </span>
        </div>
      </div>
    </header>
  );
}
