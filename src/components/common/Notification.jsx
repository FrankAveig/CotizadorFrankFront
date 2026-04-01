import { useApp } from '../../context/AppContext';
import styles from './Notification.module.css';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export default function Notification() {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.toast} ${styles[notification.type] || styles.info}`}
        >
          <span className={styles.icon}>{ICONS[notification.type] || ICONS.info}</span>
          <span className={styles.message}>{notification.message}</span>
          <button
            className={styles.close}
            onClick={() => removeNotification(notification.id)}
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
