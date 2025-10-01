export interface Transaction {
    _id?: string;
    id?: string;
    userId?: string;
    accountId: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    date: Date | string;
    merchant?: string;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}