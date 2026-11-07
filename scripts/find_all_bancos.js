const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findBancos() {
  const bancos = await prisma.product.findMany({
    where: {
      provider: 'MultiTecnologia V&V',
      OR: [
        { name: { contains: 'BANCO DE CARGA', mode: 'insensitive' } },
        { name: { contains: '1 HORA', mode: 'insensitive' } },
        { name: { contains: '1HORA', mode: 'insensitive' } }
      ]
    },
    take: 30
  });

  console.log(`Found ${bancos.length} power banks / 1Hora from MultiTecnologia V&V:`);
  bancos.forEach(b => console.log(b.id, '|', b.sku, '|', b.name, '|', b.price));
}

findBancos().finally(async () => {
  await prisma.$disconnect();
});
