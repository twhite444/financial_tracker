export interface PaymentReminder {
    id: string;
    dueDate: Date;
    amount: number;
    description?: string;
    isPaid: boolean;
}