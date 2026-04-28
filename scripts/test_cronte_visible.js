const { chromium } = require('playwright');

async function test() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    try {
        await page.goto('https://cronte.net/tienda/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        
        let title = await page.title();
        if(title.includes('Just a moment') || title.includes('Checking your browser')) {
            console.log("Aún bloqueado. Intentando esperar más...");
            await page.waitForTimeout(10000);
            title = await page.title();
        }

        console.log("Título:", title);

        const fs = require('fs');
        const html = await page.content();
        fs.writeFileSync('C:/Users/SANTIAGO/.gemini/antigravity/scratch/cronte_dom.txt', html);
        console.log("HTML guardado.");

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}
test();
