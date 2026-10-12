import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export interface SupplierItem {
    id: string
    name: string
    contactName: string
    phone: string
    email: string
    city: string
    address?: string
    category: string
    brands: string[]
    discountTerms: string
    creditDays: number
    warrantyNotes: string
    internalNotes?: string
    isPreferred?: boolean
    supplierType?: "MARCA" | "DISTRIBUIDOR" | "SERVICIO" | "IMPORTADOR"
    updatedAt: string
}

const DEFAULT_SUPPLIERS: SupplierItem[] = [
    {
        id: "sup-megatek-ec",
        name: "Megatek Ecuador (Importador Tecnológico)",
        contactName: "Ing. Santiago Andrade",
        phone: "+593 99 789 0123",
        email: "ventas@megatek.com.ec",
        city: "Quito / Guayaquil",
        address: "Av. Amazonas y Eloy Alfaro, Centro de Distribución Norte",
        category: "Seguridad & Redes",
        brands: ["Megatek", "Tuya Smart", "EZVIZ", "Dahua", "Imou", "TP-Link"],
        discountTerms: "45% de descuento por catálogo mayorista; scraping activo de inventario",
        creditDays: 30,
        warrantyNotes: "Garantía de 1 año con cambio inmediato en bodega matriz.",
        internalNotes: "Proveedor principal de extracción de artículos web y catálogo sincronizado.",
        isPreferred: true,
        supplierType: "IMPORTADOR",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-diel-ec",
        name: "Diel Comunicaciones & Electrónica",
        contactName: "Lcda. Mónica Viteri",
        phone: "+593 98 321 6549",
        email: "distribucion@diel.com.ec",
        city: "Quito / Cuenca",
        address: "Av. 10 de Agosto N31-150 y Mariana de Jesús",
        category: "Cerraduras & CCTV",
        brands: ["Diel", "ZKTeco", "Dahua", "Chapas Smart", "Cable UTP"],
        discountTerms: "Margen distribuidor 35% en cerraduras digitales y kits de videoporteros",
        creditDays: 30,
        warrantyNotes: "Garantía de 1 año con soporte técnico y repuestos originales.",
        internalNotes: "Proveedor clave de cerraduras inteligentes N191A y videoporteros analógicos e IP.",
        isPreferred: true,
        supplierType: "DISTRIBUIDOR",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-steren-ec",
        name: "Steren Ecuador (Electrónica & Conectividad)",
        contactName: "Carlos Alomoto",
        phone: "+593 99 444 8899",
        email: "corporativo@steren.com.ec",
        city: "Quito / Guayaquil / Cuenca",
        address: "Av. Naciones Unidas y Shyris, C.C. Quicentro Norte",
        category: "Electrónica & Cables",
        brands: ["Steren", "Steren Smart Home", "Conectores", "Audio"],
        discountTerms: "25% de descuento en línea corporativa y componentes electrónicos",
        creditDays: 15,
        warrantyNotes: "Garantía de 1 año directa en tiendas Steren a nivel nacional.",
        internalNotes: "Proveedor directo de baluns, fuentes de poder, convertidores HDMI y cables.",
        isPreferred: true,
        supplierType: "MARCA",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-dahua-nexsys",
        name: "Dahua Technology Ecuador (Nexsys)",
        contactName: "Ing. Carlos Morales",
        phone: "+593 98 456 7890",
        email: "ventas.dahua@nexsysla.com",
        city: "Quito / Guayaquil",
        address: "Av. 12 de Octubre N24-593 y Lincoln, Edif. Mirage",
        category: "CCTV / Cámaras",
        brands: ["Dahua", "TiOC", "WizSense", "IMOU"],
        discountTerms: "38% de descuento sobre precio de lista mayorista",
        creditDays: 30,
        warrantyNotes: "Garantía directa de 2 años en cámaras y 3 años en NVR. RMA express 48h.",
        internalNotes: "Proveedor clave de proyectos residenciales y corporativos. Hablar con Carlos para reservar stock.",
        isPreferred: true,
        supplierType: "DISTRIBUIDOR",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-hikvision-intcomex",
        name: "Hikvision Ecuador (Intcomex / Macroseg)",
        contactName: "Lcda. Valeria Benalcázar",
        phone: "+593 99 123 4567",
        email: "valeria.benalcazar@intcomex.com",
        city: "Guayaquil",
        address: "Parque Empresarial Colón, Edif. Corporativo 2",
        category: "CCTV / Cámaras",
        brands: ["Hikvision", "HiLook", "EZVIZ", "AX PRO"],
        discountTerms: "42% de descuento en proyectos certificados; 35% en compras corrientes",
        creditDays: 30,
        warrantyNotes: "Garantía de 2 años. Cambio inmediato en bodega de Guayaquil para fallas de fábrica.",
        internalNotes: "Excelente catálogo en cámaras ColorVu con audio integrado y sistemas térmicos.",
        isPreferred: true,
        supplierType: "IMPORTADOR",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-zkteco-latam",
        name: "ZKTeco Ecuador (Seguridad Biométrica)",
        contactName: "Roberto Méndez",
        phone: "+593 98 765 4321",
        email: "canales.ec@zkteco.com",
        city: "Quito",
        address: "Av. República del Salvador y Shirys, Edif. Alianza",
        category: "Biometría & Acceso",
        brands: ["ZKTeco", "ZKBioAccess", "ZKBioTime"],
        discountTerms: "32% margen distribuidor oficial + Licencias de software ZKBioTime gratis por órdenes > $1,500",
        creditDays: 15,
        warrantyNotes: "Garantía 1 año en terminales faciales y cerraduras. Soporte técnico nivel 2 incluido.",
        internalNotes: "Prioridad para proyectos de control de asistencia, torniquetes y chapas electromagnéticas.",
        isPreferred: true,
        supplierType: "MARCA",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-intelbras-redes",
        name: "Intelbras Latam / Tecnosinergia",
        contactName: "Ing. Mauricio Peña",
        phone: "+593 99 876 5432",
        email: "mpena@intelbraslatam.com",
        city: "Guayaquil",
        address: "Vía a Daule Km 6.5, Complejo Industrial Sigma",
        category: "Redes & Telefonía",
        brands: ["Intelbras", "Twibi", "Alloy"],
        discountTerms: "35% de descuento por pronto pago; flete bonificado a nivel nacional",
        creditDays: 20,
        warrantyNotes: "Garantía de 1 año en switches PoE y routers industriales.",
        internalNotes: "Recomendado para enlaces de edificios, intercomunicadores IP y PBX virtual.",
        isPreferred: false,
        supplierType: "MARCA",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-jfl-alarmas",
        name: "JFL Alarmas & Cercas Eléctricas",
        contactName: "Andrea Salazar",
        phone: "+593 96 333 4444",
        email: "soporte@jflalarmas.ec",
        city: "Guayaquil / Machala",
        address: "C.C. Las Vitrinas, Local 18",
        category: "Alarmas & Cercos",
        brands: ["JFL Brasil", "Genno", "Hagroy"],
        discountTerms: "40% en energizadores de cerco eléctrico y 30% en sensores infrarrojos",
        creditDays: 15,
        warrantyNotes: "Cambio inmediato de tarjetas principales ante descarga eléctrica o rayo (1 evento por equipo).",
        internalNotes: "El mejor proveedor en robustez para cerramientos perimetrales y quintas campestres.",
        isPreferred: true,
        supplierType: "DISTRIBUIDOR",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-servientrega-logistica",
        name: "Servientrega Ecuador (Logística Express)",
        contactName: "Mesa de Operaciones Corporativas",
        phone: "+593 2 373 2000",
        email: "corporativo@servientrega.com.ec",
        city: "Nacional (24 Provincias)",
        address: "Av. Eloy Alfaro y De los Granados",
        category: "Logística & Envíos",
        brands: ["Servientrega", "Guías con Seguro", "Entrega 24 Horas"],
        discountTerms: "Tarifa preferencial corporativa ATOMIC $3.80 por guía hasta 2kg asegurada",
        creditDays: 15,
        warrantyNotes: "Seguro al 100% del valor declarado ante extravío o siniestro de hardware.",
        internalNotes: "Servicio aliado para entrega de pedidos a clientes y recepción de repuestos desde bodegas mayoristas.",
        isPreferred: true,
        supplierType: "SERVICIO",
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-lab-calibracion",
        name: "Laboratorio Técnico RMA & Microelectrónica",
        contactName: "Ing. Paul Guanochanga",
        phone: "+593 98 222 7711",
        email: "laboratorio@atomic.ec",
        city: "Quito",
        address: "Laboratorio Técnico Matriz ATOMIC",
        category: "Servicio Técnico & RMA",
        brands: ["Diagnóstico RMA", "Micro-soldadura", "Calibración Lentes CCTV"],
        discountTerms: "Costo interno bonificado para reparaciones y mantenimiento de clientes ATOMIC",
        creditDays: 30,
        warrantyNotes: "Garantía de 90 días en cada reparación efectuada con informe técnico firmado.",
        internalNotes: "Servicio de diagnóstico rápido para fuentes quemadas, NVRs bloqueados y actualización de firmwares.",
        isPreferred: true,
        supplierType: "SERVICIO",
        updatedAt: new Date().toISOString()
    }
]

