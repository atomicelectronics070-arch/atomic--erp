import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export interface VisitorHitInput {
    visitorId: string
    path: string
    referrer?: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
    device?: string | null
    browser?: string | null
    os?: string | null
    ip?: string | null
    city?: string | null
    userId?: string | null
    userEmail?: string | null
    userName?: string | null
    userRole?: string | null
}

export interface CartTelemetryInput {
    visitorId: string
    items: Array<{
        id: string
        name: string
        price: number
        quantity: number
        image?: string
    }>
    totalAmount: number
    itemsCount: number
    sourceUrl?: string | null
    userId?: string | null
    userEmail?: string | null
    userName?: string | null
    userPhone?: string | null
    status?: "ABANDONADO" | "EN_PROCESO" | "COTIZADO" | "COMPRADO"
    lastAction?: string | null
}

/**
 * Clasificador inteligente de campañas de marketing de ATOMIC
 * Mapea tráfico proveniente de las estrategias de Alex y Santiago:
 * - MARCA_PERSONAL: TikTok personal Santiago, videos biográficos, canal YouTube personal
 * - ATOMIC_RESIDENCIAL: Domótica, cerraduras inteligentes, campanas extractoras, cocina
 * - ATOMIC_SYSTEMS: Control de accesos, videoporteros, barreras vehiculares, torniquetes, CCTV
 * - EMPLEO: Convocatorias laborales, bolsa de trabajo (/contrataciones)
 * - CATALOGO_GENERAL: Tráfico general al ecommerce / cotizador
 */
export function detectCampaignTag(
    path: string,
    utmSource?: string | null,
    utmCampaign?: string | null,
    referrer?: string | null
): string {
    const p = (path || "").toLowerCase()
    const src = (utmSource || "").toLowerCase()
    const camp = (utmCampaign || "").toLowerCase()
    const ref = (referrer || "").toLowerCase()

    if (
        camp.includes("personal") ||
        camp.includes("santiago") ||
        src.includes("santiagoguzman") ||
        src.includes("tiktok_santiago") ||
        p.includes("santiago-guzman") ||
        p.includes("juan-pablo-guzman")
    ) {
        return "MARCA_PERSONAL"
    }

    if (
        camp.includes("empleo") ||
        camp.includes("vacante") ||
        camp.includes("contratacion") ||
        p.includes("contrataciones") ||
        p.includes("empleo")
    ) {
        return "EMPLEO"
    }

    if (
        camp.includes("residencial") ||
        camp.includes("hogar") ||
        p.includes("campanas") ||
        p.includes("cocina") ||
        p.includes("cerraduras") ||
        p.includes("domotica") ||
        src.includes("juanguzman") ||
        src.includes("tiktok_unboxing")
    ) {
        return "ATOMIC_RESIDENCIAL"
    }

    if (
        camp.includes("systems") ||
        camp.includes("industrial") ||
        camp.includes("seguridad") ||
        p.includes("videoporteros") ||
        p.includes("antipanico") ||
        p.includes("barreras") ||
        p.includes("camaras") ||
        p.includes("intercomunicacion") ||
        p.includes("torniquetes")
    ) {
        return "ATOMIC_SYSTEMS"
    }

    return "CATALOGO_GENERAL"
}

/**
 * Registra un impacto de visita en visitor_logs
 */
export async function recordVisitorHit(data: VisitorHitInput): Promise<void> {
    try {
        const id = randomUUID()
        const campaignTag = detectCampaignTag(data.path, data.utmSource, data.utmCampaign, data.referrer)
        const userRole = data.userRole || "GUEST"

        await prisma.$executeRawUnsafe(
            `
            INSERT INTO visitor_logs (
                id, visitor_id, user_id, user_email, user_name, user_role,
                path, referrer, utm_source, utm_medium, utm_campaign, utm_content,
                campaign_tag, device, browser, os, ip, city, created_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12,
                $13, $14, $15, $16, $17, $18, NOW()
            )
            `,
            id,
            data.visitorId,
            data.userId || null,
            data.userEmail || null,
            data.userName || null,
            userRole,
            data.path,
            data.referrer || null,
            data.utmSource || null,
            data.utmMedium || null,
            data.utmCampaign || null,
            data.utmContent || null,
            campaignTag,
            data.device || "desktop",
            data.browser || null,
            data.os || null,
            data.ip || null,
            data.city || null
        )

        // Actualizar contador global rápido en SystemSetting
        const todayStr = new Date().toISOString().slice(0, 10)
        await prisma.systemSetting.upsert({
            where: { key: `visits_${todayStr}` },
            update: { value: String((parseInt((await prisma.systemSetting.findUnique({ where: { key: `visits_${todayStr}` } }))?.value || "0") || 0) + 1) },
            create: { key: `visits_${todayStr}`, value: "1", description: `Visitas del día ${todayStr}` }
        }).catch(() => {})

    } catch (error) {
        console.error("Error en recordVisitorHit:", error)
    }
}

