const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log("Iniciando carga de módulos de aprendizaje para Academia Atomic...")

    const categoriesData = [
        {
            name: "Videovigilancia y Seguridad",
            slug: "seguridad",
            description: "Cursos de CCTV, alarmas, control de acceso y protocolos de seguridad física y electrónica.",
            courses: [
                {
                    title: "Fundamentos de CCTV Residencial",
                    slug: "cctv-fundamentos",
                    description: "Aprende a diseñar e instalar sistemas de cámaras analógicas e IP para hogares. Cobertura de ángulos, cableado y configuración de DVR/NVR.",
                    published: true
                },
                {
                    title: "Ventas: Cómo cerrar contratos de Seguridad",
                    slug: "ventas-seguridad",
                    description: "Módulo para vendedores. Estrategias para identificar zonas de riesgo en casas de clientes y ofrecer los kits adecuados.",
                    published: true
                }
            ]
        },
        {
            name: "Domótica y Smart Home",
            slug: "smarthome",
            description: "Automatización de hogares, IoT, asistentes de voz y ecosistemas residenciales inteligentes.",
            courses: [
                {
                    title: "Instalación de Interruptores Inteligentes",
                    slug: "interruptores-smart",
                    description: "Guía paso a paso para reemplazar interruptores tradicionales por tecnología WiFi/Zigbee sin neutro y con neutro.",
                    published: true
                },
                {
                    title: "Ecosistemas Alexa y Google Home",
                    slug: "ecosistemas-voz",
                    description: "Cómo integrar docenas de dispositivos residenciales bajo un solo comando de voz. Ideal para ofrecer 'casas del futuro'.",
                    published: true
                }
            ]
        },
        {
            name: "Energía y Respaldo",
            slug: "energia",
            description: "Sistemas de protección eléctrica, UPS, reguladores y soluciones de energía solar básica.",
            courses: [
                {
                    title: "Sistemas UPS para Hogares",
                    slug: "ups-hogares",
                    description: "Cálculo de cargas eléctricas para proteger electrodomésticos y computadoras de los cortes de luz.",
                    published: true
                }
            ]
        },
        {
            name: "Redes y Conectividad",
            slug: "redes",
            description: "Implementación de redes estables, sistemas Mesh y enlaces punto a punto para propiedades grandes.",
            courses: [
                {
                    title: "Sistemas WiFi Mesh: Cero Puntos Muertos",
                    slug: "wifi-mesh",
                    description: "Elimina las quejas de WiFi en casas de varios pisos instalando y configurando sistemas Mesh avanzados.",
                    published: true
                }
            ]
        },
        {
            name: "Electrónica y Placas de Control",
            slug: "electronica",
            description: "Reparación, soldadura y entendimiento a nivel de componente para técnicos avanzados.",
            courses: [
                {
                    title: "Diagnóstico de Placas de Portones Automáticos",
                    slug: "placas-portones",
                    description: "Entiende los relés, fusibles y circuitos de las placas de motores de garaje para diagnósticos precisos.",
                    published: true
                },
                {
                    title: "Soldadura Electrónica Básica",
                    slug: "soldadura-basica",
                    description: "Técnicas de soldadura SMD y de inserción para reparar equipos residenciales menores.",
                    published: true
                }
            ]
        }
    ]

    for (const catData of categoriesData) {
        // Upsert Category
        const category = await prisma.academyCategory.upsert({
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

        // Upsert Courses
        for (const courseData of catData.courses) {
            await prisma.course.upsert({
                where: { slug: courseData.slug },
                update: {
                    title: courseData.title,
                    description: courseData.description,
                    published: courseData.published,
                    categoryId: category.id
                },
                create: {
                    title: courseData.title,
                    slug: courseData.slug,
                    description: courseData.description,
                    published: courseData.published,
                    categoryId: category.id
                }
            })
        }
        console.log(`Categoría procesada: ${category.name} con ${catData.courses.length} cursos.`)
    }

    console.log("Carga de módulos completada con éxito.")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
