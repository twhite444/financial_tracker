# 💰 Financial Tracker - Personal Finance Management Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

**A production-ready, full-stack financial management application built for personal use and portfolio demonstration.**

[Live Demo](#) · [Documentation](./docs) · [Report Bug](https://github.com/twhite444/financial_tracker/issues) · [Request Feature](https://github.com/twhite444/financial_tracker/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Roadmap](#-project-roadmap)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About The Project

Financial Tracker is a **comprehensive personal finance management platform** designed to unify all financial accounts, credit cards, and loans into a single, secure dashboard. What started as a personal tool to manage my finances has evolved into a **production-grade application** showcasing enterprise-level development practices.

### 🏗️ Project Goals

#### **Current Implementation**
- ✅ Unified dashboard for all financial accounts (bank accounts, credit cards, loans)
- ✅ Real-time transaction tracking and categorization
- ✅ Payment reminder system with calendar integration
- ✅ Plaid API integration for automatic bank account linking
- ✅ Comprehensive audit logging and history tracking
- ✅ Production-ready security (rate limiting, data masking, anomaly detection)
- ✅ Responsive design with dark mode support
- ✅ Full authentication system with JWT

#### **Future Vision** 🚀
- 🔮 **AI Financial Assistant** - Natural language interface for financial queries and insights
- 🔮 **Automated Tax Preparation** - Smart tax filing with automatic categorization and form generation
- 🔮 **Predictive Analytics** - ML-powered spending forecasts and financial recommendations
- 🔮 **Multi-currency Support** - International account management
- 🔮 **Investment Portfolio Tracking** - Stock, crypto, and retirement account integration
- 🔮 **Bill Negotiation AI** - Automated bill optimization and negotiation

### 💡 Why This Project?

This application demonstrates my ability to:
- Build **scalable, production-ready full-stack applications**
- Implement **enterprise-level security** (OWASP best practices, data encryption, anomaly detection)
- Design **clean, maintainable architecture** (MVC pattern, service layer, middleware)
- Write **comprehensive tests** (unit, integration, E2E with 80%+ coverage)
- Deploy and maintain **cloud-native applications** (Vercel, Render, MongoDB Atlas)
- Work with **third-party APIs** (Plaid for banking integration)
- Create **beautiful, responsive UIs** (React, Tailwind CSS, Framer Motion)

---

## ✨ Key Features

### 🏦 Account Management
- **Multi-account Support**: Link unlimited bank accounts, credit cards, and loans
- **Plaid Integration**: Secure, automatic account linking via Plaid API
- **Real-time Balances**: Track balances, credit limits, and available credit
- **Account Types**: Support for checking, savings, credit cards, loans, investments

### 💳 Transaction Tracking
- **Manual & Automatic Entry**: Add transactions manually or sync via Plaid
- **Smart Categorization**: Automatic transaction categorization with custom categories
- **Advanced Filtering**: Filter by date range, category, amount, account
- **Search & Sort**: Full-text search with multiple sorting options
- **Bulk Operations**: Multi-select for bulk editing and deletion

### 📅 Payment Management
- **Payment Reminders**: Never miss a due date with calendar integration
- **Recurring Payments**: Set up automatic tracking for recurring bills
- **Minimum Payment Tracking**: Monitor minimum payments for credit cards
- **Payment History**: Complete payment history with audit trails

### 📊 Financial Insights
- **Dashboard Analytics**: Real-time financial overview with charts and graphs
- **Spending Trends**: Visualize spending patterns over time
- **Account Health Score**: Financial health indicators and recommendations
- **Category Breakdown**: Pie charts showing spending by category
- **Balance Sparklines**: Trend indicators for account balances

### 🔒 Security & Privacy
- **End-to-End Encryption**: All sensitive data encrypted at rest and in transit
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: DDoS protection with three-tier rate limiting
- **Anomaly Detection**: ML-powered detection of suspicious activities
- **Data Masking**: Automatic PII masking in logs and exports
- **Audit Logging**: Complete audit trail of all user actions
- **OWASP Compliance**: Follows OWASP Top 10 security best practices

### 🎨 User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: Eye-friendly dark theme with smooth transitions
- **Animations**: Polished UI with Framer Motion animations
- **Loading States**: Skeleton screens for better perceived performance
- **Empty States**: Helpful empty state components with guidance
- **Toast Notifications**: Real-time feedback for all actions

### 📜 History & Audit
- **Complete Audit Trail**: Track all changes to accounts, transactions, and payments
- **Activity Logging**: Monitor login attempts, failed authentications, and suspicious activities
- **Change History**: See before/after snapshots of all modifications
- **Export Capabilities**: Download audit logs for compliance

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend
- **MongoDB** - NoSQL database
- **Mongoose** - ODM with schema validation
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Security
- **Helmet** - Security headers
- **express-rate-limit** - DoS protection
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Custom Middleware** - Data masking, anomaly detection

### Testing
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **@testing-library/react** - Component testing
- **Supertest** - API testing
- **80%+ Coverage** - Comprehensive test suite

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization (planned)

### Third-Party Integrations
- **Plaid API** - Bank account linking
- **Sentry** - Error tracking (planned)
- **LogRocket** - Session replay (planned)

---

## 🏛️ Architecture

### System Architecture
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  Express.js API  │◄───────►│  MongoDB Atlas  │
│   (Vercel)      │         │    (Render)      │         │   (Cloud DB)    │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│   Zustand       │         │   Plaid API      │
│   State Store   │         │   (Banking)      │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
```

### Backend Architecture (MVC + Services)
```
┌──────────────────────────────────────────────────────────┐
│                        Middleware                         │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Security │ │ Rate      │ │ Auth     │ │ Validation │ │
│  │ Headers  │ │ Limiting  │ │ JWT      │ │ Sanitize   │ │
│  └──────────┘ └───────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                       Controllers                         │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Auth     │ │ Account   │ │ Trans-   │ │ Payment    │ │
│  │          │ │           │ │ action   │ │            │ │
│  └──────────┘ └───────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                        Services                           │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ │
│  │ User     │ │ Anomaly   │ │ History  │ │ Data       │ │
│  │ Activity │ │ Detection │ │ Tracker  │ │ Masking    │ │
│  └──────────┘ └───────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                     Models (Mongoose)                     │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ │
│  │ User     │ │ Account   │ │ Trans-   │ │ Payment    │ │
│  │          │ │           │ │ action   │ │ Reminder   │ │
│  └──────────┘ └───────────┘ └──────────┘ └────────────┘ │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Trans-   │ │ Account   │ │ Payment  │ │ User       │ │
│  │ action   │ │ History   │ │ History  │ │ Activity   │ │
│  │ History  │ │           │ │          │ │ Log        │ │
│  └──────────┘ └───────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Database Schema
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │────►│  Accounts   │────►│ Transaction │
│             │     │             │     │   History   │
│ - email     │     │ - type      │     │             │
│ - password  │     │ - balance   │     └─────────────┘
│ - name      │     │ - userId    │
└─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │   Payment   │
       │            │  Reminders  │
       │            │             │
       │            └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│    User     │     │   Account   │
│  Activity   │     │   History   │
│    Logs     │     │             │
└─────────────┘     └─────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/twhite444/financial_tracker.git
   cd financial_tracker/financial-tracker-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**

   **Frontend** (`.env` in root):
   ```bash
   cp .env.example .env
   # Edit .env and add:
   VITE_API_URL=http://localhost:5000/api
   ```

   **Backend** (`server/.env`):
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env and add:
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/financial-tracker
   JWT_SECRET=$(openssl rand -base64 32)
   ENCRYPTION_KEY=$(openssl rand -hex 32)
   
   # Optional: Plaid credentials for bank linking
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB:
   mongod --dbpath /path/to/data/directory

   # Or use MongoDB Atlas (cloud) - no local setup needed
   ```

5. **Run the application**

   **Option 1: Run both servers concurrently (recommended)**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

### Quick Start with Docker (Coming Soon)
```bash
docker-compose up
```

---

## 🗺️ Project Roadmap

### ✅ Phase 1: Core Functionality (Completed)
- [x] User authentication and authorization
- [x] Account management (CRUD operations)
- [x] Transaction tracking and categorization
- [x] Payment reminder system
- [x] Responsive dashboard with analytics

### ✅ Phase 2: Bank Integration (Completed)
- [x] Plaid API integration
- [x] Automatic account linking
- [x] Transaction synchronization
- [x] Balance updates

### ✅ Phase 3: Security & Production Ready (Completed)
- [x] Comprehensive audit logging
- [x] Data masking and encryption
- [x] Rate limiting and DDoS protection
- [x] Anomaly detection system
- [x] Input validation and sanitization
- [x] Security headers and CORS
- [x] Test coverage (80%+)

### 🚧 Phase 4: AI Financial Assistant (In Progress)
- [ ] Natural language query interface
- [ ] GPT-4 integration for financial advice
- [ ] Spending pattern analysis
- [ ] Personalized recommendations
- [ ] Voice command support
- [ ] Chatbot UI integration

### 📋 Phase 5: Tax Automation (Planned - Q1 2026)
- [ ] Automatic transaction categorization for tax purposes
- [ ] IRS form generation (1040, Schedule C, etc.)
- [ ] Tax document upload and OCR
- [ ] Deduction recommendations
- [ ] Multi-year tax comparison
- [ ] Export to TurboTax/H&R Block
- [ ] Tax deadline reminders
- [ ] Estimated quarterly tax calculator

### 📋 Phase 6: Advanced Features (Planned - Q2 2026)
- [ ] Investment portfolio tracking
- [ ] Cryptocurrency integration
- [ ] Bill negotiation AI
- [ ] Budget recommendations with ML
- [ ] Expense forecasting
- [ ] Multi-currency support
- [ ] Family account sharing
- [ ] Financial goal tracking

### 📋 Phase 7: Mobile & Desktop Apps (Planned - Q3 2026)
- [ ] React Native mobile app (iOS/Android)
- [ ] Electron desktop app
- [ ] Biometric authentication
- [ ] Offline mode with sync
- [ ] Push notifications
- [ ] Widget support

---

## 🔒 Security

Security is a top priority in this application. See [SECURITY.md](./SECURITY.md) for comprehensive security documentation.

### Security Features
- ✅ **Data Encryption**: All sensitive data encrypted at rest and in transit
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Rate Limiting**: Three-tier rate limiting system (100/50/5 req/15min)
- ✅ **Input Validation**: All inputs validated and sanitized
- ✅ **SQL/NoSQL Injection Protection**: Query parameterization and sanitization
- ✅ **XSS Protection**: Content Security Policy and output encoding
- ✅ **CSRF Protection**: Token-based CSRF prevention
- ✅ **Security Headers**: Helmet.js for secure HTTP headers
- ✅ **Data Masking**: Automatic PII masking in logs (credit cards, SSN, etc.)
- ✅ **Anomaly Detection**: ML-powered detection of suspicious activities
- ✅ **Audit Logging**: Complete audit trail of all actions
- ✅ **OWASP Compliance**: Follows OWASP Top 10 best practices

### Anomaly Detection Thresholds
- Failed logins: 5+ per hour = High Alert
- Suspicious transactions: 20+ per 15 minutes = Bot Activity
- Rapid account changes: 10+ per 10 minutes = Suspicious
- Unusual access: 5+ unique IPs per day = Unusual
- Data exfiltration: 3+ exports per hour = Critical Alert

### Reporting Security Issues
If you discover a security vulnerability, please email **security@yourapp.com** instead of using the issue tracker.

---

## 🧪 Testing

### Test Coverage
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: API endpoints and services
- **E2E Tests**: Critical user flows with Playwright

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Structure
```
tests/
├── unit/               # Unit tests
│   ├── components/     # React component tests
│   ├── services/       # Service layer tests
│   └── utils/          # Utility function tests
├── integration/        # Integration tests
│   ├── auth.test.ts    # Authentication flow
│   └── api.test.ts     # API endpoint tests
└── e2e/                # End-to-end tests
    └── critical-flows.e2e.ts
```

---

## 🚀 Deployment

### Production Deployment

#### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel --prod

# Or use GitHub integration for automatic deployments
```

#### Backend (Render)
```bash
# Deploy to Render
# Use the render.yaml configuration file
# Or connect your GitHub repo in Render dashboard
```

#### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Whitelist your IP addresses
4. Update `MONGODB_URI` in environment variables

### Environment Variables (Production)

**Frontend (Vercel)**:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Backend (Render)**:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/financial-tracker
JWT_SECRET=<strong-random-secret-32-chars-minimum>
ENCRYPTION_KEY=<strong-random-key-32-bytes>
CORS_ORIGIN=https://your-frontend-url.vercel.app
PLAID_CLIENT_ID=<your-plaid-client-id>
PLAID_SECRET=<your-plaid-secret>
PLAID_ENV=production
```

### Deployment Checklist
- [ ] Update all environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Use strong, random secrets (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Configure firewall rules
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable anomaly detection alerts
- [ ] Configure backup strategy
- [ ] Set up log rotation
- [ ] Review CORS settings (no wildcards)
- [ ] Test all critical flows in staging

---

## 🤝 Contributing

Contributions are welcome! This project is primarily for portfolio purposes, but I'm open to improvements and suggestions.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow existing code style (ESLint + Prettier)
- Keep commits atomic and descriptive

---

## 📞 Contact

**Tom White**
- GitHub: [@twhite444](https://github.com/twhite444)
- Email: twhite4@bates.edu
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Portfolio](https://yourportfolio.com)

Project Link: [https://github.com/twhite444/financial_tracker](https://github.com/twhite444/financial_tracker)

---

## 🙏 Acknowledgments

### Technologies & Libraries
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Plaid](https://plaid.com/) - Banking API
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend framework
- [Vitest](https://vitest.dev/) - Testing framework
- [Playwright](https://playwright.dev/) - E2E testing

### Inspiration
- Personal need for unified financial tracking
- Desire to showcase full-stack development skills
- Vision for AI-powered financial management

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Tom White

</div>