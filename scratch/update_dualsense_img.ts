import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const updated = await prisma.product.update({
    where: { id: 'cmsqsxqzp00013eudft92ncyt' },
    data: {
      images: JSON.stringify([
        'https://ecsonyb2c.vtexassets.com/arquivos/ids/244234/PS5_DS_Pshot_A.jpg?v=637365582088830000'
      ])
    }
  });
  console.log('Imagen actualizada:', updated.name);
  await prisma.$disconnect();
}
main().catch(console.error);
