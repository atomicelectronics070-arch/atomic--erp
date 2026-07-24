const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCelularQuitoImages() {
    console.log("Fetching again to fix images...");
    let pageCount = 1;
    let hasNext = true;
    let allExtracted = [];

    while(hasNext && pageCount <= 10) {
        const url = `https://www.celularquito.com/tienda/page/${pageCount}/`;
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
                
                const imgEl = $(el).find('img');
                let image = imgEl.attr('data-src') || imgEl.attr('data-lazy-src') || imgEl.attr('src');
                
                // Si la imagen es un placeholder SVG, buscar otra dentro del div
                if (image && image.includes('data:image')) {
                    // Try to find srcset
                    let srcset = imgEl.attr('srcset') || imgEl.attr('data-srcset');
                    if (srcset) {
                        image = srcset.split(',')[0].split(' ')[0];
                    }
                }
                
                if (name && image && !image.includes('data:image')) {
                    allExtracted.push({ name, image });
                }
            });
            
            pageCount++;
        } catch(e) {
            hasNext = false;
        }
    }

    let updated = 0;
    for (const item of allExtracted) {
        // Encontrar el producto en la DB
        const products = await prisma.product.findMany({
            where: { name: item.name, provider: 'CelularQuito' }
        });
        
        for (const p of products) {
            await prisma.product.update({
                where: { id: p.id },
                data: { images: JSON.stringify([item.image]) }
            });
            updated++;
            console.log(`Updated Image for: ${p.name}`);
        }
    }
    
    console.log(`Updated images for ${updated} products.`);
}

fixCelularQuitoImages().catch(console.error).finally(() => prisma.$disconnect());
