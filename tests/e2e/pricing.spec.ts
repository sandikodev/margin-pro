import { test, expect } from '@playwright/test';

test.describe('Pricing Page & Payment Flow', () => {
    test('should load pricing page and display tiers', async ({ page }) => {
        // 1. Mock Auth (Set local storage)
        await page.addInitScript(() => {
            localStorage.setItem('margins_pro_auth', 'true');
            localStorage.setItem('margins_pro_onboarded', 'true');
        });

        // 2. Go to Pricing Page
        await page.goto('http://localhost:5173/pricing');

        // 3. Verify Tiers
        await expect(page.getByText('Unlock Margins Pro')).toBeVisible();
        await expect(page.getByText('Rp 150k')).toBeVisible(); // Monthly
        await expect(page.getByText('Rp 2.5jt')).toBeVisible(); // Lifetime
    });

    test('should load Midtrans script', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('margins_pro_auth', 'true');
            localStorage.setItem('margins_pro_onboarded', 'true');
        });

        await page.goto('http://localhost:5173/pricing');

        // Check if script is injected
        const script = page.locator('#midtrans-script');
        await expect(script).toHaveAttribute('src', 'https://app.midtrans.com/snap/snap.js');
    });
});
