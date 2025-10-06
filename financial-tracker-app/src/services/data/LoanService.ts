import { AuthService } from '../auth/AuthService';
import type { Loan, LoanInput } from '../../models/Loan';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

export interface LoanSummary {
  totalDebt: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  loanCount: number;
  activeLoans: number;
}

export interface LoanStats {
  totalLoans: number;
  activeLoans: number;
  totalDebt: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  averageInterestRate: number;
  byType: Record<string, {
    count: number;
    totalDebt: number;
    monthlyPayment: number;
  }>;
}

export interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: Date;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface AmortizationSchedule {
  loan: {
    id: string;
    name: string;
    principal: number;
    interestRate: number;
    termMonths: number;
    monthlyPayment: number;
  };
  schedule: AmortizationEntry[];
  summary: {
    totalPayments: number;
    totalPaid: number;
    totalInterest: number;
    totalPrincipal: number;
  };
}

export interface PaymentBreakdown {
  totalPayment: number;
  principalPaid: number;
  interestPaid: number;
  newBalance: number;
}

export class LoanService {
  /**
   * Get all loans with optional status filter
   */
  static async getLoans(status?: string): Promise<{ 
    success: boolean; 
    data?: { loans: Loan[]; summary: LoanSummary }; 
    error?: string 
  }> {
    try {
      const url = status 
        ? `${API_URL}/loans?status=${status}`
        : `${API_URL}/loans`;

      const response = await fetch(url, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to fetch loans' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Get single loan by ID
   */
  static async getLoan(loanId: string): Promise<{ 
    success: boolean; 
    data?: Loan; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans/${loanId}`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.loan };
      } else {
        return { success: false, error: data.error || 'Failed to fetch loan' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Create a new loan
   */
  static async createLoan(loan: LoanInput): Promise<{ 
    success: boolean; 
    data?: Loan; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(loan),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.loan };
      } else {
        return { success: false, error: data.error || data.errors?.[0]?.msg || 'Failed to create loan' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Update an existing loan
   */
  static async updateLoan(loanId: string, updates: Partial<LoanInput>): Promise<{ 
    success: boolean; 
    data?: Loan; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans/${loanId}`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.loan };
      } else {
        return { success: false, error: data.error || data.errors?.[0]?.msg || 'Failed to update loan' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Delete a loan
   */
  static async deleteLoan(loanId: string): Promise<{ 
    success: boolean; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans/${loanId}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to delete loan' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Get amortization schedule for a loan
   */
  static async getAmortizationSchedule(loanId: string): Promise<{ 
    success: boolean; 
    data?: AmortizationSchedule; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans/${loanId}/amortization`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to fetch amortization schedule' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Record a loan payment
   */
  static async recordPayment(
    loanId: string, 
    paymentAmount: number, 
    paymentDate?: string
  ): Promise<{ 
    success: boolean; 
    data?: { loan: Loan; paymentBreakdown: PaymentBreakdown }; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans/${loanId}/payment`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({ 
          paymentAmount, 
          paymentDate: paymentDate || new Date().toISOString() 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to record payment' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  /**
   * Get loan statistics
   */
  static async getLoanStats(): Promise<{ 
    success: boolean; 
    data?: LoanStats; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/loans/stats`, {
        method: 'GET',
        headers: AuthService.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to fetch loan statistics' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }
}
