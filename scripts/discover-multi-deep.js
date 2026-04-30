const { chromium } = require('playwright');
const fs = require('fs');

async function discoverCategories() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🔑 Logging in to find all categories...');
    try {
        await page.goto('https://multitecnologiavyv.com/iniciar-sesion', { waitUntil: 'domcontentloaded' });
        await page.fill('input[name="email"]', 'totalscopeedge@gmail.com');
        await page.fill('input[name="password"]', 'Jp2024013gg002');
        await page.click('button[data-link-action="sign-in"]');
        await page.waitForTimeout(5000);
    } catch (e) {
        console.log('Login failed, continuing as guest...');
    }

    console.log('🔍 Discovering Categories...');
    await page.goto('https://multitecnologiavyv.com/', { waitUntil: 'networkidle' });
    
    const categories = await page.evaluate(() => {
        // Find all links that look like categories
        const links = Array.from(document.querySelectorAll('a'));
        return links.map(a => ({
            name: a.innerText.trim(),
            url: a.href
        })).filter(c => 
            c.url.includes('multitecnologiavyv.com/') && 
            /\/\d+-/.test(c.url) // Matches patterns like /303-category-name
        );
    });

    const unique = Array.from(new Map(categories.map(item => [item.url, item])).values());
    console.log(`✅ Found ${unique.length} categories.`);
    fs.writeFileSync('multitecnologia_categories_deep.json', JSON.stringify(unique, null, 2));
    
    await browser.close();
}

discoverCategories();
