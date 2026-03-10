import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Handle listing folders and files
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const parentId = searchParams.get("parentId") || null

        // Get folders
        const folders = await prisma.storageFolder.findMany({
            where: { parentId },
            orderBy: { name: 'asc' }
        })

        // Get files
        const files = await prisma.storageFile.findMany({
            where: { folderId: parentId },
            include: { uploader: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        })

        // Get parent context if we are inside a folder
        let currentFolder = null
        if (parentId) {
            currentFolder = await prisma.storageFolder.findUnique({
                where: { id: parentId },
                include: { parent: true }
            })
        }

        return NextResponse.json({ folders, files, currentFolder })
    } catch (error) {
        console.error("Storage GET error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Handle creating folders and "uploading" files
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { type, name, folderId, url, size } = body

        if (type === "folder") {
            if (!name) return NextResponse.json({ error: "Folder name required" }, { status: 400 })
            const folder = await prisma.storageFolder.create({
                data: {
                    name,
                    parentId: folderId || null
                }
            })
            return NextResponse.json({ folder })
        }
        else if (type === "file") {
            if (!name || !url) return NextResponse.json({ error: "File name and URL required" }, { status: 400 })
            const file = await prisma.storageFile.create({
                data: {
                    name,
                    url,
                    size: size || 0,
                    folderId: folderId || null,
                    uploaderId: session.user.id
                },
                include: { uploader: { select: { name: true } } }
            })
            return NextResponse.json({ file })
        }

        return NextResponse.json({ error: "Invalid operation type" }, { status: 400 })
    } catch (error) {
        console.error("Storage POST error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
