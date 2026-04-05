"use server"

import { prisma } from "../prisma"
import { revalidatePath } from "next/cache"

export async function fetchFeed(page = 1, limit = 20) {
    try {
        const skip = (page - 1) * limit
        const posts = await prisma.socialPost.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: { id: true, name: true, role: true }
                },
                likes: {
                    select: { userId: true }
                },
                comments: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        author: { select: { id: true, name: true, role: true } }
                    }
                },
                tags: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                }
            }
        })
        return { success: true, posts }
    } catch (error: any) {
        console.error("Error fetching feed:", error)
        return { success: false, error: error.message }
    }
}

export async function createPost(authorId: string, content: string, mediaUrls?: string, tags?: string[]) {
    try {
        const post = await prisma.socialPost.create({
            data: {
                authorId,
                content,
                mediaUrls: mediaUrls || null,
                tags: tags && tags.length > 0 ? {
                    create: tags.map(userId => ({ userId }))
                } : undefined
            },
            include: {
                author: { select: { id: true, name: true, role: true } },
                likes: true,
                comments: true,
                tags: { include: { user: { select: { id: true, name: true } } } }
            }
        })
        revalidatePath("/dashboard")
        return { success: true, post }
    } catch (error: any) {
        console.error("Error creating post:", error)
        return { success: false, error: error.message }
    }
}

export async function toggleLike(postId: string, userId: string) {
    try {
        const existingLike = await prisma.socialLike.findUnique({
            where: { postId_userId: { postId, userId } }
        })

        if (existingLike) {
            await prisma.socialLike.delete({
                where: { postId_userId: { postId, userId } }
            })
        } else {
            await prisma.socialLike.create({
                data: { postId, userId }
            })
        }
        revalidatePath("/dashboard")
        return { success: true, liked: !existingLike }
    } catch (error: any) {
        console.error("Error toggling like:", error)
        return { success: false, error: error.message }
    }
}

export async function addComment(postId: string, authorId: string, content: string) {
    try {
        if (!content.trim()) return { success: false, error: "Comment cannot be empty" }
        const comment = await prisma.socialComment.create({
            data: {
                postId,
                authorId,
                content
            },
            include: {
                author: { select: { id: true, name: true, role: true } }
            }
        })
        revalidatePath("/dashboard")
        return { success: true, comment }
    } catch (error: any) {
        console.error("Error adding comment:", error)
        return { success: false, error: error.message }
    }
}

export async function getUsersForTagging() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, role: true },
            orderBy: { name: "asc" }
        })
        return { success: true, users }
    } catch (error: any) {
        console.error("Error fetching users for tagging:", error)
        return { success: false, error: error.message }
    }
}
