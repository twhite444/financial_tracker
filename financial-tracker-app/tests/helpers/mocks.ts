import { vi } from 'vitest';

/**
 * Mock implementations for testing
 */

/**
 * Mock AuthService
 */
export const mockAuthService = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  validateToken: vi.fn(),
};

/**
 * Mock UserService
 */
export const mockUserService = {
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  deleteUser: vi.fn(),
  changePassword: vi.fn(),
};

/**
 * Mock AccountService
 */
export const mockAccountService = {
  getAllAccounts: vi.fn(),
  getAccountById: vi.fn(),
  createAccount: vi.fn(),
  updateAccount: vi.fn(),
  deleteAccount: vi.fn(),
  getAccountBalance: vi.fn(),
  syncAccount: vi.fn(),
};

/**
 * Mock TransactionService
 */
export const mockTransactionService = {
  getAllTransactions: vi.fn(),
  getTransactionById: vi.fn(),
  getTransactionsByAccount: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  categorizeTransaction: vi.fn(),
};

/**
 * Mock DatabaseService
 */
export const mockDatabaseService = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  clearDatabase: vi.fn(),
  query: vi.fn(),
};

/**
 * Mock EncryptionService
 */
export const mockEncryptionService = {
  encrypt: vi.fn((data: string) => `encrypted_${data}`),
  decrypt: vi.fn((data: string) => data.replace('encrypted_', '')),
  hash: vi.fn((data: string) => `hashed_${data}`),
  compare: vi.fn(),
  generateSalt: vi.fn(),
};

/**
 * Mock ValidationService
 */
export const mockValidationService = {
  validateEmail: vi.fn(),
  validatePassword: vi.fn(),
  validateAmount: vi.fn(),
  sanitizeInput: vi.fn(),
};

/**
 * Helper to reset all mocks
 */
export const resetAllMocks = () => {
  vi.clearAllMocks();
  vi.resetAllMocks();
};

/**
 * Mock API responses
 */
export const mockApiResponses = {
  successLogin: {
    success: true,
    data: {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
  },

  successRegister: {
    success: true,
    data: {
      user: {
        id: '1',
        email: 'newuser@example.com',
        name: 'New User',
      },
    },
  },

  errorInvalidCredentials: {
    success: false,
    error: {
      message: 'Invalid credentials',
      code: 'AUTH_ERROR',
    },
  },

  errorUnauthorized: {
    success: false,
    error: {
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
    },
  },

  errorNotFound: {
    success: false,
    error: {
      message: 'Resource not found',
      code: 'NOT_FOUND',
    },
  },

  errorValidation: {
    success: false,
    error: {
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: [],
    },
  },
};

/**
 * Mock localStorage for Node environment
 */
export const createMockLocalStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

/**
 * Mock fetch for API calls
 */
export const createMockFetch = (response: any, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
    headers: new Headers(),
  });
};

/**
 * Helper to wait for async operations
 */
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to flush promises
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));
