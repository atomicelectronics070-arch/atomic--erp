const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.product.update({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    data: {
      name: 'COMPUTADORA TODO-EN-UNO DELL 27 PULGADAS INTEL CORE I7-150U 16GB RAM 512GB SSD AIO',
      specs: 'Dell 27 Pulgadas | Intel Core i7-150U | 16GB RAM DDR5 | 512GB SSD | Pantalla AIO FHD'
    }
  });

  console.log('SUCCESSFULLY UPDATED PRODUCT NAME & SPECS:');
  console.log('ID:', updated.id);
  console.log('NAME:', updated.name);
  console.log('SPECS:', updated.specs);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
