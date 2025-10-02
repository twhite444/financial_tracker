import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { AccountService } from '../services/data/AccountService';
import { TransactionService } from '../services/data/TransactionService';
import { PaymentService } from '../services/data/PaymentService';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { PaymentReminder } from '../models/PaymentReminder';

// Spending colors for category breakdown
const spendingColors: Record<string, string> = {
  Groceries: '#3B82F6',
  Dining: '#F59E0B',
  Transportation: '#10B981',
  Utilities: '#6366F1',
  Entertainment: '#EC4899',
  Shopping: '#8B5CF6',
  Income: '#10B981',
  Health: '#14B8A6',
};

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<PaymentReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [accResult, txResult, paymentResult] = await Promise.all([
      AccountService.getAccounts(),
      TransactionService.getTransactions({ limit: 5 }),
      PaymentService.getUpcomingPayments(30)
    ]);

    if (accResult.success && accResult.data) {
      setAccounts(accResult.data);
    } else {
      setError(accResult.error || 'Failed to load accounts');
    }

    if (txResult.success && txResult.data) {
      setTransactions(txResult.data.transactions);
    }

    if (paymentResult.success && paymentResult.data) {
      setPayments(paymentResult.data);
    }

    setIsLoading(false);
  };

  // Calculate stats from real data
  const totalBalance = accounts
    .filter((acc) => acc.type !== 'credit_card')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalDebt = accounts
    .filter((acc) => acc.type === 'credit_card')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const netWorth = totalBalance - totalDebt;

  const stats = [
    {
      label: 'Net Worth',
      value: netWorth,
      change: 0, // We don't have historical data yet
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Total Balance',
      value: totalBalance,
      change: 0,
      trend: 'up',
      icon: Wallet,
      color: 'text-blue-600',
    },
    {
      label: 'Total Debt',
      value: totalDebt,
      change: 0,
      trend: 'down',
      icon: CreditCard,
      color: 'text-red-600',
    },
  ];

  // Get recent transactions (already limited to 5)
  const recentTransactions = transactions.slice(0, 5);

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => {
      const category = tx.category || 'Other';
      acc[category] = (acc[category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const spendingData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value: Math.abs(value),
    color: spendingColors[name] || '#6B7280',
  }));

  // Placeholder data for charts (would need historical data from backend)
  const balanceTrendData = [
    { month: 'Current', balance: totalBalance },
  ];

  const netWorthData = [
    { month: 'Current', netWorth: netWorth },
  ];
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={balanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Net Worth Area Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Worth Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={netWorthData}>
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              />
              <Area type="monotone" dataKey="netWorth" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
                      account.type === 'savings' ? 'bg-green-500' :
                      account.type === 'investment' ? 'bg-purple-500' :
                      account.type === 'credit_card' ? 'bg-orange-500' :
                      'bg-gray-500'
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
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
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
        </>
      )}
    </div>
  );
}
