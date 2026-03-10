const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.update({
        where: { email: 'admin@atomicerp.com' },
        data: { passwordHash }
    });
    console.log('Password updated successfully for admin@atomicerp.com to admin123');
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
