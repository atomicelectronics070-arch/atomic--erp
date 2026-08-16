import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'encimera', mode: 'insensitive' } },
        { name: { contains: 'horno', mode: 'insensitive' } },
        { name: { contains: 'cocina', mode: 'insensitive' } },
        { category: { name: { contains: 'encimera', mode: 'insensitive' } } },
        { category: { name: { contains: 'horno', mode: 'insensitive' } } },
        { category: { name: { contains: 'cocina', mode: 'insensitive' } } },
      ]
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      images: true,
      specs: true,
      description: true,
      category: { select: { name: true } }
    },
    orderBy: { price: 'desc' }
  });
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
