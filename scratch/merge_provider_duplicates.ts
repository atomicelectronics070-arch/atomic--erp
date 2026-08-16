import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- INICIANDO FUSIÓN Y COMPACTACIÓN DE PRODUCTOS DUPLICADOS (BP vs ATOMIC) ---');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Total inicial de productos en la BD: ${products.length}`);

  // Group by normalized name
  const grouped: Record<string, typeof products> = {};
  for (const p of products) {
    const key = p.name.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }

  let duplicateGroupsCount = 0;
  let mergedCount = 0;
  let deletedCount = 0;

  for (const [key, group] of Object.entries(grouped)) {
    if (group.length <= 1) continue;

    duplicateGroupsCount++;

    // 1. Find real supplier/provider (not "ATOMIC", not "atomic", not null)
    let realProvider: string | null = null;
    for (const item of group) {
      if (item.provider && !item.provider.toLowerCase().includes('atomic')) {
        realProvider = item.provider;
        break;
      }
    }
    if (!realProvider) {
      realProvider = group.find(i => i.provider)?.provider || 'BP';
    }

    // 2. Find keeper product (prefer product with provider 'ATOMIC' or highest price/margin, or first created)
    let keeper = group.find(i => i.provider && i.provider.toLowerCase().includes('atomic')) || group[0];

    // Find best image and best description among the group
    const bestImage = group.find(i => i.images && i.images.length > 5)?.images || keeper.images;
    const bestDesc = group.find(i => i.description && i.description.length > 10)?.description || keeper.description;
    const maxStock = Math.max(...group.map(i => i.stock || 0));

    // Update keeper with real provider and best metadata while preserving ATOMIC margin/price
    await prisma.product.update({
      where: { id: keeper.id },
      data: {
        provider: realProvider,
        images: bestImage,
        description: bestDesc,
        stock: maxStock,
        updatedAt: new Date()
      }
    });
    mergedCount++;

    // Delete the duplicate products (excluding keeper)
    const duplicatesToDelete = group.filter(i => i.id !== keeper.id);
    for (const dup of duplicatesToDelete) {
      await prisma.product.delete({
        where: { id: dup.id }
      });
      deletedCount++;
    }
  }

  console.log('\n--- RESULTADO DE LA COMPACTACIÓN ---');
  console.log(`✅ Grupos de duplicados procesados: ${duplicateGroupsCount}`);
  console.log(`✅ Productos fusionados y conservados con Margen ATOMIC + Proveedor Real: ${mergedCount}`);
  console.log(`🗑️ Registros duplicados eliminados: ${deletedCount}`);

  const finalCount = await prisma.product.count();
  console.log(`📦 Total final de productos limpios en la BD: ${finalCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
