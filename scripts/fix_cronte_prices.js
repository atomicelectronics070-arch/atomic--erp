const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Convert product name to slug (same as WooCommerce does it)
function nameToSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9\s-]/g, '')                    // remove special chars
        .trim()
        .replace(/\s+/g, '-')                             // spaces to hyphens
        .replace(/-+/g, '-');                             // collapse hyphens
}

async function run() {
    console.log("💰 Corrigiendo precios de Cronte Technology (v2)...");

    const products = await prisma.product.findMany({
        where: { provider: 'Cronte Technology', price: 0, isDeleted: false }
    });
    console.log(`📦 ${products.length} productos sin precio a corregir.`);

    if (products.length === 0) {
        console.log("✅ Todos los precios ya están correctos.");
        await prisma.$disconnect();
        return;
    }

    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: false,
        slowMo: 50,
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        locale: 'es-EC',
        timezoneId: 'America/Guayaquil',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    // Warm-up to pass Cloudflare
    console.log("🛡️ Calentando conexión (15s)...");
    await page.goto('https://cronte.net/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(15000);
    console.log("✅ Conexión lista:", await page.title());

    let fixed = 0;
    let noPrice = 0;
    let errors = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const slug = nameToSlug(product.name);
        const url = `https://cronte.net/producto/${slug}/`;

        console.log(`\n[${i+1}/${products.length}] Probando: ${product.name}`);
        console.log(`  URL: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
            await page.waitForTimeout(2000);

            const pageTitle = await page.title();
            
            // Check if we landed on a 404 or error page
            if (pageTitle.includes('404') || pageTitle.includes('no encontrado') || pageTitle.includes('Page not found')) {
                console.log(`  ⚠️ Página no encontrada para slug: ${slug}`);
                // Try searching the shop for this product
                errors++;
                continue;
            }

            const data = await page.evaluate(() => {
                const title = document.querySelector('h1.product_title, h1.entry-title')?.innerText?.trim();
                if (!title) return null;

                let price = 0;
                // Priority: sale price (ins) > regular price
                const salePrice = document.querySelector('p.price ins .woocommerce-Price-amount, p.price ins bdi');
                const regPrice = document.querySelector('p.price > .woocommerce-Price-amount, p.price > span > .woocommerce-Price-amount, p.price bdi');
                
                const el = salePrice || regPrice;
                if (el) {
                    const raw = el.innerText.replace(/[^\d.,]/g, '').replace(',', '.');
                    price = parseFloat(raw) || 0;
                }
                
                // Also check for any .amount with a number
                if (price === 0) {
                    const amounts = [...document.querySelectorAll('.woocommerce-Price-amount, bdi')];
                    for (const a of amounts) {
                        const raw = a.innerText.replace(/[^\d.,]/g, '').replace(',', '.');
                        const val = parseFloat(raw);
                        if (val > 0) { price = val; break; }
                    }
                }

                return { title, price };
            });

            if (data && data.price > 0) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { price: data.price }
                });
                fixed++;
                console.log(`  ✅ Precio actualizado: $${data.price}`);
            } else if (data) {
                noPrice++;
                console.log(`  ⚠️ Sin precio público en esta página`);
            } else {
                errors++;
                console.log(`  ❌ No se encontró la página del producto`);
            }

        } catch(e) {
            errors++;
            console.log(`  ❌ Error: ${e.message.substring(0, 100)}`);
        }
    }

    console.log(`\n✨ CORRECCIÓN COMPLETADA:`);
    console.log(`   ✅ ${fixed} precios actualizados`);
    console.log(`   ⚠️ ${noPrice} sin precio público`);
    console.log(`   ❌ ${errors} errores`);

    await browser.close();
    await prisma.$disconnect();
}

run();
