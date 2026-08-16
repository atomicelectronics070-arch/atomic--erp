import { prisma } from "../src/lib/prisma";

async function searchCables() {
  console.log("=== SEARCHING CABLE & NETWORKING PRODUCTS IN DATABASE ===");
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      isActive: true,
      OR: [
        { name: { contains: "cable", mode: "insensitive" } },
        { name: { contains: "bobina", mode: "insensitive" } },
        { name: { contains: "utp", mode: "insensitive" } },
        { name: { contains: "ftp", mode: "insensitive" } },
        { name: { contains: "cat5", mode: "insensitive" } },
        { name: { contains: "cat6", mode: "insensitive" } },
        { name: { contains: "cobre", mode: "insensitive" } },
        { name: { contains: "cca", mode: "insensitive" } },
        { name: { contains: "fibra", mode: "insensitive" } },
        { name: { contains: "coaxial", mode: "insensitive" } },
      ]
    },
    take: 100,
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      provider: true,
      images: true,
      description: true,
      category: { select: { id: true, name: true } }
    }
  });

  console.log(`Found ${products.length} cable products in DB.`);
  console.log(JSON.stringify(products.slice(0, 15), null, 2));
}

searchCables().catch(console.error).finally(() => process.exit(0));
