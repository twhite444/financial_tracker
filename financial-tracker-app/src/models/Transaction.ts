export interface Transaction {
    id: string;
    amount: number;
    date: Date;
    description: string;
    accountId: string; // Reference to the associated account
    category?: string; // Optional category for the transaction
}