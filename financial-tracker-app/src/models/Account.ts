export interface Account {
    _id?: string;
    id?: string;
    userId?: string;
    name: string;
    type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan';
    institution: string;
    balance: number;
    creditLimit?: number;
    currency?: string;
    isActive?: boolean;
    accountNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
}