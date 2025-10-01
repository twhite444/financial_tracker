# 🚀 Quick Start Guide - Testing Infrastructure Setup

## Prerequisites

- Node.js 20+ (check with `node --version`)
- npm 10+ (check with `npm --version`)
- Git
- Docker (for integration tests with MongoDB & Redis)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd financial-tracker-app
npm install
```

This will install:
- ✅ Vitest & testing utilities
- ✅ Playwright for E2E tests
- ✅ ESLint & Prettier
- ✅ TypeScript
- ✅ All project dependencies

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers for testing.

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database connection (MongoDB)
- Redis connection
- JWT secrets
- Encryption keys

**⚠️ Security Note:** Never commit `.env` to version control!

### 4. Start Test Databases (Docker)

```bash
# Start MongoDB
docker run -d \
  --name financial-tracker-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Start Redis
docker run -d \
  --name financial-tracker-redis \
  -p 6379:6379 \
  redis:7-alpine
```

**Alternative:** Use Docker Compose (create `docker-compose.yml`):

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

Then run: `docker-compose up -d`

### 5. Initialize Git Hooks

```bash
npm run prepare
```

This sets up Husky for pre-commit linting and pre-push testing.

### 6. Run Your First Tests

```bash
# Unit tests
npm run test:unit

# Integration tests (requires databases)
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

## Verifying Your Setup

### ✅ Checklist

Run these commands to verify everything is working:

```bash
# 1. Check Node version
node --version  # Should be 20.x.x

# 2. Check dependencies installed
npm list --depth=0

# 3. Type checking passes
npm run type-check

# 4. Linting passes
npm run lint

# 5. Formatting is correct
npm run format:check

# 6. Unit tests pass
npm run test:unit

# 7. Playwright is installed
npx playwright --version
```

## Common Issues & Solutions

### Issue: TypeScript errors in config files

**Solution:** The packages aren't installed yet. Run:
```bash
npm install
```

### Issue: Playwright browsers not found

**Solution:** Install browsers:
```bash
npx playwright install --with-deps
```

### Issue: MongoDB connection failed

**Solution:** Check if MongoDB is running:
```bash
docker ps | grep mongo
```

If not running, start it:
```bash
docker start financial-tracker-mongo
```

### Issue: Port already in use

**Solution:** Check what's using the port:
```bash
lsof -i :5173  # For Vite dev server
lsof -i :27017 # For MongoDB
```

Kill the process or use a different port.

### Issue: Husky hooks not working

**Solution:** Reinstall git hooks:
```bash
rm -rf .husky
npm run prepare
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Issue: Coverage thresholds not met

**Solution:** This is intentional! Write more tests to reach:
- Lines: 80%
- Functions: 80%
- Branches: 75%

## Development Workflow

### Daily Development

```bash
# 1. Start dev server
npm run dev

# 2. Run tests in watch mode (in another terminal)
npm run test:watch

# 3. Make changes to code

# 4. Tests automatically rerun

# 5. Before committing
npm run lint:fix
npm run format

# 6. Commit (hooks will run automatically)
git commit -m "feat: add new feature"
```

### Running Specific Tests

```bash
# Run single test file
npx vitest run tests/unit/services/AccountService.test.ts

# Run tests matching pattern
npx vitest run -t "should create account"

# Run E2E tests for specific browser
npx playwright test --project=chromium

# Run only smoke tests
npm run test:smoke

# Debug E2E test
npx playwright test --debug
```

### Viewing Test Results

```bash
# View coverage report
npm run test:unit
open coverage/index.html

# View Playwright report
npx playwright show-report

# Open Vitest UI
npm run test -- --ui
```

## CI/CD Setup (GitHub Actions)

### 1. Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

- `SNYK_TOKEN` - For security scanning
- `TEST_JWT_SECRET` - For test environment
- `TEST_ENCRYPTION_KEY` - For test encryption
- `CODECOV_TOKEN` - For coverage reporting

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit with testing infrastructure"
git branch -M main
git remote add origin https://github.com/your-username/financial-tracker.git
git push -u origin main
```

### 3. Create Develop Branch

```bash
git checkout -b develop
git push -u origin develop
```

### 4. Verify Workflow

- Go to **Actions** tab in GitHub
- Should see CI/CD pipeline running
- All jobs should pass ✅

## VS Code Extensions (Recommended)

Install these for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "vitest.explorer",
    "ms-playwright.playwright",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## Next Steps

1. ✅ Run `npm install`
2. ✅ Setup databases with Docker
3. ✅ Run initial tests
4. ✅ Read `TESTING.md` for detailed testing guide
5. ✅ Set up GitHub repository and CI/CD
6. 🚀 Start building features!

## Getting Help

- **Testing docs:** See `TESTING.md`
- **API docs:** See `README.md`
- **Vitest docs:** https://vitest.dev
- **Playwright docs:** https://playwright.dev

## Pro Tips

💡 **Use test-driven development (TDD)**
Write tests before implementing features.

💡 **Run tests before pushing**
The pre-push hook does this, but run manually too: `npm run test:all`

💡 **Monitor coverage**
Keep coverage above 80% for critical financial code.

💡 **Tag E2E tests**
Use `@smoke`, `@auth`, `@critical` tags for selective test runs.

💡 **Use test factories**
Generate consistent test data with `factories` from helpers.

---

**You're all set! Happy testing! 🎉**
