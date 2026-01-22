import { test, expect } from '@playwright/test';

test.describe('Laboratory Feature', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log('[BROWSER CONS]:', msg.text()));
        const testEmail = `test-lab-${Date.now()}@example.com`;

        // Skip onboarding
        await page.addInitScript(() => {
            localStorage.setItem('margins_pro_onboarded', 'true');
        });

        await page.goto('/auth?mode=register');
        // Now register fields should be visible
        await page.fill('input[name="name"]', 'Lab Tester');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button:has-text("Create Account")');

        await page.waitForURL(url => url.pathname.includes('/app') || url.pathname.includes('/onboarding'), { timeout: 15000 });

        // If we are redirected to onboarding, fill it
        if (page.url().includes('/onboarding')) {
            console.log('[TEST LOG]: Onboarding detected, filling...');
            await page.waitForSelector('input[placeholder*="Contoh: Kopi"]', { timeout: 10000 });
            await page.fill('input[placeholder*="Contoh: Kopi"]', 'Test Business Lab');
            await page.click('button:has-text("Lanjut")');

            await page.waitForSelector('text=Resto / Warung', { timeout: 5000 });
            await page.click('button:has-text("Resto / Warung")');
            await page.click('button:has-text("Lanjut")');

            await page.waitForSelector('text=Target Profit Margin', { timeout: 5000 });
            await page.click('button:has-text("Lanjut")');

            await page.waitForSelector('text=Modal & Operasional', { timeout: 5000 });
            await page.click('button:has-text("Selesai & Masuk")');

            await page.waitForURL('**/app', { timeout: 15000 });
            console.log('[TEST LOG]: Onboarding finished.');
        }

        console.log('[TEST LOG]: Navigating to /labs...');
        await page.goto('/labs', { waitUntil: 'load' });
        console.log('[TEST LOG]: Current URL:', page.url());
    });

    test('should load the laboratory page and show nodes', async ({ page }) => {
        console.log('[TEST LOG]: Starting test - current URL:', page.url());

        // Wait for loader to disappear - up to 60s for slow backend/db
        console.log('[TEST LOG]: Waiting for ENTRING LABORATORY... loader to disappear');
        await page.waitForFunction(
            () => !document.body.innerText.toLowerCase().includes('entering laboratory'),
            { timeout: 60000 }
        );
        
        // Diagnostic: what is in the DOM now?
        const bodyText = await page.evaluate(() => document.body.innerText);
        console.log('[TEST LOG]: Body Text after loader:', bodyText.slice(0, 200));

        // Wait for specific Lab title in header
        await page.waitForSelector('header:has-text("Innovation")', { timeout: 15000 });
        
        const headerText = await page.locator('header').innerText();
        console.log('[TEST LOG]: Header text detected:', headerText);

        expect(headerText).toContain('Innovation');
        expect(headerText).toContain('Lab');

        // Check for nodes
        const nodes = page.locator('.rounded-2xl.border.backdrop-blur-xl');
        const count = await nodes.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should update margin when simulation is active', async ({ page }) => {
        const marginDisplay = page.locator('text=Estimated Margin').locator('..').locator('.text-3xl');
        const initialMargin = await marginDisplay.innerText();

        // Click a simulation button (e.g., Price Spike)
        await page.click('text=Price Spike');

        // Wait for potential animation or state change
        await page.waitForTimeout(500);

        const newMargin = await marginDisplay.innerText();
        expect(newMargin).not.toBe(initialMargin);
    });
});
