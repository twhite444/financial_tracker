import { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Percent, 
  TrendingDown, 
  Download, 
  Calculator,
  Clock,
  Building2,
  FileText,
  X
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { Loan, AmortizationEntry } from '../../models/Loan';
import { 
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculatePayoffDate,
  calculateExtraPaymentImpact,
  generateAmortizationSchedule
} from '../../models/Loan';
import { LoanService } from '../../services/data/LoanService';
import toast from 'react-hot-toast';

interface LoanDetailsModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
}

export default function LoanDetailsModal({ loan, isOpen, onClose }: LoanDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'calculator'>('overview');
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [extraPayment, setExtraPayment] = useState<string>('');
  const [extraPaymentImpact, setExtraPaymentImpact] = useState<{
    monthsSaved: number;
    interestSaved: number;
    newPayoffDate: Date;
  } | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'schedule') {
      loadAmortizationSchedule();
    }
  }, [isOpen, activeTab, loan.id]);

  useEffect(() => {
    if (extraPayment && parseFloat(extraPayment) > 0) {
      calculateExtraPaymentEffect();
    } else {
      setExtraPaymentImpact(null);
    }
  }, [extraPayment, loan]);

  const loadAmortizationSchedule = async () => {
    setIsLoadingSchedule(true);
    const result = await LoanService.getAmortizationSchedule(loan.id);
    
    if (result.success && result.data) {
      setAmortizationSchedule(result.data.schedule);
    } else {
      toast.error(result.error || 'Failed to load amortization schedule');
    }
    setIsLoadingSchedule(false);
  };

  const calculateExtraPaymentEffect = () => {
    const extra = parseFloat(extraPayment);
    if (isNaN(extra) || extra <= 0) {
      setExtraPaymentImpact(null);
      return;
    }

    const impact = calculateExtraPaymentImpact(
      loan.principal,
      loan.interestRate,
      loan.termMonths,
      extra
    );

    // Calculate new payoff date from months
    const newPayoffDate = new Date();
    newPayoffDate.setMonth(newPayoffDate.getMonth() + impact.newPayoffMonths);

    setExtraPaymentImpact({
      monthsSaved: impact.monthsSaved,
      interestSaved: impact.interestSaved,
      newPayoffDate,
    });
  };

  const exportScheduleToCSV = () => {
    if (amortizationSchedule.length === 0) {
      toast.error('No schedule data to export');
      return;
    }

    const headers = ['Payment #', 'Date', 'Payment Amount', 'Principal', 'Interest', 'Remaining Balance'];
    const rows = amortizationSchedule.map(entry => [
      entry.paymentNumber,
      new Date(entry.paymentDate).toLocaleDateString(),
      entry.paymentAmount.toFixed(2),
      entry.principalPaid.toFixed(2),
      entry.interestPaid.toFixed(2),
      entry.remainingBalance.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${loan.name.replace(/\s+/g, '_')}_amortization_schedule.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Schedule exported successfully!');
  };

  const totalInterest = calculateTotalInterest(loan.principal, loan.interestRate, loan.termMonths);
  const payoffDate = calculatePayoffDate(
    loan.remainingBalance,
    loan.monthlyPayment,
    loan.interestRate,
    new Date()
  );
  const progressPercent = ((loan.principal - loan.remainingBalance) / loan.principal) * 100;
  const termYears = Math.floor(loan.termMonths / 12);
  const termRemainingMonths = loan.termMonths % 12;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {loan.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'schedule'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Amortization Schedule
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'calculator'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Extra Payment Calculator
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <DollarSign size={18} />
                      <span className="text-sm">Original Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(loan.principal)}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <TrendingDown size={18} />
                      <span className="text-sm">Remaining Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(loan.remainingBalance)}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Calendar size={18} />
                      <span className="text-sm">Monthly Payment</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(loan.monthlyPayment)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Loan Progress
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {progressPercent.toFixed(1)}% paid
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Paid: {formatCurrency(loan.totalPaid)}</span>
                    <span>Remaining: {formatCurrency(loan.remainingBalance)}</span>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Loan Information</h4>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Loan Type</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {loan.loanType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {(loan.interestRate * 100).toFixed(2)}% APR
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Term</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {termYears > 0 && `${termYears} year${termYears > 1 ? 's' : ''}`}
                        {termRemainingMonths > 0 && ` ${termRemainingMonths} month${termRemainingMonths > 1 ? 's' : ''}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(loan.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    {loan.lender && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Building2 size={14} />
                          Lender
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {loan.lender}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Payment Details</h4>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Paid</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(loan.totalPaid)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Interest Paid</span>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        {formatCurrency(loan.interestPaid)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest (Life of Loan)</span>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        {formatCurrency(totalInterest)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Next Payment</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(loan.nextPaymentDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Payoff</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {payoffDate.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        loan.status === 'paid_off' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {loan.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {loan.notes && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                      <FileText size={18} />
                      <span className="font-medium">Notes</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {loan.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Full Amortization Schedule ({loan.termMonths} payments)
                  </h4>
                  <button
                    onClick={exportScheduleToCSV}
                    disabled={amortizationSchedule.length === 0}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>

                {isLoadingSchedule ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading schedule...</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Payment
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Principal
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Interest
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {amortizationSchedule.map((entry) => (
                            <tr key={entry.paymentNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {entry.paymentNumber}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {new Date(entry.paymentDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                {formatCurrency(entry.paymentAmount)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(entry.principalPaid)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-orange-600 dark:text-orange-400">
                                {formatCurrency(entry.interestPaid)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                                {formatCurrency(entry.remainingBalance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="text-emerald-600" size={24} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Extra Payment Calculator
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    See how much you can save by making extra payments each month.
                  </p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Extra Monthly Payment
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {extraPaymentImpact && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-emerald-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-emerald-600" size={20} />
                          <span className="font-medium text-gray-900 dark:text-white">Time Saved</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                          {extraPaymentImpact.monthsSaved} months
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          New payoff date: {extraPaymentImpact.newPayoffDate.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-600">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="text-blue-600" size={20} />
                          <span className="font-medium text-gray-900 dark:text-white">Interest Saved</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(extraPaymentImpact.interestSaved)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Total savings over life of loan
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>💡 Pro Tip:</strong> By paying an extra {formatCurrency(parseFloat(extraPayment))} per month, 
                          you'll pay off your loan {extraPaymentImpact.monthsSaved} months early and save {formatCurrency(extraPaymentImpact.interestSaved)} in interest!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Current vs With Extra Payments Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">Current Plan</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Monthly Payment:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(loan.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Payoff Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{payoffDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Interest:</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">{formatCurrency(totalInterest)}</span>
                      </div>
                    </div>
                  </div>

                  {extraPaymentImpact && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                      <h5 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3">With Extra Payments</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-emerald-700 dark:text-emerald-300">Monthly Payment:</span>
                          <span className="font-medium text-emerald-900 dark:text-emerald-100">
                            {formatCurrency(loan.monthlyPayment + parseFloat(extraPayment))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-700 dark:text-emerald-300">Payoff Date:</span>
                          <span className="font-medium text-emerald-900 dark:text-emerald-100">
                            {extraPaymentImpact.newPayoffDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-700 dark:text-emerald-300">Total Interest:</span>
                          <span className="font-medium text-emerald-900 dark:text-emerald-100">
                            {formatCurrency(totalInterest - extraPaymentImpact.interestSaved)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
