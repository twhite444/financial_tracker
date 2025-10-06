import { TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DebtProgressWidgetProps {
  totalPrincipal: number;
  remainingDebt: number;
  totalInterestPaid: number;
  estimatedPayoffMonths: number;
}

export default function DebtProgressWidget({
  totalPrincipal,
  remainingDebt,
  totalInterestPaid,
  estimatedPayoffMonths,
}: DebtProgressWidgetProps) {
  const paidOff = totalPrincipal - remainingDebt;
  const progressPercent = totalPrincipal > 0 ? (paidOff / totalPrincipal) * 100 : 0;

  const chartData = [
    { name: 'Paid', value: paidOff, color: '#10B981' },
    { name: 'Remaining', value: remainingDebt, color: '#EF4444' },
  ];

  const estimatedPayoffDate = new Date();
  estimatedPayoffDate.setMonth(estimatedPayoffDate.getMonth() + estimatedPayoffMonths);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="text-emerald-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Debt Progress</h3>
      </div>

      {totalPrincipal === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No debt to track</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {progressPercent.toFixed(1)}% paid
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Paid: {formatCurrency(paidOff)}</span>
              <span>Left: {formatCurrency(remainingDebt)}</span>
            </div>
          </div>

          {/* Debt Breakdown Chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <DollarSign size={14} />
                <span className="text-xs">Interest Paid</span>
              </div>
              <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                {formatCurrency(totalInterestPaid)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Calendar size={14} />
                <span className="text-xs">Est. Payoff</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {estimatedPayoffMonths > 0
                  ? estimatedPayoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'Paid Off'}
              </p>
            </div>
          </div>

          {/* Motivational Message */}
          {progressPercent > 0 && progressPercent < 100 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                <strong>🎯 Keep Going!</strong> You've paid off {progressPercent.toFixed(0)}% of your debt.
                {estimatedPayoffMonths > 0 && estimatedPayoffMonths <= 12 && (
                  <span> You're on track to be debt-free in less than a year!</span>
                )}
              </p>
            </div>
          )}

          {progressPercent === 100 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>🎉 Congratulations!</strong> You've paid off all your tracked debt!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
