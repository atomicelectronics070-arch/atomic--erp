const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('mk-ecuador.html', 'utf-8');
const $ = cheerio.load(html);

const products = [];
// Try finding products
$('.product-card, .producto, .product').each((i, el) => {
    let title = $(el).find('.product-title, h3, .name, .title').text().trim();
    let priceStr = $(el).find('.price, .precio, .amount').text().trim();
    let img = $(el).find('img').attr('src');
    
    if(title) {
        products.push({ title, priceStr, img });
    }
});

console.log('Found', products.length, 'products');
if(products.length > 0) {
    console.log('Sample:', products.slice(0, 3));
    fs.writeFileSync('mk_products.json', JSON.stringify(products, null, 2));
} else {
    // try to find any image or h3
    console.log('Images:', $('img').length);
    console.log('h3:', $('h3').length);
}
