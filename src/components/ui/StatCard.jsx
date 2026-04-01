import styles from './StatCard.module.css';

export default function StatCard({
  title,
  value,
  icon,
  variant = 'primary',
  subtitle,
}) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {icon && <div className={styles.icon}>{icon}</div>}
    </div>
  );
}
