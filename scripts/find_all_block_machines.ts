import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'bloque', mode: 'insensitive' } },
        { name: { contains: 'block', mode: 'insensitive' } },
        { name: { contains: 'ladrillo', mode: 'insensitive' } }
      ]
    }
  });

  const filtered = products.filter(p => {
    const n = p.name.toLowerCase();
    const isLock = n.includes('candado') || n.includes('construcción') || n.includes('esponja');
    const price = Number(p.price) || 0;
    if (price < 5000) return false;
    return true;
  });

  console.log(`Found ${filtered.length} products:`);
  for (const p of filtered) {
    console.log(`ID: ${p.id} | Name: ${p.name} | Images: ${p.images}`);
  }
}

main().finally(() => prisma.$disconnect());
