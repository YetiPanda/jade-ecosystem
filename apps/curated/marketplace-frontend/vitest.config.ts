/**
 * Vitest configuration
 * Task: T093 - Verify test coverage >80%
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        'dist/',
        'coverage/',
        'src/graphql/generated.ts',
        '**/*.css',
        '**/*.spec.tsx',
        '**/*.spec.ts',
        '**/*.test.tsx',
        '**/*.test.ts',
      ],
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
      ],
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
