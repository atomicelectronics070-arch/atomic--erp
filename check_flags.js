const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const activeNotDeleted = await prisma.product.count({where: {isActive: true, isDeleted: false}});
  const activeDeleted = await prisma.product.count({where: {isActive: true, isDeleted: true}});
  const inactiveNotDeleted = await prisma.product.count({where: {isActive: false, isDeleted: false}});
  const inactiveDeleted = await prisma.product.count({where: {isActive: false, isDeleted: true}});
  
  console.log('Active, NOT Deleted:', activeNotDeleted);
  console.log('Active, DELETED:', activeDeleted);
  console.log('Inactive, NOT Deleted:', inactiveNotDeleted);
  console.log('Inactive, DELETED:', inactiveDeleted);
  await prisma.$disconnect();
}
check();
