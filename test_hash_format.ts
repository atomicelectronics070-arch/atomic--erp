import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
    console.log("Checking hash formats...");
    const users = await prisma.user.findMany({
        take: 3,
        select: { email: true, passwordHash: true }
    })
    users.forEach(u => {
        console.log(`User: ${u.email}, Hash starts with: ${u.passwordHash?.substring(0, 10)}`)
    })
}

run().catch(err => console.error(err)).finally(() => prisma.$disconnect())
