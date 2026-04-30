const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const aiCourse = await prisma.course.findFirst({
        where: { category: { name: { contains: 'Inteligencia' } } },
        include: { lessons: { orderBy: { order: 'asc' } } }
    })

    if (!aiCourse) {
        console.log("No se encontro el curso de IA")
        return
    }

    for (const lesson of aiCourse.lessons) {
        const videoUrl = `/videos/academy/Modulo_${lesson.order}.mp4`
        await prisma.lesson.update({
            where: { id: lesson.id },
            data: { videoUrl }
        })
        console.log(`Actualizada leccion ${lesson.order}: ${videoUrl}`)
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
