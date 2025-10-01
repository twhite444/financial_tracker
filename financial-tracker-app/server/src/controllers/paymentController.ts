import { Response } from 'express';
import { PaymentReminder } from '../models/PaymentReminder';
import { Account } from '../models/Account';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

// Validation rules
export const paymentValidation = [
  body('accountId').notEmpty().withMessage('Account ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('Invalid due date format'),
  body('recurring').isBoolean().withMessage('Recurring must be a boolean'),
  body('frequency')
    .optional()
    .isIn(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'])
    .withMessage('Invalid frequency'),
];

// Get all payment reminders for user
export const getPaymentReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { startDate, endDate, isPaid } = req.query;

    const query: any = { userId };

    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate as string);
      if (endDate) query.dueDate.$lte = new Date(endDate as string);
    }

    if (isPaid !== undefined) {
      query.isPaid = isPaid === 'true';
    }

    const payments = await PaymentReminder.find(query)
      .populate('accountId', 'name institution')
      .sort({ dueDate: 1 });

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Get payment reminders error:', error);
    res.status(500).json({ error: 'Error fetching payment reminders' });
  }
};

// Get single payment reminder
export const getPaymentReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const payment = await PaymentReminder.findOne({ _id: id, userId }).populate(
      'accountId',
      'name institution'
    );

    if (!payment) {
      res.status(404).json({ error: 'Payment reminder not found' });
      return;
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error('Get payment reminder error:', error);
    res.status(500).json({ error: 'Error fetching payment reminder' });
  }
};

// Create new payment reminder
export const createPaymentReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { accountId, title, amount, dueDate, recurring, frequency, notes } = req.body;

    // Verify account belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const payment = new PaymentReminder({
      userId,
      accountId,
      title,
      amount,
      dueDate,
      recurring,
      frequency,
      notes,
    });

    await payment.save();

    res.status(201).json({ message: 'Payment reminder created successfully', payment });
  } catch (error) {
    console.error('Create payment reminder error:', error);
    res.status(500).json({ error: 'Error creating payment reminder' });
  }
};

// Update payment reminder
export const updatePaymentReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const userId = req.userId;
    const { accountId, title, amount, dueDate, recurring, frequency, isPaid, notes } = req.body;

    // Verify account belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const updateData: any = {
      accountId,
      title,
      amount,
      dueDate,
      recurring,
      frequency,
      notes,
    };

    // If marking as paid, set paidDate
    if (isPaid !== undefined) {
      updateData.isPaid = isPaid;
      if (isPaid) {
        updateData.paidDate = new Date();
      } else {
        updateData.paidDate = null;
      }
    }

    const payment = await PaymentReminder.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment reminder not found' });
      return;
    }

    res.status(200).json({ message: 'Payment reminder updated successfully', payment });
  } catch (error) {
    console.error('Update payment reminder error:', error);
    res.status(500).json({ error: 'Error updating payment reminder' });
  }
};

// Mark payment as paid
export const markPaymentAsPaid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const payment = await PaymentReminder.findOneAndUpdate(
      { _id: id, userId },
      { isPaid: true, paidDate: new Date() },
      { new: true }
    );

    if (!payment) {
      res.status(404).json({ error: 'Payment reminder not found' });
      return;
    }

    res.status(200).json({ message: 'Payment marked as paid', payment });
  } catch (error) {
    console.error('Mark payment as paid error:', error);
    res.status(500).json({ error: 'Error marking payment as paid' });
  }
};

// Delete payment reminder
export const deletePaymentReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const payment = await PaymentReminder.findOneAndDelete({ _id: id, userId });

    if (!payment) {
      res.status(404).json({ error: 'Payment reminder not found' });
      return;
    }

    res.status(200).json({ message: 'Payment reminder deleted successfully' });
  } catch (error) {
    console.error('Delete payment reminder error:', error);
    res.status(500).json({ error: 'Error deleting payment reminder' });
  }
};

// Get upcoming payments
export const getUpcomingPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const daysAhead = Number(req.query.days) || 30;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    const payments = await PaymentReminder.find({
      userId,
      isPaid: false,
      dueDate: { $gte: startDate, $lte: endDate },
    })
      .populate('accountId', 'name institution')
      .sort({ dueDate: 1 });

    res.status(200).json({ payments, count: payments.length });
  } catch (error) {
    console.error('Get upcoming payments error:', error);
    res.status(500).json({ error: 'Error fetching upcoming payments' });
  }
};
