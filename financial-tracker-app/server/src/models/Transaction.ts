import mongoose, { Document, Schema } from 'mongoose';
import { TransactionHistory } from './TransactionHistory';
import { trackChanges, createDocumentSnapshot } from '../utils/historyTracker';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  merchant?: string;
  tags?: string[];
  loanId?: mongoose.Types.ObjectId; // Link to Loan for loan payments
  loanPaymentDetails?: {
    principalPaid: number;
    interestPaid: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Fields to track in history
const TRACKED_FIELDS = [
  'accountId',
  'type',
  'category',
  'amount',
  'description',
  'date',
  'merchant',
  'tags',
];

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Account ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      index: true,
    },
    merchant: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    loanId: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      index: true,
    },
    loanPaymentDetails: {
      principalPaid: {
        type: Number,
        min: 0,
      },
      interestPaid: {
        type: Number,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, accountId: 1 });
transactionSchema.index({ userId: 1, category: 1 });

// Post-save hook: Track creation and updates
transactionSchema.post('save', async function (doc: ITransaction) {
  try {
    // Check if this is a new document (created) or update
    const action = doc.isNew ? 'created' : 'updated';
    
    await TransactionHistory.create({
      transactionId: doc._id,
      userId: doc.userId,
      action,
      changedBy: doc.userId,
      newData: createDocumentSnapshot(doc, TRACKED_FIELDS),
      changedFields: action === 'created' ? TRACKED_FIELDS : [],
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error creating transaction history:', error);
  }
});

// Pre-update hook: Track what changed
transactionSchema.pre('findOneAndUpdate', async function () {
  try {
    const update = this.getUpdate() as any;
    const query = this.getQuery();
    
    // Find the original document
    const originalDoc = await Transaction.findOne(query);
    
    if (originalDoc && update.$set) {
      const changes = trackChanges(originalDoc, update.$set, TRACKED_FIELDS);
      
      if (changes.changedFields.length > 0) {
        // Store the original doc and changes in the query options for post hook
        this.setOptions({ 
          ...this.getOptions(),
          _originalDoc: originalDoc,
          _changes: changes 
        });
      }
    }
  } catch (error) {
    console.error('Error in transaction pre-update hook:', error);
  }
});

// Post-update hook: Save the history
transactionSchema.post('findOneAndUpdate', async function (doc: ITransaction) {
  try {
    const options = this.getOptions() as any;
    
    if (options._changes && options._originalDoc) {
      await TransactionHistory.create({
        transactionId: doc._id,
        userId: doc.userId,
        action: 'updated',
        changedBy: doc.userId,
        previousData: options._changes.previousData,
        newData: options._changes.newData,
        changedFields: options._changes.changedFields,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating transaction history in post-update:', error);
  }
});

// Pre-delete hook: Track deletion
transactionSchema.pre('findOneAndDelete', async function () {
  try {
    const query = this.getQuery();
    const doc = await Transaction.findOne(query);
    
    if (doc) {
      await TransactionHistory.create({
        transactionId: doc._id,
        userId: doc.userId,
        action: 'deleted',
        changedBy: doc.userId,
        previousData: createDocumentSnapshot(doc, TRACKED_FIELDS),
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating transaction deletion history:', error);
  }
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
