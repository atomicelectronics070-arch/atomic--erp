import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categoryNames = [
  "Redes", 
  "Hogar", 
  "Tecnología Residencial", 
  "Celulares", 
  "Computación", 
  "Tecnología de Consumo", 
  "Ferretería", 
  "Acabados", 
  "Seguridad Emergente", 
  "Vigilancia", 
  "Software", 
  "Automatización", 
  "Gaming y Consolas", 
  "Cableado", 
  "Deportes", 
  "Impresoras", 
  "Iluminación", 
  "Intercomunicación", 
  "Acceso Vehicular", 
  "Acceso Peatonal", 
  "Autos Eléctricos", 
  "Servicio"
]

async function main() {
  console.log('🌱 Seed starting...')
  
  for (const name of categoryNames) {
    const slug = name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    await prisma.category.upsert({
      where: { slug },
      update: { name, isVisible: true },
      create: { 
        name, 
        slug, 
        isVisible: true,
        description: `Soluciones profesionales en ${name} para el ecosistema ATOMIC.`,
      },
    })
    console.log(`✅ Category: ${name}`)
  }

  console.log('🌲 Seed finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
