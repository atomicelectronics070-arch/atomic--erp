const { chromium } = require('playwright');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkWithPlaywright() {
    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const page = await browser.newPage();
    
    try {
        console.log('Navigating to meeltechstore.com sitemap...');
        await page.goto('https://meeltechstore.com/sitemap.xml', { waitUntil: 'networkidle', timeout: 60000 });
        const content = await page.content();
        
        console.log('\n--- Sitemap XML structure ---');
        // Extract sitemaps links from index sitemap
        const sitemapUrls = [...content.matchAll(/https:\/\/meeltechstore\.com\/[^\s<"]+/g)].map(m => m[0]);
        console.log('Sitemap URLs found:', sitemapUrls);
        
        // Go to collections sitemap specifically if found
        const collectionsSitemap = sitemapUrls.find(u => u.includes('sitemap_collections'));
        if (collectionsSitemap) {
            console.log(`\nNavigating to collections sitemap: ${collectionsSitemap}`);
            await page.goto(collectionsSitemap, { waitUntil: 'networkidle', timeout: 60000 });
            const colContent = await page.content();
            
            // Extract /collections/ URLs
            const collectionUrls = [...colContent.matchAll(/https:\/\/meeltechstore\.com\/collections\/[^\s<"]+/g)].map(m => m[0]);
            console.log('\nCollections URLs found:');
            collectionUrls.forEach(url => console.log(url));
        } else {
            console.log('\nCould not find a collections sitemap. Trying products sitemap instead...');
            const productsSitemap = sitemapUrls.find(u => u.includes('sitemap_products'));
            if (productsSitemap) {
                await page.goto(productsSitemap, { waitUntil: 'networkidle', timeout: 60000 });
                const prodContent = await page.content();
                const productUrls = [...prodContent.matchAll(/https:\/\/meeltechstore\.com\/products\/[^\s<"]+/g)].map(m => m[0]);
                console.log(`Found ${productUrls.length} product URLs. Samples:`);
                productUrls.slice(0, 10).forEach(url => console.log(url));
            }
        }
        
    } catch(e) {
        console.error('Error with Playwright:', e.message);
    } finally {
        await browser.close();
    }
}

checkWithPlaywright();
