const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'Cronte Technology';
const TOTAL_PAGES = 16; // ✅ Confirmed by browser: 16 pages × 40 products = 627 total

async function getProductLinksFromPage(page, pageNum) {
    const url = pageNum === 1
        ? 'https://cronte.net/?s&post_type=product'
        : `https://cronte.net/page/${pageNum}/?s&post_type=product`;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000); // wait for JS rendering

    const links = await page.$$eval('a', as =>
        as.map(a => a.href)
          .filter(h => h.includes('/producto/') && !h.includes('add-to-cart') && !h.includes('?'))
    );

    return [...new Set(links)];
}

async function scrapeProductPage(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
        const name = document.querySelector('h1.product_title, h1.entry-title')?.innerText?.trim();
        if (!name) return null;

        // Price: prefer sale (ins) > regular
        let price = 0;
        const saleEl = document.querySelector('p.price ins .woocommerce-Price-amount, p.price ins bdi');
        const regEl  = document.querySelector('p.price > .woocommerce-Price-amount, p.price bdi');
        const el = saleEl || regEl;
        if (el) {
            const raw = el.innerText.replace(/[^\d.,]/g, '').replace(',', '.');
            price = parseFloat(raw) || 0;
        }
        // fallback: any .amount
        if (price === 0) {
            for (const a of document.querySelectorAll('.woocommerce-Price-amount, bdi')) {
                const v = parseFloat(a.innerText.replace(/[^\d.,]/g, '').replace(',', '.'));
                if (v > 0) { price = v; break; }
            }
        }

        const description = document.querySelector('.woocommerce-product-details__short-description, #tab-description')?.innerText?.trim() || '';
        const category = document.querySelector('.posted_in a')?.innerText?.trim() || 'Seguridad';
        const sku = document.querySelector('.sku')?.innerText?.trim() || '';

        const images = [];
        document.querySelectorAll('.woocommerce-product-gallery img').forEach(img => {
            const src = img.getAttribute('data-large_image') || img.getAttribute('data-src') || img.getAttribute('src');
            if (src && src.startsWith('http') && !src.includes('placeholder')) images.push(src);
        });

        return { name, price, description, category, sku, images };
    });

    return data;
}

async function run() {
    console.log('🚀 Iniciando Scraper COMPLETO de Cronte Technology...');
    console.log('📊 Catálogo confirmado: ~627 productos en 16 páginas\n');

    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: false,
        slowMo: 30,
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

    // Warm up
    console.log('🛡️  Pasando Cloudflare (15s warm-up)...');
    await page.goto('https://cronte.net/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(15000);
    console.log('✅ Conexión lista:', await page.title(), '\n');

    // Step 1: Collect all product links
    const allLinks = new Set();
    console.log('🗺️  FASE 1: Recolectando todos los links de productos...\n');

    for (let p = 1; p <= TOTAL_PAGES; p++) {
        try {
            const links = await getProductLinksFromPage(page, p);
            if (links.length === 0) {
                console.log(`  ⚠️  Página ${p} sin productos — posible fin.`);
                break;
            }
            const before = allLinks.size;
            links.forEach(l => allLinks.add(l));
            console.log(`  Página ${p}/${TOTAL_PAGES}: ${links.length} links → Total únicos: ${allLinks.size}`);
        } catch (e) {
            console.log(`  ❌ Error en página ${p}: ${e.message.substring(0, 80)}`);
        }
    }

    const linkList = [...allLinks];
    console.log(`\n✅ TOTAL LINKS RECOLECTADOS: ${linkList.length}`);
    console.log('🔍 FASE 2: Extrayendo detalles de cada producto...\n');

    let inserted = 0;
    let updated = 0;
    let noPrice = 0;
    let errors = 0;

    for (let i = 0; i < linkList.length; i++) {
        const url = linkList[i];
        try {
            const product = await scrapeProductPage(page, url);
            if (!product || !product.name) {
                errors++;
                continue;
            }

            const existing = await prisma.product.findFirst({
                where: { provider: PROVIDER, name: product.name }
            });

            const data = {
                name: product.name,
                price: product.price,
                description: (product.description || '').substring(0, 1000),
                images: JSON.stringify(product.images.slice(0, 10)),
                provider: PROVIDER,
                keywords: product.category || 'Seguridad',
                isActive: true,
                isDeleted: false,
            };

            if (existing) {
                await prisma.product.update({ where: { id: existing.id }, data });
                updated++;
                console.log(`[${i+1}/${linkList.length}] 🔄 "${product.name}" → $${product.price}`);
            } else {
                await prisma.product.create({ data });
                inserted++;
                console.log(`[${i+1}/${linkList.length}] ✅ "${product.name}" → $${product.price}`);
            }

            if (product.price === 0) noPrice++;

        } catch (e) {
            errors++;
            console.log(`[${i+1}/${linkList.length}] ❌ Error: ${e.message.substring(0, 80)}`);
        }
    }

    console.log('\n🎉 ¡CRONTE SINCRONIZACIÓN COMPLETA!');
    console.log(`   ✅ ${inserted} productos nuevos insertados`);
    console.log(`   🔄 ${updated} productos actualizados`);
    console.log(`   ⚠️  ${noPrice} sin precio público`);
    console.log(`   ❌ ${errors} errores`);
    console.log(`   📦 TOTAL: ${inserted + updated} productos de Cronte en tu tienda`);

    await browser.close();
    await prisma.$disconnect();
}

run();
