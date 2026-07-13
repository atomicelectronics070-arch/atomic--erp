const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRegulators() {
    try {
        console.log("⚡ Starting regulator fix...");
        
        // Find category "UPS y Energía"
        const upsCat = await prisma.category.findUnique({
            where: { id: 'cmr2n9xoj0003znjlj8jongdt' }
        });
        if (!upsCat) {
            console.error("Target category 'UPS y Energía' not found!");
            return;
        }
        
        // Find all regulators / UPSs
        const regulators = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'regulador', mode: 'insensitive' } },
                    { name: { contains: 'regulator', mode: 'insensitive' } },
                    { name: { contains: 'ups ', mode: 'insensitive' } },
                    { name: { contains: 'estabilizador', mode: 'insensitive' } }
                ]
            }
        });
        
        console.log(`Found ${regulators.length} regulators/UPSs to update.`);
        
        let count = 0;
        for (const reg of regulators) {
            // Apply 20% margin to MultiTecnologia V&V, JM Technology, or null provider products if they don't have it
            let finalPrice = reg.price;
            
            // Clean decimal points to max 2 decimals
            finalPrice = parseFloat(finalPrice.toFixed(2));
            
            await prisma.product.update({
                where: { id: reg.id },
                data: {
                    categoryId: upsCat.id,
                    isActive: true,
                    isDeleted: false,
                    price: finalPrice,
                    createdAt: new Date() // Bump to top
                }
            });
            count++;
        }
        
        console.log(`✅ Successfully updated ${count} regulators to "UPS y Energía" category and bumped them to top of store.`);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
fixRegulators();
