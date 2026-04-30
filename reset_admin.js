const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
    const hash = await bcrypt.hash('Admin123!', 10);
    const user = await prisma.user.update({
        where: { email: 'adminindustrias.atomic@correo.ec' },
        data: { email: 'atomic@industrias.ec', passwordHash: hash }
    });
    console.log('✅ Credenciales actualizadas para:', user.email);
    await prisma.$disconnect();
}

run();
