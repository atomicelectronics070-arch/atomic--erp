const { chromium } = require('playwright');

const testUrl = 'https://es.made-in-china.com/co_gxhongfa/product_Qt4-35-Small-Make-Brick-Machine-Manual-Concrete-Block-Making-Machine_yuunsgygyg.html';

async function testScrape() {
  console.log('Launching Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log(`Navigating to ${testUrl}...`);
  await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
  
  console.log('Extracting data...');
  const data = await page.evaluate(() => {
    const titleEl = document.querySelector('h1.sr-pro-title') || document.querySelector('h1') || document.querySelector('.product-name');
    const title = titleEl ? titleEl.innerText.trim() : null;
    
    // Find all images in the gallery
    const imageNodes = document.querySelectorAll('.sr-pro-main-img img, .swiper-slide img, .focus-img-list img, .slider-main-img img, .pic-list img');
    let images = [];
    imageNodes.forEach(img => {
      let src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src) {
        images.push(src);
      }
    });
    
    // Unique images
    images = [...new Set(images)];

    // Product description
    const descEl = document.querySelector('.sr-pro-detail') || document.querySelector('.product-detail-content');
    const description = descEl ? descEl.innerHTML.substring(0, 500) : null;
    
    return { title, images, description };
  });

  console.log('Scraping result:', data);
  await browser.close();
}

testScrape().catch(console.error);
