const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllCategories() {
    try {
        const cats = await prisma.category.findMany({
            select: { id: true, name: true, parentId: true }
        });
        console.log("All categories in DB:");
        cats.forEach(c => {
            console.log(`- "${c.name}" | ID: ${c.id} | Parent: ${c.parentId}`);
        });
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
listAllCategories();
