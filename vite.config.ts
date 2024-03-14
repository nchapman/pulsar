import preact from '@preact/preset-vite';
import styleXPlugin from '@stylexjs/babel-plugin';
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
          [
            styleXPlugin,
            {
              dev: true,
              // Set this to true for snapshot testing
              // default: false
              test: false,
              // Required for CSS variable support
              unstable_moduleResolution: {
                // type: 'commonJS' | 'haste'
                // default: 'commonJS'
                type: 'commonJS',
                // The absolute path to the root directory of your project
                rootDir: __dirname,
              },
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
}));
