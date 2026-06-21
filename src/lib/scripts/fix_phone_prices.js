const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSpecificPhones() {
    console.log('Fixing specific high-end devices...');
    
    // Specifically target high-end phones that are < $300
    const suspects = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'iPhone 15', mode: 'insensitive' } },
                { name: { contains: 'iPhone 16', mode: 'insensitive' } },
                { name: { contains: 'iPhone 17', mode: 'insensitive' } },
                { name: { contains: 'Galaxy S24', mode: 'insensitive' } },
                { name: { contains: 'Pro Max', mode: 'insensitive' } }
            ],
            price: { lt: 400 },
            isDeleted: false
        }
    });

    for (const p of suspects) {
        if (p.name.toLowerCase().includes('case') || p.name.toLowerCase().includes('mica') || p.name.toLowerCase().includes('cover')) continue;
        
        console.log(`Fixing Device ${p.name}: $${p.price} -> $${p.price * 10}`);
        await prisma.product.update({
            where: { id: p.id },
            data: { price: p.price * 10 }
        });
    }

    console.log('Finished precise device fix.');
    await prisma.$disconnect();
}

fixSpecificPhones().catch(console.error);
