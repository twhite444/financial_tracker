export class AccountService {
    private accounts: Account[] = [];

    constructor(private databaseService: DatabaseService) {}

    async createAccount(account: Account): Promise<Account> {
        const newAccount = await this.databaseService.insert('accounts', account);
        this.accounts.push(newAccount);
        return newAccount;
    }

    async getAccounts(): Promise<Account[]> {
        if (this.accounts.length === 0) {
            this.accounts = await this.databaseService.fetchAll('accounts');
        }
        return this.accounts;
    }

    async updateAccount(accountId: string, updatedAccount: Partial<Account>): Promise<Account | null> {
        const updated = await this.databaseService.update('accounts', accountId, updatedAccount);
        if (updated) {
            const index = this.accounts.findIndex(acc => acc.id === accountId);
            if (index !== -1) {
                this.accounts[index] = { ...this.accounts[index], ...updatedAccount };
            }
            return { ...this.accounts[index], ...updatedAccount };
        }
        return null;
    }

    async deleteAccount(accountId: string): Promise<boolean> {
        const deleted = await this.databaseService.delete('accounts', accountId);
        if (deleted) {
            this.accounts = this.accounts.filter(acc => acc.id !== accountId);
            return true;
        }
        return false;
    }
}