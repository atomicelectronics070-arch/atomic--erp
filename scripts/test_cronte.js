const { chromium } = require('playwright');

async function test() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://cronte.net/', { waitUntil: 'networkidle' });
        const title = await page.title();
        console.log("Title:", title);
        
        // Let's get the links to see category structure
        const links = await page.$$eval('a', anchors => {
            return [...new Set(anchors.map(a => a.href).filter(h => h.startsWith('https://cronte.net')))];
        });
        
        console.log("Found links:", links.slice(0, 20));
        
        // Test if there's a shop page
        if(links.some(l => l.includes('/tienda') || l.includes('/shop') || l.includes('/productos'))) {
            console.log("✅ Probable e-commerce path detected!");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}
test();
