const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

const CONFIG = [
  {
    name: 'BP Ecuador - Abrazaderas',
    urlFn: (page) => page === 1 ? 'https://bpecuador.com/categoria-producto/ferreteria/abrazaderas/' : `https://bpecuador.com/categoria-producto/ferreteria/abrazaderas/page/${page}/`,
    selectors: {
      container: '.product',
      name: '.woocommerce-loop-product__title, h2, h3',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: '.woocommerce-LoopProduct-link img',
      link: '.woocommerce-LoopProduct-link'
    },
    pricing: (p) => p,
    provider: 'Banco del Perno',
    maxPages: 5
  },
  {
    name: 'BP Ecuador - Promocion',
    urlFn: (page) => page === 1 ? 'https://bpecuador.com/categoria-producto/promocion/' : `https://bpecuador.com/categoria-producto/promocion/page/${page}/`,
    selectors: {
      container: '.product',
      name: '.woocommerce-loop-product__title, h2, h3',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: '.woocommerce-LoopProduct-link img',
      link: '.woocommerce-LoopProduct-link'
    },
    pricing: (p) => p,
    provider: 'Banco del Perno',
    maxPages: 5
  },
  {
    name: 'JM Technology - Drones',
    urlFn: (page) => `https://jmtechnology.ec/collections/drones?page=${page}`,
    selectors: {
      container: '.item-product, .product-item, .grid__item',
      name: '.product-title a, .product-name a, h3 a',
      price: '.price-box .price, .price, .product-price',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => p,
    provider: 'JM Technology',
    maxPages: 3
  },
  {
    name: 'Fabricables',
    urlFn: (page) => 'https://www.fabricables.com/productos/',
    selectors: {
      container: '.columns-3 a, .product-item a, a',
      name: 'h2, h3, .product-title, span',
      price: '.price', // Placeholder, we know it's missing
      image: 'img',
      link: 'self'
    },
    pricing: (p) => 0, // Catalog only
    provider: 'Fabricables',
    maxPages: 1
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
  console.log(`\n🚀 Starting Sync: ${site.name}`);

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  for (let pageNum = 1; pageNum <= site.maxPages; pageNum++) {
    const url = site.urlFn(pageNum);
    console.log(`➡️  Scraping ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(3000); 

      // Scroll
      await page.evaluate(async () => {
        window.scrollBy(0, 1000);
        await new Promise(r => setTimeout(r, 1000));
      });

      const products = await page.evaluate((sel) => {
        const items = Array.from(document.querySelectorAll(sel.container));
        return items.map(el => {
          let nameEl = el.querySelector(sel.name);
          let priceEl = el.querySelector(sel.price);
          let imageEl = el.querySelector(sel.image);
          let linkEl = sel.link === 'self' ? el : el.querySelector(sel.link);

          // Fallback for Fabricables and similar
          if (!nameEl && el.innerText.trim().length > 0) {
              // If the container itself has text
              nameEl = { innerText: el.innerText.trim() };
          }

          let priceText = priceEl ? priceEl.innerText : '';
          if (!priceText.includes('$')) {
              const allText = el.innerText;
              const priceMatch = allText.match(/\$\s?[\d.,]+/);
              if (priceMatch) priceText = priceMatch[0];
          }

          return {
            name: nameEl ? nameEl.innerText.trim().split('\n')[0] : '',
            priceRaw: priceText.trim(),
            image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || imageEl.getAttribute('data-lazy-src')) : '',
            link: linkEl ? linkEl.href : ''
          };
        }).filter(p => p.name && p.name.length > 3);
      }, site.selectors);

      console.log(`🔍 Found ${products.length} items`);
      
      if (products.length === 0) break;

      let successCount = 0;
      for (const p of products) {
        if (!p.name) continue;

        const basePrice = parsePrice(p.priceRaw);
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
      console.log(`✅ Synced ${successCount} products.`);
      
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      break;
    }
  }
  
  await page.close();
  return totalSynced;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  for (const site of CONFIG) {
    await scrapeSite(browser, site);
  }
  await browser.close();
  await prisma.$disconnect();
}

main();
