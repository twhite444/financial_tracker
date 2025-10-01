import { Response } from 'express';
import { Account } from '../models/Account';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

// Validation rules
export const accountValidation = [
  body('name').trim().notEmpty().withMessage('Account name is required'),
  body('type')
    .isIn(['checking', 'savings', 'credit_card', 'investment', 'loan'])
    .withMessage('Invalid account type'),
  body('institution').trim().notEmpty().withMessage('Institution name is required'),
  body('balance').isNumeric().withMessage('Balance must be a number'),
  body('creditLimit').optional().isNumeric().withMessage('Credit limit must be a number'),
];

// Get all accounts for user
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const accounts = await Account.find({ userId, isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Error fetching accounts' });
  }
};

// Get single account
export const getAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const account = await Account.findOne({ _id: id, userId });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.status(200).json({ account });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Error fetching account' });
  }
};

// Create new account
export const createAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { name, type, institution, balance, creditLimit, currency } = req.body;

    const account = new Account({
      userId,
      name,
      type,
      institution,
      balance,
      creditLimit,
      currency: currency || 'USD',
    });

    await account.save();

    res.status(201).json({ message: 'Account created successfully', account });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Error creating account' });
  }
};

// Update account
export const updateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const userId = req.userId;
    const { name, type, institution, balance, creditLimit, currency } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: id, userId },
      { name, type, institution, balance, creditLimit, currency },
      { new: true, runValidators: true }
    );

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.status(200).json({ message: 'Account updated successfully', account });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Error updating account' });
  }
};

// Delete account (soft delete)
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const account = await Account.findOneAndUpdate(
      { _id: id, userId },
      { isActive: false },
      { new: true }
    );

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Error deleting account' });
  }
};

// Get account summary statistics
export const getAccountSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const accounts = await Account.find({ userId, isActive: true });

    const summary = {
      totalBalance: 0,
      totalDebt: 0,
      totalCreditLimit: 0,
      accountsByType: {} as Record<string, number>,
    };

    accounts.forEach((account) => {
      if (account.type === 'credit_card' || account.type === 'loan') {
        summary.totalDebt += account.balance;
        if (account.creditLimit) {
          summary.totalCreditLimit += account.creditLimit;
        }
      } else {
        summary.totalBalance += account.balance;
      }

      summary.accountsByType[account.type] = (summary.accountsByType[account.type] || 0) + 1;
    });

    summary.totalBalance = Math.round(summary.totalBalance * 100) / 100;
    summary.totalDebt = Math.round(summary.totalDebt * 100) / 100;

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Get account summary error:', error);
    res.status(500).json({ error: 'Error fetching account summary' });
  }
};
