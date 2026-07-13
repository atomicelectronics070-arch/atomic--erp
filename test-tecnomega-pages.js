const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://tecnomegastore.ec';
const CATEGORY_CODE = '2N001-CELULARES-TABLETS-MOVILES';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

async function testAllPages() {
    try {
        console.log("Checking page count and product counts for Celulares y Tablets...");
        for (let p = 1; p <= 10; p++) {
            const url = `${BASE_URL}/category/1/${CATEGORY_CODE}?page=${p}`;
            const { data } = await axios.get(url, { headers, timeout: 15000 });
            const $ = cheerio.load(data);
            
            const productLinks = [];
            $('a').each((_, el) => {
                const href = $(el).attr('href') || '';
                if (href.includes('/product/') && href.includes('code=')) {
                    productLinks.push(href);
                }
            });
            
            console.log(`- Page ${p}: Found ${productLinks.length} products`);
            if (productLinks.length === 0) {
                console.log(`  No products found on page ${p}. Stopping.`);
                break;
            }
        }
    } catch(e) {
        console.error(e);
    }
}
testAllPages();
