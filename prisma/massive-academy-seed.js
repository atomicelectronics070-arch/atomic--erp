const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Iniciando Carga Masiva del Ecosistema Académico Atomic...')

    const categoriesData = [
        { name: 'Electrónica de Placas', slug: 'electronica-placas', desc: 'Reparación a nivel de componentes, micro-soldadura y diagnóstico.' },
        { name: 'Arquitectura de Redes', slug: 'arquitectura-redes', desc: 'Diseño e implementación de infraestructuras de red escalables.' },
        { name: 'Programación', slug: 'programacion', desc: 'Desarrollo de software, algoritmos y lógica de programación.' },
        { name: 'Ciberseguridad', slug: 'cyber-seguridad', desc: 'Protección de infraestructuras, hacking ético y defensa digital.' },
        { name: 'Desarrollo Front-end', slug: 'frontend-dev', desc: 'Creación de interfaces modernas, React, Next.js y diseño UI/UX.' },
        { name: 'Servicios Especializados', slug: 'servicios', desc: 'Gestión de servicios técnicos y atención profesional.' },
        { name: 'Ventas Básicas en Línea', slug: 'ventas-online', desc: 'E-commerce, marketing digital y estrategias de venta.' },
        { name: 'Seguridad Digital', slug: 'seguridad-digital', desc: 'Protección de datos personales y privacidad en la red.' },
        { name: 'Tecnología Residencial', slug: 'domotica-residencial', desc: 'Smart Home, automatización de hogares y confort.' },
        { name: 'Reparación de Celulares', slug: 'reparacion-celulares', desc: 'Servicio técnico especializado en dispositivos móviles.' },
        { name: 'Reparación de Laptops', slug: 'reparacion-laptops', desc: 'Mantenimiento y reparación de equipos portátiles.' },
        { name: 'Generadores y Energía', slug: 'energia-respaldo', desc: 'Sistemas de respaldo, UPS y generadores eléctricos.' },
        { name: 'Automatización Industrial', slug: 'automatizacion', desc: 'Control de procesos, PLC y sistemas inteligentes.' },
        { name: 'Accesos Vehiculares y Peatonales', slug: 'control-accesos', desc: 'Barreras, motores de garaje y sistemas biométricos.' },
        { name: 'Pilotaje de Drones', slug: 'drones', desc: 'Vuelo profesional, normativa y captura de datos aéreos.' },
        { name: 'Deportes y Alto Rendimiento', slug: 'deportes', desc: 'Entrenamiento técnico y disciplinas deportivas.' },
        { name: 'Telecomunicaciones', slug: 'telecomunicaciones', desc: 'Sistemas de radio, antenas y transmisión de datos.' }
    ]

    for (const cat of categoriesData) {
        const category = await prisma.academyCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.desc },
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.desc,
                image: `https://source.unsplash.com/featured/?${cat.slug.replace('-', ',')}`
            }
        })
        console.log(`✅ Categoría: ${cat.name}`)

        // Create a Starter Course for each category
        await prisma.course.upsert({
            where: { slug: `intro-${cat.slug}` },
            update: {},
            create: {
                title: `Introducción a ${cat.name}`,
                slug: `intro-${cat.slug}`,
                description: `Módulo fundamental para dominar los conceptos básicos de ${cat.name}.`,
                imageUrl: `https://source.unsplash.com/featured/?technology,${cat.slug.split('-')[0]}`,
                categoryId: category.id,
                published: true
            }
        })
    }

    console.log('✨ Ecosistema Académico Atomic actualizado con éxito.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
