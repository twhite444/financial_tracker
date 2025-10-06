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
    loanId?: string; // Link to Loan for loan payments
    loanPaymentDetails?: {
        principalPaid: number;
        interestPaid: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}