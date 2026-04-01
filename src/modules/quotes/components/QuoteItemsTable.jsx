import { formatCurrency } from '../../../core/utils/formatCurrency';
import { ITEM_STATUSES } from '../../../core/constants/statuses';
import styles from './QuoteItemsTable.module.css';

const getStatusLabel = (status) => {
  if (!status) return ITEM_STATUSES.PENDING.label;
  const found = Object.values(ITEM_STATUSES).find((s) => s.value === status);
  return found ? found.label : status;
};

const getStatusColor = (status) => {
  const map = {
    pending: '#f59e0b',
    accepted: '#22c55e',
    rejected: '#ef4444',
  };
  return map[status] || '#6b7280';
};

const QuoteItemsTable = ({ items = [], emphasizeItemStatus = false }) => {
  if (!items.length) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>No hay ítems en esta cotización.</p>
      </div>
    );
  }

  const total = items.reduce((sum, item) => {
    if (item.subtotal != null && item.subtotal !== '') {
      return sum + (parseFloat(item.subtotal) || 0);
    }
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Título</th>
            <th className={styles.th}>Descripción</th>
            <th className={styles.thRight}>Cantidad</th>
            <th className={styles.thRight}>Precio Unit.</th>
            <th className={styles.thRight}>Subtotal</th>
            <th className={styles.th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.unitPrice) || 0;
            const subtotal =
              item.subtotal != null && item.subtotal !== ''
                ? parseFloat(item.subtotal) || 0
                : qty * price;
            const rowClass =
              emphasizeItemStatus && item.status === 'accepted'
                ? styles.rowAccepted
                : emphasizeItemStatus && item.status === 'rejected'
                  ? styles.rowRejected
                  : '';

            return (
              <tr key={item.id || index} className={rowClass}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{item.title}</td>
                <td className={styles.td}>
                  {item.description ? (
                    <span className={styles.description}>{item.description}</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className={styles.tdRight}>{qty}</td>
                <td className={styles.tdRight}>{formatCurrency(price)}</td>
                <td className={styles.tdRight}>{formatCurrency(subtotal)}</td>
                <td className={styles.td}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: getStatusColor(item.status),
                  }}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
              </tr>
            );
          })}
          <tr className={styles.totalRow}>
            <td colSpan={5} className={styles.totalLabel}>Total</td>
            <td className={styles.totalValue}>{formatCurrency(total)}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default QuoteItemsTable;
