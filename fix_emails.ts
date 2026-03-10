import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log("Found", users.length, "users")

    for (const user of users) {
        const lowerEmail = user.email.toLowerCase()
        if (user.email !== lowerEmail) {
            console.log(`Updating ${user.email} -> ${lowerEmail}`)
            try {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { email: lowerEmail }
                })
            } catch (e) {
                console.error("Failed to update user", e)
            }
        } else {
            console.log(`User ${user.email} is already lowercase. Status: ${user.status}, Role: ${user.role}`)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
