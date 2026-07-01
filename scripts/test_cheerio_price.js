const cheerio = require('cheerio');
const URLS = [
  "https://es.made-in-china.com/co_gxhongfa/product_Qt4-35-Small-Make-Brick-Machine-Manual-Concrete-Block-Making-Machine_yuunsgygyg.html",
  "https://es.made-in-china.com/co_gxhongfa/product_10-Discount-Cement-Concrete-Brick-Making-Machine-Hollow-Block-Making-Machinery_horhnoeeg.html",
  "https://es.made-in-china.com/co_ubtechrobot/product_Advanced-Ubtech-Walker-C1-Humanoid-Robot-with-Nvidia-Technology_yueyynrhgy.html"
];

async function scrapePrice() {
  for (const url of URLS) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const $ = cheerio.load(text);
      
      let priceRaw = $('.only-one-priceNum-td-left').first().text().trim() || 
                     $('.sr-pro-price').first().text().trim() || 
                     $('.item-price').first().text().trim();

      if (!priceRaw) {
        // match regex US\$ [\d\.,]+
        const m = text.match(/US\$ ([\d\.,]+)/);
        if (m) priceRaw = m[0];
      }
      
      let finalPrice = 0;
      if (priceRaw) {
         const match = priceRaw.match(/[\d\.,]+/);
         if (match) {
            let str = match[0];
            if (str.includes(',') && str.indexOf(',') > str.lastIndexOf('.')) {
                str = str.replace(/\./g, '').replace(',', '.');
            } else if (str.includes('.') && str.indexOf('.') > str.lastIndexOf(',')) {
                str = str.replace(/,/g, '');
            } else if (str.includes(',')) {
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
  }
}

scrapePrice().catch(console.error);
