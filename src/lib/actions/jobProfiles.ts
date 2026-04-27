"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getJobProfile(userId: string) {
    try {
        return await prisma.jobProfile.findUnique({
            where: { userId }
        })
    } catch (error) {
        console.error("Get Job Profile Error:", error)
        return null
    }
}

export async function getAllJobProfiles() {
    try {
        return await prisma.jobProfile.findMany({
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        })
    } catch (error) {
        console.error("Get All Job Profiles Error:", error)
        return []
    }
}

export async function upsertJobProfile(userId: string, data: any) {
    try {
        const profile = await prisma.jobProfile.upsert({
            where: { userId },
            update: {
                title: data.title,
                description: data.description,
                skills: JSON.stringify(data.skills),
                responsibilities: JSON.stringify(data.responsibilities),
                benefits: JSON.stringify(data.benefits),
                templateName: data.templateName
            },
            create: {
                userId,
                title: data.title,
                description: data.description,
                skills: JSON.stringify(data.skills),
                responsibilities: JSON.stringify(data.responsibilities),
                benefits: JSON.stringify(data.benefits),
                templateName: data.templateName
            }
        })

        // Create notification for the user
        await prisma.notification.create({
            data: {
                userId,
                title: "Nuevo Perfil Laboral Asignado",
                message: `Se ha actualizado tu ficha de perfil laboral como ${data.title}.`,
                type: "SYSTEM"
            }
        })

        revalidatePath("/dashboard/evaluations")
        return { success: true, profile }
    } catch (error: any) {
        console.error("Upsert Job Profile Error:", error)
        return { success: false, error: error.message }
    }
}


