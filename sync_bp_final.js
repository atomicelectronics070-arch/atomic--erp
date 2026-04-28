const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const fs = require('fs');

const prisma = new PrismaClient();

async function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  let cleaned = matches[matches.length - 1].replace(/,/g, '');
  return parseFloat(cleaned) || 0;
}

async function scrapePage(page, url) {
    console.log(`  🔍 Visiting ${url}...`);
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(3000);
        
        // Scroll to trigger lazy loading
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(2000);

        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.product, .type-product, .jet-woo-builder-product'));
            return items.map(el => {
                const nameEl = el.querySelector('.jet-woo-builder-archive-product-title, .woocommerce-loop-product__title, h2, h3');
                const priceEl = el.querySelector('.jet-woo-builder-archive-product-price, .jet-woo-product-price, .price');
                const imageEl = el.querySelector('img');
                const linkEl = el.querySelector('a[href*="/producto/"], a');

                return {
                    name: nameEl ? nameEl.innerText.trim().split('\n')[0] : '',
                    priceRaw: priceEl ? priceEl.innerText.trim() : '',
                    image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '',
                    link: linkEl ? linkEl.href : ''
                };
            }).filter(p => p.name && p.priceRaw && p.link.includes('/producto/'));
        });

        console.log(`    ✨ Found ${products.length} products`);
        
        let synced = 0;
        for (const p of products) {
            const price = await parsePrice(p.priceRaw);
            if (price <= 0) continue;
            const sku = p.link.replace(/\/$/, '').split('/').pop();

            await prisma.product.upsert({
                where: { sku: sku },
                update: { name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'Banco del Perno', isDeleted: false },
                create: { sku: sku, name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'Banco del Perno', isActive: true, isDeleted: false, stock: 10 }
            });
            synced++;
        }
        console.log(`    ✅ Synced ${synced} products`);
        return products.length > 0;
    } catch (err) {
        console.error(`    ❌ Error: ${err.message}`);
        return false;
    }
}

async function main() {
    const categories = JSON.parse(fs.readFileSync('bp_top_categories.json', 'utf8'));
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    for (const catUrl of categories) {
        console.log(`\n📂 Category: ${catUrl}`);
        for (let i = 1; i <= 5; i++) {
            const url = i === 1 ? catUrl : `${catUrl}page/${i}/`;
            const hasProducts = await scrapePage(page, url);
            if (!hasProducts) break;
        }
    }

    await browser.close();
    await prisma.$disconnect();
}

main();
