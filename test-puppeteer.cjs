const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capture console logs and errors
  const logs = [];
  const errors = [];
  const networkRequests = [];
  
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    errors.push(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
  });
  
  page.on('response', response => {
    if (response.status() >= 400) {
      networkRequests.push(`${response.status()} ${response.url()}`);
    }
  });
  
  console.log('Testing production site...');
  await page.goto('https://marginpro.vercel.app/', { waitUntil: 'networkidle0' });
  
  // Wait for React to render
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('\n=== FAILED REQUESTS ===');
  networkRequests.forEach(req => console.log(req));
  
  console.log('\n=== CONSOLE ERRORS ===');
  logs.filter(log => log.includes('error:')).forEach(log => console.log(log));
  
  console.log('\n=== PAGE ERRORS ===');
  errors.forEach(error => console.log(error));
  
  // Check if React rendered
  const rootContent = await page.$eval('#root', el => el.innerHTML).catch(() => 'EMPTY');
  console.log('\n=== ROOT STATUS ===');
  console.log(rootContent === 'EMPTY' ? 'BLANK PAGE' : 'CONTENT RENDERED');
  
  await browser.close();
})();
