const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showRegulatorsDetails() {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        console.log("Latest updated regulators:");
        products.forEach(p => {
            console.log(`- ${p.name} | Provider: ${p.provider} | Active: ${p.isActive} | Deleted: ${p.isDeleted} | CreatedAt: ${p.createdAt}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
showRegulatorsDetails();
