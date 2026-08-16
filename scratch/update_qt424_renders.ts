import { prisma } from '../src/lib/prisma';

async function main() {
  const images = [
    "/qt4-24-render-1.jpg",
    "/qt4-24-render-2.jpg",
    "/qt4-24-render-3.jpg",
    "/qt4-24-render-4.jpg",
    "/qt4-24-render-5.jpg"
  ];

  const result = await prisma.product.updateMany({
    where: {
      OR: [
        { id: "cmsh4la220001ziat0fowwlmz" },
        { name: { contains: "QT4-24", mode: "insensitive" } }
      ]
    },
    data: {
      images: JSON.stringify(images),
      featured: true,
      isActive: true
    }
  });

  console.log(`=== ACTUALIZADO QT4-24 CON 5 RENDERS 4K (${result.count} REGISTROS) ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
