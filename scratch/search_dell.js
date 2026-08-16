const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: 'dell', mode: 'insensitive' } },
        { name: { contains: 'todo', mode: 'insensitive' } },
        { name: { contains: 'computadora', mode: 'insensitive' } },
        { name: { contains: 'i7', mode: 'insensitive' } },
        { name: { contains: '27', mode: 'insensitive' } },
        { name: { contains: 'all in one', mode: 'insensitive' } }
      ]
    },
    take: 40,
    select: { id: true, name: true, price: true, stock: true, provider: true }
  });

  console.log('TOTAL DE PRODUCTOS ENCONTRADOS:', prods.length);
  prods.forEach(p => {
    console.log(`- [${p.id}] ${p.name} | Precio: $${p.price} | Stock: ${p.stock} | Prov: ${p.provider}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
