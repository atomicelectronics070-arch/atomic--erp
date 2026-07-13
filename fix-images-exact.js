const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const updates = [
    {
      id: "cmrjinksy0002ualbrl78z8ky", // Rojo 1 metro
      images: ["https://yale.com.ec/wp-content/uploads/2026/05/BarraAntipanicoMiamide1Punto.webp"]
    },
    {
      id: "cmrjinl7t0003ualbqd1mtm5t", // Toallero
      images: ["https://yale.com.ec/wp-content/uploads/2025/09/Yale-Productos_7.webp"]
    },
    {
      id: "cmrjinmiz0006ualb1cheacfk", // Manija Eiffel
      images: ["https://yale.com.ec/wp-content/uploads/2023/11/Eiffel_2.png"]
    },
    {
      id: "cmrjinjxb0000ualbbs7lu7df", // 60cm push
      images: ["https://cronte.net/wp-content/uploads/2023/10/OU-BF65N-2.jpeg"]
    },
    {
      id: "cmrjinkdp0001ualbb36iz08r", // 100cm push
      images: ["https://cronte.net/wp-content/uploads/2023/10/1-24.png"]
    },
    {
      id: "cmrjinlmh0004ualbem97yzxu", // Vertical 3 Puntos 1000cm
      images: ["https://cronte.net/wp-content/uploads/2023/10/2-22.png"]
    },
    {
      id: "cmrjinm2i0005ualbjx0msa6x", // Vertical 3 Puntos
      images: ["https://cronte.net/wp-content/uploads/2023/10/2-22.png"]
    }
  ];

  for (const item of updates) {
    await prisma.product.update({
      where: { id: item.id },
      data: { images: JSON.stringify(item.images) }
    });
    console.log("Updated images for:", item.id);
  }
}

run();
