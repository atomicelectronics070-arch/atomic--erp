const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    slug: 'repuestos-de-laptop',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` // Generic gear/parts
  },
  {
    slug: 'celulares-tablets-y-computacion',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>` // Smartphone
  },
  {
    slug: 'energia',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` // Lightning
  },
  {
    slug: 'electronica-para-negocios-movilidad-y-deportes',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>` // Devices/Abstract
  },
  {
    slug: 'porteria-electronica',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M12 15v4"/></svg>` // Intercom/Camera
  },
  {
    slug: 'iluminacion',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7v1"/><path d="M5.6 5.6l.7.7"/><path d="M18.4 5.6l-.7.7"/><path d="M2 12h1"/><path d="M21 12h1"/><path d="M5.6 18.4l.7-.7"/><path d="M18.4 18.4l-.7-.7"/></svg>` // Bulb/Light
  },
  {
    slug: 'cerraduras-smart-y-accesos',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>` // Lock
  },
  {
    slug: 'consolas-de-video-juegos',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><path d="M6 12h4"/><path d="M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/></svg>` // Gamepad
  },
  {
    slug: 'domotica-automatizacion-para-tu-negocio',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>` // Smart Home/Building
  },
  {
    slug: 'tienda-en-linea-a-medida',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>` // Shopping Cart
  },
  {
    slug: 'servicios',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>` // Wrench/Service
  }
];

async function generateMissingSVGs() {
  const dir = path.join(__dirname, 'public', 'categories');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const cat of categories) {
    try {
      const filePath = path.join(dir, `${cat.slug}.svg`);
      // Update SVG to have a solid black silhouette style (filled shapes) instead of just strokes
      let filledSvg = cat.svg.replace('fill="none"', 'fill="black"').replace('stroke="black"', 'stroke="white"');
      
      fs.writeFileSync(filePath, filledSvg);
      
      const imgPath = `/categories/${cat.slug}.svg`;
      await prisma.category.update({
        where: { slug: cat.slug },
        data: { image: imgPath }
      });
      console.log(`Created SVG and updated DB for: ${cat.slug}`);
    } catch (e) {
      console.error(`Failed for ${cat.slug}:`, e.message);
    }
  }
}

generateMissingSVGs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
