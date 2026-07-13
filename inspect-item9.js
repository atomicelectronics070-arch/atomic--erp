const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('debug-espejos.html', 'utf8');
const $ = cheerio.load(html);

const item9 = $('.product').eq(8); // index 8 is Item 9
console.log("Item 9 class:", item9.attr('class'));
console.log("Item 9 full HTML:\n", item9.html());
