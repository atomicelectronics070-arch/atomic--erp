"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
    CalendarCheck, CheckCircle2, Circle, Plus, Trash2, 
    MessageSquare, Copy, Check, ExternalLink, Share2, 
    Flame, ShoppingBag, FolderTree, ChevronRight, ChevronDown, 
    ArrowRight, Clock, Target, DollarSign, Award, 
    Zap, Sparkles, AlertCircle, RefreshCw, X, ShieldCheck, 
    Search, Layers, Send, Smartphone, Users, Wrench, Video, Code2, 
    FileText, UserCheck, ShieldAlert, Globe, Download
} from "lucide-react"
import SalesCopyManager from "./SalesCopyManager"
import { getCategoryLandingSlug } from "./SuicideSquadWarRoom"
import { sanitizeProductPrice, sanitizeProductImage } from "@/lib/productSanitizer"
import { getCategoryBySlug } from "@/lib/data/suicideSquadCategories"
import { generateCategoryCatalogPDF } from "@/lib/pdf/categoryCatalogPdf"

export type RoleType = "VENTAS" | "COORDINACION" | "SUPERVISION" | "TECNICO" | "EDICION" | "SOFTWARE"

export interface DailyActivity {
    id: string
    title: string
    description: string
    category: "ventas" | "marketplace" | "seguimiento" | "operaciones" | "tecnico" | "desarrollo"
    priority: "ALTA" | "MEDIA" | "RUTINA"
    completed: boolean
    completedAt?: string
    isCustom?: boolean
    meta?: string
    canal?: string
}

// ── 1. LAS 7 ACTIVIDADES OFICIALES DEL PLAN LABORAL DE VENTAS (30 DÍAS) ──
const VENTAS_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-v1",
        title: "1. Cinco Publicaciones Diarias en Marketplace",
        description: "Publicar exactamente 5 productos específicos de tu categoría con fotos optimizadas y precios oficiales en Facebook Marketplace.",
        category: "marketplace",
        priority: "ALTA",
        meta: "5 publicaciones diarias",
        canal: "Facebook Marketplace",
        completed: false
    },
    {
        id: "act-v2",
        title: "2. Difusión en 3 Grupos de Redes Sociales",
        description: "Compartir tus publicaciones en al menos 3 grupos comunitarios o comerciales locales (compra-venta, constructoras, tecnología).",
        category: "marketplace",
        priority: "ALTA",
        meta: "3 grupos diarios mínimo",
        canal: "Grupos de Facebook / Comunidades",
        completed: false
    },
    {
        id: "act-v3",
        title: "3. Búsqueda y Prospección de 10 Números Telefónicos",
        description: "Investigar y registrar 10 números de teléfono de clientes potenciales afines a tu categoría usando Google Maps o directorios.",
        category: "ventas",
        priority: "ALTA",
        meta: "10 contactos calificados",
        canal: "Google Maps / Directorios",
        completed: false
    },
    {
        id: "act-v4",
        title: "4. Siete Llamadas Diarias Grabadas por Zoom",
        description: "Realizar 7 llamadas telefónicas efectivas conectado en sala Zoom con la coordinadora para respaldo, grabación y apoyo en el cierre.",
        category: "ventas",
        priority: "ALTA",
        meta: "7 llamadas efectivas",
        canal: "Zoom con Supervisión / Teléfono",
        completed: false
    },
    {
        id: "act-v5",
        title: "5. Seguimiento Comercial y Cotizaciones Formales",
        description: "Dar respuesta inmediata a prospectos y emitir cotizaciones formales en PDF/Excel con PVP Público, IVA y garantía de 1 año.",
        category: "ventas",
        priority: "ALTA",
        meta: "Atención inmediata",
        canal: "WhatsApp / Cotizador PROP",
        completed: false
    },
    {
        id: "act-v6",
        title: "6. Difusión Promocional (Lunes y Miércoles)",
        description: "Enviar la promoción flash o catálogo semanal a toda tu base de contactos acumulada para madurar ventas de prospectos anteriores.",
        category: "seguimiento",
        priority: "MEDIA",
        meta: "2 veces por semana (Lun/Mié)",
        canal: "WhatsApp Masivo a Contactos",
        completed: false
    },
    {
        id: "act-v7",
        title: "7. Estados Personales en Redes Sociales",
        description: "Publicar al menos 2 veces por semana los productos estrella en tus estados personales de WhatsApp y Facebook Stories.",
        category: "marketplace",
        priority: "MEDIA",
        meta: "2 veces por semana mínimo",
        canal: "WhatsApp Status / Facebook Stories",
        completed: false
    }
]

// ── 2. RUTINA OPERATIVA OFICIAL DE COORDINACIÓN ──
const COORDINACION_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-c1",
        title: "1. Apertura de Jornada Operativa (9:00 AM)",
        description: "Abrir formalmente el grupo comercial, publicar directivas matutinas y reportar novedades de stock crítico en ATOMIC.",
        category: "operaciones",
        priority: "ALTA",
        meta: "09:00 AM puntual",
        canal: "Grupo WhatsApp & Plataforma",
        completed: false
    },
    {
        id: "act-c2",
        title: "2. Asignación de Contactos Directos a Asesores",
        description: "Entregar paquetes de 10 contactos calificados extraídos de Google Maps o pautas a cada asesor activo en el sistema.",
        category: "operaciones",
        priority: "ALTA",
        meta: "10 contactos / asesor",
        canal: "Módulo Asignación Coordinación",
        completed: false
    },
    {
        id: "act-c3",
        title: "3. Sala Zoom de Llamadas Grabadas (Supervisión)",
        description: "Abrir sala Zoom grupal y grabar las 7 llamadas comerciales de cada asesor para validar asistencia y otorgar coaching.",
        category: "ventas",
        priority: "ALTA",
        meta: "100% llamadas grabadas",
        canal: "Zoom Corporativo",
        completed: false
    },
    {
        id: "act-c4",
        title: "4. Auditoría y Aprobación de Cotizaciones (DRAFT)",
        description: "Revisar cotizaciones emitidas por los asesores, verificar que apliquen PVP público con IVA y aprobarlas para despacho.",
        category: "operaciones",
        priority: "ALTA",
        meta: "Cero cotizaciones pendientes",
        canal: "Panel Cotizaciones Coordinación",
        completed: false
    },
    {
        id: "act-c5",
        title: "5. Bitácora de Casos Especiales y B2B",
        description: "Registrar recordatorios de seguimiento a clientes corporativos y resolver dudas u objeciones técnicas de los asesores.",
        category: "seguimiento",
        priority: "MEDIA",
        meta: "Registro diario al día",
        canal: "Bitácora de Coordinación",
        completed: false
    },
    {
        id: "act-c6",
        title: "6. Cierre de Jornada (5:00 PM) & Reporte Diario",
        description: "Cerrar el grupo de trabajo, consolidar asistencias de vendedores y enviar balance de cotizaciones generadas a gerencia.",
        category: "operaciones",
        priority: "ALTA",
        meta: "17:00 PM cierre oficial",
        canal: "Reporte Ejecutivo ERP",
        completed: false
    }
]

