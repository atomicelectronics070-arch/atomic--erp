const { chromium } = require('playwright');
async function main() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
    await page.fill('input[name="password"]', 'Jp2024013gg002');
    await page.click('button[data-link-action="sign-in"]');
    await page.waitForTimeout(5000);
    await page.goto('https://multitecnologiavyv.com/352-banco-de-carga', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    const count = await page.evaluate(() => document.querySelectorAll('.js-product-miniature').length);
    console.log('Count:', count);
    await browser.close();
}
main();
