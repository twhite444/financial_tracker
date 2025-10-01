import { Plus, Search, Download, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Building2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useState } from 'react';
import Modal from '../components/common/Modal';

const mockTransactions = [
  {
    id: '1',
    date: new Date(2024, 0, 14),
    description: 'Grocery Store',
    category: 'Groceries',
    amount: -127.50,
    type: 'expense',
    account: 'Schwab Checking',
  },
  {
    id: '2',
    date: new Date(2024, 0, 13),
    description: 'Monthly Salary',
    category: 'Income',
    amount: 5000.00,
    type: 'income',
    account: 'Schwab Checking',
  },
  {
    id: '3',
    date: new Date(2024, 0, 12),
    description: 'Gas Station',
    category: 'Transportation',
    amount: -45.00,
    type: 'expense',
    account: 'Capital One Quicksilver',
  },
  {
    id: '4',
    date: new Date(2024, 0, 11),
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: -15.99,
    type: 'expense',
    account: 'Discover it Cash Back',
  },
  {
    id: '5',
    date: new Date(2024, 0, 10),
    description: 'Restaurant',
    category: 'Dining',
    amount: -68.25,
    type: 'expense',
    account: 'Chase Sapphire',
  },
  {
    id: '6',
    date: new Date(2024, 0, 9),
    description: 'Amazon Purchase',
    category: 'Shopping',
    amount: -234.99,
    type: 'expense',
    account: 'Capital One Quicksilver',
  },
  {
    id: '7',
    date: new Date(2024, 0, 8),
    description: 'Freelance Project',
    category: 'Income',
    amount: 800.00,
    type: 'income',
    account: 'Schwab Checking',
  },
  {
    id: '8',
    date: new Date(2024, 0, 7),
    description: 'Gym Membership',
    category: 'Health',
    amount: -50.00,
    type: 'expense',
    account: 'Schwab Checking',
  },
  {
    id: '9',
    date: new Date(2024, 0, 6),
    description: 'Coffee Shop',
    category: 'Dining',
    amount: -12.50,
    type: 'expense',
    account: 'Discover it Cash Back',
  },
  {
    id: '10',
    date: new Date(2024, 0, 5),
    description: 'Utility Bill',
    category: 'Utilities',
    amount: -85.00,
    type: 'expense',
    account: 'Schwab Checking',
  },
];

const categories = ['All', 'Income', 'Groceries', 'Dining', 'Shopping', 'Transportation', 'Entertainment', 'Health', 'Utilities'];
const accounts = ['All Accounts', 'Schwab Checking', 'Schwab Retirement', 'Capital One Quicksilver', 'Discover it Cash Back', 'Chase Sapphire'];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Groceries',
    account: 'Schwab Checking',
    type: 'expense',
  });

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
    const matchesAccount = selectedAccount === 'All Accounts' || tx.account === selectedAccount;
    return matchesSearch && matchesCategory && matchesAccount;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

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
            {accounts.map((account) => (
              <button
                key={account}
                onClick={() => setSelectedAccount(account)}
                className={`glass-button whitespace-nowrap ${
                  selectedAccount === account ? 'bg-accent-blue text-white' : ''
                }`}
              >
                {account}
              </button>
            ))}
          </div>
        </div>
      </div>

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
                          {transaction.account}
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
            Showing {filteredTransactions.length} of {mockTransactions.length} transactions
          </div>
        </div>
      )}
    </div>
  );
}