async function getStoredSuppliers(): Promise<SupplierItem[]> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "ATOMIC_SUPPLIERS" }
        })

        if (setting && setting.value) {
            const parsed = JSON.parse(setting.value)
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed
            }
        }

        // Initialize with default suppliers
        await prisma.systemSetting.upsert({
            where: { key: "ATOMIC_SUPPLIERS" },
            create: {
                key: "ATOMIC_SUPPLIERS",
                value: JSON.stringify(DEFAULT_SUPPLIERS),
                description: "Directorio maestro de proveedores y tratos comerciales de ATOMIC ERP"
            },
            update: {
                value: JSON.stringify(DEFAULT_SUPPLIERS)
            }
        })

        return DEFAULT_SUPPLIERS
    } catch (e) {
        console.error("Error reading suppliers from DB, using defaults:", e)
        return DEFAULT_SUPPLIERS
    }
}

async function saveStoredSuppliers(suppliers: SupplierItem[]): Promise<boolean> {
    try {
        await prisma.systemSetting.upsert({
            where: { key: "ATOMIC_SUPPLIERS" },
            create: {
                key: "ATOMIC_SUPPLIERS",
                value: JSON.stringify(suppliers),
                description: "Directorio maestro de proveedores y tratos comerciales de ATOMIC ERP"
            },
            update: {
                value: JSON.stringify(suppliers),
                updatedAt: new Date()
            }
        })
        return true
    } catch (e) {
        console.error("Error saving suppliers to DB:", e)
        return false
    }
}