// ── 3. RUTINA OPERATIVA DE SUPERVISIÓN ──
const SUPERVISION_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-s1",
        title: "1. Auditoría de Apertura y Asistencia de Cuadrillas",
        description: "Verificar inicio puntual a las 9:00 AM tanto de coordinación como de los asesores en sus respectivas categorías.",
        category: "operaciones",
        priority: "ALTA",
        meta: "Control 9:00 AM",
        canal: "Módulo de Asistencia",
        completed: false
    },
    {
        id: "act-s2",
        title: "2. Muestreo de Calidad en Marketplace y Grupos",
        description: "Inspección aleatoria de las 5 publicaciones diarias y 3 grupos por vendedor para asegurar fotos de alta calidad y precios oficiales.",
        category: "marketplace",
        priority: "ALTA",
        meta: "Muestreo aleatorio",
        canal: "Auditoría Redes",
        completed: false
    },
    {
        id: "act-s3",
        title: "3. Evaluación de Grabaciones Zoom & Objeciones",
        description: "Revisar grabaciones de llamadas comerciales para detectar cuellos de botella y brindar retroalimentación directa a los asesores.",
        category: "ventas",
        priority: "ALTA",
        meta: "Auditoría de llamadas",
        canal: "Grabaciones Zoom",
        completed: false
    },
    {
        id: "act-s4",
        title: "4. Control de Cumplimiento de Metas ($400/día)",
        description: "Supervisar avance individual y colectivo hacia la Meta Empresarial de $30k/mes y empujar cierres de cotizaciones en curso.",
        category: "ventas",
        priority: "ALTA",
        meta: "Avance hacia $30k/mes",
        canal: "Meta Empresarial Dashboard",
        completed: false
    },
    {
        id: "act-s5",
        title: "5. Balance Operativo de Cierre & Reporte a Dirección",
        description: "Consolidar facturación aprobada del día, órdenes de despacho por Servientrega y planificar directivas de la siguiente jornada.",
        category: "operaciones",
        priority: "ALTA",
        meta: "Informe diario gerencial",
        canal: "Dirección ATOMIC",
        completed: false
    }
]

// ── 4. RUTINAS PARA TÉCNICO, EDICIÓN Y SOFTWARE ──
const TECNICO_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-t1",
        title: "1. Confirmación de Agenda e Instalaciones del Día",
        description: "Revisar órdenes de trabajo, contactos de clientes, direcciones y horarios programados para visitas a domicilio u obra.",
        category: "tecnico",
        priority: "ALTA",
        meta: "Confirmación matutina",
        canal: "Agenda Técnica ERP",
        completed: false
    },
    {
        id: "act-t2",
        title: "2. Inspección de Equipos, Materiales y Herramientas",
        description: "Probar videoporteros, cerraduras, motores o cámaras en banco de pruebas antes de salir al sitio del cliente.",
        category: "tecnico",
        priority: "ALTA",
        meta: "Checklist de materiales",
        canal: "Bodega ATOMIC",
        completed: false
    },
    {
        id: "act-t3",
        title: "3. Ejecución de Instalación y Protocolo de Montaje",
        description: "Realizar cableado estructurado, fijación estética, configuración de red IP y pruebas de apertura remota.",
        category: "tecnico",
        priority: "ALTA",
        meta: "Estándar de calidad",
        canal: "En Obra / Sitio",
        completed: false
    },
    {
        id: "act-t4",
        title: "4. Capacitación al Cliente y Firma de Acta de Entrega",
        description: "Enseñar al cliente el uso de la app móvil (Tuya/Hik-Connect), entregar manual de usuario y obtener firma de conformidad.",
        category: "tecnico",
        priority: "ALTA",
        meta: "Firma obligatoria",
        canal: "Acta de Conformidad",
        completed: false
    },
    {
        id: "act-t5",
        title: "5. Cierre Técnico en Sistema & Reporte a Coordinación",
        description: "Subir fotografías de la instalación finalizada al ERP y activar la garantía de 1 año del producto.",
        category: "tecnico",
        priority: "MEDIA",
        meta: "Cierre en plataforma",
        canal: "ATOMIC Técnico",
        completed: false
    }
]

