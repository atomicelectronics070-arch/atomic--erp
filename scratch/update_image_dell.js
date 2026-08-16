const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.product.update({
    where: { id: 'cmolsmu0l007h4w81sh2lemjp' },
    data: {
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000',
        '/images/products/dell-aio-27.jpg'
      ])
    }
  });

  console.log('SUCCESSFULLY REORDERED IMAGES FOR DELL 27 AIO:');
  console.log(updated.images);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
