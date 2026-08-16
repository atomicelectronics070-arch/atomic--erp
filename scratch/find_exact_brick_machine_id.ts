import { prisma } from '../src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: "LADRILLOS", mode: "insensitive" } },
        { name: { contains: "FABRICACIÓN", mode: "insensitive" } },
        { price: 70000 }
      ]
    }
  });

  console.log("=== PRODUCTOS ENCONTRADOS ===");
  console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
