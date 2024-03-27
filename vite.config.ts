import preact from '@preact/preset-vite';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const localsConvention = 'camelCaseOnly' as const;

export default defineConfig(async () => ({
  plugins: [
    svgr({ exportAsDefault: true }),
    preact({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          [
            '@babel/plugin-transform-runtime',
            {
              helpers: true,
              regenerator: true,
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  cacheDir: 'node_modules/.cache/.vite',
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  css: { modules: { localsConvention } },
  build: {
    chunkSizeWarningLimit: 768, // The limit in KB
  },
}));
