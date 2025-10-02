import { AuthService } from '../auth/AuthService';
import { PaymentReminder } from '../../models/PaymentReminder';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

export class PaymentService {
    static async getPaymentReminders(filters?: {
        startDate?: string;
        endDate?: string;
        isPaid?: boolean;
    }): Promise<{ success: boolean; data?: PaymentReminder[]; error?: string }> {
        try {
            const queryParams = new URLSearchParams();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, value.toString());
                    }
                });
            }

            const response = await fetch(`${API_URL}/payments?${queryParams.toString()}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.payments };
            } else {
                return { success: false, error: data.error || 'Failed to fetch payment reminders' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async getPaymentReminder(paymentId: string): Promise<{ success: boolean; data?: PaymentReminder; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/payments/${paymentId}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.payment };
            } else {
                return { success: false, error: data.error || 'Failed to fetch payment reminder' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async createPaymentReminder(payment: Omit<PaymentReminder, '_id' | 'id'>): Promise<{ success: boolean; data?: PaymentReminder; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/payments`, {
                method: 'POST',
                headers: AuthService.getAuthHeaders(),
                body: JSON.stringify(payment),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.payment };
            } else {
                return { success: false, error: data.error || 'Failed to create payment reminder' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async updatePaymentReminder(paymentId: string, updatedPayment: Partial<PaymentReminder>): Promise<{ success: boolean; data?: PaymentReminder; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/payments/${paymentId}`, {
                method: 'PUT',
                headers: AuthService.getAuthHeaders(),
                body: JSON.stringify(updatedPayment),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.payment };
            } else {
                return { success: false, error: data.error || 'Failed to update payment reminder' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async markPaymentAsPaid(paymentId: string): Promise<{ success: boolean; data?: PaymentReminder; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/payments/${paymentId}/paid`, {
                method: 'PATCH',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.payment };
            } else {
                return { success: false, error: data.error || 'Failed to mark payment as paid' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async deletePaymentReminder(paymentId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/payments/${paymentId}`, {
                method: 'DELETE',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Failed to delete payment reminder' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    static async getUpcomingPayments(days: number = 30): Promise<{ success: boolean; data?: PaymentReminder[]; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/payments/upcoming?days=${days}`, {
                method: 'GET',
                headers: AuthService.getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data.payments };
            } else {
                return { success: false, error: data.error || 'Failed to fetch upcoming payments' };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }
}
