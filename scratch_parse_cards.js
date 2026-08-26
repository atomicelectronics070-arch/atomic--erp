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
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function run() {
  const allCards = [];

  for (let page = 1; page <= 4; page++) {
    const url = CATEGORY_URLS[page - 1];
    console.log(`Fetching Page ${page}: ${url}`);
    const html = await fetchHtml(url);

    const chunks = html.split('class="product-wrap"');
    console.log(`Page ${page}: found ${chunks.length - 1} items`);

    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i];

      const linkMatch = chunk.match(/href="(https:\/\/yale\.com\.ec\/producto\/[^"]+)"/i);
      const titleMatch = chunk.match(/aria-label="([^"]+)"/i) || chunk.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      const priceMatch = chunk.match(/<span class="price">([\s\S]*?)<\/span>/i);
      const imgMatch = chunk.match(/data-nectar-img-src="([^"]+)"/i) || chunk.match(/src="(https:\/\/yale\.com\.ec\/wp-content\/uploads\/[^"]+)"/i);
      const badgeMatch = chunk.match(/<span class="onsale">([\s\S]*?)<\/span>/i);

      const link = linkMatch ? linkMatch[1].split('?')[0] : '';
      const title = titleMatch ? cleanText(titleMatch[1]) : '';
      const priceRaw = priceMatch ? cleanText(priceMatch[1]) : '';
      const img = imgMatch ? imgMatch[1] : '';
      const badge = badgeMatch ? cleanText(badgeMatch[1]) : '';

      // Extract numbers from price string
      // e.g. "$67.00 - $92.00" or "$34.84" or "$60.00 $34.84"
      const numbers = priceRaw.match(/[0-9]+[.,][0-9]+/g) || [];
      let currentPrice = 0;
      let regularPrice = 0;

      if (numbers.length >= 2) {
        // usually del / ins: first is regular, second is sale
        // or range: min - max
        const num1 = parseFloat(numbers[0].replace(',', '.'));
        const num2 = parseFloat(numbers[1].replace(',', '.'));
        if (priceRaw.includes('–') || priceRaw.includes('-')) {
          currentPrice = num1;
          regularPrice = num2;
        } else {
          regularPrice = num1;
          currentPrice = num2;
        }
      } else if (numbers.length === 1) {
        currentPrice = parseFloat(numbers[0].replace(',', '.'));
        regularPrice = currentPrice;
      }

      allCards.push({
        page,
        index: allCards.length + 1,
        title,
        link,
        priceRaw,
        currentPrice,
        regularPrice: regularPrice || currentPrice,
        img,
        badge
      });
    }
  }

  console.log(`\nTOTAL CARDS SCRAPED: ${allCards.length}\n`);
  allCards.forEach(c => {
    console.log(`${c.index}. [Page ${c.page}] ${c.title} => ${c.priceRaw} (Sale: $${c.currentPrice} | Reg: $${c.regularPrice}) | Img: ${c.img}`);
  });

  fs.writeFileSync('./scratch_yale_cards_final.json', JSON.stringify(allCards, null, 2), 'utf8');
}

run().catch(console.error);
