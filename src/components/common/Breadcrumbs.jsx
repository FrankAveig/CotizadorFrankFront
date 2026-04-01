import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.path || item.label}>
            {index > 0 && <span className={styles.separator}>/</span>}
            {' '}
            {isLast ? (
              <span className={styles.current}>{item.label}</span>
            ) : (
              <Link to={item.path} className={styles.link}>
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
