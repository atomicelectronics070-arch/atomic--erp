const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'horno', mode: 'insensitive' } },
                    { provider: { contains: 'banco del perno', mode: 'insensitive' } },
                    { provider: { contains: 'banco', mode: 'insensitive' } },
                    { provider: { contains: 'perno', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Found ${products.length} products`);
        products.forEach(p => console.log(`- ${p.name} | Provider: ${p.provider} | Price: ${p.price} | isActive: ${p.isActive}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkProducts();
