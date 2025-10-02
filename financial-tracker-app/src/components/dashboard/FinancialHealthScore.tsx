import { TrendingUp, DollarSign, CreditCard, Calendar } from 'lucide-react';
import { Account } from '../../models/Account';
import { Transaction } from '../../models/Transaction';
import { PaymentReminder } from '../../models/PaymentReminder';

interface FinancialHealthScoreProps {
  accounts: Account[];
  transactions: Transaction[];
  payments: PaymentReminder[];
}

export default function FinancialHealthScore({ accounts, transactions, payments }: FinancialHealthScoreProps) {
  // Calculate Financial Health Score (0-100)
  const calculateScore = () => {
    let score = 0;
    const factors = [];

    // 1. Savings Rate (30 points)
    const totalBalance = accounts
      .filter(acc => acc.type !== 'credit_card')
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const monthlyIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0) / 3; // Average over 3 months
    
    const savingsRate = monthlyIncome > 0 ? (totalBalance / monthlyIncome) * 100 : 0;
    const savingsScore = Math.min(30, (savingsRate / 300) * 30); // Cap at 30 points
    score += savingsScore;
    factors.push({
      label: 'Savings Rate',
      score: Math.round(savingsScore),
      max: 30,
      icon: DollarSign,
      color: savingsScore > 20 ? 'text-green-600' : savingsScore > 10 ? 'text-yellow-600' : 'text-red-600',
    });

    // 2. Debt-to-Income Ratio (25 points)
    const totalDebt = accounts
      .filter(acc => acc.type === 'credit_card')
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const debtToIncome = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0;
    const debtScore = Math.max(0, 25 - (debtToIncome / 4)); // Lower debt = higher score
    score += debtScore;
    factors.push({
      label: 'Debt Management',
      score: Math.round(debtScore),
      max: 25,
      icon: CreditCard,
      color: debtScore > 18 ? 'text-green-600' : debtScore > 10 ? 'text-yellow-600' : 'text-red-600',
    });

    // 3. Credit Utilization (25 points)
    const creditCards = accounts.filter(acc => acc.type === 'credit_card');
    const avgUtilization = creditCards.length > 0
      ? creditCards.reduce((sum, acc) => 
          sum + ((acc.creditLimit ? (acc.balance / acc.creditLimit) * 100 : 0)), 0
        ) / creditCards.length
      : 0;
    
    const utilizationScore = Math.max(0, 25 - (avgUtilization / 4)); // Lower utilization = higher score
    score += utilizationScore;
    factors.push({
      label: 'Credit Utilization',
      score: Math.round(utilizationScore),
      max: 25,
      icon: CreditCard,
      color: utilizationScore > 18 ? 'text-green-600' : utilizationScore > 10 ? 'text-yellow-600' : 'text-red-600',
    });

    // 4. Payment History (20 points)
    const paidPayments = payments.filter(p => p.isPaid).length;
    const totalPayments = payments.length;
    const paymentScore = totalPayments > 0 ? (paidPayments / totalPayments) * 20 : 20;
    score += paymentScore;
    factors.push({
      label: 'Payment History',
      score: Math.round(paymentScore),
      max: 20,
      icon: Calendar,
      color: paymentScore > 15 ? 'text-green-600' : paymentScore > 10 ? 'text-yellow-600' : 'text-red-600',
    });

    return {
      total: Math.round(score),
      factors,
    };
  };

  const { total, factors } = calculateScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Financial Health Score</h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      {/* Circular Score Display */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - total / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`${getScoreGradient(total).split(' ')[0].replace('from-', 'text-')}`} style={{ stopColor: 'currentColor' }} />
                <stop offset="100%" className={`${getScoreGradient(total).split(' ')[1].replace('to-', 'text-')}`} style={{ stopColor: 'currentColor' }} />
              </linearGradient>
            </defs>
          </svg>
          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(total)} dark:opacity-90`}>{total}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">out of 100</span>
          </div>
        </div>
      </div>

      {/* Score Label */}
      <div className="text-center mb-6">
        <p className={`text-xl font-semibold ${getScoreColor(total)} dark:opacity-90`}>
          {getScoreLabel(total)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Your financial health is {getScoreLabel(total).toLowerCase()}
        </p>
      </div>

      {/* Factors Breakdown */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Score Breakdown</h4>
        {factors.map((factor) => {
          const Icon = factor.icon;
          const percentage = (factor.score / factor.max) * 100;
          
          return (
            <div key={factor.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${factor.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{factor.label}</span>
                </div>
                <span className={`font-medium ${factor.color}`}>
                  {factor.score}/{factor.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(factor.score)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {total < 80 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tips to Improve</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {factors.filter(f => f.score < f.max * 0.7).slice(0, 2).map((factor) => (
              <li key={factor.label} className="flex items-start gap-2">
                <span className="text-accent-blue mt-0.5">•</span>
                <span>Work on improving your {factor.label.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
