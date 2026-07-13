const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://tecnomegastore.ec/category/1/2N001-CELULARES-TABLETS-MOVILES?page=2';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

async function testFetchPrices() {
    try {
        console.log(`Fetching ${url}...`);
        const { data } = await axios.get(url, { headers, timeout: 15000 });
        const $ = cheerio.load(data);
        
        console.log("Analyzing product elements on page:");
        $('a').each((i, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('/product/') && href.includes('code=')) {
                // Find nearest elements with price patterns or numbers
                const text = $(el).text().trim();
                
                // Let's find grandparent text
                const grandparent = $(el).parent().parent();
                const gpText = grandparent.text().replace(/\s+/g, ' ').trim();
                console.log(`- Product: "${text}"`);
                console.log(`  Grandparent text: "${gpText.substring(0, 200)}"`);
            }
        });
    } catch(e) {
        console.error(e);
    }
}
testFetchPrices();
