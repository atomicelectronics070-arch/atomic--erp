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

  const missingImages = allProducts.filter((p) => {
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

  console.log(`TOTAL PRODUCTOS SIN IMAGEN: ${missingImages.length} de ${allProducts.length}\n`);
  
  const result = missingImages.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category?.name || 'Sin categoría'
  }));

  console.log(JSON.stringify(result, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
