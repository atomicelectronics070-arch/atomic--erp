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

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advisors = await prisma.flashAdvisor.findMany({
    where: { isActive: true },
    include: {
      publicationAssignments: {
        include: {
          publicationImages: true,
          evidenceSlots: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      phoneAssignments: {
        include: { contacts: { orderBy: { slotIndex: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ advisors })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { firstName, lastName, phone, startDate, jobRole, category, objective } = body

  if (!firstName || !lastName)
    return NextResponse.json({ error: 'firstName y lastName requeridos' }, { status: 400 })

  const advisor = await prisma.flashAdvisor.create({
    data: {
      firstName,
      lastName,
      phone: phone || null,
      startDate: startDate ? new Date(startDate) : null,
      jobRole: jobRole || null,
      category: category || null,
      objective: objective || null,
    },
    include: {
      publicationAssignments: { include: { publicationImages: true, evidenceSlots: true } },
      phoneAssignments: { include: { contacts: true } },
    },
  })
  return NextResponse.json({ advisor })
}
