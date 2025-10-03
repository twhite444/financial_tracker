import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getTransactionHistory,
  getAccountHistory,
  getPaymentHistory,
  getUserActivity,
  getUserActivityStats,
  getAllHistory,
} from '../controllers/historyController';

const router = express.Router();

// All history routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/history/transactions
 * @desc    Get transaction history
 * @query   transactionId, action, limit, skip
 * @access  Private
 */
router.get('/transactions', getTransactionHistory);

/**
 * @route   GET /api/history/accounts
 * @desc    Get account history
 * @query   accountId, action, limit, skip
 * @access  Private
 */
router.get('/accounts', getAccountHistory);

/**
 * @route   GET /api/history/payments
 * @desc    Get payment history
 * @query   paymentId, action, limit, skip
 * @access  Private
 */
router.get('/payments', getPaymentHistory);

/**
 * @route   GET /api/history/activity
 * @desc    Get user activity log
 * @query   action, startDate, endDate, limit, skip
 * @access  Private
 */
router.get('/activity', getUserActivity);

/**
 * @route   GET /api/history/activity/stats
 * @desc    Get user activity statistics
 * @query   days (default: 30)
 * @access  Private
 */
router.get('/activity/stats', getUserActivityStats);

/**
 * @route   GET /api/history/all
 * @desc    Get combined history from all sources
 * @query   limit, skip
 * @access  Private
 */
router.get('/all', getAllHistory);

export default router;
