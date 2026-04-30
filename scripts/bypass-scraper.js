/**
 * ATOMIC ERP — SCRAPER v2 (Anti-Bot Bypass)
 * Ataca los proveedores que bloquearon el scraper anterior:
 * - Impormel, IDC Mayoristas, Importadora Atenea, Importadora Espinoza, La Competencia
 * Estrategia: headers reales, delays aleatorios, viewport real, sin modo headless señas
 */

const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const fs = require('fs');

const prisma = new PrismaClient();

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync('bypass_scraper_log.txt', line + '\n');
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
            ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
    }
    return parseFloat(cleaned) || 0;
}

function randDelay(min = 1500, max = 4000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function upsertProduct({ name, price, image, link, provider, markup }) {
    if (!name || price <= 0 || price > 50000) return false;
    const finalPrice = markup ? markup(price) : price;
    const sku = (link
        ? link.replace(/[?#].*/, '').replace(/\/$/, '').split('/').pop()
        : name.toLowerCase().replace(/\s+/g, '-')
    ).substring(0, 100);
    if (!sku || sku.length < 2) return false;
    try {
        await prisma.product.upsert({
            where: { sku },
            update: { name, price: finalPrice, images: JSON.stringify([image || '']), provider, isDeleted: false, isActive: true },
            create: { sku, name, price: finalPrice, images: JSON.stringify([image || '']), provider, isActive: true, isDeleted: false, stock: 10 }
        });
        return true;
    } catch { return false; }
}

async function createStealthPage(browser) {
    const ctx = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 },
        locale: 'es-EC',
        timezoneId: 'America/Guayaquil',
        extraHTTPHeaders: {
            'Accept-Language': 'es-EC,es;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
            'sec-ch-ua-platform': '"Windows"',
        }
    });
    return ctx.newPage();
}

// ─── IMPORMEL ─────────────────────────────────────────────────────────────────
async function scrapeImpormel(browser) {
    log('\n🚀 === IMPORMEL (bypass) ===');
    const page = await createStealthPage(browser);
    let total = 0, emptyStreak = 0;

    for (let p = 1; p <= 100; p++) {
        const url = p === 1 
            ? 'https://impormel.com/shop/' 
            : `https://impormel.com/shop/page/${p}/`;
        try {
            const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            if (res && res.status() === 404) break;
            await page.waitForTimeout(randDelay(2000, 4000));
            await page.evaluate(() => { window.scrollBy(0, 600); });
            await page.waitForTimeout(800);

            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.product, li.product')).map(el => {
                    let priceText = el.querySelector('.price')?.innerText || '';
                    if (!priceText.includes('$')) {
                        const m = el.innerText.match(/\$\s?[\d.,]+/);
                        if (m) priceText = m[0];
                    }
                    return {
                        name: el.querySelector('.woocommerce-loop-product__title, h2, h3')?.innerText.trim().split('\n')[0] || '',
                        priceRaw: priceText.trim(),
                        image: el.querySelector('img')?.src || el.querySelector('img')?.dataset?.src || '',
                        link: el.querySelector('a')?.href || ''
                    };
                }).filter(x => x.name.length > 2);
            });

            if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
            emptyStreak = 0;
            let count = 0;
            for (const pr of products) {
                const price = parsePrice(pr.priceRaw);
                if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'Impormel', markup: p => p <= 25 ? p + 10 : p <= 60 ? p + 15 : p * 1.45 })) count++;
            }
            log(`  Impormel p${p}: ${count}/${products.length} ✅`);
            total += count;
        } catch (e) { log(`  Impormel p${p} error: ${e.message}`); emptyStreak++; if (emptyStreak >= 3) break; }
    }
    await page.close();
    return total;
}

