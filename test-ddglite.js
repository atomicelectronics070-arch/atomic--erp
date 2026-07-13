const cheerio = require('cheerio');

async function scrapeDDGLite() {
    const query = encodeURIComponent('gimnasios en ecuador telefono');
    const res = await fetch('https://lite.duckduckgo.com/lite/', {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'q=' + query
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $('tr').each((i, el) => {
        const title = $(el).find('.result-title').text().trim() || $(el).find('a.result-url').text().trim() || $(el).find('a').first().text().trim();
        const snippet = $(el).find('.result-snippet').text().trim();
        if (title || snippet) {
            results.push({title, snippet});
        }
    });
    console.log(results.slice(0, 5));
}
scrapeDDGLite();
