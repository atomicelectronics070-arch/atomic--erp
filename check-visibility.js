const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOvensVisibility() {
    try {
        const ovens = await prisma.product.findMany({
            where: {
                provider: 'Banco del Perno',
                name: { contains: 'horno', mode: 'insensitive' }
            }
        });
        
        console.log(`Found ${ovens.length} ovens. Checking visibility properties...`);
        for (const o of ovens) {
            console.log(`- ${o.name}:`);
            console.log(`  isActive: ${o.isActive}, stock: ${o.stock}, categoryId: ${o.categoryId}, images: ${o.images}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkOvensVisibility();
