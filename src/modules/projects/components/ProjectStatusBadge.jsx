import { PROJECT_STATUSES } from '../../../core/constants/statuses';
import styles from './ProjectStatusBadge.module.css';

const statusMap = Object.values(PROJECT_STATUSES).reduce((acc, s) => {
  acc[s.value] = s;
  return acc;
}, {});

export default function ProjectStatusBadge({ status }) {
  const config = statusMap[status] || { label: status, color: '#6b7280' };

  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor: `${config.color}18`,
        color: config.color,
        borderColor: `${config.color}40`,
      }}
    >
      {config.label}
    </span>
  );
}
