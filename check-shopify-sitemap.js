const axios = require('axios');

async function checkSitemaps() {
    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
    
    try {
        console.log('Fetching collections sitemap...');
        const response = await axios.get('https://meeltechstore.com/sitemap_collections_1.xml', { headers, timeout: 20000 });
        const xml = response.data;
        const matches = [...xml.matchAll(/<loc>(https:\/\/meeltechstore\.com\/collections\/[^<]+)<\/loc>/g)];
        const urls = matches.map(m => m[1]);
        
        console.log('\nCollections found in sitemap:');
        urls.forEach(url => console.log(url));
        
    } catch(e) {
        console.error('Error fetching collections sitemap:', e.message);
        
        // Let's try to fetch products sitemap as fallback
        try {
            console.log('Fetching products sitemap...');
            const response = await axios.get('https://meeltechstore.com/sitemap_products_1.xml', { headers, timeout: 20000 });
            const xml = response.data;
            const matches = [...xml.matchAll(/<loc>(https:\/\/meeltechstore\.com\/products\/[^<]+)<\/loc>/g)];
            const urls = matches.map(m => m[1]);
            console.log(`Found ${urls.length} products in sitemap. Sample:`);
            urls.slice(0, 10).forEach(url => console.log(url));
        } catch(err) {
            console.error('Error fetching products sitemap:', err.message);
        }
    }
}

checkSitemaps();
