const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🧪 Seed: Implementando sistema de exámenes rápidos...')

    const courseCCTV = await prisma.course.findUnique({
        where: { slug: 'fundamentos-cctv-ip' }
    })

    if (courseCCTV) {
        // Update first lesson with a quiz
        const quizData = JSON.stringify([
            {
                q: "¿Cuál es la principal ventaja de un sistema CCTV IP sobre uno Analógico?",
                a: ["Mayor resolución y escalabilidad", "Costo de cableado coaxial", "No requiere switch de red", "Uso exclusivo de BNC"],
                c: 0
            },
            {
                q: "¿Qué puerto se utiliza comúnmente para la interfaz web de un NVR?",
                a: ["21", "80", "443", "554"],
                c: 1
            }
        ])

        await prisma.lesson.updateMany({
            where: { 
                courseId: courseCCTV.id,
                slug: 'introduccion-tecnologia-ip'
            },
            data: { quizData }
        })

        console.log('✅ Quiz de prueba inyectado en: Fundamentos de CCTV IP')
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
