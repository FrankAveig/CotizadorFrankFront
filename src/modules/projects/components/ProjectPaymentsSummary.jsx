import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './ProjectPaymentsSummary.module.css';

export default function ProjectPaymentsSummary({
  subtotal,
  taxRate,
  taxAmount,
  totalAmount,
  paidAmount,
  pendingAmount,
  paidPercentage,
  isFullyPaid,
}) {
  const total = parseFloat(totalAmount) || 0;
  const paid = parseFloat(paidAmount) || 0;
  const pending = parseFloat(pendingAmount) || 0;
  const percent = parseFloat(paidPercentage) || 0;
  const sub = parseFloat(subtotal) || 0;
  const tax = parseFloat(taxAmount) || 0;
  const rate = parseFloat(taxRate);
  const showSubtotal = sub > 0;
  const showTax = tax > 0 || (!Number.isNaN(rate) && rate > 0);
  const taxLabel =
    !Number.isNaN(rate) && rate > 0
      ? `Impuesto (${rate}%)`
      : 'Impuesto';

  return (
    <div className={`${styles.card} ${isFullyPaid ? styles.fullyPaid : ''}`}>
      <h4 className={styles.title}>Resumen de Pagos</h4>

      <div className={styles.amounts}>
        {(showSubtotal || showTax) && (
          <>
            {showSubtotal && (
              <div className={styles.row}>
                <span className={styles.label}>Subtotal</span>
                <span className={styles.value}>{formatCurrency(sub)}</span>
              </div>
            )}
            {showTax && (
              <div className={styles.row}>
                <span className={styles.label}>{taxLabel}</span>
                <span className={styles.value}>{formatCurrency(tax)}</span>
              </div>
            )}
            <div className={`${styles.row} ${styles.totalBreakdownRow}`}>
              <span className={styles.label}>Total del proyecto</span>
              <span className={styles.value}>{formatCurrency(total)}</span>
            </div>
            <div className={styles.amountsDivider} />
          </>
        )}
        {!showSubtotal && !showTax && (
          <div className={styles.row}>
            <span className={styles.label}>Monto total</span>
            <span className={styles.value}>{formatCurrency(total)}</span>
          </div>
        )}
        <div className={styles.row}>
          <span className={styles.label}>Pagado</span>
          <span className={`${styles.value} ${styles.paidValue}`}>
            {formatCurrency(paid)}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Pendiente</span>
          <span className={`${styles.value} ${styles.pendingValue}`}>
            {formatCurrency(pending)}
          </span>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.progressLabel}>
            {isFullyPaid ? 'Pagado completamente' : 'Progreso de pago'}
          </span>
          <span className={styles.progressPercent}>{percent.toFixed(1)}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressBar} ${isFullyPaid ? styles.progressComplete : ''}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
