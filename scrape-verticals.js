const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function fetchHTML(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<a[^>]+href="([^"]+\.(?:jpg|jpeg|png))"[^>]*class="[^"]*woocommerce-main-image[^"]*"/);
                if (match) return resolve(match[1]);
                
                const match2 = data.match(/<img[^>]+src="([^"]+\.(?:jpg|jpeg|png))"[^>]*class="[^"]*wp-post-image[^"]*"/);
                if (match2) return resolve(match2[1]);
                
                const match3 = data.match(/<meta property="og:image" content="([^"]+)"/);
                resolve(match3 ? match3[1] : 'No image found');
            });
        }).on('error', () => resolve('No image found'));
    });
}

async function run() {
    // URL 1: 100cm vertical
    const img100 = await fetchHTML('https://cronte.net/producto/barra-antipanico-vertical-salida-de-emergencia-100cm/');
    console.log("Vertical 100cm image:", img100);
    
    // URL 2: 60cm vertical
    const img60 = await fetchHTML('https://cronte.net/producto/barra-antipanico-vertical-60cm/');
    console.log("Vertical 60cm image:", img60);
    
    if (img100 !== 'No image found') {
        await prisma.product.updateMany({
            where: { name: { contains: "VERTICAL 100 CENTIMETROS" } },
            data: { images: JSON.stringify([img100]) }
        });
    }
    
    if (img60 !== 'No image found') {
        await prisma.product.updateMany({
            where: { name: { contains: "VERTICAL 60 CENTIMETROS" } },
            data: { images: JSON.stringify([img60]) }
        });
    }
    
    console.log("Done updating vertical bars!");
    await prisma.$disconnect();
}

run();
