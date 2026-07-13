const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PARENT_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica
const MARGIN = 1.37; // 37%
const IVA = 1.15;

async function run() {
    console.log('🚀 Sincronizando: Fuentes de Poder — MultiTecnologia V&V (37% margen)\n');

    // Ensure category exists
    let category = await prisma.category.findFirst({ where: { name: 'Fuentes de Poder' } });
    if (!category) {
        category = await prisma.category.create({
            data: { name: 'Fuentes de Poder', slug: 'fuentes-de-poder-multi', parentId: PARENT_ID, isVisible: true }
        });
        console.log(`➕ Categoría creada: "Fuentes de Poder" (ID: ${category.id})`);
    } else {
        await prisma.category.update({ where: { id: category.id }, data: { parentId: PARENT_ID, isVisible: true } });
        console.log(`ℹ️  Categoría existente: "Fuentes de Poder" (ID: ${category.id})`);
    }

    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const context = await browser.newContext({ locale: 'es-EC' });
    const page = await context.newPage();

    // Login
    console.log('\n🔑 Iniciando sesión...');
    await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
    await page.fill('input[name="password"]', 'Jp2024013gg002');
    await page.click('button#submit-login');
    await page.waitForTimeout(3000);
    console.log('✅ Sesión activa.\n');

    let hasMorePages = true;
    let pageNum = 1;
    let total = 0;

    while (hasMorePages) {
        const url = pageNum === 1
            ? 'https://multitecnologiavyv.com/311-fuente-de-poder-pc'
            : `https://multitecnologiavyv.com/311-fuente-de-poder-pc?page=${pageNum}`;

        console.log(`📄 Página ${pageNum}: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(2000);
        await page.waitForSelector('.js-product-miniature', { timeout: 10000 }).catch(() => null);

        const products = await page.$$eval('.js-product-miniature', els => els.map(el => ({
            title: el.querySelector('.product_name a')?.innerText?.trim() || '',
            priceText: el.querySelector('.price')?.innerText || '0',
            image: el.querySelector('.wrapper-imgs img')?.src || '',
        }))).catch(() => []);

        if (products.length === 0) { console.log('  ⏹️  Sin productos, fin.'); break; }

        for (const p of products) {
            const rawPrice = parseFloat(p.priceText.replace('$', '').replace(',', '.').trim());
            if (isNaN(rawPrice) || rawPrice <= 0) continue;

            const finalPrice = Number((rawPrice * MARGIN * IVA).toFixed(2));

            await prisma.product.upsert({
                where: { sku: p.title },
                update: { name: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: 'MultiTecnologia V&V', stock: 10 },
                create: { name: p.title, sku: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: 'MultiTecnologia V&V', stock: 10 }
            });

            total++;
            console.log(`  [${total}] "${p.title.substring(0, 50)}" $${rawPrice} → $${finalPrice}`);
        }

        const nextBtn = await page.$('a.next');
        if (nextBtn) { pageNum++; await page.waitForTimeout(2000); }
        else hasMorePages = false;
    }

    await browser.close();
    await prisma.$disconnect();

    console.log(`\n🎉 COMPLETO — Fuentes de Poder: ${total} productos con 37% margen + IVA`);
}

run();
