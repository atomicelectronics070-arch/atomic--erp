const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

// Test with a known product link from the celulares category
const TEST_URLS = [
    'https://tecnomegastore.ec/category/1/2N001-CELULARES-TABLETS-MOVILES?page=1',
    'https://tecnomegastore.ec/category/1/2N001-CELULARES-TABLETS-MOVILES',
];

async function test() {
    for (const url of TEST_URLS) {
        console.log(`\n🔍 Checking: ${url}`);
        try {
            const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
            const $ = cheerio.load(data);
            
            // Search for any price-like content
            const bodyText = $('body').text();
            
            // Look for $ prices
            const prices = bodyText.match(/\$\s*[\d,\.]+/g) || [];
            const uniquePrices = [...new Set(prices)].slice(0, 20);
            console.log('Prices found on page:', uniquePrices);
            
            // Look for product cards
            const cardSelectors = [
                '.product-item', '.product-card', '.item', 
                '[class*="product"]', '[class*="card"]', 
                '.col-md-3', '.col-sm-6'
            ];
            for (const sel of cardSelectors) {
                const count = $(sel).length;
                if (count > 0) console.log(`Selector "${sel}": ${count} elements`);
            }
            
            // Print first 2000 chars of body text to see structure
            console.log('\nBody text snippet:');
            console.log(bodyText.replace(/\s+/g, ' ').substring(0, 2000));
            
        } catch(e) {
            console.error('Error:', e.message);
        }
    }
}
test();
