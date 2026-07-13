const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSpeakersCategories() {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'parlante', mode: 'insensitive' } },
                    { name: { contains: 'bocina', mode: 'insensitive' } }
                ]
            },
            select: { categoryId: true }
        });
        
        const catMap = new Map();
        for (const p of products) {
            const cid = p.categoryId || 'null';
            catMap.set(cid, (catMap.get(cid) || 0) + 1);
        }
        
        console.log("Speakers category distribution:");
        for (const [cid, count] of catMap.entries()) {
            if (cid === 'null') {
                console.log(`- No category (null): ${count} products`);
            } else {
                const cat = await prisma.category.findUnique({ where: { id: cid } });
                console.log(`- Category: ${cat ? cat.name : 'Unknown'} (ID: ${cid}): ${count} products`);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkSpeakersCategories();
