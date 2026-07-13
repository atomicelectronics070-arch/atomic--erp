const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showCategoryHierarchy() {
    try {
        const rootCats = await prisma.category.findMany({
            where: { parentId: null }
        });
        console.log("ROOT CATEGORIES:");
        for (const cat of rootCats) {
            console.log(`- ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
            const subs = await prisma.category.findMany({
                where: { parentId: cat.id }
            });
            for (const sub of subs) {
                console.log(`  └─ ${sub.name} (ID: ${sub.id}, Slug: ${sub.slug})`);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
showCategoryHierarchy();
