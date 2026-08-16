import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      supplier: true,
      price: true,
      costPrice: true,
      stock: true,
      imageUrl: true,
      description: true
    }
  });

  console.log(`Total productos: ${products.length}`);

  const byName: Record<string, typeof products> = {};
  for (const p of products) {
    const key = p.name.trim().toLowerCase();
    if (!byName[key]) byName[key] = [];
    byName[key].push(p);
  }

  let count = 0;
  for (const [name, list] of Object.entries(byName)) {
    if (list.length > 1) {
      count++;
      console.log(`\n--- DUPLICADO #${count}: "${list[0].name}" ---`);
      for (const p of list) {
        console.log(` ID: ${p.id} | Supplier: ${p.supplier} | Cost: $${p.costPrice} | Price: $${p.price} | Stock: ${p.stock}`);
      }
    }
  }

  console.log(`\nTotal grupos duplicados: ${count}`);
  await prisma.$disconnect();
}

main().catch(console.error);
