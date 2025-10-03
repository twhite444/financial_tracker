import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'happy-dom',
    
    // Global test setup
    globals: true,
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    
    // Include patterns
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx', 'tests/unit/**/*.spec.ts', 'tests/unit/**/*.spec.tsx'],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.git',
      '.cache',
      'tests/integration/**',
      'tests/e2e/**'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/types/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      // Strict coverage thresholds for financial application
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
      // Per-file thresholds
      perFile: true,
    },
    
    // Test execution settings
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporters
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/unit-tests.json',
      html: './test-results/unit-tests.html',
    },
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    
    // Watch mode settings
    watch: false,
    
    // Mockup reset
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
      '@models': path.resolve(__dirname, './src/models'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
});
