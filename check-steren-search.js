const { chromium } = require('playwright');
const fs = require('fs');

async function checkSterenSearch() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'https://www.steren.com.ec/catalogsearch/result/index/?q=parlante&p=1';
    console.log(`Navigating to ${url}...`);
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const html = await page.content();
        fs.writeFileSync('steren-parlante-search.html', html.substring(0, 50000));
        console.log("Saved HTML snippet.");
        
        const count = await page.evaluate(() => {
            return document.querySelectorAll('.product-item').length;
        });
        console.log(`Product items count: ${count}`);
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}
checkSterenSearch();
