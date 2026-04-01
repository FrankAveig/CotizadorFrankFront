import { formatCurrency } from '../../../core/utils/formatCurrency';
import {
  ITEM_STATUSES,
  PROJECT_ITEM_STATUSES,
} from '../../../core/constants/statuses';
import { getValidProjectItemTransitions } from '../validations/projectItemStatus.validation';
import styles from './ProjectItemsTable.module.css';

const statusLabelMap = [
  ...Object.values(PROJECT_ITEM_STATUSES),
  ...Object.values(ITEM_STATUSES),
].reduce((acc, s) => {
  if (!acc[s.value]) acc[s.value] = s.label;
  return acc;
}, {});

function statusOptionsForItem(currentStatus) {
  const transitions = getValidProjectItemTransitions(currentStatus);
  const seen = new Set();
  const ordered = [];
  if (currentStatus && !seen.has(currentStatus)) {
    seen.add(currentStatus);
    ordered.push(currentStatus);
  }
  transitions.forEach((s) => {
    if (!seen.has(s)) {
      seen.add(s);
      ordered.push(s);
    }
  });
  return ordered;
}

export default function ProjectItemsTable({
  items = [],
  projectId,
  onItemStatusChange,
  itemStatusUpdatingId = null,
}) {
  const canEditStatus = Boolean(projectId && typeof onItemStatusChange === 'function');

  if (!items.length) {
    return (
      <div className={styles.empty}>
        <p>No hay ítems en este proyecto.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Título</th>
            <th className={styles.th}>Descripción</th>
            <th className={`${styles.th} ${styles.right}`}>Cantidad</th>
            <th className={`${styles.th} ${styles.right}`}>Precio Unit.</th>
            <th className={`${styles.th} ${styles.right}`}>Subtotal</th>
            <th className={styles.th}>Estado</th>
            {canEditStatus && (
              <th className={styles.th}>Cambiar estado</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const itemId = item._id ?? item.id;
            const status = item.status;
            const badgeClass = styles[`status_${status}`]
              ? styles[`status_${status}`]
              : styles.status_unknown;
            const options = statusOptionsForItem(status);
            const selectDisabled =
              !canEditStatus ||
              !itemId ||
              itemStatusUpdatingId === itemId ||
              options.length <= 1;

            return (
              <tr key={itemId || idx} className={styles.tr}>
                <td className={styles.td}>{idx + 1}</td>
                <td className={styles.td}>{item.title}</td>
                <td className={`${styles.td} ${styles.desc}`}>
                  {item.description || '—'}
                </td>
                <td className={`${styles.td} ${styles.right}`}>
                  {item.quantity}
                </td>
                <td className={`${styles.td} ${styles.right}`}>
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className={`${styles.td} ${styles.right}`}>
                  {formatCurrency(item.subtotal)}
                </td>
                <td className={styles.td}>
                  <span
                    className={`${styles.statusBadge} ${badgeClass}`}
                  >
                    {statusLabelMap[status] || status || '—'}
                  </span>
                </td>
                {canEditStatus && (
                  <td className={styles.td}>
                    {itemId ? (
                      <select
                        key={`${itemId}-${status}`}
                        className={styles.statusSelect}
                        value={status}
                        disabled={selectDisabled}
                        aria-label={`Cambiar estado: ${item.title || 'ítem'}`}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next !== status) {
                            onItemStatusChange(itemId, next);
                          }
                        }}
                      >
                        {options.map((s) => (
                          <option key={s} value={s}>
                            {statusLabelMap[s] || s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={styles.noId}>—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
