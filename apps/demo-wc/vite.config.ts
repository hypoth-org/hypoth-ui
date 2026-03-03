import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'ES2022',
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3002,
  },
});
