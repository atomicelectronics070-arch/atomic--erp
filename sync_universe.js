const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

const CONFIG = [
  {
    name: 'JM Technology',
    urlFn: (page) => `https://jmtechnology.ec/collections/all?page=${page}`,
    selectors: {
      container: '.item-product, .product-item, .grid__item',
      name: '.product-title a, .product-name a, h3 a',
      price: '.price-box .price, .price, .product-price',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => p,
    provider: 'JM Technology',
    maxPages: 30
  },
  {
    name: 'Impormel',
    urlFn: (page) => `https://impormel.com/page/${page}/?post_type=product`,
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
    maxPages: 100 // Massive limits
  },
  {
    name: 'IDC Mayoristas',
    urlFn: (page) => `https://www.idcmayoristas.com/shop/page/${page}/`,
    selectors: {
      container: '.jet-listing-grid__item, .product',
      name: '.elementor-heading-title, .jet-listing-dynamic-field__content, .woocommerce-loop-product__title',
      price: '.elementor-heading-title, .jet-listing-dynamic-field__content, .price',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => p * 1.10,
    provider: 'IDC Mayoristas',
    maxPages: 50
  },
  {
    name: 'Easy Laptop',
    urlFn: (page) => `https://easylaptopec.com/tienda/page/${page}/`,
    selectors: {
      container: '.product',
      name: '.woocommerce-loop-product__title',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: '.woocommerce-LoopProduct-link img',
      link: '.woocommerce-LoopProduct-link'
    },
    pricing: (p) => p * 1.15,
    provider: 'Easy Laptop',
    maxPages: 50
  },
  {
    name: 'Meeltech Store',
    urlFn: (page) => `https://meeltechstore.com/collections/all?page=${page}`,
    selectors: {
      container: 'li.grid__item',
      name: 'h3.card__heading a',
      price: 'span.price-item--sale:last-child, span.price-item--regular:last-child, .price',
      image: 'div.card__media img',
      link: 'h3.card__heading a'
    },
    pricing: (p) => p * 1.10,
    provider: 'Meeltech Store',
    maxPages: 50
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
  let consecutiveEmptyPages = 0;
  console.log(`\n======================================`);
  console.log(`🚀 Starting UNIVERSE Sync: ${site.name}`);
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
      // Shorter timeout to fail fast if blocked, we are doing a lot of pages
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000); 

      // Scroll multiple times to make sure lazy loading works
      await page.evaluate(async () => {
        for(let i=0; i<3; i++) {
            window.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 800));
        }
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
        consecutiveEmptyPages++;
        console.log(`⚠️ No products found. (Empty pages: ${consecutiveEmptyPages})`);
        if (consecutiveEmptyPages >= 2) {
             console.log("Too many empty pages, assuming end of catalog.");
             break;
        }
        continue;
      } else {
        consecutiveEmptyPages = 0; // reset
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
      
    } catch (err) {
      console.error(`❌ Error on page ${pageNum}:`, err.message);
      // We don't break immediately on error, maybe just the current page failed. We increment empty pages logic.
      consecutiveEmptyPages++;
      if (consecutiveEmptyPages >= 2) {
          console.log("Too many errors/timeouts, assuming blocked or end.");
          break;
      }
    }
  }
  
  console.log(`\n🎉 Total Synced for ${site.name}: ${totalSynced}`);
  await page.close();
  return totalSynced;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  const results = {};
  for (const site of CONFIG) {
    results[site.name] = await scrapeSite(browser, site);
  }
  
  await browser.close();
  
  console.log("\n======================================");
  console.log("📊 FINAL UNIVERSE SUMMARY");
  console.log("======================================");
  let total = 0;
  for (const [name, count] of Object.entries(results)) {
    console.log(`${name}: ${count} products`);
    total += count;
  }
  console.log(`--------------------------------------`);
  console.log(`TOTAL EXTRA: ${total} products`);
  console.log("======================================");
  
  await prisma.$disconnect();
}

main();
