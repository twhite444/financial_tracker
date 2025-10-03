import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { body, query, param, validationResult } from 'express-validator';
import { sanitizeErrorMessage } from '../utils/dataMasking';

/**
 * Rate limiter for history endpoints
 * More restrictive than general API endpoints
 */
export const historyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Max 50 requests per 15 minutes
  message: 'Too many history requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for localhost in development
  skip: (req) => {
    return process.env.NODE_ENV === 'development' && 
           (req.ip === '127.0.0.1' || req.ip === '::1');
  },
});

/**
 * Stricter rate limiter for sensitive operations
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests. Account temporarily locked. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for failed login attempts
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
  skipSuccessfulRequests: true, // Only count failed requests
});

/**
 * Validation rules for history query parameters
 */
export const historyQueryValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer')
    .toInt(),
  query('action')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Action must be a valid string'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
];

/**
 * Validation rules for entity ID parameters
 */
export const entityIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

/**
 * Sanitize and validate query parameters
 */
export const sanitizeQueryParams = (req: Request, res: Response, next: NextFunction) => {
  // Remove any potentially dangerous characters
  Object.keys(req.query).forEach(key => {
    if (typeof req.query[key] === 'string') {
      // Remove scripts and SQL injection attempts
      req.query[key] = (req.query[key] as string)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[;'"\\]/g, '')
        .trim();
    }
  });

  next();
};

/**
 * Validation error handler
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Sanitize error messages to prevent information leakage
    const sanitizedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : undefined,
      message: sanitizeErrorMessage(error.msg),
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details: sanitizedErrors,
    });
  }

  next();
};

/**
 * Security headers middleware
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

/**
 * Prevent information leakage in errors
 */
export const sanitizeErrorResponse = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // In production, don't leak error details
  const isProduction = process.env.NODE_ENV === 'production';
  
  const statusCode = err.statusCode || 500;
  const message = isProduction 
    ? 'An error occurred. Please try again later.'
    : sanitizeErrorMessage(err.message || 'Internal server error');

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
};

/**
 * Detect and block SQL injection attempts
 */
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
    /(--|\#|\/\*|\*\/)/,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const hasSuspiciousContent = 
    checkValue(req.query) ||
    checkValue(req.body) ||
    checkValue(req.params);

  if (hasSuspiciousContent) {
    console.warn('🚨 SQL Injection attempt detected:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });

    return res.status(400).json({
      error: 'Invalid request',
    });
  }

  next();
};

/**
 * Detect and block NoSQL injection attempts
 */
export const noSQLInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const checkForNoSQLInjection = (obj: any): boolean => {
    if (typeof obj !== 'object' || obj === null) return false;

    const suspiciousKeys = ['$where', '$regex', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin'];
    
    for (const key of Object.keys(obj)) {
      if (suspiciousKeys.includes(key)) {
        return true;
      }
      if (typeof obj[key] === 'object' && checkForNoSQLInjection(obj[key])) {
        return true;
      }
    }
    
    return false;
  };

  if (checkForNoSQLInjection(req.body) || checkForNoSQLInjection(req.query)) {
    console.warn('🚨 NoSQL Injection attempt detected:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });

    return res.status(400).json({
      error: 'Invalid request',
    });
  }

  next();
};

/**
 * Request logging with security context
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId || 'anonymous';
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId,
      ip: req.ip,
      userAgent: req.get('user-agent')?.substring(0, 100),
    };

    // Log suspicious activity
    if (res.statusCode >= 400) {
      console.warn('⚠️ Failed request:', logData);
    }

    // Log slow requests
    if (duration > 5000) {
      console.warn('🐌 Slow request:', logData);
    }
  });

  next();
};
