import { prisma } from '../src/lib/prisma';

async function main() {
  const images = [
    "/qtj4-35-render-1.jpg",
    "/qtj4-35-render-2.jpg",
    "/qtj4-35-render-3.jpg"
  ];

  // Update QTJ4-35
  const qtj435 = await prisma.product.updateMany({
    where: {
      OR: [
        { id: "cmqx9xh4d0009vmyergrsu28p" },
        { name: { contains: "QTJ4-35", mode: "insensitive" } }
      ]
    },
    data: {
      images: JSON.stringify(images),
      featured: true,
      isActive: true
    }
  });

  console.log(`=== ACTUALIZADO QTJ4-35 (${qtj435.count} REGISTROS) ===`);

  // Also update QT4-35 if present
  const qt435 = await prisma.product.updateMany({
    where: {
      name: { contains: "QT4-35", mode: "insensitive" }
    },
    data: {
      images: JSON.stringify(images)
    }
  });

  console.log(`=== ACTUALIZADO QT4-35 (${qt435.count} REGISTROS) ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
