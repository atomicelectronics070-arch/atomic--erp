import { prisma } from './src/lib/prisma';

async function main() {
  const cat = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { contains: 'encimera', mode: 'insensitive' } },
        { slug: { contains: 'encimera', mode: 'insensitive' } },
        { name: { contains: 'cocina', mode: 'insensitive' } }
      ]
    }
  });
  console.log('ENCIMERAS_CAT_FOUND:', JSON.stringify(cat));
}
main();
