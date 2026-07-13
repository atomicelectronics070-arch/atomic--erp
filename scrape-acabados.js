// Scraper corregido para bpecuador.com - estructura real confirmada
// La página de acabados tiene SOLO subcategorías, los productos están dentro de cada sub
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PROVIDER = 'Banco del Perno';
const MARGIN = 1.40; // 40%
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function applyMargin(price) { return parseFloat((price * MARGIN).toFixed(2)); }

async function fetchHtml(url) {
    try {
        const res = await axios.get(url, { headers: HEADERS, httpsAgent, timeout: 20000 });
        return res.data;
    } catch(e) {
        console.log(`  ⚠️  Error: ${url.split('/').slice(-2).join('/')} → ${e.message.slice(0,60)}`);
        return null;
    }
}

// Get all subcategory URLs from a category page - only those WITHIN the current category
async function getSubcategoryUrls(catUrl) {
    const html = await fetchHtml(catUrl);
    if (!html) return [];
    const $ = cheerio.load(html);
    const urls = [];
    
    // 1. Check cat-item links (sidebar/widget subcategories)
    $('li.cat-item a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/categoria-producto/acabados/') && !urls.includes(href)) {
            urls.push(href);
        }
    });

    // 2. Check product-category links (grid category tiles)
    $('li.product-category a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/categoria-producto/acabados/') && !urls.includes(href)) {
            urls.push(href);
        }
    });

    // 3. Check any content link matching acabados subcategories
    $('a[href*="/categoria-producto/acabados/"]').each((_, el) => {
        let href = $(el).attr('href');
        if (href) {
            if (!href.startsWith('http')) {
                href = 'https://bpecuador.com' + href;
            }
            const cleanUrl = href.split('?')[0];
            if (cleanUrl !== 'https://bpecuador.com/categoria-producto/acabados/' && !urls.includes(cleanUrl)) {
                urls.push(cleanUrl);
            }
        }
    });

    // Filter out root page itself
    return urls.filter(u => u !== catUrl);
}

// Scrape all products from a sub-category page (handles pagination)
async function scrapeProductsFromCategory(catUrl, catName) {
    const products = [];
    let url = catUrl;
    let pageNum = 1;

    while (url) {
        const html = await fetchHtml(url);
        if (!html) break;
        const $ = cheerio.load(html);

        // Products here are real products (not category tiles)
        let foundOnPage = 0;
        $('li.product, .jet-woo-builder-product').each((_, el) => {
            const isCategory = $(el).hasClass('product-category');
            if (isCategory) return; // skip category tiles

            const name = $(el).find('.jet-woo-builder-archive-product-title').first().text().trim() ||
                         $(el).find('.woocommerce-loop-product__title').text().trim() ||
                         $(el).find('h5.jet-woo-builder-archive-product-title a').first().text().trim() ||
                         $(el).find('h2').first().text().trim() ||
                         $(el).find('h3').first().text().trim();
            if (!name) return;

            // Price: prefer sale price
            let priceText = $(el).find('.price ins .amount bdi').text().trim() ||
                            $(el).find('.price ins .amount').text().trim() ||
                            $(el).find('.jet-woo-product-price .amount').first().text().trim() ||
                            $(el).find('.woocommerce-Price-amount').first().text().trim() ||
                            $(el).find('.price .amount bdi').first().text().trim() ||
                            $(el).find('.price .amount').first().text().trim();

            const price = parseFloat(priceText.replace(/[$\s,]/g, '').replace(',', '.')) || 0;

            const img = $(el).find('.jet-woo-builder-archive-product-thumbnail img').attr('src') ||
                        $(el).find('img').attr('data-src') || 
                        $(el).find('img').attr('src') || '';
            
            let link = $(el).find('.jet-woo-builder-archive-product-thumbnail a').attr('href') ||
                         $(el).find('a.woocommerce-LoopProduct-link').attr('href') ||
                         $(el).find('a').first().attr('href') || '';
            if (link && link.startsWith('/')) {
                link = 'https://bpecuador.com' + link;
            }

            if (name && price > 0) {
                products.push({ name, price, img, link, category: catName });
                foundOnPage++;
            }
        });

        console.log(`    Pág ${pageNum}: ${foundOnPage} prods (total: ${products.length})`);

        // Next page
        const next = $('a.next.page-numbers').attr('href') ||
                     $('a[rel="next"]').attr('href');
        url = next || null;
        pageNum++;
        if (url) await sleep(600);
    }
    return products;
}

// Get extra detail from product page (images + description)
async function getProductDetail(url) {
    if (!url) return null;
    const html = await fetchHtml(url);
    if (!html) return null;
    const $ = cheerio.load(html);

    const images = [];
    // Full-size images from gallery
    $('.woocommerce-product-gallery__image a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.match(/\.(jpe?g|png|webp)/i)) images.push(href);
    });
    // Fallback: data-large_image
    if (images.length === 0) {
        $('.woocommerce-product-gallery img').each((_, el) => {
            const src = $(el).attr('data-large_image') || $(el).attr('data-src');
            if (src && src.match(/\.(jpe?g|png|webp)/i)) images.push(src);
        });
    }

    const descHtml = $('.woocommerce-product-details__short-description').html() || '';
    const tabHtml = $('#tab-description .woocommerce-Tabs-panel--description, .woocommerce-Tabs-panel--description').html() || '';
    const sku = $('.sku').first().text().trim();

    return {
        images: images.filter((v, i, a) => a.indexOf(v) === i), // dedupe
        description: (descHtml + tabHtml).trim(),
        sku
    };
}

