# Contributing to Financial Tracker

Thank you for your interest in contributing to Financial Tracker! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information
- Other unethical or unprofessional conduct

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 5+
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/financial_tracker.git
   cd financial_tracker/financial-tracker-app
   ```

2. **Install Dependencies**
   ```bash
   # Install all dependencies
   npm install
   cd server && npm install && cd ..
   ```

3. **Set Up Environment**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp server/.env.example server/.env
   
   # Edit .env files with your local settings
   ```

4. **Start Development**
   ```bash
   # Run both frontend and backend in dev mode
   npm run dev
   ```

## 🔄 Development Workflow

### Branching Strategy

We follow a simplified Git Flow:

```
main (production-ready code)
  ├── develop (integration branch)
  │   ├── feature/feature-name
  │   ├── bugfix/bug-description
  │   └── hotfix/critical-fix
```

### Creating a Branch

```bash
# Create a new feature branch
git checkout -b feature/amazing-feature

# Create a bugfix branch
git checkout -b bugfix/fix-description

# Create a hotfix branch
git checkout -b hotfix/critical-issue
```

### Branch Naming Conventions
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

## 💻 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ GOOD - Explicit types, clear naming
interface UserAccount {
  id: string;
  userId: string;
  accountName: string;
  balance: number;
  isActive: boolean;
}

async function getAccountById(id: string): Promise<UserAccount | null> {
  return await Account.findById(id);
}

// ❌ BAD - Any types, unclear naming
async function get(x: any) {
  return await Account.findById(x);
}
```

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **async/await** over promises
- Prefer **functional components** with hooks in React
- Use **descriptive variable names** (no single letters except loop iterators)
- Add **JSDoc comments** for complex functions
- Keep functions **small and focused** (< 50 lines)

### File Organization

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── dashboard/       # Dashboard-specific
│   └── [feature]/       # Feature-specific
├── services/            # API services
├── stores/              # State management
├── utils/               # Utility functions
├── types/               # TypeScript types
└── pages/               # Route pages
```

### React Component Structure

```typescript
// ComponentName.tsx
import { useState, useEffect } from 'react';

// Types
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export const ComponentName: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 1. State
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 3. Handlers
  const handleClick = () => {
    onAction();
  };
  
  // 4. Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

### Backend Structure

```typescript
// controller.ts - Handle HTTP requests
export const getAccounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const accounts = await AccountService.getAllAccounts(userId);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

// service.ts - Business logic
export class AccountService {
  static async getAllAccounts(userId: string): Promise<Account[]> {
    return await Account.find({ userId, isActive: true });
  }
}

// model.ts - Database schema
const accountSchema = new Schema({
  userId: { type: String, required: true },
  accountName: { type: String, required: true },
  balance: { type: Number, default: 0 },
});
```

## 🧪 Testing Guidelines

### Test Coverage Requirements
- **Unit Tests**: All new utility functions and services
- **Integration Tests**: All new API endpoints
- **E2E Tests**: Critical user flows

### Writing Tests

```typescript
// Unit test example
describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
  
  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });
  
  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

// Integration test example
describe('POST /api/accounts', () => {
  it('should create a new account', async () => {
    const response = await request(app)
      .post('/api/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accountName: 'Test Account',
        accountType: 'checking',
        balance: 1000,
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- path/to/test.ts

# Generate coverage report
npm run test:coverage
```

## 📝 Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(accounts): add account balance sparklines"

# Bug fix
git commit -m "fix(auth): resolve JWT token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Multiple changes
git commit -m "feat(dashboard): add financial health score widget

- Add health score calculation algorithm
- Create HealthScoreWidget component
- Add unit tests for score calculation
- Update dashboard layout

Closes #123"
```

### Commit Message Rules
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when applicable
- Provide context in the body for complex changes

## 🔄 Pull Request Process

### Before Submitting

1. **Update from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   npm test
   npm run test:coverage
   ```

3. **Lint and format**
   ```bash
   npm run lint
   npm run format
   ```

4. **Build successfully**
   ```bash
   npm run build
   cd server && npm run build
   ```

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### PR Title Format
```
<type>: <description>

Example:
feat: Add AI financial assistant integration
fix: Resolve transaction duplicate issue
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- List of changes
- Another change
- And another

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] All tests passing locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

### Review Process

1. **Automated Checks**
   - Tests must pass
   - Linting must pass
   - Build must succeed

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Make requested changes

3. **Merge**
   - Squash and merge (preferred for feature branches)
   - Rebase and merge (for simple fixes)
   - Regular merge (for important history preservation)

## 🐛 Reporting Bugs

### Before Reporting
- Search existing issues
- Verify it's reproducible
- Collect necessary information

### Bug Report Template

```markdown
**Description**
Clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node Version: [e.g., 18.0.0]
- App Version: [e.g., 1.2.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Requesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples.

**Implementation Ideas**
Technical approach or suggestions (optional).
```

## 📚 Documentation

### Documentation Standards
- Clear and concise language
- Code examples for complex features
- Update README.md for new features
- Add JSDoc comments for public APIs
- Include screenshots for UI changes

### Documentation Structure
```
docs/
├── API.md              # API documentation
├── ARCHITECTURE.md     # System architecture
├── DEPLOYMENT.md       # Deployment guide
└── DEVELOPMENT.md      # Development guide
```

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Financial Tracker! 🚀

---

**Questions?** Open an issue or email twhite4@bates.edu
