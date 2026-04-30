/**
 * ATOMIC ERP — APPLY TIERED MARGINS (v2 - corrected provider matching)
 *
 * Escala de márgenes (sobre precio de costo):
 *   $0   – $5    → +65%  (x1.65)
 *   $5   – $15   → +50%  (x1.50)
 *   $15  – $45   → +47%  (x1.47)
 *   $45  – $100  → +35%  (x1.35)
 *   $100 – $200  → +20%  (x1.20)
 *   $200 – $1000 → +18%  (x1.18)
 *   >$1000       → +12%  (x1.12)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function applyMargin(cost) {
    if (cost <= 0)    return cost;
    if (cost <= 5)    return parseFloat((cost * 1.65).toFixed(2));
    if (cost <= 15)   return parseFloat((cost * 1.50).toFixed(2));
    if (cost <= 45)   return parseFloat((cost * 1.47).toFixed(2));
    if (cost <= 100)  return parseFloat((cost * 1.35).toFixed(2));
    if (cost <= 200)  return parseFloat((cost * 1.20).toFixed(2));
    if (cost <= 1000) return parseFloat((cost * 1.18).toFixed(2));
    return parseFloat((cost * 1.12).toFixed(2));
}

async function applyToProvider(providerExact) {
    const products = await prisma.product.findMany({
        where: { provider: providerExact, isDeleted: false, isActive: true, price: { gt: 0 } },
        select: { id: true, price: true, compareAtPrice: true }
    });

    if (products.length === 0) {
        console.log(`⚪  ${providerExact.padEnd(30)} — sin productos activos`);
        return 0;
    }

    let updated = 0;
    const batches = [];
    for (const p of products) {
        // compareAtPrice stores the ORIGINAL cost. If already set and < current price → use it.
        const cost = (p.compareAtPrice && p.compareAtPrice > 0 && p.compareAtPrice < p.price)
            ? p.compareAtPrice
            : p.price;

        if (cost <= 0) continue;
        const newPrice = applyMargin(cost);
        if (Math.abs(newPrice - p.price) > 0.01) {
            batches.push(prisma.product.update({
                where: { id: p.id },
                data: { price: newPrice, compareAtPrice: cost }
            }));
            updated++;
        }
    }

    // Process in chunks of 50 to avoid overwhelming DB
    const CHUNK = 50;
    for (let i = 0; i < batches.length; i += CHUNK) {
        await Promise.all(batches.slice(i, i + CHUNK));
    }

    console.log(`✅  ${providerExact.padEnd(30)} — ${updated}/${products.length} precios actualizados`);
    return updated;
}

async function main() {
    // Get all distinct providers in DB
    const allProviders = await prisma.product.groupBy({
        by: ['provider'],
        _count: { id: true },
        where: { isActive: true, isDeleted: false, price: { gt: 0 } },
        orderBy: { _count: { id: 'desc' } }
    });

    console.log(`\n🚀 ATOMIC TIERED MARGINS — Procesando ${allProviders.length} proveedores...\n`);

    let grandTotal = 0;
    for (const row of allProviders) {
        if (!row.provider) continue;
        const count = await applyToProvider(row.provider);
        grandTotal += count;
    }

    const [total, active] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true, isDeleted: false } }),
    ]);

    console.log('\n══════════════════════════════════════════════');
    console.log(`📊  PRECIOS ACTUALIZADOS:  ${grandTotal}`);
    console.log(`📦  Total DB: ${total}  |  Activos: ${active}`);
    console.log('══════════════════════════════════════════════\n');

    await prisma.$disconnect();
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