async function findOrCreateCategory(name, slug) {
    let cat = await prisma.category.findFirst({ where: { slug } });
    if (!cat) cat = await prisma.category.findFirst({ where: { name: { contains: name, mode: 'insensitive' } } });
    if (!cat) {
        cat = await prisma.category.create({ data: { name, slug, isVisible: true } });
        console.log(`  📁 Created category: ${name}`);
    }
    return cat;
}

async function run() {
    console.log('🚀 Scraper iniciado: bpecuador.com/categoria-producto/acabados/\n');

    // Step 1: Find ALL subcategories recursively
    console.log('🔍 Step 1: Descubriendo subcategorías...');
    const rootUrl = 'https://bpecuador.com/categoria-producto/acabados/';
    const rootSubs = await getSubcategoryUrls(rootUrl);
    console.log(`  → ${rootSubs.length} subcategorías directas bajo acabados:\n  ${rootSubs.map(u => u.split('/').slice(-2, -1)[0]).join(', ')}`);

    // Get 2nd-level subcategories
    const allSubUrls = new Map(); // url -> name
    for (const sub of rootSubs) {
        const name = sub.split('/').slice(-2, -1)[0].replace(/-/g, ' ');
        allSubUrls.set(sub, name);
        const level2 = await getSubcategoryUrls(sub);
        for (const l2 of level2) {
            if (!allSubUrls.has(l2)) {
                allSubUrls.set(l2, l2.split('/').slice(-2, -1)[0].replace(/-/g, ' '));
            }
        }
        await sleep(500);
    }

    console.log(`\n  → Total subcategorías a scrapear: ${allSubUrls.size}\n`);

    // Step 2: Scrape products from each subcategory
    const allProducts = [];
    for (const [url, catName] of allSubUrls.entries()) {
        console.log(`\n  📂 ${catName} (${url.split('/').slice(-2,-1)[0]})`);
        const prods = await scrapeProductsFromCategory(url, catName);
        allProducts.push(...prods);
        await sleep(800);
    }

    // Direct search for "dispensador" to capture items that might be placed outside standard subcategories
    console.log('\n🔍 Step 2.5: Buscando productos con palabra clave "dispensador"...');
    const searchUrl = 'https://bpecuador.com/?s=dispensador&post_type=product';
    const searchProds = await scrapeProductsFromCategory(searchUrl, 'dispensador');
    console.log(`  → Encontrados ${searchProds.length} productos en búsqueda de dispensadores`);
    allProducts.push(...searchProds);

    // Deduplicate by name
    const unique = new Map();
    allProducts.forEach(p => { if (!unique.has(p.name)) unique.set(p.name, p); });
    const products = [...unique.values()];
    console.log(`\n\n✅ Total productos únicos encontrados: ${products.length}`);

    // Step 3: Get/create parent category
    const acabadosCat = await findOrCreateCategory('Acabados', 'acabados');

    // Step 4: Save to DB
    console.log('\n💾 Guardando en base de datos con margen del 40%...\n');
    let inserted = 0, updated = 0, skipped = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        if (!p.name || p.price <= 0) { skipped++; continue; }

        const retailPrice = applyMargin(p.price);

        const existing = await prisma.product.findFirst({
            where: { provider: PROVIDER, name: p.name }
        });

        // Optimize: skip detail fetching if product already has images and description in DB
        let detail = null;
        let images = p.img ? [p.img] : [];
        let skuToSave = null;
        let description = '';

        const hasCompleteData = existing && existing.description && existing.images && JSON.parse(existing.images).length > 0;

        if (!hasCompleteData && p.link) {
            detail = await getProductDetail(p.link);
            if (detail) {
                images = (detail.images?.length > 0) ? detail.images : images;
                skuToSave = detail.sku || null;
                description = detail.description || '';
            }
            await sleep(300);
        } else if (existing) {
            try {
                images = JSON.parse(existing.images || '[]');
            } catch(e) {
                images = existing.images ? [existing.images] : (p.img ? [p.img] : []);
            }
            skuToSave = existing.sku;
            description = existing.description || '';
        }

        // Check if this SKU is already in use by another product to avoid unique constraint error
        if (skuToSave && (!existing || existing.sku !== skuToSave)) {
            const existingWithSku = await prisma.product.findFirst({
                where: {
                    sku: skuToSave,
                    NOT: existing ? { id: existing.id } : undefined
                }
            });
            if (existingWithSku) {
                console.log(`  ⚠️  SKU Conflict: SKU "${skuToSave}" is already used by product "${existingWithSku.name}". Setting SKU to null for "${p.name}".`);
                skuToSave = null;
            }
        }

        const data = {
            name: p.name,
            price: retailPrice,
            compareAtPrice: p.price,
            description: description,
            images: JSON.stringify(images),
            provider: PROVIDER,
            isActive: true,
            isDeleted: false,
            stock: 10,
            sku: skuToSave,
            keywords: p.category,
            categoryId: acabadosCat.id,
            createdAt: new Date(),
        };

        if (existing) {
            await prisma.product.update({ where: { id: existing.id }, data });
            updated++;
        } else {
            await prisma.product.create({ data });
            inserted++;
        }

        if ((i + 1) % 15 === 0 || i === products.length - 1) {
            console.log(`  [${i+1}/${products.length}] ✅ ${inserted} nuevos, 🔄 ${updated} actualizados`);
        }
    }

    console.log(`\n\n🎉 ¡LISTO!`);
    console.log(`  ✅ ${inserted} nuevos productos con margen 40%`);
    console.log(`  🔄 ${updated} actualizados`);
    console.log(`  ⚠️  ${skipped} sin precio/nombre`);

    await prisma.$disconnect();
}

run().catch(async e => {
    console.error('FATAL:', e.message);
    await prisma.$disconnect();
});
