const { chromium } = require('playwright');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function findAndSync() {
    const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
    const page = await browser.newPage();

    // Scan the full menu to find all categories
    console.log('🔍 Scanning MultiTecnologia menu for all categories...\n');
    await page.goto('https://multitecnologiavyv.com/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    const categories = await page.$$eval('a', els =>
        els.map(el => ({ text: el.innerText?.trim(), href: el.href }))
           .filter(l => l.href.includes('multitecnologiavyv.com') && l.href.match(/\/\d+-/) && l.text)
           .map(l => `${l.text} -> ${l.href}`)
    );

    const unique = [...new Set(categories)].sort();
    console.log('All categories found:');
    unique.forEach(c => {
        const lower = c.toLowerCase();
        if (lower.includes('fuente') || lower.includes('poder') || lower.includes('source') || lower.includes('power')) {
            console.log('  ⭐ ' + c);
        } else {
            console.log('  ' + c);
        }
    });

    await browser.close();
}

findAndSync();
