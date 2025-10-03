import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdvancedFilters, { TransactionFilters, FilterPreset } from '../../../src/components/transactions/AdvancedFilters';
import { Account } from '../../../src/models/Account';

const mockAccounts: Account[] = [
  { id: '1', name: 'Checking', type: 'checking', balance: 1000, institution: 'Bank A' },
  { id: '2', name: 'Savings', type: 'savings', balance: 5000, institution: 'Bank B' },
];

const mockCategories = ['Income', 'Groceries', 'Dining', 'Shopping'];

const defaultFilters: TransactionFilters = {
  categories: [],
  accounts: [],
  dateRange: { start: '', end: '' },
  amountRange: { min: 0, max: Infinity },
  searchQuery: '',
};

describe('AdvancedFilters', () => {
  it('should render collapsed by default', () => {
    const onFiltersChange = vi.fn();
    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
  });

  it('should expand when clicked', () => {
    const onFiltersChange = vi.fn();
    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Advanced Filters'));
    expect(screen.getByText(/Categories/)).toBeInTheDocument();
    expect(screen.getByText(/Accounts/)).toBeInTheDocument();
  });

  it('should show active filter count', () => {
    const filtersWithData: TransactionFilters = {
      ...defaultFilters,
      categories: ['Groceries', 'Dining'],
      accounts: ['1'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithData}
        onFiltersChange={vi.fn()}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // 2 active filter groups
  });

  it('should toggle category selection', () => {
    const onFiltersChange = vi.fn();
    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Click a category
    fireEvent.click(screen.getByText('Groceries'));

    expect(onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      categories: ['Groceries'],
    });
  });

  it('should toggle account selection', () => {
    const onFiltersChange = vi.fn();
    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Click an account
    fireEvent.click(screen.getByText('Checking'));

    expect(onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      accounts: ['1'],
    });
  });

  it('should update date range', () => {
    const onFiltersChange = vi.fn();
    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Set start date
    const startDateInput = screen.getByLabelText('Filter start date');
    fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });

    expect(onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      dateRange: { start: '2025-01-01', end: '' },
    });
  });

  it('should update amount range', () => {
    const onFiltersChange = vi.fn();
    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Set min amount
    const minAmountInput = screen.getByLabelText('Minimum transaction amount');
    fireEvent.change(minAmountInput, { target: { value: '10' } });

    expect(onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      amountRange: { min: 10, max: Infinity },
    });
  });

  it('should clear all filters', () => {
    const onFiltersChange = vi.fn();
    const filtersWithData: TransactionFilters = {
      categories: ['Groceries'],
      accounts: ['1'],
      dateRange: { start: '2025-01-01', end: '2025-12-31' },
      amountRange: { min: 10, max: 100 },
      searchQuery: 'test',
    };

    render(
      <AdvancedFilters
        filters={filtersWithData}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Clear All'));

    expect(onFiltersChange).toHaveBeenCalledWith(defaultFilters);
  });

  it('should show save preset button when filters are active', () => {
    const filtersWithData: TransactionFilters = {
      ...defaultFilters,
      categories: ['Groceries'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithData}
        onFiltersChange={vi.fn()}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    expect(screen.getByText('Save as Preset')).toBeInTheDocument();
  });

  it('should save a preset', () => {
    const onSavePreset = vi.fn();
    const filtersWithData: TransactionFilters = {
      ...defaultFilters,
      categories: ['Groceries'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithData}
        onFiltersChange={vi.fn()}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={onSavePreset}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Click save preset
    fireEvent.click(screen.getByText('Save as Preset'));

    // Enter preset name
    const nameInput = screen.getByLabelText('Preset name');
    fireEvent.change(nameInput, { target: { value: 'My Preset' } });

    // Click save
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSavePreset).toHaveBeenCalledWith('My Preset');
  });

  it('should load a preset', () => {
    const onLoadPreset = vi.fn();
    const mockPreset: FilterPreset = {
      id: 'preset1',
      name: 'Groceries Only',
      filters: {
        ...defaultFilters,
        categories: ['Groceries'],
      },
    };

    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[mockPreset]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={onLoadPreset}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Click preset
    fireEvent.click(screen.getByText('Groceries Only'));

    expect(onLoadPreset).toHaveBeenCalledWith(mockPreset);
  });

  it('should delete a preset', () => {
    const onDeletePreset = vi.fn();
    const mockPreset: FilterPreset = {
      id: 'preset1',
      name: 'Groceries Only',
      filters: {
        ...defaultFilters,
        categories: ['Groceries'],
      },
    };

    render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[mockPreset]}
        onSavePreset={vi.fn()}
        onDeletePreset={onDeletePreset}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Find and click delete button (X icon next to preset name)
    const deleteButton = screen.getByLabelText('Delete preset Groceries Only');
    fireEvent.click(deleteButton);

    expect(onDeletePreset).toHaveBeenCalledWith('preset1');
  });

  it('should handle multiple category selections', () => {
    const onFiltersChange = vi.fn();
    const { rerender } = render(
      <AdvancedFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Click first category
    fireEvent.click(screen.getByText('Groceries'));
    expect(onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      categories: ['Groceries'],
    });

    // Update the component with new filters
    const updatedFilters = { ...defaultFilters, categories: ['Groceries'] };
    rerender(
      <AdvancedFilters
        filters={updatedFilters}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Click second category
    fireEvent.click(screen.getByText('Dining'));

    expect(onFiltersChange).toHaveBeenCalledWith({
      ...updatedFilters,
      categories: ['Groceries', 'Dining'],
    });
  });

  it('should deselect category when clicked again', () => {
    const onFiltersChange = vi.fn();
    const filtersWithCategory: TransactionFilters = {
      ...defaultFilters,
      categories: ['Groceries'],
    };

    render(
      <AdvancedFilters
        filters={filtersWithCategory}
        onFiltersChange={onFiltersChange}
        accounts={mockAccounts}
        categories={mockCategories}
        presets={[]}
        onSavePreset={vi.fn()}
        onDeletePreset={vi.fn()}
        onLoadPreset={vi.fn()}
      />
    );

    // Expand filters
    fireEvent.click(screen.getByText('Advanced Filters'));

    // Click selected category to deselect
    fireEvent.click(screen.getByText('Groceries'));

    expect(onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      categories: [],
    });
  });
});
