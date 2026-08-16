import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.product.update({
    where: { id: 'cmol4l47c0007gemmzx859s3f' },
    data: {
      price: 1230.00,
      images: JSON.stringify([
        'https://mobilestore.ec/wp-content/uploads/2024/12/PlayStation-5-Pro-Mobile-Store-Ecuador.jpg'
      ])
    }
  });

  console.log('✅ Producto actualizado:');
  console.log('   Nombre:', updated.name);
  console.log('   Nuevo Precio: $' + updated.price);
  console.log('   Nueva Imagen:', updated.images);
  await prisma.$disconnect();
}

main().catch(console.error);
