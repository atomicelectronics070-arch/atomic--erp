const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function fetchHTML(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Find all jpg/png links that look like a product image
                const match = data.match(/<a[^>]+href="([^"]+\.(?:jpg|png))"[^>]*class="[^"]*woocommerce-main-image[^"]*"/);
                if (match) return resolve(match[1]);
                
                // fallback just match anything inside wp-content/uploads/2023 that looks like a vertical bar
                const allUploads = data.match(/https:\/\/cronte\.net\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[^"'\s]+\.(?:jpg|png|jpeg)/g) || [];
                const uniqueImages = [...new Set(allUploads)];
                resolve(uniqueImages.join(', '));
            });
        });
    });
}

async function run() {
    console.log("100cm:", await fetchHTML('https://cronte.net/producto/barra-antipanico-vertical-salida-de-emergencia-100cm/'));
    console.log("60cm:", await fetchHTML('https://cronte.net/producto/barra-antipanico-vertical-60cm/'));
}

run();
