const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-EC,es;q=0.9',
};

async function inspect() {
    // First look at main acabados page to see its structure
    const res = await axios.get('https://bpecuador.com/categoria-producto/acabados/', { headers: HEADERS, httpsAgent, timeout: 20000 });
    const html = res.data;
    const $ = cheerio.load(html);

    // Save raw HTML to file for inspection
    fs.writeFileSync('debug-acabados.html', html.substring(0, 30000));
    console.log('Saved first 30000 chars to debug-acabados.html');

    // Try various product selectors
    console.log('\n--- Products by selector ---');
    console.log('li.product:', $('li.product').length);
    console.log('.product:', $('.product').length);
    console.log('.product-small:', $('.product-small').length);
    console.log('.product-item:', $('.product-item').length);
    console.log('.products > li:', $('.products > li').length);
    console.log('article.product:', $('article.product').length);
    console.log('[class*="product-"]:', $('[class*="product-"]').length);

    // Find any categories/subcategories  
    console.log('\n--- Categories ---');
    console.log('li.product-category:', $('li.product-category').length);
    console.log('.product-category:', $('.product-category').length);
    console.log('ul.products:', $('ul.products').length);
    
    // Show body classes to understand page structure
    const bodyClass = $('body').attr('class');
    console.log('\nBody classes:', bodyClass?.substring(0, 200));

    // Show a snippet of the products area
    const productsHtml = $('ul.products, .products').first().html();
    if (productsHtml) {
        console.log('\nProducts HTML snippet:', productsHtml.substring(0, 1000));
    } else {
        console.log('\nNo .products found. Content sample:');
        const mainContent = $('main, #main, .main-content, #content, .content').first().html() || $('body').html();
        console.log(mainContent?.substring(0, 2000));
    }

    // Sub-category links
    console.log('\n--- Subcategory links ---');
    $('a[href*="categoria-producto"]').each((i, el) => {
        if (i < 10) console.log($(el).attr('href'));
    });
}

inspect().catch(e => console.error('Error:', e.message));
