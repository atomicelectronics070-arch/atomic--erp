const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRegulators() {
    try {
        console.log("⚡ Starting fast regulator fix...");
        
        // Find category "UPS y Energía"
        const upsCat = await prisma.category.findUnique({
            where: { id: 'cmr2n9xoj0003znjlj8jongdt' }
        });
        if (!upsCat) {
            console.error("Target category 'UPS y Energía' not found!");
            return;
        }
        
        // Find all regulators / UPSs / stabilizers
        const regulators = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } },
                    { name: { contains: 'ups ', mode: 'insensitive' } },
                    { name: { contains: 'estabilizador', mode: 'insensitive' } }
                ]
            },
            select: { id: true, name: true, price: true }
        });
        
        console.log(`Found ${regulators.length} regulators/UPSs to update.`);
        
        // Update in batches of 15 to keep it fast but avoid hitting DB connection limits
        const batchSize = 15;
        for (let i = 0; i < regulators.length; i += batchSize) {
            const batch = regulators.slice(i, i + batchSize);
            const promises = batch.map(reg => {
                const finalPrice = parseFloat(reg.price.toFixed(2));
                return prisma.product.update({
                    where: { id: reg.id },
                    data: {
                        categoryId: upsCat.id,
                        isActive: true,
                        isDeleted: false,
                        price: finalPrice,
                        createdAt: new Date()
                    }
                }).catch(e => console.error(`  ❌ Error updating ${reg.name}: ${e.message.slice(0, 80)}`));
            });
            
            await Promise.all(promises);
            console.log(`  Processed ${Math.min(i + batchSize, regulators.length)} / ${regulators.length}...`);
        }
        
        console.log(`✅ Done! Bumping completed.`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
fixRegulators();