// ─── IDC MAYORISTAS ───────────────────────────────────────────────────────────
async function scrapeIDC(browser) {
    log('\n🚀 === IDC MAYORISTAS (bypass) ===');
    const page = await createStealthPage(browser);
    let total = 0, emptyStreak = 0;
    const cats = [
        'https://www.idcmayoristas.com/c/linea-blanca/',
        'https://www.idcmayoristas.com/c/tecnologia/',
        'https://www.idcmayoristas.com/c/audio-y-video/',
        'https://www.idcmayoristas.com/c/celulares/',
        'https://www.idcmayoristas.com/c/computacion/',
        'https://www.idcmayoristas.com/c/gaming/',
    ];
    for (const catUrl of cats) {
        for (let p = 1; p <= 20; p++) {
            const url = p === 1 ? catUrl : `${catUrl}page/${p}/`;
            try {
                const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                if (res && res.status() === 404) break;
                await page.waitForTimeout(randDelay(2000, 3500));
                await page.evaluate(() => { window.scrollBy(0, 800); });
                await page.waitForTimeout(1000);

                const products = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('.product, .jet-listing-grid__item, li.product')).map(el => {
                        let priceText = el.querySelector('.price, .jet-woo-product-price, .woocommerce-Price-amount')?.innerText || '';
                        if (!priceText.includes('$')) { const m = el.innerText.match(/\$\s?[\d.,]+/); if (m) priceText = m[0]; }
                        return {
                            name: el.querySelector('.woocommerce-loop-product__title, h2, h3, .jet-listing-dynamic-field__content')?.innerText.trim().split('\n')[0] || '',
                            priceRaw: priceText.trim(),
                            image: el.querySelector('img')?.src || '',
                            link: el.querySelector('a')?.href || ''
                        };
                    }).filter(x => x.name.length > 2);
                });

                if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
                emptyStreak = 0;
                let count = 0;
                for (const pr of products) {
                    const price = parsePrice(pr.priceRaw);
                    if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'IDC Mayoristas', markup: p => p * 1.10 })) count++;
                }
                log(`  IDC ${catUrl.split('/c/')[1]?.split('/')[0]} p${p}: ${count}/${products.length} ✅`);
                total += count;
            } catch (e) { log(`  IDC p${p} error: ${e.message}`); emptyStreak++; if (emptyStreak >= 2) break; }
        }
        emptyStreak = 0;
    }
    await page.close();
    return total;
}

// ─── IMPORTADORA ATENEA ───────────────────────────────────────────────────────
async function scrapeAtenea(browser) {
    log('\n🚀 === IMPORTADORA ATENEA (bypass) ===');
    const page = await createStealthPage(browser);
    let total = 0, emptyStreak = 0;
    for (let p = 1; p <= 50; p++) {
        const url = p === 1 ? 'https://www.importadoraatenea.com/tienda/' : `https://www.importadoraatenea.com/tienda/page/${p}/`;
        try {
            const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            if (res && res.status() === 404) break;
            await page.waitForTimeout(randDelay(2000, 3500));
            await page.evaluate(() => { window.scrollBy(0, 700); });
            await page.waitForTimeout(800);

            const products = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('li.product, .product')).map(el => {
                    let priceText = el.querySelector('.price')?.innerText || '';
                    if (!priceText.includes('$')) { const m = el.innerText.match(/\$\s?[\d.,]+/); if (m) priceText = m[0]; }
                    return {
                        name: el.querySelector('.woocommerce-loop-product__title, h2, h3')?.innerText.trim().split('\n')[0] || '',
                        priceRaw: priceText.trim(),
                        image: el.querySelector('img')?.src || '',
                        link: el.querySelector('a.woocommerce-LoopProduct-link, a')?.href || ''
                    };
                }).filter(x => x.name.length > 2);
            });

            if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
            emptyStreak = 0;
            let count = 0;
            for (const pr of products) {
                const price = parsePrice(pr.priceRaw);
                if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'Importadora Atenea', markup: p => p * 1.10 })) count++;
            }
            log(`  Atenea p${p}: ${count}/${products.length} ✅`);
            total += count;
        } catch (e) { log(`  Atenea p${p} error: ${e.message}`); emptyStreak++; if (emptyStreak >= 2) break; }
    }
    await page.close();
    return total;
}

// ─── IMPORTADORA ESPINOZA ─────────────────────────────────────────────────────
async function scrapeEspinoza(browser) {
    log('\n🚀 === IMPORTADORA ESPINOZA (bypass) ===');
    const page = await createStealthPage(browser);
    let total = 0;
    const cats = ['accesorios-para-celular', 'celulares', 'computacion', 'entretenimiento-y-hogar', 'gaming', 'electrodomesticos', 'herramientas', 'audio'];
    for (const cat of cats) {
        log(`  📂 Espinoza cat: ${cat}`);
        for (let p = 1; p <= 20; p++) {
            const url = `https://www.importadoraespinoza.com/category/${cat}?page=${p}`;
            try {
                const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
                if (res && res.status() >= 400) break;
                await page.waitForTimeout(randDelay(2000, 3000));
                await page.evaluate(() => { window.scrollBy(0, 800); });
                await page.waitForTimeout(800);

                const products = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('[class*="product"], .product-card, article'));
                    return items.map(el => {
                        const nameEl = el.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"]');
                        const priceEl = el.querySelector('[class*="price"], strong, b');
                        let priceText = priceEl?.innerText || '';
                        if (!priceText.includes('$')) { const m = el.innerText.match(/\$\s?[\d.,]+/); if (m) priceText = m[0]; }
                        return {
                            name: nameEl?.innerText.trim().split('\n')[0] || '',
                            priceRaw: priceText.trim(),
                            image: el.querySelector('img')?.src || '',
                            link: el.querySelector('a')?.href || ''
                        };
                    }).filter(x => x.name.length > 3 && x.priceRaw.includes('$'));
                });

                if (products.length === 0) break;
                let count = 0;
                for (const pr of products) {
                    const price = parsePrice(pr.priceRaw);
                    if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'Importadora Espinoza', markup: p => p <= 25 ? p + 10 : p <= 60 ? p + 15 : p * 1.45 })) count++;
                }
                log(`    ${cat} p${p}: ${count}/${products.length} ✅`);
                total += count;
            } catch (e) { break; }
        }
    }
    await page.close();
    return total;
}

