import mongoose, { Document, Schema } from 'mongoose';

export interface ITransactionHistory extends Document {
  transactionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: 'created' | 'updated' | 'deleted';
  changedBy: mongoose.Types.ObjectId;
  previousData?: {
    accountId?: mongoose.Types.ObjectId;
    type?: 'income' | 'expense';
    category?: string;
    amount?: number;
    description?: string;
    date?: Date;
    merchant?: string;
    tags?: string[];
  };
  newData?: {
    accountId?: mongoose.Types.ObjectId;
    type?: 'income' | 'expense';
    category?: string;
    amount?: number;
    description?: string;
    date?: Date;
    merchant?: string;
    tags?: string[];
  };
  changedFields?: string[];
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const transactionHistorySchema = new Schema<ITransactionHistory>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
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
      enum: ['created', 'updated', 'deleted'],
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
  },
  {
    timestamps: false, // We use custom timestamp field
  }
);

// Compound indexes for efficient queries
transactionHistorySchema.index({ transactionId: 1, timestamp: -1 });
transactionHistorySchema.index({ userId: 1, timestamp: -1 });
transactionHistorySchema.index({ userId: 1, action: 1 });

export const TransactionHistory = mongoose.model<ITransactionHistory>(
  'TransactionHistory',
  transactionHistorySchema
);