/**
 * Registra o actualiza el carrito en cart_telemetry
 */
export async function recordCartTelemetry(data: CartTelemetryInput): Promise<void> {
    try {
        const campaignTag = detectCampaignTag(data.sourceUrl || "", null, null, null)
        const status = data.status || "ABANDONADO"
        const itemsJson = JSON.stringify(data.items || [])

        // Upsert por visitor_id en cart_telemetry
        const existing = await prisma.$queryRawUnsafe<any[]>(
            `SELECT id FROM cart_telemetry WHERE visitor_id = $1 LIMIT 1`,
            data.visitorId
        )

        if (existing && existing.length > 0) {
            await prisma.$executeRawUnsafe(
                `
                UPDATE cart_telemetry SET
                    user_id = COALESCE($1, user_id),
                    user_email = COALESCE($2, user_email),
                    user_name = COALESCE($3, user_name),
                    user_phone = COALESCE($4, user_phone),
                    items_data = $5::jsonb,
                    total_amount = $6,
                    items_count = $7,
                    source_url = $8,
                    campaign_tag = $9,
                    status = $10,
                    last_action = $11,
                    updated_at = NOW()
                WHERE visitor_id = $12
                `,
                data.userId || null,
                data.userEmail || null,
                data.userName || null,
                data.userPhone || null,
                itemsJson,
                data.totalAmount || 0,
                data.itemsCount || 0,
                data.sourceUrl || null,
                campaignTag,
                status,
                data.lastAction || "Actualización de carrito",
                data.visitorId
            )
        } else {
            const id = randomUUID()
            await prisma.$executeRawUnsafe(
                `
                INSERT INTO cart_telemetry (
                    id, visitor_id, user_id, user_email, user_name, user_phone,
                    items_data, total_amount, items_count, source_url,
                    campaign_tag, status, last_action, created_at, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6,
                    $7::jsonb, $8, $9, $10,
                    $11, $12, $13, NOW(), NOW()
                )
                `,
                id,
                data.visitorId,
                data.userId || null,
                data.userEmail || null,
                data.userName || null,
                data.userPhone || null,
                itemsJson,
                data.totalAmount || 0,
                data.itemsCount || 0,
                data.sourceUrl || null,
                campaignTag,
                status,
                data.lastAction || "Creación de carrito"
            )
        }
    } catch (error) {
        console.error("Error en recordCartTelemetry:", error)
    }
}

/**
 * Obtiene el reporte integral de telemetría para el supervisor / administrador
 */
