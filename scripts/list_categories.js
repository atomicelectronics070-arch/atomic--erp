const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCats() {
  const cats = await prisma.category.findMany();
  console.log(`Total categories: ${cats.length}`);
  cats.forEach(c => console.log(c.id, '|', c.slug, '|', c.name));
}

checkCats().finally(async () => {
  await prisma.$disconnect();
});
