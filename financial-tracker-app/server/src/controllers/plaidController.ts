import { Response } from 'express';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use sandbox for now
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/**
 * Create a link token for Plaid Link initialization
 */
export const createLinkToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const request = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Financial Tracker',
      products: [Products.Transactions, Products.Auth],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(request);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
};

/**
 * Exchange public token for access token
 */
export const exchangePublicToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { public_token } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!public_token) {
      res.status(400).json({ error: 'Public token is required' });
      return;
    }

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Save access token to user
    await User.findByIdAndUpdate(userId, {
      plaidAccessToken: accessToken,
      plaidItemId: itemId,
    });

    res.json({ 
      success: true, 
      message: 'Bank account linked successfully',
      item_id: itemId,
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
};

/**
 * Sync accounts from Plaid
 */
export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId).select('+plaidAccessToken');
    
    if (!user || !user.plaidAccessToken) {
      res.status(400).json({ error: 'No Plaid account linked' });
      return;
    }

    // Get accounts from Plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: user.plaidAccessToken,
    });

    const plaidAccounts = accountsResponse.data.accounts;
    const syncedAccounts = [];

    // Create or update accounts in database
    for (const plaidAccount of plaidAccounts) {
      const accountData = {
        userId: user._id,
        name: plaidAccount.name,
        type: mapPlaidAccountType(plaidAccount.type),
        institution: accountsResponse.data.item.institution_id || 'Unknown',
        balance: plaidAccount.balances.current || 0,
        currency: plaidAccount.balances.iso_currency_code || 'USD',
        plaidAccountId: plaidAccount.account_id,
        isPlaidLinked: true,
        isActive: true,
      };

      // Check if account already exists
      let account = await Account.findOne({
        userId: user._id,
        plaidAccountId: plaidAccount.account_id,
      });

      if (account) {
        // Update existing account
        account = await Account.findByIdAndUpdate(
          account._id,
          { balance: accountData.balance },
          { new: true }
        );
      } else {
        // Create new account
        account = await Account.create(accountData);
      }

      syncedAccounts.push(account);
    }

    res.json({
      success: true,
      message: `Synced ${syncedAccounts.length} accounts`,
      accounts: syncedAccounts,
    });
  } catch (error) {
    console.error('Error syncing accounts:', error);
    res.status(500).json({ error: 'Failed to sync accounts' });
  }
};

/**
 * Sync transactions from Plaid
 */
export const syncTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId).select('+plaidAccessToken');
    
    if (!user || !user.plaidAccessToken) {
      res.status(400).json({ error: 'No Plaid account linked' });
      return;
    }

    // Get transactions from last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const request = {
      access_token: user.plaidAccessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };

    const response = await plaidClient.transactionsGet(request);
    const plaidTransactions = response.data.transactions;
    const syncedTransactions = [];

    // Create transactions in database
    for (const plaidTx of plaidTransactions) {
      // Find matching account
      const account = await Account.findOne({
        userId: user._id,
        plaidAccountId: plaidTx.account_id,
      });

      if (!account) {
        console.warn(`Account not found for Plaid transaction: ${plaidTx.transaction_id}`);
        continue;
      }

      // Check if transaction already exists
      const existingTx = await Transaction.findOne({
        userId: user._id,
        accountId: account._id,
        description: plaidTx.name,
        amount: Math.abs(plaidTx.amount),
        date: new Date(plaidTx.date),
      });

      if (existingTx) {
        continue; // Skip duplicate
      }

      // Create transaction
      const transaction = await Transaction.create({
        userId: user._id,
        accountId: account._id,
        type: plaidTx.amount > 0 ? 'expense' : 'income',
        category: plaidTx.category?.[0] || 'Uncategorized',
        amount: Math.abs(plaidTx.amount),
        description: plaidTx.name,
        date: new Date(plaidTx.date),
        notes: `Imported from ${plaidTx.merchant_name || 'Plaid'}`,
      });

      syncedTransactions.push(transaction);
    }

    res.json({
      success: true,
      message: `Synced ${syncedTransactions.length} new transactions`,
      transactions: syncedTransactions,
    });
  } catch (error) {
    console.error('Error syncing transactions:', error);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
};

/**
 * Get Plaid link status
 */
export const getLinkStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      isLinked: !!user.plaidItemId,
      itemId: user.plaidItemId,
    });
  } catch (error) {
    console.error('Error getting link status:', error);
    res.status(500).json({ error: 'Failed to get link status' });
  }
};

/**
 * Helper function to map Plaid account types to our types
 */
function mapPlaidAccountType(plaidType: string): 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan' {
  const typeMap: { [key: string]: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan' } = {
    depository: 'checking',
    credit: 'credit_card',
    loan: 'loan',
    investment: 'investment',
  };

  return typeMap[plaidType.toLowerCase()] || 'checking';
}
