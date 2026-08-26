const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  // 1. Search in prisma.product
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
        { description: { contains: 'Apple', mode: 'insensitive' } },
        { description: { contains: 'MacBook', mode: 'insensitive' } },
        { description: { contains: 'iPhone', mode: 'insensitive' } }
      ]
    },
    include: {
      category: true
    }
  });

  console.log(`\n=== 1. PRISMA.PRODUCT (Total: ${products.length}) ===`);
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.provider || 'DB'}] ${p.name} | $${p.price} | Cat: ${p.category?.name || 'N/A'}`);
  });

  // 2. Check if there are other models/tables like ScrapedProduct or similar in Prisma schema
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  const models = [...schema.matchAll(/model\s+(\w+)\s+{/g)].map(m => m[1]);
  console.log('\n=== 2. PRISMA MODELS AVAILABLE ===', models);

  // 3. Search in all scratch files or JSON files for Apple products
  const jsonFiles = fs.readdirSync('.').filter(f => f.endsWith('.json'));
  console.log('\n=== 3. JSON FILES IN REPO ===', jsonFiles);
  for (const jf of jsonFiles) {
    try {
      const data = fs.readFileSync(jf, 'utf8');
      if (data.includes('MacBook') || data.includes('iPhone') || data.includes('Apple') || data.includes('iPad')) {
        console.log(`  - Found Apple references in: ${jf}`);
      }
    } catch (e) {}
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
