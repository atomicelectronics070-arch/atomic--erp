const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      status: true,
      isActive: true,
      phoneNumber: true,
      cedula: true,
      createdAt: true
    },
    orderBy: { role: 'asc' }
  });
  console.log("TOTAL_USERS:" + users.length);
  console.table(users.map(u => ({
    Email: u.email,
    Nombre: `${u.name || ''} ${u.lastName || ''}`.trim(),
    Rol: u.role,
    Estado: u.status,
    Activo: u.isActive ? 'SI' : 'NO',
    Telefono: u.phoneNumber || 'N/A',
    Cedula: u.cedula || 'N/A'
  })));
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
