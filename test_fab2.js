const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.fabricables.com/productos/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  const items = await page.evaluate(() => {
      // Trying to find any container that has an image and text
      const blocks = Array.from(document.querySelectorAll('.elementor-widget-image-box, figure, .wp-block-image'));
      return blocks.map(b => {
          const img = b.querySelector('img');
          let text = b.innerText.trim();
          if (!text) {
              // check if parent or sibling has text
              if (b.closest('.elementor-column')) {
                 text = b.closest('.elementor-column').innerText.trim();
              } else {
                 text = b.parentElement.innerText.trim();
              }
          }
          return {
              text: text.substring(0, 50),
              hasImage: !!img,
              imgSrc: img ? img.src : null
          };
      }).filter(b => b.hasImage && b.text.length > 5);
  });
  
  console.log(JSON.stringify(items, null, 2));
  await browser.close();
}

test();
