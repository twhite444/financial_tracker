import mongoose, { Document, Schema } from 'mongoose';
import { AccountHistory } from './AccountHistory';
import { trackChanges, createDocumentSnapshot } from '../utils/historyTracker';

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

// Fields to track in history
const TRACKED_FIELDS = [
  'name',
  'type',
  'institution',
  'balance',
  'creditLimit',
  'isActive',
  'isPlaidLinked',
];

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

// Post-save hook: Track creation and updates
accountSchema.post('save', async function (doc: IAccount) {
  try {
    const action = doc.isNew ? 'created' : 'updated';
    
    // Check if this is a balance change
    if (!doc.isNew && doc.isModified('balance')) {
      const originalBalance = (doc as any)._original?.balance;
      
      if (originalBalance !== undefined) {
        await AccountHistory.create({
          accountId: doc._id,
          userId: doc.userId,
          action: 'balance_changed',
          changedBy: doc.userId,
          balanceChange: {
            previous: originalBalance,
            new: doc.balance,
            difference: doc.balance - originalBalance,
          },
          timestamp: new Date(),
        });
      }
    }
    
    // Check if status changed
    if (!doc.isNew && doc.isModified('isActive')) {
      const specificAction = doc.isActive ? 'activated' : 'deactivated';
      
      await AccountHistory.create({
        accountId: doc._id,
        userId: doc.userId,
        action: specificAction,
        changedBy: doc.userId,
        previousData: { isActive: !doc.isActive },
        newData: { isActive: doc.isActive },
        changedFields: ['isActive'],
        timestamp: new Date(),
      });
    }
    
    // General history entry
    await AccountHistory.create({
      accountId: doc._id,
      userId: doc.userId,
      action,
      changedBy: doc.userId,
      newData: createDocumentSnapshot(doc, TRACKED_FIELDS),
      changedFields: action === 'created' ? TRACKED_FIELDS : [],
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error creating account history:', error);
  }
});

// Pre-save hook: Store original values for comparison
accountSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified()) {
    (this as any)._original = this.toObject();
  }
  next();
});

// Pre-update hook: Track what changed
accountSchema.pre('findOneAndUpdate', async function () {
  try {
    const update = this.getUpdate() as any;
    const query = this.getQuery();
    
    const originalDoc = await Account.findOne(query);
    
    if (originalDoc && update.$set) {
      const changes = trackChanges(originalDoc, update.$set, TRACKED_FIELDS);
      
      if (changes.changedFields.length > 0) {
        this.setOptions({ 
          ...this.getOptions(),
          _originalDoc: originalDoc,
          _changes: changes 
        });
      }
    }
  } catch (error) {
    console.error('Error in account pre-update hook:', error);
  }
});

// Post-update hook: Save the history
accountSchema.post('findOneAndUpdate', async function (doc: IAccount) {
  try {
    const options = this.getOptions() as any;
    
    if (options._changes && options._originalDoc) {
      const { _changes, _originalDoc } = options;
      
      // Check for balance change
      if (_changes.changedFields.includes('balance')) {
        await AccountHistory.create({
          accountId: doc._id,
          userId: doc.userId,
          action: 'balance_changed',
          changedBy: doc.userId,
          balanceChange: {
            previous: _originalDoc.balance,
            new: doc.balance,
            difference: doc.balance - _originalDoc.balance,
          },
          timestamp: new Date(),
        });
      }
      
      // Check for status change
      if (_changes.changedFields.includes('isActive')) {
        const specificAction = doc.isActive ? 'activated' : 'deactivated';
        
        await AccountHistory.create({
          accountId: doc._id,
          userId: doc.userId,
          action: specificAction,
          changedBy: doc.userId,
          previousData: { isActive: _originalDoc.isActive },
          newData: { isActive: doc.isActive },
          changedFields: ['isActive'],
          timestamp: new Date(),
        });
      }
      
      // General update history
      await AccountHistory.create({
        accountId: doc._id,
        userId: doc.userId,
        action: 'updated',
        changedBy: doc.userId,
        previousData: _changes.previousData,
        newData: _changes.newData,
        changedFields: _changes.changedFields,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating account history in post-update:', error);
  }
});

// Pre-delete hook: Track deletion
accountSchema.pre('findOneAndDelete', async function () {
  try {
    const query = this.getQuery();
    const doc = await Account.findOne(query);
    
    if (doc) {
      await AccountHistory.create({
        accountId: doc._id,
        userId: doc.userId,
        action: 'deleted',
        changedBy: doc.userId,
        previousData: createDocumentSnapshot(doc, TRACKED_FIELDS),
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating account deletion history:', error);
  }
});

export const Account = mongoose.model<IAccount>('Account', accountSchema);
