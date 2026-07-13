const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const BASE_URL = 'https://tecnomegastore.ec';
const PROVIDER = 'TecnoMega';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

// All main categories from the site
const CATEGORIES = [
    { name: 'Celulares y Tablets',   code: '2N001-CELULARES-TABLETS-MOVILES' },
    { name: 'Computadores',          code: '2N002-COMPUTADORES-COMPUTACION' },
    { name: 'Impresoras',            code: '2N006-IMPRESORAS' },
    { name: 'Monitores',             code: '2N004-MONITORES-COMPUTACION' },
    { name: 'Televisores',           code: '2N012-TELEVISORES-TV_VIDEO' },
    { name: 'Discos Duros',          code: '3N038-DISCOS_DUROS-DISPOSITIVOS_DE_ALMACENAMIENTO-COMPUTACION' },
    { name: 'Motherboards',          code: '4N062-MOTHERBOARDS-HARDWARE-COMPONENTES_REDES-COMPUTACION' },
    { name: 'Memorias RAM',          code: '4N061-MEMORIA__RAM-HARDWARE-COMPONENTES_REDES-COMPUTACION' },
    { name: 'Tarjetas de Video',     code: '4N064-TARJETAS_DE_VIDEO-HARDWARE-COMPONENTES_REDES-COMPUTACION' },
    { name: 'Procesadores',          code: '4N060-PROCESADORES-HARDWARE-COMPONENTES_REDES-COMPUTACION' },
    { name: 'Cases',                 code: '4N059-CASES-HARDWARE-COMPONENTES_REDES-COMPUTACION' },
    { name: 'Fuentes de Poder',      code: '4N102-FUENTES_DE_PODER-HARDWARE-COMPONENTES_REDES-COMPUTACION' },
    // Extended categories
    { name: 'Laptops',               code: '2N003-LAPTOPS-COMPUTACION' },
    { name: 'Audio y Video',         code: '2N011-AUDIO_VIDEO-TV_VIDEO' },
    { name: 'Proyectores',           code: '2N007-PROYECTORES-TV_VIDEO' },
    { name: 'Redes',                 code: '3N030-REDES-COMPONENTES_REDES-COMPUTACION' },
    { name: 'Accesorios PC',         code: '3N025-ACCESORIOS_PC-COMPUTACION' },
    { name: 'Gaming',                code: '2N013-GAMING-COMPUTACION' },
    { name: 'Cámaras',              code: '2N010-CAMARAS-TV_VIDEO' },
    { name: 'UPS y Reguladores',     code: '3N035-UPS_REGULADORES-COMPUTACION' },
    { name: 'Software',              code: '2N009-SOFTWARE-COMPUTACION' },
    { name: 'Tintas y Toners',       code: '3N041-TINTAS_TONER-IMPRESORAS' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPage(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
        return data;
    } catch (e) {
        return null;
    }
}

// Get all product links + skus from a category page
async function getLinksFromCategory(categoryCode, categoryName) {
    const links = new Set();
    console.log(`  📂 Categoría: ${categoryName}`);

    for (let p = 1; p <= 200; p++) {
        // Correct pagination URL format using ?page=p query parameter
        const url = `${BASE_URL}/category/1/${categoryCode}?page=${p}`;
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
        process.stdout.write(`\r     Página ${p}: ${links.size} links`);
        await sleep(500);
    }

    console.log(`\n     ✅ ${links.size} productos en ${categoryName}`);
    return [...links];
}

// Scrape individual product page
async function scrapeProduct(url, categoryName) {
    const html = await fetchPage(url);
    if (!html) return null;

    const $ = cheerio.load(html);

    // Name
    const name = $('h1, .product-title, .product-name').first().text().trim();
    if (!name) return null;

    // SKU / Code from URL
    const codeMatch = url.match(/code=([^&]+)/);
    const sku = codeMatch ? codeMatch[1] : '';

    // Price - Tecnomega uses its own elements
    let price = 0;
    // Try common price selectors
    const priceText = $('.precio, .price, [class*="price"], [class*="precio"]').first().text();
    if (priceText) {
        const cleaned = priceText.replace(/[^\d.,]/g, '').replace(',', '.');
        price = parseFloat(cleaned) || 0;
    }

    // Try all text for price pattern $XXX.XX
    if (price === 0) {
        const allText = $('body').text();
        const priceMatch = allText.match(/\$\s*(\d{1,6}[.,]\d{2})/);
        if (priceMatch) {
            price = parseFloat(priceMatch[1].replace(',', '.')) || 0;
        }
    }

    // Description
    const description = ($('.descripcion, .description, [class*="descripcion"], [class*="description"]').first().text().trim()
        || $('p').slice(0, 3).text().trim()).substring(0, 800);

    // Images
    const images = [];
    $('img[src*="tecnomega"], img[src*="product"], img[data-src*="product"]').each((_, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src');
        if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('banner')) {
            images.push(src);
        }
    });

    return { name, price, sku, description, category: categoryName, images };
}

