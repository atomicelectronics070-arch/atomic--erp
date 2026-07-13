const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeSteren() {
    console.log('Starting Steren Scraper (V2)...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Expanded targets to get all speakers, audio items, and standard catalog
    const queries = ['parlante', 'bocina', 'bafle', 'audio', 'seguridad', 'energia', 'iluminacion'];
    let allProducts = [];
    
    for (const q of queries) {
        let pageNum = 1;
        const maxPages = 4; // Fetch up to 4 pages per query to get all speakers and other items
        
        while (pageNum <= maxPages) {
            console.log(`Searching for: ${q} (Page ${pageNum})...`);
            const targetUrl = `https://www.steren.com.ec/catalogsearch/result/index/?q=${q}&p=${pageNum}`; 
            
            try {
                await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForSelector('.product-item', { timeout: 8000 });
                
                const products = await page.evaluate(() => {
                    const items = document.querySelectorAll('.product-item');
                    if (items.length === 0) return [];
                    return Array.from(items).map(el => {
                        const nameEl = el.querySelector('.product-item-link');
                        const priceEl = el.querySelector('.price-wrapper .price, .price-container .price, [data-price-type="finalPrice"] .price');
                        const imgEl = el.querySelector('.product-image-photo');
                        const skuEl = el.querySelector('.product-item-details'); 
                        
                        let priceText = priceEl ? priceEl.innerText.trim() : '';
                        let price = 0;
                        if (priceText) {
                            let clean = priceText.replace(/[^\d.,]/g, '').trim();
                            if (clean) {
                                const hasComma = clean.includes(',');
                                const hasDot = clean.includes('.');
                                if (hasComma && hasDot) {
                                    if (clean.indexOf(',') < clean.indexOf('.')) {
                                        clean = clean.replace(/,/g, '');
                                    } else {
                                        clean = clean.replace(/\./g, '').replace(',', '.');
                                    }
                                } else if (hasComma) {
                                    const parts = clean.split(',');
                                    if (parts[1] && parts[1].length === 2) {
                                        clean = clean.replace(',', '.');
                                    } else {
                                        clean = clean.replace(/,/g, '');
                                    }
                                } else if (hasDot) {
                                    const parts = clean.split('.');
                                    if (parts[1] && parts[1].length === 2) {
                                        // decimal dot, keep it
                                    } else {
                                        clean = clean.replace(/\./g, '');
                                    }
                                }
                                price = parseFloat(clean) || 0;
                            }
                        }
                        
                        let sku = skuEl ? (skuEl.innerText.split('\n')[1] || '').trim() : '';
                        if (!sku || sku.length > 20) sku = `ST-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
                        return {
                            name: nameEl ? nameEl.innerText.trim() : '',
                            sku: sku,
                            price: price,
                            image: imgEl ? imgEl.src : '',
                            url: nameEl ? nameEl.href : '',
                            description: 'Producto Original Steren Ecuador - Calidad y Garantía.'
                        };
                    });
                });
                
                if (products.length === 0) {
                    console.log(`  No products found on page ${pageNum} for query "${q}". Stopping pagination.`);
                    break;
                }
                
                allProducts = [...allProducts, ...products];
                console.log(`  Found ${products.length} items on page ${pageNum} for query "${q}"`);
                pageNum++;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.log(`  Error on page ${pageNum} for query "${q}": ${e.message}`);
                break;
            }
        }
    }
    
    // Deduplicate all scraped products by SKU/URL to avoid double-ups from overlapping queries
    const uniqueMap = new Map();
    allProducts.forEach(p => { if (p.name && p.price > 0 && !uniqueMap.has(p.sku)) uniqueMap.set(p.sku, p); });
    allProducts = [...uniqueMap.values()];
    
    console.log(`Total unique found: ${allProducts.length}. Syncing to DB with 15% margin...`);;

    // Get "Accesorios y Varios" category ID
    let categoryId = 'cmoli3wap0000zizqnjlcmhgg'; // Correct ID for Accesorios y Varios
    try {
        const cat = await prisma.category.findFirst({ where: { name: { contains: 'Accesorios', mode: 'insensitive' } } });
        if (cat) categoryId = cat.id;
    } catch(e) {}

    let count = 0;
    for (const p of allProducts) {
        if (!p.name || isNaN(p.price) || p.price <= 0) continue;

        const sellingPrice = p.price * 1.15;
        
        // Determine category based on product name keywords
        let productCategoryId = categoryId;
        const nameLower = p.name.toLowerCase();
        
        if (nameLower.includes('regulador') || nameLower.includes('ups') || nameLower.includes('estabilizador')) {
            productCategoryId = 'cmr2n9xoj0003znjlj8jongdt'; // UPS y Energía
        } else if (nameLower.includes('parlante') || nameLower.includes('bocina') || nameLower.includes('bafle') || nameLower.includes('audifono') || nameLower.includes('audífono') || nameLower.includes('auricular') || nameLower.includes('microfono') || nameLower.includes('micrófono') || nameLower.includes('diadema') || nameLower.includes('soundbar') || nameLower.includes('sonido')) {
            productCategoryId = 'cmrf5upb700018v6pi7eop1lb'; // Audio y Sonido
        } else if (nameLower.includes('cámara') || nameLower.includes('camara')) {
            productCategoryId = 'cmr1ljg860003enspbm1m5tic'; // Cámaras de Seguridad
        } else if (nameLower.includes('domótica') || nameLower.includes('domotica') || nameLower.includes('cerradura') || nameLower.includes('alarma') || nameLower.includes('sensor')) {
            productCategoryId = 'cmqvwkvfb000gejkx2kpt69zq'; // Domótica
        }

        try {
            await prisma.product.upsert({
                where: { sku: p.sku },
                update: {
                    price: sellingPrice,
                    images: JSON.stringify([p.image]),
                    isActive: true,
                    isDeleted: false,
                    provider: 'STEREN',
                    categoryId: productCategoryId, // Update category if it was wrong
                    updatedAt: new Date()
                },
                create: {
                    name: p.name,
                    sku: p.sku,
                    price: sellingPrice,
                    images: JSON.stringify([p.image]),
                    description: p.description,
                    isActive: true,
                    isDeleted: false,
                    provider: 'STEREN',
                    categoryId: productCategoryId,
                    stock: 10
                }
            });
            count++;
        } catch (err) {
            console.error(`Error syncing ${p.name}:`, err.message);
        }
    }

    console.log(`Scraper finished. ${count} products updated/created.`);
    await browser.close();
    await prisma.$disconnect();
}

scrapeSteren().catch(console.error);
