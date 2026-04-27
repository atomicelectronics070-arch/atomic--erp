const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
  const email = 'admin@atomic.local';
  const newPassword = 'Admin12345!';
  
  try {
    console.log(`Intentando resetear contraseña para: ${email}...`);
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    const user = await prisma.user.update({
      where: { email: email },
      data: { passwordHash: hash }
    });
    
    console.log(`✅ Contraseña de ${email} actualizada correctamente.`);
    console.log(`👉 Ahora puedes entrar con: ${newPassword}`);

  } catch (e) {
    console.error('❌ Error al resetear contraseña:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
