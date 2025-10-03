import { Request, Response } from 'express';
import { TransactionHistory } from '../models/TransactionHistory';
import { AccountHistory } from '../models/AccountHistory';
import { PaymentHistory } from '../models/PaymentHistory';
import { getUserActivityHistory, getActivityStatistics } from '../services/userActivityService';

/**
 * Get transaction history
 */
export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { transactionId, limit = 50, skip = 0, action } = req.query;

    const query: any = { userId };
    
    if (transactionId) {
      query.transactionId = transactionId;
    }
    
    if (action) {
      query.action = action;
    }

    const [history, total] = await Promise.all([
      TransactionHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('changedBy', 'firstName lastName email')
        .lean(),
      TransactionHistory.countDocuments(query),
    ]);

    res.status(200).json({
      history,
      total,
      page: Math.floor(Number(skip) / Number(limit)) + 1,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Error fetching transaction history' });
  }
};

/**
 * Get account history
 */
export const getAccountHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { accountId, limit = 50, skip = 0, action } = req.query;

    const query: any = { userId };
    
    if (accountId) {
      query.accountId = accountId;
    }
    
    if (action) {
      query.action = action;
    }

    const [history, total] = await Promise.all([
      AccountHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('changedBy', 'firstName lastName email')
        .lean(),
      AccountHistory.countDocuments(query),
    ]);

    res.status(200).json({
      history,
      total,
      page: Math.floor(Number(skip) / Number(limit)) + 1,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching account history:', error);
    res.status(500).json({ error: 'Error fetching account history' });
  }
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { paymentId, limit = 50, skip = 0, action } = req.query;

    const query: any = { userId };
    
    if (paymentId) {
      query.paymentId = paymentId;
    }
    
    if (action) {
      query.action = action;
    }

    const [history, total] = await Promise.all([
      PaymentHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('changedBy', 'firstName lastName email')
        .lean(),
      PaymentHistory.countDocuments(query),
    ]);

    res.status(200).json({
      history,
      total,
      page: Math.floor(Number(skip) / Number(limit)) + 1,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Error fetching payment history' });
  }
};

/**
 * Get user activity log
 */
export const getUserActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, skip = 0, action, startDate, endDate } = req.query;

    const options = {
      limit: Number(limit),
      skip: Number(skip),
      action: action as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    };

    const result = await getUserActivityHistory(userId, options);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Error fetching user activity' });
  }
};

/**
 * Get user activity statistics
 */
export const getUserActivityStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { days = 30 } = req.query;

    const stats = await getActivityStatistics(userId, Number(days));

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    res.status(500).json({ error: 'Error fetching activity statistics' });
  }
};

/**
 * Get all history (combined view)
 */
export const getAllHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { limit = 20, skip = 0 } = req.query;

    // Fetch recent history from all sources
    const [transactions, accounts, payments, activities] = await Promise.all([
      TransactionHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('changedBy', 'firstName lastName')
        .lean(),
      AccountHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('changedBy', 'firstName lastName')
        .lean(),
      PaymentHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('changedBy', 'firstName lastName')
        .lean(),
      getUserActivityHistory(userId, { limit: 10, skip: 0 }),
    ]);

    // Combine and sort all history
    const combinedHistory = [
      ...transactions.map(h => ({ ...h, type: 'transaction' })),
      ...accounts.map(h => ({ ...h, type: 'account' })),
      ...payments.map(h => ({ ...h, type: 'payment' })),
      ...activities.activities.map(h => ({ ...h, type: 'user_activity' })),
    ].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    // Paginate combined results
    const paginatedHistory = combinedHistory.slice(Number(skip), Number(skip) + Number(limit));

    res.status(200).json({
      history: paginatedHistory,
      total: combinedHistory.length,
      page: Math.floor(Number(skip) / Number(limit)) + 1,
      totalPages: Math.ceil(combinedHistory.length / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching combined history:', error);
    res.status(500).json({ error: 'Error fetching combined history' });
  }
};
