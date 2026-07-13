const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'img', 'panic-bars', 'new');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const products = [
  {
    name: "BARRERA ANTIPANICO TIPO PUSH DE 60 CENTIMETROS",
    url: "https://cronte.net/producto/barra-antipanico-65cm-salida-de-emergencia/",
    price: 98.00,
    category: "BARRERAS",
    slug: "push-60cm"
  },
  {
    name: "MODELO TIPO PUSH DE 100 CENTIMETROS",
    url: "https://cronte.net/producto/barra-antipanico-salida-de-emergencia-100cm/",
    price: 110.00, // Not provided, assuming based on others or will leave 0
    category: "BARRERAS",
    slug: "push-100cm"
  },
  {
    name: "CERRADURA ANTI PANICO DE ACERO INOXIDABLE ROJO DE 1 METRO 1 PUNTO",
    url: "https://yale.com.ec/producto/barra-antipanico-miami-de-1-punto/",
    price: 120.00,
    category: "BARRERAS",
    slug: "inox-rojo-1m"
  },
  {
    name: "CERRADURA ANTIPANICO TIPO TOALLERO DE UN METRO DE ACERO INOXIDABLE",
    url: "https://yale.com.ec/producto/barra-antipanico-orlando-de-1-punto/",
    price: 130.00,
    category: "BARRERAS",
    slug: "toallero-1m"
  },
  {
    name: "BARRA ANTIPANICO VERTICAL DE TRES PUNTOS 1000 CENTIMETROS",
    url: "https://cronte.net/producto/barra-antipanico-vertical-salida-de-emergencia-100cm/",
    price: 165.00,
    category: "BARRERAS",
    slug: "vertical-3p-1000"
  },
  {
    name: "BARRERA ANTIPANICO VERTICAL DE 3 PUNTOS",
    url: "https://cronte.net/producto/barra-antipanico-vertical-salida-de-emergencia/",
    price: 189.00,
    category: "BARRERAS",
    slug: "vertical-3p"
  },
  {
    name: "Manija Eiffel para Barra Antipánico",
    url: "https://yale.com.ec/producto/manija-para-barra-antipanico-eiffel/",
    price: 99.00,
    category: "MANIJAS",
    slug: "manija-eiffel"
  },
  {
    name: "Cerradura con manilla para puerta salida de emergencia",
    url: "https://cronte.net/producto/cerradura-con-manilla-para-puerta-salida-de-emergencia/",
    price: 50.00,
    category: "MANIJAS",
    slug: "manija-cronte"
  }
];

async function downloadImage(url, filename) {
  try {
      const response = await fetch(url, {
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length === 0) throw new Error('Downloaded 0 bytes!');
      const filePath = path.join(dir, filename);
      fs.writeFileSync(filePath, buffer);
      return `/img/panic-bars/new/${filename}`;
  } catch (e) {
      console.error(`Failed to download ${url}:`, e.message);
      return null;
  }
}

async function scrapeUrl(product) {
    try {
        console.log(`Scraping ${product.url}...`);
        const response = await fetch(product.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
        });
        const html = await response.text();
        
        // Extract all WooCommerce gallery images
        const imageRegex = /<img[^>]+src="([^"]+wp-content\/uploads[^"]+)"/g;
        
        let images = [];
        let match;
        
        while ((match = imageRegex.exec(html)) !== null) {
            // Only keep large images if possible, avoid thumbnails
            if (!match[1].includes('-150x150')) {
                images.push(match[1]);
            }
        }
        
        // Remove duplicates
        images = [...new Set(images)];
        console.log(`Found ${images.length} images for ${product.name}`);
        
        // Extract description
        let description = "";
        const descMatch = html.match(/<div class="woocommerce-Tabs-panel woocommerce-Tabs-panel--description[^>]+>([\s\S]*?)<\/div>/);
        if (descMatch) {
            description = descMatch[1].replace(/<[^>]*>?/gm, '').trim(); // strip HTML
        }
        
        const localImages = [];
        for (let i = 0; i < images.length; i++) {
            const ext = images[i].split('.').pop().split('?')[0] || 'jpg';
            const filename = `${product.slug}-${i+1}.${ext}`;
            const localPath = await downloadImage(images[i], filename);
            if (localPath) localImages.push(localPath);
        }
        
        return {
            ...product,
            description,
            images: localImages
        };
    } catch (e) {
        console.error(`Error scraping ${product.url}:`, e.message);
        return { ...product, description: "", images: [] };
    }
}

async function run() {
    const scrapedProducts = [];
    for (const p of products) {
        const scraped = await scrapeUrl(p);
        scrapedProducts.push(scraped);
    }
    
    fs.writeFileSync('scraped_products.json', JSON.stringify(scrapedProducts, null, 2));
    console.log("Finished scraping! Saved to scraped_products.json");
}

run();
