export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const token = String(formData.get('token') || '').trim()

    if (!file || !token) {
      return NextResponse.json({ error: 'Archivo y token requeridos' }, { status: 400 })
    }

    const assignment = await prisma.flashPublicationAssignment.findFirst({
      where: { OR: [{ shareToken: token }, { id: token }] },
      select: { id: true, status: true },
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Enlace inválido' }, { status: 404 })
    }
    if (assignment.status === 'CLOSED') {
      return NextResponse.json({ error: 'El día ya fue cerrado' }, { status: 400 })
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx 15MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const rawExt = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const uniqueId = crypto.randomBytes(6).toString('hex')
    const safeName = `entrega-${Date.now()}-${uniqueId}.${rawExt}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'flash')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, safeName), buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/flash/${safeName}`,
      fileName: file.name,
    })
  } catch (error) {
    console.error('[FLASH_PUBLIC_UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Error al subir captura' }, { status: 500 })
  }
}
