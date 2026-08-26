const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function deepSearch() {
  console.log('=== SEARCHING FOR GENUINE SMART LOCKS IN OTHER SUPPLIERS ===');

  const lockTerms = ['cerradura', 'chapa digital', 'chapa inteligente', 'cerrojo digital', 'smart lock', 'shome-14', 'shome-15', 'shome-16', 'shome-18', 'ttlock', 'tuya lock'];

  const results = await prisma.product.findMany({
    where: {
      OR: lockTerms.map(term => ({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } }
        ]
      })),
      NOT: {
        OR: [
          { name: { contains: 'cable', mode: 'insensitive' } },
          { name: { contains: 'bateria', mode: 'insensitive' } },
          { name: { contains: 'batería', mode: 'insensitive' } },
          { name: { contains: 'regulador', mode: 'insensitive' } },
          { name: { contains: 'panel', mode: 'insensitive' } },
          { name: { contains: 'gabinete', mode: 'insensitive' } },
          { name: { contains: 'inversor', mode: 'insensitive' } }
        ]
      }
    },
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      provider: true,
      images: true
    }
  });

  console.log(`Found ${results.length} authentic lock items across all providers:`);
  results.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.provider || 'N/A'}] SKU: ${r.sku || 'N/A'} - ${r.name} ($${r.price})`);
  });
}

deepSearch().catch(console.error).finally(() => process.exit(0));
