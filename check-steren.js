const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSteren() {
    try {
        const count = await prisma.product.count({
            where: {
                OR: [
                    { provider: { contains: 'steren', mode: 'insensitive' } },
                    { name: { contains: 'steren', mode: 'insensitive' } },
                    { description: { contains: 'steren', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Total Steren matches in DB: ${count}`);
        
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { provider: { contains: 'steren', mode: 'insensitive' } },
                    { name: { contains: 'steren', mode: 'insensitive' } }
                ]
            },
            take: 20
        });
        products.forEach(p => {
            console.log(`- ${p.name} | Provider: ${p.provider} | Price: $${p.price} | Active: ${p.isActive}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkSteren();
