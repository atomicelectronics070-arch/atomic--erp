const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROVIDER = 'Meeltech';
const PARENT_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica

// Margin rules
// ≤$5 → x2, ≤$30 → 50%, ≤$100 → 25%, ≤$500 → 20%, >$500 → 17%
function getMargin(price) {
    if (price <= 5)   return 2.00;
    if (price <= 30)  return 1.50;
    if (price <= 100) return 1.25;
    if (price <= 500) return 1.20;
    return 1.17;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, retries = 5, delayMs = 8000) {
    for (let i = 0; i < retries; i++) {
        try { return await fn(); }
        catch (e) {
            if (i < retries - 1 && (e.message.includes('reach database') || e.message.includes('connection') || e.message.includes('pool'))) {
                console.log(`   ⚠️  DB timeout, reintentando en ${delayMs / 1000}s... (${i + 1}/${retries})`);
                await sleep(delayMs);
            } else throw e;
        }
    }
}

const CATEGORIES = [
    { name: 'MT-Ejercicio',                 slug: 'mt-ejercicio',                 url: 'https://meeltechstore.com/collections/ejercicio' },
    { name: 'MT-Salud y Belleza',           slug: 'mt-salud-y-belleza',           url: 'https://meeltechstore.com/collections/salud-y-belleza' },
    { name: 'MT-Tecnología',                slug: 'mt-tecnologia',                url: 'https://meeltechstore.com/collections/tecnologia' },
    { name: 'MT-Mascotas',                  slug: 'mt-mascotas',                  url: 'https://meeltechstore.com/collections/mascotas' },
    { name: 'MT-Cámaras de Seguridad',      slug: 'mt-camaras-de-seguridad',      url: 'https://meeltechstore.com/collections/camaras-de-seguridad' },
    { name: 'MT-Camping',                   slug: 'mt-camping',                   url: 'https://meeltechstore.com/collections/camping' },
    { name: 'MT-Iluminación',                slug: 'mt-iluminacion',               url: 'https://meeltechstore.com/collections/iluminacion' },
    { name: 'MT-Niños',                     slug: 'mt-ninos',                     url: 'https://meeltechstore.com/collections/ninos' },
    { name: 'MT-Cocina',                    slug: 'mt-cocina',                    url: 'https://meeltechstore.com/collections/cocina' },
    { name: 'MT-Oficina y Escuela',         slug: 'mt-oficina-y-escuela',         url: 'https://meeltechstore.com/collections/oficina-y-escuela' },
    { name: 'MT-Hogar',                     slug: 'mt-hogar',                     url: 'https://meeltechstore.com/collections/hogar' },
    { name: 'MT-Herramientas y Automotriz',  slug: 'mt-herramientas-y-automotriz',  url: 'https://meeltechstore.com/collections/herramientas-y-automotriz' },
    { name: 'MT-Accesorios y Más',          slug: 'mt-accesorios-y-mas',          url: 'https://meeltechstore.com/collections/accesorios-y-mas' },
    { name: 'MT-Audífonos',                 slug: 'mt-audifonos',                 url: 'https://meeltechstore.com/collections/audifonos' },
    { name: 'MT-Juegos de Mesa',            slug: 'mt-juegos-de-mesa',            url: 'https://meeltechstore.com/collections/juegos-de-mesa' },
    { name: 'MT-Mujer8',                    slug: 'mt-mujer8',                    url: 'https://meeltechstore.com/collections/mujer8' },
    { name: 'MT-Remate',                    slug: 'mt-remate',                    url: 'https://meeltechstore.com/collections/remate' },
    { name: 'MT-Apagones',                  slug: 'mt-apagones',                  url: 'https://meeltechstore.com/collections/apagones' },
    { name: 'MT-Ecoflow',                   slug: 'mt-ecoflow',                   url: 'https://meeltechstore.com/collections/ecoflow' },
    { name: 'MT-Feria Navideña',            slug: 'mt-feria-navidena',            url: 'https://meeltechstore.com/collections/feria-navidena' }
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
    console.log('🚀 Meeltech Store — Sincronización completa con Playwright (Shopify)');
    console.log('📊 ≤$5→x2 | ≤$30→50% | ≤$100→25% | ≤$500→20% | >$500→17%\n');

    console.log('⏳ Esperando 5s para estabilizar conexión DB...');
    await sleep(5000);

    const browser = await chromium.launch({
        headless: true,
        executablePath: CHROME_PATH,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext({ locale: 'es-EC' });

    // Block image assets to speed up
    await context.route('**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf,eot,mp4,mp3}', route => route.abort());

    const page = await context.newPage();
    page.setDefaultTimeout(60000);

    let grandTotal = 0, grandErrors = 0;

    for (const cat of CATEGORIES) {
        console.log(`\n📂 ===== ${cat.name} =====`);
        const category = await ensureCategory(cat);

        let pageNum = 1;
        let catTotal = 0;

        while (true) {
            const url = pageNum === 1 ? cat.url : `${cat.url}?page=${pageNum}`;
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
                await sleep(2000);

                await page.waitForSelector('.grid__item, .card-wrapper, li.grid__item', { timeout: 8000 }).catch(() => null);

                const products = await page.$$eval(
                    '.grid__item, .card-wrapper, li.grid__item',
                    els => els.map(el => {
                        const titleEl = el.querySelector('.card__heading a, .full-unstyled-link, h3 a');
                        const priceEl = el.querySelector('.price-item--regular, .price-item, .price__regular .price-item');
                        const imgEl = el.querySelector('img');
                        return {
                            title: titleEl?.innerText?.trim() || '',
                            priceText: priceEl?.innerText || '0',
                            image: imgEl?.src || imgEl?.getAttribute('data-src') || '',
                        };
                    }).filter(p => p.title)
                ).catch(() => []);

                if (products.length === 0) {
                    console.log(`   ⏹️  Sin productos en página ${pageNum}`);
                    break;
                }

                // Deduplicate page products (sometimes list item cards repeat content or are double-selected)
                const pageProducts = [];
                const titlesSeen = new Set();
                for (const p of products) {
                    if (titlesSeen.has(p.title)) continue;
                    titlesSeen.add(p.title);
                    pageProducts.push(p);
                }

                for (const p of pageProducts) {
                    if (!p.title || p.title.length < 3) continue;
                    const rawPrice = parseFloat(p.priceText.replace(/[^0-9.,]/g, '').replace(',', '.'));
                    if (isNaN(rawPrice) || rawPrice <= 0) continue;

                    const margin = getMargin(rawPrice);
                    const finalPrice = Number((rawPrice * margin).toFixed(2));
                    const pct = margin === 2 ? 'x2' : `${((margin - 1) * 100).toFixed(0)}%`;

                    await withRetry(() => prisma.product.upsert({
                        where: { sku: p.title },
                        update: { name: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: PROVIDER, stock: 10, createdAt: new Date() },
                        create: { name: p.title, sku: p.title, price: finalPrice, images: JSON.stringify([p.image]), categoryId: category.id, isActive: true, isDeleted: false, provider: PROVIDER, stock: 10 }
                    }));

                    catTotal++; grandTotal++;
                    console.log(`   [${catTotal}] "${p.title.substring(0, 48)}" $${rawPrice} → $${finalPrice} (${pct})`);
                }

                // Pagination: Check if next page button exists
                const nextBtn = await page.$('.pagination__item--next, a[aria-label="Página siguiente"], a:has-text("Siguiente"), .pagination a:last-child').catch(() => null);
                if (!nextBtn) break;
                
                // Extra check: if nextBtn is disabled or is not pointing to next page
                const isHidden = await nextBtn.evaluate(el => el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled')).catch(() => false);
                if (isHidden) break;

                pageNum++;
                await sleep(800);

            } catch (e) {
                grandErrors++;
                console.log(`   ❌ Pág ${pageNum}: ${e.message.substring(0, 70)}`);
                break;
            }
        }
        console.log(`   ✅ ${cat.name}: ${catTotal} productos`);
    }

    await browser.close();
    await prisma.$disconnect();

    console.log('\n🎉 ═══════════════════════════════════════');
    console.log('   MEELTECH — SINCRONIZACIÓN COMPLETA');
    console.log(`   📦 Total: ${grandTotal} | ❌ Errores: ${grandErrors}`);
}

run();
