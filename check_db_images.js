const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cats = await prisma.category.findMany({ select: { name: true, image: true, slug: true } });
    const cols = await prisma.collection.findMany({ select: { name: true, image: true, slug: true } });
    console.log(JSON.stringify({cats, cols}, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
