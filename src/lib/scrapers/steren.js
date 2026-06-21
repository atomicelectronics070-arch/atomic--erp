const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeSteren() {
    console.log('Starting Steren Scraper (V2)...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Multiple targets to get a good variety
    const queries = ['seguridad', 'energia', 'iluminacion', 'audio', 'computacion'];
    let allProducts = [];

    for (const q of queries) {
        console.log(`Searching for: ${q}...`);
        const targetUrl = `https://www.steren.com.ec/catalogsearch/result/?q=${q}`; 
        await page.goto(targetUrl, { waitUntil: 'networkidle' });

        try {
            await page.waitForSelector('.product-item', { timeout: 10000 });
            const products = await page.evaluate(() => {
                const items = document.querySelectorAll('.product-item');
                return Array.from(items).map(el => {
                    const nameEl = el.querySelector('.product-item-link');
                    const priceEl = el.querySelector('.price-wrapper .price, .price-container .price, [data-price-type="finalPrice"] .price');
                    const imgEl = el.querySelector('.product-image-photo');
                    const skuEl = el.querySelector('.product-item-details'); 
                    
                    let priceText = priceEl ? priceEl.innerText.replace(/[^\d.,]/g, '').trim() : '0';
                    // Convert "1.234,56" or "1,234.56" to float
                    let price = 0;
                    if (priceText) {
                        // Ecuadorian format usually uses dot for thousands and comma for decimals, 
                        // but Steren might use US format. Let's handle both.
                        const cleaned = priceText.replace(/\./g, '').replace(',', '.');
                        price = parseFloat(cleaned);
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
            allProducts = [...allProducts, ...products];
            console.log(`Found ${products.length} items for ${q}`);
        } catch (e) {
            console.log(`No items found for ${q}`);
        }
    }

    console.log(`Total found: ${allProducts.length}. Syncing to DB with 15% margin...`);

    // Get "Accesorios y Varios" category ID
    let categoryId = 'cmoe777fa0003wwr9gaosfxgt'; // Fallback
    try {
        const cat = await prisma.category.findFirst({ where: { name: { contains: 'Accesorios', mode: 'insensitive' } } });
        if (cat) categoryId = cat.id;
    } catch(e) {}

    let count = 0;
    for (const p of allProducts) {
        if (!p.name || isNaN(p.price) || p.price <= 0) continue;

        const sellingPrice = p.price * 1.15;

        try {
            await prisma.product.upsert({
                where: { sku: p.sku },
                update: {
                    price: sellingPrice,
                    images: JSON.stringify([p.image]),
                    isActive: true,
                    isDeleted: false,
                    provider: 'STEREN',
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
                    categoryId: categoryId,
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
