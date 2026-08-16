import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  // Consolas
  { nameContains: 'PlayStation 5 Slim', image: 'https://m.media-amazon.com/images/I/51w77A19VfL._SL1500_.jpg' },
  { nameContains: 'PlayStation 4 Pro', image: 'https://m.media-amazon.com/images/I/71jN27RNxGL._SL1500_.jpg' },
  { nameContains: 'PlayStation 4 Slim', image: 'https://m.media-amazon.com/images/I/71PgWpD6WLL._SL1500_.jpg' },

  // Microcontroladores & Placas
  { nameContains: 'Arduino UNO', image: 'https://m.media-amazon.com/images/I/61c8v3SgB5L._SL1000_.jpg' },
  { nameContains: 'Arduino NANO', image: 'https://m.media-amazon.com/images/I/61x8+c+M-rL._SL1000_.jpg' },
  { nameContains: 'ESP32 + CAMARA', image: 'https://m.media-amazon.com/images/I/61S-bQ-bQOL._SL1200_.jpg' },
  { nameContains: 'ESP32', image: 'https://m.media-amazon.com/images/I/61Nvh6e7B1L._SL1500_.jpg' },
  { nameContains: 'PIC 16F877A', image: 'https://m.media-amazon.com/images/I/6182QzS65cL._SL1000_.jpg' },

  // Herramientas y Soldadura
  { nameContains: 'Multimetro grande', image: 'https://m.media-amazon.com/images/I/71X8k8Xq9yL._SL1500_.jpg' },
  { nameContains: 'Multimetro mediano', image: 'https://m.media-amazon.com/images/I/71Yc0c8uKFL._SL1500_.jpg' },
  { nameContains: 'Multimetro pequeño', image: 'https://m.media-amazon.com/images/I/61n96r1e0JL._SL1500_.jpg' },
  { nameContains: 'Cautin de madera', image: 'https://m.media-amazon.com/images/I/71ZpT9-7d8L._SL1500_.jpg' },
  { nameContains: 'Cautin indicador de luz', image: 'https://m.media-amazon.com/images/I/71ZpT9-7d8L._SL1500_.jpg' },
  { nameContains: 'Estaño para soldar grande', image: 'https://m.media-amazon.com/images/I/71E4uBqXffL._SL1500_.jpg' },

  // Componentes Electrónicos Populares
  { nameContains: 'Servomotor 90 grados', image: 'https://m.media-amazon.com/images/I/61o4c1Jq6dL._SL1000_.jpg' },
  { nameContains: 'Servomotor 180 grados', image: 'https://m.media-amazon.com/images/I/61o4c1Jq6dL._SL1000_.jpg' },
  { nameContains: 'HC-SR04', image: 'https://m.media-amazon.com/images/I/61u9u5GZSIL._SL1000_.jpg' },
  { nameContains: 'HC-06', image: 'https://m.media-amazon.com/images/I/61z-R9vXmLL._SL1000_.jpg' },
  { nameContains: 'LCD 16X2', image: 'https://m.media-amazon.com/images/I/61d7bJ8eO2L._SL1000_.jpg' },
  { nameContains: 'LCD 128x64', image: 'https://m.media-amazon.com/images/I/61-m5Kj21kL._SL1000_.jpg' },
  { nameContains: 'Protoboard 1 regleta', image: 'https://m.media-amazon.com/images/I/71hU2+Z-h4L._SL1500_.jpg' },
  { nameContains: 'Protoboard mini', image: 'https://m.media-amazon.com/images/I/61b7Ue2P0XL._SL1000_.jpg' },
  { nameContains: 'Jumpers macho-macho', image: 'https://m.media-amazon.com/images/I/71o0W1n2cBL._SL1200_.jpg' },
  { nameContains: 'Jumpers macho-hembra', image: 'https://m.media-amazon.com/images/I/71o0W1n2cBL._SL1200_.jpg' },
  { nameContains: 'Jumpers hembra-hembra', image: 'https://m.media-amazon.com/images/I/71o0W1n2cBL._SL1200_.jpg' },
  { nameContains: 'DHT-11', image: 'https://m.media-amazon.com/images/I/61c8v3SgB5L._SL1000_.jpg' },
  { nameContains: 'Teclado Matricial 4x4', image: 'https://m.media-amazon.com/images/I/61a7Sj2fF1L._SL1000_.jpg' },
];

async function main() {
  console.log('Iniciando actualización masiva de imágenes para productos clave...\n');
  let updatedCount = 0;

  for (const item of updates) {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        name: { contains: item.nameContains, mode: 'insensitive' }
      }
    });

    for (const p of products) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: JSON.stringify([item.image]) }
      });
      console.log(`✅ [${p.name}] -> Imagen cargada`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Total productos actualizados con imagen: ${updatedCount}`);
  await prisma.$disconnect();
}

main().catch(console.error);
