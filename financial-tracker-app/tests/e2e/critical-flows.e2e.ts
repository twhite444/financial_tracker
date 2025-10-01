import { test, expect } from '@playwright/test';

/**
 * Critical User Flow: Authentication
 * Tags: @smoke, @auth
 */
test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page @smoke', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should successfully log in with valid credentials @smoke', async ({ page }) => {
    // Fill in login form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should stay on login page and show error
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    
    // Fill registration form
    await page.getByLabel(/name/i).fill('New User');
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/^password$/i).fill('SecurePassword123!');
    await page.getByLabel(/confirm password/i).fill('SecurePassword123!');
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should successfully log out', async ({ page }) => {
    // First login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Logout
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Verify redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

/**
 * Critical User Flow: Account Management
 * Tags: @smoke, @accounts
 */
test.describe('Account Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display all accounts @smoke', async ({ page }) => {
    await page.getByRole('link', { name: /accounts/i }).click();
    
    await expect(page).toHaveURL(/\/accounts/);
    await expect(page.getByRole('heading', { name: /accounts/i })).toBeVisible();
    
    // Verify default accounts are displayed
    await expect(page.getByText(/schwab.*checking/i)).toBeVisible();
    await expect(page.getByText(/retirement savings/i)).toBeVisible();
    await expect(page.getByText(/capital one/i)).toBeVisible();
  });

  test('should add new bank account', async ({ page }) => {
    await page.getByRole('link', { name: /accounts/i }).click();
    await page.getByRole('button', { name: /add account/i }).click();
    
    // Fill form
    await page.getByLabel(/account name/i).fill('New Checking Account');
    await page.getByLabel(/institution/i).fill('Chase Bank');
    await page.getByLabel(/account type/i).selectOption('checking');
    await page.getByLabel(/balance/i).fill('5000.00');
    
    await page.getByRole('button', { name: /save account/i }).click();
    
    // Verify account appears in list
    await expect(page.getByText(/new checking account/i)).toBeVisible();
    await expect(page.getByText(/chase bank/i)).toBeVisible();
  });

  test('should add new credit card', async ({ page }) => {
    await page.getByRole('link', { name: /accounts/i }).click();
    await page.getByRole('button', { name: /add account/i }).click();
    
    // Fill form for credit card
    await page.getByLabel(/account name/i).fill('Discover Card');
    await page.getByLabel(/institution/i).fill('Discover');
    await page.getByLabel(/account type/i).selectOption('credit_card');
    await page.getByLabel(/credit limit/i).fill('10000.00');
    await page.getByLabel(/balance/i).fill('2500.00');
    
    await page.getByRole('button', { name: /save account/i }).click();
    
    await expect(page.getByText(/discover card/i)).toBeVisible();
  });

  test('should edit existing account', async ({ page }) => {
    await page.getByRole('link', { name: /accounts/i }).click();
    
    // Click edit on first account
    await page.getByRole('button', { name: /edit/i }).first().click();
    
    // Update balance
    await page.getByLabel(/balance/i).clear();
    await page.getByLabel(/balance/i).fill('15000.00');
    
    await page.getByRole('button', { name: /save/i }).click();
    
    // Verify updated balance
    await expect(page.getByText(/15,000/)).toBeVisible();
  });

  test('should delete account with confirmation', async ({ page }) => {
    await page.getByRole('link', { name: /accounts/i }).click();
    
    // Get initial account count
    const initialCount = await page.getByTestId('account-item').count();
    
    // Click delete on last account
    await page.getByRole('button', { name: /delete/i }).last().click();
    
    // Confirm deletion in modal
    await page.getByRole('button', { name: /confirm delete/i }).click();
    
    // Verify account count decreased
    const newCount = await page.getByTestId('account-item').count();
    expect(newCount).toBe(initialCount - 1);
  });
});

/**
 * Critical User Flow: Payment Calendar
 * Tags: @smoke, @payments
 */
test.describe('Payment Calendar & Due Dates', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display payment calendar @smoke', async ({ page }) => {
    await page.getByRole('link', { name: /payments/i }).click();
    
    await expect(page).toHaveURL(/\/payments/);
    await expect(page.getByRole('heading', { name: /payment calendar/i })).toBeVisible();
    
    // Verify calendar is displayed
    await expect(page.locator('[data-testid="payment-calendar"]')).toBeVisible();
  });

  test('should show upcoming payment due dates', async ({ page }) => {
    await page.getByRole('link', { name: /payments/i }).click();
    
    // Verify upcoming payments section
    await expect(page.getByText(/upcoming payments/i)).toBeVisible();
    
    // Should show credit card payments
    await expect(page.getByText(/capital one.*due/i)).toBeVisible();
    await expect(page.getByText(/discover.*due/i)).toBeVisible();
    await expect(page.getByText(/chase.*due/i)).toBeVisible();
  });

  test('should add payment reminder', async ({ page }) => {
    await page.getByRole('link', { name: /payments/i }).click();
    await page.getByRole('button', { name: /add reminder/i }).click();
    
    // Fill reminder form
    await page.getByLabel(/payment name/i).fill('Rent Payment');
    await page.getByLabel(/amount/i).fill('1500.00');
    await page.getByLabel(/due date/i).fill('2025-10-15');
    await page.getByLabel(/recurring/i).check();
    await page.getByLabel(/frequency/i).selectOption('monthly');
    
    await page.getByRole('button', { name: /save reminder/i }).click();
    
    // Verify reminder appears
    await expect(page.getByText(/rent payment/i)).toBeVisible();
    await expect(page.getByText(/\$1,500/)).toBeVisible();
  });

  test('should mark payment as paid', async ({ page }) => {
    await page.getByRole('link', { name: /payments/i }).click();
    
    // Find first payment and mark as paid
    await page.getByRole('button', { name: /mark as paid/i }).first().click();
    
    // Verify payment is marked as paid
    await expect(page.getByText(/payment recorded/i)).toBeVisible();
    await expect(page.locator('.payment-status.paid').first()).toBeVisible();
  });
});

/**
 * Critical User Flow: Dashboard Overview
 * Tags: @smoke, @dashboard
 */
test.describe('Dashboard Overview', () => {
  test('should display financial summary @smoke', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify dashboard elements
    await expect(page.getByText(/total balance/i)).toBeVisible();
    await expect(page.getByText(/total debt/i)).toBeVisible();
    await expect(page.getByText(/net worth/i)).toBeVisible();
    
    // Verify charts
    await expect(page.locator('[data-testid="balance-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="spending-chart"]')).toBeVisible();
  });

  test('should show recent transactions', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/recent transactions/i)).toBeVisible();
    
    // Should show at least one transaction
    const transactions = page.locator('[data-testid="transaction-item"]');
    await expect(transactions.first()).toBeVisible();
  });
});
