/**
 * @param {Record<string, unknown>} params
 * @returns {string}
 */
export function buildQueryParams(params) {
  if (!params || typeof params !== 'object') return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (value === '') continue;
    search.append(key, String(value));
  }
  const q = search.toString();
  return q ? `?${q}` : '';
}