export async function GET() {
    try {
        const suppliers = await getStoredSuppliers()
        return NextResponse.json({
            success: true,
            total: suppliers.length,
            suppliers
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Error al obtener proveedores" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userRole = (session?.user as any)?.role?.toUpperCase() || ""
        // Allowed roles: ADMIN, SUPERVISOR, COORDINATOR, MANAGEMENT, JEFE_TECNICO
        if (
            userRole !== "ADMIN" && 
            userRole !== "SUPERVISOR" && 
            userRole !== "COORDINATOR" && 
            userRole !== "MANAGEMENT" && 
            userRole !== "JEFE_TECNICO"
        ) {
            return NextResponse.json({ error: "No autorizado. Solo Administradores y Coordinación pueden gestionar proveedores." }, { status: 403 })
        }

        const body = await req.json()
        if (!body.name || !body.phone) {
            return NextResponse.json({ error: "Nombre y teléfono son requeridos." }, { status: 400 })
        }

        const suppliers = await getStoredSuppliers()
        const newSupplier: SupplierItem = {
            id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: body.name.trim(),
            contactName: body.contactName ? body.contactName.trim() : "Asesor Comercial",
            phone: body.phone.trim(),
            email: body.email ? body.email.trim() : "",
            city: body.city ? body.city.trim() : "Ecuador",
            address: body.address ? body.address.trim() : "",
            category: body.category ? body.category.trim() : "General",
            brands: Array.isArray(body.brands) ? body.brands : (body.brands ? [body.brands] : []),
            discountTerms: body.discountTerms ? body.discountTerms.trim() : "Condiciones estándar",
            creditDays: Number(body.creditDays) || 0,
            warrantyNotes: body.warrantyNotes ? body.warrantyNotes.trim() : "Garantía según fabricante",
            internalNotes: body.internalNotes ? body.internalNotes.trim() : "",
            isPreferred: Boolean(body.isPreferred),
            updatedAt: new Date().toISOString()
        }

        suppliers.unshift(newSupplier)
        await saveStoredSuppliers(suppliers)

        return NextResponse.json({
            success: true,
            message: "Proveedor registrado con éxito",
            supplier: newSupplier
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Error al guardar proveedor" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userRole = (session?.user as any)?.role?.toUpperCase() || ""
        if (
            userRole !== "ADMIN" && 
            userRole !== "SUPERVISOR" && 
            userRole !== "COORDINATOR" && 
            userRole !== "MANAGEMENT" && 
            userRole !== "JEFE_TECNICO"
        ) {
            return NextResponse.json({ error: "No autorizado para editar proveedores." }, { status: 403 })
        }

        const body = await req.json()
        if (!body.id) {
            return NextResponse.json({ error: "ID del proveedor requerido" }, { status: 400 })
        }

        const suppliers = await getStoredSuppliers()
        const index = suppliers.findIndex(s => s.id === body.id)
        if (index === -1) {
            return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
        }

        suppliers[index] = {
            ...suppliers[index],
            name: body.name !== undefined ? body.name.trim() : suppliers[index].name,
            contactName: body.contactName !== undefined ? body.contactName.trim() : suppliers[index].contactName,
            phone: body.phone !== undefined ? body.phone.trim() : suppliers[index].phone,
            email: body.email !== undefined ? body.email.trim() : suppliers[index].email,
            city: body.city !== undefined ? body.city.trim() : suppliers[index].city,
            address: body.address !== undefined ? body.address.trim() : suppliers[index].address,
            category: body.category !== undefined ? body.category.trim() : suppliers[index].category,
            brands: body.brands !== undefined ? (Array.isArray(body.brands) ? body.brands : [body.brands]) : suppliers[index].brands,
            discountTerms: body.discountTerms !== undefined ? body.discountTerms.trim() : suppliers[index].discountTerms,
            creditDays: body.creditDays !== undefined ? Number(body.creditDays) : suppliers[index].creditDays,
            warrantyNotes: body.warrantyNotes !== undefined ? body.warrantyNotes.trim() : suppliers[index].warrantyNotes,
            internalNotes: body.internalNotes !== undefined ? body.internalNotes.trim() : suppliers[index].internalNotes,
            isPreferred: body.isPreferred !== undefined ? Boolean(body.isPreferred) : suppliers[index].isPreferred,
            updatedAt: new Date().toISOString()
        }

        await saveStoredSuppliers(suppliers)

        return NextResponse.json({
            success: true,
            message: "Proveedor actualizado con éxito",
            supplier: suppliers[index]
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Error al actualizar proveedor" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userRole = (session?.user as any)?.role?.toUpperCase() || ""
        if (userRole !== "ADMIN" && userRole !== "MANAGEMENT") {
            return NextResponse.json({ error: "Solo Administradores pueden eliminar proveedores." }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) {
            return NextResponse.json({ error: "ID de proveedor requerido" }, { status: 400 })
        }

        let suppliers = await getStoredSuppliers()
        suppliers = suppliers.filter(s => s.id !== id)
        await saveStoredSuppliers(suppliers)

        return NextResponse.json({
            success: true,
            message: "Proveedor eliminado"
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Error al eliminar proveedor" }, { status: 500 })
    }
}
