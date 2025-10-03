import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentHistory extends Document {
  paymentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: 'created' | 'updated' | 'deleted' | 'marked_paid' | 'marked_unpaid' | 'rescheduled';
  changedBy: mongoose.Types.ObjectId;
  previousData?: {
    accountId?: mongoose.Types.ObjectId;
    title?: string;
    amount?: number;
    dueDate?: Date;
    recurring?: boolean;
    frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    isPaid?: boolean;
    paidDate?: Date;
    notes?: string;
  };
  newData?: {
    accountId?: mongoose.Types.ObjectId;
    title?: string;
    amount?: number;
    dueDate?: Date;
    recurring?: boolean;
    frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    isPaid?: boolean;
    paidDate?: Date;
    notes?: string;
  };
  changedFields?: string[];
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}

const paymentHistorySchema = new Schema<IPaymentHistory>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentReminder',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['created', 'updated', 'deleted', 'marked_paid', 'marked_unpaid', 'rescheduled'],
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    previousData: {
      type: Schema.Types.Mixed,
    },
    newData: {
      type: Schema.Types.Mixed,
    },
    changedFields: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for efficient queries
paymentHistorySchema.index({ paymentId: 1, timestamp: -1 });
paymentHistorySchema.index({ userId: 1, timestamp: -1 });
paymentHistorySchema.index({ userId: 1, action: 1 });

export const PaymentHistory = mongoose.model<IPaymentHistory>(
  'PaymentHistory',
  paymentHistorySchema
);
