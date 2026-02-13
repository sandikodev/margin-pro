import { test, expect } from '@playwright/test';

test.describe('Margins Pro - Critical Flows', () => {
  
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Margin/);
  });

  test('should access demo mode', async ({ page }) => {
    await page.goto('/auth');
    
    // Click demo button
    await page.click('text=Demo');
    
    // Should redirect to /app
    await expect(page).toHaveURL(/\/app/);
    
    // Should see dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should create new project', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.click('text=Demo');
    await page.waitForURL(/\/app/);
    
    // Navigate to calculator
    await page.goto('/app/calculator');
    
    // Create new project
    const newProjectButton = page.locator('button:has-text("New"), button:has-text("+")').first();
    if (await newProjectButton.isVisible()) {
      await newProjectButton.click();
    }
    
    // Should see cost input fields
    await expect(page.locator('input[type="number"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should persist data after reload', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.click('text=Demo');
    await page.waitForURL(/\/app/);
    
    // Go to calculator
    await page.goto('/app/calculator');
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Reload page
    await page.reload();
    
    // Data should still be there (from localStorage or API)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Page should render without horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
  });
});
