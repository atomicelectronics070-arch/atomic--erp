import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- FUSIÓN Y COMPACTACIÓN RÁPIDA DE DUPLICADOS EN LOTE ---');

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      provider: true,
      price: true,
      images: true,
      description: true,
      stock: true,
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Total productos cargados: ${products.length}`);

  const grouped: Record<string, typeof products> = {};
  for (const p of products) {
    const key = p.name.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }

  const idsToDelete: string[] = [];
  const updates: Array<{ id: string; provider: string; images?: string | null; description?: string | null; stock: number }> = [];

  for (const [key, group] of Object.entries(grouped)) {
    if (group.length <= 1) continue;

    // Real provider: prefer non-ATOMIC provider (e.g. BP)
    let realProvider = 'BP';
    const nonAtomicItem = group.find(i => i.provider && !i.provider.toLowerCase().includes('atomic'));
    if (nonAtomicItem && nonAtomicItem.provider) {
      realProvider = nonAtomicItem.provider;
    }

    // Keeper product: prefer product with provider 'ATOMIC' or highest price/margin
    const keeper = group.find(i => i.provider && i.provider.toLowerCase().includes('atomic')) || group[0];

    const bestImage = group.find(i => i.images && i.images.length > 5)?.images || keeper.images;
    const bestDesc = group.find(i => i.description && i.description.length > 10)?.description || keeper.description;
    const maxStock = Math.max(...group.map(i => i.stock || 0));

    updates.push({
      id: keeper.id,
      provider: realProvider,
      images: bestImage,
      description: bestDesc,
      stock: maxStock
    });

    for (const dup of group) {
      if (dup.id !== keeper.id) {
        idsToDelete.push(dup.id);
      }
    }
  }

  console.log(`\nPlaneado: ${updates.length} productos a actualizar con Proveedor Real + Margen ATOMIC.`);
  console.log(`Planeado: ${idsToDelete.length} registros duplicados a eliminar en lote.`);

  // Execute updates in chunked transactions
  const chunkSize = 100;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map(u => prisma.product.update({
        where: { id: u.id },
        data: {
          provider: u.provider,
          images: u.images,
          description: u.description,
          stock: u.stock,
          updatedAt: new Date()
        }
      }))
    );
    console.log(`  Procesados ${Math.min(i + chunkSize, updates.length)} / ${updates.length} de actualizaciones...`);
  }

  // Execute deletes in chunked transactions
  for (let i = 0; i < idsToDelete.length; i += chunkSize) {
    const chunk = idsToDelete.slice(i, i + chunkSize);
    await prisma.product.deleteMany({
      where: { id: { in: chunk } }
    });
    console.log(`  Eliminados ${Math.min(i + chunkSize, idsToDelete.length)} / ${idsToDelete.length} de duplicados...`);
  }

  const finalCount = await prisma.product.count();
  console.log(`\n🎉 COMPACTACIÓN COMPLETADA. Total final de productos en BD: ${finalCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
