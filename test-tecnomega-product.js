const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

// Test individual product pages - pick a few known SKUs
const TEST_PRODUCT_URLS = [
    'https://tecnomegastore.ec/product/1?code=TABONN113141517',
    'https://tecnomegastore.ec/product/1?code=CELSAMSMA075MZK',
    'https://tecnomegastore.ec/product/1?code=TABSAMSMX133NZA',
    'https://tecnomegastore.ec/product/1?code=CELSAMSMA175FKF',
];

async function test() {
    for (const url of TEST_PRODUCT_URLS) {
        console.log(`\n🔍 Testing: ${url}`);
        try {
            const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
            const $ = cheerio.load(data);
            const bodyText = $('body').text().replace(/\s+/g, ' ');
            
            // Extract all $ prices
            const prices = bodyText.match(/\$\s*[\d,\.]+/g) || [];
            console.log('Prices found:', prices);
            
            // Look for "Precio" mentions
            const precioIdx = bodyText.indexOf('Precio');
            if (precioIdx > -1) {
                console.log('Context around "Precio":', bodyText.substring(precioIdx - 10, precioIdx + 200));
            }
            
        } catch(e) {
            console.error('Error:', e.message);
        }
    }
}
test();
