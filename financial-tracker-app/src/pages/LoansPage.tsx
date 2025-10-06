import { Plus, Edit2, Trash2, Home, Car, CreditCard, GraduationCap, DollarSign, TrendingDown, Calendar, Percent, FileText, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { LoanService } from '../services/data/LoanService';
import type { Loan, LoanType } from '../models/Loan';
import { CardSkeleton } from '../components/common/Skeletons';

const loanTypeConfig: Record<LoanType, { icon: any; color: string; label: string }> = {
  mortgage: { icon: Home, color: 'bg-blue-100 text-blue-600', label: 'Mortgage' },
  auto: { icon: Car, color: 'bg-green-100 text-green-600', label: 'Auto Loan' },
  personal: { icon: DollarSign, color: 'bg-purple-100 text-purple-600', label: 'Personal Loan' },
  student: { icon: GraduationCap, color: 'bg-orange-100 text-orange-600', label: 'Student Loan' },
  other: { icon: FileText, color: 'bg-gray-100 text-gray-600', label: 'Other Loan' },
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [summary, setSummary] = useState({
    totalDebt: 0,
    totalMonthlyPayment: 0,
    totalInterestPaid: 0,
    loanCount: 0,
    activeLoans: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    loanType: 'personal' as LoanType,
    principal: '',
    interestRate: '',
    termMonths: '',
    startDate: new Date().toISOString().split('T')[0],
    lender: '',
    notes: '',
  });

  useEffect(() => {
    loadLoans();
  }, [selectedType]);

  const loadLoans = async () => {
    setIsLoading(true);
    const result = await LoanService.getLoans(selectedType || undefined);
    
    if (result.success && result.data) {
      setLoans(result.data.loans);
      setSummary(result.data.summary);
    } else {
      toast.error(result.error || 'Failed to load loans');
    }
    setIsLoading(false);
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();

    const loanInput = {
      name: formData.name,
      loanType: formData.loanType,
      principal: parseFloat(formData.principal),
      interestRate: parseFloat(formData.interestRate) / 100, // Convert percentage to decimal
      termMonths: parseInt(formData.termMonths),
      startDate: new Date(formData.startDate),
      lender: formData.lender || undefined,
      notes: formData.notes || undefined,
    };

    const result = await LoanService.createLoan(loanInput);

    if (result.success) {
      toast.success('Loan added successfully! 🎉');
      setIsAddModalOpen(false);
      resetForm();
      loadLoans();
    } else {
      toast.error(result.error || 'Failed to add loan');
    }
  };

  const handleUpdateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const updates = {
      name: formData.name,
      loanType: formData.loanType,
      principal: parseFloat(formData.principal),
      interestRate: parseFloat(formData.interestRate) / 100,
      termMonths: parseInt(formData.termMonths),
      startDate: new Date(formData.startDate),
      lender: formData.lender || undefined,
      notes: formData.notes || undefined,
    };

    const result = await LoanService.updateLoan(selectedLoan.id, updates);

    if (result.success) {
      toast.success('Loan updated successfully!');
      setIsEditModalOpen(false);
      setSelectedLoan(null);
      resetForm();
      loadLoans();
    } else {
      toast.error(result.error || 'Failed to update loan');
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan? This action cannot be undone.')) {
      return;
    }

    const result = await LoanService.deleteLoan(loanId);

    if (result.success) {
      toast.success('Loan deleted successfully');
      loadLoans();
    } else {
      toast.error(result.error || 'Failed to delete loan');
    }
  };

  const openEditModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setFormData({
      name: loan.name,
      loanType: loan.loanType,
      principal: loan.principal.toString(),
      interestRate: (loan.interestRate * 100).toString(), // Convert decimal to percentage
      termMonths: loan.termMonths.toString(),
      startDate: new Date(loan.startDate).toISOString().split('T')[0],
      lender: loan.lender || '',
      notes: loan.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      loanType: 'personal',
      principal: '',
      interestRate: '',
      termMonths: '',
      startDate: new Date().toISOString().split('T')[0],
      lender: '',
      notes: '',
    });
  };

  const calculateProgress = (loan: Loan) => {
    if (loan.principal === 0) return 100;
    return Math.round(((loan.principal - loan.remainingBalance) / loan.principal) * 100);
  };

  const filteredLoans = selectedType
    ? loans.filter(loan => loan.loanType === selectedType)
    : loans;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your loans and track debt payoff</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          Add Loan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Debt</span>
            <TrendingDown className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalDebt)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{summary.activeLoans} active loans</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment</span>
            <Calendar className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalMonthlyPayment)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Combined payments</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Interest Paid</span>
            <Percent className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalInterestPaid)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total interest</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Loans</span>
            <FileText className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.loanCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All loans</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            selectedType === null
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All Loans
        </button>
        {Object.entries(loanTypeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Loans List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No loans</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding a new loan.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add Loan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLoans.map((loan) => {
            const config = loanTypeConfig[loan.loanType];
            const Icon = config.icon;
            const progress = calculateProgress(loan);

            return (
              <div
                key={loan.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDetailsModal(loan)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${config.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{loan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{config.label}</p>
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(loan)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLoan(loan.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Balance Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remaining Balance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(loan.remainingBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Original Amount</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(loan.principal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Payment</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(loan.monthlyPayment)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{progress}% paid</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Interest Rate: </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(loan.interestRate * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    View Details
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Loan Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedLoan(null);
          resetForm();
        }}
        title={isEditModalOpen ? 'Edit Loan' : 'Add New Loan'}
      >
        <form onSubmit={isEditModalOpen ? handleUpdateLoan : handleAddLoan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loan Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Home Mortgage, Car Loan"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loan Type *
            </label>
            <select
              required
              value={formData.loanType}
              onChange={(e) => setFormData({ ...formData, loanType: e.target.value as LoanType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(loanTypeConfig).map(([type, config]) => (
                <option key={type} value={type}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Amount * ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                placeholder="200000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate * (%)
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="5.25"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Term (Months) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.termMonths}
                onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                placeholder="360"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.termMonths ? `${Math.floor(parseInt(formData.termMonths) / 12)} years ${parseInt(formData.termMonths) % 12} months` : ''}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lender
            </label>
            <input
              type="text"
              value={formData.lender}
              onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
              placeholder="e.g., Bank of America"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information about this loan..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedLoan(null);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {isEditModalOpen ? 'Update Loan' : 'Add Loan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Loan Details Modal - To be implemented in next step */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedLoan(null);
        }}
        title="Loan Details"
      >
        <div className="text-center py-8 text-gray-500">
          Loan details view coming soon...
        </div>
      </Modal>
    </div>
  );
}
