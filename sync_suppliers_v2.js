const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

const CONFIG = [
  {
    name: 'JM Technology',
    url: 'https://jmtechnology.ec/collections/drones',
    selectors: {
      container: '.item-product',
      name: '.product-title a',
      price: '.price-box .price, .price',
      image: '.product-image img',
      link: '.product-title a'
    },
    pricing: (p) => p,
    provider: 'JM Technology'
  },
  {
    name: 'Impormel',
    url: 'https://impormel.com/?s=reloj&post_type=product',
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
    provider: 'Impormel'
  },
  {
    name: 'IDC Mayoristas',
    url: 'https://www.idcmayoristas.com/c/linea-blanca/',
    selectors: {
      container: '.jet-listing-grid__item',
      name: '.jet-listing-dynamic-field__content',
      price: '.elementor-heading-title:last-child, .jet-listing-dynamic-field__content',
      image: '.jet-listing-dynamic-image img',
      link: '.jet-listing-dynamic-link__link'
    },
    pricing: (p) => p * 1.10,
    provider: 'IDC Mayoristas'
  },
  {
    name: 'Easy Laptop',
    url: 'https://easylaptopec.com/catalogo/eaci/',
    selectors: {
      container: '.product',
      name: '.woocommerce-loop-product__title',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: '.woocommerce-LoopProduct-link img',
      link: '.woocommerce-LoopProduct-link'
    },
    pricing: (p) => p * 1.15,
    provider: 'Easy Laptop'
  },
  {
    name: 'Importadora Espinoza',
    url: 'https://www.importadoraespinoza.com/category/accesorios-para-celular',
    selectors: {
      container: 'div.hover\\:scale-105, .product-card',
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
    url: 'https://www.importadoraatenea.com/tienda/',
    selectors: {
      container: 'li.product',
      name: 'h2.woocommerce-loop-product__title',
      price: '.price .woocommerce-Price-amount:last-child, .price',
      image: '.woocommerce-LoopProduct-link img',
      link: 'a.woocommerce-LoopProduct-link'
    },
    pricing: (p) => p * 1.10,
    provider: 'Importadora Atenea'
  },
  {
    name: 'Meeltech Store',
    url: 'https://meeltechstore.com/collections/hogar',
    selectors: {
      container: 'li.grid__item',
      name: 'h3.card__heading a',
      price: 'span.price-item--sale:last-child, span.price-item--regular:last-child, .price',
      image: 'div.card__media img',
      link: 'h3.card__heading a'
    },
    pricing: (p) => p * 1.10,
    provider: 'Meeltech Store'
  }
];

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  
  // Try to find all number-like patterns (e.g. 12.34)
  // We handle formats like "$15.00$10.00" by taking the last one
  // and formats like "1.234,56" or "1,234.56"
  
  // First, if there are multiple currency symbols or chunks, split them
  // A simple way: find all sequences of digits, dots and commas
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  
  const lastMatch = matches[matches.length - 1];
  
  // Clean the last match: remove thousand separators
  // If it has both . and , we assume the last one is the decimal
  let cleaned = lastMatch;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      // Format 1.234,56
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Format 1,234.56
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // Check if it's a decimal comma (e.g. 10,50) or a thousand separator (e.g. 1,000)
    // Most sites in EC use . for decimal or , for decimal. 
    // If there's only one comma and it's followed by exactly 2 digits, it's likely decimal.
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
  console.log(`\n--- Scraping ${site.name} ---`);
  const page = await browser.newPage();
  try {
    // Set a common user agent
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 90000 });
    
    // Extra wait for dynamic content
    await page.waitForTimeout(5000);

    // Scroll down to trigger lazy loading
    await page.evaluate(async () => {
      for (let i = 0; i < 3; i++) {
        window.scrollBy(0, window.innerHeight);
        await new Promise(r => setTimeout(r, 1000));
      }
    });

    const products = await page.$$eval(site.selectors.container, (elements, sel) => {
      return elements.map(el => {
        const nameEl = el.querySelector(sel.name);
        const priceEl = el.querySelector(sel.price);
        const imageEl = el.querySelector(sel.image);
        const linkEl = el.querySelector(sel.link);

        // For price, we try to get the cleanest text possible
        let priceText = '';
        if (priceEl) {
           // If it's a WooCommerce style price, it might have <del> and <ins>
           // The selector should have handled it but let's be safe
           priceText = priceEl.innerText.trim();
        }

        return {
          name: nameEl ? nameEl.innerText.trim() : '',
          priceRaw: priceText,
          image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || imageEl.getAttribute('data-lazy-src')) : '',
          link: linkEl ? linkEl.href : ''
        };
      });
    }, site.selectors);

    console.log(`Found ${products.length} potential products.`);

    let successCount = 0;
    for (const p of products) {
      if (!p.name || !p.priceRaw) continue;

      const basePrice = parsePrice(p.priceRaw);
      
      // Sanity check: if price is ridiculously high (> 50000) it's probably a parsing error for these categories
      if (basePrice > 50000) {
          console.warn(`[SKIP] Price too high for ${p.name}: ${p.priceRaw} -> ${basePrice}`);
          continue;
      }

      const finalPrice = site.pricing(basePrice);

      if (finalPrice <= 0) continue;

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
        if (successCount % 5 === 0) console.log(`Processed ${successCount} products...`);
      } catch (err) {
        // console.error(`[ERR] Failed to save ${p.name}:`, err.message);
      }
    }
    console.log(`Successfully synced ${successCount} products from ${site.name}`);
  } catch (err) {
    console.error(`Error scraping ${site.name}:`, err.message);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'] 
  });
  
  for (const site of CONFIG) {
    await scrapeSite(browser, site);
  }
  
  await browser.close();
  await prisma.$disconnect();
}

main();
