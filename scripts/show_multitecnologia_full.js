const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function showFull() {
  const p1 = await prisma.product.findUnique({
    where: { id: "cmohfkahp00007phoue27d1q5" }
  });
  console.log("=== GAR159 (MultiTecnología) ===");
  console.log(p1);

  const p2 = await prisma.product.findUnique({
    where: { id: "cmohfkaz900017phoze8z01a9" }
  });
  console.log("=== GAR276 (MultiTecnología) ===");
  console.log(p2);
}

showFull().finally(async () => {
  await prisma.$disconnect();
});
