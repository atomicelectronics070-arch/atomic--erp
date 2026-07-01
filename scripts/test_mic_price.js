const { chromium } = require('playwright');
const testUrl = 'https://es.made-in-china.com/co_gxhongfa/product_Qt4-35-Small-Make-Brick-Machine-Manual-Concrete-Block-Making-Machine_yuunsgygyg.html';

async function testPrice() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0' });
  const page = await context.newPage();
  await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
  
  const priceData = await page.evaluate(() => {
    // Look for anything resembling "Precio" or "US" or "FOB"
    const text = document.body.innerText;
    const match = text.match(/.{0,30}US\$.{0,30}/g) || text.match(/.{0,30}FOB.{0,30}/gi) || text.match(/.{0,30}Precio.{0,30}/gi);
    return match;
  });
  
  console.log('Found texts:', priceData);
  await browser.close();
}
testPrice().catch(console.error);
