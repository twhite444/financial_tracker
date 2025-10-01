import express from 'express';
import {
  getPaymentReminders,
  getPaymentReminder,
  createPaymentReminder,
  updatePaymentReminder,
  markPaymentAsPaid,
  deletePaymentReminder,
  getUpcomingPayments,
  paymentValidation,
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getPaymentReminders);
router.get('/upcoming', getUpcomingPayments);
router.get('/:id', getPaymentReminder);
router.post('/', paymentValidation, createPaymentReminder);
router.put('/:id', paymentValidation, updatePaymentReminder);
router.patch('/:id/paid', markPaymentAsPaid);
router.delete('/:id', deletePaymentReminder);

export default router;
