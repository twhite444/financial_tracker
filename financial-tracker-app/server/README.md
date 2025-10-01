# Financial Tracker - Backend API

## Overview
RESTful API backend for the Financial Tracker application built with Express.js, TypeScript, and MongoDB.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Language**: TypeScript

## Project Structure
```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Account.ts           # Account schema
│   │   ├── Transaction.ts       # Transaction schema
│   │   └── PaymentReminder.ts   # Payment reminder schema
│   ├── controllers/
│   │   ├── authController.ts    # Auth logic (login, register)
│   │   ├── accountController.ts # Account CRUD operations
│   │   ├── transactionController.ts # Transaction operations
│   │   └── paymentController.ts # Payment reminder operations
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── accounts.ts          # Account endpoints
│   │   ├── transactions.ts      # Transaction endpoints
│   │   └── payments.ts          # Payment endpoints
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   └── index.ts                 # Express app & server setup
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── package.json
└── tsconfig.json
```

## Prerequisites
1. **Node.js** (v14 or higher)
2. **MongoDB** (running locally or MongoDB Atlas)
3. **npm** or **yarn**

## Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/financial-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run manually
mongod --dbpath /path/to/data/directory
```

### 4. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Accounts
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/accounts` | Get all user accounts | Yes |
| GET | `/api/accounts/summary` | Get account summary stats | Yes |
| GET | `/api/accounts/:id` | Get single account | Yes |
| POST | `/api/accounts` | Create new account | Yes |
| PUT | `/api/accounts/:id` | Update account | Yes |
| DELETE | `/api/accounts/:id` | Delete account (soft delete) | Yes |

### Transactions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | Get all transactions (with filters) | Yes |
| GET | `/api/transactions/stats` | Get transaction statistics | Yes |
| GET | `/api/transactions/:id` | Get single transaction | Yes |
| POST | `/api/transactions` | Create new transaction | Yes |
| PUT | `/api/transactions/:id` | Update transaction | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction | Yes |

**Query Parameters for GET /api/transactions:**
- `accountId` - Filter by account
- `category` - Filter by category
- `type` - Filter by type (income/expense)
- `startDate` - Start date (ISO 8601)
- `endDate` - End date (ISO 8601)
- `search` - Search description/merchant
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

### Payment Reminders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payments` | Get all payment reminders | Yes |
| GET | `/api/payments/upcoming` | Get upcoming payments | Yes |
| GET | `/api/payments/:id` | Get single payment | Yes |
| POST | `/api/payments` | Create new payment reminder | Yes |
| PUT | `/api/payments/:id` | Update payment reminder | Yes |
| PATCH | `/api/payments/:id/paid` | Mark payment as paid | Yes |
| DELETE | `/api/payments/:id` | Delete payment reminder | Yes |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health status | No |

## Authentication Flow

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Authenticated Requests
Include JWT token in Authorization header:
```bash
curl -X GET http://localhost:5000/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

### 🔒 Password Security
- Passwords hashed with bcrypt (12 salt rounds)
- Password validation: min 8 chars, uppercase, lowercase, number
- Passwords never returned in API responses

### 🛡️ API Security
- **Helmet**: Sets security HTTP headers
- **CORS**: Configured for specific origin
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT**: Token-based authentication with 7-day expiration
- **Input Validation**: express-validator for all inputs
- **Error Handling**: Sanitized error messages in production

### 🔐 Database Security
- MongoDB indexes for efficient queries
- User-scoped queries (users can only access their own data)
- Soft deletes for accounts (preserves data integrity)
- Transaction consistency (account balance updates)

## Data Models

### User
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  firstName: string (required)
  lastName: string (required)
  createdAt: Date
  updatedAt: Date
}
```

### Account
```typescript
{
  userId: ObjectId (required)
  name: string (required)
  type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan'
  institution: string (required)
  balance: number (required)
  creditLimit?: number
  currency: string (default: 'USD')
  isActive: boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

### Transaction
```typescript
{
  userId: ObjectId (required)
  accountId: ObjectId (required)
  type: 'income' | 'expense'
  category: string (required)
  amount: number (required, min: 0)
  description: string (required)
  date: Date (required)
  merchant?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}
```

### PaymentReminder
```typescript
{
  userId: ObjectId (required)
  accountId: ObjectId (required)
  title: string (required)
  amount: number (required, min: 0)
  dueDate: Date (required)
  recurring: boolean (default: false)
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
  isPaid: boolean (default: false)
  paidDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

## Development

### Available Scripts
```bash
npm run dev      # Run development server with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production server
npm run lint     # Run ESLint
```

### MongoDB Setup (macOS)
```bash
# Install MongoDB with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community

# Or run MongoDB manually
mongod --config /usr/local/etc/mongod.conf

# Connect with MongoDB Shell
mongosh
```

### MongoDB Atlas (Cloud)
If using MongoDB Atlas, update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-tracker?retryWrites=true&w=majority
```

## Testing with curl

### Create Account
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Schwab Checking",
    "type": "checking",
    "institution": "Charles Schwab",
    "balance": 12500
  }'
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACCOUNT_ID",
    "type": "expense",
    "category": "Groceries",
    "amount": 85.50,
    "description": "Weekly grocery shopping",
    "date": "2024-10-01T10:30:00Z",
    "merchant": "Whole Foods"
  }'
```

### Create Payment Reminder
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACCOUNT_ID",
    "title": "Credit Card Payment",
    "amount": 1500,
    "dueDate": "2024-10-15T00:00:00Z",
    "recurring": true,
    "frequency": "monthly"
  }'
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
brew services start mongodb-community
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### JWT Token Expired
```json
{ "error": "Token expired" }
```
**Solution**: Login again to get a new token

## Production Deployment

### Environment Variables
Set secure production values:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=GENERATE_STRONG_RANDOM_KEY_256_BITS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build & Deploy
```bash
npm run build
node dist/index.js
```

### Recommended Hosting
- **Backend**: Railway, Render, Heroku, AWS EC2
- **Database**: MongoDB Atlas (free tier available)
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (certbot)

## Next Steps
1. ✅ Backend API is complete
2. 🔄 Connect frontend to backend
3. 🧪 Add API tests (Jest/Supertest)
4. 📊 Add data encryption for sensitive fields
5. 🚀 Deploy to production

## Support
For issues or questions, check:
- MongoDB logs: `tail -f /usr/local/var/log/mongodb/mongo.log`
- Server logs: Check terminal output
- API health: `curl http://localhost:5000/health`
