# Security Documentation

This document outlines the security measures implemented in the Financial Tracker application and best practices for maintaining security.

## 🔒 Security Features Implemented

### 1. Data Protection

#### Data Masking
All sensitive data is automatically masked in logs and history records:
- **Credit Card Numbers**: `4111********1111`
- **SSN**: `***-**-1234`
- **Email Addresses**: `user*****@example.com`
- **IP Addresses**: `192.168.***.***`
- **Bank Account Numbers**: Fully masked
- **Routing Numbers**: Fully masked
- **API Keys/Tokens**: Fully masked

**Implementation**: `server/src/utils/dataMasking.ts`

#### Sensitive Fields Protected
The following fields are NEVER stored in plain text in history logs:
- `password`, `passwordHash`, `hashedPassword`
- `token`, `accessToken`, `refreshToken`, `apiKey`, `secret`
- `ssn`, `socialSecurityNumber`
- `creditCard`, `cardNumber`, `cvv`, `pin`
- `bankAccount`, `routingNumber`
- `privateKey`, `encryptionKey`

### 2. Rate Limiting

#### Three-Tier Rate Limiting System
1. **General Rate Limit**: 100 requests per 15 minutes (all endpoints)
2. **History Endpoints**: 50 requests per 15 minutes
3. **Login Endpoint**: 5 attempts per 15 minutes

**Implementation**: `server/src/middleware/security.ts`

**Automatic Dev Environment Bypass**: Rate limiting is relaxed in development mode for easier testing.

### 3. Input Validation & Sanitization

All user inputs are validated and sanitized to prevent injection attacks:

#### Validation Rules
- **Limit**: 1-100 (pagination)
- **Skip**: ≥ 0 (pagination)
- **Action Types**: Whitelist of allowed values
- **Date Fields**: ISO 8601 format validation
- **MongoDB IDs**: Valid ObjectId format

#### Protection Against
- SQL Injection
- NoSQL Injection (MongoDB operator injection)
- XSS (Cross-Site Scripting)
- Command Injection

**Implementation**: `server/src/middleware/security.ts`

### 4. Anomaly Detection

Automated monitoring for suspicious patterns:

#### Detection Algorithms

**Failed Login Monitoring**
- **Threshold**: 5+ failed logins per hour
- **Alert Level**: High
- **Action**: Log and alert

**Suspicious Transactions**
- **Threshold**: 20+ transactions in 15 minutes
- **Alert Level**: High
- **Action**: Log and investigate

**Rapid Account Changes**
- **Threshold**: 10+ account modifications in 10 minutes
- **Alert Level**: Medium
- **Action**: Log and review

**Unusual Access Patterns**
- **Threshold**: 5+ unique IP addresses in one day
- **Alert Level**: Medium
- **Action**: Log and verify

**Data Exfiltration**
- **Threshold**: 3+ history exports per hour
- **Alert Level**: Critical
- **Action**: Block and alert immediately

**Implementation**: `server/src/services/anomalyDetectionService.ts`

### 5. Security Headers

All responses include security headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

### 6. Authentication & Authorization

- **JWT Tokens**: Signed with strong secret (minimum 32 characters)
- **Token Expiration**: 7 days default
- **Password Hashing**: bcrypt with configurable rounds
- **Protected Routes**: All API endpoints require authentication

### 7. Error Handling

- **Production Mode**: Generic error messages only
- **Development Mode**: Detailed errors for debugging
- **Information Leakage Prevention**: No stack traces or internal paths in production

## 🚨 Security Best Practices

### For Developers

#### 1. Environment Variables
```bash
# NEVER commit .env files to git
# Always use strong, random secrets
# Generate secrets with:
openssl rand -base64 32  # For JWT_SECRET
openssl rand -hex 32     # For ENCRYPTION_KEY
```

#### 2. Sensitive Data Handling
```typescript
// ❌ BAD - Logging sensitive data
console.log('User data:', user);

// ✅ GOOD - Mask before logging
import { sanitizeForLogging } from './utils/dataMasking';
console.log('User data:', sanitizeForLogging(user));
```

#### 3. Database Queries
```typescript
// ❌ BAD - Direct query with user input
const results = await Model.find({ $where: userInput });

// ✅ GOOD - Use parameterized queries
const results = await Model.find({ 
  userId: sanitizedUserId 
});
```

#### 4. API Responses
```typescript
// ❌ BAD - Exposing sensitive fields
res.json(user);

// ✅ GOOD - Use sanitizeForAPI
import { sanitizeForAPI } from './utils/dataMasking';
res.json(sanitizeForAPI(user));
```

### For Deployment

