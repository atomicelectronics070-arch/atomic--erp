const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://tecnomegastore.ec';
const PROVIDER = 'TecnoMega';
const PARENT_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica

// Margin rules based on base price (before margin)
function getMargin(basePrice) {
    if (basePrice > 400) return 1.20;   // 20%
    if (basePrice >= 200) return 1.25;  // 25%
    return 1.28;                         // 28%
}

// All TecnoMega categories
const CATEGORIES = [
    { name: 'Celulares',         slug: 'celulares-tm',        code: '2N001-CELULARES-TABLETS-MOVILES',                         filter: n => !isTablet(n) },
    { name: 'Tablets',           slug: 'tablets-tm',          code: '2N001-CELULARES-TABLETS-MOVILES',                         filter: n => isTablet(n)  },
    { name: 'Computadores',      slug: 'computadores-tm',     code: '2N002-COMPUTADORES-COMPUTACION',                          filter: null },
    { name: 'Laptops',           slug: 'laptops-tm',          code: '2N003-LAPTOPS-COMPUTACION',                               filter: null },
    { name: 'Impresoras',        slug: 'impresoras-tm',       code: '2N006-IMPRESORAS',                                        filter: null },
    { name: 'Monitores',         slug: 'monitores-tm',        code: '2N004-MONITORES-COMPUTACION',                             filter: null },
    { name: 'Televisores',       slug: 'televisores-tm',      code: '2N012-TELEVISORES-TV_VIDEO',                              filter: null },
    { name: 'Discos Duros',      slug: 'discos-duros-tm',     code: '3N038-DISCOS_DUROS-DISPOSITIVOS_DE_ALMACENAMIENTO-COMPUTACION', filter: null },
    { name: 'Memorias RAM',      slug: 'memorias-ram-tm',     code: '4N061-MEMORIA__RAM-HARDWARE-COMPONENTES_REDES-COMPUTACION', filter: null },
    { name: 'Tarjetas de Video', slug: 'tarjetas-video-tm',   code: '4N064-TARJETAS_DE_VIDEO-HARDWARE-COMPONENTES_REDES-COMPUTACION', filter: null },
    { name: 'Procesadores',      slug: 'procesadores-tm',     code: '4N060-PROCESADORES-HARDWARE-COMPONENTES_REDES-COMPUTACION', filter: null },
    { name: 'Motherboards',      slug: 'motherboards-tm',     code: '4N062-MOTHERBOARDS-HARDWARE-COMPONENTES_REDES-COMPUTACION', filter: null },
    { name: 'Cases',             slug: 'cases-tm',            code: '4N059-CASES-HARDWARE-COMPONENTES_REDES-COMPUTACION',      filter: null },
    { name: 'Fuentes de Poder',  slug: 'fuentes-poder-tm',    code: '4N102-FUENTES_DE_PODER-HARDWARE-COMPONENTES_REDES-COMPUTACION', filter: null },
    { name: 'Audio y Video',     slug: 'audio-video-tm',      code: '2N011-AUDIO_VIDEO-TV_VIDEO',                              filter: null },
    { name: 'Proyectores',       slug: 'proyectores-tm',      code: '2N007-PROYECTORES-TV_VIDEO',                              filter: null },
    { name: 'Redes',             slug: 'redes-tm',            code: '3N030-REDES-COMPONENTES_REDES-COMPUTACION',               filter: null },
    { name: 'Accesorios PC',     slug: 'accesorios-pc-tm',    code: '3N025-ACCESORIOS_PC-COMPUTACION',                         filter: null },
    { name: 'Gaming',            slug: 'gaming-tm',           code: '2N013-GAMING-COMPUTACION',                                filter: null },
    { name: 'Cámaras',          slug: 'camaras-tm',          code: '2N010-CAMARAS-TV_VIDEO',                                  filter: null },
    { name: 'UPS y Reguladores', slug: 'ups-reguladores-tm',  code: '3N035-UPS_REGULADORES-COMPUTACION',                       filter: null },
    { name: 'Software',          slug: 'software-tm',         code: '2N009-SOFTWARE-COMPUTACION',                              filter: null },
    { name: 'Tintas y Toners',   slug: 'tintas-toners-tm',    code: '3N041-TINTAS_TONER-IMPRESORAS',                           filter: null },
];

