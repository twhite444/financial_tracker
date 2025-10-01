export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface Account {
    id: string;
    accountType: string;
    balance: number;
    userId: string;
}

export interface Transaction {
    id: string;
    amount: number;
    date: Date;
    description: string;
    accountId: string;
}

export interface PaymentReminder {
    id: string;
    dueDate: Date;
    amount: number;
    accountId: string;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    accounts: Account[];
}

export interface TransactionFilter {
    startDate?: Date;
    endDate?: Date;
    accountId?: string;
}