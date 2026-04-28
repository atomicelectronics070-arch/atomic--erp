const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CONFIG = {
    baseUrl: 'https://yale.com.ec/tienda/page/',
    multiplier: 1.09, // +9%
    provider: 'Yale Ecuador',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    }
};

async function syncProduct(url) {
    try {
        const { data } = await axios.get(url, { headers: CONFIG.headers, timeout: 15000 });
        const $ = cheerio.load(data);
        
        const title = $('.product_title').text().trim();
        const priceRaw = $('.woocommerce-Price-amount bdi').first().text().replace('$', '').replace(',', '').trim();
        const price = parseFloat(priceRaw) || 0;
        const finalPrice = parseFloat((price * CONFIG.multiplier).toFixed(2));
        
        const description = $('.woocommerce-product-details__short-description').html() || '';
        const images = [];
        $('.woocommerce-product-gallery__image img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && !images.includes(src)) images.push(src);
        });

        if (!title) return;

        await prisma.product.upsert({
            where: { sku: title },
            update: {
                name: title,
                price: finalPrice,
                description: description,
                images: JSON.stringify(images),
                isActive: true,
                isDeleted: false,
                provider: CONFIG.provider
            },
            create: {
                name: title,
                sku: title,
                price: finalPrice,
                description: description,
                images: JSON.stringify(images),
                isActive: true,
                isDeleted: false,
                provider: CONFIG.provider
            }
        });
        
        return title;
    } catch (e) {
        console.error(`❌ Error sincronizando ${url}: ${e.message}`);
    }
}

async function run() {
    console.log("🚀 Iniciando Scraper Pro AI: Yale Ecuador (+9%)...");
    
    const history = await prisma.extractionHistory.create({
        data: { url: 'https://yale.com.ec/tienda/', domain: 'yale.com.ec', status: 'PROCESSING', itemCount: 0 }
    });

    let totalSync = 0;
    const allLinks = [];

    // 1. Obtener todos los enlaces de productos (12 páginas detectadas)
    for (let p = 1; p <= 15; p++) {
        try {
            console.log(`🔍 Escaneando página ${p}...`);
            const { data } = await axios.get(`${CONFIG.baseUrl}${p}/`, { headers: CONFIG.headers, timeout: 15000 });
            const $ = cheerio.load(data);
            
            const links = $('li.product a.woocommerce-LoopProduct-link').map((i, el) => $(el).attr('href')).get();
            if (links.length === 0) {
                console.log(`⚠️ No se encontraron enlaces en la página ${p}.`);
                break;
            }
            allLinks.push(...links);
            console.log(`✅ Página ${p}: Encontrados ${links.length} productos.`);
        } catch (e) {
            console.log(`⏹️ Fin de paginación o error en pág ${p}: ${e.message}`);
            break;
        }
    }

    const uniqueLinks = [...new Set(allLinks)];
    console.log(`📦 Total de productos únicos detectados: ${uniqueLinks.length}. Iniciando carga...`);

    for (const link of uniqueLinks) {
        const title = await syncProduct(link);
        if (title) {
            totalSync++;
            if (totalSync % 10 === 0) console.log(`📦 Procesados ${totalSync} productos...`);
        }
    }

    await prisma.extractionHistory.update({
        where: { id: history.id },
        data: { status: 'COMPLETED', itemCount: totalSync }
    });

    console.log(`✨ MISIÓN COMPLETADA: ${totalSync} productos de Yale sincronizados.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
