import { prisma } from '../src/lib/prisma';

async function main() {
  const images = [
    "/maquina-ladrillos-automatica-render-1.jpg",
    "/maquina-ladrillos-automatica-render-2.jpg",
    "/maquina-ladrillos-automatica-render-3.jpg"
  ];

  const result = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: "FABRICACIÓN DE LADRILLOS", mode: "insensitive" } },
        { name: { contains: "LADRILLOS DE HORMIGÓN", mode: "insensitive" } },
        { price: 70000 }
      ]
    },
    data: {
      images: JSON.stringify(images),
      featured: true,
      isActive: true
    }
  });

  console.log(`=== ACTUALIZADO MÁQUINA DE LADRILLOS AUTOMÁTICA ($70,000) (${result.count} REGISTROS) ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
