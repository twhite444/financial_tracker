# System Architecture

This document provides a comprehensive overview of the Financial Tracker application architecture, design decisions, and technical implementation details.

## 📋 Table of Contents
- [High-Level Architecture](#high-level-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Security Architecture](#security-architecture)
- [API Design](#api-design)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Deployment Architecture](#deployment-architecture)
- [Design Decisions](#design-decisions)

---

## 🏗️ High-Level Architecture

### System Overview

Financial Tracker follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│                     (React + TypeScript)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Dashboard   │  │ Transactions │  │   Accounts   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
│                    (Express.js + Node.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Controllers  │  │   Services   │  │  Middleware  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Data Layer                              │
│                    (MongoDB + Mongoose)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Models    │  │    Schemas   │  │   Indexes    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend Stack**
```typescript
{
  runtime: "React 18",
  language: "TypeScript 5",
  buildTool: "Vite 4",
  styling: "Tailwind CSS 3",
  animations: "Framer Motion 10",
  stateManagement: "Zustand 4",
  httpClient: "Axios 1",
  testing: "Vitest + Testing Library"
}
```

**Backend Stack**
```typescript
{
  runtime: "Node.js 18",
  framework: "Express.js 4",
  language: "TypeScript 5",
  database: "MongoDB 6",
  odm: "Mongoose 7",
  authentication: "JWT + bcrypt",
  validation: "express-validator",
  security: "Helmet + express-rate-limit",
  testing: "Vitest + Supertest"
}
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App.tsx
├── AuthContext (Authentication state)
├── ThemeContext (Dark mode state)
│
├── Layout/
│   ├── Sidebar (Navigation)
│   ├── Header (User menu, theme toggle)
│   └── MobileBottomNav (Mobile navigation)
│
├── Pages/
│   ├── DashboardPage
│   │   ├── FinancialHealthScore
│   │   ├── AccountBalanceChart
│   │   ├── SpendingByCategory
│   │   └── RecentTransactions
│   │
│   ├── AccountsPage
│   │   ├── AccountList
│   │   ├── AccountCard
│   │   └── AddAccountModal
│   │
│   ├── TransactionsPage
│   │   ├── TransactionFilters
│   │   ├── TransactionList
│   │   └── TransactionModal
│   │
│   ├── PaymentsPage
│   │   ├── PaymentCalendar
│   │   ├── UpcomingPayments
│   │   └── PaymentModal
│   │
│   └── HistoryPage
│       ├── HistoryTimeline
│       └── HistoryFilters
│
└── Common Components/
    ├── Button
    ├── Modal
    ├── Toast
    ├── LoadingSkeleton
    └── EmptyState
```

### State Management Strategy

**1. Local State (useState)**
- Component-specific UI state
- Form inputs
- Modal open/close states

**2. Zustand Store (Global State)**
```typescript
// authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// Usage
const { user, login, logout } = useAuthStore();
```

**3. React Context**
- Theme preferences (dark mode)
- Application-wide settings

### Data Fetching Pattern

```typescript
// Custom hook pattern
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await accountService.getAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, loading, error, refetch: fetchAccounts };
};
```

### Routing Structure

```typescript
// App.tsx routes
const routes = [
  { path: '/', element: <DashboardPage />, protected: true },
  { path: '/accounts', element: <AccountsPage />, protected: true },
  { path: '/transactions', element: <TransactionsPage />, protected: true },
  { path: '/payments', element: <PaymentsPage />, protected: true },
  { path: '/history', element: <HistoryPage />, protected: true },
  { path: '/login', element: <LoginPage />, protected: false },
  { path: '/register', element: <RegisterPage />, protected: false },
];
```

---

## ⚙️ Backend Architecture

### MVC + Services Pattern

```
Request → Middleware → Controller → Service → Model → Database
                                       ↓
                                   Response
```

### Layer Responsibilities

**1. Middleware Layer**
```typescript
// Responsibilities:
// - Authentication verification
// - Request validation
// - Rate limiting
// - Security headers
// - Error handling
// - Logging

app.use(authenticateToken);
app.use(validateRequest);
app.use(rateLimiter);
app.use(securityHeaders);
```

**2. Controller Layer**
```typescript
// Responsibilities:
// - Handle HTTP requests/responses
// - Call appropriate services
// - Return proper status codes
// - Handle errors gracefully

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const accounts = await AccountService.getAllAccounts(userId);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};
```

**3. Service Layer**
```typescript
// Responsibilities:
// - Business logic
// - Data manipulation
// - Integration with external APIs
// - Transaction management

export class AccountService {
  static async getAllAccounts(userId: string): Promise<IAccount[]> {
    const accounts = await Account.find({ userId, isActive: true });
    return accounts;
  }

  static async createAccount(data: CreateAccountDTO): Promise<IAccount> {
    // Validation
    // Business logic
    // Create account
    // Log activity
    return account;
  }
}
```

**4. Model Layer**
```typescript
// Responsibilities:
// - Database schema definition
// - Data validation
// - Virtual properties
// - Instance methods
// - Static methods
// - Hooks (pre/post save)

const accountSchema = new Schema({
  userId: { type: String, required: true, index: true },
  accountName: { type: String, required: true },
  accountType: { type: String, required: true, enum: ['checking', 'savings', 'credit', 'loan'] },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Hooks for automatic history tracking
accountSchema.post('save', async function(doc) {
  await trackAccountChange(doc, 'create');
});
```

### API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
│
├── /accounts
│   ├── GET    /accounts
│   ├── POST   /accounts
│   ├── GET    /accounts/:id
│   ├── PUT    /accounts/:id
│   └── DELETE /accounts/:id
│
├── /transactions
│   ├── GET    /transactions
│   ├── POST   /transactions
│   ├── GET    /transactions/:id
│   ├── PUT    /transactions/:id
│   └── DELETE /transactions/:id
│
├── /payments
│   ├── GET    /payments
│   ├── POST   /payments
│   ├── GET    /payments/:id
│   ├── PUT    /payments/:id
│   └── DELETE /payments/:id
│
├── /plaid
│   ├── POST /create_link_token
│   ├── POST /exchange_public_token
│   ├── POST /transactions/sync
│   └── GET  /accounts/:item_id
│
└── /history
    ├── GET /transactions
    ├── GET /accounts
    ├── GET /payments
    ├── GET /activity
    ├── GET /activity/stats
    └── GET /all
```

---

## 💾 Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│      Users      │
│  PK: _id        │
│  - email        │◄────┐
│  - password     │     │
│  - name         │     │
└─────────────────┘     │
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Accounts   │  │ Transaction │  │  Payments   │
│  PK: _id    │  │  PK: _id    │  │  PK: _id    │
│  FK: userId │  │  FK: userId │  │  FK: userId │
│  - type     │  │  FK: account│  │  FK: account│
│  - balance  │  │  - amount   │  │  - amount   │
│  - name     │  │  - category │  │  - dueDate  │
└─────────────┘  └─────────────┘  └─────────────┘
        │               │               │
        ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Account    │  │Transaction  │  │  Payment    │
│  History    │  │  History    │  │  History    │
└─────────────┘  └─────────────┘  └─────────────┘
                        
                ┌─────────────┐
                │   User      │
                │  Activity   │
                │    Logs     │
                │  FK: userId │
                └─────────────┘
```

### Schema Design

**Users Collection**
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Accounts Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  accountName: string,
  accountType: enum ['checking', 'savings', 'credit', 'loan'],
  balance: number,
  institution: string,
  accountNumber: string (encrypted),
  routingNumber: string (encrypted),
  creditLimit: number (optional),
  apr: number (optional),
  dueDate: Date (optional),
  isActive: boolean,
  plaidAccountId: string (optional),
  plaidItemId: string (optional),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1, isActive: 1 }
{ plaidAccountId: 1 }
```

**Transactions Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  accountId: ObjectId (indexed),
  amount: number,
  category: string,
  description: string,
  date: Date (indexed),
  type: enum ['income', 'expense'],
  isRecurring: boolean,
  plaidTransactionId: string (optional),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1, date: -1 }
{ accountId: 1, date: -1 }
{ category: 1 }
```

**Payment Reminders Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  accountId: ObjectId (indexed),
  title: string,
  amount: number,
  dueDate: Date (indexed),
  isRecurring: boolean,
  frequency: enum ['monthly', 'quarterly', 'yearly'],
  isPaid: boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1, dueDate: 1 }
{ userId: 1, isPaid: 1 }
```

**History Collections**
```typescript
// TransactionHistory, AccountHistory, PaymentHistory
{
  _id: ObjectId,
  documentId: ObjectId (indexed),
  userId: ObjectId (indexed),
  action: enum ['create', 'update', 'delete'],
  previousData: object (sanitized),
  newData: object (sanitized),
  changedFields: [string],
  metadata: {
    ipAddress: string (masked),
    userAgent: string,
    timestamp: Date
  },
  timestamp: Date (indexed)
}

// Indexes
{ documentId: 1, timestamp: -1 }
{ userId: 1, timestamp: -1 }
{ action: 1 }
```

**User Activity Logs**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  action: string,
  details: string,
  success: boolean,
  errorMessage: string (optional),
  ipAddress: string (masked),
  userAgent: string,
  timestamp: Date (indexed)
}

// Indexes
{ userId: 1, timestamp: -1 }
{ action: 1, timestamp: -1 }
```

### Index Strategy

```typescript
// Performance-critical indexes
User: { email: 1 } (unique)
Account: { userId: 1, isActive: 1 }
Transaction: { userId: 1, date: -1 }
Transaction: { accountId: 1, date: -1 }
PaymentReminder: { userId: 1, dueDate: 1 }
History: { documentId: 1, timestamp: -1 }
ActivityLog: { userId: 1, timestamp: -1 }
```

---

## 🔒 Security Architecture

### Defense in Depth Strategy

```
┌────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                              │
│ - HTTPS only                                           │
│ - CORS restrictions                                    │
│ - Firewall rules                                       │
└────────────────────────────────────────────────────────┘
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 2: Application Security                          │
│ - Rate limiting                                        │
│ - Security headers (Helmet.js)                         │
│ - Input validation                                     │
│ - Output sanitization                                  │
└────────────────────────────────────────────────────────┘
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 3: Authentication & Authorization                │
│ - JWT tokens                                           │
│ - Password hashing (bcrypt)                            │
│ - Role-based access control                            │
└────────────────────────────────────────────────────────┘
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 4: Data Security                                 │
│ - Encryption at rest                                   │
│ - Data masking in logs                                 │
│ - Secure data transmission                             │
└────────────────────────────────────────────────────────┘
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 5: Monitoring & Detection                        │
│ - Anomaly detection                                    │
│ - Audit logging                                        │
│ - Real-time alerts                                     │
└────────────────────────────────────────────────────────┘
```

### Security Middleware Stack

```typescript
// Request flow through security middleware
Request
  ↓
securityLogger (log incoming requests)
  ↓
securityHeaders (set security headers)
  ↓
sqlInjectionProtection (check for SQL injection)
  ↓
noSQLInjectionProtection (check for NoSQL injection)
  ↓
sanitizeQueryParams (sanitize input)
  ↓
rateLimiter (check request rate)
  ↓
authenticateToken (verify JWT)
  ↓
validateInput (validate request data)
  ↓
Controller (business logic)
  ↓
sanitizeOutput (mask sensitive data)
  ↓
Response
```

---

## 🔐 Authentication Flow

### Registration Flow
```
User → Frontend → Backend → Database
  1. Enter credentials
  2. Validate input
  3. Hash password (bcrypt)
  4. Create user record
  5. Generate JWT token
  6. Return token + user data
  7. Store token in localStorage
  8. Redirect to dashboard
```

### Login Flow
```
User → Frontend → Backend → Database
  1. Enter credentials
  2. Validate input
  3. Find user by email
  4. Compare password hash
  5. Generate JWT token
  6. Log activity
  7. Check for anomalies
  8. Return token + user data
  9. Store token in localStorage
  10. Redirect to dashboard
```

### Protected Route Flow
```
Request → Middleware → Controller
  1. Extract token from header
  2. Verify token signature
  3. Check token expiration
  4. Decode user info
  5. Attach user to request
  6. Continue to controller
```

---

## 🚀 Deployment Architecture

### Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      DNS & CDN                           │
│              (Cloudflare / Vercel Edge)                  │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│   Frontend       │          │    Backend       │
│   (Vercel)       │◄────────►│   (Render)       │
│   - React App    │   HTTPS  │   - Express API  │
│   - Static       │          │   - Node.js      │
│   - SSR          │          │   - Auto-scale   │
└──────────────────┘          └────────┬─────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        │                             │
                        ▼                             ▼
            ┌──────────────────┐        ┌──────────────────┐
            │  MongoDB Atlas   │        │   Plaid API      │
            │  - Cloud DB      │        │  - Banking       │
            │  - Replicas      │        │  - Transactions  │
            │  - Backups       │        │                  │
            └──────────────────┘        └──────────────────┘
```

### Environment Configuration

```typescript
// Development
{
  frontend: "http://localhost:5173",
  backend: "http://localhost:5000",
  database: "mongodb://localhost:27017/financial-tracker"
}

// Production
{
  frontend: "https://financial-tracker.vercel.app",
  backend: "https://financial-tracker-api.onrender.com",
  database: "mongodb+srv://cluster.mongodb.net/financial-tracker"
}
```

---

## 🤔 Design Decisions

### Technology Choices

**Why React?**
- Component reusability
- Large ecosystem
- Strong TypeScript support
- Excellent developer experience
- Performance with virtual DOM

**Why TypeScript?**
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Easier refactoring
- Industry standard

**Why MongoDB?**
- Flexible schema for evolving requirements
- JSON-like documents match JavaScript
- Excellent scaling options
- Strong query capabilities
- Great for rapid development

**Why Express.js?**
- Minimal and flexible
- Large middleware ecosystem
- Well-documented
- Industry standard
- Easy to test

**Why JWT?**
- Stateless authentication
- Scalable across servers
- Mobile-friendly
- Standard protocol
- Secure when implemented correctly

### Architectural Patterns

**MVC + Services Pattern**
- Clear separation of concerns
- Testable business logic
- Reusable services
- Easy to maintain

**Repository Pattern (via Mongoose)**
- Abstract data access
- Easy to mock for testing
- Database-agnostic interface

**Middleware Pattern**
- Cross-cutting concerns
- Reusable security checks
- Clean request pipeline

### Scalability Considerations

**Horizontal Scaling**
- Stateless backend (JWT)
- Load balancer ready
- Database replication
- CDN for static assets

**Vertical Scaling**
- Efficient queries with indexes
- Connection pooling
- Caching strategy (planned)
- Lazy loading

**Performance Optimizations**
- Code splitting
- Tree shaking
- Image optimization
- Gzip compression
- Database indexes

---

## 📚 Additional Resources

- [API Documentation](./API.md)
- [Security Documentation](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

**Last Updated**: October 2025  
**Version**: 1.0.0
