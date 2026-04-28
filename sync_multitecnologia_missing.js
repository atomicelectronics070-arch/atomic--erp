const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

async function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Handle comma as decimal separator
  let cleaned = priceStr.replace(/[^0-9,.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

async function login(page) {
    console.log('🔑 Logging into MultiTecnologia...');
    try {
        await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button[data-link-action="sign-in"]');
        await page.waitForTimeout(10000);
        const currentUrl = page.url();
        const loggedIn = await page.evaluate(() => document.body.innerText.includes('Cerrar sesión'));
        if (loggedIn) {
            console.log('✅ Login successful!');
        } else {
            console.log('⚠️ Login might have failed. URL:', currentUrl);
            const html = await page.content();
            require('fs').writeFileSync('debug_login_fail.html', html);
        }
    } catch (err) {
        console.error('❌ Login failed:', err.message);
    }
}

async function scrapeCategory(page, catUrl, categoryName) {
    console.log(`🚀 Syncing ${categoryName}: ${catUrl}`);
    try {
        await page.goto(catUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000);

        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('article, .product-miniature, .js-product-miniature'));
            return items.map(el => {
                const nameEl = el.querySelector('.product-title, h3 a, h2 a, .nrt-product-name');
                const priceEl = el.querySelector('.price, .product-price, .nrt-product-price');
                const imageEl = el.querySelector('img');
                const linkEl = el.querySelector('a');

                return {
                    name: nameEl ? nameEl.innerText.trim() : '',
                    priceRaw: priceEl ? priceEl.innerText.trim() : '',
                    image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '',
                    link: linkEl ? linkEl.href : ''
                };
            }).filter(p => p.name && p.link);
        });
        
        if (products.length === 0) {
            const html = await page.content();
            require('fs').writeFileSync('debug_category.html', html);
            console.log('      📸 HTML dumped to debug_category.html');
        }

        console.log(`🔍 Found ${products.length} products`);

        let synced = 0;
        for (const p of products) {
            const price = await parsePrice(p.priceRaw);
            if (price <= 0) {
                console.log(`      ⚠️  Skipping ${p.name} (no price)`);
                continue;
            }
            const sku = p.link.split('/').pop().split('.html')[0] || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            await prisma.product.upsert({
                where: { sku: sku },
                update: { name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'MultiTecnologia V&V', isDeleted: false },
                create: { sku: sku, name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'MultiTecnologia V&V', isActive: true, isDeleted: false, stock: 10 }
            });
            synced++;
        }
        console.log(`✅ Synced ${synced} products`);
    } catch (err) {
        console.error(`❌ Error in ${categoryName}: ${err.message}`);
    }
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    await login(page);

    const categories = [
        { name: 'Banco de Poder', url: 'https://multitecnologiavyv.com/352-banco-de-carga' },
        { name: 'Audífonos TWS', url: 'https://multitecnologiavyv.com/421-inalambrico' },
        { name: 'Parlantes', url: 'https://multitecnologiavyv.com/424-parlantes' },
        { name: 'Audífonos VT', url: 'https://multitecnologiavyv.com/412-audifonos-vt' }
    ];

    for (const cat of categories) {
        await scrapeCategory(page, cat.url, cat.name);
    }

    await browser.close();
    await prisma.$disconnect();
}

main();
