const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const FIXED_ACCOUNTS = [
  { name: 'Atomic', lastName: 'Admin', email: 'atomic@administrador.com', password: 'Admin123@', role: 'ADMIN', area: 'Administración' },
  { name: 'Tech', lastName: 'Man', email: 'atomic@techman.com', password: 'Patynico2019', role: 'MANAGEMENT', area: 'Tecnología' },
  { name: 'Soft', lastName: 'Man', email: 'atomic@softman.com', password: 'Blanca2026', role: 'MANAGEMENT', area: 'Software' },
  { name: 'Atomic', lastName: 'Coordinación', email: 'atomic@cordinacion.com', password: 'Admin123@', role: 'COORDINATOR', area: 'Coordinación' },
  { name: 'Atomic', lastName: 'Media', email: 'atomic@media.com', password: 'Admin123@', role: 'SALESPERSON', area: 'Media' },
]

async function main() {
  console.log('🚀 Seeding fixed accounts...\n')

  for (const account of FIXED_ACCOUNTS) {
    const existing = await prisma.user.findUnique({ where: { email: account.email } })

    if (existing) {
      // Update area and plainPassword if exists
      await prisma.user.update({
        where: { email: account.email },
        data: { 
          area: account.area, 
          plainPassword: account.password,
          role: account.role,
          status: 'ACTIVE',
          isActive: true
        }
      })
      console.log(`✓ Updated existing: ${account.email}`)
    } else {
      const passwordHash = await bcrypt.hash(account.password, 12)
      await prisma.user.create({
        data: {
          name: account.name,
          lastName: account.lastName,
          email: account.email,
          passwordHash,
          role: account.role,
          area: account.area,
          status: 'ACTIVE',
          isActive: true,
          canCreateBlogs: account.role === 'ADMIN' || account.role === 'MANAGEMENT',
          plainPassword: account.password,
        }
      })
      console.log(`✅ Created: ${account.email} (${account.role} / ${account.area})`)
    }
  }

  console.log('\n🎉 All fixed accounts ready!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
