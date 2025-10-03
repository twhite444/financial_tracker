import mongoose, { Document, Schema } from 'mongoose';
import { PaymentHistory } from './PaymentHistory';
import { trackChanges, createDocumentSnapshot } from '../utils/historyTracker';

export interface IPaymentReminder extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  dueDate: Date;
  recurring: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fields to track in history
const TRACKED_FIELDS = [
  'accountId',
  'title',
  'amount',
  'dueDate',
  'recurring',
  'frequency',
  'isPaid',
  'paidDate',
  'notes',
];

const paymentReminderSchema = new Schema<IPaymentReminder>(
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
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
paymentReminderSchema.index({ userId: 1, dueDate: 1 });
paymentReminderSchema.index({ userId: 1, isPaid: 1 });

// Pre-save hook: Store original values for comparison
paymentReminderSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified()) {
    (this as any)._original = this.toObject();
  }
  next();
});

// Post-save hook: Track creation and updates
paymentReminderSchema.post('save', async function (doc: IPaymentReminder) {
  try {
    const action = doc.isNew ? 'created' : 'updated';
    const original = (doc as any)._original;
    
    // Check for specific actions
    if (!doc.isNew && doc.isModified('isPaid')) {
      const specificAction = doc.isPaid ? 'marked_paid' : 'marked_unpaid';
      
      await PaymentHistory.create({
        paymentId: doc._id,
        userId: doc.userId,
        action: specificAction,
        changedBy: doc.userId,
        previousData: { isPaid: original?.isPaid, paidDate: original?.paidDate },
        newData: { isPaid: doc.isPaid, paidDate: doc.paidDate },
        changedFields: ['isPaid', 'paidDate'],
        timestamp: new Date(),
      });
    }
    
    // Check for rescheduling
    if (!doc.isNew && doc.isModified('dueDate')) {
      await PaymentHistory.create({
        paymentId: doc._id,
        userId: doc.userId,
        action: 'rescheduled',
        changedBy: doc.userId,
        previousData: { dueDate: original?.dueDate },
        newData: { dueDate: doc.dueDate },
        changedFields: ['dueDate'],
        timestamp: new Date(),
      });
    }
    
    // General history entry
    await PaymentHistory.create({
      paymentId: doc._id,
      userId: doc.userId,
      action,
      changedBy: doc.userId,
      newData: createDocumentSnapshot(doc, TRACKED_FIELDS),
      changedFields: action === 'created' ? TRACKED_FIELDS : [],
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error creating payment history:', error);
  }
});

// Pre-update hook: Track what changed
paymentReminderSchema.pre('findOneAndUpdate', async function () {
  try {
    const update = this.getUpdate() as any;
    const query = this.getQuery();
    
    const originalDoc = await PaymentReminder.findOne(query);
    
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
    console.error('Error in payment pre-update hook:', error);
  }
});

// Post-update hook: Save the history
paymentReminderSchema.post('findOneAndUpdate', async function (doc: IPaymentReminder) {
  try {
    const options = this.getOptions() as any;
    
    if (options._changes && options._originalDoc) {
      const { _changes, _originalDoc } = options;
      
      // Check for payment status change
      if (_changes.changedFields.includes('isPaid')) {
        const specificAction = doc.isPaid ? 'marked_paid' : 'marked_unpaid';
        
        await PaymentHistory.create({
          paymentId: doc._id,
          userId: doc.userId,
          action: specificAction,
          changedBy: doc.userId,
          previousData: { isPaid: _originalDoc.isPaid, paidDate: _originalDoc.paidDate },
          newData: { isPaid: doc.isPaid, paidDate: doc.paidDate },
          changedFields: ['isPaid', 'paidDate'],
          timestamp: new Date(),
        });
      }
      
      // Check for rescheduling
      if (_changes.changedFields.includes('dueDate')) {
        await PaymentHistory.create({
          paymentId: doc._id,
          userId: doc.userId,
          action: 'rescheduled',
          changedBy: doc.userId,
          previousData: { dueDate: _originalDoc.dueDate },
          newData: { dueDate: doc.dueDate },
          changedFields: ['dueDate'],
          timestamp: new Date(),
        });
      }
      
      // General update history
      await PaymentHistory.create({
        paymentId: doc._id,
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
    console.error('Error creating payment history in post-update:', error);
  }
});

// Pre-delete hook: Track deletion
paymentReminderSchema.pre('findOneAndDelete', async function () {
  try {
    const query = this.getQuery();
    const doc = await PaymentReminder.findOne(query);
    
    if (doc) {
      await PaymentHistory.create({
        paymentId: doc._id,
        userId: doc.userId,
        action: 'deleted',
        changedBy: doc.userId,
        previousData: createDocumentSnapshot(doc, TRACKED_FIELDS),
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating payment deletion history:', error);
  }
});

export const PaymentReminder = mongoose.model<IPaymentReminder>('PaymentReminder', paymentReminderSchema);
