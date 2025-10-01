import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment for integration tests
    environment: 'node',
    
    // Global test setup
    globals: true,
    setupFiles: ['./tests/setup/vitest.integration.setup.ts'],
    
    // Include patterns
    include: ['tests/integration/**/*.test.ts', 'tests/integration/**/*.spec.ts'],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.git',
      '.cache',
      'tests/unit/**',
      'tests/e2e/**'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage/integration',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/types/**',
      ],
      // Integration test coverage thresholds
      lines: 70,
      functions: 70,
      branches: 65,
      statements: 70,
    },
    
    // Test execution settings (longer timeouts for integration tests)
    testTimeout: 30000,
    hookTimeout: 30000,
    
    // Reporters
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/integration-tests.json',
    },
    
    // Sequential execution for integration tests (to avoid conflicts)
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    
    // Watch mode settings
    watch: false,
    
    // Mockup reset
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    
    // Retry flaky tests
    retry: 2,
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
