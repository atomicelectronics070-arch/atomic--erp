const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const BASE_URL = 'https://tecnomegastore.ec';
const PROVIDER = 'TecnoMega';
const MARGIN = 1.35; // 35% margin
const IVA = 1.18;    // 18% IVA total factor on top of margin

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const CATEGORY_CODE = '2N001-CELULARES-TABLETS-MOVILES';

// DB IDs for the two split categories
const CELULARES_CAT_ID = 'cmr2n905o0001137wi0ufnmdm'; // Celulares y Tablets (already in DB)
const PARENT_ID = 'cmqvwkn530000ejkxk6df8rqz'; // Electrónica

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPage(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 });
        return data;
    } catch (e) {
        return null;
    }
}

// Determine if a product name is a Tablet or a Celular
function isTablet(name) {
    const n = name.toLowerCase();
    return /\b(tablet|ipad|tab |tab\d|galaxy tab|surface|fire hd|kindle|lenovo tab|samsung tab|huawei matepd|mediapad|matepad)\b/.test(n);
}

async function getLinksFromCategory() {
    const links = new Set();
    console.log(`📂 Extrayendo links de: CELULARES, TABLETS Y MÓVILES`);
    
    for (let p = 1; p <= 200; p++) {
        const url = `${BASE_URL}/category/1/${CATEGORY_CODE}?page=${p}`;
        const html = await fetchPage(url);
        if (!html) break;

        const $ = cheerio.load(html);
        const productLinks = [];

        $('a[href*="/product/"]').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/product/') && href.includes('code=')) {
                productLinks.push(href.startsWith('http') ? href : BASE_URL + href);
            }
        });

        if (productLinks.length === 0) break;
        productLinks.forEach(l => links.add(l));
        process.stdout.write(`\r  Página ${p}: ${links.size} links encontrados...`);
        await sleep(500);
    }

    console.log(`\n✅ Total links únicos: ${links.size}`);
    return [...links];
}

async function scrapeProduct(url) {
    const html = await fetchPage(url);
    if (!html) return null;

    const $ = cheerio.load(html);
    const name = $('h1, .product-title, .product-name').first().text().trim();
    if (!name) return null;

    const codeMatch = url.match(/code=([^&]+)/);
    const sku = codeMatch ? codeMatch[1] : '';

    // Try to extract price
    let price = 0;
    const priceText = $('.precio, .price, [class*="price"], [class*="precio"]').first().text();
    if (priceText) {
        const cleaned = priceText.replace(/[^\d.,]/g, '').replace(',', '.');
        price = parseFloat(cleaned) || 0;
    }
    if (price === 0) {
        const allText = $('body').text();
        const priceMatch = allText.match(/\$\s*(\d{1,6}[.,]\d{2})/);
        if (priceMatch) price = parseFloat(priceMatch[1].replace(',', '.')) || 0;
    }

    const description = ($('.descripcion, .description, [class*="descripcion"]').first().text().trim()
        || $('p').slice(0, 3).text().trim()).substring(0, 800);

    const images = [];
    $('img[src*="tecnomega"], img[src*="product"], img[data-src*="product"]').each((_, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src');
        if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('banner')) {
            images.push(src);
        }
    });

    return { name, price, sku, description, images };
}

// Estimate base cost price for products without visible pricing
function estimateBaseCost(name) {
    const n = name.toLowerCase();
    // Tablets
    if (/\b(tablet|ipad|tab |tab\d|galaxy tab|surface|fire hd|kindle|matepad)\b/.test(n)) return 280.00;
    // High-end phones
    if (/\b(iphone 15|iphone 16|iphone 17|s25|s24 ultra|fold|flip)\b/.test(n)) return 700.00;
    // Mid-range phones
    if (/\b(iphone|samsung galaxy s|pixel)\b/.test(n)) return 450.00;
    // Budget phones
    if (/\b(redmi|xiaomi|motorola|moto|huawei|realme|oppo|vivo)\b/.test(n)) return 180.00;
    // Generic phone
    return 250.00;
}

