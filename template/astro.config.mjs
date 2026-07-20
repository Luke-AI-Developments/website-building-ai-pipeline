import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.mjs';

// https://astro.build
export default defineConfig({
  site: SITE.url,
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
});
