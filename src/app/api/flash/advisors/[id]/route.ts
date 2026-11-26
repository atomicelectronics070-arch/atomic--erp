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
    email.toLowerCase().includes('stefy') ||
    name.toLowerCase().includes('stefy') ||
    email.toLowerCase().includes('edicion')
  )
}

// PATCH /api/flash/advisors/[id] — update advisor
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { firstName, lastName, phone, startDate, jobRole, category, objective, isActive } = body

  const advisor = await prisma.flashAdvisor.update({
    where: { id: params.id },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(phone !== undefined && { phone }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
      ...(jobRole !== undefined && { jobRole }),
      ...(category !== undefined && { category }),
      ...(objective !== undefined && { objective }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      publicationAssignments: { include: { publicationImages: true, evidenceSlots: true } },
      phoneAssignments: { include: { contacts: { orderBy: { slotIndex: 'asc' } } } },
    },
  })
  return NextResponse.json({ advisor })
}

// DELETE /api/flash/advisors/[id] — soft delete
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
