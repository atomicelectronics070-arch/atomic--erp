const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');
const cheerio = require('cheerio');
const prisma = new PrismaClient();

const URLS = [
  "https://es.made-in-china.com/co_gxhongfa/product_Qt4-35-Small-Make-Brick-Machine-Manual-Concrete-Block-Making-Machine_yuunsgygyg.html",
  "https://es.made-in-china.com/co_gxhongfa/product_10-Discount-Cement-Concrete-Brick-Making-Machine-Hollow-Block-Making-Machinery_horhnoeeg.html",
  "https://es.made-in-china.com/co_gxhongfa/product_EPS-Sandwich-Cement-Block-Machine-Concrete-Wall-Panel-Making-Machine-Panel-Machine_erguueyhg.html",
  "https://es.made-in-china.com/co_gxhongfa/product_Automatic-Paving-Block-Machine-and-Concrete-Block-Forming-Machine_erhgireig.html",
  "https://es.made-in-china.com/co_gxhongfa/product_Qtj4-35-Hfb521m-Concrete-Block-Machine-Profitable-Hollow-Brick-Making-Machine-Price-Block-Molding-Machine-for-Small-Business-Opportunities_ereeurieg.html",
  "https://es.made-in-china.com/co_gxhongfa/product_Full-Automatic-Concrete-Interlock-Paving-Curbstone-Hollow-Cement-Brick-Block-Making-Machine_erryyhygg.html",
  "https://es.made-in-china.com/co_zzhento/product_Restaurant-Food-Dishes-Delivery-Robot-Waiter-Serving-Robot_ysounynyog.html",
  "https://es.made-in-china.com/co_reeman-robot/product_Reeman-Smart-Intelligent-Recharge-Restaurant-Autonomous-Food-Delivery-Service-Waiter-Robot_uoeoyrugru.html",
  "https://es.made-in-china.com/co_hantewinrobot/product_Source-Manufacturer-Hot-Sell-Waiter-Serving-Robot-Restaurant-Food-Dishes-Delivery-Robot_ysgsiriugy.html",
  "https://es.made-in-china.com/co_foodline/product_Commercial-Waiter-Professional-Multi-Floor-Food-Delivery-Robot_yyioggoryg.html",
  "https://es.made-in-china.com/co_hantewinrobot/product_Factory-Price-Hotel-Obstacle-Avoidance-Goods-Intelligent-Delivery-Robot-Waiter-Food-Delivery-Robot_yueshrorsg.html",
  "https://es.made-in-china.com/co_reeman-robot/product_Factory-Obstacle-Avoidance-Food-Delivery-Waiter-Restaurant-Automatic-Guiding-Food-Delivery-Robot_uorsgnyyhu.html",
  "https://es.made-in-china.com/co_hantewinrobot/product_Custom-Robot-Platform-Obstacle-Avoidance-Driverless-Commercial-Robot-Hotel-Restaurant-Waiter-Food-Delivery-Robot_ysgioiyuey.html",
  "https://es.made-in-china.com/co_glgwrobot/product_Robot-Vacuum-and-Mop-Cleaner-with-Self-Cleaning-Robotic-Floor-Cleaning-Machine-for-Textile-Clothing-Factory-Industrial-Warehouse_yyhiorhrrg.html",
  "https://es.made-in-china.com/co_glgwrobot/product_Commercial-Industrial-Floor-Sweeping-Mopping-Vacuuming-Dusting-4-In1-Automatic-Cleaning-Robot_yyirnoeosg.html",
  "https://es.made-in-china.com/co_fupingmetal/product_Intelligent-Following-Automated-Delivery-Robot-of-Transportation-for-Delivery_uorgogshsu.html",
  "https://es.made-in-china.com/co_ubtechrobot/product_Ubtech-Walker-S2-Full-Size-Embodied-Humanoid-Robot-for-Automotive-Manufacturing_yyogosshsg.html",
  "https://es.made-in-china.com/co_ubtechrobot/product_Ubtech-Walker-S2-Industrial-Humanoid-Robot-7X24-Continuous-Operation-with-Global-Patented-Technology_yyohuhhnsg.html",
  "https://es.made-in-china.com/co_ubtechrobot/product_Advanced-Ubtech-Walker-C1-Humanoid-Robot-with-Nvidia-Technology_yueyynrhgy.html"
];

