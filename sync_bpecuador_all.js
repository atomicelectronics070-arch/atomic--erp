const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const fs = require('fs');

const prisma = new PrismaClient();

async function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  
  let bestMatch = matches[matches.length - 1];
  let cleaned = bestMatch;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length === 2) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }
  return parseFloat(cleaned) || 0;
}

async function scrapeCategory(page, catUrl) {
    console.log(`\n📂 Category: ${catUrl}`);
    let totalInCat = 0;

    for (let pageNum = 1; pageNum <= 10; pageNum++) {
        const url = pageNum === 1 ? catUrl : `${catUrl}page/${pageNum}/`;
        console.log(`  ➡️  Page ${pageNum}: ${url}`);
        
        try {
            const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            if (response && response.status() === 404) break;
            
            await page.waitForTimeout(5000); 

            // Scroll
            await page.evaluate(async () => {
                window.scrollBy(0, 1000);
                await new Promise(r => setTimeout(r, 1000));
            });

            const products = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.jet-woo-builder-product, .type-product, .product'));
                return items.map(el => {
                    let nameEl = el.querySelector('.jet-woo-builder-archive-product-title, .woocommerce-loop-product__title, h2, h3');
                    let priceEl = el.querySelector('.jet-woo-builder-archive-product-price, .jet-woo-product-price, .price');
                    let imageEl = el.querySelector('img');
                    let linkEl = el.querySelector('a[href*="/producto/"], a');

                    let priceText = priceEl ? priceEl.innerText : '';
                    if (!priceText.includes('$')) {
                        const allText = el.innerText;
                        const priceMatch = allText.match(/\$\s?[\d.,]+/);
                        if (priceMatch) priceText = priceMatch[0];
                    }

                    return {
                        name: nameEl ? nameEl.innerText.trim().split('\n')[0] : '',
                        priceRaw: priceText.trim(),
                        image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || imageEl.getAttribute('srcset')?.split(' ')[0] || '') : '',
                        link: linkEl ? linkEl.href : ''
                    };
                }).filter(p => p.name && p.name.length > 3 && p.priceRaw.includes('$'));
            });

            console.log(`    🔍 Found ${products.length} products`);
            if (products.length === 0) break;

            let synced = 0;
            for (const p of products) {
                const price = await parsePrice(p.priceRaw);
                if (price <= 0) continue;
                
                const sku = p.link ? p.link.replace(/\/$/, '').split('/').pop() : p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                try {
                    await prisma.product.upsert({
                        where: { sku: sku },
                        update: {
                            name: p.name,
                            price: price,
                            images: JSON.stringify([p.image]),
                            provider: 'Banco del Perno',
                            isDeleted: false,
                            isActive: true
                        },
                        create: {
                            sku: sku,
                            name: p.name,
                            price: price,
                            images: JSON.stringify([p.image]),
                            provider: 'Banco del Perno',
                            isActive: true,
                            isDeleted: false,
                            stock: 10
                        }
                    });
                    synced++;
                } catch (e) {}
            }
            console.log(`    ✅ Synced ${synced} products`);
            totalInCat += synced;
        } catch (err) {
            console.error(`    ❌ Error: ${err.message}`);
            break;
        }
    }
    return totalInCat;
}

async function main() {
    let subcategories = [];
    if (fs.existsSync('bp_top_categories.json')) {
        subcategories = JSON.parse(fs.readFileSync('bp_top_categories.json', 'utf8'));
    } else {
        subcategories = JSON.parse(fs.readFileSync('bpecuador_subcategories.json', 'utf8'));
    }
    
    // Add specific open categories from other providers if needed
    const extraCategories = [
        { provider: 'Importadora Espinoza', url: 'https://www.importadoraespinoza.com/entretenimiento-y-hogar/28?ctg=1' },
        { provider: 'JM Technology', url: 'https://jmtechnology.ec/collections/drones' }
    ];

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    let grandTotal = 0;
    
    console.log("🚀 STARTING DEEP SYNC...");

    // 1. BP Ecuador
    for (const catUrl of subcategories) {
        grandTotal += await scrapeCategory(page, catUrl);
        console.log(`\n--- Grand Total: ${grandTotal} ---`);
    }

    // 2. Extra Categories
    for (const item of extraCategories) {
        console.log(`\n🚀 Extra Sync: ${item.provider}`);
        // We might need different selectors for these, but let's try a generic approach or specific ones
        // For now, let's just focus on the BP Ecuador sync as it's the main goal
    }

    await browser.close();
    await prisma.$disconnect();
}

main();