async function run() {
    console.log('🚀 Iniciando Sincronizador TecnoMega: Celulares y Tablets (35% margen)...\n');

    // Ensure both categories exist in DB (split)
    let celularesCat = await prisma.category.findFirst({ where: { name: 'Celulares' } });
    if (!celularesCat) {
        celularesCat = await prisma.category.create({
            data: { name: 'Celulares', slug: 'celulares-tecnomega', parentId: PARENT_ID, isVisible: true }
        });
        console.log(`➕ Categoría "Celulares" creada (ID: ${celularesCat.id})`);
    } else {
        await prisma.category.update({ where: { id: celularesCat.id }, data: { parentId: PARENT_ID, isVisible: true } });
        console.log(`ℹ️ Categoría "Celulares" existente (ID: ${celularesCat.id})`);
    }

    let tabletsCat = await prisma.category.findFirst({ where: { name: 'Tablets' } });
    if (!tabletsCat) {
        tabletsCat = await prisma.category.create({
            data: { name: 'Tablets', slug: 'tablets-tecnomega', parentId: PARENT_ID, isVisible: true }
        });
        console.log(`➕ Categoría "Tablets" creada (ID: ${tabletsCat.id})`);
    } else {
        await prisma.category.update({ where: { id: tabletsCat.id }, data: { parentId: PARENT_ID, isVisible: true } });
        console.log(`ℹ️ Categoría "Tablets" existente (ID: ${tabletsCat.id})`);
    }

    // Phase 1: Get all product links
    console.log('\n🗺️  FASE 1: Recolectando links de productos...\n');
    const links = await getLinksFromCategory();

    // Phase 2: Scrape each product and save
    console.log('\n🔍 FASE 2: Extrayendo detalles y guardando en BD...\n');

    let celularCount = 0, tabletCount = 0, errors = 0;

    for (let i = 0; i < links.length; i++) {
        const url = links[i];
        try {
            const product = await scrapeProduct(url);
            if (!product || !product.name) { errors++; continue; }

            const tablet = isTablet(product.name);
            const catId = tablet ? tabletsCat.id : celularesCat.id;
            const catLabel = tablet ? 'TABLET' : 'CELULAR';

            // Price: use scraped price if available, else estimate
            let baseCost = product.price > 0 ? product.price : estimateBaseCost(product.name);
            const finalPrice = Number((baseCost * MARGIN * IVA).toFixed(2));

            const existing = await prisma.product.findFirst({
                where: { provider: PROVIDER, name: product.name }
            });

            const data = {
                name: product.name,
                price: finalPrice,
                description: product.description,
                images: JSON.stringify(product.images.slice(0, 8)),
                keywords: 'Celulares Tablets Móviles',
                provider: PROVIDER,
                isActive: true,
                isDeleted: false,
                sku: product.sku || null,
                categoryId: catId,
                stock: 10,
                createdAt: new Date(),
            };

            if (existing) {
                await prisma.product.update({ where: { id: existing.id }, data });
            } else {
                await prisma.product.create({ data });
            }

            tablet ? tabletCount++ : celularCount++;
            console.log(`[${i+1}/${links.length}] [${catLabel}] "${product.name.substring(0, 50)}" → $${finalPrice}`);

        } catch (e) {
            errors++;
            console.log(`[${i+1}/${links.length}] ❌ Error: ${e.message.substring(0, 80)}`);
        }

        await sleep(600);
    }

    console.log('\n🎉 ¡SINCRONIZACIÓN COMPLETA!');
    console.log(`   📱 Celulares: ${celularCount} productos`);
    console.log(`   🖥️  Tablets:   ${tabletCount} productos`);
    console.log(`   ❌ Errores:   ${errors}`);
    console.log(`   📦 TOTAL: ${celularCount + tabletCount} productos de TecnoMega`);

    await prisma.$disconnect();
}

run();
