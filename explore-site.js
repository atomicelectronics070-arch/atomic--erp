const axios = require('axios');
const cheerio = require('cheerio');

async function explore() {
    try {
        const res = await axios.get('https://telefonosyaccesorios.com/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = res.data;
        const $ = cheerio.load(html);
        
        console.log("Is WooCommerce?", html.includes('woocommerce') ? 'Yes' : 'No');
        console.log("Is Shopify?", html.includes('shopify') ? 'Yes' : 'No');
        
        // Find category links
        const links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('/categoria') || href.includes('/category') || href.includes('/collections'))) {
                links.push(href);
            }
        });
        
        console.log("Found category links:", [...new Set(links)]);
        
        // Find any products on homepage
        const products = $('.product, .grid-product, .grid-item');
        console.log("Products on homepage:", products.length);
        
    } catch(e) {
        console.error(e.message);
    }
}
explore();
