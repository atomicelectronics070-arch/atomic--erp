const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://tecnomegastore.ec/category/1/2N001-CELULARES-TABLETS-MOVILES?page=2';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

async function checkAllLinks() {
    try {
        const { data } = await axios.get(url, { headers, timeout: 15000 });
        const $ = cheerio.load(data);
        console.log("All links on page 2:");
        let total = 0;
        $('a').each((i, el) => {
            const href = $(el).attr('href') || '';
            const text = $(el).text().trim();
            if (href.startsWith('/') || href.includes('tecnomega')) {
                console.log(`- Text: "${text}" | Href: "${href}"`);
                total++;
            }
        });
        console.log(`Total local links found: ${total}`);
    } catch(e) {
        console.error(e);
    }
}
checkAllLinks();
