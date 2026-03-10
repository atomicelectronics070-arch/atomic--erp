const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });
    console.log('ADMIN_USER:', JSON.stringify(user));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
