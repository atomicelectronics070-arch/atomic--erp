const cheerio = require('cheerio');

async function scrapeYP() {
    const query = encodeURIComponent('gimnasios');
    const res = await fetch('https://www.paginasamarillas.com.ec/search/' + query, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $('.business-name').each((i, el) => {
        results.push($(el).text().trim());
    });
    console.log("Found:", results);
}
scrapeYP();
