import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  historyRateLimiter,
  historyQueryValidation,
  handleValidationErrors,
  sanitizeQueryParams,
  sqlInjectionProtection,
  noSQLInjectionProtection,
  securityLogger,
} from '../middleware/security';
import {
  getTransactionHistory,
  getAccountHistory,
  getPaymentHistory,
  getUserActivity,
  getUserActivityStats,
  getAllHistory,
} from '../controllers/historyController';

const router = express.Router();

// Apply security middleware to all history routes
router.use(securityLogger);
router.use(sqlInjectionProtection);
router.use(noSQLInjectionProtection);
router.use(sanitizeQueryParams);
router.use(historyRateLimiter);
router.use(authenticateToken);

/**
 * @route   GET /api/history/transactions
 * @desc    Get transaction history
 * @query   transactionId, action, limit, skip
 * @access  Private
 */
router.get(
  '/transactions',
  historyQueryValidation,
  handleValidationErrors,
  getTransactionHistory
);

/**
 * @route   GET /api/history/accounts
 * @desc    Get account history
 * @query   accountId, action, limit, skip
 * @access  Private
 */
router.get(
  '/accounts',
  historyQueryValidation,
  handleValidationErrors,
  getAccountHistory
);

/**
 * @route   GET /api/history/payments
 * @desc    Get payment history
 * @query   paymentId, action, limit, skip
 * @access  Private
 */
router.get(
  '/payments',
  historyQueryValidation,
  handleValidationErrors,
  getPaymentHistory
);

/**
 * @route   GET /api/history/activity
 * @desc    Get user activity log
 * @query   action, startDate, endDate, limit, skip
 * @access  Private
 */
router.get(
  '/activity',
  historyQueryValidation,
  handleValidationErrors,
  getUserActivity
);

/**
 * @route   GET /api/history/activity/stats
 * @desc    Get user activity statistics
 * @query   days (default: 30)
 * @access  Private
 */
router.get(
  '/activity/stats',
  handleValidationErrors,
  getUserActivityStats
);

/**
 * @route   GET /api/history/all
 * @desc    Get combined history from all sources
 * @query   limit, skip
 * @access  Private
 */
router.get(
  '/all',
  historyQueryValidation,
  handleValidationErrors,
  getAllHistory
);

export default router;
