import { Plus, Calendar, Check, Clock, AlertCircle, Repeat, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import Modal from '../components/common/Modal';
import { PaymentService } from '../services/data/PaymentService';
import { AccountService } from '../services/data/AccountService';
import { PaymentReminder } from '../models/PaymentReminder';
import { Account } from '../models/Account';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentReminder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    recurring: false,
    frequency: 'monthly' as PaymentReminder['frequency'],
    accountId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [paymentResult, accResult] = await Promise.all([
      PaymentService.getPaymentReminders(),
      AccountService.getAccounts()
    ]);

    if (paymentResult.success && paymentResult.data) {
      setPayments(paymentResult.data);
    } else {
      setError(paymentResult.error || 'Failed to load payments');
    }

    if (accResult.success && accResult.data) {
      setAccounts(accResult.data);
    }

    setIsLoading(false);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPaymentsForDate = (date: Date) => {
    return payments.filter((payment) => isSameDay(new Date(payment.dueDate), date));
  };

  const upcomingPayments = payments
    .filter((p) => !p.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const totalDue = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  const isPastDue = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) && !isToday(date);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Calendar</h1>
          <p className="text-gray-600 mt-1">Track and manage upcoming payment due dates</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Reminder
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
      ) : (
        <>
          {/* Summary Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Due This Month</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalDue)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Upcoming Payments</p>
            <p className="text-3xl font-bold text-orange-600">{upcomingPayments.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {daysInMonth.map((day) => {
                const payments = getPaymentsForDate(day);
                const hasPayments = payments.length > 0;
                const isPast = isPastDue(day);
                const today = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-2 rounded-lg border-2 transition-all relative
                      ${today ? 'border-accent-blue bg-accent-blue/10' : 'border-transparent'}
                      ${hasPayments && !today ? 'bg-orange-50 border-orange-200' : ''}
                      ${!hasPayments && !today ? 'hover:bg-white/50' : ''}
                      ${selectedDate && isSameDay(selectedDate, day) ? 'ring-2 ring-accent-blue' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span
                        className={`text-sm font-medium ${
                          today ? 'text-accent-blue' : 'text-gray-700'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {hasPayments && (
                        <div className="mt-1 flex flex-col gap-1">
                          {payments.slice(0, 2).map((payment) => (
                            <div
                              key={payment._id || payment.id}
                              className={`
                                h-1 w-full rounded-full
                                ${payment.isPaid ? 'bg-green-400' : ''}
                                ${!payment.isPaid && isPast ? 'bg-red-500' : ''}
                                ${!payment.isPaid && !isPast ? 'bg-orange-400' : ''}
                              `}
                            />
                          ))}
                          {payments.length > 2 && (
                            <span className="text-xs text-gray-500">+{payments.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-400" />
                <span className="text-sm text-gray-600">Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Past Due</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payments List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Payments</h3>
          <div className="space-y-3">
            {upcomingPayments.map((payment) => {
              const isPast = isPastDue(new Date(payment.dueDate));
              return (
                <div
                  key={payment._id || payment.id}
                  className={`glass-card-hover p-4 ${
                    isPast ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{payment.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(new Date(payment.dueDate))}
                        {isPast && (
                          <span className="text-red-600 font-medium ml-1">(Overdue)</span>
                        )}
                      </p>
                    </div>
                    {payment.recurring && (
                      <Repeat className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <button 
                      onClick={async () => {
                        const result = await PaymentService.markPaymentAsPaid(payment._id || payment.id!);
                        if (result.success) {
                          toast.success('Payment marked as paid!');
                          await loadData();
                        } else {
                          const errorMsg = result.error || 'Failed to mark payment as paid';
                          setError(errorMsg);
                          toast.error(errorMsg);
                        }
                      }}
                      className="glass-button text-sm flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Mark Paid
                    </button>
                  </div>
                </div>
              );
            })}

            {upcomingPayments.length === 0 && (
              <div className="glass-card p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming payments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Payment Reminder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            title: '',
            amount: '',
            dueDate: '',
            recurring: false,
            frequency: 'monthly',
            accountId: accounts[0]?._id || accounts[0]?.id || '',
          });
        }}
        title="Add Payment Reminder"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const paymentData: Omit<PaymentReminder, '_id' | 'id'> = {
              title: formData.title,
              amount: parseFloat(formData.amount),
              dueDate: formData.dueDate,
              recurring: formData.recurring,
              frequency: formData.recurring ? formData.frequency : undefined,
              accountId: formData.accountId,
              isPaid: false,
            };

            const result = await PaymentService.createPaymentReminder(paymentData);
            if (result.success) {
              toast.success('Payment reminder created successfully!');
              await loadData();
              setIsAddModalOpen(false);
              setFormData({
                title: '',
                amount: '',
                dueDate: '',
                recurring: false,
                frequency: 'monthly',
                accountId: accounts[0]?._id || accounts[0]?.id || '',
              });
            } else {
              const errorMsg = result.error || 'Failed to create payment reminder';
              setError(errorMsg);
              toast.error(errorMsg);
            }
          }}
          className="space-y-6"
        >
          {/* Payment Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Capital One Credit Card"
              className="glass-input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
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
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="glass-input pl-8"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="glass-input"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account *
            </label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="glass-input"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account._id || account.id} value={account._id || account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              className="h-4 w-4 text-accent-blue focus:ring-accent-blue border-gray-300 rounded"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              This is a recurring payment
            </label>
          </div>

          {/* Frequency (only if recurring) */}
          {formData.recurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as PaymentReminder['frequency'] })}
                className="glass-input"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
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
              Add Reminder
            </button>
          </div>
        </form>
      </Modal>
        </>
      )}
    </div>
  );
}
