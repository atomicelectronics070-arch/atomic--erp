import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Check if category already exists
  const existing = await prisma.category.findFirst({
    where: { name: { contains: 'mando', mode: 'insensitive' } }
  });

  if (existing) {
    console.log('Categoria ya existe:', existing.id, existing.name);
    await prisma.$disconnect();
    return;
  }

  const cat = await prisma.category.create({
    data: {
      name: 'Mandos para Consolas',
      slug: 'mandos-para-consolas',
      description: 'Controles y mandos para consolas de videojuegos PlayStation, Xbox, Nintendo y compatibles. Inalámbricos, con cable, y accesorios gaming.',
      isVisible: true,
    }
  });

  console.log('Categoria creada exitosamente:');
  console.log('  ID:', cat.id);
  console.log('  Nombre:', cat.name);
  console.log('  Slug:', cat.slug);
  await prisma.$disconnect();
}

main().catch(console.error);
