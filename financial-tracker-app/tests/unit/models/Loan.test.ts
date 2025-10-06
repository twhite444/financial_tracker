import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  calculateTotalInterest,
  calculateRemainingBalance,
  getNextPaymentDate,
  getPaymentsMade,
  calculatePayoffDate,
  calculateExtraPaymentImpact,
  createLoan,
  recordPayment,
  type Loan,
  type LoanInput,
} from '../../../src/models/Loan';

describe('Loan Model - Calculation Functions', () => {
  describe('calculateMonthlyPayment', () => {
    it('should calculate monthly payment correctly for standard loan', () => {
      const principal = 200000;
      const annualRate = 0.05; // 5%
      const termMonths = 360; // 30 years

      const payment = calculateMonthlyPayment(principal, annualRate, termMonths);

      expect(payment).toBeCloseTo(1073.64, 2);
    });

    it('should handle interest-free loans', () => {
      const principal = 12000;
      const annualRate = 0; // 0%
      const termMonths = 12;

      const payment = calculateMonthlyPayment(principal, annualRate, termMonths);

      expect(payment).toBe(1000); // Simple division
    });

    it('should calculate payment for car loan', () => {
      const principal = 30000;
      const annualRate = 0.06; // 6%
      const termMonths = 60; // 5 years

      const payment = calculateMonthlyPayment(principal, annualRate, termMonths);

      expect(payment).toBeCloseTo(579.98, 2);
    });

    it('should calculate payment for personal loan', () => {
      const principal = 10000;
      const annualRate = 0.12; // 12%
      const termMonths = 36; // 3 years

      const payment = calculateMonthlyPayment(principal, annualRate, termMonths);

      expect(payment).toBeCloseTo(332.14, 2);
    });
  });

  describe('generateAmortizationSchedule', () => {
    it('should generate complete amortization schedule', () => {
      const principal = 10000;
      const annualRate = 0.06;
      const termMonths = 12;
      const startDate = new Date('2025-01-01');

      const schedule = generateAmortizationSchedule(principal, annualRate, termMonths, startDate);

      expect(schedule).toHaveLength(12);
      expect(schedule[0].paymentNumber).toBe(1);
      expect(schedule[11].paymentNumber).toBe(12);
      expect(schedule[11].remainingBalance).toBeLessThan(1); // Should be nearly zero (< $1)
    });

    it('should have decreasing interest and increasing principal over time', () => {
      const principal = 100000;
      const annualRate = 0.05;
      const termMonths = 360;
      const startDate = new Date('2025-01-01');

      const schedule = generateAmortizationSchedule(principal, annualRate, termMonths, startDate);

      // First payment: more interest than principal
      expect(schedule[0].interestPaid).toBeGreaterThan(schedule[0].principalPaid);

      // Last payment: more principal than interest
      const lastPayment = schedule[schedule.length - 1];
      expect(lastPayment.principalPaid).toBeGreaterThan(lastPayment.interestPaid);
    });

    it('should track payment dates correctly', () => {
      const principal = 10000;
      const annualRate = 0.06;
      const termMonths = 3;
      const startDate = new Date('2025-01-15');

      const schedule = generateAmortizationSchedule(principal, annualRate, termMonths, startDate);

      expect(schedule[0].paymentDate.getMonth()).toBe(1); // February
      expect(schedule[1].paymentDate.getMonth()).toBe(2); // March
      expect(schedule[2].paymentDate.getMonth()).toBe(3); // April
    });
  });

  describe('calculateTotalInterest', () => {
    it('should calculate total interest for mortgage', () => {
      const principal = 200000;
      const annualRate = 0.05;
      const termMonths = 360;

      const totalInterest = calculateTotalInterest(principal, annualRate, termMonths);

      expect(totalInterest).toBeGreaterThan(180000); // Substantial interest over 30 years
      expect(totalInterest).toBeLessThan(190000); // Check reasonable range
      expect(totalInterest).toBeCloseTo(186510, 0); // Approximate value
    });

    it('should calculate zero interest for interest-free loan', () => {
      const principal = 10000;
      const annualRate = 0;
      const termMonths = 12;

      const totalInterest = calculateTotalInterest(principal, annualRate, termMonths);

      expect(totalInterest).toBe(0);
    });
  });

  describe('calculateRemainingBalance', () => {
    it('should return principal when no payments made', () => {
      const principal = 100000;
      const annualRate = 0.05;
      const termMonths = 360;
      const paymentsMade = 0;

      const balance = calculateRemainingBalance(principal, annualRate, termMonths, paymentsMade);

      expect(balance).toBe(principal);
    });

    it('should return zero when all payments made', () => {
      const principal = 10000;
      const annualRate = 0.06;
      const termMonths = 12;
      const paymentsMade = 12;

      const balance = calculateRemainingBalance(principal, annualRate, termMonths, paymentsMade);

      expect(balance).toBe(0);
    });

    it('should calculate correct balance after partial payments', () => {
      const principal = 100000;
      const annualRate = 0.05;
      const termMonths = 360;
      const paymentsMade = 120; // 10 years

      const balance = calculateRemainingBalance(principal, annualRate, termMonths, paymentsMade);

      expect(balance).toBeGreaterThan(0);
      expect(balance).toBeLessThan(principal);
    });
  });

  describe('getPaymentsMade', () => {
    it('should calculate payments made based on dates', () => {
      const startDate = new Date('2024-01-01');
      const currentDate = new Date('2025-01-01');

      const payments = getPaymentsMade(startDate, currentDate);

      expect(payments).toBe(12);
    });

    it('should return zero for same date', () => {
      const startDate = new Date('2025-01-01');
      const currentDate = new Date('2025-01-01');

      const payments = getPaymentsMade(startDate, currentDate);

      expect(payments).toBe(0);
    });

    it('should handle partial months', () => {
      const startDate = new Date('2024-01-15');
      const currentDate = new Date('2024-02-10');

      const payments = getPaymentsMade(startDate, currentDate);

      expect(payments).toBe(1); // One full month has passed
    });
  });

  describe('calculatePayoffDate', () => {
    it('should calculate payoff date correctly', () => {
      const remainingBalance = 10000;
      const monthlyPayment = 500;
      const annualRate = 0.06;
      const currentDate = new Date('2025-01-01');

      const payoffDate = calculatePayoffDate(remainingBalance, monthlyPayment, annualRate, currentDate);

      expect(payoffDate.getTime()).toBeGreaterThan(currentDate.getTime());
    });

    it('should return current date if balance is zero', () => {
      const remainingBalance = 0;
      const monthlyPayment = 500;
      const annualRate = 0.06;
      const currentDate = new Date('2025-01-01');

      const payoffDate = calculatePayoffDate(remainingBalance, monthlyPayment, annualRate, currentDate);

      expect(payoffDate.getTime()).toBe(currentDate.getTime());
    });
  });

  describe('calculateExtraPaymentImpact', () => {
    it('should show savings with extra payments', () => {
      const principal = 200000;
      const annualRate = 0.05;
      const termMonths = 360;
      const extraPayment = 200;

      const impact = calculateExtraPaymentImpact(principal, annualRate, termMonths, extraPayment);

      expect(impact.monthsSaved).toBeGreaterThan(0);
      expect(impact.interestSaved).toBeGreaterThan(0);
      expect(impact.newPayoffMonths).toBeLessThan(termMonths);
    });

    it('should handle no extra payment', () => {
      const principal = 100000;
      const annualRate = 0.05;
      const termMonths = 360;
      const extraPayment = 0;

      const impact = calculateExtraPaymentImpact(principal, annualRate, termMonths, extraPayment);

      expect(impact.monthsSaved).toBe(0);
      expect(Math.abs(impact.interestSaved)).toBeLessThan(5); // Negligible difference
      expect(impact.newPayoffMonths).toBe(termMonths);
    });
  });
});

