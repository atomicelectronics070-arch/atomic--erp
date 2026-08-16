import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const allProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      category: { select: { name: true } }
    },
    orderBy: { name: 'asc' }
  });

  const missing = allProducts.filter((p) => {
    if (!p.images) return true;
    const trimmed = p.images.trim();
    if (trimmed === '' || trimmed === '[]' || trimmed === 'null' || trimmed === '[""]') return true;
    try {
      const parsed = JSON.parse(p.images);
      if (!Array.isArray(parsed) || parsed.length === 0) return true;
      if (parsed.every((img) => !img || typeof img !== 'string' || img.trim() === '')) return true;
    } catch {
      return true;
    }
    return false;
  });

  const grouped: Record<string, typeof missing> = {};
  for (const p of missing) {
    const cat = p.category?.name || 'Sin categoría';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }

  console.log(`=== RESUMEN POR CATEGORÍA DE PRODUCTOS SIN IMAGEN ===`);
  console.log(`Total productos sin imagen: ${missing.length}\n`);

  for (const [catName, list] of Object.entries(grouped)) {
    console.log(`📌 CATEGORÍA: ${catName} (${list.length} productos)`);
    for (const item of list) {
      console.log(`   • [${item.id}] ${item.name} ($${item.price})`);
    }
    console.log('');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
