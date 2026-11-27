export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isFlashAuthorized(session: any) {
  const role = (session?.user as any)?.role || ''
  const email = (session?.user as any)?.email || ''
  const name = (session?.user as any)?.name || ''
  const roles = role.toUpperCase()
  return (
    roles.includes('ADMIN') ||
    roles.includes('COORDINATOR') ||
    roles.includes('MANAGEMENT') ||
    roles.includes('EDICION') ||
    email.toLowerCase().includes('stefy') ||
    name.toLowerCase().includes('stefy') ||
    email.toLowerCase().includes('edicion')
  )
}

// POST /api/flash/publications/[id]/images — add publication image(s)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { images } = body

  if (!images || !Array.isArray(images) || images.length === 0)
    return NextResponse.json({ error: 'images[] requerido' }, { status: 400 })

  const created = await prisma.$transaction(
    images.map((img: { url: string; fileName?: string; slotIndex?: number }, i: number) =>
      prisma.flashPublicationImage.create({
        data: {
          assignmentId: params.id,
          url: img.url,
          fileName: img.fileName || null,
          slotIndex: img.slotIndex ?? i,
        },
      })
    )
  )
  return NextResponse.json({ images: created })
}

// PATCH /api/flash/publications/[id]/images — update evidence slot or assignment document/observations/status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { slotId, screenshotUrl, status, documentUrl, documentName, observations, topicTitle } = body

  if (slotId) {
    const slot = await prisma.flashEvidenceSlot.update({
      where: { id: slotId },
      data: { screenshotUrl: screenshotUrl ?? null, uploadedAt: screenshotUrl ? new Date() : null },
    })
    return NextResponse.json({ slot })
  }

  const updateData: any = {}
  if (status !== undefined) {
    updateData.status = status
    if (status === 'CLOSED') updateData.closedAt = new Date()
    if (status === 'SAVED') updateData.savedAt = new Date()
  }
  if (documentUrl !== undefined) updateData.documentUrl = documentUrl
  if (documentName !== undefined) updateData.documentName = documentName
  if (observations !== undefined) updateData.observations = observations
  if (topicTitle !== undefined) updateData.topicTitle = topicTitle

  const assignment = await prisma.flashPublicationAssignment.update({
    where: { id: params.id },
    data: updateData,
  })
  return NextResponse.json({ assignment })
}

// DELETE /api/flash/publications/[id]/images?imageId=xxx OR ?slotId=xxx
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const imageId = searchParams.get('imageId')
  const slotId = searchParams.get('slotId')

  if (imageId) {
    await prisma.flashPublicationImage.deleteMany({
      where: { id: imageId, assignmentId: params.id },
    })
    return NextResponse.json({ ok: true })
  }

  if (slotId) {
    await prisma.flashEvidenceSlot.updateMany({
      where: { id: slotId, assignmentId: params.id },
      data: { screenshotUrl: null, uploadedAt: null },
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'imageId o slotId requerido' }, { status: 400 })
}
