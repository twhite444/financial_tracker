import { Plus, Edit2, Trash2, Building2, CreditCard, PiggyBank, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { AccountService } from '../services/data/AccountService';
import { Account } from '../models/Account';

const accountTypeConfig = {
  checking: { icon: Building2, color: 'bg-blue-100 text-blue-600', label: 'Checking' },
  savings: { icon: PiggyBank, color: 'bg-green-100 text-green-600', label: 'Savings' },
  retirement: { icon: PiggyBank, color: 'bg-purple-100 text-purple-600', label: 'Retirement' },
  credit_card: { icon: CreditCard, color: 'bg-orange-100 text-orange-600', label: 'Credit Card' },
};

export default function AccountsPage() {
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

  useEffect(() => {
    loadAccounts();
  }, []);

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your bank accounts and credit cards</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Account
        </button>
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
      ) : accounts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first account</p>
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
          {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-gray-500 mt-2">Across all accounts</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600 mb-1">Total Credit Card Debt</p>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
          <p className="text-sm text-gray-500 mt-2">
            {((totalDebt / 37000) * 100).toFixed(1)}% utilization
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

          return (
            <div key={account.id} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl ${config.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">{account.institution}</p>
                    <p className="text-xs text-gray-400 mt-1">{account.accountNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4 text-gray-600" />
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
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {account.type === 'credit_card' ? 'Current Balance' : 'Balance'}
                    </p>
                    <p className={`text-2xl font-bold ${
                      account.type === 'credit_card' ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  {account.type === 'credit_card' && account.creditLimit && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatCurrency(account.creditLimit)}
                      </p>
                    </div>
                  )}
                </div>

                {account.type === 'credit_card' && account.creditLimit && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Utilization</span>
                      <span className="font-medium">
                        {((account.balance / account.creditLimit) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all"
                        style={{ width: `${(account.balance / account.creditLimit) * 100}%` }}
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
