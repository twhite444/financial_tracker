import { AuthService } from '../auth/AuthService';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

export interface HistoryEntry {
  _id: string;
  userId: string;
  action: string;
  timestamp: Date;
  changedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  previousData?: any;
  newData?: any;
  changedFields?: string[];
  ipAddress?: string;
  userAgent?: string;
}

export interface TransactionHistoryEntry extends HistoryEntry {
  transactionId: string;
  action: 'created' | 'updated' | 'deleted';
}

export interface AccountHistoryEntry extends HistoryEntry {
  accountId: string;
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated' | 'balance_changed';
  balanceChange?: {
    previous: number;
    new: number;
    difference: number;
  };
  notes?: string;
}

export interface PaymentHistoryEntry extends HistoryEntry {
  paymentId: string;
  action: 'created' | 'updated' | 'deleted' | 'marked_paid' | 'marked_unpaid' | 'rescheduled';
  reason?: string;
}

export interface UserActivityEntry extends HistoryEntry {
  action:
    | 'login'
    | 'logout'
    | 'register'
    | 'password_change'
    | 'profile_update'
    | 'plaid_link'
    | 'plaid_unlink'
    | 'failed_login'
    | 'account_locked'
    | 'account_unlocked'
    | 'export_data'
    | 'delete_account';
  details?: string;
  success: boolean;
  errorMessage?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

export interface HistoryResponse<T = HistoryEntry> {
  history: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ActivityStatistics {
  totalActivities: number;
  failedLogins: number;
  actionBreakdown: Array<{
    _id: string;
    count: number;
    lastOccurrence: Date;
  }>;
  periodDays: number;
}

/**
 * Build query string from params
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, String(value));
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(params?: {
  transactionId?: string;
  action?: string;
  limit?: number;
  skip?: number;
}): Promise<{ success: boolean; data?: HistoryResponse<TransactionHistoryEntry>; error?: string }> {
  try {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_URL}/history/transactions${queryString}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch transaction history' };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Get account history
 */
export async function getAccountHistory(params?: {
  accountId?: string;
  action?: string;
  limit?: number;
  skip?: number;
}): Promise<{ success: boolean; data?: HistoryResponse<AccountHistoryEntry>; error?: string }> {
  try {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_URL}/history/accounts${queryString}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch account history' };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Get payment history
 */
export async function getPaymentHistory(params?: {
  paymentId?: string;
  action?: string;
  limit?: number;
  skip?: number;
}): Promise<{ success: boolean; data?: HistoryResponse<PaymentHistoryEntry>; error?: string }> {
  try {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_URL}/history/payments${queryString}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch payment history' };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Get user activity log
 */
export async function getUserActivity(params?: {
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  skip?: number;
}): Promise<{ success: boolean; data?: HistoryResponse<UserActivityEntry>; error?: string }> {
  try {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_URL}/history/activity${queryString}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch user activity' };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Get user activity statistics
 */
export async function getUserActivityStats(days: number = 30): Promise<{ success: boolean; data?: ActivityStatistics; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/history/activity/stats?days=${days}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch activity statistics' };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Get all history (combined view)
 */
export async function getAllHistory(params?: {
  limit?: number;
  skip?: number;
}): Promise<{ success: boolean; data?: HistoryResponse; error?: string }> {
  try {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_URL}/history/all${queryString}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch history' };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}
