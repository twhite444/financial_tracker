import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan';
  institution: string;
  balance: number;
  creditLimit?: number;
  currency: string;
  isActive: boolean;
  plaidAccountId?: string;
  isPlaidLinked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Account type is required'],
      enum: ['checking', 'savings', 'credit_card', 'investment', 'loan'],
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required'],
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    plaidAccountId: {
      type: String,
      sparse: true, // Allows multiple null values but unique non-null values
    },
    isPlaidLinked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
accountSchema.index({ userId: 1, isActive: 1 });

export const Account = mongoose.model<IAccount>('Account', accountSchema);
