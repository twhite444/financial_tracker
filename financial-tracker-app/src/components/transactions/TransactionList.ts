export class TransactionList {
    private transactions: Transaction[];

    constructor() {
        this.transactions = [];
    }

    public async fetchTransactions(): Promise<void> {
        // Logic to fetch transactions from the TransactionService
        const transactionService = new TransactionService();
        this.transactions = await transactionService.getTransactions();
        this.render();
    }

    public render(): void {
        // Logic to render the list of transactions in the UI
        const transactionContainer = document.getElementById('transaction-list');
        if (transactionContainer) {
            transactionContainer.innerHTML = '';
            this.transactions.forEach(transaction => {
                const transactionItem = document.createElement('div');
                transactionItem.className = 'transaction-item';
                transactionItem.innerText = `${transaction.date}: ${transaction.description} - $${transaction.amount}`;
                transactionContainer.appendChild(transactionItem);
            });
        }
    }
}