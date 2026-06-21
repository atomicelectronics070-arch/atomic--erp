const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const activeCount = await prisma.product.count({where: {name: {contains: 'encimera', mode: 'insensitive'}, isActive: true, isDeleted: false}});
  const inactiveCount = await prisma.product.count({where: {name: {contains: 'encimera', mode: 'insensitive'}, isActive: false}});
  const deletedCount = await prisma.product.count({where: {name: {contains: 'encimera', mode: 'insensitive'}, isDeleted: true}});
  
  console.log('Active Encimeras:', activeCount);
  console.log('Inactive Encimeras:', inactiveCount);
  console.log('Deleted Encimeras:', deletedCount);
  await prisma.$disconnect();
}
check();
