const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: { db: { url: 'postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002@aws-1-us-east-1.pooler.supabase.com:5432/postgres' } }
});

async function audit() {
    // 1. Products with price > 2,000,000
    const overpriced = await prisma.product.findMany({
        where: { price: { gt: 2000000 } },
        select: { id: true, name: true, price: true, compareAtPrice: true, provider: true, sku: true },
        orderBy: { price: 'desc' },
        take: 100
    });

    console.log('=== PRODUCTOS CON PRECIO > $2,000,000 ===');
    console.log(`Total encontrados: ${overpriced.length}`);
    overpriced.forEach(p => {
        console.log(`ID:${p.id} | ${(p.name||'').substring(0,55).padEnd(55)} | PVP:$${p.price} | CMP:$${p.compareAtPrice} | PROV:${p.provider}`);
    });

    // 2. Sample product to see all fields
    console.log('\n=== CAMPOS DISPONIBLES (primer producto válido) ===');
    const sample = await prisma.product.findFirst({
        where: { price: { gt: 0, lt: 5000 }, isActive: true }
    });
    if (sample) {
        Object.keys(sample).forEach(k => console.log(`  ${k}: ${typeof sample[k] === 'string' ? (sample[k]||'').substring(0,60) : sample[k]}`));
    }

    // 3. Providers with count and average margin
    console.log('\n=== PROVEEDORES (margen = (price-compareAtPrice)/compareAtPrice * 100) ===');
    const providers = await prisma.$queryRawUnsafe(`
        SELECT 
            "provider",
            COUNT(*) as product_count,
            ROUND(AVG(price)::numeric, 2) as avg_pvp,
            ROUND(AVG("compareAtPrice")::numeric, 2) as avg_cost,
            ROUND(
                AVG(
                    CASE WHEN "compareAtPrice" > 0 
                    THEN (price - "compareAtPrice") / "compareAtPrice" * 100 
                    END
                )::numeric, 1
            ) as avg_margin_pct
        FROM "Product"
        WHERE provider IS NOT NULL AND provider != '' AND "isDeleted" = false
        GROUP BY provider
        ORDER BY product_count DESC
        LIMIT 50
    `);
    providers.forEach(p => {
        console.log(`${(p.provider||'').padEnd(30)} | Prods: ${String(p.product_count).padStart(4)} | Avg PVP: $${p.avg_pvp} | Avg Cost: $${p.avg_cost} | Margen: ${p.avg_margin_pct}%`);
    });

    // 4. Total
    const total = await prisma.product.count({ where: { isDeleted: false } });
    console.log(`\n=== TOTAL PRODUCTOS ACTIVOS: ${total} ===`);

    await prisma.$disconnect();
}

audit().catch(console.error);
