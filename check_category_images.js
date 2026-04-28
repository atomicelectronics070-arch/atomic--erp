const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const cats = await prisma.category.findMany({ select: { name: true, image: true } });
    console.log(JSON.stringify(cats, null, 2));
    await prisma.$disconnect();
}
main();
