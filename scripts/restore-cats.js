const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = [
    { name: 'Software & Desarrollo', slug: 'software-desarrollo' },
    { name: 'Automatización Inteligente', slug: 'automatizacion-inteligente' },
    { name: 'Gaming & Consolas', slug: 'gaming-consolas' },
    { name: 'SOFT3 Logistics', slug: 'soft3-logistics' }
  ];

  for (const c of cats) {
    try {
      console.log(`Processing: ${c.name}...`);
      // Use raw SQL to bypass Prisma Client model checks for missing columns
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Category" (id, name, slug, "isVisible", "updatedAt")
        VALUES ($1, $2, $3, true, NOW())
        ON CONFLICT (slug) DO UPDATE SET "isVisible" = true, "updatedAt" = NOW();
      `, `cat-${c.slug}`, c.name, c.slug);
      console.log(`- ${c.name} (Slug: ${c.slug}) restored/updated via Raw SQL.`);
    } catch (err) {
       console.error(`Error with ${c.name}:`, err);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
