const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Chimera stats
  const chimeraTotal = await prisma.product.count({
    where: {
      OR: [
        { name: { contains: 'chimera', mode: 'insensitive' } },
        { provider: { contains: 'chimera', mode: 'insensitive' } }
      ]
    }
  });

  const chimeraDeleted = await prisma.product.count({
    where: {
      isDeleted: true,
      OR: [
        { name: { contains: 'chimera', mode: 'insensitive' } },
        { provider: { contains: 'chimera', mode: 'insensitive' } }
      ]
    }
  });

  console.log('Chimera Total:', chimeraTotal);
  console.log('Chimera Deleted:', chimeraDeleted);

  // Banco del Perno stats
  const pernoTotal = await prisma.product.count({
    where: {
      OR: [
        { name: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'banco del perno', mode: 'insensitive' } }
      ]
    }
  });

  const pernoDeleted = await prisma.product.count({
    where: {
      isDeleted: true,
      OR: [
        { name: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'banco del perno', mode: 'insensitive' } }
      ]
    }
  });

  const pernoActive = await prisma.product.count({
    where: {
      isDeleted: false,
      isActive: true,
      OR: [
        { name: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'banco del perno', mode: 'insensitive' } }
      ]
    }
  });

  const pernoInactive = await prisma.product.count({
    where: {
      isDeleted: false,
      isActive: false,
      OR: [
        { name: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'perno', mode: 'insensitive' } },
        { provider: { contains: 'banco del perno', mode: 'insensitive' } }
      ]
    }
  });

  console.log('Perno Total:', pernoTotal);
  console.log('Perno Deleted (Papelera):', pernoDeleted);
  console.log('Perno Active (Visible):', pernoActive);
  console.log('Perno Inactive (Oculto):', pernoInactive);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
