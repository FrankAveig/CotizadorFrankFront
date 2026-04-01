import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './PortalProjectProgress.module.css';

export default function PortalProjectProgress({
  subtotal,
  taxRate,
  taxAmount,
  totalAmount,
  paidAmount,
  pendingAmount,
  paidPercentage,
  isFullyPaid = false,
}) {
  const clampedPercent = Math.min(Math.max(paidPercentage || 0, 0), 100);
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
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Progreso de Pago</h3>
        {isFullyPaid && (
          <span className={styles.paidBadge}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Pagado
          </span>
        )}
      </div>

      {(showSubtotal || showTax) && (
        <div className={styles.breakdown}>
          {showSubtotal && (
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Subtotal</span>
              <span className={styles.breakdownValue}>{formatCurrency(sub)}</span>
            </div>
          )}
          {showTax && (
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>{taxLabel}</span>
              <span className={styles.breakdownValue}>{formatCurrency(tax)}</span>
            </div>
          )}
          <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
            <span className={styles.breakdownLabel}>Total del proyecto</span>
            <span className={styles.breakdownValue}>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      )}

      <div className={styles.barContainer}>
        <div
          className={`${styles.barFill} ${isFullyPaid ? styles.barComplete : ''}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      <div className={styles.percentage}>
        {clampedPercent.toFixed(0)}% completado
      </div>

      <div className={styles.amounts}>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Total</span>
          <span className={styles.amountValue}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Pagado</span>
          <span className={`${styles.amountValue} ${styles.amountPaid}`}>
            {formatCurrency(paidAmount)}
          </span>
        </div>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Pendiente</span>
          <span className={`${styles.amountValue} ${styles.amountPending}`}>
            {formatCurrency(pendingAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
