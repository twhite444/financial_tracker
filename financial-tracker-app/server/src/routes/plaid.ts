import express from 'express';
import {
  createLinkToken,
  exchangePublicToken,
  syncAccounts,
  syncTransactions,
  getLinkStatus,
} from '../controllers/plaidController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All Plaid routes require authentication
router.use(authenticateToken);

// Create link token for Plaid Link
router.post('/create-link-token', createLinkToken);

// Exchange public token for access token
router.post('/exchange-token', exchangePublicToken);

// Sync accounts from Plaid
router.post('/sync-accounts', syncAccounts);

// Sync transactions from Plaid
router.post('/sync-transactions', syncTransactions);

// Get link status
router.get('/status', getLinkStatus);

export default router;
