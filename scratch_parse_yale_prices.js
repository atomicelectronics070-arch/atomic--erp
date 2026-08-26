const https = require('https');
const fs = require('fs');

const CATEGORY_URLS = [
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/',
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/page/2/',
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/page/3/',
  'https://yale.com.ec/categoria-producto/cerraduras-digitales/page/4/'
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      rejectUnauthorized: false
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#36;/g, '$')
    .replace(/\s+/g, ' ')
    .trim();
}

async function run() {
  const cardItems = [];

  for (let pageNum = 1; pageNum <= 4; pageNum++) {
    const url = CATEGORY_URLS[pageNum - 1];
    const html = await fetchHtml(url);
    
    // In WooCommerce, each product card is inside <li class="product ...">...</li>
    const productBlocks = html.split('<li class="product');
    console.log(`Page ${pageNum}: Found ${productBlocks.length - 1} product blocks`);

    for (let i = 1; i < productBlocks.length; i++) {
      const block = productBlocks[i].split('</li>')[0];

      // Link & Title
      const linkMatch = block.match(/href="(https:\/\/yale\.com\.ec\/producto\/[^"]+)"/i);
      const titleMatch = block.match(/<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i) ||
                         block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      
      const link = linkMatch ? linkMatch[1].split('?')[0] : '';
      const title = titleMatch ? cleanText(titleMatch[1]) : '';

      // Image
      const imgMatch = block.match(/src="(https:\/\/yale\.com\.ec\/wp-content\/uploads\/[^"]+\.(?:png|jpg|jpeg|webp))"/i);
      const img = imgMatch ? imgMatch[1] : '';

      // Price: look for price block inside product card
      const priceMatch = block.match(/<span class="price">([\s\S]*?)<\/span>/i);
      let priceText = priceMatch ? cleanText(priceMatch[1]) : '';
      
      // Parse numerical price values
      let currentPrice = 0;
      let regularPrice = 0;

      // Check for <del> and <ins>
      const delMatch = block.match(/<del>[\s\S]*?<bdi>([\s\S]*?)<\/bdi>/i);
      const insMatch = block.match(/<ins>[\s\S]*?<bdi>([\s\S]*?)<\/bdi>/i);

      if (insMatch) {
        currentPrice = parseFloat(cleanText(insMatch[1]).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      }
      if (delMatch) {
        regularPrice = parseFloat(cleanText(delMatch[1]).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      }
      if (!currentPrice && priceText) {
        // e.g. "$67,00 – $92,00" or "$45,99"
        const numbers = priceText.match(/[0-9]+[.,][0-9]+/g);
        if (numbers && numbers.length > 0) {
          currentPrice = parseFloat(numbers[0].replace(',', '.')) || 0;
          if (numbers.length > 1) {
            regularPrice = parseFloat(numbers[1].replace(',', '.')) || currentPrice;
          } else {
            regularPrice = currentPrice;
          }
        }
      }

      cardItems.push({
        page: pageNum,
        title,
        link,
        img,
        priceText,
        currentPrice,
        regularPrice: regularPrice || currentPrice
      });
    }
  }

  console.log(`\nTotal parsed cards: ${cardItems.length}`);
  cardItems.forEach((c, idx) => {
    console.log(`${idx + 1}. [Page ${c.page}] ${c.title} => ${c.priceText} (Parsed: $${c.currentPrice} | Reg: $${c.regularPrice})`);
  });

  fs.writeFileSync('./scratch_yale_card_prices.json', JSON.stringify(cardItems, null, 2), 'utf8');
}

run().catch(console.error);
