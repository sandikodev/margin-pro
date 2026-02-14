const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Testing production site...');
  await page.goto('https://marginpro.vercel.app/', { waitUntil: 'networkidle' });
  
  // Wait for React to render
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  console.log('=== FULL HTML CONTENT ===');
  console.log(html);
  
  // Check if React rendered
  const rootContent = await page.$eval('#root', el => el.innerHTML).catch(() => 'EMPTY');
  console.log('\n=== ROOT CONTENT ===');
  console.log(rootContent);
  
  // Check for any errors
  const errors = await page.evaluate(() => {
    return window.console?.errors || [];
  });
  
  if (errors.length > 0) {
    console.log('\n=== CONSOLE ERRORS ===');
    console.log(errors);
  }
  
  await browser.close();
})();
