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
    roles.includes('ADMIN') || roles.includes('COORDINATOR') || roles.includes('MANAGEMENT') ||
    email.toLowerCase().includes('stefy') || name.toLowerCase().includes('stefy') ||
    email.toLowerCase().includes('edicion')
  )
}

// POST /api/flash/publications/[id]/images — add publication image(s)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // images: Array<{ url: string, fileName?: string, slotIndex?: number }>
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

// PATCH /api/flash/publications/[id]/images — update evidence slot screenshot
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // { slotId: string, screenshotUrl: string }
  const { slotId, screenshotUrl } = body

  const slot = await prisma.flashEvidenceSlot.update({
    where: { id: slotId },
    data: { screenshotUrl, uploadedAt: new Date() },
  })
  return NextResponse.json({ slot })
}
