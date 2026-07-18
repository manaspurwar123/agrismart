const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto(`http://localhost:3000/`, { waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log('Timeout'));
  await new Promise(r => setTimeout(r, 1000));
  const rootContent = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length || 0);
  console.log(`ROOT HTML LENGTH for /:`, rootContent);

  await browser.close();
})();