function estimatePrice(name, keywords) {
    const n = name.toLowerCase();
    const cat = (keywords || '').toLowerCase();
    
    // 1. Safe component overrides (hard drive name checks - laptops or monitors never have "disco duro" or "hard drive" as a word in title)
    if (/\b(disco duro|hard drive|enclosure)\b/.test(n)) {
        return 65.00;
    }
    
    // 2. Category checks (most accurate because it uses the official distributor categorization)
    if (cat.includes('laptop')) return 750.00;
    if (cat.includes('computador')) return 450.00;
    if (cat.includes('celular') || cat.includes('tablet')) {
        if (/\b(tablet|ipad|surf|surface)\b/.test(n)) return 180.00;
        return 350.00;
    }
    if (cat.includes('monitor')) return 160.00;
    if (cat.includes('impresora')) return 200.00;
    if (cat.includes('televisor') || cat.includes('tv') || cat.includes('televisores')) return 500.00;
    if (cat.includes('disco') || cat.includes('almacenamiento')) return 65.00;
    if (cat.includes('ram') || cat.includes('memoria')) return 40.00;
    if (cat.includes('motherboard') || cat.includes('procesador') || cat.includes('video') || cat.includes('tarjeta')) {
        if (cat.includes('tarjetas de video') || cat.includes('video')) return 180.00;
        return 130.00;
    }
    if (cat.includes('case') || cat.includes('fuente') || cat.includes('poder')) return 60.00;
    if (cat.includes('ups') || cat.includes('regulador')) return 80.00;
    if (cat.includes('audio') || cat.includes('video')) return 45.00;
    
    // 3. Fallback name-based checks if category/keywords is empty or generic
    if (/\b(laptop|notebook|not\.|macbook|chromebook|probook|elitebook|dynabook|portege|thinkpad)\b/.test(n) || n.includes('not.')) return 750.00;
    if (/\b(computador|computadora|pc|mini pc|desktop|optiplex|thinkcentre|cop\.)/.test(n) || n.startsWith('cop.')) return 450.00;
    if (/\b(celular|iphone|galaxy|samsung|motorola|xiaomi|redmi|huawei)\b/.test(n)) return 350.00;
    if (/\b(tablet|ipad)\b/.test(n)) return 180.00;
    if (/\b(monitor|pantalla)\b/.test(n)) return 160.00;
    if (/\b(impresora|epson|laserjet|ecotank)\b/.test(n)) return 200.00;
    if (/\b(motherboard|placa madre|mbo|procesador|proc\.)/.test(n)) return 130.00;
    if (/\b(sodimm|ddr4|ddr5|cruzer|datatraveler|pendrive|ram|memoria)\b/.test(n)) return 40.00;
    if (/\b(ssd|m\.2|nvme)\b/.test(n)) return 65.00;
    
    return 35.00;
}
 
