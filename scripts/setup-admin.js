const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@atomic.local';
    const password = 'Admin12345!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email: email },
        update: {
            passwordHash: hashedPassword,
            status: 'APPROVED',
            role: 'ADMIN'
        },
        create: {
            email: email,
            name: 'Administrador Matriz',
            passwordHash: hashedPassword,
            role: 'ADMIN',
            status: 'APPROVED',
            profileData: 'Administrador Global del Sistema',
            aspirations: 'Control Total',
            availability: '24/7'
        },
    });

    console.log('Usuario de administración actualizado/creado exitosamente:');
    console.log(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
    }, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
