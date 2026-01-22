
import { test, expect } from '@playwright/test';

test.describe('Margins Pro App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    // Wait for app to render main container
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('should render dashboard correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Margin Pro/);
    await expect(page.getByText(/Vault/i)).toBeVisible();
  });

  test('should allow creating a new project via calculator', async ({ page }) => {
    // Navigate to Calculator
    await page.getByRole('button', { name: 'New Node' }).click();
    await expect(page).toHaveURL(/\/app\/project\?id=/);

    // Check key elements
    await expect(page.getByText('Komponen Biaya')).toBeVisible();
    await expect(page.getByPlaceholder('Nama Item...').first()).toBeVisible();

    // Test basic input interaction
    const priceInput = page.getByPlaceholder('0').first();
    await priceInput.fill('5000');
    await expect(page.getByText('Total HPP')).toBeVisible();
  });

  test('should load marketplace items', async ({ page }) => {
    // Navigate to Market
    const marketBtn = page.locator('button').filter({ hasText: 'Market' }).first();
    await marketBtn.click();

    await expect(page.getByText('Global Library')).toBeVisible();
    await expect(page.getByText('Steak Ayam Krispi Viral')).toBeVisible();
  });

  test('should navigate to finance tab', async ({ page }) => {
    // Navigate using Mobile Nav or Sidebar
    await page.locator('nav').getByText('Finance').click();

    await expect(page.getByText('Financial Command')).toBeVisible();
    await expect(page.getByText('Net Cashflow')).toBeVisible();

    // Test Sub-tab switching
    await page.getByRole('button', { name: 'Utang' }).click();
    await expect(page.getByText('Simulator Kredit Usaha')).toBeVisible();
  });
});
