const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BASE_URL = 'https://yale.com.ec';
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
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-EC,es;q=0.9,en;q=0.8'
      },
      rejectUnauthorized: false
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
  });
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

// Clean HTML tags and decode basic entities
function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function scrapeCategoryPage(pageUrl) {
  console.log(`Scraping category page: ${pageUrl}`);
  const html = await fetchHtml(pageUrl);
  
  // Extract product cards. In WooCommerce, products are usually in <li class="...product..."> or <div class="product...">
  // We match links to product pages: href="https://yale.com.ec/producto/..."
  const productLinks = [];
  const productUrlRegex = /href="(https:\/\/yale\.com\.ec\/producto\/[^"]+)"/gi;
  let match;
  while ((match = productUrlRegex.exec(html)) !== null) {
    const url = match[1].split('?')[0]; // clean query params
    if (!productLinks.includes(url)) {
      productLinks.push(url);
    }
  }

  console.log(`Found ${productLinks.length} product links on ${pageUrl}`);
  return productLinks;
}

async function scrapeProductDetails(productUrl) {
  console.log(`\nFetching product: ${productUrl}`);
  const html = await fetchHtml(productUrl);

  // Title
  let title = '';
  const titleMatch = html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                     html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (titleMatch) {
    title = cleanText(titleMatch[1]);
  }

  // Price extraction
  let price = 0;
  let regularPrice = 0;
  
  // WooCommerce price structure
  const insPriceMatch = html.match(/<ins>[\s\S]*?<bdi>([\s\S]*?)<\/bdi>[\s\S]*?<\/ins>/i);
  const delPriceMatch = html.match(/<del>[\s\S]*?<bdi>([\s\S]*?)<\/bdi>[\s\S]*?<\/del>/i);
  const singlePriceMatch = html.match(/<p class="price">[\s\S]*?<bdi>([\s\S]*?)<\/bdi>/i);

  if (insPriceMatch) {
    const cleanP = cleanText(insPriceMatch[1]).replace(/[^0-9.,]/g, '').replace(',', '.');
    price = parseFloat(cleanP) || 0;
  } else if (singlePriceMatch) {
    const cleanP = cleanText(singlePriceMatch[1]).replace(/[^0-9.,]/g, '').replace(',', '.');
    price = parseFloat(cleanP) || 0;
  }

  if (delPriceMatch) {
    const cleanDel = cleanText(delPriceMatch[1]).replace(/[^0-9.,]/g, '').replace(',', '.');
    regularPrice = parseFloat(cleanDel) || 0;
  } else {
    regularPrice = price;
  }

  // Images extraction: look for data-large_image, data-src, src inside woocommerce-product-gallery
  const images = [];
  const imgRegex = /(?:data-large_image|data-src|src)="(https:\/\/yale\.com\.ec\/wp-content\/uploads\/[^"]+\.(?:png|jpg|jpeg|webp|avif))"/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const imgUrl = imgMatch[1];
    // filter out small thumbnail sizes if full size exists
    if (!images.includes(imgUrl)) {
      images.push(imgUrl);
    }
  }

  // SKU
  let sku = '';
  const skuMatch = html.match(/class="sku">([\s\S]*?)<\/span>/i);
  if (skuMatch) {
    sku = cleanText(skuMatch[1]);
  }

  // Description / Specifications
  let description = '';
  const descMatch = html.match(/<div class="woocommerce-Tabs-panel--description[^>]*>([\s\S]*?)<\/div>/i) ||
                    html.match(/<div id="tab-description"[^>]*>([\s\S]*?)<\/div>/i) ||
                    html.match(/<div class="woocommerce-product-details__short-description">([\s\S]*?)<\/div>/i);
  if (descMatch) {
    description = cleanText(descMatch[1]);
  }

  // Short description
  let shortDescription = '';
  const shortDescMatch = html.match(/<div class="woocommerce-product-details__short-description">([\s\S]*?)<\/div>/i);
  if (shortDescMatch) {
    shortDescription = cleanText(shortDescMatch[1]);
  }

  // Extract specs table or bullet points
  const bulletPoints = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch;
  const descSearchArea = (descMatch ? descMatch[1] : '') + ' ' + (shortDescMatch ? shortDescMatch[1] : '');
  while ((liMatch = liRegex.exec(descSearchArea)) !== null) {
    const text = cleanText(liMatch[1]);
    if (text.length > 5 && text.length < 250 && !bulletPoints.includes(text)) {
      bulletPoints.push(text);
    }
  }

  return {
    url: productUrl,
    title,
    sku: sku || title,
    price,
    regularPrice: regularPrice || price,
    images,
    description: description || shortDescription || title,
    shortDescription,
    bulletPoints
  };
}

async function main() {
  console.log('=== STARTING COMPLETE SCRAPE OF YALE ECUADOR CERRADURAS DIGITALES ===');
  
  const allProductUrls = [];
  for (const catUrl of CATEGORY_URLS) {
    try {
      const urls = await scrapeCategoryPage(catUrl);
      urls.forEach(u => {
        if (!allProductUrls.includes(u)) allProductUrls.push(u);
      });
    } catch (e) {
      console.error(`Error scraping category ${catUrl}:`, e.message);
    }
  }

  console.log(`\nTOTAL UNIQUE DIGITAL LOCK PRODUCTS FOUND: ${allProductUrls.length}\n`);

  const scrapedProducts = [];
  for (let i = 0; i < allProductUrls.length; i++) {
    const pUrl = allProductUrls[i];
    try {
      const details = await scrapeProductDetails(pUrl);
      scrapedProducts.push(details);
      console.log(`[${i+1}/${allProductUrls.length}] ${details.title} | Price: $${details.price} (Reg: $${details.regularPrice}) | Images: ${details.images.length}`);
    } catch (e) {
      console.error(`Error details for ${pUrl}:`, e.message);
    }
  }

  // Save raw json backup
  fs.writeFileSync('./scratch_yale_scraped.json', JSON.stringify(scrapedProducts, null, 2), 'utf8');
  console.log('\nSaved backup to scratch_yale_scraped.json');
}

main().catch(console.error).finally(() => process.exit(0));
