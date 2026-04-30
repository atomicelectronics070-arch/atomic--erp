const { chromium } = require('playwright');
const fs = require('fs');

async function discoverCategories() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🔍 Discovering MultiTecnologia Categories...');
    await page.goto('https://multitecnologiavyv.com/', { waitUntil: 'networkidle' });
    
    const categories = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('#top-menu a, .menu-item a, .dropdown-item'));
        return links.map(a => ({
            name: a.innerText.trim(),
            url: a.href
        })).filter(c => c.url.includes('/content/') === false && c.url.includes('multitecnologiavyv.com/') && c.url.split('/').length > 3);
    });

    // Deduplicate by URL
    const unique = Array.from(new Map(categories.map(item => [item.url, item])).values());
    
    console.log(`✅ Found ${unique.length} potential categories.`);
    fs.writeFileSync('multitecnologia_categories.json', JSON.stringify(unique, null, 2));
    
    await browser.close();
}

discoverCategories();
