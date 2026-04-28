const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
    console.log("🚀 Iniciando Scraper: La Competencia (competencia.com.ec)...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let totalSync = 0;

    try {
        const history = await prisma.extractionHistory.create({
            data: { url: 'https://competencia.com.ec/2-inicio', domain: 'competencia.com.ec', status: 'PROCESSING', itemCount: 0 }
        });

        // Prestashop usually has less than 20 pages if it's 24 items per page and total is ~300
        for (let p = 1; p <= 15; p++) {
            console.log(`\n🔍 Escaneando página ${p}...`);
            const url = `https://competencia.com.ec/2-inicio?page=${p}`;
            
            const response = await page.goto(url);
            
            await page.waitForTimeout(3000);

            // Get all product links from the grid
            const links = await page.$$eval('.product-miniature a.thumbnail, .thumbnail-container a.thumbnail, .product-title a', (anchors) => {
                return [...new Set(anchors.map(a => a.href))];
            });

            if (links.length === 0) {
                console.log(`⚠️ No se encontraron enlaces de productos en la página ${p}. Fin de paginación o posible cambio de estructura.`);
                // If the generic prestashop selectors didn't work, let's try getting all hrefs that look like products
                const allLinks = await page.$$eval('a', (anchors) => anchors.map(a => a.href));
                const productLinks = [...new Set(allLinks.filter(href => href.includes('.html')))];
                if (productLinks.length === 0) break;
                
                // Use the alternative links
                links.push(...productLinks);
            }

            // Clean up links to only process actual product pages (.html usually in prestashop)
            const validLinks = links.filter(l => l.includes('.html'));

            console.log(`📦 Encontrados ${validLinks.length} productos válidos en la página ${p}.`);
            
            if (validLinks.length === 0) break;

            for (const link of validLinks) {
                console.log(`🔍 Extrayendo: ${link}`);
                await page.goto(link);
                await page.waitForTimeout(2000);

                const data = await page.evaluate(() => {
                    const title = document.querySelector('h1[itemprop="name"], h1.h1, .product-title')?.innerText.trim();
                    const priceText = document.querySelector('[itemprop="price"], .current-price span, .price')?.innerText || '0';
                    const priceRaw = priceText.replace('$', '').replace(',', '.').trim();
                    const description = document.querySelector('#description, .product-description')?.innerHTML || '';
                    const imgs = [...document.querySelectorAll('.product-cover img, .product-images img')].map(img => img.src);
                    
                    return { title, price: parseFloat(priceRaw) || 0, description, images: imgs };
                });

                if (data.title) {
                    // "ponles el mismo precio para mi web" -> multiplier 1
                    const finalPrice = data.price;
                    
                    await prisma.product.upsert({
                        where: { sku: data.title },
                        update: {
                            name: data.title,
                            price: finalPrice,
                            description: data.description,
                            images: JSON.stringify(data.images),
                            isActive: true,
                            isDeleted: false,
                            provider: 'La Competencia'
                        },
                        create: {
                            name: data.title,
                            sku: data.title,
                            price: finalPrice,
                            description: data.description,
                            images: JSON.stringify(data.images),
                            isActive: true,
                            isDeleted: false,
                            provider: 'La Competencia'
                        }
                    });
                    totalSync++;
                    console.log(`✅ Sincronizado: ${data.title} - $${finalPrice}`);
                }
            }
        }

        await prisma.extractionHistory.update({
            where: { id: history.id },
            data: { status: 'COMPLETED', itemCount: totalSync }
        });

        console.log(`\n✨ MISIÓN COMPLETADA: ${totalSync} productos de La Competencia sincronizados.`);

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
