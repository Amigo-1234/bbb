import { defineConfig } from 'astro/config';
import { existsSync, mkdirSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Private review mode (local only): swaps in Phase 6 media awaiting consent.
const privateIndex = fileURLToPath(new URL('./private-media/index.ts', import.meta.url));
const review = process.env.BIA_PRIVATE_REVIEW === '1';
if (review && (process.env.VERCEL || process.env.CI)) {
  throw new Error('BIA_PRIVATE_REVIEW must never be used for hosted/CI builds.');
}
if (review && !existsSync(privateIndex)) {
  throw new Error('BIA_PRIVATE_REVIEW=1 but private-media/ is missing — run scripts/prepare-review-media.sh first.');
}

/** Copies the private review videos into the local review build only. */
const reviewVideos = {
  name: 'bia-review-videos',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (!review) return;
      const out = fileURLToPath(new URL('review-media/', dir));
      mkdirSync(out, { recursive: true });
      cpSync(fileURLToPath(new URL('./private-media/videos/', import.meta.url)), out, { recursive: true });
    },
  },
};

export default defineConfig({
  site: 'https://biajupeb.com.ng',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  integrations: [reviewVideos],
  vite: review ? { resolve: { alias: [{ find: /^\.{1,2}\/(?:.*\/)?review-media$/, replacement: privateIndex }] } } : {},
});
