const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Loading https://marginpro.vercel.app...');
  await page.goto('https://marginpro.vercel.app/', { waitUntil: 'networkidle0' });
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/marginpro-screenshot.png', fullPage: true });
  console.log('Screenshot saved to /tmp/marginpro-screenshot.png');
  
  // Check what's visible
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasContent = bodyText.length > 100;
  
  console.log('\n=== VISUAL CHECK ===');
  console.log(`Body text length: ${bodyText.length} characters`);
  console.log(`Has visible content: ${hasContent ? 'YES' : 'NO'}`);
  console.log(`First 200 chars: ${bodyText.substring(0, 200)}`);
  
  await browser.close();
})();
