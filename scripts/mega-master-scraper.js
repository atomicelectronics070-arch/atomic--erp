/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         ATOMIC ERP — MEGA MASTER SCRAPER v1.0           ║
 * ║   Barrido Total de ADN de todos los proveedores          ║
 * ╚══════════════════════════════════════════════════════════╝
 * Proveedores cubiertos (12 en total):
 *  1. MultiTecnología V&V  (con login dealer)
 *  2. BP Ecuador
 *  3. JM Technology
 *  4. Impormel
 *  5. IDC Mayoristas
 *  6. Easy Laptop
 *  7. Importadora Espinoza
 *  8. Importadora Atenea
 *  9. Meeltech Store
 * 10. Yale Ecuador
 * 11. La Competencia
 * 12. Cronte Technology
 */

const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const fs = require('fs');

const prisma = new PrismaClient();
const LOG_FILE = 'mega_scraper_log.txt';

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const matches = priceStr.match(/[\d.,]+/g);
    if (!matches) return 0;
    let cleaned = matches[matches.length - 1];
    if (cleaned.includes(',') && cleaned.includes('.')) {
        cleaned = cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')
            ? cleaned.replace(/\./g, '').replace(',', '.')
            : cleaned.replace(/,/g, '');
    } else if (cleaned.includes(',')) {
        const parts = cleaned.split(',');
        cleaned = (parts.length === 2 && parts[1].length <= 2)
            ? cleaned.replace(',', '.')
            : cleaned.replace(/,/g, '');
    }
    return parseFloat(cleaned) || 0;
}

async function upsertProduct({ name, price, image, link, provider, markup }) {
    if (!name || price <= 0 || price > 50000) return false;
    const finalPrice = markup ? markup(price) : price;
    const sku = link
        ? link.replace(/[?#].*/, '').replace(/\/$/, '').split('/').pop() || name.toLowerCase().replace(/\s+/g, '-').substring(0, 80)
        : name.toLowerCase().replace(/\s+/g, '-').substring(0, 80);
    if (!sku) return false;
    try {
        await prisma.product.upsert({
            where: { sku },
            update: { name, price: finalPrice, images: JSON.stringify([image || '']), provider, isDeleted: false, isActive: true },
            create: { sku, name, price: finalPrice, images: JSON.stringify([image || '']), provider, isActive: true, isDeleted: false, stock: 10 }
        });
        return true;
    } catch { return false; }
}

// ─── GENERIC WooCommerce PAGINATOR ───────────────────────────────────────────
async function scrapeWoo(page, { baseUrl, paginateFn, provider, markup, maxPages = 50, container = '.product', selName = '.woocommerce-loop-product__title', selPrice = '.price', selImage = 'img', selLink = 'a.woocommerce-LoopProduct-link, a' }) {
    let total = 0, emptyStreak = 0;
    for (let p = 1; p <= maxPages; p++) {
        const url = paginateFn ? paginateFn(p) : (p === 1 ? baseUrl : `${baseUrl}page/${p}/`);
        try {
            const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
            if (res && res.status() === 404) break;
            await page.waitForTimeout(2500);
            await page.evaluate(() => { window.scrollBy(0, 800); });
            await page.waitForTimeout(1000);
            const products = await page.evaluate(({ container, selName, selPrice, selImage, selLink }) => {
                return Array.from(document.querySelectorAll(container)).map(el => {
                    let priceText = el.querySelector(selPrice)?.innerText || '';
                    if (!priceText.includes('$')) {
                        const m = el.innerText.match(/\$\s?[\d.,]+/);
                        if (m) priceText = m[0];
                    }
                    return {
                        name: el.querySelector(selName)?.innerText.trim().split('\n')[0] || '',
                        priceRaw: priceText.trim(),
                        image: (() => { const img = el.querySelector(selImage); return img ? (img.src || img.dataset.src || img.dataset.lazySrc || '') : ''; })(),
                        link: el.querySelector(selLink)?.href || ''
                    };
                }).filter(x => x.name.length > 2);
            }, { container, selName, selPrice, selImage, selLink });

            if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
            emptyStreak = 0;
            let count = 0;
            for (const pr of products) {
                const price = parsePrice(pr.priceRaw);
                if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider, markup })) count++;
            }
            log(`  ✅ ${provider} p${p}: ${count}/${products.length} synced`);
            total += count;
        } catch (e) { log(`  ⚠️  ${provider} p${p} error: ${e.message}`); emptyStreak++; if (emptyStreak >= 2) break; }
    }
    return total;
}

