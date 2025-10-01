import { Plus, Calendar, Check, Clock, AlertCircle, Repeat } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

const mockPayments = [
  {
    id: '1',
    name: 'Capital One Quicksilver',
    amount: 150,
    dueDate: new Date(2024, 0, 15), // Jan 15
    recurring: true,
    frequency: 'monthly',
    status: 'pending',
    category: 'credit_card',
  },
  {
    id: '2',
    name: 'Discover it Cash Back',
    amount: 200,
    dueDate: new Date(2024, 0, 22), // Jan 22
    recurring: true,
    frequency: 'monthly',
    status: 'pending',
    category: 'credit_card',
  },
  {
    id: '3',
    name: 'Chase Sapphire Preferred',
    amount: 100,
    dueDate: new Date(2024, 0, 28), // Jan 28
    recurring: true,
    frequency: 'monthly',
    status: 'pending',
    category: 'credit_card',
  },
  {
    id: '4',
    name: 'Internet Bill',
    amount: 80,
    dueDate: new Date(2024, 0, 5), // Jan 5
    recurring: true,
    frequency: 'monthly',
    status: 'paid',
    category: 'utilities',
  },
  {
    id: '5',
    name: 'Phone Bill',
    amount: 65,
    dueDate: new Date(2024, 0, 10), // Jan 10
    recurring: true,
    frequency: 'monthly',
    status: 'paid',
    category: 'utilities',
  },
];

const categoryColors = {
  credit_card: 'bg-orange-100 text-orange-700 border-orange-200',
  utilities: 'bg-blue-100 text-blue-700 border-blue-200',
  subscription: 'bg-purple-100 text-purple-700 border-purple-200',
  insurance: 'bg-green-100 text-green-700 border-green-200',
};

export default function PaymentsPage() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPaymentsForDate = (date: Date) => {
    return mockPayments.filter((payment) => isSameDay(payment.dueDate, date));
  };

  const upcomingPayments = mockPayments
    .filter((p) => p.status === 'pending')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

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
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Reminder
        </button>
      </div>

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
                const hasPending = payments.some((p) => p.status === 'pending');
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
                              key={payment.id}
                              className={`
                                h-1 w-full rounded-full
                                ${payment.status === 'paid' ? 'bg-green-400' : ''}
                                ${payment.status === 'pending' && isPast ? 'bg-red-500' : ''}
                                ${payment.status === 'pending' && !isPast ? 'bg-orange-400' : ''}
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
              const isPast = isPastDue(payment.dueDate);
              return (
                <div
                  key={payment.id}
                  className={`glass-card-hover p-4 ${
                    isPast ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{payment.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(payment.dueDate)}
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
                    <button className="glass-button text-sm flex items-center gap-1">
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
    </div>
  );
}
