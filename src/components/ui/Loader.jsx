import styles from './Loader.module.css';

export default function Loader({ size = 'md', fullPage = false }) {
  const classes = [
    styles.loader,
    styles[size],
    fullPage ? styles.fullPage : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        <span className={`${styles.spinner} ${styles[size]}`} />
      </div>
    );
  }

  return <span className={`${styles.spinner} ${styles[size]}`} />;
}
