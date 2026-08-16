import { prisma } from '../src/lib/prisma';

async function main() {
  const allProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      provider: true,
      category: { select: { name: true } },
      specs: true
    }
  });

  console.log(`Total active products in DB: ${allProducts.length}`);
  
  const campanasLike = allProducts.filter(p => {
    const text = `${p.name} ${p.category?.name || ''} ${p.specs || ''}`.toLowerCase();
    return text.includes('campana') || text.includes('extractor') || text.includes('cocina') || text.includes('isla') || text.includes('retractil') || text.includes('pared');
  });

  console.log(`Found ${campanasLike.length} campanas-like products:`);
  campanasLike.forEach(p => {
    console.log(`- [${p.id}] ${p.name} | Cat: ${p.category?.name || 'N/A'} | $${p.price}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
