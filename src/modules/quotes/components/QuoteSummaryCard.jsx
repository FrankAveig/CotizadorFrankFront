import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './QuoteSummaryCard.module.css';

const QuoteSummaryCard = ({ subtotal, discountAmount, taxAmount, totalAmount, currency }) => {
  const sub = parseFloat(subtotal) || 0;
  const discount = parseFloat(discountAmount) || 0;
  const tax = parseFloat(taxAmount) || 0;
  const total = parseFloat(totalAmount) || 0;

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>Resumen Financiero {currency ? `(${currency})` : ''}</h4>

      <div className={styles.row}>
        <span className={styles.label}>Subtotal</span>
        <span className={styles.value}>{formatCurrency(sub)}</span>
      </div>

      <div className={`${styles.row} ${styles.discount}`}>
        <span className={styles.label}>Descuento (-)</span>
        <span className={styles.value}>{formatCurrency(discount)}</span>
      </div>

      <div className={`${styles.row} ${styles.tax}`}>
        <span className={styles.label}>Impuestos (+)</span>
        <span className={styles.value}>{formatCurrency(tax)}</span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default QuoteSummaryCard;
