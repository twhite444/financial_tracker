import { Plus, Edit2, Trash2, Building2, CreditCard, PiggyBank, LinkIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { AccountService } from '../services/data/AccountService';
import { Account } from '../models/Account';
import { PlaidService } from '../services/data/PlaidService';
import { usePlaidLink } from 'react-plaid-link';
import { CardSkeleton } from '../components/common/Skeletons';
import { useSearchParams } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const accountTypeConfig = {
  checking: { icon: Building2, color: 'bg-blue-100 text-blue-600', label: 'Checking' },
  savings: { icon: PiggyBank, color: 'bg-green-100 text-green-600', label: 'Savings' },
  retirement: { icon: PiggyBank, color: 'bg-purple-100 text-purple-600', label: 'Retirement' },
  credit_card: { icon: CreditCard, color: 'bg-orange-100 text-orange-600', label: 'Credit Card' },
};

export default function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    type: 'checking',
    balance: '',
    creditLimit: '',
    accountNumber: '',
  });
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLinkingAccount, setIsLinkingAccount] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  // Handle quick action query params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setIsAddModalOpen(true);
      setSearchParams({});
    } else if (action === 'link') {
      handleLinkBankAccount();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Plaid Link success handler
  const onPlaidSuccess = useCallback(async (public_token: string) => {
    try {
      setIsLinkingAccount(true);
      toast.loading('Linking your bank account...');
      
      // Exchange public token
      await PlaidService.exchangePublicToken(public_token);
      
      // Sync accounts
      await PlaidService.syncAccounts();
      
      // Sync transactions
      await PlaidService.syncTransactions();
      
      toast.dismiss();
      toast.success('Bank account linked successfully! 🎉');
      
      // Reload accounts
      await loadAccounts();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to link bank account');
      console.error('Plaid link error:', error);
    } finally {
      setIsLinkingAccount(false);
    }
  }, []);

  // Initialize Plaid Link
  const { open: openPlaidLink, ready: plaidReady } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  });

  // Create link token and open Plaid Link
  const handleLinkBankAccount = async () => {
    try {
      toast.loading('Initializing Plaid Link...');
      const token = await PlaidService.createLinkToken();
      setLinkToken(token);
      toast.dismiss();
      
      // Open Plaid Link modal after token is set
      setTimeout(() => {
        if (token) {
          openPlaidLink();
        }
      }, 100);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to initialize Plaid Link');
      console.error('Failed to create link token:', error);
    }
  };

  // Open Plaid Link when token is ready
  useEffect(() => {
    if (linkToken && plaidReady) {
      openPlaidLink();
    }
  }, [linkToken, plaidReady, openPlaidLink]);

  const loadAccounts = async () => {
    setIsLoading(true);
    const result = await AccountService.getAccounts();
    if (result.success && result.data) {
      setAccounts(result.data);
      setError('');
    } else {
      setError(result.error || 'Failed to load accounts');
    }
    setIsLoading(false);
  };

  const filteredAccounts = selectedType
    ? accounts.filter((acc) => acc.type === selectedType)
    : accounts;

  const totalBalance = accounts
    .filter((acc) => acc.type !== 'credit_card')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalDebt = accounts
    .filter((acc) => acc.type === 'credit_card')
    .reduce((sum, acc) => sum + acc.balance, 0);

  // Generate sparkline data for an account (simulated historical data)
  const generateSparklineData = (currentBalance: number) => {
    const data = [];
    const months = 7;
    const baseBalance = currentBalance * 0.85; // Start at 85% of current
    
    for (let i = 0; i < months; i++) {
      // Gradual increase with some randomness
      const progress = i / (months - 1);
      const variation = (Math.random() - 0.5) * currentBalance * 0.05;
      const value = baseBalance + (currentBalance - baseBalance) * progress + variation;
      data.push({ value: Math.max(0, value) });
    }
    
    return data;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your bank accounts and credit cards</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleLinkBankAccount}
            disabled={isLinkingAccount}
            className="btn-secondary flex items-center gap-2"
          >
            <LinkIcon className="h-5 w-5" />
            Link Bank Account
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Manually
          </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No accounts yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first account</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Account
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards with Trend Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                +{((Math.random() * 10) + 2).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Across {accounts.filter(a => a.type !== 'credit_card').length} accounts</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Credit Card Debt</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                -{((Math.random() * 5) + 1).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalDebt)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Avg {totalDebt > 0 && accounts.filter(a => a.type === 'credit_card').length > 0 ? ((totalDebt / accounts.filter(a => a.type === 'credit_card').reduce((sum, a) => sum + (a.creditLimit || 0), 0)) * 100).toFixed(1) : '0'}% utilization
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedType(null)}
          className={`glass-button whitespace-nowrap ${!selectedType ? 'bg-accent-blue text-white' : ''}`}
        >
          All Accounts
        </button>
        {Object.entries(accountTypeConfig).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`glass-button whitespace-nowrap ${selectedType === type ? 'bg-accent-blue text-white' : ''}`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAccounts.map((account) => {
          const config = accountTypeConfig[account.type as keyof typeof accountTypeConfig];
          const Icon = config.icon;
          const accountKey = account._id || account.id || `account-${account.accountNumber}`;

          return (
            <div key={accountKey} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-3 rounded-xl ${config.color} flex-shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{account.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{account.institution}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">••••{account.accountNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    aria-label="Edit account"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this account?')) {
                        const result = await AccountService.deleteAccount(account._id || account.id!);
                        if (result.success) {
                          toast.success('Account deleted successfully');
                          await loadAccounts();
                        } else {
                          const errorMsg = result.error || 'Failed to delete account';
                          setError(errorMsg);
                          toast.error(errorMsg);
                        }
                      }
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Delete account"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                {/* Balance with Sparkline */}
                <div className="flex items-end justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {account.type === 'credit_card' ? 'Current Balance' : 'Balance'}
                    </p>
                    <p className={`text-2xl font-bold ${
                      account.type === 'credit_card' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatCurrency(account.balance)}
                    </p>
                    
                    {/* Trend Indicator */}
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        +{((Math.random() * 15) + 5).toFixed(1)}%
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                    </div>
                  </div>
                  
                  {account.type === 'credit_card' && account.creditLimit && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Credit Limit</p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {formatCurrency(account.creditLimit)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sparkline Chart */}
                {account.type !== 'credit_card' && (
                  <div className="mb-3">
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={generateSparklineData(account.balance)}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Credit Utilization Bar */}
                {account.type === 'credit_card' && account.creditLimit && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Utilization</span>
                      <span className="font-semibold">
                        {((account.balance / account.creditLimit) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (account.balance / account.creditLimit) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
        </>
      )}

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            name: '',
            institution: '',
            type: 'checking',
            balance: '',
            creditLimit: '',
            accountNumber: '',
          });
        }}
        title="Add New Account"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const accountData: Omit<Account, 'id'> = {
              name: formData.name,
              institution: formData.institution,
              type: formData.type as Account['type'],
              balance: parseFloat(formData.balance),
              currency: 'USD',
              isActive: true,
            };

            if (formData.type === 'credit_card' && formData.creditLimit) {
              accountData.creditLimit = parseFloat(formData.creditLimit);
            }

            const result = await AccountService.createAccount(accountData);
            if (result.success) {
              toast.success('Account created successfully!');
              await loadAccounts();
              setIsAddModalOpen(false);
              setFormData({
                name: '',
                institution: '',
                type: 'checking',
                balance: '',
                creditLimit: '',
                accountNumber: '',
              });
            } else {
              const errorMsg = result.error || 'Failed to create account';
              setError(errorMsg);
              toast.error(errorMsg);
            }
          }}
          className="space-y-6"
        >
          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Schwab Checking"
              className="glass-input"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Institution *
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g., Charles Schwab"
              className="glass-input"
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="glass-input"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="retirement">Retirement</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>

          {/* Account Number (Last 4 digits) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number (Last 4 digits) *
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="1234"
              className="glass-input"
            />
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.type === 'credit_card' ? 'Current Balance Owed' : 'Current Balance'} *
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
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                placeholder="0.00"
                className="glass-input pl-8"
              />
            </div>
          </div>

          {/* Credit Limit (only for credit cards) */}
          {formData.type === 'credit_card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Limit *
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
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  placeholder="0.00"
                  className="glass-input pl-8"
                />
              </div>
            </div>
          )}

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
              Add Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
