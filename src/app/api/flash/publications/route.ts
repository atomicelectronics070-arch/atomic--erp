export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { advisorId, topicTitle, imageCount, observations, documentUrl, documentName } = body

  if (!advisorId || !imageCount)
    return NextResponse.json({ error: 'advisorId e imageCount requeridos' }, { status: 400 })

  const count = Number(imageCount)
  const shareToken = crypto.randomBytes(8).toString('hex')

  const assignment = await prisma.flashPublicationAssignment.create({
    data: {
      advisorId,
      topicTitle: topicTitle || null,
      imageCount: count,
      observations: observations || null,
      documentUrl: documentUrl || null,
      documentName: documentName || null,
      shareToken,
      status: 'ACTIVE',
      savedAt: new Date(),
      evidenceSlots: {
        createMany: {
          data: Array.from({ length: count }, (_, i) => ({ slotIndex: i })),
        },
      },
    },
    include: {
      publicationImages: true,
      evidenceSlots: { orderBy: { slotIndex: 'asc' } },
    },
  })
  return NextResponse.json({ assignment })
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const advisorId = searchParams.get('advisorId')

  const where = advisorId ? { advisorId } : {}
  const assignments = await prisma.flashPublicationAssignment.findMany({
    where,
    include: {
      publicationImages: { orderBy: { slotIndex: 'asc' } },
      evidenceSlots: { orderBy: { slotIndex: 'asc' } },
      advisor: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ assignments })
}
