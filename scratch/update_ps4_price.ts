import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.product.update({
    where: { id: 'cmsqwfekh0001arov88v0m6u5' },
    data: { price: 35.00 }
  });
  console.log(`✅ Precio actualizado para ${updated.name}: $${updated.price}`);
  await prisma.$disconnect();
}

main().catch(console.error);
