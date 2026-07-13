const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOGIN_URL = 'https://multitecnologiavyv.com/iniciar-sesion';
const IVA = 1.15;
const PARENT_CATEGORY_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica

// Only the 3 remaining categories
const CATEGORIES = [
    { url: 'https://multitecnologiavyv.com/302-accesorios-varios',  name: 'Accesorios Varios', slug: 'accesorios-varios-multi',  margin: 1.25 },
    { url: 'https://multitecnologiavyv.com/301-mantenimiento',      name: 'Mantenimiento',      slug: 'mantenimiento-multi',     margin: 1.35 },
    { url: 'https://multitecnologiavyv.com/318-vigilancia',         name: 'Vigilancia',         slug: 'vigilancia-multi',        margin: 1.30 },
];

async function ensureCategory(cat) {
    // First try to find by name
    let category = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!category) {
        // Try with a unique slug by appending timestamp if needed
        try {
            category = await prisma.category.create({
                data: { name: cat.name, slug: cat.slug, parentId: PARENT_CATEGORY_ID, isVisible: true }
            });
            console.log(`   ➕ Categoría creada: "${cat.name}" (ID: ${category.id})`);
        } catch (e) {
            // If slug conflict, try with timestamp suffix
            const uniqueSlug = `${cat.slug}-${Date.now()}`;
            category = await prisma.category.create({
                data: { name: cat.name, slug: uniqueSlug, parentId: PARENT_CATEGORY_ID, isVisible: true }
            });
            console.log(`   ➕ Categoría creada (slug alternativo): "${cat.name}" (ID: ${category.id})`);
        }
    } else {
        await prisma.category.update({
            where: { id: category.id },
            data: { parentId: PARENT_CATEGORY_ID, isVisible: true }
        });
        console.log(`   ℹ️  Categoría existente: "${cat.name}" (ID: ${category.id})`);
    }
    return category;
}

async function run() {
    console.log("🚀 Reanudando sincronización: Accesorios Varios, Mantenimiento y Vigilancia...\n");
    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Login
        console.log("🔑 Iniciando sesión...");
        await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        console.log("✅ Sesión activa.\n");

        let grandTotal = 0;

        for (const cat of CATEGORIES) {
            console.log(`\n📂 ===== Procesando: ${cat.name} (margen: ${((cat.margin - 1) * 100).toFixed(0)}%) =====`);

            const category = await ensureCategory(cat);

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

        console.log(`\n🎉 COMPLETADO. Total de nuevos productos actualizados: ${grandTotal}`);

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
