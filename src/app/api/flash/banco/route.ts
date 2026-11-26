export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/flash/banco — full image bank for admin/editor view
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session?.user as any)?.role || ''
  const email = (session?.user as any)?.email || ''
  const name = (session?.user as any)?.name || ''
  const roles = role.toUpperCase()
  const authorized =
    roles.includes('ADMIN') || roles.includes('COORDINATOR') || roles.includes('MANAGEMENT') ||
    email.toLowerCase().includes('stefy') || name.toLowerCase().includes('stefy') ||
    email.toLowerCase().includes('edicion')

  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const advisorId = searchParams.get('advisorId') // optional filter

  const assignments = await prisma.flashPublicationAssignment.findMany({
    where: advisorId ? { advisorId } : undefined,
    include: {
      publicationImages: { orderBy: { slotIndex: 'asc' } },
      evidenceSlots: { orderBy: { slotIndex: 'asc' } },
      advisor: { select: { id: true, firstName: true, lastName: true, category: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const advisors = await prisma.flashAdvisor.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: 'asc' },
  })

  return NextResponse.json({ assignments, advisors })
}
