import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { formatDate } from '../../../core/utils/formatDate';
import { PAYMENT_METHODS } from '../../../core/constants/statuses';
import styles from './PaymentHistoryTable.module.css';

const methodLabelMap = Object.values(PAYMENT_METHODS).reduce((acc, m) => {
  acc[m.value] = m.label;
  return acc;
}, {});

export default function PaymentHistoryTable({ payments = [], loading = false }) {
  if (loading) {
    return (
      <div className={styles.loaderWrap}>
        <Loader size="md" />
      </div>
    );
  }

  if (!payments.length) {
    return (
      <EmptyState
        title="Sin pagos"
        message="No se han registrado pagos para este proyecto."
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Fecha</th>
            <th className={`${styles.th} ${styles.right}`}>Monto</th>
            <th className={`${styles.th} ${styles.right}`}>% Equivalente</th>
            <th className={styles.th}>Método</th>
            <th className={styles.th}>Referencia</th>
            <th className={styles.th}>Notas</th>
            <th className={styles.th}>Registrado por</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, idx) => (
            <tr key={payment._id || payment.id || idx} className={styles.tr}>
              <td className={styles.td}>{formatDate(payment.paymentDate)}</td>
              <td className={`${styles.td} ${styles.right}`}>
                <span className={styles.amount}>
                  {formatCurrency(payment.amount)}
                </span>
              </td>
              <td className={`${styles.td} ${styles.right}`}>
                {payment.percentage != null
                  ? `${parseFloat(payment.percentage).toFixed(1)}%`
                  : '—'}
              </td>
              <td className={styles.td}>
                {methodLabelMap[payment.paymentMethod] || payment.paymentMethod}
              </td>
              <td className={styles.td}>{payment.reference || '—'}</td>
              <td className={`${styles.td} ${styles.notes}`}>
                {payment.notes || '—'}
              </td>
              <td className={styles.td}>
                {payment.registeredBy?.name || payment.registeredBy || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
