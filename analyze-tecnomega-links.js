const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('tecnomega-category-p2.html', 'utf8');
const $ = cheerio.load(html);

console.log("Analyzing product items on page:");
const links = [];
$('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    if (href.includes('/product/') || href.includes('code=')) {
        links.push({
            index: i,
            text: $(el).text().trim(),
            href,
            classes: $(el).attr('class') || '',
            parent: $(el).parent().attr('class') || ''
        });
    }
});

console.log(`Found ${links.length} total product links:`);
links.forEach(l => {
    console.log(`- [${l.index}] Text: "${l.text}" | Href: "${l.href}" | Parent Class: "${l.parent}"`);
});
