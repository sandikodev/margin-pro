const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capture console logs and errors
  const logs = [];
  const errors = [];
  
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    errors.push(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
  });
  
  console.log('Testing production site...');
  await page.goto('https://marginpro.vercel.app/', { waitUntil: 'networkidle0' });
  
  // Wait for React to render
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Check if React rendered
  const rootContent = await page.$eval('#root', el => el.innerHTML).catch(() => 'EMPTY');
  
  console.log('\n=== CONSOLE LOGS ===');
  logs.forEach(log => console.log(log));
  
  console.log('\n=== ERRORS ===');
  errors.forEach(error => console.log(error));
  
  console.log('\n=== ROOT STATUS ===');
  console.log(rootContent === 'EMPTY' ? 'BLANK PAGE' : 'CONTENT RENDERED');
  
  console.log('\n=== ROOT CONTENT LENGTH ===');
  console.log(`${rootContent.length} characters`);
  
  await browser.close();
})();
