const https = require('https');

function fetchHTML(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Find all jpg/png links that look like a product image
                const match = data.match(/<a[^>]+href="([^"]+\.(?:jpg|png))"[^>]*class="[^"]*woocommerce-main-image[^"]*"/);
                if (match) return resolve(match[1]);
                
                const match2 = data.match(/<img[^>]+src="([^"]+\.(?:jpg|png))"[^>]*class="[^"]*wp-post-image[^"]*"/);
                resolve(match2 ? match2[1] : 'No image found');
            });
        });
    });
}

async function run() {
    const url = 'https://cronte.net/producto/cerradura-con-manilla-para-puerta-salida-de-emergencia/';
    const image = await fetchHTML(url);
    console.log("IMAGE URL:", image);
    
    if (image !== 'No image found') {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        const result = await prisma.product.updateMany({
            where: { name: { contains: "INUTEK" } },
            data: { images: JSON.stringify([image]) }
        });
        console.log("Updated", result.count, "products");
        await prisma.$disconnect();
    }
}

run();