// ─── LA COMPETENCIA ───────────────────────────────────────────────────────────
async function scrapeCompetencia(browser) {
    log('\n🚀 === LA COMPETENCIA (bypass) ===');
    const page = await createStealthPage(browser);
    let total = 0, emptyStreak = 0;

    // Try category-by-category approach
    const cats = [
        'https://competencia.com.ec/es/2-camaras-de-seguridad',
        'https://competencia.com.ec/es/3-control-de-acceso',
        'https://competencia.com.ec/es/4-alarmas',
        'https://competencia.com.ec/es/5-redes-y-telecomunicaciones',
        'https://competencia.com.ec/es/6-automatizacion',
        'https://competencia.com.ec/es/7-energia',
        'https://competencia.com.ec/es/8-herramientas',
        'https://competencia.com.ec/es/9-audio-y-video',
    ];

    for (const catUrl of cats) {
        for (let p = 1; p <= 20; p++) {
            const url = p === 1 ? catUrl : `${catUrl}?page=${p}`;
            try {
                const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
                if (res && res.status() >= 400) break;
                await page.waitForTimeout(randDelay(1500, 3000));

                const products = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('.js-product-miniature, .product-miniature, article[class*="product"]')).map(el => ({
                        name: el.querySelector('.product-title, h2, h3, .card-product-title')?.innerText.trim() || '',
                        priceRaw: el.querySelector('.price, .product-price, [class*="price"]')?.innerText.trim() || '',
                        image: el.querySelector('img')?.src || '',
                        link: el.querySelector('a')?.href || ''
                    })).filter(x => x.name.length > 2);
                });

                if (products.length === 0) { emptyStreak++; if (emptyStreak >= 2) break; continue; }
                emptyStreak = 0;
                let count = 0;
                for (const pr of products) {
                    const price = parsePrice(pr.priceRaw);
                    if (await upsertProduct({ name: pr.name, price, image: pr.image, link: pr.link, provider: 'La Competencia' })) count++;
                }
                log(`  Competencia ${catUrl.split('/es/')[1]?.split('?')[0]} p${p}: ${count}/${products.length} ✅`);
                total += count;
            } catch (e) { break; }
        }
        emptyStreak = 0;
    }
    await page.close();
    return total;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
    fs.writeFileSync('bypass_scraper_log.txt', `=== BYPASS SCRAPER STARTED ${new Date().toISOString()} ===\n`);
    log('🌍 Launching stealth browser...');

    const browser = await chromium.launch({
        headless: true,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
        ]
    });

    const results = {};

    results['Impormel']              = await scrapeImpormel(browser);
    results['IDC Mayoristas']        = await scrapeIDC(browser);
    results['Importadora Atenea']    = await scrapeAtenea(browser);
    results['Importadora Espinoza']  = await scrapeEspinoza(browser);
    results['La Competencia']        = await scrapeCompetencia(browser);

    await browser.close();
    await prisma.$disconnect();

    log('\n╔══════════════════════════════════════════╗');
    log('║      📊 BYPASS SCRAPER FINAL REPORT      ║');
    log('╚══════════════════════════════════════════╝');
    let grand = 0;
    for (const [name, count] of Object.entries(results)) {
        log(`  ${name.padEnd(30)} ${String(count).padStart(6)} productos`);
        grand += count;
    }
    log(`  ${'─'.repeat(42)}`);
    log(`  TOTAL:                           ${grand} productos`);
}

main().catch(e => { log(`FATAL: ${e.message}`); process.exit(1); });
