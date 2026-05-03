
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function deleteEmptyUsers() {
  const idsToDelete = [
    'cmmfoabs40006riyj6sw14b94', // gabyyycitap@gmail.com
    'cmmfnldyh0003riyj3ui9zkkc', // penafieljose989@gmail.com
    'cmmfn2cxu0000riyjxnz1lz07'  // juanguzman7100@gmail.com
  ]

  console.log('--- INICIANDO LIMPIEZA DE PERFILES VACÍOS ---')

  for (const id of idsToDelete) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
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

        if (!user) {
            console.log(`[!] Usuario con ID ${id} no encontrado. Saltando...`)
            continue
        }

        const totalData = user._count.conversations + user._count.transactions + user._count.clients
        
        if (totalData === 0) {
            console.log(`[✓] Borrando ${user.name} (${user.email})... (Confirmado 0 datos)`)
            await prisma.user.delete({ where: { id } })
        } else {
            console.log(`[X] ¡ALERTA! El usuario ${user.name} tiene ${totalData} registros. NO SE BORRARÁ por seguridad.`)
        }
    } catch (e: any) {
        console.error(`Error borrando ID ${id}:`, e.message)
    }
  }

  console.log('--- LIMPIEZA COMPLETADA ---')
}

deleteEmptyUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
