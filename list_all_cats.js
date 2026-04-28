const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const cats = await prisma.category.findMany();
    console.log('All Categories:', cats.map(c => c.name));
    await prisma.$disconnect();
}
main();
