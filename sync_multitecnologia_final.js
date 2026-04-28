const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const fs = require('fs');

const prisma = new PrismaClient();

async function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Format: "$ 16,06 No incluye IVA"
  let cleaned = priceStr.replace(/[^0-9,]/g, '').replace(',', '.');
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
        
        const loggedIn = await page.evaluate(() => document.querySelector('a[href*="mylogout"]') !== null || document.body.innerText.includes('Cerrar sesión'));
        if (loggedIn) {
            console.log('✅ Login successful!');
            return true;
        } else {
            console.log('⚠️ Login failed or redirected elsewhere. URL:', page.url());
            return false;
        }
    } catch (err) {
        console.error('❌ Login failed:', err.message);
        return false;
    }
}

async function scrapeCategory(page, catUrl, categoryName) {
    console.log(`🚀 Syncing ${categoryName}: ${catUrl}`);
    try {
        await page.goto(catUrl, { waitUntil: 'networkidle', timeout: 90000 });
        try {
            await page.waitForSelector('article, .js-product-miniature', { timeout: 20000 });
        } catch (e) {
            console.log(`      ⚠️  Wait for products timed out for ${categoryName}`);
        }
        await page.waitForTimeout(5000);

        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.js-product-miniature, .product-miniature, article'));
            if (items.length > 0) {
                console.log('DEBUG: First item HTML:', items[0].innerHTML.substring(0, 500));
            } else {
                console.log('DEBUG: DOM length:', document.body.innerHTML.length);
            }
            return items.map(el => {
                const nameEl = el.querySelector('.product-title, h3, h2, .nrt-product-name, .product-name');
                const priceEl = el.querySelector('.price, .product-price, .nrt-product-price, [itemprop="price"]');
                const imageEl = el.querySelector('img');
                const linkEl = el.querySelector('a');

                let name = nameEl ? nameEl.innerText.trim() : '';
                if (!name && linkEl && linkEl.title) name = linkEl.title.trim();

                return {
                    name: name,
                    priceRaw: priceEl ? priceEl.innerText.trim() : '',
                    image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '',
                    link: linkEl ? linkEl.href : ''
                };
            }).filter(p => p.name && p.link);
        });

        console.log(`🔍 Found ${products.length} product entries`);

        let synced = 0;
        for (const p of products) {
            const price = await parsePrice(p.priceRaw);
            if (price <= 0) {
                // console.log(`      ⚠️  Skipping ${p.name} (no price)`);
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
        console.log(`✅ Synced ${synced} products for ${categoryName}`);
    } catch (err) {
        console.error(`❌ Error in ${categoryName}: ${err.message}`);
    }
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    const isLogged = await login(page);
    if (!isLogged) {
        console.log('🛑 Aborting due to login failure.');
        await browser.close();
        return;
    }

    const categories = [
        { name: 'Accesorios Celulares', url: 'https://multitecnologiavyv.com/298-accesorios-celulares' },
        { name: 'Banco de Poder', url: 'https://multitecnologiavyv.com/352-banco-de-carga' },
        { name: 'Audífonos y Parlantes', url: 'https://multitecnologiavyv.com/303-audifonos-y-parlantes' },
        { name: 'Networking', url: 'https://multitecnologiavyv.com/296-networking-redes' }
    ];

    for (const cat of categories) {
        await scrapeCategory(page, cat.url, cat.name);
    }

    await browser.close();
    await prisma.$disconnect();
}

main();
