const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function simulateLogin() {
  const email = 'admin@atomic.local';
  const passwordToTry = 'Admin12345!';
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('Usuario no encontrado');
      return;
    }
    
    const isCorrect = await bcrypt.compare(passwordToTry, user.passwordHash);
    console.log(`¿Login correcto para ${email}?:`, isCorrect ? 'SÍ ✅' : 'NO ❌');
    
    if (isCorrect) {
      console.log('Estado del usuario:', user.status);
      console.log('Rol del usuario:', user.role);
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

simulateLogin();
