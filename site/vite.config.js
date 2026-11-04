import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild, isPreview }) => ({
  base: '/Benjamin-Elmore-Website/',
  appType: isPreview ? 'mpa' : 'spa',
  plugins: [react()],
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
