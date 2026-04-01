import { QUOTE_STATUSES, PROJECT_STATUSES, ITEM_STATUSES } from '../../core/constants/statuses';
import styles from './StatusBadge.module.css';

const STATUS_MAPS = {
  quote: QUOTE_STATUSES,
  project: PROJECT_STATUSES,
  item: ITEM_STATUSES,
};

function findStatus(type, value) {
  const map = STATUS_MAPS[type];
  if (!map) return null;

  return Object.values(map).find((s) => s.value === value) || null;
}

export default function StatusBadge({ status, type = 'quote' }) {
  const config = findStatus(type, status);

  if (!config) {
    return (
      <span className={styles.badge} style={{ background: '#f1f5f9', color: '#64748b' }}>
        {status}
      </span>
    );
  }

  const color = config.color || '#64748b';
  const bgColor = `${color}18`;

  return (
    <span
      className={styles.badge}
      style={{ background: bgColor, color }}
    >
      <span className={styles.dot} style={{ background: color }} />
      {config.label}
    </span>
  );
}
