const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.user.count();
    console.log('Total usuarios en DB:', count);
    
    if (count > 0) {
      const users = await prisma.user.findMany({
        select: { email: true, role: true }
      });
      console.log('Lista de usuarios (emails):');
      users.forEach(u => console.log(` - ${u.email} [${u.role}]`));
    } else {
      console.log('⚠️ No hay usuarios en la base de datos!');
    }
  } catch (e) {
    console.error('Error al consultar usuarios:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
