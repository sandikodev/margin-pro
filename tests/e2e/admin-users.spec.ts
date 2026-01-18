import { test, expect } from '@playwright/test';
import { createClient } from "@libsql/client";
// Loaded via global setup or package presence


const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

test('admin can manage users', async ({ page }) => {
    // 1. Register a new user
    const adminEmail = `admin-${Date.now()}@example.com`;

    // Skip onboarding
    await page.addInitScript(() => {
        localStorage.setItem('margins_pro_onboarded', 'true');
    });

    await page.goto('/auth');
    await page.fill('input[name="name"]', 'Admin User Test');
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Daftar Gratis")');

    // Wait for redirect to app
    await page.waitForURL('**/app');

    // 2. Promote to Admin (Direct DB manipulation)
    // We wait a bit to ensure potential async DB writes for registration are done, 
    // though waitForURL implies client side success.
    await expect(async () => {
        const result = await db.execute({
            sql: "UPDATE users SET role = 'admin' WHERE email = ?",
            args: [adminEmail]
        });
        expect(result.rowsAffected).toBe(1);
    }).toPass();

    // 3. Reload Page to get new Permissions/Role (JWT needs refresh or app state needs refresh)
    // Usually role is in the session/JWT. If we just updated DB, the current session might be stale 
    // until re-login or refresh if the app checks DB on every request.
    // Let's assume re-login is safest.

    // Logout
    // Assuming there is a logout button or we can clear storage.
    // For now, let's try direct navigation to /system/admin and see if it kicks us out (or works if dynamic)
    // If the app checks session on load, a reload should do it.
    await page.reload();
    await page.waitForTimeout(1000);

    // Navigate to Admin Dashboard
    await page.goto('/system/admin');

    // 4. Verify Admin Dashboard Loads
    await expect(page.locator('h1')).toContainText('Control Center');

    // 5. Verify User Management Tab
    // Click on "User Management" tab
    await page.getByText('User Management').click();

    // 6. Search for self
    await page.fill('input[placeholder*="Search user"]', adminEmail);

    // 7. Verify user appears in table
    await expect(page.locator('table')).toContainText(adminEmail);
    await expect(page.locator('table')).toContainText('Admin'); // Should show as Admin role
});
