export interface PaymentReminder {
    _id?: string;
    id?: string;
    userId?: string;
    accountId: string;
    title: string;
    amount: number;
    dueDate: Date | string;
    recurring: boolean;
    frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
    isPaid: boolean;
    paidDate?: Date | string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}