const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CONFIG = {
    url: 'https://multitecnologiavyv.com/',
    email: 'totalscopeedge@gmail.com',
    password: 'Jp2024013gg002',
    iva: 1.15,
    categoryUrl: 'https://multitecnologiavyv.com/299-repuestos-laptop',
    targetCategoryName: 'Repuestos de Laptop',
    targetCategoryId: 'cmoe778p40005wwr94hp2y92j', // Already exists in DB
    marginFactor: 1.35, // 35% margin flat
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
};

async function run() {
    console.log("🚀 Iniciando Sincronizador para Repuestos de Laptop (MultiTecnologia V&V)...");
    const browser = await chromium.launch({ 
        headless: true,
        executablePath: CONFIG.chromePath
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Ensure category is visible
        await prisma.category.update({
            where: { id: CONFIG.targetCategoryId },
            data: { isVisible: true }
        });
        console.log(`ℹ️ Categoría "${CONFIG.targetCategoryName}" asegurada como visible.`);

        // Login
        console.log("🔑 Iniciando sesión en el distribuidor...");
        await page.goto(CONFIG.url + 'iniciar-sesion', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.fill('input[name="email"]', CONFIG.email);
        await page.fill('input[name="password"]', CONFIG.password);
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        console.log("✅ Sesión iniciada correctamente.");

        // Navigate to category page
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
                // Parse raw cost: e.g. "$ 15,00" -> 15.00
                const rawPrice = parseFloat(p.priceText.replace('$', '').replace(',', '.').trim());
                if (isNaN(rawPrice) || rawPrice <= 0) continue;

                // Apply flat 35% margin + 15% IVA
                const priceWithMargin = rawPrice * CONFIG.marginFactor;
                const finalPrice = Number((priceWithMargin * CONFIG.iva).toFixed(2));

                await prisma.product.upsert({
                    where: { sku: p.title },
                    update: {
                        name: p.title,
                        price: finalPrice,
                        images: JSON.stringify([p.image]),
                        categoryId: CONFIG.targetCategoryId,
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
                        categoryId: CONFIG.targetCategoryId,
                        isActive: true,
                        isDeleted: false,
                        provider: 'MultiTecnologia V&V',
                        stock: 10
                    }
                });
                totalItems++;
                console.log(`   [${totalItems}] Sincronizado: "${p.title.substring(0, 50)}" | Costo: $${rawPrice} -> PVP (35% + IVA): $${finalPrice}`);
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

        console.log(`\n🎉 Sincronización exitosa. Total productos en Repuestos de Laptop: ${totalItems}`);

    } catch (e) {
        console.error("❌ Error en la ejecución:", e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
