import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jade/ui': path.resolve(__dirname, '../../../packages/jade-ui/src'),
      '@jade/feature-flags': path.resolve(__dirname, '../../../packages/feature-flags/src'),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
