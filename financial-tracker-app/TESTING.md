# Financial Tracker - Testing Infrastructure

## 🧪 Overview

This project uses a comprehensive testing infrastructure designed for a production-grade financial application with enterprise-level security and reliability standards.

## Testing Stack

### Unit & Integration Tests
- **Vitest** - Fast, modern test runner with excellent TypeScript support
- **@testing-library/react** - Component testing with user-centric approach
- **happy-dom** - Lightweight DOM implementation for unit tests

### E2E Tests
- **Playwright** - Multi-browser end-to-end testing
- **Browsers**: Chromium, Firefox, WebKit (Safari)
- **Mobile**: iOS Safari, Android Chrome

### Code Quality
- **ESLint** - Static code analysis with security rules
- **Prettier** - Code formatting
- **TypeScript** - Strict type checking
- **Husky** - Git hooks for pre-commit validation

### CI/CD
- **GitHub Actions** - Automated testing pipeline
- **Codecov** - Code coverage tracking
- **Snyk** - Security vulnerability scanning

## 📋 Test Commands

```bash
# Run all tests
npm test

# Unit tests with coverage
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# Watch mode for development
npm run test:watch

# Run all test suites
npm run test:all

# Code quality checks
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run type-check
```

## 🎯 Test Coverage Goals

We maintain strict coverage thresholds for financial application reliability:

| Category | Threshold |
|----------|-----------|
| Unit Tests - Lines | 80% |
| Unit Tests - Functions | 80% |
| Unit Tests - Branches | 75% |
| Unit Tests - Statements | 80% |
| Integration Tests | 70% |
| E2E Critical Flows | 100% |

## 📁 Test Structure

```
tests/
├── unit/                    # Unit tests (isolated components/services)
│   └── services/
│       └── AccountService.test.ts
├── integration/             # Integration tests (API + Database)
│   └── auth.test.ts
├── e2e/                     # End-to-end tests (full user flows)
│   └── critical-flows.e2e.ts
├── helpers/                 # Test utilities
│   ├── factories.ts        # Data factories
│   └── mocks.ts            # Mock implementations
└── setup/                   # Test configuration
    ├── vitest.setup.ts
    └── vitest.integration.setup.ts
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your test configuration
```

### 3. Setup Test Databases

```bash
# Start MongoDB (for integration tests)
docker run -d -p 27017:27017 --name mongo-test mongo:7

# Start Redis (for session tests)
docker run -d -p 6379:6379 --name redis-test redis:7-alpine
```

### 4. Install Playwright Browsers

```bash
npx playwright install
```

### 5. Run Tests

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🏗️ Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountService } from '@/services/data/AccountService';
import { factories } from '@tests/helpers/factories';

describe('AccountService', () => {
  let accountService: AccountService;
  
  beforeEach(() => {
    accountService = new AccountService();
  });
  
  it('should create a new account', async () => {
    const accountData = factories.bankAccount();
    const result = await accountService.createAccount(accountData);
    
    expect(result).toHaveProperty('id');
    expect(result.accountName).toBe(accountData.accountName);
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('user can log in and view dashboard @smoke', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/welcome back/i)).toBeVisible();
});
```

## 🔧 Test Utilities

### Factories

Generate consistent test data:

```typescript
import { factories, createMany, createUserWithAccounts } from '@tests/helpers/factories';

// Single user
const user = factories.user();

// User with bank accounts and credit cards
const { user, accounts } = createUserWithAccounts();

// Multiple transactions
const transactions = createMany(() => factories.transaction(accountId), 10);
```

### Mocks

Pre-configured mocks for services:

```typescript
import { mockAuthService, mockApiResponses } from '@tests/helpers/mocks';

mockAuthService.login.mockResolvedValue(mockApiResponses.successLogin);
```

## 🔐 Security Testing

Security is critical for financial applications. Tests include:

- ✅ Password hashing validation
- ✅ JWT token security
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ CSRF token validation
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Encryption at rest

## 📊 CI/CD Pipeline

Our GitHub Actions workflow runs:

1. **Security Scan** - npm audit, Snyk vulnerability scanning
2. **Code Quality** - ESLint, Prettier, TypeScript checks
3. **Unit Tests** - Fast isolated tests with 80% coverage
4. **Integration Tests** - API + Database tests with real services
5. **E2E Tests** - Full user flows across multiple browsers
6. **Build** - Production build verification
7. **Deploy Staging** - Automatic deployment to staging (develop branch)
8. **Deploy Production** - Manual approval for production (main branch)

### Pipeline Triggers

- **Pull Requests** - Full test suite
- **Push to develop** - Tests + Deploy to Staging
- **Push to main** - Tests + Deploy to Production (with approval)

## 🎭 Test Tags

E2E tests use tags for selective execution:

```typescript
test('critical flow @smoke @auth', async ({ page }) => {
  // Test implementation
});
```

Run specific test suites:

```bash
# Run only smoke tests
npm run test:smoke

# Run specific tags with Playwright
npx playwright test --grep @auth
```

## 📈 Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal** - Summary during test runs
- **HTML** - `coverage/index.html` - Interactive browsable report
- **LCOV** - `coverage/lcov.info` - For CI integration
- **JSON** - `coverage/coverage-final.json` - Programmatic access

View coverage:

```bash
npm run test:unit
open coverage/index.html
```

## 🐛 Debugging Tests

### Vitest UI

```bash
npm run test -- --ui
```

### Playwright Debug Mode

```bash
npm run test:e2e:headed
npx playwright test --debug
```

### VS Code Debugging

Use the provided launch configurations in `.vscode/launch.json`:

1. Set breakpoints in test files
2. Run "Debug Current Test" from VS Code
3. Step through code execution

## 🚨 Pre-commit Hooks

Husky enforces quality before commits:

- **pre-commit** - Linting and formatting
- **pre-push** - Unit tests must pass

Skip hooks (use sparingly):

```bash
git commit --no-verify
```

## 📚 Best Practices

1. **Test Naming** - Use descriptive names: `should [action] when [condition]`
2. **Arrange-Act-Assert** - Clear test structure
3. **One Assertion Focus** - Each test validates one behavior
4. **Mock External Services** - Unit tests should be isolated
5. **Test User Flows** - E2E tests cover real user scenarios
6. **Security First** - Always test authentication and authorization
7. **Data Cleanup** - Clean up test data after each test

## 🔄 Continuous Improvement

- Monitor flaky tests and fix immediately
- Review coverage reports weekly
- Update test data factories when models change
- Add E2E tests for new critical user flows
- Keep dependencies updated

## 📞 Support

For testing questions or issues:
- Check existing test examples in `tests/` directory
- Review this documentation
- Consult the team lead

## 🎯 Testing Philosophy

> "In financial applications, a bug isn't just an inconvenience—it's a security risk and a trust violation. Test thoroughly, test often, test automatically."

Our testing strategy prioritizes:
1. **Security** - No vulnerabilities reach production
2. **Reliability** - Financial calculations must be accurate
3. **User Trust** - Every feature works as expected
4. **Developer Confidence** - Refactor safely with comprehensive tests
