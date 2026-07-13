const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\77fc2104-3877-4fa1-8aba-c0f973653e6e\\.system_generated\\steps\\8186\\content.md', 'utf8');
const $ = cheerio.load(html);

const links = new Set();
$('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (href.includes('/collections/') && text) {
        links.add(`${text} -> ${href}`);
    }
});

console.log('Collections/Categories found in HTML:');
[...links].forEach(l => console.log(l));
