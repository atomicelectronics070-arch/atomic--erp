const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CONFIG = {
    url: 'https://multitecnologiavyv.com/',
    email: 'totalscopeedge@gmail.com',
    password: 'Jp2024013gg002',
    iva: 1.15,
    categoryUrl: 'https://multitecnologiavyv.com/324-convertidores-de-senal',
    targetCategoryName: 'Convertidores de Señal',
    parentCategoryId: 'cmqvwkn530000ejkxk6df8rqz', // Electrónica
    marginFactor: 1.65, // 65% margin flat
};

async function run() {
    console.log("🚀 Iniciando Sincronizador para Convertidores de Señal (MultiTecnologia V&V)...");
    const browser = await chromium.launch({ 
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Ensure the category exists in the database
        let category = await prisma.category.findFirst({
            where: { name: CONFIG.targetCategoryName }
        });
        
        if (!category) {
            console.log(`➕ Creando categoría "${CONFIG.targetCategoryName}" en la base de datos...`);
            category = await prisma.category.create({
                data: {
                    name: CONFIG.targetCategoryName,
                    slug: 'convertidores-senal',
                    parentId: CONFIG.parentCategoryId,
                    isVisible: true
                }
            });
            console.log(`✅ Categoría creada con ID: ${category.id}`);
        } else {
            // Ensure it is visible and mapped under Electrónica
            await prisma.category.update({
                where: { id: category.id },
                data: { parentId: CONFIG.parentCategoryId, isVisible: true }
            });
            console.log(`ℹ️ Categoría encontrada con ID: ${category.id}. Asegurada su visibilidad.`);
        }

        // 2. Login
        console.log("🔑 Iniciando sesión en el distribuidor...");
        await page.goto(CONFIG.url + 'iniciar-sesion', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.fill('input[name="email"]', CONFIG.email);
        await page.fill('input[name="password"]', CONFIG.password);
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        console.log("✅ Sesión iniciada correctamente.");

        // 3. Navigate to category page
        console.log(`📂 Navegando a: ${CONFIG.categoryUrl}...`);
        await page.goto(CONFIG.categoryUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        let hasMorePages = true;
        let pageNum = 1;
        let totalItems = 0;

        while (hasMorePages) {
            console.log(`📄 Leyendo página ${pageNum}...`);
            await page.waitForSelector('.js-product-miniature', { timeout: 10000 }).catch(() => null);

            // Extract products using the correct Prestashop classes
            const products = await page.$$eval('.js-product-miniature', (elements) => {
                return elements.map(el => {
                    const title = el.querySelector('.product_name a')?.innerText || '';
                    const priceText = el.querySelector('.price')?.innerText || '0';
                    const image = el.querySelector('.wrapper-imgs img')?.src || '';
                    const link = el.querySelector('.product_name a')?.href || '';
                    return { title, priceText, image, link };
                });
            });

            console.log(`   Encontrados ${products.length} productos en la página ${pageNum}.`);
            if (products.length === 0) break;

            for (const p of products) {
                // Parse raw cost: e.g. "$ 3,50" -> 3.50
                const rawPrice = parseFloat(p.priceText.replace('$', '').replace(',', '.').trim());
                if (isNaN(rawPrice) || rawPrice <= 0) continue;

                // Apply flat 65% margin + 15% IVA
                const priceWithMargin = rawPrice * CONFIG.marginFactor;
                const finalPrice = Number((priceWithMargin * CONFIG.iva).toFixed(2));

                await prisma.product.upsert({
                    where: { sku: p.title }, // SKU is title as in the original sync scripts
                    update: {
                        name: p.title,
                        price: finalPrice,
                        images: JSON.stringify([p.image]),
                        categoryId: category.id,
                        isActive: true,
                        isDeleted: false,
                        provider: 'MultiTecnologia V&V',
                        stock: 10,
                        createdAt: new Date(), // bump to top
                    },
                    create: {
                        name: p.title,
                        sku: p.title,
                        price: finalPrice,
                        images: JSON.stringify([p.image]),
                        categoryId: category.id,
                        isActive: true,
                        isDeleted: false,
                        provider: 'MultiTecnologia V&V',
                        stock: 10
                    }
                });
                totalItems++;
                console.log(`   [${totalItems}] Sincronizado: "${p.title.substring(0, 50)}" | Costo: $${rawPrice} -> PVP (65% + IVA): $${finalPrice}`);
            }

            // Click next page
            const nextButton = await page.$('a.next');
            if (nextButton) {
                console.log("➡️ Avanzando a la página siguiente...");
                await nextButton.click();
                pageNum++;
                await page.waitForTimeout(3000);
            } else {
                console.log("🏁 No hay más páginas.");
                hasMorePages = false;
            }
        }

        console.log(`\n🎉 Sincronización exitosa. Total productos en Convertidores de Señal: ${totalItems}`);

    } catch (e) {
        console.error("❌ Error en la ejecución:", e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
