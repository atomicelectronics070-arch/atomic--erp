const { chromium } = require('playwright');

const CONFIG = {
    url: 'https://multitecnologiavyv.com/',
    email: 'totalscopeedge@gmail.com',
    password: 'Jp2024013gg002',
    categoryUrl: 'https://multitecnologiavyv.com/324-convertidores-de-senal',
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
};

async function printCardHtml() {
    const browser = await chromium.launch({ 
        headless: true,
        executablePath: CONFIG.chromePath
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log("Logging in...");
        await page.goto(CONFIG.url + 'iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', CONFIG.email);
        await page.fill('input[name="password"]', CONFIG.password);
        await page.click('button#submit-login');
        await page.waitForTimeout(3000);
        
        console.log(`Navigating to category URL: ${CONFIG.categoryUrl}...`);
        await page.goto(CONFIG.categoryUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);
        
        const cardHtml = await page.evaluate(() => {
            const card = document.querySelector('.js-product-miniature');
            return card ? card.outerHTML : 'Card not found';
        });
        
        console.log("Card HTML:");
        console.log(cardHtml.substring(0, 4000));
        
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}
printCardHtml();
