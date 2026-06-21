const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function emergencyPriceFix() {
    console.log('Starting emergency price correction for Steren and Yale...');
    
    const providers = ['STEREN', 'Yale Ecuador', 'MultiTecnologia V&V'];
    
    for (const provider of providers) {
        const products = await prisma.product.findMany({
            where: { provider: provider, isDeleted: false }
        });

        console.log(`Analyzing ${products.length} products for ${provider}...`);
        
        for (const p of products) {
            // If price > 1000 and it's an accessory/small item, it's definitely a 100x or 10x error
            const name = p.name.toLowerCase();
            const isSmallItem = name.includes('cable') || name.includes('receptor') || name.includes('bateria') || name.includes('candado') || name.includes('soporte') || name.includes('memoria');
            
            if (p.price > 500 && (isSmallItem || provider === 'STEREN')) {
                let newPrice = p.price;
                
                // If it ends in .something85 or .something14, it's likely a 100x error from the dot removal
                if (p.price > 1000) {
                    newPrice = p.price / 100;
                } else if (p.price > 100) {
                    newPrice = p.price / 10;
                }

                console.log(`Fixing ${p.name}: $${p.price} -> $${newPrice}`);
                await prisma.product.update({
                    where: { id: p.id },
                    data: { price: newPrice }
                });
            }
        }
    }

    console.log('Emergency fix completed.');
    await prisma.$disconnect();
}

emergencyPriceFix().catch(console.error);