// ─── GENERIC Shopify PAGINATOR ────────────────────────────────────────────────
async function scrapeShopify(page, { baseUrl, provider, markup, maxPages = 50 }) {
    let total = 0, emptyStreak = 0;
    for (let p = 1; p <= maxPages; p++) {
        const url = `${baseUrl}?page=${p}`;
        try {
            const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
            if (res && res.status() === 404) break;
            await page.waitForTimeout(2000);
            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.grid__item, .product-item, .item-product')).map(el => {
                    let priceText = el.querySelector('.price')?.innerText || '';
                    if (!priceText.includes('$')) {
                        const m = el.innerText.match(/\$\s?[\d.,]+/);
                        if (m) priceText = m[0];
                    }
                    const link = el.querySelector('a')?.href || '';
                    return {
                        name: el.querySelector('h3 a, h2 a, .card__heading a, .product-title a, .product-name a')?.innerText.trim() || '',
                        priceRaw: priceText.trim(),
                        image: el.querySelector('img')?.src || el.querySelector('img')?.dataset.src || '',
                        link
                    };
                }).filter(x => x.name.length > 2);
            });
            if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
            emptyStreak = 0;
            let count = 0;
            for (const pr of products) {
                const price = parsePrice(pr.priceRaw);
                if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider, markup })) count++;
            }
            log(`  ✅ ${provider} p${p}: ${count}/${products.length} synced`);
            total += count;
        } catch (e) { log(`  ⚠️  ${provider} p${p} error: ${e.message}`); emptyStreak++; if (emptyStreak >= 2) break; }
    }
    return total;
}

// ─── MULTI TECNOLOGIA (PrestaShop + Login) ───────────────────────────────────
async function scrapeMultiTecnologia(browser) {
    log('\n🚀 === MULTITECNOLOGÍA V&V (Dealer Login) ===');
    const MULTI_CATS = [
        '/303-audifonos-y-parlantes', '/352-banco-de-carga', '/298-accesorios-celulares',
        '/302-cables-y-cargadores', '/295-perifericos', '/313-computacion',
        '/314-repuestos-laptop', '/315-seguridad', '/306-drones-y-gadgets',
        '/300-gaming', '/299-cargadores-inalambricos', '/301-accesorios-pc',
        '/304-smartwatch', '/305-camaras', '/307-impresoras', '/308-almacenamiento',
        '/309-tablets', '/310-redes', '/311-conectores', '/312-herramientas',
        '/316-energia', '/317-hogar-inteligente', '/318-iluminacion', '/319-cctv',
    ];
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' });
    try {
        await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button[data-link-action="sign-in"]');
        await page.waitForTimeout(4000);
        log('  🔑 Login attempted');
    } catch (e) { log('  ⚠️ Login failed, continuing as guest'); }

    let grandTotal = 0;
    for (const cat of MULTI_CATS) {
        log(`\n  📂 Category: ${cat}`);
        for (let p = 1; p <= 20; p++) {
            const url = `https://multitecnologiavyv.com${cat}?page=${p}`;
            try {
                const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                if (res && res.status() === 404) break;
                await page.waitForTimeout(2000);
                const products = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('.js-product-miniature, .product-miniature')).map(el => ({
                        name: el.querySelector('.product-title, h3, .nrt-product-name')?.innerText.trim() || '',
                        priceRaw: el.querySelector('.price, .product-price')?.innerText.trim() || '',
                        image: el.querySelector('img')?.src || '',
                        link: el.querySelector('a')?.href || ''
                    })).filter(x => x.name.length > 2);
                });
                if (products.length === 0) break;
                let count = 0;
                for (const pr of products) {
                    const price = parsePrice(pr.priceRaw);
                    if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'MultiTecnología V&V' })) count++;
                }
                log(`    p${p}: ${count}/${products.length} synced`);
                grandTotal += count;
                if (products.length < 5) break;
            } catch (e) { break; }
        }
    }
    await page.close();
    return grandTotal;
}

