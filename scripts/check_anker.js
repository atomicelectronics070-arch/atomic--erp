const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAnker() {
  const prods = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Anker', mode: 'insensitive' } },
        { name: { contains: 'Solix', mode: 'insensitive' } },
        { name: { contains: 'C300', mode: 'insensitive' } },
        { name: { contains: 'EcoFlow', mode: 'insensitive' } },
        { name: { contains: 'Generador', mode: 'insensitive' } },
        { name: { contains: 'Estación de Energía', mode: 'insensitive' } }
      ]
    },
    take: 20
  });

  console.log(`Found ${prods.length} Anker/Generador products:`);
  prods.forEach(p => console.log(p.id, '|', p.sku, '|', p.name, '|', p.price));
}

checkAnker().finally(async () => {
  await prisma.$disconnect();
});
