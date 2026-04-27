import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
    console.log("Fetching emails from DB...");
    const users = await prisma.user.findMany({
        take: 5,
        select: { email: true }
    })
    console.log("Emails found:", users.map(u => u.email))
}

run().catch(err => console.error(err)).finally(() => prisma.$disconnect())