describe('Loan Model - Entity Functions', () => {
  describe('createLoan', () => {
    it('should create valid loan from input', () => {
      const input: LoanInput = {
        name: 'Home Mortgage',
        loanType: 'mortgage',
        principal: 200000,
        interestRate: 0.05,
        termMonths: 360,
        startDate: new Date('2025-01-01'),
        lender: 'Bank of America',
        notes: 'Primary residence',
      };

      const loan = createLoan(input, 'user-123');

      expect(loan).toHaveProperty('id');
      expect(loan.userId).toBe('user-123');
      expect(loan.name).toBe(input.name);
      expect(loan.loanType).toBe(input.loanType);
      expect(loan.principal).toBe(input.principal);
      expect(loan.remainingBalance).toBe(input.principal);
      expect(loan.totalPaid).toBe(0);
      expect(loan.interestPaid).toBe(0);
      expect(loan.status).toBe('active');
      expect(loan.monthlyPayment).toBeGreaterThan(0);
    });

    it('should generate unique IDs for different loans', () => {
      const input: LoanInput = {
        name: 'Car Loan',
        loanType: 'auto',
        principal: 30000,
        interestRate: 0.06,
        termMonths: 60,
        startDate: new Date('2025-01-01'),
      };

      const loan1 = createLoan(input, 'user-123');
      const loan2 = createLoan(input, 'user-123');

      expect(loan1.id).not.toBe(loan2.id);
    });
  });

  describe('recordPayment', () => {
    it('should update loan after payment', () => {
      const loan: Loan = {
        id: 'loan-123',
        userId: 'user-123',
        name: 'Test Loan',
        loanType: 'personal',
        principal: 10000,
        interestRate: 0.06,
        termMonths: 12,
        startDate: new Date('2025-01-01'),
        monthlyPayment: 860.66,
        remainingBalance: 10000,
        totalPaid: 0,
        interestPaid: 0,
        status: 'active',
        nextPaymentDate: new Date('2025-02-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedLoan = recordPayment(loan, 860.66);

      expect(updatedLoan.remainingBalance).toBeLessThan(loan.remainingBalance);
      expect(updatedLoan.totalPaid).toBe(860.66);
      expect(updatedLoan.interestPaid).toBeGreaterThan(0);
      expect(updatedLoan.status).toBe('active');
    });

    it('should mark loan as paid_off when balance reaches zero', () => {
      const loan: Loan = {
        id: 'loan-123',
        userId: 'user-123',
        name: 'Test Loan',
        loanType: 'personal',
        principal: 10000,
        interestRate: 0.06,
        termMonths: 12,
        startDate: new Date('2024-01-01'),
        monthlyPayment: 860.66,
        remainingBalance: 50, // Very small balance
        totalPaid: 9950,
        interestPaid: 300,
        status: 'active',
        nextPaymentDate: new Date('2025-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedLoan = recordPayment(loan, 860.66); // Overpayment

      expect(updatedLoan.remainingBalance).toBe(0);
      expect(updatedLoan.status).toBe('paid_off');
    });

    it('should track total paid correctly over multiple payments', () => {
      let loan: Loan = {
        id: 'loan-123',
        userId: 'user-123',
        name: 'Test Loan',
        loanType: 'personal',
        principal: 10000,
        interestRate: 0.06,
        termMonths: 12,
        startDate: new Date('2025-01-01'),
        monthlyPayment: 860.66,
        remainingBalance: 10000,
        totalPaid: 0,
        interestPaid: 0,
        status: 'active',
        nextPaymentDate: new Date('2025-02-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Make 3 payments
      loan = recordPayment(loan, 860.66);
      loan = recordPayment(loan, 860.66);
      loan = recordPayment(loan, 860.66);

      expect(loan.totalPaid).toBeCloseTo(2581.98, 2);
      expect(loan.interestPaid).toBeGreaterThan(0);
      expect(loan.remainingBalance).toBeLessThan(10000);
    });
  });
});
