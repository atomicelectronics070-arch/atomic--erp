const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOGIN_URL = 'https://multitecnologiavyv.com/iniciar-sesion';
const BASE_URL = 'https://multitecnologiavyv.com/';
const EMAIL = 'totalscopeedge@gmail.com';
const PASSWORD = 'Jp2024013gg002';
const IVA = 1.15;
const PARENT_CATEGORY_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica

const CATEGORIES = [
    { url: 'https://multitecnologiavyv.com/295-accesorios-computadoras', name: 'Accesorios Computadoras', slug: 'accesorios-computadoras', margin: 1.35 },
    { url: 'https://multitecnologiavyv.com/294-componentes-de-pc',       name: 'Componentes de PC',        slug: 'componentes-de-pc',        margin: 1.30 },
    { url: 'https://multitecnologiavyv.com/296-networking-redes',        name: 'Networking y Redes',       slug: 'networking-redes',         margin: 1.40 },
    { url: 'https://multitecnologiavyv.com/297-cables',                  name: 'Cables',                   slug: 'cables',                   margin: 2.00 },
    { url: 'https://multitecnologiavyv.com/303-audifonos-y-parlantes',   name: 'Audífonos y Parlantes',    slug: 'audifonos-parlantes',      margin: 1.40 },
    { url: 'https://multitecnologiavyv.com/298-accesorios-celulares',    name: 'Accesorios Celulares',     slug: 'accesorios-celulares',     margin: 1.40 },
    { url: 'https://multitecnologiavyv.com/302-accesorios-varios',       name: 'Accesorios Varios',        slug: 'accesorios-varios',        margin: 1.25 },
    { url: 'https://multitecnologiavyv.com/301-mantenimiento',           name: 'Mantenimiento',            slug: 'mantenimiento',            margin: 1.35 },
    { url: 'https://multitecnologiavyv.com/318-vigilancia',              name: 'Vigilancia',               slug: 'vigilancia',               margin: 1.30 },
];

async function run() {
    console.log("🚀 Iniciando Sincronizador MASIVO para todas las categorías de MultiTecnologia V&V...\n");
    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Login once
        console.log("🔑 Iniciando sesión en el distribuidor...");
        await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.fill('input[name="email"]', EMAIL);
        await page.fill('input[name="password"]', PASSWORD);
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        console.log("✅ Sesión iniciada correctamente.\n");

        let grandTotal = 0;

        for (const cat of CATEGORIES) {
            console.log(`\n📂 ===== Procesando: ${cat.name} (margen: ${((cat.margin - 1) * 100).toFixed(0)}%) =====`);

            // Ensure category exists in DB
            let category = await prisma.category.findFirst({ where: { name: cat.name } });
            if (!category) {
                category = await prisma.category.create({
                    data: { name: cat.name, slug: cat.slug, parentId: PARENT_CATEGORY_ID, isVisible: true }
                });
                console.log(`   ➕ Categoría creada: "${cat.name}" (ID: ${category.id})`);
            } else {
                await prisma.category.update({
                    where: { id: category.id },
                    data: { parentId: PARENT_CATEGORY_ID, isVisible: true }
                });
                console.log(`   ℹ️  Categoría existente: "${cat.name}" (ID: ${category.id})`);
            }

            // Navigate to the category
            await page.goto(cat.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            let hasMorePages = true;
            let pageNum = 1;
            let catTotal = 0;

            while (hasMorePages) {
                await page.waitForSelector('.js-product-miniature', { timeout: 10000 }).catch(() => null);

                const products = await page.$$eval('.js-product-miniature', (elements) => {
                    return elements.map(el => ({
                        title: el.querySelector('.product_name a')?.innerText?.trim() || '',
                        priceText: el.querySelector('.price')?.innerText || '0',
                        image: el.querySelector('.wrapper-imgs img')?.src || '',
                    }));
                });

                if (products.length === 0) break;

                for (const p of products) {
                    const rawPrice = parseFloat(p.priceText.replace('$', '').replace(',', '.').trim());
                    if (isNaN(rawPrice) || rawPrice <= 0) continue;

                    const finalPrice = Number((rawPrice * cat.margin * IVA).toFixed(2));

                    await prisma.product.upsert({
                        where: { sku: p.title },
                        update: { name: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: 'MultiTecnologia V&V', stock: 10, createdAt: new Date() },
                        create: { name: p.title, sku: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: 'MultiTecnologia V&V', stock: 10 }
                    });
                    catTotal++;
                    grandTotal++;
                    if (catTotal % 10 === 0) console.log(`   📦 ${catTotal} productos sincronizados en ${cat.name}...`);
                }

                const nextButton = await page.$('a.next');
                if (nextButton) {
                    await nextButton.click();
                    pageNum++;
                    await page.waitForTimeout(2500);
                } else {
                    hasMorePages = false;
                }
            }

            console.log(`   ✅ ${cat.name}: ${catTotal} productos listos.`);
        }

        console.log(`\n🎉 SINCRONIZACIÓN COMPLETA. Total de productos actualizados: ${grandTotal}`);

    } catch (e) {
        console.error("❌ Error en la ejecución:", e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
