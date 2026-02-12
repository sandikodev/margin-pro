import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture console logs
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    console.log(`[BROWSER] ${text}`);
  });
  
  try {
    console.log('🧪 Testing: http://localhost:5173/experiments/hydration-check');
    
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    console.log('✅ Page loaded');
    
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    // Count occurrences
    const count = await page.evaluate(() => {
      const text = document.body.innerText;
      const matches = text.match(/Hydration & Duplication Check/g);
      return matches ? matches.length : 0;
    });
    
    console.log(`\n📊 Result: Found "${count}" occurrences`);
    
    if (count === 1) {
      console.log('✅ SUCCESS: Page renders once (no double render)');
    } else if (count === 2) {
      console.log('❌ FAILED: Page renders twice (double render detected)');
    } else {
      console.log('⚠️  UNEXPECTED: Found', count, 'occurrences');
    }
    
    // Analyze logs
    console.log('\n🔍 Console Log Analysis:');
    const startCalls = logs.filter(l => l.includes('[DEBUG] start() called')).length;
    const hydrateRootCalls = logs.filter(l => l.includes('[DEBUG] Calling hydrateRoot()')).length;
    const entryClientCalls = logs.filter(l => l.includes('[DEBUG] entry-client.tsx')).length;
    
    console.log(`  - entry-client.tsx executed: ${entryClientCalls} times`);
    console.log(`  - start() called: ${startCalls} times`);
    console.log(`  - hydrateRoot() called: ${hydrateRootCalls} times`);
    
    // Take screenshot
    await page.screenshot({ path: 'hydration-test-result.png', fullPage: true });
    console.log('\n📸 Screenshot saved: hydration-test-result.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