const EDICION_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-e1",
        title: "1. Descarga de Briefings y Novedades de Catálogo",
        description: "Revisar solicitudes de banners, promociones y fotos de Suicide Squad para las 5 escuadras comerciales.",
        category: "desarrollo",
        priority: "ALTA",
        meta: "Briefing 9:00 AM",
        canal: "Drive / Chat Creativo",
        completed: false
    },
    {
        id: "act-e2",
        title: "2. Diseño de 5 Artes Comerciales para Marketplace",
        description: "Crear piezas gráficas optimizadas con PVP público, llamadas a la acción claras y formato 1:1 para Facebook.",
        category: "desarrollo",
        priority: "ALTA",
        meta: "5 artes diarias",
        canal: "Photoshop / Canva Pro",
        completed: false
    },
    {
        id: "act-e3",
        title: "3. Edición de 1 Video Corto Demostrativo (25 Seg.)",
        description: "Editar video dinámico con gancho psicológico, subtítulos de alto contraste y demostración de producto para TikTok / Reels.",
        category: "desarrollo",
        priority: "ALTA",
        meta: "1 video viral diario",
        canal: "CapCut / Premiere",
        completed: false
    },
    {
        id: "act-e4",
        title: "4. Optimización WebP de Banners y Landings",
        description: "Subir recursos comprimidos a CDN para mantener tiempos de carga inferiores a 1 segundo en las landings de categoría.",
        category: "desarrollo",
        priority: "MEDIA",
        meta: "Carga optimizada",
        canal: "Landings ATOMIC",
        completed: false
    },
    {
        id: "act-e5",
        title: "5. Archivo y Entrega en Drive al Equipo Comercial",
        description: "Consolidar enlaces de descarga para que coordinación y los vendedores tengan el material listo para publicar.",
        category: "desarrollo",
        priority: "MEDIA",
        meta: "Entrega completa",
        canal: "Drive Comercial",
        completed: false
    }
]

const SOFTWARE_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-sw1",
        title: "1. Monitoreo de Infraestructura, APIs y Supabase",
        description: "Verificar salud de base de datos PostgreSQL, APIs de cotizaciones PROP, WhatsApp bot y estabilidad en Vercel.",
        category: "desarrollo",
        priority: "ALTA",
        meta: "Uptime 99.9%",
        canal: "Vercel / Supabase",
        completed: false
    },
    {
        id: "act-sw2",
        title: "2. Resolución de Tickets y Bugs Operativos",
        description: "Atender incidencias técnicas reportadas por ventas o coordinación en los flujos diarios del cotizador.",
        category: "desarrollo",
        priority: "ALTA",
        meta: "SLA < 1 hora",
        canal: "GitHub Issues / Slack",
        completed: false
    },
    {
        id: "act-sw3",
        title: "3. Desarrollo de Mejoras de UI/UX y Nuevos Flujos",
        description: "Implementar optimizaciones de interfaz según el estándar SaaS 2026 de ATOMIC (Blanco con Tomate, microinteracciones).",
        category: "desarrollo",
        priority: "ALTA",
        meta: "Sprint diario",
        canal: "Next.js / Tailwind",
        completed: false
    },
    {
        id: "act-sw4",
        title: "4. Sanitización Continua de Precios y Catálogos",
        description: "Ejecutar validadores automáticos para corregir precios atípicos (< $15) y asociar imágenes de alta resolución.",
        category: "desarrollo",
        priority: "ALTA",
        meta: "Cero precios corruptos",
        canal: "Script Sanitizer",
        completed: false
    },
    {
        id: "act-sw5",
        title: "5. Despliegue Continuo (CI/CD) & Backup",
        description: "Push a producción de cambios probados, verificación de build limpio y respaldo preventivo de base de datos.",
        category: "desarrollo",
        priority: "MEDIA",
        meta: "Build limpio",
        canal: "CI/CD Pipeline",
        completed: false
    }
]

const ROLE_ACTIVITIES_MAP: Record<RoleType, DailyActivity[]> = {
    VENTAS: VENTAS_ACTIVITIES,
    COORDINACION: COORDINACION_ACTIVITIES,
    SUPERVISION: SUPERVISION_ACTIVITIES,
    TECNICO: TECNICO_ACTIVITIES,
    EDICION: EDICION_ACTIVITIES,
    SOFTWARE: SOFTWARE_ACTIVITIES
}

const ROLE_LABELS: Record<RoleType, { label: string; icon: string; badge: string; color: string }> = {
    VENTAS: { label: "Fuerza de Ventas", icon: "💼", badge: "7 Actividades Plan 30 Días", color: "from-blue-600 to-cyan-500" },
    COORDINACION: { label: "Coordinación Operativa", icon: "👥", badge: "6 Rutinas de Bitácora", color: "from-cyan-600 to-teal-500" },
    SUPERVISION: { label: "Supervisión & Auditoría", icon: "🛡️", badge: "5 Protocolos de Control", color: "from-amber-600 to-orange-500" },
    TECNICO: { label: "Servicio Técnico", icon: "🔧", badge: "5 Pasos Instalación", color: "from-emerald-600 to-green-500" },
    EDICION: { label: "Edición & Multimedia", icon: "🎬", badge: "5 Entregables Diarios", color: "from-purple-600 to-pink-500" },
    SOFTWARE: { label: "Ingeniería de Software", icon: "💻", badge: "5 Protocolos Dev/Infra", color: "from-indigo-600 to-blue-500" }
}

