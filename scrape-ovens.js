const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeOvens() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        console.log("Navigating to search page...");
        await page.goto('https://bancodelperno.com/?s=horno&post_type=product', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        console.log("Extracting products...");
        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('.product, .product-small, .product-item');
            const data = [];
            items.forEach(item => {
                const titleEl = item.querySelector('.woocommerce-loop-product__title, .product-title, h3');
                const priceEl = item.querySelector('.price .amount bdi, .price .amount');
                const imgEl = item.querySelector('img');
                
                if (titleEl && priceEl) {
                    let title = titleEl.innerText.trim();
                    let priceText = priceEl.innerText.trim().replace('$', '').replace(',', '');
                    let price = parseFloat(priceText);
                    let image = imgEl ? imgEl.src : '';
                    if (!isNaN(price) && title.toLowerCase().includes('horno')) {
                        data.push({ title, price, image });
                    }
                }
            });
            return data;
        });

        console.log(`Found ${products.length} ovens:`);
        for (const prod of products) {
            console.log(`- ${prod.title}: $${prod.price}`);
            
            // Add 20% margin
            const retailPrice = +(prod.price * 1.20).toFixed(2);
            
            // Check if exists
            const existing = await prisma.product.findFirst({
                where: { name: prod.title, provider: 'Banco del Perno' }
            });
            
            if (!existing) {
                await prisma.product.create({
                    data: {
                        name: prod.title,
                        description: `Horno original importado.`,
                        price: retailPrice,
                        compareAtPrice: prod.price,
                        images: JSON.stringify([prod.image]),
                        provider: 'Banco del Perno',
                        stock: 5,
                        isActive: true
                    }
                });
                console.log(`Added to DB with price $${retailPrice}`);
            } else {
                await prisma.product.update({
                    where: { id: existing.id },
                    data: { price: retailPrice, compareAtPrice: prod.price }
                });
                console.log(`Updated DB price to $${retailPrice}`);
            }
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}
scrapeOvens();
