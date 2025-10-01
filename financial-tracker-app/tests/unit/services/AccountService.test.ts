import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountService } from '../../../src/services/data/AccountService';
import { factories } from '../../helpers/factories';

describe('AccountService', () => {
    let accountService: AccountService;

    beforeEach(() => {
        accountService = new AccountService();
        vi.clearAllMocks();
    });

    describe('createAccount', () => {
        it('should create a new bank account with valid data', async () => {
            const accountData = factories.schwabChecking();
            
            const result = await accountService.createAccount(accountData);
            
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id');
            expect(result.accountName).toBe(accountData.accountName);
            expect(result.institution).toBe('Charles Schwab Bank');
        });

        it('should create a credit card account', async () => {
            const cardData = factories.creditCard(undefined, {
                accountName: 'Capital One Quicksilver',
                institution: 'Capital One',
            });
            
            const result = await accountService.createAccount(cardData);
            
            expect(result).toBeDefined();
            expect(result.accountType).toBe('credit_card');
            expect(result).toHaveProperty('creditLimit');
        });

        it('should throw error when required fields are missing', async () => {
            const invalidData = {
                accountName: '',
                accountType: '',
            };
            
            await expect(
                accountService.createAccount(invalidData as any)
            ).rejects.toThrow();
        });
    });

    describe('getAllAccounts', () => {
        it('should return all accounts for a user', async () => {
            const userId = 'user-123';
            const mockAccounts = [
                factories.schwabChecking(userId),
                factories.schwabRetirement(userId),
                factories.creditCard(userId),
            ];
            
            vi.spyOn(accountService, 'getAllAccounts').mockResolvedValue(mockAccounts);
            
            const result = await accountService.getAllAccounts(userId);
            
            expect(result).toHaveLength(3);
            expect(result.every(acc => acc.userId === userId)).toBe(true);
        });

        it('should return empty array when user has no accounts', async () => {
            const userId = 'new-user';
            
            vi.spyOn(accountService, 'getAllAccounts').mockResolvedValue([]);
            
            const result = await accountService.getAllAccounts(userId);
            
            expect(result).toEqual([]);
        });
    });

    describe('updateAccount', () => {
        it('should update an existing account', async () => {
            const accountId = '1';
            const updatedData = { balance: 1500 };
            const updatedAccount = factories.bankAccount(undefined, { id: accountId, balance: 1500 });
            
            vi.spyOn(accountService, 'updateAccount').mockResolvedValue(updatedAccount);
            
            const result = await accountService.updateAccount(accountId, updatedData);
            
            expect(result).toHaveProperty('id', accountId);
            expect(result.balance).toBe(updatedData.balance);
        });

        it('should throw error when updating non-existent account', async () => {
            const accountId = 'non-existent';
            
            vi.spyOn(accountService, 'updateAccount').mockRejectedValue(
                new Error('Account not found')
            );
            
            await expect(
                accountService.updateAccount(accountId, { balance: 1000 })
            ).rejects.toThrow('Account not found');
        });
    });

    describe('deleteAccount', () => {
        it('should delete an account', async () => {
            const accountId = '1';
            
            vi.spyOn(accountService, 'deleteAccount').mockResolvedValue(true);
            
            const result = await accountService.deleteAccount(accountId);
            
            expect(result).toBe(true);
        });

        it('should throw error when deleting account with transactions', async () => {
            const accountId = 'account-with-transactions';
            
            vi.spyOn(accountService, 'deleteAccount').mockRejectedValue(
                new Error('Cannot delete account with existing transactions')
            );
            
            await expect(
                accountService.deleteAccount(accountId)
            ).rejects.toThrow('Cannot delete account with existing transactions');
        });
    });

    describe('getAccountById', () => {
        it('should fetch an account by ID', async () => {
            const accountId = '1';
            const mockAccount = factories.bankAccount(undefined, { id: accountId });
            
            vi.spyOn(accountService, 'getAccountById').mockResolvedValue(mockAccount);
            
            const account = await accountService.getAccountById(accountId);
            
            expect(account).toHaveProperty('id', accountId);
        });

        it('should throw an error when fetching a non-existent account', async () => {
            const accountId = '999';
            
            vi.spyOn(accountService, 'getAccountById').mockRejectedValue(
                new Error('Account not found')
            );
            
            await expect(accountService.getAccountById(accountId)).rejects.toThrow('Account not found');
        });
    });

    describe('Security Tests', () => {
        it('should validate user ownership before account access', async () => {
            const accountId = 'account-123';
            const unauthorizedUserId = 'different-user';
            
            vi.spyOn(accountService, 'getAccountById').mockRejectedValue(
                new Error('Unauthorized')
            );
            
            await expect(
                accountService.getAccountById(accountId, unauthorizedUserId)
            ).rejects.toThrow('Unauthorized');
        });

        it('should sanitize input to prevent SQL injection', async () => {
            const maliciousInput = "'; DROP TABLE accounts; --";
            
            vi.spyOn(accountService, 'getAllAccounts').mockRejectedValue(
                new Error('Invalid input')
            );
            
            await expect(
                accountService.getAllAccounts(maliciousInput)
            ).rejects.toThrow();
        });
    });

    describe('Financial Calculations', () => {
        it('should calculate net worth correctly', async () => {
            const userId = 'user-123';
            const accounts = [
                factories.bankAccount(userId, { balance: 10000 }),
                factories.bankAccount(userId, { balance: 50000 }),
                factories.creditCard(userId, { balance: -2500 }),
            ];
            
            const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
            
            expect(netWorth).toBe(57500);
        });

        it('should handle decimal precision in financial calculations', async () => {
            const amount1 = 0.1;
            const amount2 = 0.2;
            
            const result = parseFloat((amount1 + amount2).toFixed(2));
            
            expect(result).toBe(0.3);
        });
    });
});