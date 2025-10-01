import React, { useState } from 'react';
import { AccountService } from '../../services/data/AccountService';
import { Account } from '../../models/Account';

const AccountForm: React.FC<{ account?: Account; onSubmit: (account: Account) => void }> = ({ account, onSubmit }) => {
    const [accountType, setAccountType] = useState(account ? account.accountType : '');
    const [balance, setBalance] = useState(account ? account.balance : 0);
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!accountType || balance < 0) {
            setError('Please provide valid account type and balance.');
            return;
        }
        const newAccount: Account = {
            id: account ? account.id : Date.now(), // Simple ID generation for demo purposes
            accountType,
            balance,
        };
        onSubmit(newAccount);
        setAccountType('');
        setBalance(0);
        setError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Account Type:</label>
                <input
                    type="text"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                />
            </div>
            <div>
                <label>Balance:</label>
                <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit">{account ? 'Update Account' : 'Add Account'}</button>
        </form>
    );
};

export default AccountForm;