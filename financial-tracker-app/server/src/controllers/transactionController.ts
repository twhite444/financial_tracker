import { Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

// Validation rules
export const transactionValidation = [
  body('accountId').notEmpty().withMessage('Account ID is required'),
  body('type').isIn(['income', 'expense']).withMessage('Invalid transaction type'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
];

// Get all transactions for user
export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { accountId, category, type, startDate, endDate, search, page = 1, limit = 50 } = req.query;

    const query: any = { userId };

    if (accountId) query.accountId = accountId;
    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { merchant: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('accountId', 'name institution')
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

// Get single transaction
export const getTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({ _id: id, userId }).populate(
      'accountId',
      'name institution'
    );

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Error fetching transaction' });
  }
};

// Create new transaction
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { accountId, type, category, amount, description, date, merchant, tags } = req.body;

    // Verify account belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const transaction = new Transaction({
      userId,
      accountId,
      type,
      category,
      amount,
      description,
      date,
      merchant,
      tags,
    });

    await transaction.save();

    // Update account balance
    if (type === 'income') {
      account.balance += amount;
    } else {
      account.balance -= amount;
    }
    await account.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  }
};

// Update transaction
export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const userId = req.userId;
    const { accountId, type, category, amount, description, date, merchant, tags } = req.body;

    const oldTransaction = await Transaction.findOne({ _id: id, userId });
    if (!oldTransaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    // Verify new account belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    // Revert old transaction from old account
    const oldAccount = await Account.findById(oldTransaction.accountId);
    if (oldAccount) {
      if (oldTransaction.type === 'income') {
        oldAccount.balance -= oldTransaction.amount;
      } else {
        oldAccount.balance += oldTransaction.amount;
      }
      await oldAccount.save();
    }

    // Update transaction
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { accountId, type, category, amount, description, date, merchant, tags },
      { new: true, runValidators: true }
    );

    // Apply new transaction to new account
    if (type === 'income') {
      account.balance += amount;
    } else {
      account.balance -= amount;
    }
    await account.save();

    res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
};

// Delete transaction
export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    // Revert transaction from account balance
    const account = await Account.findById(transaction.accountId);
    if (account) {
      if (transaction.type === 'income') {
        account.balance -= transaction.amount;
      } else {
        account.balance += transaction.amount;
      }
      await account.save();
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
};

// Get transaction statistics
export const getTransactionStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    const dateQuery: any = {};
    if (startDate) dateQuery.$gte = new Date(startDate as string);
    if (endDate) dateQuery.$lte = new Date(endDate as string);

    const query: any = { userId };
    if (Object.keys(dateQuery).length > 0) {
      query.date = dateQuery;
    }

    const transactions = await Transaction.find(query);

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      transactionCount: transactions.length,
      categoryBreakdown: {} as Record<string, number>,
    };

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        stats.totalIncome += transaction.amount;
      } else {
        stats.totalExpenses += transaction.amount;
      }

      stats.categoryBreakdown[transaction.category] =
        (stats.categoryBreakdown[transaction.category] || 0) + transaction.amount;
    });

    stats.netIncome = stats.totalIncome - stats.totalExpenses;
    stats.totalIncome = Math.round(stats.totalIncome * 100) / 100;
    stats.totalExpenses = Math.round(stats.totalExpenses * 100) / 100;
    stats.netIncome = Math.round(stats.netIncome * 100) / 100;

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({ error: 'Error fetching transaction statistics' });
  }
};
