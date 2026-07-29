import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const campanas = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'campana', mode: 'insensitive' } },
        { name: { contains: 'extractor', mode: 'insensitive' } },
        { category: { name: { contains: 'campana', mode: 'insensitive' } } },
      ],
      price: { gt: 200 },
      isDeleted: false,
    },
    orderBy: { price: 'desc' },
    include: { category: true },
  });

  for (const c of campanas) {
    console.log('=== PRODUCTO ===');
    console.log('ID:', c.id);
    console.log('NOMBRE:', c.name);
    console.log('PRECIO:', c.price);
    console.log('SKU:', c.sku);
    console.log('PROVIDER:', c.provider);
    console.log('STOCK:', c.stock);
    console.log('CATEGORIA:', c.category?.name);
    console.log('IMAGES:', c.images ? c.images.substring(0, 300) : 'NULL');
    console.log('SPECS:', c.specs ? c.specs.substring(0, 600) : 'NULL');
    console.log('DESC (primeros 400 chars):', c.description ? c.description.substring(0, 400) : 'NULL');
    console.log('');
  }
  console.log('TOTAL:', campanas.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
