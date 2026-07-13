const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeOvens() {
    try {
        console.log("Fetching search page...");
        const res = await fetch('https://bancodelperno.com/?s=horno&post_type=product', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        
        console.log("Extracting products...");
        const products = [];
        $('.product, .product-small, .product-item, .product-wrapper').each((i, el) => {
            const title = $(el).find('.woocommerce-loop-product__title, .product-title, h3, h2').first().text().trim();
            const priceText = $(el).find('.price .amount bdi, .price .amount').first().text().trim().replace('$', '').replace(',', '');
            const price = parseFloat(priceText);
            const image = $(el).find('img').first().attr('src');
            
            if (title && !isNaN(price) && title.toLowerCase().includes('horno')) {
                products.push({ title, price, image });
            }
        });

        console.log(`Found ${products.length} ovens:`);
        for (const prod of products) {
            console.log(`- ${prod.title}: $${prod.price}`);
            
            // Add 20% margin
            const retailPrice = +(prod.price * 1.20).toFixed(2);
            
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
                        images: JSON.stringify([prod.image || '']),
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
        await prisma.$disconnect();
    }
}
scrapeOvens();
