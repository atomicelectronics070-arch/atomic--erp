const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findTecnit() {
    try {
        const results = await prisma.product.findMany({
            where: {
                OR: [
                    { provider: { contains: 'tecnit', mode: 'insensitive' } },
                    { name: { contains: 'tecnit', mode: 'insensitive' } },
                    { description: { contains: 'tecnit', mode: 'insensitive' } },
                    { provider: { contains: 'tecni', mode: 'insensitive' } },
                    { name: { contains: 'tecni', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Found ${results.length} matches for 'tecnit' / 'tecni'`);
        results.slice(0, 30).forEach(p => {
            console.log(`- Name: ${p.name} | Provider: ${p.provider} | Price: ${p.price}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
findTecnit();
