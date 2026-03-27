import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({ where: { isDeleted: false } });
    const deletedProducts = await prisma.product.count({ where: { isDeleted: true } });
    
    console.log(`Total Products in DB: ${totalProducts}`);
    console.log(`Active Products (-isDeleted): ${activeProducts}`);
    console.log(`Soft Deleted Products: ${deletedProducts}`);
  } catch (error) {
    console.error('Error counting products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
