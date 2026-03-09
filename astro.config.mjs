// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.twinbox.mx',
	output: 'server',
	adapter: vercel(),
	integrations: [mdx(), tailwind({ applyBaseStyles: false }), sitemap()],
});
