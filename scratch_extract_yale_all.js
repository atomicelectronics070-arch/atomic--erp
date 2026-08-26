const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CATEGORY_URLS = [
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/',
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/page/2/',
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/page/3/',
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/page/4/'
];

const imagesDir = path.join(__dirname, 'public', 'images', 'cerraduras', 'yale');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-EC,es;q=0.9'
      },
      rejectUnauthorized: false
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#036;|&#36;|\$/g, '$')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function downloadImage(url, filename) {
  const filePath = path.join(imagesDir, filename);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    return Promise.resolve(filePath);
  }
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      rejectUnauthorized: false
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filename).then(resolve);
      }
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filePath);
        });
      } else {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

async function scrapeAllYale() {
  console.log('=== SCRAPING 4 PAGES OF YALE ECUADOR CERRADURAS DIGITALES ===');

  const productsList = [];

  for (let pageNum = 1; pageNum <= 4; pageNum++) {
    const catUrl = CATEGORY_URLS[pageNum - 1];
    console.log(`\nFetching Page ${pageNum}: ${catUrl}`);
    const html = await fetchHtml(catUrl);

    // Split by product items: in Salient theme, products start with `<li class="`
    const items = html.split('<li class="');
    console.log(`Page ${pageNum}: Found ${items.length - 1} raw items`);

    for (let i = 1; i < items.length; i++) {
      const itemChunk = items[i];
      // verify if this is a product
      if (!itemChunk.includes('/producto/')) continue;

      const linkMatch = itemChunk.match(/href="(https:\/\/yale\.com\.ec\/producto\/[^"]+)"/i);
      const titleMatch = itemChunk.match(/<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i) ||
                         itemChunk.match(/aria-label="([^"]+)"/i);
      const priceMatch = itemChunk.match(/<span class="price">([\s\S]*?)<\/span>\s*<\/div>/i) ||
                         itemChunk.match(/<span class="price">([\s\S]*?)<\/span>/i);
      const imgMatch = itemChunk.match(/data-nectar-img-src="([^"]+)"/i) ||
                       itemChunk.match(/src="(https:\/\/yale\.com\.ec\/wp-content\/uploads\/[^"]+\.(?:png|jpg|jpeg|webp))"/i);
      const badgeMatch = itemChunk.match(/<span class="onsale">([\s\S]*?)<\/span>/i);

      if (!linkMatch) continue;
      const link = linkMatch[1].split('?')[0];
      const title = titleMatch ? cleanText(titleMatch[1]) : '';
      const priceRaw = priceMatch ? cleanText(priceMatch[1]) : '';
      const img = imgMatch ? imgMatch[1] : '';
      const badge = badgeMatch ? cleanText(badgeMatch[1]) : '';

      // Parse price
      let salePrice = 0;
      let originalPrice = 0;

      // Extract numbers like "34.84" or "260,02" or "67,00 - 92,00"
      const numbers = priceRaw.match(/[0-9]+[.,][0-9]+/g) || [];
      if (numbers.length >= 2) {
        const n1 = parseFloat(numbers[0].replace(',', '.'));
        const n2 = parseFloat(numbers[1].replace(',', '.'));
        if (priceRaw.includes('-') || priceRaw.includes('–')) {
          // Range: e.g. "$67.00 - $92.00"
          salePrice = n1;
          originalPrice = n2;
        } else {
          // del / ins: original then sale
          originalPrice = n1;
          salePrice = n2;
        }
      } else if (numbers.length === 1) {
        salePrice = parseFloat(numbers[0].replace(',', '.'));
        originalPrice = salePrice;
      }

      if (!productsList.some(p => p.link === link)) {
        productsList.push({
          page: pageNum,
          index: productsList.length + 1,
          title,
          link,
          priceRaw,
          salePrice,
          originalPrice: originalPrice || salePrice,
          thumbImg: img,
          badge
        });
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`TOTAL UNIQUE YALE PRODUCTS IDENTIFIED: ${productsList.length}`);
  console.log(`======================================================\n`);

  // Now for each product, fetch detailed single page to get all gallery images, descriptions, bullet points
  const detailedProducts = [];

  for (let i = 0; i < productsList.length; i++) {
    const item = productsList[i];
    console.log(`[${i+1}/${productsList.length}] Scraping details: ${item.title} ($${item.salePrice})`);

    let pageHtml = '';
    try {
      pageHtml = await fetchHtml(item.link);
    } catch (e) {
      console.error(`Error fetching page ${item.link}:`, e.message);
    }

    // SKU
    const skuMatch = pageHtml.match(/class="sku">([\s\S]*?)<\/span>/i);
    const sku = skuMatch ? cleanText(skuMatch[1]) : item.title;

    // Gallery images: extract all full-resolution image URLs
    const galleryImages = [];
    if (item.thumbImg) {
      // get clean high-res URL (without -300x300 or -600x600)
      const fullThumb = item.thumbImg.replace(/-\d+x\d+(\.\w+)$/, '$1');
      galleryImages.push(fullThumb);
    }

    const imgRegex = /(?:data-large_image|data-src|href|src)="(https:\/\/yale\.com\.ec\/wp-content\/uploads\/[^"]+\.(?:png|jpg|jpeg|webp|avif))"/gi;
    let m;
    while ((m = imgRegex.exec(pageHtml)) !== null) {
      const u = m[1];
      if (!galleryImages.includes(u) && !u.includes('placeholder')) {
        galleryImages.push(u);
      }
    }

    // Description
    const descMatch = pageHtml.match(/<div class="woocommerce-Tabs-panel--description[^>]*>([\s\S]*?)<\/div>/i) ||
                      pageHtml.match(/<div id="tab-description"[^>]*>([\s\S]*?)<\/div>/i) ||
                      pageHtml.match(/<div class="woocommerce-product-details__short-description">([\s\S]*?)<\/div>/i);
    const description = descMatch ? cleanText(descMatch[1]) : item.title;

    // Bullet points / Features
    const bulletPoints = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liM;
    while ((liM = liRegex.exec(pageHtml)) !== null) {
      const text = cleanText(liM[1]);
      if (text.length > 8 && text.length < 220 && !bulletPoints.includes(text) && !text.toLowerCase().includes('yale.com.ec')) {
        bulletPoints.push(text);
      }
    }

    // Download first 2 primary images locally
    const localImages = [];
    for (let imgIdx = 0; imgIdx < Math.min(galleryImages.length, 3); imgIdx++) {
      const imgUrl = galleryImages[imgIdx];
      const ext = path.extname(imgUrl.split('?')[0]) || '.png';
      const cleanSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40);
      const filename = `yale-${cleanSlug}-${imgIdx + 1}${ext}`;
      const downloadedPath = await downloadImage(imgUrl, filename);
      if (downloadedPath) {
        localImages.push(`/images/cerraduras/yale/${filename}`);
      }
    }

    const finalImages = localImages.length > 0 ? localImages : galleryImages.slice(0, 5);

    detailedProducts.push({
      ...item,
      sku,
      description,
      bulletPoints: bulletPoints.slice(0, 8),
      galleryImages,
      localImages,
      finalImages
    });
  }

  // Save complete JSON backup
  fs.writeFileSync('./scratch_yale_all_detailed.json', JSON.stringify(detailedProducts, null, 2), 'utf8');
  console.log('\nSaved full details to scratch_yale_all_detailed.json');

  return detailedProducts;
}

scrapeAllYale().catch(console.error);
