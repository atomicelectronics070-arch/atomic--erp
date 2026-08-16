import { prisma } from '../src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'QT', mode: 'insensitive' } },
        { name: { contains: 'bloque', mode: 'insensitive' } },
        { name: { contains: 'maquina', mode: 'insensitive' } },
        { description: { contains: 'QT4-24', mode: 'insensitive' } },
        { description: { contains: 'QT4', mode: 'insensitive' } },
      ]
    },
    select: { id: true, name: true, price: true, description: true }
  });

  console.log("=== PRODUCTOS ENCONTRADOS ===");
  console.log(JSON.stringify(products, null, 2));

  const blogs = await prisma.blogPost.findMany({
    where: {
      OR: [
        { title: { contains: 'bloque', mode: 'insensitive' } },
        { title: { contains: 'maquina', mode: 'insensitive' } },
        { content: { contains: 'QT4', mode: 'insensitive' } }
      ]
    },
    select: { id: true, title: true, slug: true }
  });

  console.log("=== BLOGS ENCONTRADOS ===");
  console.log(JSON.stringify(blogs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