async function scrapeMadeInChina() {
  console.log('🚀 Iniciando Scraper de Made-in-China (Con extracción de Precios y Margen)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  });
  
  // Encontrar o crear categoría Industrial
  let catIndustrial = await prisma.category.findUnique({ where: { slug: 'industrial' } });
  if (!catIndustrial) {
    catIndustrial = await prisma.category.create({ data: { name: 'Industrial', slug: 'industrial', isVisible: true } });
  }

  let newProductsCount = 0;
  let updatedProductsCount = 0;
  const providersSet = new Set();

  for (const url of URLS) {
    const page = await context.newPage();
    try {
      console.log(`Buscando en: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      const providerMatch = url.match(/co_([^\/]+)/);
      const provider = providerMatch ? providerMatch[1] : 'Made-in-China';

      const data = await page.evaluate(() => {
        const titleEl = document.querySelector('h1.sr-pro-title') || document.querySelector('h1') || document.querySelector('.product-name');
        const title = titleEl ? titleEl.innerText.trim() : null;
        
        const imageNodes = document.querySelectorAll('.sr-pro-main-img img, .swiper-slide img, .focus-img-list img, .slider-main-img img, .pic-list img');
        let images = [];
        imageNodes.forEach(img => {
          let src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && src.startsWith('http')) {
            images.push(src);
          }
        });
        
        const descEl = document.querySelector('.sr-pro-detail') || document.querySelector('.product-detail-content');
        const description = descEl ? descEl.innerHTML.substring(0, 800) : null;
        
        // Extraer precio
        let priceRaw = null;
        const priceEls = document.querySelectorAll('.only-one-priceNum-td-left, .sr-pro-price, .item-price, .price-val');
        for (const el of priceEls) {
            if (el && el.innerText.trim()) {
                priceRaw = el.innerText.trim();
                break;
            }
        }
        if (!priceRaw) {
            const m = document.body.innerText.match(/US\$ ([\d\.,]+)/);
            if (m) priceRaw = m[0];
        }

        return { title, images: [...new Set(images)], description, priceRaw };
      });

      if (!data.title) {
        console.log('⚠️ No se pudo extraer el título, omitiendo.');
        await page.close();
        continue;
      }

      let finalPrice = 0;
      if (data.priceRaw) {
          const match = data.priceRaw.match(/[\d\.,]+/);
          if (match) {
             let str = match[0];
             if (str.includes(',') && str.indexOf(',') > str.lastIndexOf('.')) {
                 str = str.replace(/\./g, '').replace(',', '.');
             } else if (str.includes('.') && str.indexOf('.') > str.lastIndexOf(',')) {
                 str = str.replace(/,/g, '');
             } else if (str.includes(',')) {
                 str = str.replace(/,/g, '');
             }
             finalPrice = Number((parseFloat(str) * 1.4).toFixed(2)); // +40% margin
          }
      }

      // Check if exists
      const existing = await prisma.product.findFirst({
        where: { name: data.title, provider: provider }
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            name: data.title,
            description: data.description || '',
            price: finalPrice, // APLICADO EL MARGEN DEL 40%
            images: JSON.stringify(data.images),
            provider: provider,
            categoryId: catIndustrial.id,
            isActive: true
          }
        });
        console.log(`✅ Agregado: ${data.title} (Precio: $${finalPrice})`);
        newProductsCount++;
        providersSet.add(provider);
      } else {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
             price: finalPrice
          }
        });
        console.log(`✅ Actualizado: ${data.title} (Precio: $${finalPrice})`);
        updatedProductsCount++;
      }
    } catch (e) {
      console.error(`❌ Error extrayendo ${url}:`, e.message);
    }
    await page.close();
  }

  await browser.close();

  // Enviar notificación a Admins si hay nuevos
  if (newProductsCount > 0) {
    const providersArray = Array.from(providersSet);
    const providerText = providersArray.length > 0 ? ` de ${providersArray.join(', ')}` : '';
    
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
    if (admins.length > 0) {
      const notifications = admins.map(admin => ({
        userId: admin.id,
        title: '¡Nuevas Máquinas Industriales!',
        message: `El bot extrajo ${newProductsCount} nuevos productos${providerText} de China.`,
        type: 'SYSTEM_ALERT',
        isRead: false
      }));
      await prisma.notification.createMany({ data: notifications });
      console.log(`🔔 Notificaciones de nuevas máquinas enviadas a los administradores.`);
    }
  }

  console.log(`🏁 Extracción finalizada. Nuevos: ${newProductsCount}. Actualizados: ${updatedProductsCount}`);
}

// Ejecutar inmediatamente al llamar el script
scrapeMadeInChina().then(() => {
    console.log('Esperando próximo ciclo programado...');
}).catch(console.error);

// Programar cada 12 horas
cron.schedule('0 */12 * * *', () => {
    console.log('🕒 Ejecutando tarea programada (12h)...');
    scrapeMadeInChina().catch(console.error);
});
