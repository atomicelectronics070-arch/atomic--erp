const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("=== EXTENDED SEARCH FOR ALL TORNIQUETES & ACCESS CONTROL GATES (INCLUDING DELETED & INACTIVE) ===");

  const allProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'torniquete', mode: 'insensitive' } },
        { name: { contains: 'molinete', mode: 'insensitive' } },
        { name: { contains: 'turnstile', mode: 'insensitive' } },
        { name: { contains: 'flap', mode: 'insensitive' } },
        { name: { contains: 'swing', mode: 'insensitive' } },
        { name: { contains: 'peatonal', mode: 'insensitive' } },
        { name: { contains: 'acceso', mode: 'insensitive' } },
        { description: { contains: 'torniquete', mode: 'insensitive' } },
        { description: { contains: 'molinete', mode: 'insensitive' } },
        { description: { contains: 'peatonal', mode: 'insensitive' } }
      ]
    },
    include: { category: true }
  });

  console.log(`Total found across all statuses: ${allProducts.length}`);

  const torniquetesOnly = allProducts.filter(p => {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    return name.includes('torniquete') || desc.includes('torniquete') || name.includes('molinete') || desc.includes('molinete') || name.includes('turnstile') || desc.includes('turnstile') || name.includes('peatonal') || desc.includes('peatonal');
  });

  console.log(`\nFiltered Torniquetes/Molinetes/Peatonal count: ${torniquetesOnly.length}`);
  torniquetesOnly.forEach(p => {
    console.log(`- ID: ${p.id} | SKU: ${p.sku} | Price: $${p.price} | Stock: ${p.stock} | Active: ${p.isActive} | Deleted: ${p.isDeleted} | Name: "${p.name}"`);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
