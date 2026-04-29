const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

async function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Format: "$ 16,06 No incluye IVA"
  let cleaned = priceStr.replace(/[^0-9,.]/g, '').replace(',', '.');
  // Handle cases like "16.06.00" or similar artifacts
  const parts = cleaned.split('.');
  if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
  
  return parseFloat(cleaned) || 0;
}

async function login(page) {
    console.log('🔑 Logging into MultiTecnologia...');
    try {
        await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button[data-link-action="sign-in"]');
        await page.waitForTimeout(8000);
        
        const loggedIn = await page.evaluate(() => document.body.innerText.includes('Cerrar sesión') || document.querySelector('a[href*="mylogout"]') !== null);
        if (loggedIn) {
            console.log('✅ Login successful!');
            return true;
        }
        console.log('⚠️ Login might have failed. Current URL:', page.url());
        return true; // Proceed anyway, some prices might be public or login might be slow
    } catch (err) {
        console.error('❌ Login error:', err.message);
        return true;
    }
}

async function scrapeCategory(page, catUrl, categoryName) {
    console.log(`\n🚀 Starting Deep Sync for ${categoryName}`);
    let totalSynced = 0;
    
    for (let pageNum = 1; pageNum <= 15; pageNum++) { // Scrape up to 15 pages per category
        const paginatedUrl = `${catUrl}${catUrl.includes('?') ? '&' : '?'}page=${pageNum}`;
        console.log(`   ➡️  Scraping Page ${pageNum}: ${paginatedUrl}`);
        
        try {
            await page.goto(paginatedUrl, { waitUntil: 'networkidle', timeout: 60000 });
            await page.waitForTimeout(3000);

            const products = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.js-product-miniature, .product-miniature, article.product-miniature'));
                return items.map(el => {
                    const nameEl = el.querySelector('.product-title, h3, h2, .nrt-product-name, .product-name');
                    const priceEl = el.querySelector('.price, .product-price, .nrt-product-price');
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

            if (products.length === 0) {
                console.log(`   🏁 No more products found on page ${pageNum}. Finishing category.`);
                break;
            }

            console.log(`   🔍 Found ${products.length} products on this page.`);

            for (const p of products) {
                const price = await parsePrice(p.priceRaw);
                if (price <= 0) continue;

                const sku = p.link.split('/').pop().split('.html')[0] || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                await prisma.product.upsert({
                    where: { sku: sku },
                    update: { 
                        name: p.name, 
                        price: price, 
                        images: JSON.stringify([p.image]), 
                        provider: 'MultiTecnologia V&V',
                        isDeleted: false,
                        isActive: true
                    },
                    create: { 
                        sku: sku, 
                        name: p.name, 
                        price: price, 
                        images: JSON.stringify([p.image]), 
                        provider: 'MultiTecnologia V&V', 
                        isActive: true, 
                        isDeleted: false, 
                        stock: 10 
                    }
                });
                totalSynced++;
            }
            
            // If page has very few products, it's likely the last one
            if (products.length < 5) break;

        } catch (err) {
            console.error(`   ❌ Error on page ${pageNum}:`, err.message);
            break;
        }
    }
    console.log(`✅ Total synced for ${categoryName}: ${totalSynced}`);
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    await login(page);

    const categories = [
        { name: 'Audífonos y Parlantes', url: 'https://multitecnologiavyv.com/303-audifonos-y-parlantes' },
        { name: 'Bancos de Poder (Carga)', url: 'https://multitecnologiavyv.com/352-banco-de-carga' },
        { name: 'Accesorios Celulares', url: 'https://multitecnologiavyv.com/298-accesorios-celulares' },
        { name: 'Cables y Cargadores', url: 'https://multitecnologiavyv.com/302-cables-y-cargadores' },
        { name: 'Periféricos Computación', url: 'https://multitecnologiavyv.com/295-perifericos' }
    ];

    for (const cat of categories) {
        await scrapeCategory(page, cat.url, cat.name);
    }

    console.log('\n🌟 Deep Sync Completed Successfully!');
    await browser.close();
    await prisma.$disconnect();
}

main();
