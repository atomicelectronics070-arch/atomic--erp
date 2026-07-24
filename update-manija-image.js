const https = require('https');

function fetchHTML(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<meta property="og:image" content="([^"]+)"/);
                resolve(match ? match[1] : 'No image found');
            });
        });
    });
}

async function run() {
    const url = 'https://cronte.net/producto/cerradura-con-manilla-para-puerta-salida-de-emergencia/';
    const image = await fetchHTML(url);
    console.log("IMAGE URL:", image);
    
    // update the database
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // We update the Inutek manija
    const result = await prisma.product.updateMany({
        where: { name: { contains: "INUTEK" } },
        data: { images: JSON.stringify([image]) }
    });
    console.log("Updated", result.count, "products");
    
    await prisma.$disconnect();
}

run();
