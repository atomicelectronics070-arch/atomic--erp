const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seed: Iniciando carga de contenido académico...')

    // 1. Categorías
    const catSeguridad = await prisma.academyCategory.upsert({
        where: { slug: 'seguridad-electronica' },
        update: {},
        create: {
            name: 'Seguridad Electrónica Demo',
            slug: 'seguridad-electronica',
            description: 'Sistemas de videovigilancia, alarmas y control de acceso.',
            image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop'
        }
    })

    const catRedes = await prisma.academyCategory.upsert({
        where: { slug: 'redes-conectividad' },
        update: {},
        create: {
            name: 'Redes y Conectividad Demo',
            slug: 'redes-conectividad',
            description: 'Infraestructura de red, routers, switches y fibra óptica.',
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop'
        }
    })

    // 2. Cursos
    const courseCCTV = await prisma.course.upsert({
        where: { slug: 'fundamentos-cctv-ip' },
        update: {},
        create: {
            title: 'Fundamentos de CCTV IP',
            slug: 'fundamentos-cctv-ip',
            description: 'Aprende a diseñar e instalar sistemas de videovigilancia IP desde cero.',
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop',
            categoryId: catSeguridad.id,
            published: true
        }
    })

    // 3. Lecciones (Using create instead of upsert for simplicity in seed)
    const existingLessons = await prisma.lesson.findMany({ where: { courseId: courseCCTV.id } })
    if (existingLessons.length === 0) {
        await prisma.lesson.createMany({
            data: [
                {
                    title: 'Introducción a la Tecnología IP',
                    slug: 'introduccion-tecnologia-ip',
                    content: '<h2>¿Qué es el CCTV IP?</h2><p>En esta lección exploramos las diferencias entre analógico e IP...</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    order: 1,
                    courseId: courseCCTV.id
                },
                {
                    title: 'Configuración de NVRs',
                    slug: 'configuracion-nvrs',
                    content: '<h2>Configuración Paso a Paso</h2><p>Aprende a inicializar un grabador de red...</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    order: 2,
                    courseId: courseCCTV.id
                }
            ]
        })
    }

    console.log('✅ Seed: Contenido académico cargado con éxito.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
