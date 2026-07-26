import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ids = [
    'cmqx9xanz0003vmyeq1kttip6',
    'cmqx9xd990005vmyek4esv7ae',
    'cmqx9xf2d0007vmyeslp3y2sk',
    'cmqx9xh4d0009vmyergrsu28p',
    'cmqx9xiux000bvmyeoz3zzcd0'
  ];

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, images: true, description: true }
  });

  for (const p of products) {
    console.log(`\nID: ${p.id}\nName: ${p.name}\nImages: ${JSON.stringify(p.images)}\nDesc: ${p.description}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
