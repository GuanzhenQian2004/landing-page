// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://stevenqian.com',
  // Custom domain (CNAME) serves from the root, so no `base` is needed.
  build: {
    format: 'directory',
  },
});
