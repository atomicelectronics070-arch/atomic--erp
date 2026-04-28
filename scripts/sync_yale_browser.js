const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
    console.log("🚀 Iniciando Extracción Yale vía Browser (Multipágina)...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let totalSync = 0;

    try {
        const history = await prisma.extractionHistory.create({
            data: { url: 'https://yale.com.ec/tienda/', domain: 'yale.com.ec', status: 'PROCESSING', itemCount: 0 }
        });

        for (let p = 1; p <= 15; p++) {
            console.log(`\n🔍 Escaneando página ${p}...`);
            const url = p === 1 ? 'https://yale.com.ec/tienda/' : `https://yale.com.ec/tienda/page/${p}/`;
            
            const response = await page.goto(url);
            
            // If the page returns 404, we've reached the end of the pages
            if (response && response.status() === 404) {
                console.log(`⏹️ Fin de paginación en página ${p} (Error 404)`);
                break;
            }

            await page.waitForTimeout(3000);

            // Get all product links
            const links = await page.$$eval('a[href*="/producto/"]', (anchors) => {
                return [...new Set(anchors.map(a => a.href))];
            });

            if (links.length === 0) {
                console.log(`⚠️ No se encontraron enlaces en la página ${p}. Fin de paginación.`);
                break;
            }

            console.log(`📦 Encontrados ${links.length} productos en la página ${p}.`);
            
            for (const link of links) {
                console.log(`🔍 Extrayendo: ${link}`);
                await page.goto(link);
                await page.waitForTimeout(2000);

                const data = await page.evaluate(() => {
                    const title = document.querySelector('.product_title')?.innerText.trim();
                    const priceRaw = document.querySelector('.woocommerce-Price-amount bdi')?.innerText.replace('$', '').replace(',', '').trim();
                    const description = document.querySelector('.woocommerce-product-details__short-description')?.innerHTML || '';
                    const imgs = [...document.querySelectorAll('.woocommerce-product-gallery__image img')].map(img => img.src);
                    return { title, price: parseFloat(priceRaw) || 0, description, images: imgs };
                });

                if (data.title) {
                    const finalPrice = parseFloat((data.price * 1.09).toFixed(2));
                    await prisma.product.upsert({
                        where: { sku: data.title },
                        update: {
                            name: data.title,
                            price: finalPrice,
                            description: data.description,
                            images: JSON.stringify(data.images),
                            isActive: true,
                            isDeleted: false,
                            provider: 'Yale Ecuador'
                        },
                        create: {
                            name: data.title,
                            sku: data.title,
                            price: finalPrice,
                            description: data.description,
                            images: JSON.stringify(data.images),
                            isActive: true,
                            isDeleted: false,
                            provider: 'Yale Ecuador'
                        }
                    });
                    totalSync++;
                    console.log(`✅ Sincronizado: ${data.title}`);
                }
            }
        }

        await prisma.extractionHistory.update({
            where: { id: history.id },
            data: { status: 'COMPLETED', itemCount: totalSync }
        });

        console.log(`\n✨ MISIÓN COMPLETADA: ${totalSync} productos de Yale sincronizados.`);

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
