import { Response } from 'express';
import { Loan } from '../models/Loan';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

// Validation rules
export const loanValidation = [
  body('name').trim().notEmpty().withMessage('Loan name is required'),
  body('loanType')
    .isIn(['mortgage', 'auto', 'personal', 'student', 'other'])
    .withMessage('Invalid loan type'),
  body('principal')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Principal must be a positive number'),
  body('interestRate')
    .isNumeric()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Interest rate must be a decimal between 0 and 1 (e.g., 0.05 for 5%)'),
  body('termMonths')
    .isInt({ min: 1 })
    .withMessage('Term must be at least 1 month'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('lender').optional().trim(),
  body('notes').optional().trim(),
];

/**
 * Calculate monthly payment using standard amortization formula
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (annualRate === 0) {
    return principal / termMonths;
  }

  const monthlyRate = annualRate / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Calculate next payment date
 */
function getNextPaymentDate(startDate: Date, paymentsMade: number = 0): Date {
  const nextDate = new Date(startDate);
  nextDate.setMonth(nextDate.getMonth() + paymentsMade + 1);
  return nextDate;
}

// Get all loans for user
export const getLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const loans = await Loan.find(query).sort({ createdAt: -1 });

    // Calculate summary statistics
    const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const totalMonthlyPayment = loans
      .filter(loan => loan.status === 'active')
      .reduce((sum, loan) => sum + loan.monthlyPayment, 0);
    const totalInterestPaid = loans.reduce((sum, loan) => sum + loan.interestPaid, 0);

    res.status(200).json({
      loans,
      summary: {
        totalDebt: Math.round(totalDebt * 100) / 100,
        totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
        totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
        loanCount: loans.length,
        activeLoans: loans.filter(l => l.status === 'active').length,
      },
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Error fetching loans' });
  }
};

// Get single loan
export const getLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const loan = await Loan.findOne({ _id: id, userId });

    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    res.status(200).json({ loan });
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Error fetching loan' });
  }
};

// Create new loan
export const createLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId;
    const { name, loanType, principal, interestRate, termMonths, startDate, lender, notes } = req.body;

    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment(principal, interestRate, termMonths);
    const nextPaymentDate = getNextPaymentDate(new Date(startDate));

    const loan = new Loan({
      userId,
      name,
      loanType,
      principal,
      interestRate,
      termMonths,
      startDate: new Date(startDate),
      monthlyPayment,
      remainingBalance: principal,
      totalPaid: 0,
      interestPaid: 0,
      status: 'active',
      lender,
      notes,
      nextPaymentDate,
    });

    await loan.save();

    res.status(201).json({
      message: 'Loan created successfully',
      loan,
    });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Error creating loan' });
  }
};

// Update loan
export const updateLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const userId = req.userId;
    const updates = req.body;

    // Find existing loan
    const loan = await Loan.findOne({ _id: id, userId });
    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    // Recalculate monthly payment if relevant fields changed
    if (updates.principal || updates.interestRate || updates.termMonths) {
      const principal = updates.principal || loan.principal;
      const interestRate = updates.interestRate || loan.interestRate;
      const termMonths = updates.termMonths || loan.termMonths;
      updates.monthlyPayment = calculateMonthlyPayment(principal, interestRate, termMonths);
    }

    // Update next payment date if start date changed
    if (updates.startDate) {
      updates.nextPaymentDate = getNextPaymentDate(new Date(updates.startDate));
    }

    // Apply updates
    Object.assign(loan, updates);
    await loan.save();

    res.status(200).json({
      message: 'Loan updated successfully',
      loan,
    });
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ error: 'Error updating loan' });
  }
};

// Delete loan
export const deleteLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const loan = await Loan.findOneAndDelete({ _id: id, userId });

    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Error deleting loan' });
  }
};

// Get amortization schedule for a loan
export const getAmortizationSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const loan = await Loan.findOne({ _id: id, userId });

    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    // Generate amortization schedule
    const schedule = [];
    let remainingBalance = loan.principal;
    const monthlyRate = loan.interestRate / 12;

    for (let i = 1; i <= loan.termMonths; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = loan.monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      const paymentDate = new Date(loan.startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      schedule.push({
        paymentNumber: i,
        paymentDate,
        paymentAmount: loan.monthlyPayment,
        principalPaid: Math.round(principalPayment * 100) / 100,
        interestPaid: Math.round(interestPayment * 100) / 100,
        remainingBalance: Math.round(remainingBalance * 100) / 100,
      });
    }

    // Calculate total interest
    const totalInterest = loan.monthlyPayment * loan.termMonths - loan.principal;

    res.status(200).json({
      loan: {
        id: loan._id,
        name: loan.name,
        principal: loan.principal,
        interestRate: loan.interestRate,
        termMonths: loan.termMonths,
        monthlyPayment: loan.monthlyPayment,
      },
      schedule,
      summary: {
        totalPayments: loan.termMonths,
        totalPaid: Math.round(loan.monthlyPayment * loan.termMonths * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPrincipal: loan.principal,
      },
    });
  } catch (error) {
    console.error('Get amortization schedule error:', error);
    res.status(500).json({ error: 'Error generating amortization schedule' });
  }
};