export async function getTelemetryReport(days: number = 7) {
    try {
        // 1. Estadísticas de Visitas por Día
        const dailyVisits = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM-DD') as date_str,
                TO_CHAR(created_at, 'Dy DD/MM') as label,
                COUNT(*)::int as total_views,
                COUNT(DISTINCT visitor_id)::int as unique_visitors
            FROM visitor_logs
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD'), TO_CHAR(created_at, 'Dy DD/MM')
            ORDER BY date_str ASC
        `)

        // 2. Visitas Totales de Hoy
        const todayStats = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                COUNT(*)::int as today_views,
                COUNT(DISTINCT visitor_id)::int as today_visitors,
                COUNT(CASE WHEN user_role = 'CONSUMIDOR' THEN 1 END)::int as today_buyers,
                COUNT(CASE WHEN user_role = 'SALESPERSON' THEN 1 END)::int as today_sellers,
                COUNT(CASE WHEN user_role = 'GUEST' THEN 1 END)::int as today_guests
            FROM visitor_logs
            WHERE created_at >= CURRENT_DATE
        `)

        // 3. Desglose de Tráfico por Campaña de Marketing (Alex & Santiago)
        const campaignTraffic = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                campaign_tag,
                COUNT(*)::int as total_hits,
                COUNT(DISTINCT visitor_id)::int as unique_visitors
            FROM visitor_logs
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY campaign_tag
            ORDER BY total_hits DESC
        `)

        // 4. Últimos Visitantes en Vivo (Mapeo exacto de ruta, origen y usuario)
        const recentVisitors = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                id, visitor_id, user_name, user_email, user_role,
                path, referrer, utm_source, utm_campaign, campaign_tag,
                device, city, created_at
            FROM visitor_logs
            ORDER BY created_at DESC
            LIMIT 50
        `)

        // 5. Carritos Casi Comprados (Carritos Abandonados & En Proceso)
        const cartStats = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                COUNT(*)::int as total_carts,
                COUNT(CASE WHEN status = 'ABANDONADO' THEN 1 END)::int as abandoned_carts,
                COALESCE(SUM(total_amount), 0)::float as total_cart_value,
                COUNT(CASE WHEN items_count > 0 THEN 1 END)::int as active_carts_with_items
            FROM cart_telemetry
            WHERE updated_at >= NOW() - INTERVAL '30 days'
        `)

        const recentCarts = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                id, visitor_id, user_name, user_email, user_phone,
                items_data, total_amount, items_count, source_url,
                campaign_tag, status, last_action, updated_at
            FROM cart_telemetry
            WHERE items_count > 0
            ORDER BY updated_at DESC
            LIMIT 25
        `)

        // 6. Actividad de Usuarios Registrados en Base de Datos + Métricas IA & Plataforma
        const [
            registeredUsers,
            recentRegisteredUsers,
            quotesCount,
            webOrdersCount,
            waConversationsCount,
            waMessagesCount,
            personalBotUsersCount,
            personalBotMessagesCount,
            activeProductsCount,
            clientsCount,
            enrollmentsCount
        ] = await Promise.all([
            prisma.user.groupBy({
                by: ["role"],
                _count: { _all: true }
            }),
            prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                take: 15,
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true
                }
            }),
            prisma.quote.count(),
            prisma.webOrder.count(),
            prisma.wAConversation.count(),
            prisma.wAMessage.count(),
            prisma.personalBotMemory.count().catch(() => 0),
            prisma.personalBotMessage.count().catch(() => 0),
            prisma.product.count({ where: { isDeleted: false } }),
            prisma.client.count(),
            prisma.courseEnrollment.count()
        ])

        const totalRegisteredUsers = registeredUsers.reduce((acc, r) => acc + r._count._all, 0)
        const buyersCount = registeredUsers
            .filter(u => u.role.toUpperCase().includes("CONSUMIDOR"))
            .reduce((acc, r) => acc + r._count._all, 0)
        const sellersCount = registeredUsers
            .filter(u => u.role.toUpperCase().includes("SALESPERSON"))
            .reduce((acc, r) => acc + r._count._all, 0)

        // 7. Generación de Diagnóstico Inteligente Automatizado (BI Insights)
        const topCampaign = campaignTraffic[0]?.campaign_tag || "CATALOGO_GENERAL"
        const viewsToday = todayStats[0]?.today_views || 0
        const visitorsToday = todayStats[0]?.today_visitors || 0
        const abandonedCartsCount = cartStats[0]?.abandoned_carts || 0
        const abandonedCartValue = cartStats[0]?.total_cart_value || 0

        const intelligentReport = {
            resumenEjecutivo: `Durante las últimas 24 horas se han registrado ${viewsToday} impactos al dominio con ${visitorsToday} visitantes únicos. La plataforma cuenta con ${totalRegisteredUsers} usuarios registrados (${buyersCount} compradores, ${sellersCount} vendedores), ${quotesCount} cotizaciones y ${waMessagesCount} mensajes procesados en WhatsApp/IA. La campaña líder actual es ${topCampaign}.`,
            recomendacionMarketing: topCampaign === "MARCA_PERSONAL"
                ? "El tráfico desde la marca personal de Santiago Guzmán presenta alta atención. Se recomienda enlazar el CTA directamente a los combos de mayor rotación (Cerraduras biométricas o Videoporteros) para acelerar la conversión de visitantes en compradores registrados."
                : topCampaign === "EMPLEO"
                ? "La convocatoria de empleo está captando prospectos. Es ideal dirigir el flujo de postulantes al programa de capacitación de la academia para filtrar a los mejores perfiles."
                : "Impulsar las publicaciones de video con Alex enfocadas en resolución de problemas técnicos para incrementar las cotizaciones de Atomic Systems y Atomic Residencial.",
            alertaConversion: abandonedCartsCount > 0 
                ? `Hay ${abandonedCartsCount} carritos casi comprados por $${abandonedCartValue.toLocaleString("es-EC", { minimumFractionDigits: 2 })} USD en espera. Conectar vía WhatsApp a los usuarios identificados para ofrecer asistencia técnica o cierre con descuento especial.`
                : "El flujo de carritos se mantiene saludable y sin acumulaciones anómalas."
        }

        return {
            dailyVisits,
            todayStats: todayStats[0] || { today_views: 0, today_visitors: 0, today_buyers: 0, today_sellers: 0, today_guests: 0 },
            campaignTraffic,
            recentVisitors,
            cartStats: cartStats[0] || { total_carts: 0, abandoned_carts: 0, total_cart_value: 0, active_carts_with_items: 0 },
            recentCarts,
            userBase: {
                total: totalRegisteredUsers,
                buyers: buyersCount,
                sellers: sellersCount,
                rolesBreakdown: registeredUsers.map(r => ({ role: r.role, count: r._count._all })),
                recentRegistrations: recentRegisteredUsers
            },
            aiAndPlatform: {
                quotesCount,
                webOrdersCount,
                waConversationsCount,
                waMessagesCount,
                personalBotUsersCount,
                personalBotMessagesCount,
                activeProductsCount,
                clientsCount,
                enrollmentsCount
            },
            intelligentReport
        }

    } catch (error) {
        console.error("Error en getTelemetryReport:", error)
        throw error
    }
}
