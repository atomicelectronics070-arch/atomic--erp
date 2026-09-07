const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'supervisor@atomic.com.ec';
  const password = 'atomic2026';
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Supervisor de Calidad',
      role: 'ADMIN', // Darle acceso total de administración y supervisión
      status: 'ACTIVE',
      isActive: true,
      passwordHash: hash
    },
    create: {
      email,
      name: 'Supervisor de Calidad',
      role: 'ADMIN',
      status: 'ACTIVE',
      isActive: true,
      passwordHash: hash
    }
  });

  console.log('SUPERVISOR USER READY:');
  console.log({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    isActive: user.isActive,
    password: password
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
