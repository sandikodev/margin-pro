import { test } from '@playwright/test';

test('record hydration check page', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:5173/experiments/hydration-check');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit to see the rendered content
  await page.waitForTimeout(3000);
  
  // Scroll to see full page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
});
