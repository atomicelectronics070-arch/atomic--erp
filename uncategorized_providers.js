const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const counts = await prisma.product.groupBy({
        by: ['provider'],
        _count: { id: true },
        where: { categoryId: null, isDeleted: false }
    });
    console.log(JSON.stringify(counts, null, 2));
    await prisma.$disconnect();
}
main();
