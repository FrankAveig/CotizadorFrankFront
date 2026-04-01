/**
 * @param {Array<{ quantity?: number, unitPrice?: number }>} items
 * @returns {number}
 */
export function calculateSubtotal(items) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const q = Number(item?.quantity) || 0;
    const p = Number(item?.unitPrice) || 0;
    return sum + q * p;
  }, 0);
}

/**
 * @param {number} subtotal
 * @param {number} discount
 * @param {number} tax
 * @returns {number}
 */
export function calculateTotal(subtotal, discount, tax) {
  const s = Number(subtotal) || 0;
  const d = Number(discount) || 0;
  const t = Number(tax) || 0;
  return s - d + t;
}

/**
 * @param {number} part
 * @param {number} total
 * @returns {number}
 */
export function calculatePercentage(part, total) {
  const t = Number(total);
  if (!t) return 0;
  const p = Number(part) || 0;
  return Math.round((p / t) * 100 * 100) / 100;
}
