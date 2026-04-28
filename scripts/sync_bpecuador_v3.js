const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'BP Ecuador';

async function run() {
    console.log('🚀 Iniciando Sincronización BP Ecuador (JetEngine version)...');
    
    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });
    const page = await context.newPage();

    let totalInserted = 0;
    let totalUpdated = 0;

    // Based on inspection: 124 pages
    for (let p = 1; p <= 125; p++) {
        const url = `https://bpecuador.com/tienda/?jsf=woocommerce-archive&pagenum=${p}`;
        console.log(`🔍 Escaneando BP Página ${p}/124...`);

        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
            
            const products = await page.evaluate(() => {
                const items = [];
                // Selector for JetEngine listing grid items
                document.querySelectorAll('.jet-listing-grid__item').forEach(el => {
                    // Title and Link
                    const nameLink = el.querySelector('.jet-listing-dynamic-field__content a');
                    const name = nameLink ? nameLink.innerText.trim() : null;
                    
                    // Price - usually in one of the dynamic fields
                    let price = 0;
                    el.querySelectorAll('.jet-listing-dynamic-field__content').forEach(field => {
                        const txt = field.innerText;
                        if (txt.includes('$')) {
                            const raw = txt.replace(/[^\d.,]/g, '').replace(',', '.');
                            const val = parseFloat(raw);
                            if (val > 0) price = val;
                        }
                    });

                    // Image
                    const img = el.querySelector('img');
                    
                    if (name) {
                        items.push({
                            name,
                            price,
                            image: img ? img.src : null
                        });
                    }
                });
                return items;
            });

            if (products.length === 0) {
                console.log('🏁 No se encontraron más productos en esta página.');
                break;
            }

            for (const pData of products) {
                try {
                    const existing = await prisma.product.findFirst({
                        where: { provider: PROVIDER, name: pData.name }
                    });

                    const data = {
                        name: pData.name,
                        price: pData.price || 0,
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
        
        // Wait a bit to be gentle
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n🎉 ¡BP ECUADOR COMPLETADO!');
    console.log(`   ✅ ${totalInserted} productos nuevos`);
    console.log(`   🔄 ${totalUpdated} actualizados`);
    
    await browser.close();
    await prisma.$disconnect();
}

run();
