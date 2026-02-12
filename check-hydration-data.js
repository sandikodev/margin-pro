import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  
  try {
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    await page.waitForTimeout(2000);
    
    // Check hydration data
    const hydrationCheck = await page.evaluate(() => {
      const win = window;
      return {
        hasHydrationData: !!win.__staticRouterHydrationData,
        hydrationDataType: typeof win.__staticRouterHydrationData,
        rootHTML: document.getElementById('root')?.innerHTML.substring(0, 200)
      };
    });
    
    console.log('🔍 Hydration Data Check:');
    console.log(`  - Has hydration data: ${hydrationCheck.hasHydrationData}`);
    console.log(`  - Type: ${hydrationCheck.hydrationDataType}`);
    console.log(`  - Root HTML preview: ${hydrationCheck.rootHTML}...`);
    
    // Check for hydration errors
    const hydrationErrors = logs.filter(l => 
      l.includes('Hydration') || 
      l.includes('hydration') ||
      l.includes('mismatch') ||
      l.includes('did not match')
    );
    
    console.log(`\n🔍 Hydration Errors: ${hydrationErrors.length}`);
    hydrationErrors.forEach(err => console.log(`  - ${err}`));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