// ─── BP ECUADOR ───────────────────────────────────────────────────────────────
async function scrapeBP(browser) {
    log('\n🚀 === BP ECUADOR ===');
    const BP_CATS = [
        'herramientas-electricas', 'herramientas-manuales', 'hogar-y-jardin',
        'seguridad-industrial', 'electricidad', 'plomeria', 'pinturas',
        'ferreteria', 'acabados', 'cerrajeria', 'tornilleria',
        'adhesivos-y-sellantes', 'abrasivos', 'medicion', 'organizacion'
    ];
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' });
    let grandTotal = 0;
    for (const cat of BP_CATS) {
        log(`\n  📂 BP Cat: ${cat}`);
        for (let p = 1; p <= 15; p++) {
            const baseUrl = `https://bpecuador.com.ec/categoria-producto/${cat}/`;
            const url = p === 1 ? baseUrl : `${baseUrl}page/${p}/`;
            try {
                const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                if (res && res.status() === 404) break;
                await page.waitForTimeout(2000);
                await page.evaluate(() => window.scrollBy(0, 600));
                await page.waitForTimeout(800);
                const products = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('.product, .type-product, .jet-woo-builder-product')).map(el => {
                        let priceText = el.querySelector('.price, .jet-woo-product-price')?.innerText || '';
                        if (!priceText.includes('$')) { const m = el.innerText.match(/\$\s?[\d.,]+/); if (m) priceText = m[0]; }
                        return {
                            name: el.querySelector('.woocommerce-loop-product__title, h2, h3, .jet-woo-product-title')?.innerText.trim().split('\n')[0] || '',
                            priceRaw: priceText.trim(),
                            image: el.querySelector('img')?.src || el.querySelector('img')?.dataset.src || '',
                            link: el.querySelector('a')?.href || ''
                        };
                    }).filter(x => x.name.length > 2 && x.priceRaw.includes('$'));
                });
                if (products.length === 0) break;
                let count = 0;
                for (const pr of products) {
                    const price = parsePrice(pr.priceRaw);
                    if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'Banco del Perno' })) count++;
                }
                log(`    p${p}: ${count}/${products.length}`);
                grandTotal += count;
            } catch (e) { break; }
        }
    }
    await page.close();
    return grandTotal;
}

// ─── LA COMPETENCIA (PrestaShop) ──────────────────────────────────────────────
async function scrapeCompetencia(browser) {
    log('\n🚀 === LA COMPETENCIA (competencia.com.ec) ===');
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' });
    let grandTotal = 0;
    for (let p = 1; p <= 50; p++) {
        const url = `https://competencia.com.ec/es/buscar?controller=search&s=*&page=${p}`;
        try {
            const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            if (res && res.status() >= 400) break;
            await page.waitForTimeout(2000);
            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.js-product-miniature, .product-miniature, article.product-miniature')).map(el => ({
                    name: el.querySelector('.product-title, h3, .product-name')?.innerText.trim() || '',
                    priceRaw: el.querySelector('.price, .product-price')?.innerText.trim() || '',
                    image: el.querySelector('img')?.src || '',
                    link: el.querySelector('a')?.href || ''
                })).filter(x => x.name.length > 2);
            });
            if (products.length === 0) break;
            let count = 0;
            for (const pr of products) {
                const price = parsePrice(pr.priceRaw);
                if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'La Competencia' })) count++;
            }
            log(`  p${p}: ${count}/${products.length}`);
            grandTotal += count;
        } catch (e) { break; }
    }
    await page.close();
    return grandTotal;
}

