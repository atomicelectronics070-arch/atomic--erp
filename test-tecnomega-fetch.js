const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://tecnomegastore.ec/category/1/2N001-CELULARES-TABLETS-MOVILES?page=2';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
};

async function testFetch() {
    try {
        console.log(`Fetching ${url}...`);
        const { data } = await axios.get(url, { headers, timeout: 15000 });
        fs.writeFileSync('tecnomega-category-p2.html', data.substring(0, 80000));
        console.log("Saved html snippet.");
        
        const $ = cheerio.load(data);
        const links = [];
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('product')) {
                links.push({ text: $(el).text().trim(), href });
            }
        });
        
        console.log(`Found ${links.length} product links:`);
        links.slice(0, 15).forEach(l => {
            console.log(`- Text: "${l.text}" | Href: "${l.href}"`);
        });
    } catch(e) {
        console.error(e);
    }
}
testFetch();
