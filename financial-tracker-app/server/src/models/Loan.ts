import mongoose, { Document, Schema } from 'mongoose';

export type LoanType = 'mortgage' | 'auto' | 'personal' | 'student' | 'other';
export type LoanStatus = 'active' | 'paid_off' | 'deferred' | 'default';

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  loanType: LoanType;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: Date;
  monthlyPayment: number;
  remainingBalance: number;
  totalPaid: number;
  interestPaid: number;
  status: LoanStatus;
  lender?: string;
  notes?: string;
  nextPaymentDate: Date;
  plaidLinked?: boolean;
  plaidAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Loan name is required'],
      trim: true,
    },
    loanType: {
      type: String,
      required: [true, 'Loan type is required'],
      enum: ['mortgage', 'auto', 'personal', 'student', 'other'],
    },
    principal: {
      type: Number,
      required: [true, 'Principal amount is required'],
      min: [0, 'Principal must be positive'],
    },
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
      min: [0, 'Interest rate must be positive'],
      max: [1, 'Interest rate must be a decimal (e.g., 0.05 for 5%)'],
    },
    termMonths: {
      type: Number,
      required: [true, 'Term in months is required'],
      min: [1, 'Term must be at least 1 month'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    monthlyPayment: {
      type: Number,
      required: [true, 'Monthly payment is required'],
      min: [0, 'Monthly payment must be positive'],
    },
    remainingBalance: {
      type: Number,
      required: [true, 'Remaining balance is required'],
      min: [0, 'Remaining balance must be positive'],
      default: function() { return this.principal; },
    },
    totalPaid: {
      type: Number,
      default: 0,
      min: [0, 'Total paid must be positive'],
    },
    interestPaid: {
      type: Number,
      default: 0,
      min: [0, 'Interest paid must be positive'],
    },
    status: {
      type: String,
      required: [true, 'Loan status is required'],
      enum: ['active', 'paid_off', 'deferred', 'default'],
      default: 'active',
    },
    lender: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    nextPaymentDate: {
      type: Date,
      required: [true, 'Next payment date is required'],
    },
    plaidLinked: {
      type: Boolean,
      default: false,
    },
    plaidAccountId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
loanSchema.index({ userId: 1, status: 1 });
loanSchema.index({ userId: 1, loanType: 1 });
loanSchema.index({ nextPaymentDate: 1 });

// Virtual for months remaining
loanSchema.virtual('monthsRemaining').get(function(this: ILoan) {
  const now = new Date();
  const start = new Date(this.startDate);
  const monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12 + 
                        (now.getMonth() - start.getMonth());
  return Math.max(0, this.termMonths - monthsElapsed);
});

// Virtual for progress percentage
loanSchema.virtual('progressPercentage').get(function(this: ILoan) {
  if (this.principal === 0) return 100;
  return Math.round(((this.principal - this.remainingBalance) / this.principal) * 100);
});

export const Loan = mongoose.model<ILoan>('Loan', loanSchema);
