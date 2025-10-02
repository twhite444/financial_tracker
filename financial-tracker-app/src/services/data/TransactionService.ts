import { AuthService } from '../auth/AuthService';
import { Transaction } from '../../models/Transaction';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

export class TransactionService {
    static async getTransactions(filters?: {
        accountId?: string;
        type?: string;
        category?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ success: boolean; data?: { transactions: Transaction[]; total: number; page: number; totalPages: number }; error?: string }> {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
            }

            const response = await fetch(`${API_URL}/transactions?${queryParams.toString()}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Failed to fetch transactions' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async getTransaction(transactionId: string): Promise<{ success: boolean; data?: Transaction; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.transaction };
            } else {
                return { success: false, error: data.error || 'Failed to fetch transaction' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async createTransaction(transaction: Omit<Transaction, '_id' | 'id'>): Promise<{ success: boolean; data?: Transaction; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: AuthService.getAuthHeaders(),
                body: JSON.stringify(transaction),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.transaction };
            } else {
                return { success: false, error: data.error || 'Failed to create transaction' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async updateTransaction(transactionId: string, updatedTransaction: Partial<Transaction>): Promise<{ success: boolean; data?: Transaction; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'PUT',
                headers: AuthService.getAuthHeaders(),
                body: JSON.stringify(updatedTransaction),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.transaction };
            } else {
                return { success: false, error: data.error || 'Failed to update transaction' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async deleteTransaction(transactionId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Failed to delete transaction' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async getTransactionStats(dateRange?: { startDate?: string; endDate?: string }): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const queryParams = new URLSearchParams();
            if (dateRange?.startDate) queryParams.append('startDate', dateRange.startDate);
            if (dateRange?.endDate) queryParams.append('endDate', dateRange.endDate);

            const response = await fetch(`${API_URL}/transactions/stats?${queryParams.toString()}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Failed to fetch transaction stats' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }
}