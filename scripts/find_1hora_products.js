const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'GAR159', mode: 'insensitive' } },
          { name: { contains: 'GAR276', mode: 'insensitive' } },
          { name: { contains: '1Hora', mode: 'insensitive' } },
          { sku: { contains: 'GAR159', mode: 'insensitive' } },
          { sku: { contains: 'GAR276', mode: 'insensitive' } },
          { name: { contains: 'banco de carga', mode: 'insensitive' } },
          { sku: { contains: '1H-', mode: 'insensitive' } }
        ]
      },
      take: 20
    });

    console.log(`Found ${products.length} matching products:`);
    products.forEach(p => {
      console.log(`ID: ${p.id} | SKU: ${p.sku} | Name: ${p.name} | Price: $${p.price} | Images: ${p.images?.slice(0, 80)}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