async function run() {
    console.log('🚀 Iniciando Scraper: TecnoMega Store (tecnomegastore.ec)...');
    console.log('💻 Tecnología: Laptops, Celulares, PC, Componentes, Impresoras\n');
 
    // Collect all product links across all categories
    const allLinks = new Map(); // url -> categoryName
    console.log('🗺️  FASE 1: Recolectando productos por categoría...\n');
 
    for (const cat of CATEGORIES) {
        const links = await getLinksFromCategory(cat.code, cat.name);
        links.forEach(l => {
            if (!allLinks.has(l)) allLinks.set(l, cat.name);
        });
        await sleep(1000);
    }
 
    const linkList = [...allLinks.entries()];
    console.log(`\n✅ TOTAL LINKS ÚNICOS: ${linkList.length}`);
    console.log('🔍 FASE 2: Extrayendo detalles y precios...\n');
 
    // Get categories to map to Correct Subcategories
    const subcats = await prisma.category.findMany();
 
    let inserted = 0;
    let updated = 0;
    let noPrice = 0;
    let errors = 0;
 
    for (let i = 0; i < linkList.length; i++) {
        const [url, categoryName] = linkList[i];
        try {
            const product = await scrapeProduct(url, categoryName);
            if (!product || !product.name) {
                errors++;
                continue;
            }
 
            // Estimate price if 0 (hidden behind login)
            let finalPrice = product.price;
            if (finalPrice <= 0) {
                finalPrice = estimatePrice(product.name, product.category) * 1.18; // Apply 18% VAT/margin factor to match $531 style
                noPrice++;
            }

            // Map category to a valid visible category
            let dbCategoryId = 'cmoli3wap0000zizqnjlcmhgg'; // Accesorios y Varios default
            const catLower = categoryName.toLowerCase();
            
            // Map category names to DB subcategories
            if (catLower.includes('celular') || catLower.includes('tablet')) {
                dbCategoryId = 'cmr2n905o0001137wi0ufnmdm'; // Celulares y Tablets
            } else if (catLower.includes('computador') || catLower.includes('laptop')) {
                dbCategoryId = 'cmqvwkn530000ejkxk6df8rqz'; // Main Electrónica (or we can find matching subcategory)
            } else if (catLower.includes('ups') || catLower.includes('regulador')) {
                dbCategoryId = 'cmr2n9xoj0003znjlj8jongdt'; // UPS y Energía
            } else if (catLower.includes('audio') || catLower.includes('parlante')) {
                dbCategoryId = 'cmrf5upb700018v6pi7eop1lb'; // Audio y Sonido
            } else {
                // Try database match
                const matchedCat = subcats.find(c => c.name.toLowerCase().includes(catLower));
                if (matchedCat) dbCategoryId = matchedCat.id;
            }

            const existing = await prisma.product.findFirst({
                where: { provider: PROVIDER, name: product.name }
            });

            const data = {
                name: product.name,
                price: Number(finalPrice.toFixed(2)),
                description: product.description,
                images: JSON.stringify(product.images.slice(0, 8)),
                keywords: product.category,
                provider: PROVIDER,
                isActive: true,
                isDeleted: false,
                sku: product.sku || null,
                categoryId: dbCategoryId,
                stock: 10,
                createdAt: new Date(), // Bump to top
            };

            if (existing) {
                await prisma.product.update({ where: { id: existing.id }, data });
                updated++;
                console.log(`[${i+1}/${linkList.length}] 🔄 "${product.name.substring(0, 50)}" → $${data.price}`);
            } else {
                await prisma.product.create({ data });
                inserted++;
                console.log(`[${i+1}/${linkList.length}] ✅ "${product.name.substring(0, 50)}" → $${data.price}`);
            }

        } catch (e) {
            errors++;
            console.log(`[${i+1}/${linkList.length}] ❌ Error: ${e.message.substring(0, 80)}`);
        }

        await sleep(800);
    }

    console.log('\n🎉 ¡TECNOMEGA SINCRONIZACIÓN COMPLETA!');
    console.log(`   ✅ ${inserted} productos nuevos`);
    console.log(`   🔄 ${updated} actualizados`);
    console.log(`   ⚠️  ${noPrice} sin precio`);
    console.log(`   ❌ ${errors} errores`);
    console.log(`   📦 TOTAL: ${inserted + updated} productos de TecnoMega`);

    await prisma.$disconnect();
}

run();
