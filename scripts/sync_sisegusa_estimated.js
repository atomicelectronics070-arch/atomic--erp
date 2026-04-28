const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'Sisegusa';

// Heuristic for estimated prices in USD
function estimatePrice(name) {
    const n = name.toLowerCase();
    if (n.includes('combo')) return 185.00;
    if (n.includes('dvr') || n.includes('nvr')) return 85.00;
    if (n.includes('camara') || n.includes('bullet') || n.includes('domo')) return 35.00;
    if (n.includes('disco duro') || n.includes('hdd')) return 65.00;
    if (n.includes('switch') || n.includes('hub')) return 45.00;
    if (n.includes('acceso') || n.includes('zkteco')) return 120.00;
    if (n.includes('portero') || n.includes('citofono')) return 95.00;
    if (n.includes('alarma') || n.includes('paradox')) return 150.00;
    if (n.includes('router') || n.includes('tplink') || n.includes('ubiquiti')) return 55.00;
    if (n.includes('cable')) return 12.00;
    if (n.includes('bateria')) return 18.00;
    if (n.includes('fuente')) return 10.00;
    if (n.includes('monitor')) return 130.00;
    return 25.00; // Default fallback
}

async function run() {
    console.log('🚀 Iniciando Sincronización ESTIMADA de Sisegusa (Playwright)...');
    
    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    let totalInserted = 0;
    let totalUpdated = 0;

    for (let p = 1; p <= 100; p++) {
        const url = `https://www.sisegusa.com/shop?page=${p}`;
        console.log(`🔍 Escaneando Sisegusa Página ${p}...`);

        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            
            const products = await page.evaluate(() => {
                const items = [];
                // Corrected selector based on HTML inspection
                document.querySelectorAll('.tp-product-item').forEach(card => {
                    const nameEl = card.querySelector('a.tp-link-dark');
                    const skuEl = card.querySelector('h6.tp-product-title p');
                    const imgEl = card.querySelector('.tp-product-image-container img');
                    
                    if (nameEl) {
                        let sku = null;
                        if (skuEl) {
                            sku = skuEl.innerText.replace('SKU:', '').trim();
                        }
                        
                        items.push({
                            name: nameEl.innerText.trim(),
                            sku: sku,
                            image: imgEl ? imgEl.src : null
                        });
                    }
                });
                return items;
            });

            if (products.length === 0) {
                console.log('🏁 No se encontraron más productos. Finalizando...');
                break;
            }

            for (const pData of products) {
                const price = estimatePrice(pData.name);
                
                try {
                    const existing = await prisma.product.findFirst({
                        where: { provider: PROVIDER, name: pData.name }
                    });

                    const data = {
                        name: pData.name,
                        sku: pData.sku || null,
                        price: price,
                        description: `Producto distribuido por Sisegusa. Precio estimado basado en promedio de mercado.`,
                        images: JSON.stringify(pData.image ? [pData.image] : []),
                        provider: PROVIDER,
                        keywords: 'Seguridad',
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
                } catch (e) {
                    // Silently ignore unique constraint errors if any
                }
            }
            
            console.log(`✅ Página ${p} completada: ${products.length} productos.`);
        } catch (e) {
            console.error(`❌ Error en página ${p}: ${e.message}`);
        }
    }

    console.log('\n🎉 ¡SISGEUSA COMPLETADO!');
    console.log(`   ✅ ${totalInserted} productos nuevos`);
    console.log(`   🔄 ${totalUpdated} actualizados`);
    
    await browser.close();
    await prisma.$disconnect();
}

run();
