import { prisma } from "../src/lib/prisma";

async function auditProductsAndDuplicates() {
  console.log("=== STARTING PRODUCT DATABASE AUDIT ===");

  // 1. Audit ATOMIC provider products
  const atomicProducts = await prisma.product.findMany({
    where: {
      provider: { contains: "ATOMIC", mode: "insensitive" }
    },
    include: { category: true }
  });

  console.log(`Found ${atomicProducts.length} products with ATOMIC provider.`);

  // Services keywords: software, programación, asesoría, peritación, automatización, desarrollo, servicio, sistema
  const serviceKeywords = ["software", "programación", "programacion", "asesoría", "asesoria", "peritación", "peritacion", "automatización", "automatizacion", "desarrollo", "servicio", "sistema", "mantenimiento", "instalación", "instalacion"];

  let updatedAtomicProviderCount = 0;
  for (const p of atomicProducts) {
    const nameLower = (p.name || '').toLowerCase();
    const catLower = (p.category?.name || '').toLowerCase();

    const isService = serviceKeywords.some(k => nameLower.includes(k) || catLower.includes(k));

    if (!isService && p.provider && p.provider.toUpperCase().includes("ATOMIC")) {
      // Physical product erroneously tagged with ATOMIC provider -> change to Importadora/Mayorista
      await prisma.product.update({
        where: { id: p.id },
        data: { provider: "IMPORTADORA ELECTRÓNICA Y TECNOLOGÍA" }
      });
      updatedAtomicProviderCount++;
    }
  }
  console.log(`Updated ${updatedAtomicProviderCount} physical products erroneously tagged with ATOMIC provider.`);

  // 2. Audit & Remove Duplicates (keeping the HIGHEST PRICE version)
  console.log("=== FINDING DUPLICATE PRODUCTS (KEEPING HIGHEST PRICE) ===");
  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, price: true, createdAt: true }
  });

  const groupedByName: Record<string, typeof allProducts> = {};
  for (const p of allProducts) {
    const key = p.name.trim().toLowerCase();
    if (!groupedByName[key]) groupedByName[key] = [];
    groupedByName[key].push(p);
  }

  const duplicateGroups = Object.entries(groupedByName).filter(([_, items]) => items.length > 1);
  console.log(`Found ${duplicateGroups.length} duplicate product groups.`);

  let deletedCount = 0;
  for (const [name, items] of duplicateGroups) {
    // Sort items descending by price so index 0 is HIGHEST price ("dejar el duplicado con mayor precio")
    items.sort((a, b) => (b.price || 0) - (a.price || 0));

    const winner = items[0];
    const losers = items.slice(1);

    const loserIds = losers.map(l => l.id);
    await prisma.product.deleteMany({
      where: { id: { in: loserIds } }
    });
    deletedCount += loserIds.length;
  }

  console.log(`Successfully removed ${deletedCount} lower-priced duplicate product records.`);
  const totalRemaining = await prisma.product.count();
  console.log(`Active unique products remaining in database: ${totalRemaining}`);
}

auditProductsAndDuplicates().catch(console.error).finally(() => process.exit(0));
