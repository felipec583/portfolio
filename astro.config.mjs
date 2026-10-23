import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://felipec583.github.io',
  base: '/portfolio',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
