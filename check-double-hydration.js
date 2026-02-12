import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    console.log(`[CONSOLE] ${text}`);
  });
  
  try {
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    await page.waitForTimeout(2000);
    
    // Check how many times hydration happened
    const hydratedCount = logs.filter(l => l.includes('Koda Zenith (Evolution) Hydrated')).length;
    const alreadyHydratedCount = logs.filter(l => l.includes('Application already hydrated')).length;
    
    console.log(`\n📊 Hydration Analysis:`);
    console.log(`  - Hydrated: ${hydratedCount} times`);
    console.log(`  - Already hydrated warning: ${alreadyHydratedCount} times`);
    
    if (hydratedCount > 1) {
      console.log(`\n❌ DOUBLE HYDRATION DETECTED!`);
      console.log(`Idempotency check FAILED`);
    } else if (hydratedCount === 1) {
      console.log(`\n✅ Hydration happened once (correct)`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
