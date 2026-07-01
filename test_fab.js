const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.fabricables.com/productos/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Scrape structure
  const items = await page.evaluate(() => {
      // Find elements that have both an image and text, likely the product blocks
      const blocks = Array.from(document.querySelectorAll('.elementor-widget-image-box, .elementor-image-box-wrapper, a.elementor-item, .elementor-column'));
      return blocks.map(b => {
          return {
              text: b.innerText.trim(),
              hasImage: !!b.querySelector('img'),
              html: b.innerHTML.substring(0, 100)
          };
      }).filter(b => b.hasImage && b.text.length > 5);
  });
  
  console.log(JSON.stringify(items, null, 2));
  await browser.close();
}

test();
