// Full auto: clicks each thumbnail in the WooCommerce gallery and captures the full-size image
const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function nameToSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

function extractSku(imageUrl) {
    if (!imageUrl) return null;
    const match = imageUrl.match(/\/(BPA?\d+)/i);
    return match ? match[1] : null;
}

async function getCarouselImages(page) {
    // Wait for the gallery to load
    await page.waitForSelector('.woocommerce-product-gallery', { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // Get all thumbnail elements
    const thumbCount = await page.evaluate(() => {
        const thumbs = document.querySelectorAll('.flex-control-thumbs li, .woocommerce-product-gallery__image');
        return thumbs.length;
    });

    console.log(`    Gallery has ${thumbCount} images/thumbs`);

    const allImages = new Set();

    // First, get the main visible image
    const mainImg = await page.evaluate(() => {
        const mainEl = document.querySelector('.woocommerce-product-gallery__image a');
        if (mainEl) return mainEl.href;
        const img = document.querySelector('.woocommerce-product-gallery__image img');
        if (img) return img.getAttribute('data-large_image') || img.src;
        return null;
    });
    if (mainImg) allImages.add(mainImg);

    // Click each thumbnail and capture the resulting large image
    const thumbSelector = '.flex-control-thumbs li';
    const thumbs = await page.$$(thumbSelector);
    
    for (let i = 0; i < thumbs.length; i++) {
        try {
            await thumbs[i].click();
            await new Promise(r => setTimeout(r, 800)); // wait for transition
            
            const currentImg = await page.evaluate(() => {
                // The main gallery image changes after clicking a thumb
                const mainEl = document.querySelector('.woocommerce-product-gallery__image:not(.flex-active-slide) a, .woocommerce-product-gallery__image.flex-active-slide a');
                if (mainEl && mainEl.href) return mainEl.href;
                const img = document.querySelector('.woocommerce-product-gallery__image.flex-active-slide img, .wp-post-image');
                if (img) return img.getAttribute('data-large_image') || img.src;
                return null;
            });
            if (currentImg) allImages.add(currentImg);
        } catch(e) {
            console.log(`    Thumb ${i} click error: ${e.message.slice(0, 50)}`);
        }
    }

    // Also grab all anchor hrefs from gallery as fallback
    const allAnchors = await page.evaluate(() => {
        const imgs = [];
        document.querySelectorAll('.woocommerce-product-gallery__image a').forEach(a => {
            if (a.href && a.href.match(/\.(jpg|jpeg|png|webp)/i)) imgs.push(a.href);
        });
        // Also grab data-large_image from all gallery imgs
        document.querySelectorAll('.woocommerce-product-gallery img').forEach(img => {
            const src = img.getAttribute('data-large_image') || img.getAttribute('data-src');
            if (src && src.match(/\.(jpg|jpeg|png|webp)/i)) imgs.push(src);
        });
        return imgs;
    });
    allAnchors.forEach(u => allImages.add(u));

    // Filter out thumbnails (tiny sizes)
    return [...allImages].filter(u => !u.match(/-\d{2,3}x\d{2,3}\.(jpg|jpeg|png|webp)/i));
}

async function getDescription(page) {
    return page.evaluate(() => {
        const shortDesc = document.querySelector('.woocommerce-product-details__short-description');
        const tabDesc = document.querySelector('#tab-description, .woocommerce-Tabs-panel--description');
        let html = '';
        if (shortDesc) html += shortDesc.innerHTML.trim();
        if (tabDesc) html += tabDesc.innerHTML.trim();
        return html;
    });
}

async function findProductUrl(page, oven, sku) {
    const slug = nameToSlug(oven.name);
    const urlsToTry = [
        `https://bpecuador.com/producto/${slug}/`,
        sku ? `https://bpecuador.com/producto/${sku.toLowerCase()}/` : null,
        `https://bpecuador.com/?s=${encodeURIComponent(oven.name.slice(0, 40))}&post_type=product`,
    ].filter(Boolean);

    for (const url of urlsToTry) {
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            const isProductPage = await page.evaluate(() =>
                !!document.querySelector('.product_title, .woocommerce-product-gallery, .single-product .summary')
            );

            if (isProductPage) return true;

            // It's a search results page — click first result
            const firstLink = await page.evaluate(() => {
                const a = document.querySelector('.woocommerce-LoopProduct-link');
                return a ? a.href : null;
            });
            if (firstLink && !firstLink.includes('categoria')) {
                await page.goto(firstLink, { waitUntil: 'domcontentloaded', timeout: 30000 });
                const ok = await page.evaluate(() =>
                    !!document.querySelector('.product_title, .woocommerce-product-gallery')
                );
                if (ok) return true;
            }
        } catch(e) {
            // try next
        }
    }
    return false;
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
        console.log(`\n🔍 Found ${ovens.length} ovens. Starting full carousel scrape...\n`);

        for (const oven of ovens) {
            console.log(`\n📦 ${oven.name}`);
            let currentImages = [];
            try { currentImages = JSON.parse(oven.images || '[]'); } catch(e){}
            const sku = extractSku(currentImages[0]);

            const found = await findProductUrl(page, oven, sku);
            if (!found) {
                console.log(`  ❌ Product page not found, skipping.`);
                continue;
            }

            console.log(`  ✅ On product page: ${page.url()}`);

            const images = await getCarouselImages(page);
            const description = await getDescription(page);

            console.log(`  📸 Total images captured: ${images.length}`);
            console.log(`  📝 Description: ${description.length} chars`);

            await prisma.product.update({
                where: { id: oven.id },
                data: {
                    images: JSON.stringify(images.length > 0 ? images : currentImages),
                    description: description || oven.description,
                    ...(sku ? { sku } : {})
                }
            });

            console.log(`  💾 Saved to DB!`);
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log('\n\n✅ ALL DONE! All ovens updated with full carousel images and descriptions.');

    } catch(e) {
        console.error('FATAL:', e.message);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

run();
