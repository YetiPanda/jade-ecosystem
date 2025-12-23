import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jade/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    },
  },
  server: {
    port: 4005,
    strictPort: true, // Don't try other ports if 4005 is busy
    proxy: {
      '/graphql': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
    },
  },
});
