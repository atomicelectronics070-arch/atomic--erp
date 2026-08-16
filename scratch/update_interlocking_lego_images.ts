import { prisma } from '../src/lib/prisma';

async function main() {
  const images = [
    "/interlocking-lego-render-1.jpg",
    "/interlocking-lego-render-2.jpg",
    "/interlocking-lego-render-3.jpg"
  ];

  const result = await prisma.product.updateMany({
    where: {
      OR: [
        { id: "cmqx9xiux000bvmyeoz3zzcd0" },
        { name: { contains: "INTERLOCKING", mode: "insensitive" } },
        { price: 50400 }
      ]
    },
    data: {
      images: JSON.stringify(images),
      featured: true,
      isActive: true
    }
  });

  console.log(`=== ACTUALIZADO PLANTA INTERLOCKING (TIPO LEGO) ($50,400) (${result.count} REGISTROS) ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
