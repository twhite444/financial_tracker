import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const stats = [
  {
    label: 'Net Worth',
    value: 87500,
    change: 12.5,
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    label: 'Total Balance',
    value: 65000,
    change: 5.2,
    trend: 'up',
    icon: Wallet,
    color: 'text-blue-600',
  },
  {
    label: 'Total Debt',
    value: 4500,
    change: -8.1,
    trend: 'down',
    icon: CreditCard,
    color: 'text-red-600',
  },
];

const accounts = [
  { name: 'Schwab Checking', balance: 12500, type: 'checking', institution: 'Schwab' },
  { name: 'Schwab Retirement', balance: 52500, type: 'retirement', institution: 'Schwab' },
  { name: 'Capital One Quicksilver', balance: -1500, type: 'credit', institution: 'Capital One' },
  { name: 'Discover it Cash Back', balance: -2000, type: 'credit', institution: 'Discover' },
  { name: 'Chase Sapphire', balance: -1000, type: 'credit', institution: 'Chase' },
];

const recentTransactions = [
  { id: 1, description: 'Grocery Store', amount: -127.50, date: '2025-09-30', category: 'Groceries' },
  { id: 2, description: 'Salary Deposit', amount: 5000, date: '2025-09-29', category: 'Income' },
  { id: 3, description: 'Electric Bill', amount: -89.32, date: '2025-09-28', category: 'Utilities' },
  { id: 4, description: 'Gas Station', amount: -45.00, date: '2025-09-27', category: 'Transportation' },
  { id: 5, description: 'Restaurant', amount: -68.50, date: '2025-09-26', category: 'Dining' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card-hover p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stat.value)}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-gray-500 text-sm">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accounts Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Accounts</h2>
          <button className="btn-primary text-sm">Add Account</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account.name} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      account.type === 'checking' ? 'bg-blue-500' :
                      account.type === 'retirement' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <p className="font-medium text-gray-900">{account.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{account.institution}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    account.balance < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatCurrency(Math.abs(account.balance))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{account.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-accent-blue hover:text-blue-700 text-sm font-medium">
            View All →
          </button>
        </div>

        <div className="glass-card divide-y divide-gray-100">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mt-1">
                    {transaction.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
