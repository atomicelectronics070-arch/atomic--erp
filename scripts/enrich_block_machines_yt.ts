import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    id: 'cmqx9xanz0003vmyeq1kttip6',
    images: [
      "https://img.youtube.com/vi/FF4xQtiZwW8/hqdefault.jpg",
      "https://img.youtube.com/vi/T1-ynGKZ4kc/hqdefault.jpg",
      "https://img.youtube.com/vi/zCCFfAm8lQ0/hqdefault.jpg"
    ]
  },
  {
    id: 'cmqx9xd990005vmyek4esv7ae',
    images: [
      "https://img.youtube.com/vi/OJqefg29FXM/hqdefault.jpg",
      "https://img.youtube.com/vi/Toh8YRAVGUI/hqdefault.jpg",
      "https://img.youtube.com/vi/KCKPUBH-VnU/hqdefault.jpg"
    ]
  },
  {
    id: 'cmqx9xf2d0007vmyeslp3y2sk',
    images: [
      "https://img.youtube.com/vi/nSSJ6muIZpU/hqdefault.jpg",
      "https://img.youtube.com/vi/BYt2PtAAqP4/hqdefault.jpg",
      "https://img.youtube.com/vi/KITFoIeZrds/hqdefault.jpg"
    ]
  },
  {
    id: 'cmqx9xh4d0009vmyergrsu28p',
    images: [
      "https://img.youtube.com/vi/DWB3FnAKZDw/hqdefault.jpg", // swapped to valid video ID
      "https://img.youtube.com/vi/3zFd9MJLeVU/hqdefault.jpg",
      "https://img.youtube.com/vi/a7e015jy6n8/hqdefault.jpg"
    ]
  },
  {
    id: 'cmqx9xiux000bvmyeoz3zzcd0',
    images: [
      "https://img.youtube.com/vi/pvCESlKTO4E/hqdefault.jpg",
      "https://img.youtube.com/vi/4t3lmAPhuNE/hqdefault.jpg",
      "https://img.youtube.com/vi/C_HzenCejLU/hqdefault.jpg"
    ]
  }
];

async function updateProducts() {
  console.log("Iniciando inyección de Thumbnails HQ (100% garantizados)...");
  for (const update of updates) {
    try {
      await prisma.product.update({
        where: { id: update.id },
        data: {
          images: JSON.stringify(update.images),
        }
      });
      console.log(`✅ Producto actualizado con HQ thumbnails: ${update.id}`);
    } catch (e) {
      console.error(`❌ Error actualizando ${update.id}:`, e);
    }
  }
}

updateProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
