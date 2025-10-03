import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../../../src/components/common/EmptyState';
import { Inbox, Plus } from 'lucide-react';

describe('EmptyState', () => {
  it('should render with icon, title, and description', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Start by adding your first item"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Start by adding your first item')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Start by adding your first item"
        action={{
          label: 'Add Item',
          onClick: handleClick,
          icon: Plus,
        }}
      />
    );

    const button = screen.getByRole('button', { name: /Add Item/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when not provided', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Start by adding your first item"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render custom illustration when provided', () => {
    const CustomIllustration = () => <div data-testid="custom-illustration">Custom SVG</div>;
    
    render(
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Start by adding your first item"
        illustration={<CustomIllustration />}
      />
    );

    expect(screen.getByTestId('custom-illustration')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Start by adding your first item"
        className="custom-class"
      />
    );

    const emptyStateDiv = container.firstChild;
    expect(emptyStateDiv).toHaveClass('custom-class');
  });

  it('should render action without icon', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="Start by adding your first item"
        action={{
          label: 'Add Item',
          onClick: handleClick,
        }}
      />
    );

    const button = screen.getByRole('button', { name: /Add Item/i });
    expect(button).toBeInTheDocument();
  });

  it('should have accessible text content', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No transactions yet"
        description="Add your first transaction to get started tracking your finances"
        action={{
          label: 'Add Transaction',
          onClick: vi.fn(),
        }}
      />
    );

    // Check heading
    const heading = screen.getByRole('heading', { name: /No transactions yet/i });
    expect(heading).toBeInTheDocument();

    // Check description
    expect(screen.getByText(/Add your first transaction/i)).toBeInTheDocument();

    // Check button
    const button = screen.getByRole('button', { name: /Add Transaction/i });
    expect(button).toBeInTheDocument();
  });
});
