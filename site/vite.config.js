import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// The résumé link is built in only when the PDF is in site/public/assets/.
const HAS_RESUME = existsSync(fileURLToPath(new URL('./public/assets/Benjamin_Elmore_Resume.pdf', import.meta.url)));

// Footer build stamp: the last commit that changed site/ and that commit's date (never the clock),
// so rebuilding the same commit gives identical output. Empty strings if git is unavailable.
function gitValue(cmd) {
  try {
    return execSync(cmd, { cwd: fileURLToPath(new URL('.', import.meta.url)), stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}
const SHA = gitValue('git log -1 --format=%h -- .');
const BUILD_SHA = /^[0-9a-f]{7,12}$/.test(SHA) ? SHA : '';
const DATE = BUILD_SHA ? gitValue('git log -1 --format=%cs -- .') : '';
const BUILD_DATE = /^\d{4}-\d{2}-\d{2}$/.test(DATE) ? DATE : '';

export default defineConfig(({ isSsrBuild, isPreview }) => ({
  base: '/Benjamin-Elmore-Website/',
  appType: isPreview ? 'mpa' : 'spa',
  plugins: [react()],
  define: {
    __HAS_RESUME__: JSON.stringify(HAS_RESUME),
    __BUILD_SHA__: JSON.stringify(BUILD_SHA),
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  build: isSsrBuild
    ? { outDir: '.ssr', emptyOutDir: true, copyPublicDir: false }
    : {
        outDir: process.env.SITE_OUT_DIR || '../docs',
        emptyOutDir: true,
        sourcemap: false,
        modulePreload: { polyfill: false },
        assetsInlineLimit: 0,
        rollupOptions: {
          output: {
            entryFileNames: 'assets/app-[hash].js',
            chunkFileNames: 'assets/app-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
      },
}));
