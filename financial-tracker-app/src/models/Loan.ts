/**
 * Loan Model
 * Manages loan data including mortgages, auto loans, personal loans, and student loans
 * Includes amortization schedule calculations and payment tracking
 */

export type LoanType = 'mortgage' | 'auto' | 'personal' | 'student' | 'other';
export type LoanStatus = 'active' | 'paid_off' | 'deferred' | 'default';

export interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: Date;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface Loan {
  id: string;
  userId: string;
  name: string;
  loanType: LoanType;
  principal: number; // Original loan amount
  interestRate: number; // Annual interest rate as decimal (e.g., 0.05 for 5%)
  termMonths: number; // Loan term in months
  startDate: Date;
  monthlyPayment: number;
  remainingBalance: number;
  totalPaid: number; // Total amount paid so far
  interestPaid: number; // Total interest paid so far
  status: LoanStatus;
  lender?: string;
  notes?: string;
  nextPaymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanInput {
  name: string;
  loanType: LoanType;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: Date;
  lender?: string;
  notes?: string;
}

/**
 * Calculate monthly payment using the standard amortization formula:
 * M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
 * where:
 * M = Monthly payment
 * P = Principal loan amount
 * i = Monthly interest rate (annual rate / 12)
 * n = Number of months
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (annualRate === 0) {
    // Interest-free loan
    return principal / termMonths;
  }

  const monthlyRate = annualRate / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Math.round(payment * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate complete amortization schedule for a loan
 * Shows payment-by-payment breakdown of principal, interest, and remaining balance
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  startDate: Date,
  monthlyPayment?: number
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  let remainingBalance = principal;
  const monthlyRate = annualRate / 12;
  const payment = monthlyPayment || calculateMonthlyPayment(principal, annualRate, termMonths);

  for (let i = 1; i <= termMonths; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = payment - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    schedule.push({
      paymentNumber: i,
      paymentDate,
      paymentAmount: payment,
      principalPaid: Math.round(principalPayment * 100) / 100,
      interestPaid: Math.round(interestPayment * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100,
    });
  }

  return schedule;
}

/**
 * Calculate total interest that will be paid over the life of the loan
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const totalPaid = monthlyPayment * termMonths;
  return Math.round((totalPaid - principal) * 100) / 100;
}

/**
 * Calculate remaining balance after a certain number of payments
 */
export function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  termMonths: number,
  paymentsMade: number
): number {
  if (paymentsMade >= termMonths) return 0;
  if (paymentsMade === 0) return principal;

  const schedule = generateAmortizationSchedule(principal, annualRate, termMonths, new Date());
  return schedule[paymentsMade - 1]?.remainingBalance || principal;
}

/**
 * Calculate the next payment date based on start date and frequency
 */
export function getNextPaymentDate(startDate: Date, paymentsMade: number): Date {
  const nextDate = new Date(startDate);
  nextDate.setMonth(nextDate.getMonth() + paymentsMade + 1);
  return nextDate;
}

/**
 * Determine how many payments have been made based on dates
 */
export function getPaymentsMade(startDate: Date, currentDate: Date = new Date()): number {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  
  const yearsDiff = current.getFullYear() - start.getFullYear();
  const monthsDiff = current.getMonth() - start.getMonth();
  
  return Math.max(0, yearsDiff * 12 + monthsDiff);
}

/**
 * Calculate payoff date based on current balance and payment schedule
 */
export function calculatePayoffDate(
  remainingBalance: number,
  monthlyPayment: number,
  annualRate: number,
  currentDate: Date = new Date()
): Date {
  if (remainingBalance <= 0) return currentDate;
  
  const monthlyRate = annualRate / 12;
  let balance = remainingBalance;
  let months = 0;

  while (balance > 0 && months < 1200) { // Safety limit of 100 years
    const interestCharge = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestCharge;
    balance -= principalPayment;
    months++;
  }

  const payoffDate = new Date(currentDate);
  payoffDate.setMonth(payoffDate.getMonth() + months);
  return payoffDate;
}

/**
 * Calculate additional payment impact (how much faster loan pays off)
 */
export function calculateExtraPaymentImpact(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number
): {
  monthsSaved: number;
  interestSaved: number;
  newPayoffMonths: number;
} {
  const standardPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const standardInterest = calculateTotalInterest(principal, annualRate, termMonths);

  // Calculate with extra payment
  const monthlyRate = annualRate / 12;
  let balance = principal;
  let months = 0;
  let totalInterestPaid = 0;

  while (balance > 0 && months < termMonths) {
    const interestCharge = balance * monthlyRate;
    const principalPayment = standardPayment + extraPayment - interestCharge;
    balance = Math.max(0, balance - principalPayment);
    totalInterestPaid += interestCharge;
    months++;
  }

  return {
    monthsSaved: termMonths - months,
    interestSaved: Math.round((standardInterest - totalInterestPaid) * 100) / 100,
    newPayoffMonths: months,
  };
}

/**
 * Create a new Loan instance from input data
 */
export function createLoan(input: LoanInput, userId: string): Loan {
  const monthlyPayment = calculateMonthlyPayment(
    input.principal,
    input.interestRate,
    input.termMonths
  );

  const nextPaymentDate = getNextPaymentDate(input.startDate, 0);

  return {
    id: crypto.randomUUID(),
    userId,
    name: input.name,
    loanType: input.loanType,
    principal: input.principal,
    interestRate: input.interestRate,
    termMonths: input.termMonths,
    startDate: input.startDate,
    monthlyPayment,
    remainingBalance: input.principal,
    totalPaid: 0,
    interestPaid: 0,
    status: 'active',
    lender: input.lender,
    notes: input.notes,
    nextPaymentDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Update loan after a payment is made
 */
export function recordPayment(
  loan: Loan,
  paymentAmount: number,
  paymentDate: Date = new Date()
): Loan {
  const monthlyRate = loan.interestRate / 12;
  const interestCharge = loan.remainingBalance * monthlyRate;
  const principalPayment = paymentAmount - interestCharge;

  const newBalance = Math.max(0, loan.remainingBalance - principalPayment);
  const newStatus = newBalance === 0 ? 'paid_off' : loan.status;

  return {
    ...loan,
    remainingBalance: Math.round(newBalance * 100) / 100,
    totalPaid: Math.round((loan.totalPaid + paymentAmount) * 100) / 100,
    interestPaid: Math.round((loan.interestPaid + interestCharge) * 100) / 100,
    status: newStatus,
    nextPaymentDate: newStatus === 'paid_off' 
      ? loan.nextPaymentDate 
      : getNextPaymentDate(loan.startDate, getPaymentsMade(loan.startDate) + 1),
    updatedAt: new Date(),
  };
}

export default Loan;
