const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const fs = require('fs');

const prisma = new PrismaClient();

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  let parts = priceStr.split(/[–\-]/);
  let firstPart = parts[0].replace(/IVA.*$/i, '').trim();
  const matches = firstPart.match(/[\d.,]+/g);
  if (!matches) return 0;
  let cleaned = matches[matches.length - 1];
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')
      ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned.replace(/,/g, '');
  } else if (cleaned.includes(',')) {
    const p = cleaned.split(',');
    cleaned = p.length === 2 && p[1].length <= 2 ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
  }
  return parseFloat(cleaned) || 0;
}

async function scrapePage(page, url) {
  try {
    console.log(`  🔍 Visiting ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Additional wait for any AJAX filters
    await page.waitForTimeout(8000); 

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product, .type-product'));
      return items.map(el => {
        let nameEl = el.querySelector('.woocommerce-loop-product__title, h2, h3, .jet-woo-builder-product-title');
        let priceEl = el.querySelector('.price, .woocommerce-Price-amount, .jet-woo-builder-product-price');
        let imageEl = el.querySelector('img');
        let linkEl = el.querySelector('a[href*="/producto/"], .woocommerce-LoopProduct-link, a');

        let priceText = priceEl ? priceEl.innerText : '';
        if (!priceText.includes('$')) {
            const allText = el.innerText;
            const priceMatch = allText.match(/\$\s?[\d.,]+/);
            if (priceMatch) priceText = priceMatch[0];
        }

        return {
          name: nameEl ? nameEl.innerText.trim().split('\n')[0] : '',
          priceRaw: priceText.trim(),
          image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || imageEl.getAttribute('srcset')?.split(' ')[0] || '') : '',
          link: linkEl ? linkEl.href : ''
        };
      }).filter(p => p.name && p.name.length > 3 && p.priceRaw.includes('$'));
    });

    console.log(`  ✨ Found ${products.length} products.`);
    return products;
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return [];
  }
}

async function main() {
  const subcategories = JSON.parse(fs.readFileSync('bpecuador_subcategories.json', 'utf8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  let grandTotal = 0;
  for (const catUrl of subcategories) {
    console.log(`\n📂 ${catUrl}`);
    for (let pageNum = 1; pageNum <= 20; pageNum++) {
      const url = pageNum === 1 ? catUrl : `${catUrl}page/${pageNum}/`;
      const products = await scrapePage(page, url);
      if (!products || products.length === 0) break;

      let synced = 0;
      for (const p of products) {
        if (!p.name) continue;
        const price = parsePrice(p.priceRaw);
        if (price <= 0) {
            console.log(`    ⚠️ Skipping ${p.name} due to price: "${p.priceRaw}" -> ${price}`);
            continue;
        }
        const sku = p.link ? p.link.replace(/\/$/, '').split('/').pop() : p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 100);
        try {
          await prisma.product.upsert({
            where: { sku: sku },
            update: { name: p.name, price: price, images: JSON.stringify(p.image ? [p.image] : []), provider: 'Banco del Perno', isDeleted: false, isActive: true },
            create: { sku: sku, name: p.name, price: price, images: JSON.stringify(p.image ? [p.image] : []), provider: 'Banco del Perno', isActive: true, isDeleted: false, stock: 10 }
          });
          synced++;
        } catch (e) {
          console.error(`    ❌ Error syncing ${p.name}: ${e.message}`);
        }
      }
      grandTotal += synced;
      console.log(`  ✅ Page ${pageNum}: ${products.length} found, ${synced} synced. (Total so far: ${grandTotal})`);
    }
  }
  await browser.close();
  await prisma.$disconnect();
}

main().catch(console.error);
