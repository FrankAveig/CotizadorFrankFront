/**
 * Base URL de la SPA (sin barra final). Coincide con `base` de Vite.
 * En desarrollo y build: import.meta.env.BASE_URL termina en /
 */
export function getAppBasename() {
  const raw = import.meta.env.BASE_URL || '/';
  return raw.replace(/\/$/, '');
}

/**
 * Ruta absoluta en el sitio para usar en window.location (401, logout, etc.)
 * @param {string} path - ej. "/login", "/portal/login"
 */
export function appHref(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = getAppBasename();
  if (!base) return p;
  return `${base}${p}`;
}
