import React, { useState } from 'react';
import { TransactionService } from '../../services/data/TransactionService';
import { Transaction } from '../../models/Transaction';

const TransactionForm: React.FC<{ onSubmit: (transaction: Transaction) => void }> = ({ onSubmit }) => {
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (amount <= 0 || !date || !description) {
            setError('Please fill in all fields with valid data.');
            return;
        }

        const newTransaction: Transaction = {
            id: Date.now(), // Temporary ID generation
            amount,
            date,
            description,
        };

        try {
            await TransactionService.addTransaction(newTransaction);
            onSubmit(newTransaction);
            clearForm();
        } catch (err) {
            setError('Failed to add transaction. Please try again.');
        }
    };

    const clearForm = () => {
        setAmount(0);
        setDate('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default TransactionForm;