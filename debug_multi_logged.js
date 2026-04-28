const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        console.log('🔑 Logging in...');
        await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button[data-link-action="sign-in"]');
        await page.waitForTimeout(5000);

        console.log('🚀 Navigating to category...');
        await page.goto('https://multitecnologiavyv.com/352-banco-de-carga', { waitUntil: 'networkidle' });
        await page.waitForTimeout(5000);
        
        await page.screenshot({ path: 'multi_logged_cat.png' });
        const html = await page.content();
        fs.writeFileSync('multi_logged.html', html);
        console.log('📸 Screenshot and HTML saved.');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await browser.close();
    }
}
main();
