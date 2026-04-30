const { chromium } = require('playwright');
const fs = require('fs');

async function discoverCategories() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🔍 Fast Discovery...');
    await page.goto('https://multitecnologiavyv.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const categories = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.map(a => ({
            name: a.innerText.trim(),
            url: a.href
        })).filter(c => 
            c.url.includes('multitecnologiavyv.com/') && 
            /\/\d+-/.test(c.url)
        );
    });

    const unique = Array.from(new Map(categories.map(item => [item.url, item])).values());
    console.log(`✅ Found ${unique.length} categories.`);
    fs.writeFileSync('multitecnologia_categories_fast.json', JSON.stringify(unique, null, 2));
    
    await browser.close();
}

discoverCategories();
