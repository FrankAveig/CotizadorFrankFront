import React, { useMemo } from 'react';
import styles from './DonutChart.module.css';

/**
 * @param {Object} props
 * @param {{ value: number|string, label: string, color: string }[]} props.segments
 * @param {number} [props.size]
 * @param {number} [props.strokeWidth]
 * @param {string} [props.centerLabel]
 * @param {string|number} [props.centerValue]
 */
export function DonutChart({
  segments = [],
  size = 180,
  strokeWidth = 24,
  centerLabel,
  centerValue,
  title,
}) {
  const { circles, total, circumference, cx, cy, r } = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * r;
    const nums = segments.map((s) => parseFloat(String(s.value)));
    const safe = nums.map((n) => (Number.isFinite(n) && n > 0 ? n : 0));
    const total = safe.reduce((a, b) => a + b, 0);

    let cumulative = 0;
    const circles = segments.map((seg, i) => {
      const v = safe[i];
      const arcLen = total > 0 ? (v / total) * circumference : 0;
      const dashoffset = -cumulative;
      cumulative += arcLen;
      return {
        key: `${seg.label}-${i}`,
        color: seg.color || 'var(--color-primary, #3b82f6)',
        arcLen,
        dashoffset,
        label: seg.label,
        value: v,
        delayMs: i * 80,
      };
    });

    return { circles, total, circumference, cx, cy, r };
  }, [segments, size, strokeWidth]);

  return (
    <div className={styles.wrap}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div
        className={styles.chartWrap}
        style={{ width: size, height: size }}
      >
        <svg
          className={styles.svg}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
        >
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            {circles.map((c) => (
              <circle
                key={c.key}
                className={styles.segment}
                cx={cx}
                cy={cy}
                r={r}
                stroke={c.color}
                strokeWidth={strokeWidth}
                style={{
                  '--donut-circ': circumference,
                  '--donut-arc': c.arcLen,
                  '--donut-delay': `${c.delayMs}ms`,
                  strokeDashoffset: c.dashoffset,
                }}
              />
            ))}
          </g>
        </svg>
        <div className={styles.center}>
          {centerValue != null && centerValue !== '' && (
            <span className={styles.centerValue}>{centerValue}</span>
          )}
          {centerLabel != null && centerLabel !== '' && (
            <span className={styles.centerLabel}>{centerLabel}</span>
          )}
        </div>
      </div>
      {segments.length > 0 && (
        <div className={styles.legend}>
          {segments.map((seg, i) => {
            const v = circles[i]?.value ?? (parseFloat(String(seg.value)) || 0);
            return (
              <div key={`${seg.label}-${i}`} className={styles.legendItem}>
                <span
                  className={styles.dot}
                  style={{ backgroundColor: seg.color || 'var(--color-primary, #3b82f6)' }}
                />
                <span className={styles.legendLabel}>{seg.label}</span>
                <span className={styles.legendValue}>{v}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DonutChart;
