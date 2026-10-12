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
    updatedAt: string
}

const DEFAULT_SUPPLIERS: SupplierItem[] = [
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
        brands: ["JFL Brasil", "Genno"],
        discountTerms: "40% en energizadores de cerco eléctrico y 30% en sensores infrarrojos",
        creditDays: 15,
        warrantyNotes: "Cambio inmediato de tarjetas principales ante descarga eléctrica o rayo (1 evento por equipo).",
        internalNotes: "El mejor proveedor en robustez para cerramientos perimetrales y quintas campestres.",
        isPreferred: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-ubiquiti-megared",
        name: "Megared Ecuador (Ubiquiti & MikroTik)",
        contactName: "David Albarracín",
        phone: "+593 98 111 2233",
        email: "david@megared.com.ec",
        city: "Quito",
        address: "Av. Orellana E4-44 y 6 de Diciembre",
        category: "Redes & Wi-Fi",
        brands: ["Ubiquiti UniFi", "MikroTik", "TP-Link Omada"],
        discountTerms: "28% sobre PVP; certificación oficial con descuento para técnicos de ATOMIC",
        creditDays: 30,
        warrantyNotes: "Garantía de fábrica 1 año. Stock local permanente de antenas NanoStation y APs WiFi 6.",
        internalNotes: "Comprar aquí todo el equipamiento de enlace para fincas y enlaces punto a punto.",
        isPreferred: false,
        updatedAt: new Date().toISOString()
    },
    {
        id: "sup-powest-ups",
        name: "Powest / APC Schneider (Sistemas de Energía)",
        contactName: "Gabriela Torres",
        phone: "+593 99 555 7788",
        email: "ups.ecuador@powest.com",
        city: "Guayaquil",
        address: "Av. Juan Tanca Marengo Km 2.5",
        category: "Energía & Respaldo",
        brands: ["Powest", "APC", "Forza", "CSB Battery"],
        discountTerms: "Descuento por volumen en baterías secas 12V 7Ah / 9Ah ($11.50 neto por unidad por caja de 10)",
        creditDays: 30,
        warrantyNotes: "Garantía 2 años en UPS Online y 1 año en bancos de baterías.",
        internalNotes: "Suministro crítico para garantizar que los sistemas de seguridad sigan operando en cortes de luz.",
        isPreferred: true,
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
