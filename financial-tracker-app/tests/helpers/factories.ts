import { faker } from '@faker-js/faker';

/**
 * Test data factories for consistent test data generation
 */

export const factories = {
  /**
   * Generate a test user
   */
  user: (overrides = {}) => ({
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    name: faker.person.fullName(),
    password: 'TestPassword123!',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }),

  /**
   * Generate a test bank account
   */
  bankAccount: (userId?: string, overrides = {}) => ({
    id: faker.string.uuid(),
    userId: userId || faker.string.uuid(),
    accountName: `${faker.finance.accountName()} - Checking`,
    accountType: faker.helpers.arrayElement(['checking', 'savings', 'money_market']),
    accountNumber: faker.finance.accountNumber(10),
    routingNumber: faker.finance.routingNumber(),
    balance: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    institution: faker.company.name(),
    isActive: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }),

  /**
   * Generate a test credit card account
   */
  creditCard: (userId?: string, overrides = {}) => ({
    id: faker.string.uuid(),
    userId: userId || faker.string.uuid(),
    accountName: `${faker.helpers.arrayElement(['Capital One', 'Discover', 'Chase', 'Amex'])} Credit Card`,
    accountType: 'credit_card',
    cardNumber: faker.finance.creditCardNumber(),
    balance: parseFloat(faker.finance.amount({ min: 0, max: 5000, dec: 2 })),
    creditLimit: parseFloat(faker.finance.amount({ min: 5000, max: 20000, dec: 2 })),
    apr: parseFloat(faker.finance.amount({ min: 12, max: 25, dec: 2 })),
    dueDate: faker.date.future(),
    minimumPayment: parseFloat(faker.finance.amount({ min: 25, max: 200, dec: 2 })),
    institution: faker.helpers.arrayElement(['Capital One', 'Discover', 'Chase', 'American Express']),
    isActive: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }),

  /**
   * Generate a test transaction
   */
  transaction: (accountId?: string, overrides = {}) => ({
    id: faker.string.uuid(),
    accountId: accountId || faker.string.uuid(),
    amount: parseFloat(faker.finance.amount({ min: -500, max: 500, dec: 2 })),
    description: faker.finance.transactionDescription(),
    category: faker.helpers.arrayElement([
      'Groceries',
      'Dining',
      'Transportation',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Shopping',
      'Income',
      'Transfer',
    ]),
    date: faker.date.recent(),
    pending: faker.datatype.boolean({ probability: 0.2 }),
    createdAt: faker.date.past(),
    ...overrides,
  }),

  /**
   * Generate a payment reminder
   */
  paymentReminder: (accountId?: string, overrides = {}) => ({
    id: faker.string.uuid(),
    accountId: accountId || faker.string.uuid(),
    paymentName: faker.helpers.arrayElement([
      'Credit Card Payment',
      'Rent',
      'Utilities',
      'Insurance',
      'Subscription',
    ]),
    amount: parseFloat(faker.finance.amount({ min: 25, max: 2000, dec: 2 })),
    dueDate: faker.date.future(),
    recurring: faker.datatype.boolean(),
    frequency: faker.helpers.arrayElement(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']),
    isPaid: false,
    createdAt: faker.date.past(),
    ...overrides,
  }),

  /**
   * Generate Schwab bank account (specific to user requirements)
   */
  schwabChecking: (userId?: string) => ({
    id: faker.string.uuid(),
    userId: userId || faker.string.uuid(),
    accountName: 'Schwab Bank Checking',
    accountType: 'checking',
    accountNumber: faker.finance.accountNumber(10),
    routingNumber: '121202211', // Schwab routing number
    balance: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 2 })),
    institution: 'Charles Schwab Bank',
    isActive: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),

  /**
   * Generate Schwab retirement account
   */
  schwabRetirement: (userId?: string) => ({
    id: faker.string.uuid(),
    userId: userId || faker.string.uuid(),
    accountName: 'Schwab Retirement Savings',
    accountType: 'retirement',
    accountNumber: faker.finance.accountNumber(10),
    balance: parseFloat(faker.finance.amount({ min: 10000, max: 500000, dec: 2 })),
    institution: 'Charles Schwab',
    isActive: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),
};

/**
 * Helper to create multiple items
 */
export const createMany = <T>(factory: () => T, count: number): T[] => {
  return Array.from({ length: count }, () => factory());
};

/**
 * Helper to create a full user with accounts
 */
export const createUserWithAccounts = () => {
  const user = factories.user();
  const checking = factories.schwabChecking(user.id);
  const retirement = factories.schwabRetirement(user.id);
  const capitalOne = factories.creditCard(user.id, {
    accountName: 'Capital One Credit Card',
    institution: 'Capital One',
  });
  const discover = factories.creditCard(user.id, {
    accountName: 'Discover Credit Card',
    institution: 'Discover',
  });
  const chase = factories.creditCard(user.id, {
    accountName: 'Chase Credit Card',
    institution: 'Chase',
  });

  return {
    user,
    accounts: [checking, retirement, capitalOne, discover, chase],
  };
};
