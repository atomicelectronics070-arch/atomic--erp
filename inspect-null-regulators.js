const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectNullRegulators() {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } },
                    { name: { contains: 'ups ', mode: 'insensitive' } }
                ]
            }
        });
        
        console.log(`Found ${products.length} products total.`);
        products.forEach(p => {
            console.log(`ID: ${p.id} | Name: ${p.name.substring(0, 50)} | SKU: ${p.sku} | Provider: ${p.provider} | Price: $${p.price} | CompareAt: $${p.compareAtPrice} | CategoryId: ${p.categoryId}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
inspectNullRegulators();
