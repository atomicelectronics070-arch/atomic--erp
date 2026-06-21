const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const p = await prisma.product.findFirst({where: {isActive:true, images: {not: ''}}});
  console.log('Image field type:', typeof p.images);
  console.log('Image content:', p.images);
  await prisma.$disconnect();
}
check();
