const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@atomicerp.com'
    const password = await bcrypt.hash('atomic2026 Admin!', 10)

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!existingAdmin) {
        const adminUser = await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Super Admin',
                passwordHash: password,
                role: 'ADMIN',
                status: 'APPROVED',
                profileData: 'System Administrator',
                aspirations: 'Maintain the platform',
                availability: '24/7'
            }
        })
        console.log(`Admin user created: ${adminUser.email}`)
    } else {
        console.log(`Admin user already exists.`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
