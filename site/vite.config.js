import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The résumé link is built in only when the PDF is in site/public/assets/.
const HAS_RESUME = existsSync(fileURLToPath(new URL('./public/assets/resume.pdf', import.meta.url)));

export default defineConfig(({ isSsrBuild, isPreview }) => ({
  base: '/Benjamin-Elmore-Website/',
  appType: isPreview ? 'mpa' : 'spa',
  plugins: [react()],
  define: { __HAS_RESUME__: JSON.stringify(HAS_RESUME) },
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
