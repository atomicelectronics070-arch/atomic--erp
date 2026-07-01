const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.fabricables.com/productos/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 1000));
  await browser.close();
}

test();
