const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTecnoMega() {
    try {
        console.log("⚡ Checking TecnoMega products...");
        
        // Count total TecnoMega products
        const total = await prisma.product.count({
            where: { provider: { contains: 'TecnoMega', mode: 'insensitive' } }
        });
        console.log(`Total TecnoMega products in DB: ${total}`);
        
        // Count by active status
        const active = await prisma.product.count({
            where: { 
                provider: { contains: 'TecnoMega', mode: 'insensitive' },
                isActive: true,
                isDeleted: false
            }
        });
        console.log(`Active & Not Deleted TecnoMega products: ${active}`);
        
        // Let's inspect some of these products
        const sample = await prisma.product.findMany({
            where: { provider: { contains: 'TecnoMega', mode: 'insensitive' } },
            select: { name: true, categoryId: true, isActive: true, isDeleted: true, price: true },
            take: 10
        });
        
        console.log("\nSample TecnoMega products:");
        for (const p of sample) {
            const cat = p.categoryId ? await prisma.category.findUnique({ where: { id: p.categoryId } }) : null;
            console.log(`- Name: "${p.name}" | Cat: "${cat ? cat.name : 'None'} (Visible: ${cat ? cat.isVisible : 'N/A'})" | Price: $${p.price} | Active: ${p.isActive} | Deleted: ${p.isDeleted}`);
        }
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkTecnoMega();
