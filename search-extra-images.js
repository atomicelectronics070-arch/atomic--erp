// Search Google/Bing Images for each oven and grab extra product photos
const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function searchExtraImages(page, productName, existingImages) {
    const query = encodeURIComponent(`${productName} horno empotrar producto`);
    const url = `https://www.bing.com/images/search?q=${query}&form=HDRSC2&first=1`;

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        const images = await page.evaluate((existingImgs) => {
            const results = [];
            // Bing image thumbnails have data-src or m attribute with JSON
            const items = document.querySelectorAll('.iusc, img.mimg');
            
            items.forEach(item => {
                let src = null;
                
                // Try to get full-size URL from data attribute
                const mAttr = item.getAttribute('m');
                if (mAttr) {
                    try {
                        const parsed = JSON.parse(mAttr);
                        if (parsed.murl) src = parsed.murl;
                    } catch(e) {}
                }
                
                // Fallback: src attribute
                if (!src) {
                    src = item.getAttribute('src') || item.getAttribute('data-src');
                }
                
                if (src && 
                    src.startsWith('http') && 
                    !src.includes('bing.com') &&
                    !src.includes('microsoft.com') &&
                    !existingImgs.some(e => e === src) &&
                    results.length < 5) {
                    results.push(src);
                }
            });
            
            return results.slice(0, 5);
        }, existingImages);
        
        return images;
    } catch(e) {
        console.log(`  Bing search error: ${e.message.slice(0, 60)}`);
        return [];
    }
}

async function run() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
        defaultViewport: { width: 1280, height: 900 }
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        const ovens = await prisma.product.findMany({
            where: { provider: 'Banco del Perno', name: { contains: 'horno', mode: 'insensitive' } }
        });

        console.log(`\n🔍 Searching extra images for ${ovens.length} ovens...\n`);

        for (const oven of ovens) {
            console.log(`\n📦 ${oven.name}`);

            let currentImages = [];
            try { currentImages = JSON.parse(oven.images || '[]'); } catch(e) {}

            if (currentImages.length >= 4) {
                console.log(`  Already has ${currentImages.length} images, skipping.`);
                continue;
            }

            const extraImages = await searchExtraImages(page, oven.name, currentImages);
            console.log(`  Found ${extraImages.length} extra images from Bing`);

            const allImages = [...new Set([...currentImages, ...extraImages])].slice(0, 6);
            
            if (allImages.length > currentImages.length) {
                await prisma.product.update({
                    where: { id: oven.id },
                    data: { images: JSON.stringify(allImages) }
                });
                console.log(`  💾 Saved! Now has ${allImages.length} total images.`);
            } else {
                console.log(`  ⚠️ No new images found.`);
            }

            await new Promise(r => setTimeout(r, 2500));
        }

        console.log('\n✅ ALL DONE! Extra images added.');

    } catch(e) {
        console.error('FATAL:', e.message);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
