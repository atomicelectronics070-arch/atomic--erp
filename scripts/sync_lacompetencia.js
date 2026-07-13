const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'La Competencia';
const PARENT_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica

// Margin rules
function getMargin(price) {
    if (price <= 100) return 1.25;
    if (price <= 500) return 1.20;
    return 1.18;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, retries = 5, delayMs = 8000) {
    for (let i = 0; i < retries; i++) {
        try { return await fn(); }
        catch (e) {
            if (i < retries - 1 && (e.message.includes('reach database') || e.message.includes('connection') || e.message.includes('pool'))) {
                console.log(`   ⚠️  DB timeout, reintentando en ${delayMs/1000}s... (${i+1}/${retries})`);
                await sleep(delayMs);
            } else throw e;
        }
    }
}

// Hardcoded from the menu scan we already did
const CATEGORIES = [
    { name: 'Seguridad LC',                   slug: 'lc-seguridad',              url: 'https://competencia.com.ec/10-seguridad' },
    { name: 'Kit Video Portero',              slug: 'lc-kit-video-portero',      url: 'https://competencia.com.ec/15-kit-video-portero' },
    { name: 'Portero Eléctrico',             slug: 'lc-portero-electrico',      url: 'https://competencia.com.ec/12-portero-electrico' },
    { name: 'Video Botoneras',               slug: 'lc-video-botoneras',        url: 'https://competencia.com.ec/24-video-botoneras' },
    { name: 'Citófonos',                     slug: 'lc-citofonos',              url: 'https://competencia.com.ec/20-citofonos' },
    { name: 'Monitores LC',                  slug: 'lc-monitores',              url: 'https://competencia.com.ec/16-monitores' },
    { name: 'Control de Asistencia',         slug: 'lc-control-asistencia',     url: 'https://competencia.com.ec/17-control-de-asistencia' },
    { name: 'Cerraduras Inteligentes',       slug: 'lc-cerraduras',             url: 'https://competencia.com.ec/13-cerraduras-inteligentes' },
    { name: 'Cámaras de Seguridad',         slug: 'lc-camaras-seguridad',      url: 'https://competencia.com.ec/23-camaras-de-seguridad' },
    { name: 'Control de Guardianía',        slug: 'lc-guardiania',             url: 'https://competencia.com.ec/27-control-de-guardiania' },
    { name: 'Smart Home LC',                 slug: 'lc-smart-home',             url: 'https://competencia.com.ec/70-smart-home' },
    { name: 'Tecnología LC',                 slug: 'lc-tecnologia',             url: 'https://competencia.com.ec/21-tecnologia' },
    { name: 'Telefonía LC',                  slug: 'lc-telefonia',              url: 'https://competencia.com.ec/22-telefonia' },
    { name: 'Balanzas Digitales',            slug: 'lc-balanzas-digitales',     url: 'https://competencia.com.ec/11-balanzas-inteligentes' },
    { name: 'Balanzas para Retail',          slug: 'lc-balanzas-retail',        url: 'https://competencia.com.ec/18-balanzas-para-retail' },
    { name: 'Selladoras',                    slug: 'lc-selladoras',             url: 'https://competencia.com.ec/65-empacadoras-al-vacio' },
    { name: 'Empacadoras',                   slug: 'lc-empacadoras',            url: 'https://competencia.com.ec/66-empacadora' },
    { name: 'Empacadora Semi Industrial',    slug: 'lc-empacadora-semi',        url: 'https://competencia.com.ec/67-empacadora-semi-industrial' },
    { name: 'Fundas Empaque al Vacío',      slug: 'lc-fundas-vacio',           url: 'https://competencia.com.ec/68-fundas-para-empaque-al-vacio' },
];

async function ensureCategory(cat) {
    let c = await withRetry(() => prisma.category.findFirst({ where: { name: cat.name } }));
    if (!c) {
        try {
            c = await withRetry(() => prisma.category.create({ data: { name: cat.name, slug: cat.slug, parentId: PARENT_ID, isVisible: true } }));
            console.log(`   ➕ "${cat.name}" creada`);
        } catch (e) {
            c = await withRetry(() => prisma.category.create({ data: { name: cat.name, slug: `${cat.slug}-${Date.now()}`, parentId: PARENT_ID, isVisible: true } }));
            console.log(`   ➕ "${cat.name}" creada (slug alt)`);
        }
    } else {
        console.log(`   ℹ️  "${cat.name}" existente`);
    }
    return c;
}

