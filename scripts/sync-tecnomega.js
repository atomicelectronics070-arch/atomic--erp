const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const matches = priceStr.match(/[\d.,]+/g);
    if (!matches) return 0;
    let cleaned = matches[matches.length - 1];
    if (cleaned.includes(',') && cleaned.includes('.')) {
        cleaned = cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')
            ? cleaned.replace(/\./g, '').replace(',', '.')
            : cleaned.replace(/,/g, '');
    } else if (cleaned.includes(',')) {
        const parts = cleaned.split(',');
        cleaned = (parts.length === 2 && parts[1].length <= 2)
            ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
    }
    return parseFloat(cleaned) || 0;
}

async function main() {
    console.log('🚀 Scraping TecnoMega Store...');
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 },
        locale: 'es-EC',
    });
    const page = await ctx.newPage();

    let total = 0, emptyStreak = 0;

    // TecnoMega uses a REST API for their catalog
    const categories = [
        'celulares', 'tablets', 'laptops', 'computadores', 'perifericos',
        'accesorios', 'audio', 'camaras', 'tv', 'impresoras',
        'almacenamiento', 'redes', 'gaming', 'smartwatch', 'otros'
    ];

    // First try the main store pages
    for (let p = 1; p <= 50; p++) {
        const url = `https://tecnomegastore.ec/page/${p}/`;
        try {
            const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
            if (res && res.status() === 404) break;
            await page.waitForTimeout(2500);

            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.product, li.product, .product-item')).map(el => {
                    let priceText = el.querySelector('.price, .woocommerce-Price-amount')?.innerText || '';
                    if (!priceText.includes('$')) {
                        const m = el.innerText.match(/\$\s?[\d.,]+/);
                        if (m) priceText = m[0];
                    }
                    return {
                        name: el.querySelector('.woocommerce-loop-product__title, h2, h3')?.innerText.trim().split('\n')[0] || '',
                        priceRaw: priceText.trim(),
                        image: el.querySelector('img')?.src || el.querySelector('img')?.dataset?.src || '',
                        link: el.querySelector('a')?.href || ''
                    };
                }).filter(x => x.name.length > 2);
            });

            if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
            emptyStreak = 0;

            let count = 0;
            for (const pr of products) {
                const cost = parsePrice(pr.priceRaw);
                if (cost <= 0) continue;
                const sku = (pr.link.replace(/[?#].*/, '').replace(/\/$/, '').split('/').pop() || pr.name.toLowerCase().replace(/\s+/g, '-')).substring(0, 100);
                try {
                    await prisma.product.upsert({
                        where: { sku },
                        update: { name: pr.name, price: cost, images: JSON.stringify([pr.image]), provider: 'TecnoMega', isDeleted: false, isActive: true },
                        create: { sku, name: pr.name, price: cost, images: JSON.stringify([pr.image]), provider: 'TecnoMega', isActive: true, isDeleted: false, stock: 10 }
                    });
                    count++;
                } catch {}
            }
            console.log(`  p${p}: ${count}/${products.length} ✅`);
            total += count;
        } catch (e) {
            console.log(`  p${p} error: ${e.message}`);
            emptyStreak++;
            if (emptyStreak >= 2) break;
        }
    }

    await browser.close();
    await prisma.$disconnect();
    console.log(`\n🎉 TecnoMega scrape done. Total: ${total} products`);
}

main();
