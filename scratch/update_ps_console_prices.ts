import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categoryId = 'cmsqsbjbj0000l9lbhbls3ag9'; // Mandos y consolas category

async function main() {
  // 1. Update PS4 Slim 1TB
  await prisma.product.update({
    where: { id: 'cmol4l2uz0001gemmo5s73h31' },
    data: { price: 300.00, name: 'PlayStation 4 Slim 1TB (Open Box)' }
  });
  console.log('✅ PS4 Slim 1TB (Open Box) -> $300.00');

  // 2. Update PS4 Pro 1TB
  await prisma.product.update({
    where: { id: 'cmol4l3et0003gemm4cbn7kuy' },
    data: { price: 370.00, name: 'PlayStation 4 Pro 1TB (Open Box)' }
  });
  console.log('✅ PS4 Pro 1TB (Open Box) -> $370.00');

  // 3. Update PS5 Slim Digital (Open Box)
  await prisma.product.update({
    where: { id: 'cmol4l3t30005gemmm16a616u' },
    data: { price: 560.00, name: 'PlayStation 5 Slim 1TB SSD (Open Box)' }
  });
  console.log('✅ PS5 Slim 1TB SSD (Open Box) -> $560.00');

  // 4. Check or Create PS5 De Paquete (Nueva)
  const ps5Nueva = await prisma.product.findFirst({
    where: { name: { contains: 'De Paquete', mode: 'insensitive' } }
  });

  if (ps5Nueva) {
    await prisma.product.update({
      where: { id: ps5Nueva.id },
      data: { price: 720.00 }
    });
    console.log(`✅ PS5 (De Paquete / Nueva) actualizada -> $720.00 (ID: ${ps5Nueva.id})`);
  } else {
    const created = await prisma.product.create({
      data: {
        name: 'PlayStation 5 1TB SSD (De Paquete / Nueva)',
        price: 720.00,
        stock: 10,
        isActive: true,
        isDeleted: false,
        categoryId,
        images: JSON.stringify([
          'https://m.media-amazon.com/images/I/619Bsw6fnDL._SL1500_.jpg'
        ]),
        description: `<p>Consola PlayStation®5 original 100% Nueva en caja sellada de fábrica (De Paquete). Disfruta de tiempos de carga ultrarápidos con un SSD de ultraalta velocidad, una inmersión más profunda con soporte para respuesta háptica, gatillos adaptativos y audio 3D.</p>`,
        specs: JSON.stringify({
          marca: 'Sony', plataforma: 'PlayStation 5', capacidad: '1TB SSD',
          estado: 'Nuevo De Paquete', garantia: '1 Año Oficial'
        }),
        keywords: 'playstation 5 ps5 consola de paquete nueva 1tb ssd sony'
      }
    });
    console.log(`✅ PS5 1TB SSD (De Paquete / Nueva) creada -> $720.00 (ID: ${created.id})`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
