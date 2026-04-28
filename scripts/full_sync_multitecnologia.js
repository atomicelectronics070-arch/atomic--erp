const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CONFIG = {
    url: 'https://multitecnologiavyv.com/',
    email: 'totalscopeedge@gmail.com',
    password: 'Jp2024013gg002',
    iva: 1.15,
    categories: [
        'https://multitecnologiavyv.com/299-repuestos-laptop',
        'https://multitecnologiavyv.com/295-accesorios-computadoras',
        'https://multitecnologiavyv.com/294-componentes-de-pc',
        'https://multitecnologiavyv.com/296-networking-redes',
        'https://multitecnologiavyv.com/297-cables',
        'https://multitecnologiavyv.com/324-convertidores-de-senal',
        'https://multitecnologiavyv.com/303-audifonos-y-parlantes',
        'https://multitecnologiavyv.com/298-accesorios-celulares',
        'https://multitecnologiavyv.com/302-accesorios-varios',
        'https://multitecnologiavyv.com/301-mantenimiento',
        'https://multitecnologiavyv.com/318-vigilancia',
        'https://multitecnologiavyv.com/319-hub-usb'
    ]
};

function applyRules(cost) {
    let priceWithMargin = 0;
    if (cost < 5) priceWithMargin = cost * 2;
    else if (cost <= 15) priceWithMargin = cost * 1.65;
    else priceWithMargin = cost * 1.45;
    return parseFloat((priceWithMargin * CONFIG.iva).toFixed(2));
}

async function run() {
    console.log("🚀 Iniciando Scraper Pro AI: CARGA MASIVA TOTAL...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        const history = await prisma.extractionHistory.create({
            data: { url: CONFIG.url, domain: 'multitecnologiavyv.com', status: 'PROCESSING', itemCount: 0 }
        });

        await page.goto(CONFIG.url + 'iniciar-sesion');
        await page.fill('input[name="email"]', CONFIG.email);
        await page.fill('input[name="password"]', CONFIG.password);
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        console.log("✅ Sesión de distribuidor activa.");

        let totalProcessed = 0;

        for (const catUrl of CONFIG.categories) {
            console.log(`📂 Procesando categoría: ${catUrl}`);
            await page.goto(catUrl);
            
            let hasMorePages = true;
            while (hasMorePages) {
                // Extraer productos de la página actual
                const products = await page.$$eval('.product-miniature', (elements) => {
                    return elements.map(el => ({
                        title: el.querySelector('.product-title')?.innerText || '',
                        priceText: el.querySelector('.price')?.innerText || '0',
                        image: el.querySelector('.product-thumbnail img')?.src || '',
                        link: el.querySelector('a')?.href || ''
                    }));
                });

                for (const p of products) {
                    const rawPrice = parseFloat(p.priceText.replace('$', '').replace(',', '.').trim());
                    const finalPrice = applyRules(rawPrice);

                    await prisma.product.upsert({
                        where: { sku: p.title },
                        update: {
                            name: p.title,
                            price: finalPrice,
                            images: JSON.stringify([p.image]),
                            isActive: true,
                            isDeleted: false,
                            provider: 'MultiTecnologia V&V'
                        },
                        create: {
                            name: p.title,
                            sku: p.title,
                            price: finalPrice,
                            images: JSON.stringify([p.image]),
                            isActive: true,
                            isDeleted: false,
                            provider: 'MultiTecnologia V&V'
                        }
                    });
                    totalProcessed++;
                    if (totalProcessed % 50 === 0) console.log(`📦 Sincronizados ${totalProcessed} productos...`);
                }

                // Verificar si hay página siguiente
                const nextButton = await page.$('a.next');
                if (nextButton) {
                    await nextButton.click();
                    await page.waitForTimeout(2000);
                } else {
                    hasMorePages = false;
                }
            }
        }

        await prisma.extractionHistory.update({
            where: { id: history.id },
            data: { status: 'COMPLETED', itemCount: totalProcessed }
        });

        console.log(`✨ MISIÓN COMPLETADA: ${totalProcessed} productos actualizados.`);

    } catch (error) {
        console.error("❌ Error en la carga masiva:", error);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
