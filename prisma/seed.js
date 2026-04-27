const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@atomicerp.com'
    const password = await bcrypt.hash('atomic2026 Admin!', 10)

    // 1. Ensure Admin User
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!existingAdmin) {
        const adminUser = await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Super Admin',
                lastName: 'Atomic',
                cedula: '0000000000',
                passwordHash: password,
                role: 'ADMIN',
                status: 'APPROVED',
                profileData: 'System Administrator',
            }
        })
        console.log(`Admin user created: ${adminUser.email}`)
    }

    // 2. Initial Academy Categories
    const categories = [
        { name: 'Seguridad Electrónica', slug: 'seguridad-electronica', description: 'Cursos sobre cámaras, alarmas y control de acceso.' },
        { name: 'Redes y Telecomunicaciones', slug: 'redes-telecom', description: 'Configuración de routers, switches y fibra óptica.' },
        { name: 'Software ERP', slug: 'software-erp', description: 'Capacitación en el uso y gestión de Atomic ERP.' }
    ]

    for (const cat of categories) {
        await prisma.academyCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        })
    }
    console.log('Academy categories initialized.')

    // 3. Global Social Settings Placeholder
    const existingSocial = await prisma.socialSettings.findFirst({
        where: { userId: null }
    })

    if (!existingSocial) {
        await prisma.socialSettings.create({
            data: {
                userId: null,
                metaPageId: 'PLACEHOLDER',
                metaPageToken: 'PLACEHOLDER'
            }
        })
        console.log('Global social settings placeholder created.')
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
