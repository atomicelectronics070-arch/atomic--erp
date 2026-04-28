const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'BP Ecuador';

async function run() {
    console.log('🚀 Iniciando Sincronización BP Ecuador (Playwright v4)...');
    
    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    let totalInserted = 0;
    let totalUpdated = 0;

    for (let p = 1; p <= 124; p++) {
        const url = `https://bpecuador.com/tienda/?jsf=woocommerce-archive&pagenum=${p}`;
        console.log(`🔍 Escaneando BP Página ${p}/124...`);

        try {
            await page.goto(url, { waitUntil: 'load', timeout: 60000 });
            
            // Wait for any product-like selector
            try {
                await page.waitForSelector('.jet-listing-grid__item, .product, .jet-listing-dynamic-field', { timeout: 20000 });
            } catch (e) {
                console.log(`⚠️ No se detectaron productos en la página ${p}.`);
                // Debug: let's see what's there
                const content = await page.content();
                if (content.includes('404')) {
                    console.log('🏁 Error 404 Detectado. Fin del catálogo.');
                    break;
                }
                continue;
            }

            // Scroll to bottom to trigger AJAX/Lazyload
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(2000);

            const products = await page.evaluate(() => {
                const items = [];
                // Try multiple selectors
                const cards = document.querySelectorAll('.jet-listing-grid__item, .product, .type-product');
                cards.forEach(el => {
                    const nameEl = el.querySelector('a[href*="/producto/"], .jet-listing-dynamic-field__content a, .woocommerce-loop-product__title');
                    const imgEl = el.querySelector('img');
                    
                    let price = 0;
                    const text = el.innerText;
                    const priceMatch = text.match(/\$\s*(\d+[.,]\d{2})/);
                    if (priceMatch) {
                        price = parseFloat(priceMatch[1].replace(',', '.')) || 0;
                    }

                    if (nameEl && nameEl.innerText.trim()) {
                        items.push({
                            name: nameEl.innerText.trim(),
                            price: price,
                            image: imgEl ? imgEl.src : null
                        });
                    }
                });
                return items;
            });

            if (products.length === 0) {
                console.log('🏁 No se encontraron productos en esta página.');
                continue;
            }

            for (const pData of products) {
                try {
                    const existing = await prisma.product.findFirst({
                        where: { provider: PROVIDER, name: pData.name }
                    });

                    const data = {
                        name: pData.name,
                        price: pData.price,
                        description: `Producto industrial de BP Ecuador.`,
                        images: JSON.stringify(pData.image ? [pData.image] : []),
                        provider: PROVIDER,
                        keywords: 'Ferretería Industrial',
                        isActive: true,
                        isDeleted: false,
                    };

                    if (existing) {
                        await prisma.product.update({ where: { id: existing.id }, data });
                        totalUpdated++;
                    } else {
                        await prisma.product.create({ data });
                        totalInserted++;
                    }
                } catch (e) {}
            }
            
            console.log(`✅ Página ${p} completada: ${products.length} productos.`);
        } catch (e) {
            console.error(`❌ Error en página ${p}: ${e.message}`);
        }
        
        await page.waitForTimeout(500);
    }

    console.log('\n🎉 ¡BP ECUADOR COMPLETADO!');
    console.log(`   ✅ ${totalInserted} productos nuevos`);
    console.log(`   🔄 ${totalUpdated} actualizados`);
    
    await browser.close();
    await prisma.$disconnect();
}

run();
