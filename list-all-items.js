const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('debug-espejos.html', 'utf8');
const $ = cheerio.load(html);

console.log("Listing all 22 product items:");
$('li.product').each((i, el) => {
    console.log(`Item ${i + 1}: class="${$(el).attr('class')}", title="${$(el).find('.woocommerce-loop-product__title, h2, h3').first().text().trim()}"`);
});
