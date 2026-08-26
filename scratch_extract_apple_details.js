const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'Apple', mode: 'insensitive' } },
        { name: { contains: 'MacBook', mode: 'insensitive' } },
        { name: { contains: 'iPhone', mode: 'insensitive' } },
        { name: { contains: 'iPad', mode: 'insensitive' } },
        { name: { contains: 'iMac', mode: 'insensitive' } },
        { name: { contains: 'AirPods', mode: 'insensitive' } },
        { name: { contains: 'Apple Watch', mode: 'insensitive' } },
        { name: { contains: 'Mac mini', mode: 'insensitive' } },
        { name: { contains: 'Mac Studio', mode: 'insensitive' } },
        { name: { contains: 'Airtag', mode: 'insensitive' } },
        { name: { contains: 'Apple Pencil', mode: 'insensitive' } }
      ]
    },
    include: {
      category: true
    },
    orderBy: {
      price: 'desc'
    }
  });

  console.log(`Total Apple products found: ${products.length}`);
  fs.writeFileSync('scratch_apple_products_raw.json', JSON.stringify(products, null, 2));

  // Categorize
  const macs = products.filter(p => /macbook|mac mini|mac studio|imac/i.test(p.name));
  const iphones = products.filter(p => /iphone/i.test(p.name));
  const ipads = products.filter(p => /ipad|pencil/i.test(p.name) && !/docking|case|protector/i.test(p.name));
  const watches = products.filter(p => /watch/i.test(p.name));
  const audio = products.filter(p => /airpods/i.test(p.name));
  const accessories = products.filter(p => /airtag|cable|cargador|magsafe|finder|case|protector/i.test(p.name) || (!macs.includes(p) && !iphones.includes(p) && !ipads.includes(p) && !watches.includes(p) && !audio.includes(p)));

  console.log(`\nBreakdown:`);
  console.log(`- MacBooks & Macs: ${macs.length}`);
  console.log(`- iPhones: ${iphones.length}`);
  console.log(`- iPads: ${ipads.length}`);
  console.log(`- Apple Watches: ${watches.length}`);
  console.log(`- AirPods & Audio: ${audio.length}`);
  console.log(`- Accesorios & Ecosistema: ${accessories.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
