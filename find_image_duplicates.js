const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Finding duplicates by image URL...");
    
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
        select: { id: true, name: true, images: true, provider: true }
    });

    const imageUrlMap = new Map();
    const dups = [];

    for (const p of products) {
        let imgs = [];
        try {
            imgs = JSON.parse(p.images);
        } catch (e) {}

        if (imgs && imgs.length > 0) {
            const firstImg = imgs[0];
            if (imageUrlMap.has(firstImg)) {
                dups.push({
                    original: imageUrlMap.get(firstImg),
                    duplicate: p
                });
            } else {
                imageUrlMap.set(firstImg, p);
            }
        }
    }

    console.log(`Found ${dups.length} products with duplicate image URLs.`);
    dups.slice(0, 10).forEach(d => {
        console.log(`- "${d.original.name}" (${d.original.provider}) <-> "${d.duplicate.name}" (${d.duplicate.provider})`);
    });

    await prisma.$disconnect();
}

main();
