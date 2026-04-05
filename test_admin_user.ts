import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
    const user = await prisma.user.findUnique({
        where: { email: "admin@atomic.local" }
    })
    if (user) {
        console.log(`User admin@atomic.local FOUND. Hash: ${user.passwordHash?.substring(0, 30)}...`)
    } else {
        const users = await prisma.user.findMany({ select: { email: true } })
        console.log("User admin@atomic.local NOT FOUND. Total users:", users.length)
        console.log("Emails in DB:", users.map(u => u.email).join(", "))
    }
}

run().catch(err => console.error(err)).finally(() => prisma.$disconnect())
