const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('debug-acabados-full.html', 'utf8');
const $ = cheerio.load(html);

console.log("Analyzing category link structure:");
$('a[href*="categoria-producto/acabados/"]').each((i, el) => {
    const parent = $(el).parent();
    console.log(`Link: ${$(el).attr('href')}`);
    console.log(`Parent tag: ${parent.prop('tagName')}, Classes: ${parent.attr('class')}`);
    console.log(`Grandparent tag: ${parent.parent().prop('tagName')}, Classes: ${parent.parent().attr('class')}`);
    console.log('-------------------');
});
