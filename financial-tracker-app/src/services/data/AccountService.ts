import { AuthService } from '../auth/AuthService';
import { Account } from '../../models/Account';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

export class AccountService {
    static async getAccounts(): Promise<{ success: boolean; data?: Account[]; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/accounts`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.accounts };
            } else {
                return { success: false, error: data.error || 'Failed to fetch accounts' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async getAccount(accountId: string): Promise<{ success: boolean; data?: Account; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/accounts/${accountId}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.account };
            } else {
                return { success: false, error: data.error || 'Failed to fetch account' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async createAccount(account: Omit<Account, 'id'>): Promise<{ success: boolean; data?: Account; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/accounts`, {
                method: 'POST',
                headers: AuthService.getAuthHeaders(),
                body: JSON.stringify(account),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.account };
            } else {
                return { success: false, error: data.error || 'Failed to create account' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async updateAccount(accountId: string, updatedAccount: Partial<Account>): Promise<{ success: boolean; data?: Account; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/accounts/${accountId}`, {
                method: 'PUT',
                headers: AuthService.getAuthHeaders(),
                body: JSON.stringify(updatedAccount),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.account };
            } else {
                return { success: false, error: data.error || 'Failed to update account' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async deleteAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/accounts/${accountId}`, {
                method: 'DELETE',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Failed to delete account' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async getAccountSummary(): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/accounts/summary`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data };
            } else {
                return { success: false, error: data.error || 'Failed to fetch account summary' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }
}