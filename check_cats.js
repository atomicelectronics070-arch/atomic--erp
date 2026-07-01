const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const cats = await prisma.category.findMany({ where: { parentId: null } });
    for (const cat of cats) {
        const subcats = await prisma.category.findMany({ where: { parentId: cat.id } });
        const ids = [cat.id, ...subcats.map(s => s.id)];
        const pCount = await prisma.product.count({ where: { categoryId: { in: ids } } });
        if (pCount > 0 || subcats.length > 0) {
            console.log('CAT:', cat.name, 'Subcats:', subcats.length, 'Products:', pCount);
            if (subcats.length > 0) {
                console.log('  Subcategories:', subcats.map(s => s.name).join(', '));
            }
        }
    }
}
main().finally(() => prisma.$disconnect().catch(() => process.exit(0)));
