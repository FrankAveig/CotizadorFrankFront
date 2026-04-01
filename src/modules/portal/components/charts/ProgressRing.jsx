import React, { useMemo } from 'react';
import styles from './ProgressRing.module.css';

/**
 * @param {Object} props
 * @param {number|string} props.percentage
 * @param {number} [props.size]
 * @param {number} [props.strokeWidth]
 * @param {string} [props.color]
 * @param {string} [props.bgColor]
 * @param {string} [props.label]
 * @param {string} [props.sublabel]
 */
export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#3b82f6',
  bgColor = '#e5e7eb',
  label,
  sublabel,
}) {
  const { cx, cy, r, circumference, pct, dashOffsetStart, dashOffsetEnd } = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * r;
    const raw = parseFloat(String(percentage));
    const pct = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0;
    const filled = (pct / 100) * circumference;
    const dashOffsetStart = circumference;
    const dashOffsetEnd = circumference - filled;
    return { cx, cy, r, circumference, pct, dashOffsetStart, dashOffsetEnd };
  }, [percentage, size, strokeWidth]);

  const fontSize = Math.max(0.85, Math.min(1.35, size / 72));

  return (
    <div className={styles.wrap}>
      <div className={styles.ringWrap} style={{ width: size, height: size }}>
        <svg
          className={styles.svg}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
        >
          <circle
            className={styles.track}
            cx={cx}
            cy={cy}
            r={r}
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          <circle
            className={styles.progress}
            cx={cx}
            cy={cy}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              '--ring-circ': circumference,
              '--ring-offset': dashOffsetEnd,
            }}
          />
        </svg>
        <span
          className={styles.centerPct}
          style={{ fontSize: `${fontSize}rem` }}
        >
          {Math.round(pct)}
          <span style={{ fontSize: '0.55em', fontWeight: 700, marginLeft: '0.05em' }}>%</span>
        </span>
      </div>
      {(label != null && label !== '') || (sublabel != null && sublabel !== '') ? (
        <div className={styles.labels}>
          {label != null && label !== '' && (
            <span className={styles.label}>{label}</span>
          )}
          {sublabel != null && sublabel !== '' && (
            <span className={styles.sublabel}>{sublabel}</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ProgressRing;
