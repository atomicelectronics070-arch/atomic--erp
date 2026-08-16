import { prisma } from "../src/lib/prisma";

async function searchProduct() {
  console.log("=== SEARCHING SAMSUNG TABLETS ===");
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: "Samsung", mode: "insensitive" } },
        { name: { contains: "A11", mode: "insensitive" } },
        { name: { contains: "Tab", mode: "insensitive" } },
        { description: { contains: "Samsung A11", mode: "insensitive" } },
      ]
    },
    take: 20,
    select: { id: true, name: true, price: true, stock: true, sku: true }
  });

  console.log(`Found ${products.length} matching products:`);
  console.log(JSON.stringify(products, null, 2));
}

searchProduct().catch(console.error).finally(() => process.exit(0));
