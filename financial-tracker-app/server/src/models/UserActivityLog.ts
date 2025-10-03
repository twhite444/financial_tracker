import mongoose, { Document, Schema } from 'mongoose';

export interface IUserActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
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
  previousData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    plaidLinked?: boolean;
  };
  newData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    plaidLinked?: boolean;
  };
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
  };
  success: boolean;
  errorMessage?: string;
}

const userActivityLogSchema = new Schema<IUserActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'register',
        'password_change',
        'profile_update',
        'plaid_link',
        'plaid_unlink',
        'failed_login',
        'account_locked',
        'account_unlocked',
        'export_data',
        'delete_account',
      ],
      index: true,
    },
    details: {
      type: String,
      trim: true,
    },
    previousData: {
      type: Schema.Types.Mixed,
    },
    newData: {
      type: Schema.Types.Mixed,
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
    location: {
      country: { type: String },
      city: { type: String },
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for efficient queries
userActivityLogSchema.index({ userId: 1, timestamp: -1 });
userActivityLogSchema.index({ userId: 1, action: 1 });
userActivityLogSchema.index({ action: 1, timestamp: -1 });
userActivityLogSchema.index({ success: 1, timestamp: -1 });

export const UserActivityLog = mongoose.model<IUserActivityLog>(
  'UserActivityLog',
  userActivityLogSchema
);
