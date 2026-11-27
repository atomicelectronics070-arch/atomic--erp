export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function findAssignmentByTokenOrId(token: string) {
  return prisma.flashPublicationAssignment.findFirst({
    where: {
      OR: [{ shareToken: token }, { id: token }],
    },
    include: {
      advisor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          category: true,
          objective: true,
          jobRole: true,
        },
      },
      publicationImages: { orderBy: { slotIndex: 'asc' } },
      evidenceSlots: { orderBy: { slotIndex: 'asc' } },
    },
  })
}

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const assignment = await findAssignmentByTokenOrId(params.token)
    if (!assignment) {
      return NextResponse.json({ error: 'Enlace no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ assignment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const assignment = await findAssignmentByTokenOrId(params.token)
    if (!assignment) {
      return NextResponse.json({ error: 'Enlace no encontrado' }, { status: 404 })
    }

    if (assignment.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Este día ya fue cerrado y no admite cambios.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { action, slotId, screenshotUrl } = body

    if (action === 'upload_evidence') {
      if (!slotId || !screenshotUrl) {
        return NextResponse.json({ error: 'slotId y screenshotUrl requeridos' }, { status: 400 })
      }
      await prisma.flashEvidenceSlot.updateMany({
        where: { id: slotId, assignmentId: assignment.id },
        data: { screenshotUrl, uploadedAt: new Date() },
      })
    } else if (action === 'delete_evidence') {
      if (!slotId) {
        return NextResponse.json({ error: 'slotId requerido' }, { status: 400 })
      }
      await prisma.flashEvidenceSlot.updateMany({
        where: { id: slotId, assignmentId: assignment.id },
        data: { screenshotUrl: null, uploadedAt: null },
      })
    } else if (action === 'save_day') {
      await prisma.flashPublicationAssignment.update({
        where: { id: assignment.id },
        data: { status: 'SAVED', savedAt: new Date() },
      })
    } else if (action === 'close_day') {
      await prisma.flashPublicationAssignment.update({
        where: { id: assignment.id },
        data: { status: 'CLOSED', closedAt: new Date() },
      })
    }

    const updated = await findAssignmentByTokenOrId(params.token)
    if (updated) {
      const dateStr = new Date().toISOString().slice(0, 10)
      const evidencesDone = updated.evidenceSlots.filter((s) => Boolean(s.screenshotUrl)).length
      const logStatus = updated.status === 'CLOSED' ? 'CLOSED' : 'SAVED'

      await prisma.flashDailyLog.upsert({
        where: {
          advisorId_dateStr: {
            advisorId: updated.advisorId,
            dateStr,
          },
        },
        update: {
          status: logStatus,
          pubsAssigned: updated.imageCount,
          evidencesDone,
          ...(logStatus === 'CLOSED' ? { closedAt: new Date() } : {}),
        },
        create: {
          advisorId: updated.advisorId,
          dateStr,
          status: logStatus,
          pubsAssigned: updated.imageCount,
          evidencesDone,
          ...(logStatus === 'CLOSED' ? { closedAt: new Date() } : {}),
        },
      })
    }

    return NextResponse.json({ assignment: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error guardando entrega' }, { status: 500 })
  }
}
