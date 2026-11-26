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

// POST /api/flash/publications — create publication assignment
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { advisorId, topicTitle, imageCount, observations, documentUrl, documentName } = body

  if (!advisorId || !imageCount)
    return NextResponse.json({ error: 'advisorId e imageCount requeridos' }, { status: 400 })

  const count = Number(imageCount)

  // Create assignment + evidence slots atomically
  const assignment = await prisma.flashPublicationAssignment.create({
    data: {
      advisorId,
      topicTitle: topicTitle || null,
      imageCount: count,
      observations: observations || null,
      documentUrl: documentUrl || null,
      documentName: documentName || null,
      status: 'ACTIVE',
      // Pre-create evidence slots
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

// GET /api/flash/publications?advisorId=xxx — list assignments
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
