const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

async function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  let cleaned = matches[matches.length - 1].replace(/,/g, '');
  return parseFloat(cleaned) || 0;
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    const url = 'https://www.importadoraespinoza.com/entretenimiento-y-hogar/28?ctg=1';
    console.log(`🚀 Syncing Importadora Espinoza: ${url}`);

    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        // Handle popup if exists
        await page.evaluate(() => {
            const popup = document.querySelector('.modal-content, [class*="popup"], [class*="modal"]');
            if (popup) {
                const closeBtn = popup.querySelector('button, .close, [class*="close"]');
                if (closeBtn) closeBtn.click();
            }
        });
        await page.waitForTimeout(5000);

        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.product-item, .item, [class*="product"]'));
            return items.map(el => {
                const nameEl = el.querySelector('.name, .product-name, h2, h3, a');
                const priceEl = el.querySelector('.price, .product-price, [class*="price"]');
                const imageEl = el.querySelector('img');
                const linkEl = el.querySelector('a');

                return {
                    name: nameEl ? nameEl.innerText.trim() : '',
                    priceRaw: priceEl ? priceEl.innerText.trim() : '',
                    image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '',
                    link: linkEl ? linkEl.href : ''
                };
            }).filter(p => p.name && p.priceRaw && p.link.includes('/p/'));
        });

        console.log(`🔍 Found ${products.length} products`);

        let synced = 0;
        for (const p of products) {
            const price = await parsePrice(p.priceRaw);
            if (price <= 0) continue;
            const sku = p.link.split('/').pop().split('?')[0];

            await prisma.product.upsert({
                where: { sku: sku },
                update: { name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'Importadora Espinoza', isDeleted: false },
                create: { sku: sku, name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'Importadora Espinoza', isActive: true, isDeleted: false, stock: 10 }
            });
            synced++;
        }
        console.log(`✅ Synced ${synced} products`);
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
    }

    await browser.close();
    await prisma.$disconnect();
}

main();
