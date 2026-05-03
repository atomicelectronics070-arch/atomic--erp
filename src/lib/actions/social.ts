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

export async function getSalesRanking() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        conversations: true, // Quotes
                        clients: true        // CRM Contacts
                    }
                },
                transactions: {
                    where: { status: "PAGADO" },
                    select: { profit: true }
                }
            }
        })

        const ranking = users.map(user => {
            const totalProfit = user.transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0)
            const salesCount = user.transactions.length
            const quotesCount = user._count.conversations
            const contactsCount = user._count.clients
            
            // Calculate Points Logic
            let salesPoints = 0
            user.transactions.forEach(tx => {
                const val = tx.profit || 0
                if (val > 1000) salesPoints += 15
                else if (val >= 300) salesPoints += 10
                else if (val >= 100) salesPoints += 8
                else if (val > 0) salesPoints += 3
            })

            const quotePoints = quotesCount * 2
            const totalPoints = salesPoints + quotePoints
            
            return {
                id: user.id,
                name: user.name || user.email.split('@')[0],
                salesCount,
                totalProfit,
                quotesCount,
                contactsCount,
                points: totalPoints,
                score: totalPoints // Use points as the primary score
            }
        }).sort((a, b) => b.points - a.points)

        return { success: true, ranking }
    } catch (error: any) {
        console.error("Error fetching ranking:", error)
        return { success: false, error: error.message }
    }
}

export async function deletePost(postId: string, userId: string) {
    try {
        console.log("Attempting to delete post:", postId, "by user:", userId);
        
        const post = await prisma.socialPost.findUnique({
            where: { id: postId },
            select: { authorId: true }
        })
        if (!post) return { success: false, error: "La publicaci�n no existe." }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        })

        console.log("User role:", user?.role, "Post author:", post.authorId);

        const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGEMENT" || user?.role === "ADMINISTRADOR" || user?.role === "GERENCIA";
        const isOwner = post.authorId === userId;

        if (!isAdmin && !isOwner) {
            return { success: false, error: `No autorizado. Tu rol es ${user?.role || "desconocido"}.` }
        }

        // Cascade delete should handle it but we do it manually to be safe
        await prisma.socialLike.deleteMany({ where: { postId } })
        await prisma.socialComment.deleteMany({ where: { postId } })
        await prisma.socialTag.deleteMany({ where: { postId } })
        await prisma.socialPost.delete({ where: { id: postId } })

        console.log("Post deleted successfully");
        return { success: true }
    } catch (error: any) {
        console.error("Delete post error:", error)
        return { success: false, error: error.message }
    }
}