function isTablet(name) {
    const n = (name || '').toLowerCase();
    return /\b(tablet|ipad|tab |tab\d|galaxy tab|surface|fire hd|kindle|lenovo tab|matepad|mediapad|surf)\b/.test(n);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ensureCategory(cat) {
    let category = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!category) {
        try {
            category = await prisma.category.create({
                data: { name: cat.name, slug: cat.slug, parentId: PARENT_ID, isVisible: true }
            });
            console.log(`   ➕ Categoría creada: "${cat.name}"`);
        } catch (e) {
            // slug conflict — add timestamp
            category = await prisma.category.create({
                data: { name: cat.name, slug: `${cat.slug}-${Date.now()}`, parentId: PARENT_ID, isVisible: true }
            });
            console.log(`   ➕ Categoría creada (slug alt): "${cat.name}"`);
        }
    } else {
        await prisma.category.update({
            where: { id: category.id },
            data: { parentId: PARENT_ID, isVisible: true }
        });
        console.log(`   ℹ️  Categoría existente: "${cat.name}" (ID: ${category.id})`);
    }
    return category;
}

async function getProductLinks(page, code) {
    const links = new Map(); // sku -> url
    let pageNum = 1;

    while (true) {
        const url = `${BASE_URL}/category/1/${code}?page=${pageNum}`;
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        } catch (_) {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        }
        await sleep(1500);

        const found = await page.$$eval('a[href*="/product/"]', els =>
            els.map(el => el.href).filter(h => h.includes('code='))
        ).catch(() => []);

        if (found.length === 0) break;

        let newLinks = 0;
        for (const href of found) {
            const m = href.match(/code=([^&]+)/);
            if (m && !links.has(m[1])) {
                links.set(m[1], href);
                newLinks++;
            }
        }

        process.stdout.write(`\r     Página ${pageNum}: ${links.size} links...`);

        // Check next page
        const hasNext = await page.$('a[aria-label="Next page"], a:has-text("Siguiente"), [rel="next"]').catch(() => null);
        if (!hasNext || newLinks === 0) break;
        pageNum++;
        await sleep(800);
    }
    console.log('');
    return [...links.entries()].map(([sku, url]) => ({ sku, url }));
}

async function scrapePrice(page, url) {
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    } catch (_) {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    await sleep(1000);

    // Name
    const name = await page.$eval(
        'h1, [class*="product-title"], [class*="productTitle"]',
        el => el.innerText?.trim()
    ).catch(() => '');

    if (!name) return null;

    // Price — scan all rendered text for $XX.XX patterns
    let rawPrice = 0;
    const bodyText = await page.$eval('body', el => el.innerText).catch(() => '');
    const matches = [...bodyText.matchAll(/\$\s*([\d]{1,5}[.,]\d{2})/g)];
    for (const m of matches) {
        const val = parseFloat(m[1].replace(',', '.'));
        if (val > 5 && val < 100000) { rawPrice = val; break; }
    }

    // Images
    const images = await page.$$eval('img', els =>
        els.map(el => el.src)
           .filter(s => s && s.startsWith('http') && !s.includes('logo') && !s.includes('banner') && !s.includes('icon'))
    ).catch(() => []);

    // Description
    const description = await page.$eval(
        '[class*="descripcion"], [class*="description"], .product-description',
        el => el.innerText?.trim().substring(0, 800)
    ).catch(() => '');

    return { name, rawPrice, images: images.slice(0, 8), description };
}

