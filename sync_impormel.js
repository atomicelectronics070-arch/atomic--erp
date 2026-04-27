const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

const CONFIG = [
  {
    name: 'Impormel',
    urlFn: (page) => page === 1 
      ? `https://impormel.com/?s=reloj&post_type=product`
      : `https://impormel.com/page/${page}/?s=reloj&post_type=product`,
    selectors: {
      container: '.product',
      name: '.woocommerce-loop-product__title',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: '.woocommerce-LoopProduct-link img',
      link: '.woocommerce-LoopProduct-link'
    },
    pricing: (p) => {
      if (p <= 25) return p + 10;
      if (p <= 60) return p + 15;
      return p * 1.45;
    },
    provider: 'Impormel',
    maxPages: 10
  }
];

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  
  let bestMatch = matches[matches.length - 1];
  let cleaned = bestMatch;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length === 2) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }
  return parseFloat(cleaned) || 0;
}

async function scrapeSite(browser, site) {
  let totalSynced = 0;
  console.log(`\n======================================`);
  console.log(`🚀 Starting Sync: ${site.name}`);
  console.log(`======================================`);

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  for (let pageNum = 1; pageNum <= site.maxPages; pageNum++) {
    const url = site.urlFn(pageNum);
    console.log(`\n➡️  Scraping page ${pageNum}: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(4000); 

      await page.evaluate(async () => {
        window.scrollBy(0, 800);
        await new Promise(r => setTimeout(r, 1000));
        window.scrollBy(0, 800);
        await new Promise(r => setTimeout(r, 1000));
      });

      const products = await page.evaluate((sel) => {
        const items = Array.from(document.querySelectorAll(sel.container));
        return items.map(el => {
          const nameEl = el.querySelector(sel.name);
          let priceEl = el.querySelector(sel.price);
          let priceText = priceEl ? priceEl.innerText : '';
          
          if (!priceText.includes('$')) {
              const allText = el.innerText;
              const priceMatch = allText.match(/\$\s?[\d.,]+/);
              if (priceMatch) priceText = priceMatch[0];
          }

          const imageEl = el.querySelector(sel.image);
          const linkEl = el.querySelector(sel.link) || el.closest('a');

          return {
            name: nameEl ? nameEl.innerText.trim() : '',
            priceRaw: priceText.trim(),
            image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || imageEl.getAttribute('data-lazy-src')) : '',
            link: linkEl ? linkEl.href : ''
          };
        });
      }, site.selectors);

      console.log(`🔍 Found ${products.length} items on page ${pageNum}`);
      
      if (products.length === 0) {
        console.log(`⚠️ No products found. Assuming end of pagination or block.`);
        break;
      }

      let successCount = 0;
      for (const p of products) {
        if (!p.name || !p.priceRaw) continue;

        const basePrice = parsePrice(p.priceRaw);
        if (basePrice <= 0 || basePrice > 10000) continue;

        const finalPrice = site.pricing(basePrice);

        try {
          const sku = p.link ? p.link.split('/').filter(Boolean).pop() : p.name.toLowerCase().replace(/\s+/g, '-');
          
          await prisma.product.upsert({
            where: { sku: sku || p.name },
            update: {
              name: p.name,
              price: finalPrice,
              compareAtPrice: basePrice > finalPrice ? basePrice : null,
              images: JSON.stringify([p.image]),
              provider: site.provider,
              isDeleted: false,
              isActive: true
            },
            create: {
              sku: sku || p.name,
              name: p.name,
              price: finalPrice,
              images: JSON.stringify([p.image]),
              provider: site.provider,
              isActive: true,
              isDeleted: false,
              stock: 10
            }
          });
          successCount++;
          totalSynced++;
        } catch (err) {}
      }
      console.log(`✅ Synced ${successCount} valid products from this page.`);
      
      if (successCount === 0 && products.length > 0) {
          console.log("No valid prices found, stopping pagination.");
          break;
      }
      
    } catch (err) {
      console.error(`❌ Error on page ${pageNum}:`, err.message);
      break;
    }
  }
  
  console.log(`\n🎉 Total Synced for ${site.name}: ${totalSynced}`);
  await page.close();
  return totalSynced;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  await scrapeSite(browser, CONFIG[0]);
  await browser.close();
  await prisma.$disconnect();
}

main();
