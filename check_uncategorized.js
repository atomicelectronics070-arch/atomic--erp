const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const prods = await prisma.product.findMany({
        where: { categoryId: null, isDeleted: false },
        take: 50,
        select: { name: true, provider: true }
    });
    console.log(JSON.stringify(prods, null, 2));
    await prisma.$disconnect();
}
main();
