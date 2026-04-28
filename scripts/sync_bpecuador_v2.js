const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'BP Ecuador';

function estimatePrice(name) {
    const n = name.toLowerCase();
    if (n.includes('generador') || n.includes('planta')) return 850.00;
    if (n.includes('taladro') || n.includes('amoladora')) return 65.00;
    if (n.includes('bomba')) return 120.00;
    if (n.includes('compresor')) return 250.00;
    if (n.includes('pala') || n.includes('carretilla')) return 35.00;
    if (n.includes('herramienta') || n.includes('juego')) return 45.00;
    if (n.includes('guantes') || n.includes('casco')) return 8.00;
    return 25.00;
}

async function run() {
    console.log('🚀 Iniciando Sincronización BP Ecuador (Playwright)...');
    
    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    const context = await browser.newContext({
        ignoreHTTPSErrors: true // Equivalent to rejectUnauthorized: false
    });
    const page = await context.newPage();

    let totalInserted = 0;
    let totalUpdated = 0;

    // BP Ecuador has many products (~2500). Let's go through category or shop pages.
    for (let p = 1; p <= 100; p++) {
        const url = `https://bpecuador.com/tienda/page/${p}/`;
        console.log(`🔍 Escaneando BP Página ${p}...`);

        try {
            const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
            if (response.status() === 404) {
                console.log('🏁 Fin del catálogo.');
                break;
            }

            const products = await page.evaluate(() => {
                const items = [];
                document.querySelectorAll('.product').forEach(el => {
                    const nameEl = el.querySelector('.woocommerce-loop-product__title');
                    const priceEl = el.querySelector('.price');
                    const imgEl = el.querySelector('img');
                    const linkEl = el.querySelector('a');
                    
                    if (nameEl) {
                        let price = 0;
                        if (priceEl) {
                            const raw = priceEl.innerText.replace(/[^\d.,]/g, '').replace(',', '.');
                            price = parseFloat(raw) || 0;
                        }
                        items.push({
                            name: nameEl.innerText.trim(),
                            price: price,
                            image: imgEl ? imgEl.src : null,
                            url: linkEl ? linkEl.href : null
                        });
                    }
                });
                return items;
            });

            if (products.length === 0) break;

            for (const pData of products) {
                let finalPrice = pData.price;
                if (finalPrice === 0) finalPrice = estimatePrice(pData.name);

                try {
                    const existing = await prisma.product.findFirst({
                        where: { provider: PROVIDER, name: pData.name }
                    });

                    const data = {
                        name: pData.name,
                        price: finalPrice,
                        description: `Producto industrial/ferretero de BP Ecuador.`,
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
    }

    console.log('\n🎉 ¡BP ECUADOR COMPLETADO!');
    console.log(`   ✅ ${totalInserted} productos nuevos`);
    console.log(`   🔄 ${totalUpdated} actualizados`);
    
    await browser.close();
    await prisma.$disconnect();
}

run();
