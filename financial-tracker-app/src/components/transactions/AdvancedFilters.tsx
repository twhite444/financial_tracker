import { useState } from 'react';
import { Filter, X, Calendar, DollarSign, Tag, Building2, Save, Trash2, ChevronDown } from 'lucide-react';
import { Account } from '../../models/Account';

export interface FilterPreset {
  id: string;
  name: string;
  filters: TransactionFilters;
}

export interface TransactionFilters {
  categories: string[];
  accounts: string[];
  dateRange: {
    start: string;
    end: string;
  };
  amountRange: {
    min: number;
    max: number;
  };
  searchQuery: string;
}

interface AdvancedFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  accounts: Account[];
  categories: string[];
  presets: FilterPreset[];
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
  onLoadPreset: (preset: FilterPreset) => void;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  accounts,
  categories,
  presets,
  onSavePreset,
  onDeletePreset,
  onLoadPreset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  const activeFilterCount = [
    filters.categories.length > 0,
    filters.accounts.length > 0,
    filters.dateRange.start !== '',
    filters.dateRange.end !== '',
    filters.amountRange.min > 0,
    filters.amountRange.max < Infinity,
  ].filter(Boolean).length;

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleAccount = (accountId: string) => {
    const newAccounts = filters.accounts.includes(accountId)
      ? filters.accounts.filter((a) => a !== accountId)
      : [...filters.accounts, accountId];
    onFiltersChange({ ...filters, accounts: newAccounts });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      accounts: [],
      dateRange: { start: '', end: '' },
      amountRange: { min: 0, max: Infinity },
      searchQuery: '',
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim());
      setPresetName('');
      setShowPresetModal(false);
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6 space-y-4">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
        >
          <Filter className="h-5 w-5" />
          <span>Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Filter Presets */}
          {presets.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Saved Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
                  >
                    <button
                      onClick={() => onLoadPreset(preset)}
                      className="hover:text-blue-800 dark:hover:text-blue-300"
                      aria-label={`Load preset ${preset.name}`}
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => onDeletePreset(preset.id)}
                      className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                      aria-label={`Delete preset ${preset.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Select Categories */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories {filters.categories.length > 0 && `(${filters.categories.length})`}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c !== 'All').map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    filters.categories.includes(category)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                  aria-label={`${filters.categories.includes(category) ? 'Unselect' : 'Select'} ${category} category`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-Select Accounts */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Accounts {filters.accounts.length > 0 && `(${filters.accounts.length})`}
            </label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((account) => {
                const accountId = (account._id || account.id) as string;
                return (
                  <button
                    key={accountId}
                    onClick={() => toggleAccount(accountId)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      filters.accounts.includes(accountId)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                    }`}
                    aria-label={`${filters.accounts.includes(accountId) ? 'Unselect' : 'Select'} ${account.name}`}
                  >
                    {account.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value },
                  })
                }
                className="glass-input"
                aria-label="Filter start date"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value },
                  })
                }
                className="glass-input"
                aria-label="Filter end date"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Min Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.amountRange.min || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    amountRange: {
                      ...filters.amountRange,
                      min: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="$0.00"
                className="glass-input"
                aria-label="Minimum transaction amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Max Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.amountRange.max === Infinity ? '' : filters.amountRange.max}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    amountRange: {
                      ...filters.amountRange,
                      max: parseFloat(e.target.value) || Infinity,
                    },
                  })
                }
                placeholder="No limit"
                className="glass-input"
                aria-label="Maximum transaction amount"
              />
            </div>
          </div>

          {/* Save Preset Button */}
          {activeFilterCount > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPresetModal(true)}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
                aria-label="Save current filters as preset"
              >
                <Save className="h-4 w-4" />
                Save as Preset
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Save Filter Preset</h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="glass-input"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
              aria-label="Preset name"
            />
            <div className="flex gap-3">
              <button onClick={handleSavePreset} className="btn-primary flex-1">
                Save
              </button>
              <button
                onClick={() => {
                  setShowPresetModal(false);
                  setPresetName('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
