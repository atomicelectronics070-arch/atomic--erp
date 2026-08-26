
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- SEEDING SENSEFACE 2A AND EZVIZ H6C TO PRISMA DB ---");
  
  const p1 = await prisma.product.upsert({
    where: { id: 'zkteco-senseface-2a-official' },
    update: {
      name: 'CONTROL DE ACCESO BIOMÉTRICO ZKTECO SENSEFACE 2A (RECONOCIMIENTO FACIAL 3D + HUELLA + RFID)',
      price: 249.99,
      category: 'Seguridad & Control de Accesos',
      image: '/assets/portero/portero2.jpeg',
      description: 'Terminal biométrica de control de accesos ZKTeco SenseFace 2A con reconocimiento facial 3D ultra-rápido (<0.35s), huella dactilar, lector de tarjetas RFID/Mifare y control de electroimanes.'
    },
    create: {
      id: 'zkteco-senseface-2a-official',
      name: 'CONTROL DE ACCESO BIOMÉTRICO ZKTECO SENSEFACE 2A (RECONOCIMIENTO FACIAL 3D + HUELLA + RFID)',
      price: 249.99,
      category: 'Seguridad & Control de Accesos',
      image: '/assets/portero/portero2.jpeg',
      description: 'Terminal biométrica de control de accesos ZKTeco SenseFace 2A con reconocimiento facial 3D ultra-rápido (<0.35s), huella dactilar, lector de tarjetas RFID/Mifare y control de electroimanes.'
    }
  });

  const p2 = await prisma.product.upsert({
    where: { id: 'ezviz-h6c-2k-official' },
    update: {
      name: 'CÁMARA DE SEGURIDAD SMART WI-FI EZVIZ H6C 2K / 4MP (PANORÁMICA 360° + AUDIO BIDIRECCIONAL)',
      price: 49.99,
      category: 'Seguridad & Cámaras IP',
      image: '/images/hero-3d/slide-2.jpg',
      description: 'Cámara de vigilancia inteligente EZVIZ H6c con resolución 2K/4MP, visión panorámica 360° motorizada, seguimiento humano automático con IA, visión nocturna y audio bidireccional.'
    },
    create: {
      id: 'ezviz-h6c-2k-official',
      name: 'CÁMARA DE SEGURIDAD SMART WI-FI EZVIZ H6C 2K / 4MP (PANORÁMICA 360° + AUDIO BIDIRECCIONAL)',
      price: 49.99,
      category: 'Seguridad & Cámaras IP',
      image: '/images/hero-3d/slide-2.jpg',
      description: 'Cámara de vigilancia inteligente EZVIZ H6c con resolución 2K/4MP, visión panorámica 360° motorizada, seguimiento humano automático con IA, visión nocturna y audio bidireccional.'
    }
  });

  console.log("Upserted Product 1:", p1.name);
  console.log("Upserted Product 2:", p2.name);
}

main().catch(e => {
  console.error("Seeding Error:", e);
}).finally(() => {
  prisma.$disconnect();
});
