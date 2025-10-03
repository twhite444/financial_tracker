import mongoose, { Document, Schema } from 'mongoose';

export interface IAccountHistory extends Document {
  accountId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated' | 'balance_changed';
  changedBy: mongoose.Types.ObjectId;
  previousData?: {
    name?: string;
    type?: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan';
    institution?: string;
    balance?: number;
    creditLimit?: number;
    isActive?: boolean;
    isPlaidLinked?: boolean;
  };
  newData?: {
    name?: string;
    type?: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan';
    institution?: string;
    balance?: number;
    creditLimit?: number;
    isActive?: boolean;
    isPlaidLinked?: boolean;
  };
  balanceChange?: {
    previous: number;
    new: number;
    difference: number;
  };
  changedFields?: string[];
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

const accountHistorySchema = new Schema<IAccountHistory>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
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
      enum: ['created', 'updated', 'deleted', 'activated', 'deactivated', 'balance_changed'],
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
    balanceChange: {
      previous: { type: Number },
      new: { type: Number },
      difference: { type: Number },
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
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for efficient queries
accountHistorySchema.index({ accountId: 1, timestamp: -1 });
accountHistorySchema.index({ userId: 1, timestamp: -1 });
accountHistorySchema.index({ userId: 1, action: 1 });

export const AccountHistory = mongoose.model<IAccountHistory>(
  'AccountHistory',
  accountHistorySchema
);
