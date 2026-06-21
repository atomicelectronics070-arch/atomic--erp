const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function increasePowerBankPrices() {
    console.log('Increasing Power Bank prices by $10...');
    
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'BANCO DE CARGA', mode: 'insensitive' } },
                { name: { contains: 'POWER BANK', mode: 'insensitive' } },
                { name: { contains: 'BANCO DE PODER', mode: 'insensitive' } }
            ],
            isDeleted: false
        }
    });

    console.log(`Found ${products.length} power banks. Updating...`);

    for (const p of products) {
        const newPrice = p.price + 10;
        console.log(`Updating ${p.name}: $${p.price} -> $${newPrice}`);
        await prisma.product.update({
            where: { id: p.id },
            data: { price: newPrice }
        });
    }

    console.log('Price update completed.');
    await prisma.$disconnect();
}

increasePowerBankPrices().catch(console.error);
