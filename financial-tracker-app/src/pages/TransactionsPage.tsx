import { Plus, Search, Download, ArrowUpRight, ArrowDownLeft, Calendar, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { TransactionService } from '../services/data/TransactionService';
import { AccountService } from '../services/data/AccountService';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { TableRowSkeleton } from '../components/common/Skeletons';
import { useSearchParams } from 'react-router-dom';
import AdvancedFilters, { TransactionFilters, FilterPreset } from '../components/transactions/AdvancedFilters';
import AnimatedPage from '../components/common/AnimatedPage';
import { listContainer, listItem } from '../utils/animations';

const categories = ['All', 'Income', 'Groceries', 'Dining', 'Shopping', 'Transportation', 'Entertainment', 'Health', 'Utilities'];

const PRESETS_STORAGE_KEY = 'transaction_filter_presets';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Groceries',
    accountId: '',
    type: 'expense' as 'income' | 'expense',
  });
  
  // Advanced filters state
  const [filters, setFilters] = useState<TransactionFilters>({
    categories: [],
    accounts: [],
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: Infinity },
    searchQuery: '',
  });
  
  // Filter presets state
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  
  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (err) {
        console.error('Failed to parse saved presets:', err);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // Handle quick action query params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setIsAddModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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
    // Search query
    const matchesSearch = 
      searchQuery === '' || 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Categories
    const matchesCategory = 
      filters.categories.length === 0 || 
      filters.categories.includes(tx.category);

    // Accounts
    const matchesAccount = 
      filters.accounts.length === 0 || 
      filters.accounts.includes(tx.accountId);

    // Date range
    const txDate = new Date(tx.date);
    const matchesDateStart = 
      filters.dateRange.start === '' || 
      txDate >= new Date(filters.dateRange.start);
    const matchesDateEnd = 
      filters.dateRange.end === '' || 
      txDate <= new Date(filters.dateRange.end);

    // Amount range
    const matchesAmountMin = tx.amount >= filters.amountRange.min;
    const matchesAmountMax = 
      filters.amountRange.max === Infinity || 
      tx.amount <= filters.amountRange.max;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAccount &&
      matchesDateStart &&
      matchesDateEnd &&
      matchesAmountMin &&
      matchesAmountMax
    );
  });
  
  // Preset management functions
  const handleSavePreset = (name: string) => {
    const newPreset: FilterPreset = {
      id: `preset_${Date.now()}`,
      name,
      filters: { ...filters },
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    toast.success(`Preset "${name}" saved!`);
  };

  const handleDeletePreset = (id: string) => {
    const updatedPresets = presets.filter((p) => p.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    toast.success('Preset deleted');
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters);
    toast.success(`Loaded preset "${preset.name}"`);
  };

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track all your financial transactions</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="glass-button flex items-center justify-center gap-2 flex-1 sm:flex-initial">
            <Download className="h-5 w-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-initial"
          >
            <Plus className="h-5 w-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card p-4 sm:p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{filteredTransactions.filter(tx => tx.type === 'income').length} transactions</p>
        </div>
        <div className="glass-card p-4 sm:p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{filteredTransactions.filter(tx => tx.type === 'expense').length} transactions</p>
        </div>
        <div className="glass-card p-4 sm:p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Cash Flow</p>
          <p className={`text-2xl sm:text-3xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(totalIncome - totalExpenses)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">This period</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-12"
            aria-label="Search transactions"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        accounts={accounts}
        categories={categories}
        presets={presets}
        onSavePreset={handleSavePreset}
        onDeletePreset={handleDeletePreset}
        onLoadPreset={handleLoadPreset}
      />

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Transactions List */}
          <div className="glass-card overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold">No transactions found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters or add a new transaction</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary mt-6 inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Transaction
                </button>
              </div>
            ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 sm:p-6 hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left side - Icon + Details */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                        transaction.type === 'income'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {transaction.description}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            categoryColors[transaction.category] || 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {accounts.find(a => (a._id || a.id) === transaction.accountId)?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Amount + Delete */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p
                        className={`text-xl sm:text-2xl font-bold ${
                          transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this transaction? The account balance will be automatically adjusted.')) {
                          const result = await TransactionService.deleteTransaction(transaction._id || transaction.id!);
                          if (result.success) {
                            toast.success('Transaction deleted successfully!');
                            await loadData();
                          } else {
                            const errorMsg = result.error || 'Failed to delete transaction';
                            setError(errorMsg);
                            toast.error(errorMsg);
                          }
                        }
                      }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </button>
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
              toast.success('Transaction created successfully!');
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
              const errorMsg = result.error || 'Failed to create transaction';
              setError(errorMsg);
              toast.error(errorMsg);
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
