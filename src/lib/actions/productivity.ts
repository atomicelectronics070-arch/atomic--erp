"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// NOTES
export async function getNotes(userId: string) {
    return await prisma.note.findMany({
        where: { userId },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }]
    })
}

export async function saveNote(data: { id?: string, title: string, content: string, userId: string, color?: string, pinned?: boolean }) {
    if (data.id) {
        await prisma.note.update({
            where: { id: data.id },
            data: {
                title: data.title,
                content: data.content,
                color: data.color,
                pinned: data.pinned
            }
        })
    } else {
        await prisma.note.create({
            data: {
                title: data.title,
                content: data.content,
                color: data.color,
                pinned: data.pinned || false,
                userId: data.userId
            }
        })
    }
    revalidatePath('/dashboard/notes')
    return { success: true }
}

export async function deleteNote(id: string) {
    await prisma.note.delete({ where: { id } })
    revalidatePath('/dashboard/notes')
    return { success: true }
}

// EVENTS (AGENDA)
export async function getEvents(userId: string) {
    return await prisma.event.findMany({
        where: { userId },
        orderBy: { start: 'asc' }
    })
}

export async function saveEvent(data: { id?: string, title: string, description?: string, start: Date, end: Date, userId: string, color?: string, allDay?: boolean }) {
    if (data.id) {
        await prisma.event.update({
            where: { id: data.id },
            data: {
                title: data.title,
                description: data.description,
                start: data.start,
                end: data.end,
                color: data.color,
                allDay: data.allDay
            }
        })
    } else {
        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                start: data.start,
                end: data.end,
                color: data.color,
                allDay: data.allDay || false,
                userId: data.userId
            }
        })
    }
    revalidatePath('/dashboard/agenda')
    return { success: true }
}

export async function deleteEvent(id: string) {
    await prisma.event.delete({ where: { id } })
    revalidatePath('/dashboard/agenda')
    return { success: true }
}
