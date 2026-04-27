const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

const CONFIG = [
  {
    name: 'JM Technology',
    url: 'https://jmtechnology.ec/collections/drones',
    selectors: {
      container: '.item-product, .product-item, .grid__item',
      name: '.product-title a, .product-name a, h3 a',
      price: '.price-box .price, .price, .product-price',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => p,
    provider: 'JM Technology'
  },
  {
    name: 'IDC Mayoristas',
    url: 'https://www.idcmayoristas.com/c/linea-blanca/',
    selectors: {
      container: '.jet-listing-grid__item',
      name: '.elementor-heading-title, .jet-listing-dynamic-field__content',
      price: '.elementor-heading-title, .jet-listing-dynamic-field__content',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => p * 1.10,
    provider: 'IDC Mayoristas'
  },
  {
    name: 'Importadora Espinoza',
    url: 'https://www.importadoraespinoza.com/category/entretenimiento-y-hogar',
    selectors: {
      container: '.product-card, div.hover\\:scale-105',
      name: 'h2, h3, h4, .product-title',
      price: '.text-primary.font-bold, p, span',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => {
      if (p <= 25) return p + 10;
      if (p <= 60) return p + 15;
      return p * 1.45;
    },
    provider: 'Importadora Espinoza'
  },
  {
    name: 'Importadora Atenea',
    url: 'https://www.importadoraatenea.com/shop/',
    selectors: {
      container: 'li.product',
      name: '.woocommerce-loop-product__title',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: 'img',
      link: 'a'
    },
    pricing: (p) => p * 1.10,
    provider: 'Importadora Atenea'
  }
];

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  
  // We want the match that looks most like a price (not a model number)
  // Prices usually have a . or , and are relatively small compared to some codes
  // We'll pick the one that has a currency symbol nearby or just the last one if it's sensible
  let bestMatch = matches[matches.length - 1];
  
  // If the last match is very long (e.g. 50181fg -> 50181), it might be a code
  // But for now let's just use the last one and add a sanity check in the main loop
  
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
  console.log(`\n--- Final Sync Attempt: ${site.name} ---`);
  const page = await browser.newPage();
  try {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    // Wait for at least one container
    try {
        await page.waitForSelector(site.selectors.container, { timeout: 15000 });
    } catch(e) {
        console.warn(`Timeout waiting for ${site.selectors.container} on ${site.name}`);
    }

    await page.waitForTimeout(5000);

    // Dynamic scroll and wait
    await page.evaluate(async () => {
      window.scrollBy(0, 500);
      await new Promise(r => setTimeout(r, 1000));
      window.scrollBy(0, 500);
    });

    const products = await page.evaluate((sel) => {
      const items = Array.from(document.querySelectorAll(sel.container));
      return items.map(el => {
        const nameEl = el.querySelector(sel.name);
        // Special logic for price: find something with $ or something that looks like price
        let priceEl = el.querySelector(sel.price);
        let priceText = priceEl ? priceEl.innerText : '';
        
        // If priceText is empty or doesn't look like price, search all children for $
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
          image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src')) : '',
          link: linkEl ? linkEl.href : ''
        };
      });
    }, site.selectors);

    console.log(`Found ${products.length} potential products.`);

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
      } catch (err) {}
    }
    console.log(`Synced ${successCount} products from ${site.name}`);
  } catch (err) {
    console.error(`Error:`, err.message);
  } finally {
    await page.close();
  }
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
