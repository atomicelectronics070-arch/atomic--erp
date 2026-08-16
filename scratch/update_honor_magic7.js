const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.product.update({
    where: { id: 'cms6h0j230001gnc4rnxmicy8' },
    data: {
      name: 'CELULAR HONOR MAGIC 7 LITE 5G 8GB RAM 256GB / 512GB BATERÍA 6600MAH CÁMARA 108MP',
      images: JSON.stringify([
        'https://m.media-amazon.com/images/I/71Y3iV3B7SL._AC_SL1500_.jpg',
        'https://m.media-amazon.com/images/I/61N+V8dF-mL._AC_SL1500_.jpg',
        'https://www.importadoracel.com/wp-content/uploads/2025/02/Importadora-Cel-Honor-Magic-7-Lite-1.jpg'
      ])
    }
  });

  console.log('✅ ACTUALIZADO HONOR MAGIC 7 LITE EN BD:');
  console.log('ID:', updated.id);
  console.log('Nombre:', updated.name);
  console.log('Precio:', updated.price);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
