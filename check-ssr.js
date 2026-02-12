import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  // Disable JavaScript to see SSR output only
  await context.addInitScript(() => {
    // This won't work, we need to use javaScriptEnabled: false
  });
  
  const page = await context.newPage();
  
  // Intercept before JS runs
  await page.route('**/*.js', route => route.abort());
  
  try {
    console.log('🧪 Testing SSR output (JS disabled)');
    
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    await page.waitForTimeout(1000);
    
    const html = await page.content();
    const count = (html.match(/Hydration & Duplication Check/g) || []).length;
    
    console.log(`📊 SSR Output: Found "${count}" occurrences`);
    
    if (count === 1) {
      console.log('✅ SSR renders once (correct)');
    } else if (count === 0) {
      console.log('❌ SSR renders nothing (CSR-only mode)');
    } else {
      console.log(`❌ SSR renders ${count} times (double render in SSR)`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