export default function RutaDelDiaWorkspace({
    isOpen = true,
    onClose,
    embedded = false
}: {
    isOpen?: boolean
    onClose?: () => void
    embedded?: boolean
}) {
    const { data: session } = useSession()
    const sellerName = session?.user?.name || "Asesor Comercial"
    const userRoleStr = ((session?.user as any)?.role || "").toUpperCase()

    // Determine if user can audit/switch between all roles
    const isSupervisorOrAdmin = useMemo(() => {
        return (
            userRoleStr === "ADMIN" ||
            userRoleStr === "SUPERVISOR" ||
            userRoleStr === "MANAGEMENT" ||
            userRoleStr === "COORDINATOR" ||
            userRoleStr.includes("ADMIN") ||
            userRoleStr.includes("SUPERVIS") ||
            userRoleStr.includes("MANAGEMENT")
        )
    }, [userRoleStr])

    // Determine default initial role
    const defaultRole: RoleType = useMemo(() => {
        if (userRoleStr.includes("COORDINAT")) return "COORDINACION"
        if (userRoleStr.includes("SUPERVIS")) return "SUPERVISION"
        if (userRoleStr.includes("TEC")) return "TECNICO"
        if (userRoleStr.includes("EDIT")) return "EDICION"
        if (userRoleStr.includes("SOFT") || userRoleStr.includes("DEV")) return "SOFTWARE"
        return "VENTAS"
    }, [userRoleStr])

    const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole)
    const [activeTab, setActiveTab] = useState<"actividades" | "categorias" | "plan_laboral" | "mensajes">("actividades")

    // ─────────────────────────────────────────────────────────────
    // 1. GESTIÓN DE ACTIVIDADES DIARIAS POR ROL CON LOCALSTORAGE
    // ─────────────────────────────────────────────────────────────
    const storageKey = `atomic_daily_route_activities_${selectedRole}`
    const [activities, setActivities] = useState<DailyActivity[]>(ROLE_ACTIVITIES_MAP[selectedRole])
    const [newTitle, setNewTitle] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [newPriority, setNewPriority] = useState<"ALTA" | "MEDIA" | "RUTINA">("ALTA")
    const [notes, setNotes] = useState("")
    const [notesSaved, setNotesSaved] = useState(false)

    // Load persisted activities when role changes
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setActivities(parsed)
                    return
                }
            }
            setActivities(ROLE_ACTIVITIES_MAP[selectedRole])
        } catch (e) {
            setActivities(ROLE_ACTIVITIES_MAP[selectedRole])
        }
    }, [selectedRole, storageKey])

    // Load notes
    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem("atomic_daily_route_notes")
            if (savedNotes) setNotes(savedNotes)
        } catch (e) {}
    }, [])

    const saveActivitiesToStorage = (updated: DailyActivity[]) => {
        setActivities(updated)
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated))
        } catch (e) {}
    }

    const toggleActivity = (id: string) => {
        const nowStr = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
        const updated = activities.map(act => {
            if (act.id === id) {
                const nextCompleted = !act.completed
                return {
                    ...act,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? nowStr : undefined
                }
            }
            return act
        })
        saveActivitiesToStorage(updated)
    }

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTitle.trim()) return
        const newAct: DailyActivity = {
            id: `custom-${Date.now()}`,
            title: newTitle.trim(),
            description: newDesc.trim() || "Tarea personalizada del día",
            category: "operaciones",
            priority: newPriority,
            completed: false,
            isCustom: true
        }
        const updated = [newAct, ...activities]
        saveActivitiesToStorage(updated)
        setNewTitle("")
        setNewDesc("")
    }

    const handleDeleteActivity = (id: string) => {
        const updated = activities.filter(a => a.id !== id)
        saveActivitiesToStorage(updated)
    }

    const handleResetActivities = () => {
        if (confirm(`¿Reiniciar el checklist de ${ROLE_LABELS[selectedRole].label} para hoy?`)) {
            saveActivitiesToStorage(ROLE_ACTIVITIES_MAP[selectedRole])
        }
    }

    const handleSaveNotes = () => {
        try {
            localStorage.setItem("atomic_daily_route_notes", notes)
            setNotesSaved(true)
            setTimeout(() => setNotesSaved(false), 2000)
        } catch (e) {}
    }

    const completedCount = activities.filter(a => a.completed).length
    const totalCount = activities.length
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // ─────────────────────────────────────────────────────────────
    // 2. GESTIÓN INTUITIVA DE CATEGORÍAS & SUBCATEGORÍAS
    // ─────────────────────────────────────────────────────────────
    const [squads, setSquads] = useState<any[]>([])
    const [loadingCatalog, setLoadingCatalog] = useState(false)
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)
    const [subcategories, setSubcategories] = useState<any[]>([])
    const [loadingSubs, setLoadingSubs] = useState(false)
    const [selectedSubId, setSelectedSubId] = useState<string | null>(null)
    const [productsList, setProductsList] = useState<any[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [catalogSearch, setCatalogSearch] = useState("")

    // Quote feedback state
    const [quoteCount, setQuoteCount] = useState(0)
    const [copiedProductKey, setCopiedProductKey] = useState<string | null>(null)

    // Load squads and categories taxonomy
    const loadCategories = async () => {
        setLoadingCatalog(true)
        try {
            const res = await fetch("/api/tools/suicide-squad")
            const data = await res.json()
            if (data.success && data.squads) {
                setSquads(data.squads)
                if (data.squads.length > 0 && data.squads[0].categories.length > 0) {
                    const firstCat = data.squads[0].categories[0]
                    loadSubcategoriesFor(firstCat)
                }
            }
        } catch (e) {
            console.error("Error loading categories:", e)
        } finally {
            setLoadingCatalog(false)
        }
    }

    const loadSubcategoriesFor = async (catName: string) => {
        setSelectedCategoryName(catName)
        setSelectedSubId(null)
        setProductsList([])
        setLoadingSubs(true)
        try {
            const res = await fetch(`/api/tools/suicide-squad?action=subcategories&categoryName=${encodeURIComponent(catName)}`)
            const data = await res.json()
            if (data.success && data.subcategories) {
                setSubcategories(data.subcategories)
                if (data.subcategories.length > 0) {
                    loadProductsFor(catName, data.subcategories[0])
                }
            }
        } catch (e) {
            console.error("Error loading subcategories:", e)
        } finally {
            setLoadingSubs(false)
        }
    }

    const loadProductsFor = async (catName: string, sub: any) => {
        setSelectedSubId(sub.id)
        setLoadingProducts(true)
        try {
            const kw = sub.isAll ? "all" : (sub.keywords?.join(",") || "")
            const res = await fetch(
                `/api/tools/suicide-squad?action=products&categoryName=${encodeURIComponent(catName)}&keywords=${encodeURIComponent(kw)}&limit=16`
            )
            const data = await res.json()
            if (data.success && data.products) {
                setProductsList(data.products)
            }
        } catch (e) {
            console.error("Error loading products:", e)
        } finally {
            setLoadingProducts(false)
        }
    }

    useEffect(() => {
        if (activeTab === "categorias" && squads.length === 0) {
            loadCategories()
        }
    }, [activeTab])

    // Synchronize quote counter
    useEffect(() => {
        try {
            const saved = localStorage.getItem("atomic_quote_items")
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) setQuoteCount(parsed.length)
            }
        } catch (e) {}
    }, [])

    const handleAddProductToQuote = (p: any) => {
        const pvp = p.pvp ?? p.price
        let photoUrl = ""
        try {
            if (p.images) {
                const parsed = JSON.parse(p.images)
                if (Array.isArray(parsed)) photoUrl = parsed[0]
                else if (typeof parsed === "string") photoUrl = parsed
            }
        } catch (e) {
            if (p.images && p.images.startsWith("http")) photoUrl = p.images
        }

        try {
            const currentStr = localStorage.getItem("atomic_quote_items")
            let current = currentStr ? JSON.parse(currentStr) : []
            if (!Array.isArray(current)) current = []

            const existingIdx = current.findIndex((it: any) => it.productId === p.id)
            if (existingIdx >= 0) {
                current[existingIdx].quantity += 1
            } else {
                current.push({
                    id: String(Date.now() + Math.random()),
                    productId: p.id,
                    description: p.name,
                    quantity: 1,
                    unitPrice: pvp,
                    customImage: photoUrl || undefined
                })
            }
            localStorage.setItem("atomic_quote_items", JSON.stringify(current))

            // Sync with atomic_cart
            const cartStr = localStorage.getItem("atomic_cart")
            let cart = cartStr ? JSON.parse(cartStr) : []
            if (Array.isArray(cart)) {
                const inCart = cart.find((it: any) => it.id === p.id)
                if (inCart) inCart.quantity += 1
                else cart.push({ id: p.id, name: p.name, price: pvp, quantity: 1, image: photoUrl })
                localStorage.setItem("atomic_cart", JSON.stringify(cart))
            }

            setQuoteCount(current.length)
        } catch (e) {}
    }

    const copyProductPitch = (p: any) => {
        const pitch = p.whatsappPitch || `*${p.name}*\n🏷️ *PVP Oficial:* $${(p.pvp || p.price).toFixed(2)} (Inc. IVA y Factura)\n🛡️ *Garantía:* 1 Año Oficial con Soporte Técnico Directo\n🔗 Ver en tienda: ${p.publicUrl || `https://atomiccotizador.shop/web/product/${p.id}`}`
        navigator.clipboard.writeText(pitch)
        setCopiedProductKey(p.id)
        setTimeout(() => setCopiedProductKey(null), 2000)
    }

    // Filter categories by search
    const filteredCategories = useMemo(() => {
        const allCats = squads.flatMap(s => s.categoryDetails || [])
        if (!catalogSearch.trim()) return allCats
        const q = catalogSearch.toLowerCase()
        return allCats.filter((c: any) => c.name.toLowerCase().includes(q))
    }, [squads, catalogSearch])

    // ─────────────────────────────────────────────────────────────
    // 3. PLAN LABORAL & ESCALA SALARIAL (3 MESES)
    // ─────────────────────────────────────────────────────────────
    const [dailyTarget, setDailyTarget] = useState(400)
    const [currentSales, setCurrentSales] = useState(215)
    const [commissionRate, setCommissionRate] = useState(15) // 15% mes 1

    const salesProgress = Math.min(100, Math.round((currentSales / (dailyTarget || 1)) * 100))
    const earnedCommission = (currentSales * (commissionRate / 100)).toFixed(2)

    const todayFormatted = new Date().toLocaleDateString("es-EC", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    if (!isOpen) return null

    const currentRoleInfo = ROLE_LABELS[selectedRole]

    const content = (
        <div className="flex flex-col h-full bg-[#040714] text-white">
            
            {/* ── TOP HEADER: IDENTIFICADOR RUTA DEL DÍA & ROLE SWITCHER ── */}
            <header className="px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-slate-950/95 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/30 shrink-0">
                        <CalendarCheck size={22} className="stroke-[2.5]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                                <span>Ruta del Día</span>
                                <span className="text-cyan-400 font-mono text-xs font-bold">2026</span>
                            </h2>
                            <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                                {currentRoleInfo.icon} {currentRoleInfo.label}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono capitalize">
                            📅 {todayFormatted} • {sellerName}
                        </p>
                    </div>
                </div>

                {/* Supervisor/Admin Role Switcher & Actions */}
                <div className="flex items-center gap-2.5">
                    {/* Progress indicator */}
                    <div className="hidden sm:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-slate-400">Cumplimiento hoy:</span>
                            <span className="font-bold text-emerald-400">{completedCount}/{totalCount} ({progressPercent}%)</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300" 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {quoteCount > 0 && (
                        <Link
                            href="/dashboard/quotes"
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                            title="Ver Cotización Activa"
                        >
                            <ShoppingBag size={13} />
                            <span>{quoteCount} en Cotización</span>
                        </Link>
                    )}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Cerrar ventana"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* ── SUPERVISOR AUDIT SELECTOR BAR (ONLY VISIBLE TO SUPERVISOR / ADMIN) ── */}
            {isSupervisorOrAdmin && (
                <div className="px-4 sm:px-6 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none shrink-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert size={13} />
                            <span>Inspección de Cuadrillas (Supervisor):</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                        {(["VENTAS", "COORDINACION", "SUPERVISION", "TECNICO", "EDICION", "SOFTWARE"] as RoleType[]).map((r) => {
                            const isSelected = selectedRole === r
                            const info = ROLE_LABELS[r]
                            return (
                                <button
                                    key={r}
                                    onClick={() => setSelectedRole(r)}
                                    className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                        isSelected
                                            ? "bg-amber-400 text-black font-black shadow-md shadow-amber-400/30 scale-102"
                                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                                    }`}
                                >
                                    <span>{info.icon}</span>
                                    <span>{info.label.split(" ")[0]}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── SUB-HEADER: TABS SELECTOR (4 MÓDULOS REQUERIDOS) ── */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
                {[
                    { id: "actividades", label: `📋 Plan Diario (${currentRoleInfo.label})`, badge: `${progressPercent}%` },
                    { id: "categorias", label: "🗂️ Categorías & Subcategorías", badge: "Catálogo" },
                    { id: "plan_laboral", label: "🎯 Plan Laboral & Metas", badge: `Escala $450` },
                    { id: "mensajes", label: "💬 Mensajes para Copiar", badge: "Marketplace" }
                ].map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                                isActive
                                    ? "bg-emerald-500 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102"
                                    : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                                isActive ? "bg-black/20 text-black" : "bg-slate-800 text-slate-400"
                            }`}>
                                {tab.badge}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* ── MAIN TAB BODY ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040714] space-y-6">
                
                {/* ═══════════════════════════════════════════════════════════
                    TAB 1: PLAN DIARIO & REGISTRO DE ACTIVIDADES (CHECKLIST)
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "actividades" && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Daily Motivational Status Card */}
                        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                                    <Sparkles size={13} />
                                    <span>Bitácora Operativa Diaria • {currentRoleInfo.label}</span>
                                </span>
                                <h3 className="text-lg font-extrabold text-white">
                                    {progressPercent === 100 
                                        ? "🎉 ¡Excelente trabajo! Completaste todas las responsabilidades del día." 
                                        : `Llevas ${completedCount} de ${totalCount} actividades realizadas hoy`}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    {selectedRole === "VENTAS"
                                        ? "Cumple el 80% de asistencia y aciertos en estas 7 actividades para garantizar tu sueldo fijo y comisiones."
                                        : "Marca cada tarea al culminarla para registrar la hora exacta y mantener el ritmo operativo de ATOMIC."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="text-center p-3 rounded-2xl bg-black/40 border border-white/10 min-w-[90px]">
                                    <span className="text-2xl font-black text-emerald-400">{progressPercent}%</span>
                                    <span className="text-[9px] text-slate-400 block font-mono">PROGRESO</span>
                                </div>
                                <button
                                    onClick={handleResetActivities}
                                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
                                    title="Reiniciar checklist de hoy"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Checklist Table / List */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                    Responsabilidades Diarias del Perfil: {currentRoleInfo.label}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                    Toca la tarjeta para marcar como realizada
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                                {activities.map((act) => {
                                    return (
                                        <div
                                            key={act.id}
                                            onClick={() => toggleActivity(act.id)}
                                            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group select-none ${
                                                act.completed
                                                    ? "bg-emerald-950/20 border-emerald-500/40 opacity-75"
                                                    : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); toggleActivity(act.id) }}
                                                    className="mt-0.5 text-slate-400 group-hover:text-emerald-400 transition-colors"
                                                >
                                                    {act.completed ? (
                                                        <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-500/20" />
                                                    ) : (
                                                        <Circle size={20} className="text-slate-600 group-hover:text-slate-400" />
                                                    )}
                                                </button>

                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className={`text-xs sm:text-sm font-bold transition-colors ${
                                                            act.completed ? "line-through text-slate-400" : "text-white group-hover:text-cyan-300"
                                                        }`}>
                                                            {act.title}
                                                        </h4>
                                                        {act.meta && (
                                                            <span className="text-[9px] font-mono font-bold px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                                                {act.meta}
                                                            </span>
                                                        )}
                                                        <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded-full uppercase ${
                                                            act.priority === "ALTA" 
                                                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" 
                                                                : act.priority === "MEDIA" 
                                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                                                                : "bg-slate-800 text-slate-400"
                                                        }`}>
                                                            {act.priority}
                                                        </span>
                                                        {act.completedAt && (
                                                            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                <span>Listo {act.completedAt}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-mono">
                                                        {act.description}
                                                    </p>
                                                    {act.canal && (
                                                        <p className="text-[10px] text-slate-500 font-mono">
                                                            📌 Canal de entrega: <strong className="text-slate-300">{act.canal}</strong>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action shortcut or delete */}
                                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                {act.category === "marketplace" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab("mensajes")}
                                                        className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30"
                                                    >
                                                        <span>Scripts</span>
                                                        <ArrowRight size={10} />
                                                    </button>
                                                )}
                                                {act.title.includes("Marketplace") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab("categorias")}
                                                        className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-rose-500/30"
                                                    >
                                                        <span>Catálogo</span>
                                                        <ArrowRight size={10} />
                                                    </button>
                                                )}
                                                {act.isCustom && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteActivity(act.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                        title="Eliminar actividad"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Add Custom Activity Form */}
                        <form onSubmit={handleAddActivity} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                <Plus size={14} className="text-emerald-400" />
                                <span>Agregar Tarea Extra a la Ruta de {currentRoleInfo.label}</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Nombre de la actividad (ej. Visita a constructora X)..."
                                    className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={newPriority}
                                        onChange={(e: any) => setNewPriority(e.target.value)}
                                        className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 flex-1"
                                    >
                                        <option value="ALTA">Prioridad Alta</option>
                                        <option value="MEDIA">Prioridad Media</option>
                                        <option value="RUTINA">Rutina</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={!newTitle.trim()}
                                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                                    >
                                        <Plus size={14} />
                                        <span>Agregar</span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Bitácora / Notas Operacionales Rápidas */}
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-slate-300">
                                    📝 Bitácora & Novedades de la Jornada
                                </span>
                                {notesSaved && (
                                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                        <Check size={12} />
                                        <span>Guardado</span>
                                    </span>
                                )}
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleSaveNotes}
                                rows={3}
                                placeholder="Escribe aquí notas de prospección, clientes pendientes de cierre o acuerdos de coordinación..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSaveNotes}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold cursor-pointer transition-colors"
                                >
                                    Guardar Notas
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    TAB 2: CATEGORÍAS & SUBCATEGORÍAS REDISEÑADO CON MEJORES PRÁCTICAS
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "categorias" && (
                    <div className="max-w-6xl mx-auto space-y-6">
                        
                        {/* Header & Search Bar */}
                        <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                    <span>🗂️ Explorador Jerárquico de Categorías & Subfamilias</span>
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    Estructura intuitiva con enlaces directos a las Landings Oficiales de Bienvenida 2026 y PVP con IVA.
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={catalogSearch}
                                        onChange={(e) => setCatalogSearch(e.target.value)}
                                        placeholder="Buscar categoría..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
                                    />
                                </div>
                                <Link
                                    href="/bienvenida/categoria"
                                    target="_blank"
                                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0"
                                >
                                    <Globe size={13} />
                                    <span>Ver Todas las Landings</span>
                                </Link>
                            </div>
                        </div>

                        {/* Categories Browser Grid */}
                        {loadingCatalog ? (
                            <div className="py-12 text-center space-y-3">
                                <RefreshCw size={28} className="animate-spin text-cyan-400 mx-auto" />
                                <p className="text-xs text-slate-400 font-mono">Cargando jerarquía oficial de categorías...</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                
                                {/* 1. Category Cards with Direct Landing Links */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                                        <span className="font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                                            <FolderTree size={14} />
                                            <span>Paso 1: Selecciona una Categoría Principal:</span>
                                        </span>
                                        <span>{filteredCategories.length} categorías disponibles</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                                        {filteredCategories.map((cat: any) => {
                                            const isSelected = selectedCategoryName === cat.name
                                            const landingSlug = getCategoryLandingSlug(cat.name)
                                            return (
                                                <div
                                                    key={cat.name}
                                                    className={`rounded-2xl border transition-all p-3 flex flex-col justify-between gap-2.5 cursor-pointer ${
                                                        isSelected
                                                            ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40"
                                                            : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                                                    }`}
                                                    onClick={() => loadSubcategoriesFor(cat.name)}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="text-xs font-bold text-white line-clamp-1">
                                                                {cat.name}
                                                            </h4>
                                                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/50 text-cyan-400 border border-cyan-500/20">
                                                                {cat.count}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type="button"
                                                            onClick={() => loadSubcategoriesFor(cat.name)}
                                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                                                                isSelected
                                                                    ? "bg-cyan-400 text-black font-black"
                                                                    : "bg-slate-800 text-slate-300 hover:text-white"
                                                            }`}
                                                        >
                                                            <span>Explorar</span>
                                                            <ChevronRight size={11} />
                                                        </button>

                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={async (e) => {
                                                                    e.stopPropagation()
                                                                    const catData = getCategoryBySlug(landingSlug)
                                                                    if (catData) await generateCategoryCatalogPDF(catData)
                                                                }}
                                                                className="px-2 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-orange-500/30 cursor-pointer"
                                                                title={`Descargar Catálogo Oficial PDF de ${cat.name}`}
                                                            >
                                                                <Download size={10} />
                                                                <span>PDF</span>
                                                            </button>

                                                            <Link
                                                                href={`/bienvenida/categoria/${landingSlug}`}
                                                                target="_blank"
                                                                className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-cyan-500/30"
                                                                title={`Abrir Landing de ${cat.name}`}
                                                            >
                                                                <ExternalLink size={10} />
                                                                <span>Landing</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* 2. Subcategories Panel */}
                                {selectedCategoryName && (
                                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                                                <Layers size={13} />
                                                <span>Subcategorías dentro de &ldquo;{selectedCategoryName}&rdquo;:</span>
                                            </span>
                                            {loadingSubs && (
                                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                                    <RefreshCw size={11} className="animate-spin" />
                                                    <span>Cargando...</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {subcategories.map((sub: any) => {
                                                const isSelectedSub = selectedSubId === sub.id
                                                return (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => loadProductsFor(selectedCategoryName, sub)}
                                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                            isSelectedSub
                                                                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/40"
                                                                : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between text-xs font-bold">
                                                            <span className="line-clamp-1">{sub.name}</span>
                                                            <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-slate-400">
                                                                {sub.count}
                                                            </span>
                                                        </div>
                                                        {sub.description && (
                                                            <p className="text-[9px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                                                                {sub.description}
                                                            </p>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Products Grid with Sanitized PVP & Actions */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                            <ShoppingBag size={14} className="text-amber-400" />
                                            <span>Modelos Disponibles con PVP Público (IVA y Factura Inc.)</span>
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            {productsList.length} productos listados
                                        </span>
                                    </div>

                                    {loadingProducts ? (
                                        <div className="py-10 text-center space-y-2">
                                            <RefreshCw size={22} className="animate-spin text-cyan-400 mx-auto" />
                                            <p className="text-xs text-slate-400 font-mono">Cargando productos con PVP público...</p>
                                        </div>
                                    ) : productsList.length === 0 ? (
                                        <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs font-mono">
                                            Selecciona una subcategoría para desplegar sus modelos con PVP oficial.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {productsList.map((p: any) => {
                                                const pvp = p.pvp || p.price
                                                const isCopied = copiedProductKey === p.id
                                                let img = "/images/products/placeholder.jpg"
                                                try {
                                                    if (p.images) {
                                                        const parsed = JSON.parse(p.images)
                                                        if (Array.isArray(parsed) && parsed[0]) img = parsed[0]
                                                        else if (typeof parsed === "string") img = parsed
                                                    }
                                                } catch (e) {
                                                    if (p.images && p.images.startsWith("http")) img = p.images
                                                }

                                                return (
                                                    <div
                                                        key={p.id}
                                                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-2.5 transition-all group"
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="aspect-video w-full rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
                                                                <img
                                                                    src={img}
                                                                    alt={p.name}
                                                                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                                                                    onError={(e: any) => { e.target.src = "https://placehold.co/400x300/0b1026/06b6d4?text=ATOMIC" }}
                                                                />
                                                                <span className="absolute top-1.5 right-1.5 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/30">
                                                                    Stock: {p.stock}
                                                                </span>
                                                            </div>

                                                            <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                                                                {p.name}
                                                            </h5>

                                                            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                                                <div>
                                                                    <span className="text-[9px] text-slate-500 block font-mono">PVP PÚBLICO</span>
                                                                    <span className="text-sm font-black text-emerald-400 font-mono">
                                                                        ${pvp.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[9px] font-mono text-slate-400">
                                                                    IVA Inc.
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddProductToQuote(p)}
                                                                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[9px] font-mono font-bold flex flex-col items-center justify-center gap-0.5 border border-amber-500/40 cursor-pointer active:scale-95 transition-all"
                                                                title="Añadir a Cotización"
                                                            >
                                                                <Plus size={12} />
                                                                <span>Cotizar</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => copyProductPitch(p)}
                                                                className={`p-1.5 rounded-lg text-[9px] font-mono font-bold flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-95 transition-all ${
                                                                    isCopied
                                                                        ? "bg-emerald-500 text-black border-emerald-400 font-black"
                                                                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40"
                                                                }`}
                                                                title="Copiar texto para WhatsApp"
                                                            >
                                                                {isCopied ? <Check size={12} /> : <Share2 size={12} />}
                                                                <span>{isCopied ? "¡Listo!" : "Pitch"}</span>
                                                            </button>

                                                            <a
                                                                href={`/web/product/${p.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold flex flex-col items-center justify-center gap-0.5 border border-cyan-500/40 transition-all text-center"
                                                                title="Abrir en Tienda Web"
                                                            >
                                                                <ExternalLink size={12} />
                                                                <span>Tienda</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    TAB 3: EL PLAN LABORAL OFICIAL & ESCALA SALARIAL (3 MESES)
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "plan_laboral" && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Target Progress Banner */}
                        <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Target size={14} />
                                        <span>Calculadora de Rendimiento Diario</span>
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black text-white">
                                        Meta Diaria: ${dailyTarget} USD • Ventas Registradas: ${currentSales} USD
                                    </h3>
                                </div>

                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center min-w-[140px]">
                                    <span className="text-[9px] text-slate-400 font-mono block">COMISIÓN ESTIMADA</span>
                                    <span className="text-xl font-black text-emerald-400 font-mono">+${earnedCommission}</span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-400">Progreso a la meta:</span>
                                    <span className="font-bold text-amber-400">{salesProgress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                                        style={{ width: `${salesProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Interactive Target Adjusters */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400">Tu Meta de Hoy ($ USD):</label>
                                    <input 
                                        type="number"
                                        value={dailyTarget}
                                        onChange={(e) => setDailyTarget(Number(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400">Ventas Registradas Hoy ($ USD):</label>
                                    <input 
                                        type="number"
                                        value={currentSales}
                                        onChange={(e) => setCurrentSales(Number(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400 font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400">% Comisión Vendedor:</label>
                                    <input 
                                        type="number"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Escala Salarial 3 Meses */}
                        <div className="space-y-3">
                            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Award size={14} className="text-cyan-400" />
                                <span>Escala Salarial y Proyección Laboral (3 Meses)</span>
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    {
                                        mes: "Mes 1: Prueba & Capacitación",
                                        fijo: "$100 USD Fijo",
                                        comision: "15% en ventas generadas",
                                        bono: "$50 bono por 80% asistencia",
                                        proyeccion: "$150+ USD",
                                        color: "border-slate-800 bg-slate-900/80"
                                    },
                                    {
                                        mes: "Mes 2: Consolidación Autónoma",
                                        fijo: "$200 USD Fijo",
                                        comision: "20% en ventas (+5%)",
                                        bono: "$65 bono constancia mensual",
                                        proyeccion: "$265+ USD",
                                        color: "border-blue-500/40 bg-blue-950/20"
                                    },
                                    {
                                        mes: "Mes 3: Puesto Fijo con Contrato",
                                        fijo: "$450 USD Fijo Mensual",
                                        comision: "Comisiones permanentes",
                                        bono: "Bonos trimestrales y cartera",
                                        proyeccion: "$450 - $750+ USD",
                                        color: "border-emerald-500/50 bg-emerald-950/30"
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl border ${step.color} space-y-2`}>
                                        <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">{step.mes}</span>
                                        <p className="text-2xl font-black text-white">{step.fijo}</p>
                                        <div className="text-xs text-slate-300 space-y-1 font-mono pt-2 border-t border-white/5">
                                            <p>📈 Comisiones: {step.comision}</p>
                                            <p>🎁 Incentivo: {step.bono}</p>
                                        </div>
                                        <div className="pt-2 text-right">
                                            <span className="text-xs font-bold text-emerald-400">Total: {step.proyeccion}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    TAB 4: MENSAJES PARA COPIAR Y PEGAR (SCRIPTS MARKETPLACE)
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "mensajes" && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <MessageSquare size={16} className="text-emerald-400" />
                                    <span>Marketplace de Scripts para Redes Sociales & Marketplace</span>
                                </h3>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Respuestas optimizadas con enlaces a tiendas web, promociones de lunes/miércoles y cierre por WhatsApp.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-950">
                            <SalesCopyManager />
                        </div>
                    </div>
                )}

            </div>
        </div>
    )

    if (embedded) {
        return content
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative w-full max-w-7xl h-[94vh] bg-[#070b18] border-2 border-emerald-500/40 rounded-3xl shadow-[0_0_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            >
                {content}
            </motion.div>
        </div>
    )
}
