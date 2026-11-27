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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    firstName,
    lastName,
    phone,
    startDate,
    jobRole,
    category,
    objective,
    isActive,
    pubEnabled,
    phoneEnabled,
    msgEnabled,
    dayStatus,
  } = body

  const updateData: any = {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(phone !== undefined && { phone }),
    ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
    ...(jobRole !== undefined && { jobRole }),
    ...(category !== undefined && { category }),
    ...(objective !== undefined && { objective }),
    ...(isActive !== undefined && { isActive }),
    ...(typeof pubEnabled === 'boolean' && { pubEnabled }),
    ...(typeof phoneEnabled === 'boolean' && { phoneEnabled }),
    ...(typeof msgEnabled === 'boolean' && { msgEnabled }),
    ...(dayStatus !== undefined && { dayStatus }),
  }

  if (dayStatus === 'CLOSED') {
    updateData.dayClosedAt = new Date()
  } else if (dayStatus === 'OPEN' || dayStatus === 'SAVED') {
    updateData.dayClosedAt = null
  }

  const advisor = await prisma.flashAdvisor.update({
    where: { id: params.id },
    data: updateData,
    include: {
      publicationAssignments: {
        include: {
          publicationImages: { orderBy: { slotIndex: 'asc' } },
          evidenceSlots: { orderBy: { slotIndex: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      },
      phoneAssignments: {
        include: { contacts: { orderBy: { slotIndex: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      },
      dailyLogs: { orderBy: { dateStr: 'desc' }, take: 35 },
    },
  })

  // Record daily snapshot for 30-day calendar when saving or closing day
  if (dayStatus === 'SAVED' || dayStatus === 'CLOSED') {
    const dateStr = new Date().toISOString().slice(0, 10)
    const todayPubs = advisor.publicationAssignments.filter(
      (a) => new Date(a.createdAt).toISOString().slice(0, 10) === dateStr
    )
    const pubsAssigned = todayPubs.reduce((s, a) => s + a.imageCount, 0)
    const evidencesDone = todayPubs.reduce(
      (s, a) => s + a.evidenceSlots.filter((e) => Boolean(e.screenshotUrl)).length,
      0
    )
    const todayPhones = advisor.phoneAssignments.filter(
      (a) => new Date(a.createdAt).toISOString().slice(0, 10) === dateStr
    )
    const phonesAssigned = todayPhones.reduce((s, a) => s + a.phoneCount, 0)
    const phonesDone = todayPhones.reduce(
      (s, a) => s + a.contacts.filter((c) => Boolean(c.screenshotUrl)).length,
      0
    )

    await prisma.flashDailyLog.upsert({
      where: { advisorId_dateStr: { advisorId: advisor.id, dateStr } },
      update: {
        status: dayStatus,
        pubsAssigned,
        evidencesDone,
        phonesAssigned,
        phonesDone,
        ...(dayStatus === 'CLOSED' ? { closedAt: new Date() } : {}),
      },
      create: {
        advisorId: advisor.id,
        dateStr,
        status: dayStatus,
        pubsAssigned,
        evidencesDone,
        phonesAssigned,
        phonesDone,
        ...(dayStatus === 'CLOSED' ? { closedAt: new Date() } : {}),
      },
    })
  }

  return NextResponse.json({ advisor })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.flashAdvisor.update({
    where: { id: params.id },
    data: { isActive: false },
  })
  return NextResponse.json({ ok: true })
}
