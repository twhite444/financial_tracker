import { TrendingDown, Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface LoanSummaryWidgetProps {
  totalDebt: number;
  monthlyPayment: number;
  nextPaymentDate: Date | null;
  loanCount: number;
  activeLoans: number;
}

export default function LoanSummaryWidget({
  totalDebt,
  monthlyPayment,
  nextPaymentDate,
  loanCount,
  activeLoans,
}: LoanSummaryWidgetProps) {
  const navigate = useNavigate();

  const daysUntilPayment = nextPaymentDate
    ? Math.ceil((new Date(nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="text-red-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Summary</h3>
        </div>
        <button
          onClick={() => navigate('/loans')}
          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {loanCount === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No loans tracked yet</p>
          <button
            onClick={() => navigate('/loans')}
            className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Add your first loan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Total Debt */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Debt</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalDebt)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {activeLoans} active loan{activeLoans !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Monthly Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Payment</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>

            {/* Next Payment Due */}
            {nextPaymentDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Payment</p>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {daysUntilPayment !== null && daysUntilPayment <= 7 ? (
                      <span className="text-orange-600 dark:text-orange-400">
                        {daysUntilPayment === 0 ? 'Today' : daysUntilPayment === 1 ? 'Tomorrow' : `${daysUntilPayment} days`}
                      </span>
                    ) : (
                      <span>
                        {new Date(nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Alert if payment due soon */}
          {daysUntilPayment !== null && daysUntilPayment <= 3 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0" size={18} />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Payment Due Soon
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Don't forget to make your {formatCurrency(monthlyPayment)} payment
                  {daysUntilPayment === 0 ? ' today' : daysUntilPayment === 1 ? ' tomorrow' : ` in ${daysUntilPayment} days`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
