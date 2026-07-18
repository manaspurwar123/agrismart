const puppeteer = require('/app/node_modules/puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.evaluate(async () => {
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@agrismart.com', password: 'admin' })
    });
  });
  
  await page.goto('http://localhost:3000/ai/assistant', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || '');
  console.log(`ROOT HTML LENGTH for /ai/assistant:`, rootHtml.length);
  
  await browser.close();
})();
