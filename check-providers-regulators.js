const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProvidersAndRegulators() {
    try {
        // Find all unique providers in the DB to see if "tecnit" or similar exists
        const products = await prisma.product.findMany({
            select: { provider: true }
        });
        const providers = new Set(products.map(p => p.provider).filter(Boolean));
        console.log("Providers present in DB:", Array.from(providers));

        // Find products with "regulador" or "regulator" where provider is null or matches multitecnologia/tecnit
        const regulators = await prisma.product.findMany({
            where: {
                name: { contains: 'regulador', mode: 'insensitive' }
            }
        });
        console.log(`\nFound ${regulators.length} total regulators in DB.`);
        
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
checkProvidersAndRegulators();
