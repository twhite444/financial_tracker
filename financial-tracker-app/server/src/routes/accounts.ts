import express from 'express';
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
  accountValidation,
} from '../controllers/accountController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getAccounts);
router.get('/summary', getAccountSummary);
router.get('/:id', getAccount);
router.post('/', accountValidation, createAccount);
router.put('/:id', accountValidation, updateAccount);
router.delete('/:id', deleteAccount);

export default router;
