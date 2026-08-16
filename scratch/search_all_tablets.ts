import { prisma } from "../src/lib/prisma";

async function searchAllTablets() {
  const tablets = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: "Tablet", mode: "insensitive" } },
        { name: { contains: "Samsung", mode: "insensitive" } },
        { name: { contains: "Galaxy", mode: "insensitive" } },
        { name: { contains: "A9", mode: "insensitive" } },
        { category: { name: { contains: "Tablet", mode: "insensitive" } } }
      ]
    },
    take: 30,
    select: { id: true, name: true, price: true, stock: true, sku: true }
  });

  console.log("Found Tablets / Samsung count:", tablets.length);
  console.log(JSON.stringify(tablets, null, 2));
}

searchAllTablets().catch(console.error).finally(() => process.exit(0));
