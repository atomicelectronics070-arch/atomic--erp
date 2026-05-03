
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function findDuplicates() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          conversations: true,
          transactions: true,
          clients: true
        }
      }
    }
  })

  const emailMap = new Map()
  const nameMap = new Map()
  const duplicates: any[] = []

  users.forEach(user => {
    const email = user.email.toLowerCase()
    const name = (user.name || '').toLowerCase().trim()

    if (emailMap.has(email)) {
      duplicates.push({ type: 'EMAIL', original: emailMap.get(email), duplicate: user })
    } else {
      emailMap.set(email, user)
    }

    if (name && nameMap.has(name)) {
        duplicates.push({ type: 'NAME', original: nameMap.get(name), duplicate: user })
    } else {
        nameMap.set(name, user)
    }
  })

  console.log('--- AUDITORÍA DE PERFILES DUPLICADOS ---')
  if (duplicates.length === 0) {
    console.log('No se encontraron duplicados exactos por email o nombre.')
  } else {
    duplicates.forEach((d, i) => {
      console.log(`\nGRUPO ${i + 1} (${d.type}):`)
      console.log(`Perfil A: ${d.original.name} (${d.original.email}) | ID: ${d.original.id}`)
      console.log(`   - Cotizaciones: ${d.original._count.conversations} | Ventas: ${d.original._count.transactions} | Clientes: ${d.original._count.clients}`)
      console.log(`Perfil B: ${d.duplicate.name} (${d.duplicate.email}) | ID: ${d.duplicate.id}`)
      console.log(`   - Cotizaciones: ${d.duplicate._count.conversations} | Ventas: ${d.duplicate._count.transactions} | Clientes: ${d.duplicate._count.clients}`)
    })
  }
}

findDuplicates()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
