import { prisma } from '../src/lib/prisma';

async function main() {
  const allProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      images: true,
      provider: true,
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  const keywords = ['playstation', 'ps5', 'ps4', 'ps3', 'xbox', 'nintendo', 'switch', 'consola', 'joystick', 'control ps', 'gameboy', 'steam deck', 'gaming'];

  const consolas = allProducts.filter(p => {
    const text = `${p.name} ${p.category?.name || ''} ${p.provider || ''}`.toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });

  console.log(`FOUND ${consolas.length} CONSOLES / GAMING PRODUCTS IN DB:`);
  consolas.forEach(c => {
    console.log(`- [${c.id}] "${c.name}" | Cat: "${c.category?.name}" | Price: $${c.price} | Stock: ${c.stock}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
