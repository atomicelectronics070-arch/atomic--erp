const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: { db: { url: 'postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002@aws-1-us-east-1.pooler.supabase.com:5432/postgres' } }
});

async function fixPrices() {
    // Find all products with price > 100,000 (clearly wrong for retail)
    const crazy = await prisma.product.findMany({
        where: { price: { gt: 100000 }, isDeleted: false },
        select: { id: true, name: true, price: true, compareAtPrice: true, provider: true },
        orderBy: { price: 'desc' }
    });

    console.log(`=== PRODUCTOS CON PRECIO > $100,000: ${crazy.length} ===`);
    crazy.forEach(p => {
        console.log(`ID:${p.id} | $${p.price} | ${(p.name||'').substring(0,60)} | ${p.provider}`);
    });

    // These are likely robots with prices in Chinese Yuan or wrong currency conversion
    // We'll flag them as inactive since they shouldn't be shown in the seller price list
    const ids = crazy.map(p => p.id);
    
    if (ids.length > 0) {
        const result = await prisma.product.updateMany({
            where: { id: { in: ids } },
            data: { isActive: false }
        });
        console.log(`\n✅ Marcados como inactivos: ${result.count} productos con precios absurdos`);
    }

    // Also check products with prices that seem like they have too many digits
    // (e.g. $1500000 that should be $1500 — divided by 1000)
    const suspicious = await prisma.product.findMany({
        where: { price: { gt: 10000, lt: 100000 }, isDeleted: false },
        select: { id: true, name: true, price: true, provider: true },
        orderBy: { price: 'desc' },
        take: 30
    });

    console.log('\n=== PRODUCTOS ENTRE $10,000 y $100,000 (revisar) ===');
    suspicious.forEach(p => {
        console.log(`$${p.price} | ${(p.name||'').substring(0,60)} | ${p.provider}`);
    });

    await prisma.$disconnect();
    console.log('\n✅ Auditoría y corrección completada');
}

fixPrices().catch(console.error);
