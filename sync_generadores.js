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

    const url = 'https://bpecuador.com/categoria-producto/ferreteria/generadores/';
    console.log(`🚀 Navigating to ${url}...`);
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
        console.log("✅ Page loaded.");
        await page.waitForTimeout(5000);

        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.product, .type-product, .jet-woo-builder-product'));
            return items.map(el => {
                const nameEl = el.querySelector('.jet-woo-builder-archive-product-title, .woocommerce-loop-product__title, h2, h3');
                const priceEl = el.querySelector('.jet-woo-builder-archive-product-price, .jet-woo-product-price, .price');
                const imageEl = el.querySelector('img');
                const linkEl = el.querySelector('a[href*="/producto/"], a');

                return {
                    name: nameEl ? nameEl.innerText.trim() : '',
                    priceRaw: priceEl ? priceEl.innerText.trim() : '',
                    image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '',
                    link: linkEl ? linkEl.href : ''
                };
            }).filter(p => p.name && p.priceRaw && p.link.includes('/producto/'));
        });

        console.log(`🔍 Found ${products.length} products`);

        let synced = 0;
        for (const p of products) {
            const price = await parsePrice(p.priceRaw);
            const sku = p.link.replace(/\/$/, '').split('/').pop();

            await prisma.product.upsert({
                where: { sku: sku },
                update: { name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'Banco del Perno', isDeleted: false },
                create: { sku: sku, name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'Banco del Perno', isActive: true, isDeleted: false, stock: 10 }
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
