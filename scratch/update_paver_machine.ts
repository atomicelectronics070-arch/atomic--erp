import { prisma } from '../src/lib/prisma';

async function main() {
  const images = [
    "/formadora-adoquines-render-1.jpg",
    "/formadora-adoquines-render-2.jpg",
    "/formadora-adoquines-render-3.jpg"
  ];

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: "ADOQUINES", mode: "insensitive" } },
        { name: { contains: "FORMADORA DE ADOQUINES", mode: "insensitive" } },
        { price: 7000 }
      ]
    }
  });

  console.log("=== PRODUCTOS DE ADOQUINES ENCONTRADOS ===");
  console.log(JSON.stringify(products, null, 2));

  const result = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: "ADOQUINES", mode: "insensitive" } },
        { price: 7000 }
      ]
    },
    data: {
      images: JSON.stringify(images),
      featured: true,
      isActive: true
    }
  });

  console.log(`=== ACTUALIZADO MÁQUINA DE ADOQUINES ($7,000) (${result.count} REGISTROS) ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
