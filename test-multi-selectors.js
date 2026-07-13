const { chromium } = require('playwright');

const CONFIG = {
    url: 'https://multitecnologiavyv.com/',
    email: 'totalscopeedge@gmail.com',
    password: 'Jp2024013gg002',
    categoryUrl: 'https://multitecnologiavyv.com/324-convertidores-de-senal',
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
};

async function diagnose() {
    console.log("Starting MultiTecnologia selectors diagnosis...");
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
        
        // Let's print the page title and some HTML snippet
        const title = await page.title();
        console.log(`Page title: "${title}"`);
        
        // Let's print all class names of divs on the page to find product cards
        const divsCount = await page.evaluate(() => {
            const divs = Array.from(document.querySelectorAll('div'));
            const classes = divs.map(d => d.className).filter(c => c.length > 0);
            return {
                totalDivs: divs.length,
                sampleClasses: classes.slice(0, 50)
            };
        });
        console.log(`Total divs: ${divsCount.totalDivs}`);
        console.log(`Sample classes found:`, divsCount.sampleClasses);
        
        // Let's search for "product" in all classes or IDs
        const productClasses = await page.evaluate(() => {
            const elms = Array.from(document.querySelectorAll('*'));
            const matches = elms
                .map(el => el.className)
                .filter(c => typeof c === 'string' && c.toLowerCase().includes('product'));
            return [...new Set(matches)].slice(0, 30);
        });
        console.log("Classes containing 'product':", productClasses);
        
        // Let's print any text that looks like a product name or price
        const pageText = await page.innerText('body');
        console.log("Does page contain 'Convertidor'? ", pageText.toLowerCase().includes('convertidor'));
        console.log("Does page contain 'Convertidores'? ", pageText.toLowerCase().includes('convertidores'));
        console.log("Page text snippet (first 1000 chars):");
        console.log(pageText.substring(0, 1000));
        
        // Let's save a screenshot to the artifact directory so we can view the visual layout if needed
        const screenshotPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\77fc2104-3877-4fa1-8aba-c0f973653e6e\\multitecnologia_screenshot.png';
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to: ${screenshotPath}`);
        
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}
diagnose();
