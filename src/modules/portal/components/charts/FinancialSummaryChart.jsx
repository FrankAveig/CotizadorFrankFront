import React, { useMemo } from 'react';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import styles from './FinancialSummaryChart.module.css';

function formatMoney(amount, currency) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  const safe = Number.isFinite(n) ? n : 0;
  if (!currency || currency === 'USD') {
    return formatCurrency(safe);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

/**
 * @param {Object} props
 * @param {number|string} props.totalInvested
 * @param {number|string} props.totalPaid
 * @param {number|string} props.totalPending
 * @param {string} [props.currency]
 */
export function FinancialSummaryChart({
  totalInvested,
  totalPaid,
  totalPending,
  currency = 'USD',
}) {
  const {
    invested,
    paid,
    pending,
    wPaid,
    wPending,
    wRem,
    pctPaidOfBar,
    pctPendingOfBar,
  } = useMemo(() => {
    const invested = parseFloat(String(totalInvested));
    const paid = parseFloat(String(totalPaid));
    const pending = parseFloat(String(totalPending));
    const inv = Number.isFinite(invested) && invested > 0 ? invested : 0;
    const p = Number.isFinite(paid) && paid >= 0 ? paid : 0;
    const pen = Number.isFinite(pending) && pending >= 0 ? pending : 0;

    let wPaid = inv > 0 ? (p / inv) * 100 : 0;
    let wPending = inv > 0 ? (pen / inv) * 100 : 0;
    if (wPaid + wPending > 100) {
      const s = wPaid + wPending;
      wPaid = (wPaid / s) * 100;
      wPending = (wPending / s) * 100;
    }
    const wRem = Math.max(0, 100 - wPaid - wPending);
    const barBody = wPaid + wPending + wRem;
    const pctPaidOfBar = barBody > 0 ? (wPaid / barBody) * 100 : 0;
    const pctPendingOfBar = barBody > 0 ? (wPending / barBody) * 100 : 0;

    return {
      invested: Number.isFinite(invested) ? invested : 0,
      paid: p,
      pending: pen,
      wPaid,
      wPending,
      wRem,
      pctPaidOfBar,
      pctPendingOfBar,
    };
  }, [totalInvested, totalPaid, totalPending]);

  const invSafe = invested > 0 ? invested : 1;
  const pctPaidLabel = invested > 0 ? Math.round((paid / invSafe) * 100) : 0;
  const pctPendingLabel = invested > 0 ? Math.round((pending / invSafe) * 100) : 0;

  const showPctRow = wPaid > 0 || wPending > 0 || wRem > 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Resumen Financiero</h3>

      <div className={styles.barClip}>
        <div className={styles.barInner}>
          <div className={styles.barFlex}>
            {wPaid > 0 && (
              <div
                className={styles.segmentPaid}
                style={{ width: `${wPaid}%` }}
              />
            )}
            {wPending > 0 && (
              <div
                className={styles.segmentPending}
                style={{ width: `${wPending}%` }}
              />
            )}
            {wRem > 0 && (
              <div
                className={styles.segmentRemainder}
                style={{ width: `${wRem}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {showPctRow && (
        <div className={styles.pctRow}>
          <div
            className={`${styles.pctCell} ${styles.pctPaid}`}
            style={{ width: `${pctPaidOfBar}%` }}
          >
            {wPaid > 0 ? `${pctPaidLabel}% pagado` : ''}
          </div>
          <div
            className={`${styles.pctCell} ${styles.pctPending}`}
            style={{ width: `${pctPendingOfBar}%` }}
          >
            {wPending > 0 ? `${pctPendingLabel}% pendiente` : ''}
          </div>
          <div
            className={`${styles.pctCell} ${styles.pctRemainder}`}
            style={{ width: `${100 - pctPaidOfBar - pctPendingOfBar}%` }}
          />
        </div>
      )}

      <div className={styles.details}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={`${styles.iconDot} ${styles.iconDotNeutral}`} aria-hidden />
            <span className={styles.rowLabel}>Total Invertido</span>
          </div>
          <span className={styles.rowValue}>{formatMoney(invested, currency)}</span>
        </div>

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <div className={styles.paidIcons}>
              <span className={`${styles.iconDot} ${styles.iconDotSuccess}`} aria-hidden />
              <span className={styles.iconWrap} aria-hidden>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            </div>
            <span className={styles.rowLabel}>Total Pagado</span>
          </div>
          <span className={styles.rowValue}>{formatMoney(paid, currency)}</span>
        </div>

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={`${styles.iconDot} ${styles.iconDotWarning}`} aria-hidden />
            <span className={styles.rowLabel}>Saldo Pendiente</span>
          </div>
          <span className={styles.rowValue}>{formatMoney(pending, currency)}</span>
        </div>
      </div>
    </div>
  );
}

export default FinancialSummaryChart;
