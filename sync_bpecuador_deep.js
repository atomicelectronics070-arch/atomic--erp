const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');

const prisma = new PrismaClient();

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Ranges: "$1.44 – $1.79" -> take the lower
  const parts = priceStr.split(/[–\-]/);
  priceStr = parts[0];
  
  const matches = priceStr.match(/[\d.,]+/g);
  if (!matches) return 0;
  
  let cleaned = matches[matches.length - 1];
  if (cleaned.includes(',') && cleaned.includes('.')) {
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    const parts2 = cleaned.split(',');
    if (parts2.length === 2 && parts2[1].length === 2) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }
  return parseFloat(cleaned) || 0;
}

async function main() {
  console.log("======================================");
  console.log("🚀 Starting Deep Sync: Banco del Perno (BP Ecuador)");
  console.log("🔗 URL: https://bpecuador.com/tienda/");
  console.log("======================================");

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'es-ES,es;q=0.9'
  });

  let totalSynced = 0;
  let consecutiveEmpty = 0;
  
  for (let pageNum = 1; pageNum <= 500; pageNum++) {
    const url = pageNum === 1 
      ? 'https://bpecuador.com/tienda/' 
      : `https://bpecuador.com/tienda/page/${pageNum}/`;
    
    console.log(`\n➡️  Page ${pageNum}: ${url}`);
    
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      
      if (response && response.status() === 404) {
        console.log("404 reached - end of catalog!");
        break;
      }

      // Scroll to trigger lazy loading
      await page.evaluate(async () => {
        for (let i = 0; i < 4; i++) {
          window.scrollBy(0, 800);
          await new Promise(r => setTimeout(r, 600));
        }
      });
      await page.waitForTimeout(1500);

      const products = await page.evaluate(() => {
        // WooCommerce standard selectors
        const items = Array.from(document.querySelectorAll('li.product, .wc-block-grid__product, .type-product'));
        return items.map(el => {
          const nameEl = el.querySelector('.woocommerce-loop-product__title, h2, h3');
          const priceEl = el.querySelector('.price');
          const imageEl = el.querySelector('img');
          const linkEl = el.querySelector('a.woocommerce-LoopProduct-link, a');

          return {
            name: nameEl ? nameEl.innerText.trim() : '',
            priceRaw: priceEl ? priceEl.innerText.trim() : '',
            image: imageEl ? (imageEl.src || imageEl.getAttribute('data-src') || '') : '',
            link: linkEl ? linkEl.href : ''
          };
        }).filter(p => p.name);
      });

      console.log(`🔍 Found ${products.length} items`);
      
      if (products.length === 0) {
        consecutiveEmpty++;
        console.log(`  ⚠️ Empty (${consecutiveEmpty}/3)`);
        if (consecutiveEmpty >= 3) {
          console.log("Too many empty pages. End of catalog.");
          break;
        }
        continue;
      } else {
        consecutiveEmpty = 0;
      }

      let synced = 0;
      for (const p of products) {
        if (!p.name) continue;
        const basePrice = parsePrice(p.priceRaw);
        if (basePrice <= 0 || basePrice > 50000) continue;

        try {
          const slug = p.link 
            ? p.link.replace(/\/$/, '').split('/').pop()
            : p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 80);

          await prisma.product.upsert({
            where: { sku: slug },
            update: {
              name: p.name,
              price: basePrice,
              images: JSON.stringify(p.image ? [p.image] : []),
              provider: 'Banco del Perno',
              isDeleted: false,
              isActive: true
            },
            create: {
              sku: slug,
              name: p.name,
              price: basePrice,
              images: JSON.stringify(p.image ? [p.image] : []),
              provider: 'Banco del Perno',
              isActive: true,
              isDeleted: false,
              stock: 10
            }
          });
          synced++;
          totalSynced++;
        } catch (e) { /* skip duplicate SKU */ }
      }
      console.log(`✅ Synced: ${synced} | Total so far: ${totalSynced}`);

    } catch (err) {
      console.error(`❌ Error on page ${pageNum}:`, err.message.slice(0, 100));
      consecutiveEmpty++;
      if (consecutiveEmpty >= 3) break;
    }
  }

  // ----- DEDUPLICATION PASS -----
  console.log("\n🧹 Running deduplication on all products...");
  const dups = await prisma.product.groupBy({
    by: ['name'],
    _count: { name: true },
    having: { name: { _count: { gt: 1 } } }
  });
  
  let deleted = 0;
  for (const d of dups) {
    const items = await prisma.product.findMany({
      where: { name: d.name },
      orderBy: { updatedAt: 'desc' }
    });
    const toDelete = items.slice(1).map(x => x.id);
    const res = await prisma.product.deleteMany({ where: { id: { in: toDelete } } });
    deleted += res.count;
  }
  console.log(`🗑️ Deleted ${deleted} duplicate products`);

  const total = await prisma.product.count();
  console.log(`\n📊 FINAL DB COUNT: ${total} products`);
  console.log(`🎉 BP Ecuador synced: ${totalSynced} products`);

  await browser.close();
  await prisma.$disconnect();
}

main().catch(console.error);
