import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- BUSCANDO PRODUCTOS DUPLICADOS (PROVEEDOR BP vs ATOMIC) ---');
  
  const allProducts = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });

  console.log(`Total productos en BD: ${allProducts.length}`);

  // Group products by normalized name
  const grouped: { [key: string]: typeof allProducts } = {};
  for (const p of allProducts) {
    const cleanName = p.name.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!grouped[cleanName]) grouped[cleanName] = [];
    grouped[cleanName].push(p);
  }

  let duplicateGroupCount = 0;
  let totalDuplicates = 0;

  for (const [name, list] of Object.entries(grouped)) {
    if (list.length > 1) {
      duplicateGroupCount++;
      totalDuplicates += list.length;
      console.log(`\n📦 GRUPO DUPLICADO #${duplicateGroupCount}: "${list[0].name}" (${list.length} registros)`);
      for (const item of list) {
        console.log(`   - ID: ${item.id} | SKU: ${item.sku} | Proveedor: ${item.supplier || 'N/A'} | Costo: $${item.costPrice} | PVP: $${item.price} | Stock: ${item.stock}`);
      }
    }
  }

  console.log(`\nSummary: ${duplicateGroupCount} grupos duplicados encontrados (${totalDuplicates} productos involucrados).`);

  await prisma.$disconnect();
}

main().catch(console.error);
