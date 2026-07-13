const { chromium } = require('playwright');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testShopifySelectors() {
    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const page = await browser.newPage();
    
    try {
        console.log('Navigating to Meeltech Tecnologia category...');
        await page.goto('https://meeltechstore.com/collections/tecnologia', { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000);
        
        // Find grid items
        const gridItemsCount = await page.$$eval('.grid__item, .card-wrapper, .card, li.grid__item', els => els.length);
        console.log(`Grid items count: ${gridItemsCount}`);
        
        // Extract product details
        const products = await page.$$eval('.grid__item, .card-wrapper, li.grid__item', els => {
            return els.map(el => {
                const titleEl = el.querySelector('.card__heading a, .full-unstyled-link, h3 a');
                const priceEl = el.querySelector('.price-item--regular, .price-item, .price__regular .price-item');
                const imgEl = el.querySelector('img');
                
                return {
                    title: titleEl?.innerText?.trim() || '',
                    priceText: priceEl?.innerText?.trim() || '',
                    image: imgEl?.src || imgEl?.getAttribute('data-src') || ''
                };
            }).filter(p => p.title);
        });
        
        console.log(`Found ${products.length} products:`);
        products.slice(0, 10).forEach((p, i) => {
            console.log(`[${i+1}] Title: "${p.title}" | PriceText: "${p.priceText}" | Image: "${p.image.substring(0, 70)}..."`);
        });
        
    } catch(e) {
        console.error('Error testing selectors:', e.message);
    } finally {
        await browser.close();
    }
}

testShopifySelectors();
