import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      firstName = "", 
      lastName = "", 
      email = "", 
      phone = "", 
      projectType = "Residencial", 
      city = "Quito", 
      message = "" 
    } = body

    const cleanFirstName = String(firstName).trim()
    const cleanLastName = String(lastName).trim()
    const cleanEmail = String(email).trim().toLowerCase()
    const cleanPhone = String(phone).trim()
    const cleanCity = String(city).trim()
    const cleanProjectType = String(projectType).trim()
    const cleanMessage = String(message).trim()

    if (!cleanFirstName || (!cleanPhone && !cleanEmail)) {
      return NextResponse.json(
        { error: "Nombre y al menos un método de contacto (teléfono o correo) son requeridos." },
        { status: 400 }
      )
    }

    const fullName = `${cleanFirstName} ${cleanLastName}`.trim()
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    const leadPayload = {
      id: leadId,
      fullName,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      phone: cleanPhone,
      projectType: cleanProjectType,
      city: cleanCity,
      message: cleanMessage,
      status: "NUEVO",
      createdAt: new Date().toISOString()
    }

    // 1. Guardar de forma resiliente en SystemSetting (garantiza cero fallos de schema)
    try {
      const settingKey = `landing_lead_${leadId}`
      await prisma.systemSetting.upsert({
        where: { key: settingKey },
        update: {
          value: JSON.stringify(leadPayload),
          description: `Lead Landing: ${fullName} (${cleanProjectType} - ${cleanCity})`
        },
        create: {
          key: settingKey,
          value: JSON.stringify(leadPayload),
          description: `Lead Landing: ${fullName} (${cleanProjectType} - ${cleanCity})`
        }
      })
    } catch (settingErr) {
      console.warn("[LANDING_LEAD_SETTING_WARN]", settingErr)
    }

    // 2. Sincronizar en Client de la base de datos si existe un vendedor
    try {
      // Buscar el primer usuario administrativo o vendedor activo para asignar
      const defaultAdmin = await prisma.user.findFirst({
        where: {
          OR: [
            { role: "ADMIN" },
            { role: "MANAGEMENT" },
            { role: "COORDINATOR" },
            { email: { contains: "guzman" } }
          ],
          isActive: true
        },
        select: { id: true }
      })

      const anyUser = defaultAdmin || await prisma.user.findFirst({ select: { id: true } })

      if (anyUser) {
        await prisma.client.create({
          data: {
            name: fullName,
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail || null,
            phone: cleanPhone || null,
            city: cleanCity,
            requirement: `[${cleanProjectType}] ${cleanMessage}`,
            source: "LANDING_PROYECTOS",
            category: "PROYECTOS_TECNOLOGIA",
            status: "PROSPECTO",
            salespersonId: anyUser.id
          }
        })
      }
    } catch (clientErr) {
      console.warn("[LANDING_LEAD_CLIENT_SYNC_WARN]", clientErr)
    }

    // 3. Crear notificación interna para el equipo
    try {
      const adminUsers = await prisma.user.findMany({
        where: {
          OR: [
            { role: "ADMIN" },
            { role: "MANAGEMENT" },
            { email: { contains: "guzman" } }
          ],
          isActive: true
        },
        select: { id: true }
      })

      for (const admin of adminUsers) {
        await prisma.internalMessage.create({
          data: {
            subject: `🚀 Nueva Solicitud de Proyecto: ${fullName}`,
            type: "Landing Lead",
            content: `Se ha recibido un nuevo contacto para proyectos tecnológicos:\n\n• Nombre: ${fullName}\n• Teléfono: ${cleanPhone}\n• Correo: ${cleanEmail}\n• Tipo de Proyecto: ${cleanProjectType}\n• Ciudad/Sector: ${cleanCity}\n• Requerimiento: ${cleanMessage}\n\nPuedes atenderlo desde el panel de Solicitudes de Landing.`,
            senderId: admin.id,
            receiverId: admin.id
          }
        }).catch(() => {})
      }
    } catch (notifErr) {
      console.warn("[LANDING_LEAD_NOTIF_WARN]", notifErr)
    }

    return NextResponse.json({
      success: true,
      message: "¡Solicitud recibida con éxito! Nuestro equipo de ingenieros se comunicará contigo de inmediato.",
      lead: leadPayload
    })
  } catch (error: any) {
    console.error("[LANDING_LEADS_POST_ERROR]", error)
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo o escríbenos directamente por WhatsApp." },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const leads: any[] = []

    // 1. Obtener los leads registrados en SystemSetting
    try {
      const leadSettings = await prisma.systemSetting.findMany({
        where: {
          key: { startsWith: "landing_lead_" }
        },
        orderBy: { updatedAt: "desc" },
        take: 100
      })

      for (const s of leadSettings) {
        try {
          const parsed = JSON.parse(s.value)
          leads.push({
            ...parsed,
            settingKey: s.key,
            updatedAt: s.updatedAt
          })
        } catch {
          // Ignorar JSON inválido
        }
      }
    } catch (e) {
      console.warn("[GET_LANDING_LEADS_SETTING_WARN]", e)
    }

    // 2. Traer también clientes creados con fuente LANDING_PROYECTOS que no estén en la lista
    try {
      const clients = await prisma.client.findMany({
        where: {
          source: "LANDING_PROYECTOS"
        },
        orderBy: { createdAt: "desc" },
        take: 50
      })

      for (const c of clients) {
        const alreadyExists = leads.some(l => 
          (l.phone && c.phone && l.phone === c.phone) || 
          (l.email && c.email && l.email === c.email)
        )

        if (!alreadyExists) {
          leads.push({
            id: c.id,
            fullName: c.name,
            firstName: c.firstName || c.name,
            lastName: c.lastName || "",
            email: c.email || "",
            phone: c.phone || "",
            projectType: "Proyecto Residencial / Edificios",
            city: c.city || "Quito",
            message: c.requirement || "",
            status: c.status || "PROSPECTO",
            createdAt: c.createdAt.toISOString()
          })
        }
      }
    } catch (e) {
      console.warn("[GET_LANDING_LEADS_CLIENT_WARN]", e)
    }

    // Ordenar de más reciente a más antiguo
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      total: leads.length,
      leads
    })
  } catch (error: any) {
    console.error("[LANDING_LEADS_GET_ERROR]", error)
    return NextResponse.json({ error: "Error al cargar las solicitudes de landing." }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Faltan id o status" }, { status: 400 })
    }

    const settingKey = id.startsWith("landing_lead_") ? id : `landing_lead_${id}`
    const existing = await prisma.systemSetting.findUnique({
      where: { key: settingKey }
    })

    if (existing) {
      const parsed = JSON.parse(existing.value)
      parsed.status = status
      await prisma.systemSetting.update({
        where: { key: settingKey },
        data: {
          value: JSON.stringify(parsed),
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({ success: true, status })
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar estado" }, { status: 500 })
  }
}
