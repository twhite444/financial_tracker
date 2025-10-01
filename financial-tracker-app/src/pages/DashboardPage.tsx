import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Balance trend data (last 6 months)
const balanceTrendData = [
  { month: 'Apr', balance: 58000 },
  { month: 'May', balance: 61500 },
  { month: 'Jun', balance: 59800 },
  { month: 'Jul', balance: 63200 },
  { month: 'Aug', balance: 62000 },
  { month: 'Sep', balance: 65000 },
];

// Spending by category data
const spendingData = [
  { name: 'Groceries', value: 450, color: '#3B82F6' },
  { name: 'Dining', value: 320, color: '#F59E0B' },
  { name: 'Transportation', value: 180, color: '#10B981' },
  { name: 'Utilities', value: 250, color: '#6366F1' },
  { name: 'Entertainment', value: 150, color: '#EC4899' },
  { name: 'Shopping', value: 280, color: '#8B5CF6' },
];

// Net worth trend data
const netWorthData = [
  { month: 'Apr', netWorth: 75000 },
  { month: 'May', netWorth: 78500 },
  { month: 'Jun', netWorth: 80200 },
  { month: 'Jul', netWorth: 83000 },
  { month: 'Aug', netWorth: 85500 },
  { month: 'Sep', netWorth: 87500 },
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
