const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateOvens() {
    try {
        const products = await prisma.product.findMany({
            where: {
                name: { contains: 'horno', mode: 'insensitive' },
                provider: null
            }
        });
        
        console.log(`Found ${products.length} ovens without provider. Updating them to Banco del Perno + 20% margin...`);
        
        let count = 0;
        for (const prod of products) {
            if (prod.name.includes('Freidora') || prod.name.includes('Q-ONE')) {
                continue; // Skip air fryers that happen to have 'horno' in name but might not be the 7 ovens
            }
            
            const providerPrice = prod.price;
            const retailPrice = +(providerPrice * 1.20).toFixed(2);
            
            await prisma.product.update({
                where: { id: prod.id },
                data: {
                    provider: 'Banco del Perno',
                    compareAtPrice: providerPrice,
                    price: retailPrice,
                    isActive: true
                }
            });
            console.log(`- Updated: ${prod.name} | New Price: $${retailPrice} (was $${providerPrice})`);
            count++;
        }
        console.log(`Total ovens updated: ${count}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
updateOvens();
