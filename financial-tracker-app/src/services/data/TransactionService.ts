export class TransactionService {
    private transactions: Transaction[] = [];

    constructor() {
        // Initialize with some dummy data or fetch from a database
    }

    public fetchTransactions(): Transaction[] {
        // Logic to fetch transactions from the database
        return this.transactions;
    }

    public addTransaction(transaction: Transaction): void {
        // Logic to add a new transaction
        this.transactions.push(transaction);
    }

    public updateTransaction(updatedTransaction: Transaction): void {
        // Logic to update an existing transaction
        const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
            this.transactions[index] = updatedTransaction;
        }
    }

    public deleteTransaction(transactionId: string): void {
        // Logic to delete a transaction
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
    }
}