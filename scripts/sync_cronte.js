const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function getProductLinksFromSitemap(page) {
    console.log("📋 Buscando productos en sitemap desde el navegador...");
    const links = new Set();
    
    const sitemapUrls = [
        'https://cronte.net/sitemap.xml',
        'https://cronte.net/sitemap_index.xml',
        'https://cronte.net/wp-sitemap.xml',
    ];

    for (const url of sitemapUrls) {
        try {
            await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            const content = await page.content();
            if (content.includes('<loc>')) {
                console.log(`✅ Sitemap accesible: ${url}`);
                
                // Get sub-sitemaps
                const subMatches = [...content.matchAll(/<loc>(https:\/\/cronte\.net[^<]*sitemap[^<]*)<\/loc>/gi)];
                if (subMatches.length > 0) {
                    for (const m of subMatches) {
                        if (m[1].includes('product')) {
                            await page.goto(m[1], { timeout: 30000 });
                            await page.waitForTimeout(2000);
                            const subContent = await page.content();
                            const productUrls = [...subContent.matchAll(/<loc>(https:\/\/cronte\.net\/producto\/[^<]+)<\/loc>/gi)].map(u => u[1]);
                            productUrls.forEach(l => links.add(l));
                            console.log(`  📦 ${m[1]}: ${productUrls.length} productos`);
                        }
                    }
                } else {
                    // Direct product URLs in sitemap
                    const productUrls = [...content.matchAll(/<loc>(https:\/\/cronte\.net\/producto\/[^<]+)<\/loc>/gi)].map(u => u[1]);
                    productUrls.forEach(l => links.add(l));
                    console.log(`  📦 Directos: ${productUrls.length} productos`);
                }
                
                if (links.size > 0) break;
            }
        } catch(e) {
            console.log(`  Sitemap no disponible: ${url}`);
        }
    }
    
    return [...links];
}