async function run() {
    console.log('🚀 TecnoMega — Sincronización COMPLETA con Playwright');
    console.log('📊 Margen: >$400→20% | $200-$400→25% | <$200→28%\n');

    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        locale: 'es-EC',
    });
    const page = await context.newPage();

    let grandTotal = 0;
    let grandErrors = 0;

    // Track which category codes we've already crawled (Celulares+Tablets share same code)
    const crawledCodes = new Map(); // code -> links array

    for (const cat of CATEGORIES) {
        console.log(`\n📂 ===== ${cat.name} =====`);

        const category = await ensureCategory(cat);

        // Get or reuse links for this category code
        let links;
        if (crawledCodes.has(cat.code)) {
            links = crawledCodes.get(cat.code);
            console.log(`   ♻️  Reutilizando ${links.length} links (misma URL que categoría anterior)`);
        } else {
            console.log(`   🗺️  Recolectando links...`);
            links = await getProductLinks(page, cat.code);
            crawledCodes.set(cat.code, links);
            console.log(`   ✅ ${links.length} productos encontrados`);
        }

        if (links.length === 0) {
            console.log(`   ⚠️  Sin productos, saltando.`);
            continue;
        }

        let catTotal = 0, catErrors = 0, noPrice = 0;

        for (let i = 0; i < links.length; i++) {
            const { sku, url } = links[i];
            try {
                const product = await scrapePrice(page, url);
                if (!product || !product.name) { catErrors++; continue; }

                // Apply category filter (for Celulares vs Tablets split)
                if (cat.filter && !cat.filter(product.name)) continue;

                const margin = getMargin(product.rawPrice);
                let finalPrice;

                if (product.rawPrice > 0) {
                    finalPrice = Number((product.rawPrice * margin).toFixed(2));
                } else {
                    // Fallback estimate if price not found
                    noPrice++;
                    const fallback = cat.name.includes('Laptop') ? 600
                        : cat.name.includes('Computad') ? 400
                        : cat.name.includes('Monitor') ? 180
                        : cat.name.includes('TV') || cat.name.includes('Televi') ? 450
                        : cat.name.includes('Impres') ? 200
                        : cat.name.includes('Celular') ? 250
                        : cat.name.includes('Tablet') ? 280
                        : cat.name.includes('Memoria') ? 35
                        : cat.name.includes('Disco') ? 60
                        : cat.name.includes('Tarjeta') ? 200
                        : cat.name.includes('Procesador') ? 130
                        : 80;
                    finalPrice = Number((fallback * getMargin(fallback)).toFixed(2));
                }

                const data = {
                    name: product.name,
                    price: finalPrice,
                    description: product.description || '',
                    images: JSON.stringify(product.images),
                    keywords: cat.name,
                    provider: PROVIDER,
                    isActive: true,
                    isDeleted: false,
                    sku: sku || null,
                    categoryId: category.id,
                    stock: 10,
                    createdAt: new Date(),
                };

                const existing = await prisma.product.findFirst({
                    where: { provider: PROVIDER, name: product.name }
                });

                if (existing) {
                    await prisma.product.update({ where: { id: existing.id }, data });
                } else {
                    await prisma.product.create({ data });
                }

                catTotal++;
                grandTotal++;
                const priceStr = product.rawPrice > 0
                    ? `$${product.rawPrice} → $${finalPrice} (${((margin-1)*100).toFixed(0)}%)`
                    : `estimado → $${finalPrice}`;
                console.log(`   [${i+1}/${links.length}] "${product.name.substring(0, 45)}" ${priceStr}`);

            } catch (e) {
                catErrors++;
                grandErrors++;
                console.log(`   [${i+1}/${links.length}] ❌ ${e.message.substring(0, 70)}`);
            }

            await sleep(700);
        }

        console.log(`   ✅ ${cat.name}: ${catTotal} productos | ${catErrors} errores | ${noPrice} sin precio`);
    }

    await browser.close();
    await prisma.$disconnect();

    console.log('\n\n🎉 ═══════════════════════════════════════');
    console.log('   TECNOMEGA SINCRONIZACIÓN TOTAL COMPLETA');
    console.log('═══════════════════════════════════════════');
    console.log(`   📦 Total productos: ${grandTotal}`);
    console.log(`   ❌ Total errores:   ${grandErrors}`);
}

run();
