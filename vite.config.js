import { defineConfig } from 'vite';

/**
 * La app se publica bajo https://dominio.com/cotizaciones/
 * @see https://vitejs.dev/config/shared-options.html#base
 */
export default defineConfig({
  base: '/cotizaciones/',
});
