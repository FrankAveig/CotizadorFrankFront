import Loader from './Loader';
import EmptyState from './EmptyState';
import styles from './Table.module.css';

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No se encontraron registros.',
}) {
  if (loading) {
    return (
      <div className={styles.loaderWrap}>
        <Loader size="md" />
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState title="Sin datos" message={emptyMessage} />;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id ?? idx} className={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
