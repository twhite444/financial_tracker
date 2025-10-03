import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Activity, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  User,
  FileText,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { getAllHistory, getUserActivityStats, HistoryEntry, ActivityStatistics } from '../services/data/historyService';
import { formatDate, formatCurrency } from '../utils/formatUtils';
import AnimatedPage from '../components/common/AnimatedPage';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<ActivityStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    const result = await getAllHistory({
      limit,
      skip: (page - 1) * limit,
    });

    if (result.success && result.data) {
      setHistory(result.data.history);
      setTotalPages(result.data.totalPages);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const result = await getUserActivityStats(30);
    if (result.success && result.data) {
      setStats(result.data);
    }
  };

  const getActionIcon = (entry: HistoryEntry & { type?: string }) => {
    const action = entry.action;
    const type = entry.type;

    if (type === 'user_activity') {
      if (action.includes('login')) return <User className="w-4 h-4" />;
      if (action.includes('register')) return <Plus className="w-4 h-4" />;
      return <Activity className="w-4 h-4" />;
    }

    if (type === 'transaction') {
      if (action === 'created') return <Plus className="w-4 h-4 text-green-500" />;
      if (action === 'deleted') return <Trash2 className="w-4 h-4 text-red-500" />;
      return <Edit className="w-4 h-4 text-blue-500" />;
    }

    if (type === 'account') {
      if (action === 'balance_changed') return <DollarSign className="w-4 h-4 text-purple-500" />;
      if (action === 'activated') return <Check className="w-4 h-4 text-green-500" />;
      if (action === 'deactivated') return <X className="w-4 h-4 text-gray-500" />;
      return <CreditCard className="w-4 h-4" />;
    }

    if (type === 'payment') {
      if (action === 'marked_paid') return <Check className="w-4 h-4 text-green-500" />;
      if (action === 'rescheduled') return <Calendar className="w-4 h-4 text-blue-500" />;
      return <Calendar className="w-4 h-4" />;
    }

    return <FileText className="w-4 h-4" />;
  };

  const getActionColor = (entry: HistoryEntry & { type?: string }) => {
    const action = entry.action;
    if (action === 'created' || action === 'marked_paid' || action === 'activated' || action === 'login') {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
    if (action === 'deleted' || action === 'deactivated' || action === 'failed_login') {
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
    if (action === 'updated' || action === 'rescheduled' || action === 'balance_changed') {
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
    return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  const formatAction = (action: string): string => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatType = (type?: string): string => {
    if (!type) return '';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <AnimatedPage className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Activity History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all changes and activities across your financial tracker
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalActivities}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Last 30 days</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Failed Logins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failedLogins}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {stats.failedLogins === 0 ? 'All secure' : 'Review security'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Action Types</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.actionBreakdown.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Unique actions</p>
          </div>
        </div>
      )}

      {/* History Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Timeline</h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No activity history found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((entry: any, index) => (
              <div
                key={entry._id || index}
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${getActionColor(entry)}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(entry)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatAction(entry.action)}
                        </span>
                        {entry.type && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {formatType(entry.type)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-500 flex-shrink-0">
                        {formatDate(new Date(entry.timestamp))}
                      </span>
                    </div>

                    {entry.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {entry.details}
                      </p>
                    )}

                    {/* Balance Change */}
                    {entry.balanceChange && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                        <span className="font-mono">{formatCurrency(entry.balanceChange.previous)}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-mono">{formatCurrency(entry.balanceChange.new)}</span>
                        {entry.balanceChange.difference !== 0 && (
                          <span
                            className={`flex items-center gap-1 ${
                              entry.balanceChange.difference > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {entry.balanceChange.difference > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {formatCurrency(Math.abs(entry.balanceChange.difference))}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Changed Fields */}
                    {entry.changedFields && entry.changedFields.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        Changed: {entry.changedFields.join(', ')}
                      </div>
                    )}

                    {/* Changed By */}
                    {entry.changedBy && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        By: {entry.changedBy.firstName} {entry.changedBy.lastName}
                      </div>
                    )}

                    {/* IP Address */}
                    {entry.ipAddress && (
                      <div className="mt-1 text-xs text-gray-400 dark:text-gray-600">
                        IP: {entry.ipAddress}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default HistoryPage;
