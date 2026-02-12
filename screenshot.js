import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to page...');
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    console.log('Waiting for content...');
    await page.waitForTimeout(2000);
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'hydration-check.png', fullPage: true });
    
    console.log('Getting page content...');
    const content = await page.content();
    const count = (content.match(/Hydration & Duplication Check/g) || []).length;
    console.log(`Found "${count}" occurrences of "Hydration & Duplication Check"`);
    
    console.log('Screenshot saved to hydration-check.png');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