// ─── YALE ECUADOR ─────────────────────────────────────────────────────────────
async function scrapeYale(browser) {
    log('\n🚀 === YALE ECUADOR (yale.com.ec) ===');
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' });
    const total = await scrapeWoo(page, {
        baseUrl: 'https://yale.com.ec/tienda/',
        provider: 'Yale Ecuador',
        markup: p => p * 1.10,
        maxPages: 30
    });
    await page.close();
    return total;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
    fs.writeFileSync(LOG_FILE, `=== MEGA MASTER SCRAPER STARTED ${new Date().toISOString()} ===\n`);
    log('🌍 Launching browser...');

    const browser = await chromium.launch({
        headless: true,
        args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
    });

    const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' };

    const results = {};

    // 1. MultiTecnología V&V
    results['MultiTecnología V&V'] = await scrapeMultiTecnologia(browser);

    // 2. BP Ecuador
    results['BP Ecuador'] = await scrapeBP(browser);

    // 3. JM Technology (Shopify)
    log('\n🚀 === JM TECHNOLOGY ===');
    const jmPage = await browser.newPage(); await jmPage.setExtraHTTPHeaders(UA);
    results['JM Technology'] = await scrapeShopify(jmPage, { baseUrl: 'https://jmtechnology.ec/collections/all', provider: 'JM Technology', maxPages: 50 });
    await jmPage.close();

    // 4. Impormel (WooCommerce)
    log('\n🚀 === IMPORMEL ===');
    const impormelPage = await browser.newPage(); await impormelPage.setExtraHTTPHeaders(UA);
    results['Impormel'] = await scrapeWoo(impormelPage, {
        paginateFn: p => `https://impormel.com/page/${p}/?post_type=product`,
        provider: 'Impormel',
        markup: p => p <= 25 ? p + 10 : p <= 60 ? p + 15 : p * 1.45,
        maxPages: 80
    });
    await impormelPage.close();

    // 5. IDC Mayoristas (WooCommerce)
    log('\n🚀 === IDC MAYORISTAS ===');
    const idcPage = await browser.newPage(); await idcPage.setExtraHTTPHeaders(UA);
    results['IDC Mayoristas'] = await scrapeWoo(idcPage, {
        paginateFn: p => `https://www.idcmayoristas.com/shop/page/${p}/`,
        provider: 'IDC Mayoristas',
        markup: p => p * 1.10,
        maxPages: 50,
        container: '.product, .jet-listing-grid__item',
        selName: '.woocommerce-loop-product__title, .jet-listing-dynamic-field__content',
        selPrice: '.price, .jet-listing-dynamic-field__content'
    });
    await idcPage.close();

    // 6. Easy Laptop (WooCommerce)
    log('\n🚀 === EASY LAPTOP ===');
    const easylaptopPage = await browser.newPage(); await easylaptopPage.setExtraHTTPHeaders(UA);
    results['Easy Laptop'] = await scrapeWoo(easylaptopPage, {
        paginateFn: p => `https://easylaptopec.com/tienda/page/${p}/`,
        provider: 'Easy Laptop',
        markup: p => p * 1.15,
        maxPages: 50
    });
    await easylaptopPage.close();

    // 7. Meeltech Store (Shopify)
    log('\n🚀 === MEELTECH STORE ===');
    const meeltechPage = await browser.newPage(); await meeltechPage.setExtraHTTPHeaders(UA);
    results['Meeltech Store'] = await scrapeShopify(meeltechPage, { baseUrl: 'https://meeltechstore.com/collections/all', provider: 'Meeltech Store', markup: p => p * 1.10, maxPages: 50 });
    await meeltechPage.close();

    // 8. Importadora Atenea (WooCommerce)
    log('\n🚀 === IMPORTADORA ATENEA ===');
    const ateneaPage = await browser.newPage(); await ateneaPage.setExtraHTTPHeaders(UA);
    results['Importadora Atenea'] = await scrapeWoo(ateneaPage, {
        paginateFn: p => `https://www.importadoraatenea.com/shop/page/${p}/`,
        provider: 'Importadora Atenea',
        markup: p => p * 1.10,
        maxPages: 50,
        container: 'li.product'
    });
    await ateneaPage.close();

    // 9. Importadora Espinoza
    log('\n🚀 === IMPORTADORA ESPINOZA ===');
    const espinozaPage = await browser.newPage(); await espinozaPage.setExtraHTTPHeaders(UA);
    for (const cat of ['accesorios-para-celular', 'entretenimiento-y-hogar', 'computacion', 'gaming', 'electrodomesticos', 'herramientas']) {
        const total = await scrapeWoo(espinozaPage, {
            paginateFn: p => `https://www.importadoraespinoza.com/category/${cat}?page=${p}`,
            provider: 'Importadora Espinoza',
            markup: p => p <= 25 ? p + 10 : p <= 60 ? p + 15 : p * 1.45,
            maxPages: 20,
            container: '.product-card, div[class*="product"]',
            selName: 'h2, h3, h4',
            selPrice: '[class*="price"], p, span',
            selImage: 'img',
            selLink: 'a'
        });
        results['Importadora Espinoza'] = (results['Importadora Espinoza'] || 0) + total;
    }
    await espinozaPage.close();

    // 10. Yale Ecuador
    results['Yale Ecuador'] = await scrapeYale(browser);

    // 11. La Competencia
    results['La Competencia'] = await scrapeCompetencia(browser);

    await browser.close();
    await prisma.$disconnect();

    // ─── FINAL REPORT ───────────────────────────────────────────────────────
    log('\n\n╔══════════════════════════════════════════╗');
    log('║        📊 MEGA SWEEP FINAL REPORT        ║');
    log('╚══════════════════════════════════════════╝');
    let grandTotal = 0;
    for (const [name, count] of Object.entries(results)) {
        log(`  ${name.padEnd(30)} ${String(count).padStart(6)} productos`);
        grandTotal += count;
    }
    log('  ──────────────────────────────────────────');
    log(`  TOTAL NUEVOS/ACTUALIZADOS:          ${grandTotal} productos`);
    log('╚══════════════════════════════════════════╝\n');
}

main().catch(e => { log(`FATAL ERROR: ${e.message}`); process.exit(1); });
