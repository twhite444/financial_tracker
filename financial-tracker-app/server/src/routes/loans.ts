import express from 'express';
import {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
  getAmortizationSchedule,
  recordLoanPayment,
  getLoanStats,
  loanValidation,
} from '../controllers/loanController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Loan CRUD operations
router.get('/', getLoans);
router.get('/stats', getLoanStats);
router.get('/:id', getLoan);
router.post('/', loanValidation, createLoan);
router.put('/:id', loanValidation, updateLoan);
router.delete('/:id', deleteLoan);

// Loan-specific operations
router.get('/:id/amortization', getAmortizationSchedule);
router.post('/:id/payment', recordLoanPayment);

export default router;
