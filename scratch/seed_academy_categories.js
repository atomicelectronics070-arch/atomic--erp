const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log("Iniciando carga de nuevas categorías extendidas para la Academia...")

    const categoriesData = [
        {
            name: "Microelectrónica y Placas Base",
            slug: "microelectronica",
            description: "Análisis, diagnóstico y soldadura SMD/BGA de tarjetas electrónicas, placas lógicas y circuitería a nivel componente.",
            courses: []
        },
        {
            name: "Arquitectura y Redes Avanzadas",
            slug: "arquitectura-redes",
            description: "Cableado estructurado, fibra óptica, certificación de redes y configuración de routers/switches empresariales.",
            courses: []
        },
        {
            name: "Servicio Técnico Móvil",
            slug: "reparacion-celulares",
            description: "Diagnóstico de fallas en smartphones, reemplazo de displays, manejo de repuestos originales y flasheo de software.",
            courses: []
        },
        {
            name: "Hardware e Informática (Laptops)",
            slug: "hardware-informatico",
            description: "Reparación de laptops, PCs de escritorio, reballing, cambios de teclados, actualización de RAM/SSD y diagnóstico térmico.",
            courses: []
        },
        {
            name: "Seguridad, CCTV y Biometría",
            slug: "seguridad-biometria",
            description: "Instalación de cámaras análogas/IP, sistemas de control de acceso por huella/rostro y alarmas monitoreadas.",
            courses: []
        },
        {
            name: "Sistemas de Energía Solar y Respaldo",
            slug: "energia-respaldo",
            description: "Dimensionamiento e instalación de UPS, baterías de ciclo profundo, paneles solares e inversores.",
            courses: []
        },
        {
            name: "Domótica y Control de Accesos",
            slug: "domotica-accesos",
            description: "Casas inteligentes, motores para portones automáticos, cerraduras digitales y ecosistemas IoT.",
            courses: []
        },
        {
            name: "Sistemas de Impresión 2D y 3D",
            slug: "impresion",
            description: "Mantenimiento preventivo y correctivo de impresoras de inyección, láser, y principios básicos de impresión 3D.",
            courses: []
        },
        {
            name: "Gestión de Negocio Técnico",
            slug: "negocios-tecnicos",
            description: "Estrategias de venta, elaboración de cotizaciones, manejo de garantías y atención al cliente para instaladores.",
            courses: []
        }
    ]

    for (const catData of categoriesData) {
        await prisma.academyCategory.upsert({
            where: { slug: catData.slug },
            update: {
                description: catData.description,
                name: catData.name
            },
            create: {
                name: catData.name,
                slug: catData.slug,
                description: catData.description
            }
        })
    }

    console.log("Carga de categorías completada con éxito.")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
