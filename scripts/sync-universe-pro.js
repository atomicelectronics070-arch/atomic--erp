const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

const MULTI_CATEGORIES = [
    { name: 'Audífonos y Parlantes', url: 'https://multitecnologiavyv.com/303-audifonos-y-parlantes' },
    { name: 'Bancos de Poder', url: 'https://multitecnologiavyv.com/352-banco-de-carga' },
    { name: 'Accesorios Celulares', url: 'https://multitecnologiavyv.com/298-accesorios-celulares' },
    { name: 'Cables y Cargadores', url: 'https://multitecnologiavyv.com/302-cables-y-cargadores' },
    { name: 'Periféricos', url: 'https://multitecnologiavyv.com/295-perifericos' },
    { name: 'Computación', url: 'https://multitecnologiavyv.com/313-computacion' },
    { name: 'Repuestos Laptop', url: 'https://multitecnologiavyv.com/314-repuestos-laptop' },
    { name: 'Seguridad', url: 'https://multitecnologiavyv.com/315-seguridad' },
    { name: 'Drones y Gadgets', url: 'https://multitecnologiavyv.com/306-drones-y-gadgets' }
];

async function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let cleaned = priceStr.replace(/[^0-9,.]/g, '').replace(',', '.');
    const parts = cleaned.split('.');
    if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
    return parseFloat(cleaned) || 0;
}

async function scrapeMulti(page) {
    console.log('\n🚀 DEEP SWEEP: MultiTecnología V&V');
    
    // Login
    try {
        await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button[data-link-action="sign-in"]');
        await page.waitForTimeout(5000);
    } catch (e) {}

    for (const cat of MULTI_CATEGORIES) {
        console.log(`\n📂 Category: ${cat.name}`);
        for (let pageNum = 1; pageNum <= 10; pageNum++) {
            const url = `${cat.url}?page=${pageNum}`;
            console.log(`  ➡️  Page ${pageNum}: ${url}`);
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForTimeout(2000);
                
                const products = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.js-product-miniature, .product-miniature'));
                    return items.map(el => ({
                        name: el.querySelector('.product-title, h3, .nrt-product-name')?.innerText.trim(),
                        priceRaw: el.querySelector('.price, .product-price')?.innerText.trim(),
                        image: el.querySelector('img')?.src,
                        link: el.querySelector('a')?.href
                    })).filter(p => p.name && p.link);
                });

                if (products.length === 0) break;

                for (const p of products) {
                    const price = await parsePrice(p.priceRaw);
                    if (price <= 0) continue;
                    const sku = p.link.split('/').pop().split('.html')[0];
                    await prisma.product.upsert({
                        where: { sku: sku },
                        update: { name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'MultiTecnología V&V', isDeleted: false, isActive: true },
                        create: { sku: sku, name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'MultiTecnología V&V', isActive: true, isDeleted: false, stock: 10 }
                    });
                }
                console.log(`    ✅ Processed ${products.length} products`);
                if (products.length < 5) break;
            } catch (e) { break; }
        }
    }
}

async function scrapeBP(page) {
    console.log('\n🚀 DEEP SWEEP: BP Ecuador');
    const categories = [
        'https://bpecuador.com.ec/categoria-producto/herramientas-electricas/',
        'https://bpecuador.com.ec/categoria-producto/hogar-y-jardin/',
        'https://bpecuador.com.ec/categoria-producto/seguridad-industrial/'
    ];

    for (const url of categories) {
        console.log(`\n📂 Category: ${url}`);
        for (let pageNum = 1; pageNum <= 10; pageNum++) {
            const paginatedUrl = pageNum === 1 ? url : `${url}page/${pageNum}/`;
            console.log(`  ➡️  Page ${pageNum}: ${paginatedUrl}`);
            try {
                await page.goto(paginatedUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(2000);
                const products = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.product'));
                    return items.map(el => ({
                        name: el.querySelector('.woocommerce-loop-product__title')?.innerText.trim(),
                        priceRaw: el.querySelector('.price')?.innerText.trim(),
                        image: el.querySelector('img')?.src,
                        link: el.querySelector('a')?.href
                    })).filter(p => p.name && p.link);
                });
                if (products.length === 0) break;
                for (const p of products) {
                    const price = await parsePrice(p.priceRaw);
                    if (price <= 0) continue;
                    const sku = p.link.replace(/\/$/, '').split('/').pop();
                    await prisma.product.upsert({
                        where: { sku: sku },
                        update: { name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'BP Ecuador', isDeleted: false, isActive: true },
                        create: { sku: sku, name: p.name, price: price, images: JSON.stringify([p.image]), provider: 'BP Ecuador', isActive: true, isDeleted: false, stock: 10 }
                    });
                }
                console.log(`    ✅ Processed ${products.length} products`);
            } catch (e) { break; }
        }
    }
}

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' });

    await scrapeMulti(page);
    await scrapeBP(page);

    await browser.close();
    await prisma.$disconnect();
    console.log('\n🌟 MASTER UNIVERSE PRO SWEEP COMPLETED!');
}

main();
