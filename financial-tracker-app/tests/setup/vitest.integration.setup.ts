import { beforeAll, afterAll, afterEach } from 'vitest';
import { vi } from 'vitest';

// Setup environment variables for integration tests
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-for-integration-testing';
  process.env.ENCRYPTION_KEY = 'test-encryption-key-32-bytes!!';
  process.env.DATABASE_URL = 'mongodb://localhost:27017/financial_tracker_integration_test';
  process.env.REDIS_URL = 'redis://localhost:6379/1';
  
  // Initialize test database connection
  // TODO: Add database connection setup here when DatabaseService is implemented
});

// Cleanup after each test
afterEach(async () => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  
  // Clear test data after each test
  // TODO: Add database cleanup logic here
});

// Teardown after all tests
afterAll(async () => {
  // Close database connections
  // TODO: Add database connection cleanup here
});

// Global test utilities
export const testHelpers = {
  // Helper to create test user
  createTestUser: async (overrides = {}) => {
    return {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword123',
      createdAt: new Date(),
      ...overrides,
    };
  },
  
  // Helper to create test account
  createTestAccount: async (userId: string, overrides = {}) => {
    return {
      id: '1',
      userId,
      accountName: 'Schwab Checking',
      accountType: 'checking',
      balance: 1000.00,
      institution: 'Schwab',
      createdAt: new Date(),
      ...overrides,
    };
  },
  
  // Helper to generate JWT token for testing
  generateTestToken: (userId: string) => {
    // TODO: Implement using actual AuthService
    return `test-token-${userId}`;
  },
};