#### 1. Production Checklist
- [ ] Update all secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS only (no HTTP)
- [ ] Configure firewall rules
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable anomaly detection alerts
- [ ] Configure backup strategy
- [ ] Set up log rotation
- [ ] Review CORS settings (no wildcards)
- [ ] Enable rate limiting
- [ ] Review user permissions

#### 2. Database Security
```bash
# Use authentication
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin

# Enable SSL/TLS
MONGODB_URI=mongodb://user:pass@host/db?ssl=true

# Whitelist IPs in MongoDB Atlas
# Enable network encryption
# Set up regular backups
```

#### 3. CORS Configuration
```typescript
// ❌ BAD - Allows all origins
cors({ origin: '*' })

// ✅ GOOD - Specific domain only
cors({ origin: 'https://yourapp.com' })
```

#### 4. Monitoring Setup
```bash
# Add to .env
SENTRY_DSN=https://your-dsn@sentry.io/project
LOGROCKET_APP_ID=your-app-id
ALERT_EMAIL=security@yourapp.com

# Enable logging
ENABLE_SECURITY_LOGGING=true
ENABLE_ANOMALY_DETECTION=true
```

## 🚧 Security Incident Response

### 1. Detecting Anomalies
Monitor logs for:
```
[ANOMALY DETECTED] Failed Login Pattern
[ANOMALY DETECTED] Suspicious Transaction Activity
[ANOMALY DETECTED] Rapid Account Changes
[ANOMALY DETECTED] Unusual Access Pattern
[ANOMALY DETECTED] Potential Data Exfiltration
```

### 2. Immediate Actions
1. **Review the alert details** in UserActivityLog
2. **Verify if legitimate** (contact user if needed)
3. **Lock account temporarily** if critical severity
4. **Investigate IP addresses** and access patterns
5. **Review recent changes** in history logs
6. **Reset credentials** if compromised
7. **Document incident** for future reference

### 3. Post-Incident
1. **Update security measures** based on findings
2. **Notify affected users** if necessary
3. **Review and improve** detection thresholds
4. **Update documentation** with lessons learned

## 🔍 Auditing & Compliance

### History Tracking
All changes are automatically tracked:
- **Transactions**: Create, update, delete
- **Accounts**: Create, update, delete
- **Payment Reminders**: Create, update, delete
- **User Activities**: Login, logout, failed attempts

### Retention Policy
```bash
# Set in .env
HISTORY_RETENTION_DAYS=365  # Keep for 1 year
```

### Accessing Audit Logs
```bash
# API Endpoints
GET /api/history/transactions?userId={id}&limit=50
GET /api/history/accounts?userId={id}&action=update
GET /api/history/payments?userId={id}
GET /api/history/activity?userId={id}
GET /api/history/activity/stats?userId={id}&days=30
GET /api/history/all?userId={id}
```

## 📊 Security Metrics

### Monitoring Queries
```javascript
// Get failed login attempts (last 24 hours)
db.userActivityLogs.find({
  action: 'failed_login',
  timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) }
});

// Get anomaly detection stats
GET /api/history/activity/stats?userId={id}&days=7

// Get high-value transactions (potential fraud)
db.transactionHistories.find({
  'newData.amount': { $gt: 10000 },
  timestamp: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
});
```

## 🔐 Public Repository Guidelines

### What to Keep Private
✅ **Committed to git (public)**:
- Source code
- `.env.example` (templates only)
- Documentation
- Tests
- Public configuration

❌ **NEVER commit (private)**:
- `.env` files
- API keys/tokens
- Database credentials
- SSL certificates
- Private keys
- User data exports
- Database backups
- Security audit reports

### .gitignore Coverage
See `.gitignore` for comprehensive list of protected patterns including:
- Environment files (`.env*`)
- API keys (`*_key`, `*_secret`, `*_token`)
- Credentials (`credentials.json`, `api-keys.json`)
- Backups (`*.dump`, `*.backup`, `*.sql`)
- Cloud configs (`.aws/`, `.gcloud/`, `.azure/`)

## 🛠️ Testing Security

### Manual Testing
```bash
# Test rate limiting
for i in {1..10}; do curl http://localhost:5000/api/auth/login; done

# Test input validation
curl -X POST http://localhost:5000/api/history/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"limit": "invalid"}'

# Test SQL injection protection
curl -X GET "http://localhost:5000/api/history/transactions?userId=1' OR '1'='1"
```

### Automated Testing
```bash
# Run security tests (to be implemented)
npm run test:security

# Run integration tests
npm run test:integration
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 📞 Security Contact

For security vulnerabilities, please contact: [your-security-email@example.com]

**DO NOT** create public GitHub issues for security vulnerabilities.

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
