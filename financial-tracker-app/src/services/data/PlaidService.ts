import { AuthService } from '../auth/AuthService';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/plaid`;

export class PlaidService {
  /**
   * Create a link token for initializing Plaid Link
   */
  static async createLinkToken(): Promise<string> {
    const response = await fetch(`${API_URL}/create-link-token`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to create link token');
    }

    const data = await response.json();
    return data.link_token;
  }

  /**
   * Exchange public token for access token
   */
  static async exchangePublicToken(publicToken: string): Promise<void> {
    const response = await fetch(`${API_URL}/exchange-token`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify({ public_token: publicToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange token');
    }
  }

  /**
   * Sync accounts from Plaid
   */
  static async syncAccounts(): Promise<any[]> {
    const response = await fetch(`${API_URL}/sync-accounts`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to sync accounts');
    }

    const data = await response.json();
    return data.accounts;
  }

  /**
   * Sync transactions from Plaid
   */
  static async syncTransactions(): Promise<any[]> {
    const response = await fetch(`${API_URL}/sync-transactions`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to sync transactions');
    }

    const data = await response.json();
    return data.transactions;
  }

  /**
   * Get Plaid link status
   */
  static async getLinkStatus(): Promise<{ isLinked: boolean; itemId?: string }> {
    const response = await fetch(`${API_URL}/status`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get link status');
    }

    return response.json();
  }
}
