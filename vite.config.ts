import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig(async () => ({
  plugins: [preact(), svgr({ exportAsDefault: true })],
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
}));
