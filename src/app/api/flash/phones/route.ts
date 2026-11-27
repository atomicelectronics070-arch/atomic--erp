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
    roles.includes('ADMIN') || roles.includes('COORDINATOR') || roles.includes('MANAGEMENT') || roles.includes('EDICION') ||
    email.toLowerCase().includes('stefy') || name.toLowerCase().includes('stefy') ||
    email.toLowerCase().includes('edicion')
  )
}

// POST /api/flash/phones — create phone assignment
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { advisorId, phoneCount } = body

  if (!advisorId || !phoneCount)
    return NextResponse.json({ error: 'advisorId y phoneCount requeridos' }, { status: 400 })

  const count = Number(phoneCount)

  const assignment = await prisma.flashPhoneAssignment.create({
    data: {
      advisorId,
      phoneCount: count,
      contacts: {
        createMany: {
          data: Array.from({ length: count }, (_, i) => ({ slotIndex: i })),
        },
      },
    },
    include: { contacts: { orderBy: { slotIndex: 'asc' } } },
  })
  return NextResponse.json({ assignment })
}

// PATCH /api/flash/phones — update a phone contact slot
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !isFlashAuthorized(session))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // { contactId, clientName?, phone?, propuesta?, screenshotUrl?, sentAt? }
  const { contactId, clientName, phone, propuesta, screenshotUrl, sentAt } = body

  if (!contactId)
    return NextResponse.json({ error: 'contactId requerido' }, { status: 400 })

  const contact = await prisma.flashPhoneContact.update({
    where: { id: contactId },
    data: {
      ...(clientName !== undefined && { clientName }),
      ...(phone !== undefined && { phone }),
      ...(propuesta !== undefined && { propuesta }),
      ...(screenshotUrl !== undefined && { screenshotUrl }),
      ...(sentAt !== undefined && { sentAt: new Date(sentAt) }),
    },
  })
  return NextResponse.json({ contact })
}
