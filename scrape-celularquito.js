const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'zte', 'nokia', 'huawei', 'poco', 'apple'];
const BANNED_KEYWORDS = [
    'funda', 'estuche', 'case', 'mica', 'protector', 'cargador', 'cable', 'repuesto', 'bateria', 'batería', 
    'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 
    'audifono', 'audífono', 'audífonos', 'audifonos', 'tablet', 'ipad', 'imac', 'macbook', 'laptop', 'computador', 'pc',
    'tv', 'televisor', 'monitor', 'ssd', 'disco', 'cerradura', 'cerrojo', 'pasta', 'extensor', 'convertidor',
    'memoria', 'flash', 'trampa', 'caja fuerte', 'holder', 'soporte', 'corsair', 'impresora', 'smartwatch', 'reloj',
    'correa', 'adaptador', 'adapter', 'smart tv', 'television', 'auricular', 'auriculares', 'headset', 'parlante', 'amazon fire',
    'airpod', 'airpods', 'buds', 'watch'
];

function parseEcuadorianPrice(priceStr) {
    // Examples: "1.610,00" -> 1610.00
    // "850,50" -> 850.50
    // "$ 1.250" -> 1250
    if(!priceStr) return 0;
    
    // Remove symbols and letters
    let clean = priceStr.replace(/[^\d.,]/g, '');
    
    // If it has both . and , then usually . is thousand separator and , is decimal (1.610,00)
    // OR it could be 1,610.00
    // Let's find the last separator
    let lastDot = clean.lastIndexOf('.');
    let lastComma = clean.lastIndexOf(',');
    
    if (lastComma > lastDot) {
        // format is 1.610,00
        clean = clean.replace(/\./g, '');
        clean = clean.replace(/,/g, '.');
    } else if (lastDot > lastComma && lastComma !== -1) {
        // format is 1,610.00
        clean = clean.replace(/,/g, '');
    } else {
        // only one type of separator
        if (lastComma !== -1) {
            // maybe 850,50
            if (clean.length - lastComma === 3) {
                // assume it's decimal
                clean = clean.replace(/,/g, '.');
            } else {
                // assume thousand
                clean = clean.replace(/,/g, '');
            }
        } else if (lastDot !== -1) {
             if (clean.length - lastDot === 3) {
                // decimal is ok
            } else {
                // thousand
                clean = clean.replace(/\./g, '');
            }
        }
    }
    
    let val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
}

async function scrapeCelularQuito() {
    console.log("Starting Scraper for celularquito.com...");

    // First clean up the bad inserts from the failed puppeteer run
    await prisma.product.deleteMany({
        where: { price: { lte: 10 }, provider: 'CelularQuito' }
    });
    await prisma.product.deleteMany({
        where: { name: { contains: 'Airpods' }, provider: 'CelularQuito' }
    });

    let category = await prisma.category.findFirst({
        where: { name: { contains: 'Celulares' } }
    });
    
    if (!category) {
        category = await prisma.category.create({
            data: { name: 'Celulares y Tablets', slug: 'celulares-tablets', isActive: true }
        });
    }

    let allExtracted = [];
    let pageCount = 1;
    let hasNext = true;

    while(hasNext && pageCount <= 10) {
        const url = `https://www.celularquito.com/tienda/page/${pageCount}/`;
        console.log(`Fetching ${url}...`);
        
        try {
            const res = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            
            const $ = cheerio.load(res.data);
            const items = $('.product, .type-product, .wc-block-grid__product');
            
            if (items.length === 0) {
                hasNext = false;
                break;
            }
            
            items.each((i, el) => {
                const name = $(el).find('.woocommerce-loop-product__title, h2, h3, .product-title').text().trim();
                let priceText = '';
                
                const priceEl = $(el).find('.price');
                if (priceEl.length) {
                    const ins = priceEl.find('ins');
                    if (ins.length) priceText = ins.text().trim();
                    else priceText = priceEl.text().trim();
                }
                
                let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || $(el).find('img').attr('data-lazy-src');
                
                if (name && priceText) {
                    allExtracted.push({ name, price: priceText, image });
                }
            });
            
            pageCount++;
        } catch(e) {
            console.log(`Stopped fetching at page ${pageCount}: ${e.message}`);
            hasNext = false;
        }
    }

    console.log(`Total extracted raw items: ${allExtracted.length}`);
    let inserted = 0;

    for (const p of allExtracted) {
        let priceVal = parseEcuadorianPrice(p.price);
        
        if (priceVal <= 0) continue;
        
        const nameLow = p.name.toLowerCase();
        
        if (BANNED_KEYWORDS.some(kw => nameLow.includes(kw))) continue;
        
        const hasBrand = PHONE_BRANDS.some(b => nameLow.includes(b));
        const isPhone = nameLow.includes('celular') || nameLow.includes('smartphone') || nameLow.includes('iphone') || nameLow.includes('galaxy') || nameLow.includes('redmi');
        
        if (hasBrand || isPhone) {
            const finalPrice = priceVal * 1.15;
            const images = p.image ? JSON.stringify([p.image]) : JSON.stringify([]);
            
            const exists = await prisma.product.findFirst({
                where: { name: p.name }
            });
            
            if (!exists) {
                await prisma.product.create({
                    data: {
                        name: p.name,
                        description: `Extraído de CelularQuito.`,
                        price: finalPrice,
                        sku: `CQ-${Math.floor(Math.random() * 100000)}`,
                        categoryId: category.id,
                        images: images,
                        stock: 5,
                        isActive: true,
                        provider: 'CelularQuito'
                    }
                });
                inserted++;
                console.log(`Inserted: ${p.name} at $${finalPrice.toFixed(2)} (Original: $${priceVal})`);
            } else {
                await prisma.product.update({
                    where: { id: exists.id },
                    data: { price: finalPrice, provider: 'CelularQuito' }
                });
            }
        }
    }
    
    console.log(`\nSuccessfully imported/updated ${inserted} cellphones with a 15% margin!`);
}

scrapeCelularQuito().catch(console.error).finally(() => prisma.$disconnect());