async function run() {
    console.log('🚀 La Competencia — Playwright directo por categorías');
    console.log('📊 ≤$100→25% | $100–$500→20% | >$500→18%\n');

    const browser = await chromium.launch({
        headless: true,
        executablePath: CHROME_PATH,
        args: ['--no-sandbox', '--disable-images', '--blink-settings=imagesEnabled=false']
    });
    const context = await browser.newContext({
        locale: 'es-EC',
        // Block images and fonts to speed up loading
        extraHTTPHeaders: { 'Accept': 'text/html,application/xhtml+xml' }
    });

    // Block heavy resources
    await context.route('**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf,eot}', route => route.abort());

    const page = await context.newPage();
    page.setDefaultTimeout(45000);

    console.log('⏳ Esperando conexión DB (10s)...');
    await sleep(10000);
    let grandTotal = 0, grandErrors = 0;

    for (const cat of CATEGORIES) {
        console.log(`\n📂 ===== ${cat.name} =====`);
        const category = await ensureCategory(cat);

        let pageNum = 1;
        let catTotal = 0;

        while (true) {
            const url = pageNum === 1 ? cat.url : `${cat.url}?page=${pageNum}`;
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
                await sleep(1500);

                // Dismiss popup if present
                await page.evaluate(() => {
                    const p = document.querySelector('.home-popup');
                    if (p) p.style.display = 'none';
                }).catch(() => {});

                await page.waitForSelector('.js-product-miniature, .product-miniature, article.product', { timeout: 8000 }).catch(() => null);

                const products = await page.$$eval(
                    '.js-product-miniature, .product-miniature, article.product',
                    els => els.map(el => ({
                        title: (
                            el.querySelector('.product_name a, .product-title a, h2 a, h3 a, .product-description a') ||
                            el.querySelector('a')
                        )?.innerText?.trim() || '',
                        priceText: (
                            el.querySelector('.price, .product-price, [class*="price"]')
                        )?.innerText || '0',
                        image: el.querySelector('img')?.src || '',
                    }))
                ).catch(() => []);

                if (products.length === 0) {
                    console.log(`   ⏹️  Sin productos en página ${pageNum}`);
                    break;
                }

                for (const p of products) {
                    if (!p.title || p.title.length < 3) continue;
                    const rawPrice = parseFloat(p.priceText.replace(/[^0-9.,]/g, '').replace(',', '.'));
                    if (isNaN(rawPrice) || rawPrice <= 0) continue;

                    const margin = getMargin(rawPrice);
                    const finalPrice = Number((rawPrice * margin).toFixed(2));
                    const pct = ((margin - 1) * 100).toFixed(0);

                    await withRetry(() => prisma.product.upsert({
                        where: { sku: p.title },
                        update: { name: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: PROVIDER, stock: 10, createdAt: new Date() },
                        create: { name: p.title, sku: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: PROVIDER, stock: 10 }
                    }));

                    catTotal++; grandTotal++;
                    console.log(`   [${catTotal}] "${p.title.substring(0, 48)}" $${rawPrice} → $${finalPrice} (${pct}%)`);
                }

                const nextBtn = await page.$('a.next, [rel="next"], li.next a').catch(() => null);
                if (!nextBtn) break;
                pageNum++;
                await sleep(800);

            } catch (e) {
                grandErrors++;
                console.log(`   ❌ Pág ${pageNum}: ${e.message.substring(0, 60)}`);
                break;
            }
        }
        console.log(`   ✅ ${cat.name}: ${catTotal} productos`);
    }

    await browser.close();
    await prisma.$disconnect();

    console.log('\n🎉 ═══════════════════════════════════════════');
    console.log('   LA COMPETENCIA — COMPLETADO');
    console.log(`   📦 Total: ${grandTotal} productos | ❌ ${grandErrors} errores`);
}

run();
