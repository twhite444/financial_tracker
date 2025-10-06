import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('Loan API Integration Tests', () => {
  const BASE_URL = 'http://localhost:5000/api';
  let authToken: string;
  let testLoanId: string;
  let userId: string;

  // Mock user credentials for testing
  const testUser = {
    email: 'loantest@example.com',
    password: 'SecurePassword123!',
    name: 'Loan Test User',
  };

  beforeAll(async () => {
    // Register or login test user
    try {
      const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      });

      if (registerResponse.ok) {
        const data = await registerResponse.json();
        authToken = data.token;
        userId = data.user.id;
      } else {
        // User might already exist, try logging in
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
          }),
        });

        const data = await loginResponse.json();
        authToken = data.token;
        userId = data.user.id;
      }
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });

  afterAll(async () => {
    // Clean up: delete test loan if it exists
    if (testLoanId && authToken) {
      try {
        await fetch(`${BASE_URL}/loans/${testLoanId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    }
  });

  describe('POST /api/loans - Create Loan', () => {
    it('should create a new loan with valid data', async () => {
      const newLoan = {
        name: 'Test Mortgage',
        loanType: 'mortgage',
        principal: 200000,
        interestRate: 0.05,
        termMonths: 360,
        startDate: '2025-01-01',
        lender: 'Test Bank',
        notes: 'Integration test loan',
      };

      const response = await fetch(`${BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newLoan),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('loan');
      expect(data.loan.name).toBe(newLoan.name);
      expect(data.loan.loanType).toBe(newLoan.loanType);
      expect(data.loan.principal).toBe(newLoan.principal);
      expect(data.loan.remainingBalance).toBe(newLoan.principal);
      expect(data.loan.monthlyPayment).toBeGreaterThan(0);
      expect(data.loan.status).toBe('active');

      testLoanId = data.loan._id;
    });

    it('should reject loan creation without authentication', async () => {
      const newLoan = {
        name: 'Unauthorized Loan',
        loanType: 'personal',
        principal: 5000,
        interestRate: 0.08,
        termMonths: 24,
        startDate: '2025-01-01',
      };

      const response = await fetch(`${BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoan),
      });

      expect(response.status).toBe(401);
    });

    it('should reject loan with invalid data', async () => {
      const invalidLoan = {
        name: '',
        loanType: 'invalid_type',
        principal: -5000,
        interestRate: 1.5, // Should be decimal
        termMonths: 0,
        startDate: 'invalid-date',
      };

      const response = await fetch(`${BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(invalidLoan),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('errors');
    });
  });

  describe('GET /api/loans - List Loans', () => {
    it('should retrieve all loans for authenticated user', async () => {
      const response = await fetch(`${BASE_URL}/loans`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('loans');
      expect(data).toHaveProperty('summary');
      expect(Array.isArray(data.loans)).toBe(true);
      expect(data.summary).toHaveProperty('totalDebt');
      expect(data.summary).toHaveProperty('totalMonthlyPayment');
      expect(data.summary).toHaveProperty('loanCount');
    });

    it('should filter loans by status', async () => {
      const response = await fetch(`${BASE_URL}/loans?status=active`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.loans.every((loan: any) => loan.status === 'active')).toBe(true);
    });

    it('should reject unauthorized access', async () => {
      const response = await fetch(`${BASE_URL}/loans`, {
        method: 'GET',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/loans/:id - Get Single Loan', () => {
    it('should retrieve specific loan by ID', async () => {
      const response = await fetch(`${BASE_URL}/loans/${testLoanId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('loan');
      expect(data.loan._id).toBe(testLoanId);
    });

    it('should return 404 for non-existent loan', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await fetch(`${BASE_URL}/loans/${fakeId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/loans/:id - Update Loan', () => {
    it('should update loan details', async () => {
      const updates = {
        name: 'Updated Test Mortgage',
        notes: 'Updated notes',
        lender: 'Updated Bank',
        loanType: 'mortgage',
        principal: 200000,
        interestRate: 0.05,
        termMonths: 360,
        startDate: '2025-01-01',
      };

      const response = await fetch(`${BASE_URL}/loans/${testLoanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.loan.name).toBe(updates.name);
      expect(data.loan.notes).toBe(updates.notes);
    });

    it('should recalculate monthly payment when principal changes', async () => {
      // Get original loan
      const originalResponse = await fetch(`${BASE_URL}/loans/${testLoanId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const originalData = await originalResponse.json();
      const originalPayment = originalData.loan.monthlyPayment;

      // Update principal
      const updates = {
        name: originalData.loan.name,
        loanType: originalData.loan.loanType,
        principal: 250000, // Increased from 200000
        interestRate: originalData.loan.interestRate,
        termMonths: originalData.loan.termMonths,
        startDate: originalData.loan.startDate,
      };

      const response = await fetch(`${BASE_URL}/loans/${testLoanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      expect(data.loan.monthlyPayment).toBeGreaterThan(originalPayment);
    });
  });

  describe('GET /api/loans/:id/amortization - Get Amortization Schedule', () => {
    it('should generate amortization schedule', async () => {
      const response = await fetch(`${BASE_URL}/loans/${testLoanId}/amortization`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('loan');
      expect(data).toHaveProperty('schedule');
      expect(data).toHaveProperty('summary');
      expect(Array.isArray(data.schedule)).toBe(true);
      expect(data.schedule.length).toBeGreaterThan(0);

      // Check schedule structure
      const firstPayment = data.schedule[0];
      expect(firstPayment).toHaveProperty('paymentNumber');
      expect(firstPayment).toHaveProperty('paymentDate');
      expect(firstPayment).toHaveProperty('paymentAmount');
      expect(firstPayment).toHaveProperty('principalPaid');
      expect(firstPayment).toHaveProperty('interestPaid');
      expect(firstPayment).toHaveProperty('remainingBalance');

      // Verify summary
      expect(data.summary).toHaveProperty('totalPayments');
      expect(data.summary).toHaveProperty('totalPaid');
      expect(data.summary).toHaveProperty('totalInterest');
    });
  });

  describe('POST /api/loans/:id/payment - Record Payment', () => {
    it('should record a loan payment', async () => {
      // Get current loan state
      const loanResponse = await fetch(`${BASE_URL}/loans/${testLoanId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const loanData = await loanResponse.json();
      const originalBalance = loanData.loan.remainingBalance;

      // Record payment
      const payment = {
        paymentAmount: loanData.loan.monthlyPayment,
        paymentDate: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/loans/${testLoanId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payment),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('paymentBreakdown');
      expect(data.paymentBreakdown).toHaveProperty('principalPaid');
      expect(data.paymentBreakdown).toHaveProperty('interestPaid');
      expect(data.paymentBreakdown.newBalance).toBeLessThan(originalBalance);
    });

    it('should reject invalid payment amount', async () => {
      const payment = {
        paymentAmount: -100,
        paymentDate: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/loans/${testLoanId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payment),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/loans/stats - Get Loan Statistics', () => {
    it('should retrieve loan statistics', async () => {
      const response = await fetch(`${BASE_URL}/loans/stats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('totalLoans');
      expect(data).toHaveProperty('activeLoans');
      expect(data).toHaveProperty('totalDebt');
      expect(data).toHaveProperty('totalMonthlyPayment');
      expect(data).toHaveProperty('totalInterestPaid');
      expect(data).toHaveProperty('averageInterestRate');
      expect(data).toHaveProperty('byType');
    });
  });

  describe('DELETE /api/loans/:id - Delete Loan', () => {
    it('should delete a loan', async () => {
      // Create a temporary loan to delete
      const tempLoan = {
        name: 'Temp Loan for Deletion',
        loanType: 'personal',
        principal: 5000,
        interestRate: 0.08,
        termMonths: 24,
        startDate: '2025-01-01',
      };

      const createResponse = await fetch(`${BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(tempLoan),
      });

      const createData = await createResponse.json();
      const tempLoanId = createData.loan._id;

      // Delete the loan
      const deleteResponse = await fetch(`${BASE_URL}/loans/${tempLoanId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(deleteResponse.status).toBe(200);

      // Verify it's deleted
      const getResponse = await fetch(`${BASE_URL}/loans/${tempLoanId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent loan', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await fetch(`${BASE_URL}/loans/${fakeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(404);
    });
  });
});
