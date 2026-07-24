const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
    'apple', 'samsung', 'google', 'oneplus', 'xiaomi', 'sony', 'huawei'
];

const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'zte', 'nokia', 'huawei', 'poco', 'apple', 'google', 'oneplus', 'sony'];
const BANNED_KEYWORDS = [
    'funda', 'estuche', 'case', 'mica', 'protector', 'cargador', 'cable', 'repuesto', 'bateria', 'batería', 
    'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 
    'audifono', 'audífono', 'audífonos', 'audifonos', 'tablet', 'ipad', 'imac', 'macbook', 'laptop', 'computador', 'pc',
    'tv', 'televisor', 'monitor', 'ssd', 'disco', 'cerradura', 'cerrojo', 'pasta', 'extensor', 'convertidor',
    'memoria', 'flash', 'trampa', 'caja fuerte', 'holder', 'soporte', 'corsair', 'impresora', 'smartwatch', 'reloj',
    'correa', 'adaptador', 'adapter', 'smart tv', 'television', 'auricular', 'auriculares', 'headset', 'parlante', 'amazon fire',
    'airpod', 'airpods', 'buds', 'watch'
];

function parsePrice(priceStr) {
    if(!priceStr) return 0;
    let clean = priceStr.replace(/[^\d.,]/g, '');
    let lastDot = clean.lastIndexOf('.');
    let lastComma = clean.lastIndexOf(',');
    if (lastComma > lastDot) {
        clean = clean.replace(/\./g, '').replace(/,/g, '.');
    } else if (lastDot > lastComma && lastComma !== -1) {
        clean = clean.replace(/,/g, '');
    } else {
        if (lastComma !== -1) {
            if (clean.length - lastComma === 3) clean = clean.replace(/,/g, '.');
            else clean = clean.replace(/,/g, '');
        } else if (lastDot !== -1) {
             if (clean.length - lastDot !== 3) clean = clean.replace(/\./g, '');
        }
    }
    let val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
}

async function scrapeTelefonosAccesorios() {
    console.log("Starting Scraper for telefonosyaccesorios.com...");

    let categoryDB = await prisma.category.findFirst({
        where: { name: { contains: 'Celulares' } }
    });
    
    if (!categoryDB) {
        categoryDB = await prisma.category.create({
            data: { name: 'Celulares y Tablets', slug: 'celulares-tablets', isActive: true }
        });
    }

    let allExtracted = [];

    for (const cat of CATEGORIES) {
        console.log(`\nExploring category: ${cat}`);
        let pageCount = 1;
        let hasNext = true;

        while(hasNext && pageCount <= 10) {
            const url = `https://telefonosyaccesorios.com/categoria-producto/${cat}/page/${pageCount}/`;
            console.log(`Fetching ${url}...`);
            
            try {
                const res = await axios.get(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }
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
                    
                    const imgEl = $(el).find('img');
                    let image = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || imgEl.attr('src');
                    
                    if (image && image.includes('data:image')) {
                        let srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset');
                        if (srcset) {
                            image = srcset.split(',')[0].split(' ')[0];
                        }
                    }
                    
                    if (name && priceText && image && !image.includes('data:image')) {
                        allExtracted.push({ name, price: priceText, image });
                    }
                });
                
                pageCount++;
            } catch(e) {
                // If 404, it means no more pages
                if (e.response && e.response.status === 404) {
                    hasNext = false;
                } else {
                    console.log(`Failed at page ${pageCount}: ${e.message}`);
                    hasNext = false; // Just stop for this category
                }
            }
        }
    }

    console.log(`\nTotal extracted raw items: ${allExtracted.length}`);
    let inserted = 0;

    for (const p of allExtracted) {
        let priceVal = parsePrice(p.price);
        if (priceVal <= 0) continue;
        
        const nameLow = p.name.toLowerCase();
        
        if (BANNED_KEYWORDS.some(kw => nameLow.includes(kw) || nameLow === kw)) continue;
        
        const hasBrand = PHONE_BRANDS.some(b => nameLow.includes(b));
        const isPhone = nameLow.includes('celular') || nameLow.includes('smartphone') || nameLow.includes('iphone') || nameLow.includes('galaxy') || nameLow.includes('redmi');
        
        if (hasBrand || isPhone) {
            const finalPrice = priceVal * 1.15; // 15% margin
            const images = p.image ? JSON.stringify([p.image]) : JSON.stringify([]);
            
            const exists = await prisma.product.findFirst({
                where: { name: p.name }
            });
            
            if (!exists) {
                await prisma.product.create({
                    data: {
                        name: p.name,
                        description: `Extraído de TelefonosyAccesorios.`,
                        price: finalPrice,
                        sku: `TA-${Math.floor(Math.random() * 100000)}`,
                        categoryId: categoryDB.id,
                        images: images,
                        stock: 5,
                        isActive: true,
                        provider: 'TelefonosyAccesorios'
                    }
                });
                inserted++;
                console.log(`Inserted: ${p.name} at $${finalPrice.toFixed(2)}`);
            } else {
                await prisma.product.update({
                    where: { id: exists.id },
                    data: { price: finalPrice, images: images, provider: 'TelefonosyAccesorios' }
                });
            }
        }
    }
    
    console.log(`\nSuccessfully imported/updated ${inserted} cellphones with a 15% margin!`);
}

scrapeTelefonosAccesorios().catch(console.error).finally(() => prisma.$disconnect());
