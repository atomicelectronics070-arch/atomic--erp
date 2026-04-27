const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, status: true, role: true }
    });
    console.log('--- ESTADO DE USUARIOS ---');
    users.forEach(u => {
      console.log(`${u.email}: [${u.status || 'SIN ESTADO'}] - Rol: ${u.role}`);
    });
    
    const countInvalid = users.filter(u => u.status !== 'APPROVED' && u.status !== 'ACTIVE').length;
    console.log(`\nUsuarios que no pueden entrar: ${countInvalid}`);

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
