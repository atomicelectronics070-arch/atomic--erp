const { chromium } = require('playwright');
const URLS = [
  "https://es.made-in-china.com/co_gxhongfa/product_Qt4-35-Small-Make-Brick-Machine-Manual-Concrete-Block-Making-Machine_yuunsgygyg.html",
  "https://es.made-in-china.com/co_gxhongfa/product_10-Discount-Cement-Concrete-Brick-Making-Machine-Hollow-Block-Making-Machinery_horhnoeeg.html",
  "https://es.made-in-china.com/co_ubtechrobot/product_Advanced-Ubtech-Walker-C1-Humanoid-Robot-with-Nvidia-Technology_yueyynrhgy.html"
];

async function scrapePrice() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  for (const url of URLS) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const priceRaw = await page.evaluate(() => {
        // Find price elements
        const priceEls = document.querySelectorAll('.only-one-priceNum-td-left, .sr-pro-price, .item-price, .price, .sr-proList-num, .J-price');
        for (let el of priceEls) {
           if (el.innerText && (el.innerText.includes('US$') || el.innerText.includes('$') || /\d/.test(el.innerText))) {
               return el.innerText;
           }
        }
        return null;
      });
      
      let finalPrice = 0;
      if (priceRaw) {
         const match = priceRaw.match(/[\d\.,]+/);
         if (match) {
            let str = match[0];
            // Si tiene punto como separador de miles y coma como decimal (ej 3.700,00)
            if (str.includes(',') && str.indexOf(',') > str.lastIndexOf('.')) {
                // Es formato EU
                str = str.replace(/\./g, '').replace(',', '.');
            } else if (str.includes('.') && str.indexOf('.') > str.lastIndexOf(',')) {
                // Es formato US (ej 3,700.00)
                str = str.replace(/,/g, '');
            } else if (str.includes(',')) {
                // Solo coma, asumimos separador de miles o decimal dependiendo
                str = str.replace(/,/g, '');
            }
            finalPrice = parseFloat(str) * 1.4; // 40% margin
         }
      }
      
      console.log(`URL: ${url}`);
      console.log(`Raw: ${priceRaw} -> Base + Margin 40%: ${finalPrice}`);
    } catch(e) {
      console.error(e.message);
    }
    await page.close();
  }
  await browser.close();
}

scrapePrice().catch(console.error);