async function getProductLinksFromShop(page) {
    console.log("🛒 Buscando productos navegando la tienda...");
    const links = new Set();
    
    // Try different shop paths
    const shopUrls = [
        'https://cronte.net/tienda/',
        'https://cronte.net/shop/',
        'https://cronte.net/productos/',
        'https://cronte.net/'
    ];
    
    let workingShop = null;
    for (const url of shopUrls) {
        try {
            await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(3000);
            const count = await page.evaluate(() => document.querySelectorAll('li.product, article.product, .product-grid-item').length);
            if (count > 0) {
                workingShop = url;
                console.log(`✅ Tienda encontrada en: ${url} (${count} productos en página)`);
                break;
            } else {
                // Get all hrefs containing /producto/ anyway
                const hrefs = await page.$$eval('a', as => as.map(a => a.href));
                const pl = hrefs.filter(h => h.includes('/producto/'));
                pl.forEach(l => links.add(l));
                if (pl.length > 0) {
                    console.log(`  → Encontrados ${pl.length} enlaces a productos en ${url}`);
                }
            }
        } catch(e) {
            console.log(`  No disponible: ${url}`);
        }
    }

    if (workingShop) {
        // Paginate
        for (let p = 1; p <= 50; p++) {
            const pageUrl = p === 1 ? workingShop : `${workingShop}page/${p}/`;
            try {
                await page.goto(pageUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(2000);
                const hrefs = await page.$$eval('a', as => as.map(a => a.href));
                const pl = hrefs.filter(h => h.includes('/producto/') || h.includes('/product/'));
                if (pl.length === 0) { console.log(`  Fin de paginación en p${p}`); break; }
                pl.forEach(l => links.add(l));
                console.log(`  Página ${p}: ${pl.length} productos. Total: ${links.size}`);
            } catch(e) {
                console.log(`  Fin de paginación en p${p}`);
                break;
            }
        }
    }

    return [...links];
}

async function run() {
    console.log("🚀 Iniciando Scraper Cronte Technology con Chrome del sistema...");
    
    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: false,
        slowMo: 80,
        args: ['--start-maximized']
    });
    
    const context = await browser.newContext({
        viewport: null, // Use full window size
        locale: 'es-EC',
        timezoneId: 'America/Guayaquil'
    });
    
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    let totalSync = 0;

    try {
        const history = await prisma.extractionHistory.create({
            data: { url: 'https://cronte.net/', domain: 'cronte.net', status: 'PROCESSING', itemCount: 0 }
        });

        // Warm-up: land on the homepage to beat Cloudflare
        console.log("🛡️ Calentando: visitando cronte.net (30s para que Cloudflare nos deje pasar)...");
        await page.goto('https://cronte.net/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(30000);
        const title = await page.title();
        console.log("✅ Título:", title);

        // Phase 1: Try sitemap first (fastest)
        let productLinks = await getProductLinksFromSitemap(page);

        // Phase 2: If sitemap fails, browse the shop
        if (productLinks.length === 0) {
            productLinks = await getProductLinksFromShop(page);
        }

        console.log(`\n📦 TOTAL DE PRODUCTOS A EXTRAER: ${productLinks.length}`);

        if (productLinks.length === 0) {
            console.log("⚠️ No se encontraron productos. La web puede estar bloqueando todo.");
            await prisma.extractionHistory.update({ where: { id: history.id }, data: { status: 'FAILED', itemCount: 0 } });
            return;
        }

        // Phase 3: Extract each product
        for (let i = 0; i < productLinks.length; i++) {
            const link = productLinks[i];
            console.log(`\n[${i + 1}/${productLinks.length}] 🔍 ${link}`);
            
            try {
                await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
                await page.waitForTimeout(1500);

                const data = await page.evaluate(() => {
                    const title = document.querySelector('h1.product_title, h1.entry-title')?.innerText?.trim();
                    if (!title) return null;

                    let price = 0;
                    const priceEl = document.querySelector('p.price ins .woocommerce-Price-amount bdi')
                        || document.querySelector('p.price .woocommerce-Price-amount bdi')
                        || document.querySelector('.price .amount bdi')
                        || document.querySelector('.woocommerce-Price-amount');
                    if (priceEl) {
                        const raw = priceEl.innerText.replace(/[^\d.,]/g, '').replace(',', '.');
                        price = parseFloat(raw) || 0;
                    }

                    const descEl = document.querySelector('.woocommerce-product-details__short-description')
                        || document.querySelector('#tab-description')
                        || document.querySelector('.product-short-description');
                    const description = descEl?.innerHTML || '';

                    const imgs = [];
                    document.querySelectorAll('.woocommerce-product-gallery__image img, .product-gallery img').forEach(img => {
                        const src = img.getAttribute('data-large_image') || img.getAttribute('data-src') || img.src;
                        if (src && !src.includes('placeholder')) imgs.push(src);
                    });

                    const skuEl = document.querySelector('.sku');
                    const sku = skuEl?.innerText?.trim() || '';
                    const category = document.querySelector('.posted_in a')?.innerText?.trim() || '';

                    return { title, price, description, images: [...new Set(imgs)], sku, category };
                });

                if (data && data.title) {
                    const uniqueKey = data.sku || data.title;
                    await prisma.product.upsert({
                        where: { sku: uniqueKey },
                        update: {
                            name: data.title,
                            price: data.price,
                            description: data.description,
                            images: JSON.stringify(data.images),
                            isActive: true,
                            isDeleted: false,
                            provider: 'Cronte Technology'
                        },
                        create: {
                            name: data.title,
                            sku: uniqueKey,
                            price: data.price,
                            description: data.description,
                            images: JSON.stringify(data.images),
                            isActive: true,
                            isDeleted: false,
                            provider: 'Cronte Technology'
                        }
                    });
                    totalSync++;
                    console.log(`  ✅ "${data.title}" - $${data.price}`);
                } else {
                    console.log(`  ⚠️ Sin datos detectables en: ${link}`);
                }

            } catch (e) {
                console.log(`  ❌ Error: ${e.message.substring(0, 100)}`);
            }
        }

        await prisma.extractionHistory.update({
            where: { id: history.id },
            data: { status: 'COMPLETED', itemCount: totalSync }
        });

        console.log(`\n✨ MISIÓN COMPLETADA: ${totalSync}/${productLinks.length} productos de Cronte Technology sincronizados.`);

    } catch (e) {
        console.error("❌ Error Crítico:", e.message);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
