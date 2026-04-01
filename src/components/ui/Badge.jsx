import styles from './Badge.module.css';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
}) {
  const classes = [styles.badge, styles[variant], styles[size]]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}
