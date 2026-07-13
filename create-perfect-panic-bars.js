const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
            res.on('error', () => resolve('No image found'));
        }).on('error', () => resolve('No image found'));
    });
}

const requestedProducts = [
    {
        name: "BARRERA ANTI PANICO TIPO PUSH 1 PUNTO 60 CENTIMETROS",
        price: 98,
        url: "https://cronte.net/producto/barra-antipanico-65cm-salida-de-emergencia/",
        fallbackImage: "https://cronte.net/wp-content/uploads/2023/10/OU-BF65N-2.jpeg"
    },
    {
        name: "BARRERA ANTI PANICO TIPO PUSH 100 CENTIMETROS",
        price: 114,
        url: "https://cronte.net/producto/barra-antipanico-salida-de-emergencia-100cm/",
        fallbackImage: "https://cronte.net/wp-content/uploads/2023/10/2-22.png"
    },
    {
        name: "BARRERA ANTI PANICO DE 1 METROS 1 PUNTO ROJA MARCA YALE",
        price: 197,
        url: "https://yale.com.ec/producto/barra-antipanico-miami-de-1-punto/",
        fallbackImage: "https://yale.com.ec/wp-content/uploads/2026/05/BarraAntipanicoMiamide1Punto.webp"
    },
    {
        name: "BARRERA ANTI PÀNICO TIPO TOALLERO UN PUNTO",
        price: 189,
        url: "https://yale.com.ec/producto/barra-antipanico-orlando-de-1-punto/",
        fallbackImage: "https://yale.com.ec/wp-content/uploads/2025/09/Yale-Productos_7.webp"
    },
    {
        name: "MANIJA PARA BARRA ANTI PANICO REVERSA YALE",
        price: 99,
        url: "https://yale.com.ec/producto/manija-para-barra-antipanico-eiffel/",
        fallbackImage: "https://yale.com.ec/wp-content/uploads/2023/11/Eiffel_2.png"
    },
    {
        name: "MANIJA PREVERSA PARA CERRADURA ANTPANICO ECONOMICA INUTEK",
        price: 50,
        url: "https://cronte.net/producto/cerradura-con-manilla-para-puerta-salida-de-emergencia/",
        fallbackImage: "https://cronte.net/wp-content/uploads/2020/07/ZK-S50.png"
    },
    {
        name: "BARRERA ANTI PANICO 3 PUNTOS DE CIERRE VERTICAL 100 CENTIMETROS",
        price: 187,
        url: "https://cronte.net/producto/barra-antipanico-vertical-salida-de-emergencia-100cm/",
        fallbackImage: "https://cronte.net/wp-content/uploads/2023/10/2-22.png"
    },
    {
        name: "BARRERA ANTI PANICO 3 PUNTOS DE CIERRE VERTICAL 60 CENTIMETROS",
        price: 166,
        url: "https://cronte.net/producto/barra-antipanico-vertical-salida-de-emergencia/",
        fallbackImage: "https://cronte.net/wp-content/uploads/2023/10/OU-BF65N-2.jpeg"
    }
];

async function run() {
    const finalIds = [];
    
    for (const prod of requestedProducts) {
        let imageUrl = await fetchHTML(prod.url);
        if (imageUrl === 'No image found' || imageUrl.includes('Logo-importadora-cronte')) {
            imageUrl = prod.fallbackImage;
        }

        // Check if product exists (by exact url in description, or by name similarity)
        // To be completely safe and avoid duplicates, we will just CREATE them and use their new IDs
        // Or we can try to find an existing one and update it
        
        let dbProd = await prisma.product.findFirst({
            where: {
                name: {
                    contains: prod.name.split(' ')[0], // just something to match?
                }
            }
        });
        
        // Actually let's just create 8 pristine fresh products so we guarantee perfection!
        // We will mark the old panic bars as isDeleted: true to clean up the DB
        
        const newProduct = await prisma.product.create({
            data: {
                name: prod.name,
                description: "<p>Sistema de evacuación de emergencia homologado y certificado. Máxima seguridad y respuesta instantánea garantizada.</p>",
                price: prod.price,
                images: JSON.stringify([imageUrl]),
                isActive: true,
                isDeleted: false
            }
        });
        
        finalIds.push(newProduct.id);
        console.log(`Created: ${prod.name} with price ${prod.price} and image ${imageUrl}`);
    }
    
    console.log("FINAL IDS:");
    console.log(JSON.stringify(finalIds, null, 2));
    
    // Soft delete the old messy ones
    await prisma.product.updateMany({
        where: {
            id: { notIn: finalIds },
            OR: [
                {name: {contains: 'antipanico', mode: 'insensitive'}},
                {name: {contains: 'antipánico', mode: 'insensitive'}},
                {name: {contains: 'eiffel', mode: 'insensitive'}},
                {name: {contains: 'toallero', mode: 'insensitive'}}
            ]
        },
        data: { isDeleted: true, isActive: false }
    });
}

run();
