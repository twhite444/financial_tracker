import { Plus, Search, Download, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Building2, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import { TransactionService } from '../services/data/TransactionService';
import { AccountService } from '../services/data/AccountService';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';

const categories = ['All', 'Income', 'Groceries', 'Dining', 'Shopping', 'Transportation', 'Entertainment', 'Health', 'Utilities'];

const categoryColors: Record<string, string> = {
  Income: 'bg-green-100 text-green-700 border-green-200',
  Groceries: 'bg-blue-100 text-blue-700 border-blue-200',
  Dining: 'bg-orange-100 text-orange-700 border-orange-200',
  Shopping: 'bg-purple-100 text-purple-700 border-purple-200',
  Transportation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Entertainment: 'bg-pink-100 text-pink-700 border-pink-200',
  Health: 'bg-teal-100 text-teal-700 border-teal-200',
  Utilities: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Groceries',
    accountId: '',
    type: 'expense' as 'income' | 'expense',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [txResult, accResult] = await Promise.all([
      TransactionService.getTransactions(),
      AccountService.getAccounts()
    ]);

    if (txResult.success && txResult.data) {
      setTransactions(txResult.data.transactions);
    } else {
      setError(txResult.error || 'Failed to load transactions');
    }

    if (accResult.success && accResult.data) {
      setAccounts(accResult.data);
    }

    setIsLoading(false);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
    const matchesAccount = selectedAccount === 'All Accounts' || 
      (tx.accountId === selectedAccount || accounts.find(a => (a._id || a.id) === tx.accountId)?.name === selectedAccount);
    return matchesSearch && matchesCategory && matchesAccount;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track all your financial transactions</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-button flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600 mb-1">Total Income</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          <p className="text-sm text-gray-500 mt-2">{filteredTransactions.filter(tx => tx.type === 'income').length} transactions</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-500 mt-2">{filteredTransactions.filter(tx => tx.type === 'expense').length} transactions</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600 mb-1">Net Cash Flow</p>
          <p className={`text-3xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalIncome - totalExpenses)}
          </p>
          <p className="text-sm text-gray-500 mt-2">This period</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-12"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Category
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`glass-button whitespace-nowrap ${
                  selectedCategory === category ? 'bg-accent-blue text-white' : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Account Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Account
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedAccount('All Accounts')}
              className={`glass-button whitespace-nowrap ${
                selectedAccount === 'All Accounts' ? 'bg-accent-blue text-white' : ''
              }`}
            >
              All Accounts
            </button>
            {accounts.map((account) => (
              <button
                key={account._id || account.id}
                onClick={() => setSelectedAccount(account.name)}
                className={`glass-button whitespace-nowrap ${
                  selectedAccount === account.name ? 'bg-accent-blue text-white' : ''
                }`}
              >
                {account.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-blue" />
        </div>
      ) : (
        <>
          {/* Transactions List */}
          <div className="glass-card overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No transactions found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or add a new transaction</p>
              </div>
            ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Icon + Details */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className="h-6 w-6" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            categoryColors[transaction.category] || 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {accounts.find(a => (a._id || a.id) === transaction.accountId)?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Amount */}
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

          {/* Pagination placeholder */}
          {filteredTransactions.length > 0 && (
            <div className="flex justify-center">
              <div className="glass-button">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            category: 'Groceries',
            accountId: accounts[0]?._id || accounts[0]?.id || '',
            type: 'expense',
          });
        }}
        title="Add Transaction"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const transactionData: Omit<Transaction, '_id' | 'id'> = {
              description: formData.description,
              amount: parseFloat(formData.amount),
              date: formData.date || new Date().toISOString(),
              category: formData.category,
              accountId: formData.accountId,
              type: formData.type,
            };

            const result = await TransactionService.createTransaction(transactionData);
            if (result.success) {
              await loadData();
              setIsAddModalOpen(false);
              setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Groceries',
                accountId: accounts[0]?._id || accounts[0]?.id || '',
                type: 'expense',
              });
            } else {
              setError(result.error || 'Failed to create transaction');
            }
          }}
          className="space-y-6"
        >
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white/50'
                }`}
              >
                <ArrowUpRight className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white/50'
                }`}
              >
                <ArrowDownLeft className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Income</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Grocery Store"
              className="glass-input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="glass-input pl-8"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="glass-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="glass-input"
            >
              {formData.type === 'income' ? (
                <option value="Income">Income</option>
              ) : (
                <>
                  <option value="Groceries">Groceries</option>
                  <option value="Dining">Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Utilities">Utilities</option>
                </>
              )}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account *
            </label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="glass-input"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account._id || account.id} value={account._id || account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
