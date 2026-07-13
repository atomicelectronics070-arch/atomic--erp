const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MAIN_ROOTS = [
    'cmqvwkn530000ejkxk6df8rqz', // Electrónica
    'cmr1ljw1h0005enspj5u8e34y', // Hogar
    'cmr1ljwbc0006enspp27oif6u', // Residencial
    'cmr1ljwex0007enspx2gpluue', // Industrial
    'cmr1ljwim0008enspf83sz800'  // Software
];

async function checkOtherRootCats() {
    try {
        console.log("⚡ Checking other root categories...");
        
        // Find all categories with parentId = null that are not in the main roots list
        const rootCats = await prisma.category.findMany({
            where: {
                parentId: null,
                NOT: { id: { in: MAIN_ROOTS } }
            }
        });
        
        console.log(`Found ${rootCats.length} non-main root categories:`);
        for (const cat of rootCats) {
            const count = await prisma.product.count({ where: { categoryId: cat.id } });
            console.log(`- "${cat.name}" (ID: ${cat.id}, Slug: ${cat.slug}): ${count} products`);
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkOtherRootCats();
