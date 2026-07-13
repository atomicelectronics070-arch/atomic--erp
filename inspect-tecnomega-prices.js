const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('tecnomega-category-p2.html', 'utf8');
const $ = cheerio.load(html);

console.log("Inspecting product cards in HTML snippet:");
$('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    if (href.includes('/product/') && href.includes('code=')) {
        // Go up to the parent and print some surrounding text to find prices
        const parent = $(el).parent();
        const grandparent = parent.parent();
        const text = grandparent.text().replace(/\s+/g, ' ').trim();
        console.log(`- Product: "${$(el).text().trim()}"`);
        console.log(`  Grandparent text: "${text.substring(0, 150)}"`);
    }
});
