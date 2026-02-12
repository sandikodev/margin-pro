import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Block JS
  await page.route('**/*.js', route => route.abort());
  
  try {
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    await page.waitForTimeout(1000);
    
    const html = await page.content();
    
    console.log('=== SSR HTML OUTPUT ===');
    console.log(html);
    console.log('=== END ===');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
