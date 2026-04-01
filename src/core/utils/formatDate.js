function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * @param {Date|string|number|null|undefined} input
 * @returns {Date|null}
 */
function toDate(input) {
  if (input == null || input === '') return null;
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * @param {Date|string|number|null|undefined} value
 * @returns {string}
 */
export function formatDate(value) {
  const d = toDate(value);
  if (!d) return '';
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * @param {Date|string|number|null|undefined} value
 * @returns {string}
 */
export function formatDateTime(value) {
  const d = toDate(value);
  if (!d) return '';
  const date = `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  return `${date} ${time}`;
}

/**
 * @param {Date|string|number|null|undefined} value
 * @returns {string}
 */
export function formatDateISO(value) {
  const d = toDate(value);
  if (!d) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