// Record a loan payment
export const recordLoanPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { paymentAmount, paymentDate, accountId, createTransaction } = req.body;

    if (!paymentAmount || paymentAmount <= 0) {
      res.status(400).json({ error: 'Valid payment amount is required' });
      return;
    }

    const loan = await Loan.findOne({ _id: id, userId });

    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    // Calculate interest and principal portions
    const monthlyRate = loan.interestRate / 12;
    const interestCharge = loan.remainingBalance * monthlyRate;
    const principalPayment = paymentAmount - interestCharge;

    // Update loan
    loan.remainingBalance = Math.max(0, loan.remainingBalance - principalPayment);
    loan.totalPaid += paymentAmount;
    loan.interestPaid += interestCharge;

    // Update status if paid off
    if (loan.remainingBalance === 0) {
      loan.status = 'paid_off';
    }

    // Update next payment date
    if (loan.status === 'active') {
      const currentDate = paymentDate ? new Date(paymentDate) : new Date();
      loan.nextPaymentDate = new Date(currentDate);
      loan.nextPaymentDate.setMonth(loan.nextPaymentDate.getMonth() + 1);
    }

    await loan.save();

    // Create linked transaction if requested and accountId provided
    let transaction = null;
    if (createTransaction && accountId) {
      transaction = await Transaction.create({
        userId,
        accountId,
        type: 'expense',
        category: 'Loan Payment',
        amount: paymentAmount,
        description: `Payment for ${loan.name}`,
        date: paymentDate ? new Date(paymentDate) : new Date(),
        loanId: loan._id,
        loanPaymentDetails: {
          principalPaid: Math.round(principalPayment * 100) / 100,
          interestPaid: Math.round(interestCharge * 100) / 100,
        },
      });
    }

    res.status(200).json({
      message: 'Payment recorded successfully',
      loan,
      transaction,
      paymentBreakdown: {
        totalPayment: Math.round(paymentAmount * 100) / 100,
        principalPaid: Math.round(principalPayment * 100) / 100,
        interestPaid: Math.round(interestCharge * 100) / 100,
        newBalance: loan.remainingBalance,
      },
    });
  } catch (error) {
    console.error('Record loan payment error:', error);
    res.status(500).json({ error: 'Error recording loan payment' });
  }
};

// Get loan statistics and insights
export const getLoanStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const loans = await Loan.find({ userId });

    if (loans.length === 0) {
      res.status(200).json({
        totalLoans: 0,
        activeLoans: 0,
        totalDebt: 0,
        totalMonthlyPayment: 0,
        totalInterestPaid: 0,
        averageInterestRate: 0,
        byType: {},
      });
      return;
    }

    // Calculate statistics
    const activeLoans = loans.filter(l => l.status === 'active');
    const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const totalMonthlyPayment = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
    const totalInterestPaid = loans.reduce((sum, loan) => sum + loan.interestPaid, 0);
    const avgInterestRate = loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length;

    // Group by type
    const byType = loans.reduce((acc: any, loan) => {
      if (!acc[loan.loanType]) {
        acc[loan.loanType] = {
          count: 0,
          totalDebt: 0,
          monthlyPayment: 0,
        };
      }
      acc[loan.loanType].count++;
      acc[loan.loanType].totalDebt += loan.remainingBalance;
      if (loan.status === 'active') {
        acc[loan.loanType].monthlyPayment += loan.monthlyPayment;
      }
      return acc;
    }, {});

    res.status(200).json({
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      totalDebt: Math.round(totalDebt * 100) / 100,
      totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
      averageInterestRate: Math.round(avgInterestRate * 10000) / 100, // Convert to percentage
      byType,
    });
  } catch (error) {
    console.error('Get loan stats error:', error);
    res.status(500).json({ error: 'Error fetching loan statistics' });
  }
};
