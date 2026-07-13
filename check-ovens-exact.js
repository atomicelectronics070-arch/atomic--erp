const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findOvens() {
    try {
        const products = await prisma.product.findMany({
            where: {
                name: { contains: 'horno', mode: 'insensitive' }
            }
        });
        console.log(`Found ${products.length} products with 'horno' in name`);
        products.forEach(p => console.log(`- ${p.name} | Provider: ${p.provider} | Price: ${p.price} | CompareAt: ${p.compareAtPrice} | isActive: ${p.isActive}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
findOvens();
