import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/experiments/hydration-check', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    await page.waitForTimeout(2000);
    
    // Check DOM structure
    const domAnalysis = await page.evaluate(() => {
      const root = document.getElementById('root');
      if (!root) return { error: 'No root element' };
      
      return {
        rootChildrenCount: root.children.length,
        rootChildrenTags: Array.from(root.children).map(c => c.tagName),
        firstChildClasses: root.children[0]?.className,
        secondChildClasses: root.children[1]?.className,
        rootInnerHTML: root.innerHTML.substring(0, 500)
      };
    });
    
    console.log('🔍 DOM Structure Analysis:');
    console.log(`  - Root children count: ${domAnalysis.rootChildrenCount}`);
    console.log(`  - Children tags: ${domAnalysis.rootChildrenTags?.join(', ')}`);
    console.log(`  - First child classes: ${domAnalysis.firstChildClasses}`);
    console.log(`  - Second child classes: ${domAnalysis.secondChildClasses}`);
    console.log(`\n  - Root innerHTML preview:\n${domAnalysis.rootInnerHTML}...`);
    
    if (domAnalysis.rootChildrenCount > 1) {
      console.log(`\n❌ Multiple children in root! This explains the append behavior.`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
