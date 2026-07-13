const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countSpeakers() {
    try {
        const count = await prisma.product.count({
            where: {
                OR: [
                    { name: { contains: 'parlante', mode: 'insensitive' } },
                    { name: { contains: 'bocina', mode: 'insensitive' } },
                    { name: { contains: 'bafle', mode: 'insensitive' } },
                    { name: { contains: 'audio', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Total speaker/audio items in DB: ${count}`);

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'parlante', mode: 'insensitive' } },
                    { name: { contains: 'bocina', mode: 'insensitive' } },
                    { name: { contains: 'bafle', mode: 'insensitive' } }
                ]
            },
            select: { name: true, provider: true, price: true, isActive: true },
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
countSpeakers();
