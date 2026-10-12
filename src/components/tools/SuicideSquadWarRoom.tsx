"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Flame, Users, ShieldAlert, Sparkles, CheckCircle2, AlertCircle,
    Copy, Check, Search, Filter, ArrowRight, ArrowLeft, Play, Pause, RotateCcw,
    Sliders, ExternalLink, Download, FileText, ChevronRight, X,
    Eye, Shield, Lock, Zap, Smartphone, Cpu, Video, MessageSquare,
    DollarSign, Clock, Trophy, Target, ArrowUpDown, UserPlus, Trash2,
    Share2, RefreshCw, FolderTree, Layers, ChevronDown, Plus, FileSpreadsheet,
    Package, TrendingUp, Compass, Award, BarChart3, CheckSquare,
    PhoneCall, PhoneOff, Volume2, VolumeX, Radio, Mic, MicOff, Send, UserCheck
} from "lucide-react"

export interface SquadMember {
    id: string
    name: string
    email: string
    role?: string
    avatar?: string
    status?: "GRABANDO" | "EN_VIVO" | "STANDBY" | "EN_CRM"
    phone?: string
}

export interface SquadData {
    id: string
    code: string
    name: string
    subtitle: string
    priority: string
    priorityLevel: number
    viralScore: string
    ticketAvg: string
    colorTheme: "rose" | "emerald" | "amber" | "cyan" | "violet"
    categories: string[]
    categoryDetails?: {
        name: string
        count: number
    }[]
    productCount: number
    mission: string
    viralHook: string
    whatsappKeyword: string
    flagships: {
        name: string
        price: number
        stock: number
        img?: string
    }[]
    scriptTeleprompter: string
    members?: SquadMember[]
}

export interface SubcategoryItem {
    id: string
    name: string
    description?: string
    count: number
    keywords?: string[]
    isAll?: boolean
}

export interface ProductItem {
    id: string
    name: string
    price: number
    compareAtPrice?: number | null
    pvp?: number
    distributorPrice?: number | null
    publicUrl?: string
    whatsappPitch?: string
    sku?: string | null
    stock: number
    images?: string | null
    specSheetUrl?: string | null
    category?: { name: string; slug: string } | null
}

export function getCategoryLandingSlug(catName?: string, squadId?: string): string {
    if (!catName) {
        if (squadId === 'squad-1') return 'camaras-de-seguridad';
        if (squadId === 'squad-2') return 'cerraduras-smart';
        if (squadId === 'squad-3') return 'ups-y-energia';
        if (squadId === 'squad-4') return 'domotica-y-smart-home';
        if (squadId === 'squad-5') return 'computadores-y-laptops';
        return 'camaras-de-seguridad';
    }
    const lower = catName.toLowerCase();
    if (lower.includes('cámara') || lower.includes('camara') || lower.includes('cctv')) return 'camaras-de-seguridad';
    if (lower.includes('alarma') || lower.includes('cerco')) return 'alarmas-y-seguridad';
    if (lower.includes('cerradura') || lower.includes('chapa') || lower.includes('smart')) return 'cerraduras-smart';
    if (lower.includes('torniquete') || lower.includes('barrera') || lower.includes('peatonal') || lower.includes('acceso')) return 'control-de-acceso';
    if (lower.includes('videoportero') || lower.includes('citofon') || lower.includes('portero')) return 'videoporteros-y-citofonia';
    if (lower.includes('ups') || lower.includes('regulador') || lower.includes('fuente')) return 'ups-y-energia';
    if (lower.includes('solar') || lower.includes('panel')) return 'paneles-solares';
    if (lower.includes('cargador') || lower.includes('ev') || lower.includes('movilidad')) return 'cargadores-ev';
    if (lower.includes('domótica') || lower.includes('domotica') || lower.includes('foco')) return 'domotica-y-smart-home';
    if (lower.includes('audio') || lower.includes('sonido') || lower.includes('parlante')) return 'audio-y-sonido';
    if (lower.includes('gaming') || lower.includes('consola')) return 'gaming-y-consolas';
    if (lower.includes('laptop') || lower.includes('computad')) return 'computadores-y-laptops';
    if (lower.includes('celular') || lower.includes('tablet')) return 'celulares-y-tablets';

    if (squadId === 'squad-1') return 'camaras-de-seguridad';
    if (squadId === 'squad-2') return 'cerraduras-smart';
    if (squadId === 'squad-3') return 'ups-y-energia';
    if (squadId === 'squad-4') return 'domotica-y-smart-home';
    if (squadId === 'squad-5') return 'computadores-y-laptops';
    return 'camaras-de-seguridad';
}

const THEME_STYLES: Record<string, {
    border: string
    borderHover: string
    badgeBg: string
    badgeText: string
    glow: string
    accentBg: string
    accentText: string
    btnPrimary: string
    cardGlow: string
    pillBg: string
}> = {
    rose: {
        border: "border-rose-500/30",
        borderHover: "hover:border-rose-400",
        badgeBg: "bg-rose-500/15 border-rose-500/30",
        badgeText: "text-rose-400",
        glow: "rgba(244,63,94,0.35)",
        accentBg: "bg-rose-500/15",
        accentText: "text-rose-300",
        btnPrimary: "bg-rose-500 hover:bg-rose-400 text-black shadow-[0_0_20px_rgba(244,63,94,0.45)]",
        cardGlow: "shadow-[0_10px_35px_-5px_rgba(244,63,94,0.15)]",
        pillBg: "bg-rose-950/40 border-rose-500/30 text-rose-300"
    },
    emerald: {
        border: "border-emerald-500/30",
        borderHover: "hover:border-emerald-400",
        badgeBg: "bg-emerald-500/15 border-emerald-500/30",
        badgeText: "text-emerald-400",
        glow: "rgba(16,185,129,0.35)",
        accentBg: "bg-emerald-500/15",
        accentText: "text-emerald-300",
        btnPrimary: "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.45)]",
        cardGlow: "shadow-[0_10px_35px_-5px_rgba(16,185,129,0.15)]",
        pillBg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
    },
    amber: {
        border: "border-amber-500/30",
        borderHover: "hover:border-amber-400",
        badgeBg: "bg-amber-500/15 border-amber-500/30",
        badgeText: "text-amber-400",
        glow: "rgba(245,158,11,0.35)",
        accentBg: "bg-amber-500/15",
        accentText: "text-amber-300",
        btnPrimary: "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.45)]",
        cardGlow: "shadow-[0_10px_35px_-5px_rgba(245,158,11,0.15)]",
        pillBg: "bg-amber-950/40 border-amber-500/30 text-amber-300"
    },
    cyan: {
        border: "border-cyan-500/30",
        borderHover: "hover:border-cyan-400",
        badgeBg: "bg-cyan-500/15 border-cyan-500/30",
        badgeText: "text-cyan-400",
        glow: "rgba(6,182,212,0.35)",
        accentBg: "bg-cyan-500/15",
        accentText: "text-cyan-300",
        btnPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.45)]",
        cardGlow: "shadow-[0_10px_35px_-5px_rgba(6,182,212,0.15)]",
        pillBg: "bg-cyan-950/40 border-cyan-500/30 text-cyan-300"
    },
    violet: {
        border: "border-purple-500/30",
        borderHover: "hover:border-purple-400",
        badgeBg: "bg-purple-500/15 border-purple-500/30",
        badgeText: "text-purple-400",
        glow: "rgba(168,85,247,0.35)",
        accentBg: "bg-purple-500/15",
        accentText: "text-purple-300",
        btnPrimary: "bg-purple-500 hover:bg-purple-400 text-black shadow-[0_0_20px_rgba(168,85,247,0.45)]",
        cardGlow: "shadow-[0_10px_35px_-5px_rgba(168,85,247,0.15)]",
        pillBg: "bg-purple-950/40 border-purple-500/30 text-purple-300"
    }
}

export const SPEECHES_VAULT = [
    {
        id: "sp-1",
        category: "frio",
        badge: "Llamada Fría B2B",
        title: "Prospección a Administradores de Condominios y Comercios",
        target: "Constructoras, Edificios, Urbanizaciones",
        script: `"Buenos días [Nombre del Administrador], le saluda [Tu Nombre] de ATOMIC Equipamiento Tecnológico. Le llamo muy brevemente porque esta semana estamos entregando a varios condominios de su sector el plan de modernización de accesos sin llaves y cámaras disuasivas con factura y garantía nacional de 1 año.
Sabemos que la seguridad en la zona es crítica en estos meses, y quería preguntarle: ¿Actualmente tienen problemas con llaves duplicadas de conserjes o residentes, o están cotizando mejoras en sus puertas de acceso este trimestre?"`,
        tips: "Mantén un tono seguro y pausado. No hables de precios de entrada; abre con el dolor de las llaves duplicadas o la inseguridad del sector."
    },
    {
        id: "sp-2",
        category: "caliente",
        badge: "Reactivación de Clientes",
        title: "Oferta Flash Exclusiva para Clientes Anteriores (15% OFF)",
        target: "Clientes que compraron hace 1 a 6 meses",
        script: `"¡Hola [Nombre]! Qué gusto saludarte nuevamente, te habla [Tu Nombre] de ATOMIC. Te escribo directamente porque como cliente VIP que ya confió en nosotros con tu equipo [Producto Anterior], hoy la gerencia nos autorizó un cupón especial del 15% de descuento en accesorios de seguridad: cerraduras inteligentes adicionales, sensores de puerta Wi-Fi o cámaras bombilla 360°.
El cupón es válido solo por 48 horas antes de cierre de inventario. ¿Te gustaría que te comparta el mini catálogo con los precios especiales de cliente frecuente?"`,
        tips: "Trato personalizado y cercano. Hazle sentir que es parte de un club selecto y que el descuento es limitado."
    },
    {
        id: "sp-3",
        category: "objeciones",
        badge: "Objeción de Precio",
        title: "Derribo: 'Está muy caro, vi uno más barato en internet'",
        target: "Prospectos que comparan con productos genéricos o informales",
        script: `"Totalmente de acuerdo contigo, en internet y locales informales puedes encontrar equipos que parecen similares por $15 o $20 dólares menos. Sin embargo, en seguridad electrónica lo barato sale carísimo: esos equipos no tienen homologación, no traen repuestos cuando se traba el motor y si fallan nadie te da la cara.
Con ATOMIC recibes:
1. Factura oficial autorizada por el SRI con IVA.
2. Garantía local real de 1 año con cambio directo de equipo.
3. Soporte técnico por videollamada para que nunca te quedes bloqueado.
Por una diferencia de centavos al día, ¿vale la pena arriesgar la puerta de tu hogar o tu negocio?"`,
        tips: "Nunca ataques al competidor; enfócate en el costo del fallo y la tranquilidad de tener repuestos y técnicos locales."
    },
    {
        id: "sp-4",
        category: "objeciones",
        badge: "Objeción de Tiempo",
        title: "Derribo: 'Solo estoy cotizando, no voy a comprar ahorita'",
        target: "Prospectos fríos en Marketplace o WhatsApp",
        script: `"¡Me parece excelente que te informes con tiempo! En ATOMIC premiamos a los clientes que planifican. Te voy a enviar la cotización formal con el código PROP en PDF para que compares especificaciones técnicas con total calma.
Un detalle importante: este precio tiene un descuento promocional de distribuidor que caduca este fin de semana. Si deseas, te reservo el precio con tu número de cédula sin ningún compromiso de pago para que lo congeles. ¿A qué nombre te dejo la reserva?"`,
        tips: "Genera urgencia sin presionar agresivamente. Congelar el precio compromete psicológicamente al prospecto."
    },
    {
        id: "sp-5",
        category: "cierre",
        badge: "Cierre Doble Alternativa",
        title: "Técnica de Cierre con Despacho Inmediato Servientrega",
        target: "Prospectos indecisos al momento de pagar",
        script: `"Perfecto [Nombre], el kit ya está probado y empacado en bodega con tu garantía y factura oficial. Para la entrega tenemos dos opciones muy cómodas:
¿Prefieres que te lo despachemos directamente a la puerta de tu casa por Servientrega con guía de rastreo hoy mismo, o prefieres retirarlo en la agencia Servientrega más cercana a tu trabajo?"`,
        tips: "No preguntes '¿Va a comprar o no?'. Pregunta cómo prefiere recibirlo. La mente del cliente asume que la compra ya está hecha."
    },
    {
        id: "sp-6",
        category: "cierre",
        badge: "Venta Cruzada (Up-Selling)",
        title: "Añadir Instalación o Baterías de Respaldo",
        target: "Cierre de cerradura o videoportero",
        script: `"Excelente elección. Por solo $15 adicionales al momento de emitir tu factura, podemos incluirte el pack de 8 baterías alcalinas de grado industrial Energizer y el protector contra picos de voltaje para la fuente. De esa forma te aseguras autonomía por más de 12 meses sin preocuparte por nada. ¿Te lo sumo a la cotización de una vez para que viaje en el mismo paquete?"`,
        tips: "Aumenta el ticket promedio en $15-$35 dólares sin esfuerzo adicional."
    }
]

export const CLIENT_PERSONAS = {
    marcelo: {
        id: "marcelo",
        name: "Don Marcelo Benalcázar",
        role: "Administrador de Condominio El Pinar (Quito)",
        avatar: "👴",
        personality: "Desconfiado, enfocado en precio y garantía local",
        initialSpeech: "Buenas tardes. Veo que me llaman de ATOMIC. Mire joven, ya tengo una empresa que me hace mantenimiento a los motores y cámaras y me cobra la mitad. ¿Por qué debería pagarles a ustedes?",
        turns: [
            {
                customerResponse: "Mmm, entiendo lo de la garantía de 1 año con factura, pero en el mercado chino consigo cada cerradura digital en $25 dólares. ¿Ustedes por qué cobran $55 a $89?",
                objectionTip: "Explicar homologación Arcotel, repuestos en bodega nacional y que las cerraduras baratas se bloquean con cortes de luz."
            },
            {
                customerResponse: "Bueno, eso de que tienen repuestos aquí en Ecuador sí me interesa porque con los otros esperé dos meses un repuesto. ¿Y si compramos para los 18 departamentos, me hacen descuento por volumen e instalación incluida?",
                objectionTip: "Cerrar con doble alternativa: ofrecer 10% por volumen o kit de instalación técnica con visita de prueba."
            },
            {
                customerResponse: "¡Listo! Me parece justo. Envíame la cotización formal PROP con IVA desglosado a mi WhatsApp y coordinamos la visita técnica para este jueves.",
                finalVerdict: "¡VENTA CERRADA EXITOSAMENTE! Lograste derribar la objeción de precio resaltando garantía y repuestos locales."
            }
        ]
    },
    valeria: {
        id: "valeria",
        name: "Ing. Valeria Cárdenas",
        role: "Jefa de Compras Constructora Urbana (Guayaquil)",
        avatar: "👩‍💼",
        personality: "Ejecutiva, directa, exige fichas técnicas y crédito",
        initialSpeech: "Aló, buenas tardes. Habla Valeria de Constructora Urbana. Necesito equipar 24 departamentos con videoporteros IP y cerraduras inteligentes para entrega en 10 días. ¿Tienen stock inmediato en bodega o toca esperar importación?",
        turns: [
            {
                customerResponse: "Perfecto que tengan stock. Pero nosotros pagamos con retención a 15 días contra entrega de actas de recepción y factura autorizada por el SRI. ¿Aceptan esas condiciones comerciales?",
                objectionTip: "Confirmar que ATOMIC es empresa jurídica constituida con facturación electrónica SRI, solicitando 30% de anticipo y saldo a 15 días."
            },
            {
                customerResponse: "Entiendo. ¿Y quién capacita a los propietarios sobre la aplicación móvil Tuya cuando entreguemos los departamentos?",
                objectionTip: "Mencionar que el equipo técnico de ATOMIC entrega acta de inducción y manuales paso a paso con video."
            },
            {
                customerResponse: "Excelente profesionalismo. Pásame las fichas técnicas en PDF y la cotización PROP a mi correo de compras para emitir la orden de compra hoy mismo.",
                finalVerdict: "¡CUENTA CORPORATIVA GANADA! Gran manejo de condiciones B2B y soporte técnico."
            }
        ]
    },
    carlos: {
        id: "carlos",
        name: "Carlos Villagómez",
        role: "Comprador Residencial TikTok (Cuenca)",
        avatar: "🧑",
        personality: "Impulsivo, teme a la tecnología y cortes de luz",
        initialSpeech: "¡Hola amigo! Vi el video en TikTok de la cerradura digital que se abre con el celular. Se ve una maravilla pero tengo una duda grande: ¿si se va la luz en mi sector me quedo encerrado afuera?",
        turns: [
            {
                customerResponse: "Ah, qué alivio que use baterías AA y dure 10 meses. ¿Pero y si no sé instalarla? No soy bueno con herramientas y no quiero dañar mi puerta de madera.",
                objectionTip: "Ofrecer servicio de técnico a domicilio o guía paso a paso por videollamada con plantilla de instalación."
            },
            {
                customerResponse: "Qué buena onda. ¿Y puedo pagar con tarjeta de crédito o contra entrega cuando me llegue por Servientrega?",
                objectionTip: "Confirmar pagos por transferencia Banco Pichincha/Guayaquil, tarjeta hasta 12 meses o envío asegurado por Servientrega."
            },
            {
                customerResponse: "¡De una! Mándame el link de la tienda web para hacer el pago ya mismo antes de que se agote la oferta.",
                finalVerdict: "¡VENTA RESIDENCIAL CONVERTIDA! Resolviste la ansiedad técnica en tiempo récord."
            }
        ]
    }
}

export default function SuicideSquadWarRoom() {
    const [squads, setSquads] = useState<SquadData[]>([])
    const [systemUsers, setSystemUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<"squads" | "speeches" | "simulator" | "meta_empresarial">("squads")

    // Modals
    const [selectedSquadForPlaybook, setSelectedSquadForPlaybook] = useState<SquadData | null>(null)
    const [assigningSquadId, setAssigningSquadId] = useState<string | null>(null)

    // User assignment modal state
    const [selectedUserToAdd, setSelectedUserToAdd] = useState("")
    const [customUserName, setCustomUserName] = useState("")

    // ── SPEECHES VAULT STATE & SPEECH SYNTHESIS ──
    const [speechFilter, setSpeechFilter] = useState<"all" | "frio" | "caliente" | "objeciones" | "cierre">("all")
    const [speakingSpeechId, setSpeakingSpeechId] = useState<string | null>(null)

    const speakText = (text: string, id: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return
        window.speechSynthesis.cancel()
        if (speakingSpeechId === id) {
            setSpeakingSpeechId(null)
            return
        }
        const clean = text.replace(/[*_#"]/g, "")
        const utter = new SpeechSynthesisUtterance(clean)
        utter.lang = "es-EC"
        utter.rate = 1.02
        utter.pitch = 1.0
        utter.onend = () => setSpeakingSpeechId(null)
        utter.onerror = () => setSpeakingSpeechId(null)
        setSpeakingSpeechId(id)
        window.speechSynthesis.speak(utter)
    }

    const stopSpeaking = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel()
        }
        setSpeakingSpeechId(null)
    }

    // ── CLIENT ROLEPLAY CALL SIMULATOR (ESTILO CHATGPT / GEMINI LIVE) ──
    const [selectedPersonaKey, setSelectedPersonaKey] = useState<"marcelo" | "valeria" | "carlos">("marcelo")
    const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle")
    const [callSeconds, setCallSeconds] = useState(0)
    const [callHistory, setCallHistory] = useState<{ speaker: "customer" | "seller"; text: string; time: string }[]>([])
    const [clientTurnIndex, setClientTurnIndex] = useState(0)
    const [sellerCustomText, setSellerCustomText] = useState("")
    const [callScores, setCallScores] = useState<{ tone: number; objection: number; closing: number; summary: string } | null>(null)

    // ── META EMPRESARIAL 2026 DASHBOARD STATE ──
    const companyMonthlyTarget = 30000
    const companyCurrentRevenue = 19450
    const [incentiveSquadFilter, setIncentiveSquadFilter] = useState<string>("all")

    // ── 3-LEVEL HIERARCHICAL CATALOG EXPLORER STATE ──
    const [explorerOpen, setExplorerOpen] = useState(false)
    const [explorerLevel, setExplorerLevel] = useState<1 | 2 | 3>(1) // 1: Squad Categories, 2: Subcategories, 3: Products
    const [activeSquad, setActiveSquad] = useState<SquadData | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryItem | null>(null)

    // Subcategories list
    const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryItem[]>([])
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false)

    // Products modal state
    const [productsList, setProductsList] = useState<ProductItem[]>([])
    const [productsLoading, setProductsLoading] = useState(false)
    const [productSearch, setProductSearch] = useState("")
    const [productSort, setProductSort] = useState<"price_asc" | "price_desc" | "name_asc">("price_asc")
    const [totalProductsCount, setTotalProductsCount] = useState(0)

    // Copy alert
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2500)
    }

    // ── QUOTATION ITEMS STATE & HANDLER ──
    const [quoteItems, setQuoteItems] = useState<{
        id: string
        productId: string
        description: string
        quantity: number
        unitPrice: number
        customImage?: string
    }[]>([])

    // Load quote items from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('atomic_quote_items')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    setQuoteItems(parsed.filter((it: any) => it.description || it.productId))
                }
            }
        } catch (e) {}
    }, [])

    const handleAddToQuote = (p: ProductItem) => {
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

        setQuoteItems(prev => {
            const cleanPrev = prev.filter(it => it.productId || it.description)
            const existingIndex = cleanPrev.findIndex(item => item.productId === p.id)
            let updated: typeof prev = []

            if (existingIndex >= 0) {
                updated = cleanPrev.map((item, idx) =>
                    idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                const newItem = {
                    id: String(Date.now() + Math.random()),
                    productId: p.id,
                    description: p.name,
                    quantity: 1,
                    unitPrice: pvp,
                    customImage: photoUrl || undefined
                }
                updated = [...cleanPrev, newItem]
            }

            try {
                localStorage.setItem('atomic_quote_items', JSON.stringify(updated))
                // Also synchronize to atomic_cart
                const currentCartStr = localStorage.getItem('atomic_cart')
                let currentCart = currentCartStr ? JSON.parse(currentCartStr) : []
                if (Array.isArray(currentCart)) {
                    const existingInCart = currentCart.find((it: any) => it.id === p.id)
                    if (existingInCart) {
                        existingInCart.quantity += 1
                    } else {
                        currentCart.push({
                            id: p.id,
                            name: p.name,
                            price: pvp,
                            quantity: 1,
                            image: photoUrl || undefined
                        })
                    }
                    localStorage.setItem('atomic_cart', JSON.stringify(currentCart))
                }
            } catch (e) {}

            return updated
        })

        setCopiedKey(`quoted-${p.id}`)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const quoteItemsCount = quoteItems.reduce((acc, it) => acc + (it.quantity || 1), 0)
    const quoteTotalPvp = quoteItems.reduce((acc, it) => acc + ((it.unitPrice || 0) * (it.quantity || 1)), 0)

    // Total products in system
    const totalSquadsProducts = useMemo(() => {
        return squads.reduce((acc, s) => acc + (s.productCount || 0), 0)
    }, [squads])

    // Total assigned operatives
    const totalAssignedOperatives = useMemo(() => {
        return squads.reduce((acc, s) => acc + (s.members?.length || 0), 0)
    }, [squads])

    // ── 1. LOAD SQUADS & MEMBERS ──
    const loadSquadsData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/tools/suicide-squad")
            const data = await res.json()
            if (data.success) {
                setSquads(data.squads)
                setSystemUsers(data.systemUsers || [])
            }
        } catch (e) {
            console.error("Error loading suicide squads:", e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadSquadsData()
    }, [])

    // ── 2. SAVE ASSIGNMENTS PERSISTENTLY ──
    const handleSaveAssignments = async (updatedSquads: SquadData[]) => {
        setIsSaving(true)
        try {
            const assignmentsMap: Record<string, SquadMember[]> = {}
            updatedSquads.forEach(s => {
                assignmentsMap[s.id] = s.members || []
            })

            await fetch("/api/tools/suicide-squad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignments: assignmentsMap })
            })
        } catch (e) {
            console.error("Error saving assignments:", e)
        } finally {
            setIsSaving(false)
        }
    }

    // Assign a member to a squad
    const handleAddMember = (squadId: string) => {
        let memberToAdd: SquadMember | null = null

        if (selectedUserToAdd) {
            const user = systemUsers.find(u => u.id === selectedUserToAdd)
            if (user) {
                memberToAdd = {
                    id: user.id,
                    name: user.name || user.email.split("@")[0],
                    email: user.email,
                    role: user.role,
                    status: "GRABANDO",
                    avatar: user.name?.slice(0, 2).toUpperCase() || "OP"
                }
            }
        } else if (customUserName.trim()) {
            memberToAdd = {
                id: `custom-${Date.now()}`,
                name: customUserName.trim(),
                email: "colaborador@atomic.com.ec",
                role: "CREADOR VIRAL",
                status: "GRABANDO",
                avatar: customUserName.trim().slice(0, 2).toUpperCase()
            }
        }

        if (!memberToAdd) return

        const updated = squads.map(s => {
            if (s.id === squadId) {
                const currentMembers = s.members || []
                if (currentMembers.some(m => m.id === memberToAdd!.id)) return s
                return {
                    ...s,
                    members: [...currentMembers, memberToAdd!]
                }
            }
            return s
        })

        setSquads(updated)
        handleSaveAssignments(updated)
        setAssigningSquadId(null)
        setSelectedUserToAdd("")
        setCustomUserName("")
    }

    // Remove a member from a squad
    const handleRemoveMember = (squadId: string, memberId: string) => {
        const updated = squads.map(s => {
            if (s.id === squadId) {
                return {
                    ...s,
                    members: (s.members || []).filter(m => m.id !== memberId)
                }
            }
            return s
        })
        setSquads(updated)
        handleSaveAssignments(updated)
    }

    // ── 3. HIERARCHICAL EXPLORER LOGIC (NIVELES 1, 2 Y 3) ──
    const handleOpenCategoryDirectly = (squad: SquadData, categoryName: string) => {
        setActiveSquad(squad)
        setSelectedCategory(categoryName)
        setSelectedSubcategory(null)
        setExplorerLevel(2)
        setExplorerOpen(true)
        fetchSubcategories(categoryName)
    }

    const handleOpenSquadCategories = (squad: SquadData) => {
        setActiveSquad(squad)
        setSelectedCategory(null)
        setSelectedSubcategory(null)
        setExplorerLevel(1)
        setExplorerOpen(true)
    }

    const fetchSubcategories = async (categoryName: string) => {
        setSubcategoriesLoading(true)
        try {
            const res = await fetch(`/api/tools/suicide-squad?action=subcategories&categoryName=${encodeURIComponent(categoryName)}`)
            const data = await res.json()
            if (data.success) {
                setSubcategoriesList(data.subcategories || [])
            }
        } catch (e) {
            console.error("Error fetching subcategories:", e)
        } finally {
            setSubcategoriesLoading(false)
        }
    }

    const handleSelectSubcategory = (sub: SubcategoryItem) => {
        setSelectedSubcategory(sub)
        setExplorerLevel(3)
        setProductSearch("")
        setProductSort("price_asc")
        fetchProducts(selectedCategory || "", sub, "", "price_asc")
    }

    const fetchProducts = async (categoryName: string, sub: SubcategoryItem | null, query: string = "", sort: string = "price_asc") => {
        setProductsLoading(true)
        try {
            const kwParam = sub && !sub.isAll && sub.keywords && sub.keywords.length > 0
                ? `&keywords=${encodeURIComponent(sub.keywords.join(','))}`
                : ""
            const squadParam = activeSquad ? `&squadId=${activeSquad.id}` : ""
            const catParam = categoryName ? `&categoryName=${encodeURIComponent(categoryName)}` : ""

            const url = `/api/tools/suicide-squad?action=products${catParam}${squadParam}${kwParam}&query=${encodeURIComponent(query)}&sortBy=${sort}&limit=100`
            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setProductsList(data.products || [])
                setTotalProductsCount(data.total || 0)
            }
        } catch (e) {
            console.error("Error fetching products:", e)
        } finally {
            setProductsLoading(false)
        }
    }

    const handleNavigateBack = () => {
        if (explorerLevel === 3) {
            setExplorerLevel(2)
            setSelectedSubcategory(null)
        } else if (explorerLevel === 2) {
            setExplorerLevel(1)
            setSelectedCategory(null)
            setSelectedSubcategory(null)
        }
    }

    const handleShareProduct = (p: ProductItem) => {
        const pvp = p.pvp ?? p.price
        const shareUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/web/product/${p.id}`
            : `https://atomicelectronics.com.ec/web/product/${p.id}`

        const pitchText =
            `*${p.name}*\n` +
            `💰 *PVP Oficial:* $${pvp.toFixed(2)} (Incluye IVA y Factura)\n` +
            `🛡️ *Garantía Nacional:* 100% Original con Soporte Técnico Directo\n` +
            `📦 *Disponibilidad:* ${p.stock > 0 ? 'Entrega Inmediata' : 'Bajo Pedido'}\n` +
            `📲 *Ver catálogo y especificaciones completas:* ${shareUrl}`

        copyToClipboard(pitchText, `shared-${p.id}`)
    }

    // ── CALL SIMULATOR CONTROLS ──
    const handleStartCall = () => {
        setCallStatus("calling")
        setCallHistory([])
        setClientTurnIndex(0)
        setCallScores(null)
        setCallSeconds(0)

        // Web Audio synthetic ringtone
        try {
            if (typeof window !== "undefined") {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
                const osc = audioCtx.createOscillator()
                const gain = audioCtx.createGain()
                osc.connect(gain)
                gain.connect(audioCtx.destination)
                osc.frequency.setValueAtTime(440, audioCtx.currentTime)
                gain.gain.setValueAtTime(0.12, audioCtx.currentTime)
                osc.start()
                osc.stop(audioCtx.currentTime + 1.2)
            }
        } catch (e) {}

        setTimeout(() => {
            setCallStatus("connected")
            const persona = CLIENT_PERSONAS[selectedPersonaKey]
            const initialText = persona.initialSpeech
            setCallHistory([{
                speaker: "customer",
                text: initialText,
                time: "00:01"
            }])
            speakText(initialText, "sim-call-initial")
        }, 2000)
    }

    const handleSellerSubmitReply = (replyText: string) => {
        if (!replyText.trim() || callStatus !== "connected") return
        const persona = CLIENT_PERSONAS[selectedPersonaKey]
        const currentTurn = persona.turns[clientTurnIndex]

        const updatedHistory = [
            ...callHistory,
            { speaker: "seller" as const, text: replyText.trim(), time: `00:${String(callSeconds).padStart(2, '0')}` }
        ]
        setCallHistory(updatedHistory)
        setSellerCustomText("")

        if (currentTurn) {
            setTimeout(() => {
                const customerMsg = currentTurn.customerResponse
                setCallHistory(prev => [
                    ...prev,
                    { speaker: "customer", text: customerMsg, time: `00:${String(callSeconds + 3).padStart(2, '0')}` }
                ])
                speakText(customerMsg, `sim-turn-${clientTurnIndex}`)

                if (clientTurnIndex + 1 >= persona.turns.length) {
                    setTimeout(() => {
                        setCallStatus("ended")
                        setCallScores({
                            tone: 94,
                            objection: 90,
                            closing: 95,
                            summary: currentTurn.finalVerdict || "¡Venta completada con éxito!"
                        })
                    }, 4000)
                } else {
                    setClientTurnIndex(prev => prev + 1)
                }
            }, 1200)
        }
    }

    const handleHangUp = () => {
        stopSpeaking()
        setCallStatus("ended")
        if (!callScores) {
            setCallScores({
                tone: 75,
                objection: 70,
                closing: 65,
                summary: "Llamada finalizada por el asesor antes de concluir la negociación."
            })
        }
    }

    useEffect(() => {
        let interval: any = null
        if (callStatus === "connected") {
            interval = setInterval(() => {
                setCallSeconds(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [callStatus])

    return (
        <div className="space-y-6">
            
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* 1. HERO COMMAND HEADER (DECISION-FIRST HIERARCHY / 2026 SAAS STANDARDS)     */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#070b1a] via-[#0b132e] to-[#070b1a] border border-cyan-500/25 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-cyan-500/20 to-indigo-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950 shrink-0">
                            <Flame size={24} className="text-rose-400 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                    SUICIDE SQUAD <span className="text-cyan-400 font-mono text-xs sm:text-sm font-bold">WAR ROOM</span>
                                </h1>
                                <span className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                                    5 Escuadras Activas
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed max-w-2xl">
                                Matriz táctica de venta rápida en video corto. Explorador de <strong className="text-white">3 niveles</strong> con catálogo maestro de inventario y PVP público para cierres inmediatos.
                            </p>
                        </div>
                    </div>

                    {/* Tab Navigation Pill Bar */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner self-stretch lg:self-auto overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveTab("squads")}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "squads"
                                    ? "bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`}
                        >
                            <ShieldAlert size={14} />
                            <span>Escuadras (5)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { stopSpeaking(); setActiveTab("speeches"); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "speeches"
                                    ? "bg-rose-500 text-black font-black shadow-md shadow-rose-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`}
                        >
                            <MessageSquare size={14} />
                            <span>Speeches & Técnicas</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { stopSpeaking(); setActiveTab("simulator"); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "simulator"
                                    ? "bg-amber-500 text-black font-black shadow-md shadow-amber-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`}
                        >
                            <PhoneCall size={14} />
                            <span>Simulador Cliente IA</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { stopSpeaking(); setActiveTab("meta_empresarial"); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                activeTab === "meta_empresarial"
                                    ? "bg-emerald-500 text-black font-black shadow-md shadow-emerald-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`}
                        >
                            <Trophy size={14} />
                            <span>Meta Empresarial ($30k)</span>
                        </button>
                    </div>
                </div>

                {/* ── EXECUTIVE KPI STRIP (4 CORE DECISION METRICS) ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80">
                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">Equipos en Catálogo</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl sm:text-2xl font-black text-white font-mono">
                                {totalSquadsProducts > 0 ? totalSquadsProducts.toLocaleString() : "9,736"}
                            </span>
                            <span className="text-[11px] text-cyan-400 font-bold">En Bodega</span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">Colaboradores a Cargo</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                                {totalAssignedOperatives}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">Asignados</span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">Rango Ticket Promedio</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
                                $40 — $650+
                            </span>
                            <span className="text-[10px] text-slate-400">PVP Base</span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">Estructura Viral</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                                25 Seg.
                            </span>
                            <span className="text-[11px] text-slate-400">Retención Máx.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* 2. TAB 1: THE 5 SQUAD WAR CARDS (PROPORTIONAL HIERARCHY & SIZING SCALE)    */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "squads" && (
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="h-64 rounded-3xl bg-slate-950/50 border border-slate-800 flex flex-col items-center justify-center gap-3 text-cyan-400 font-mono text-xs">
                            <RefreshCw size={24} className="animate-spin text-cyan-400" />
                            <span>Cargando matriz táctica de las 5 Escuadras Virales...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                            {squads.map((squad) => {
                                const style = THEME_STYLES[squad.colorTheme] || THEME_STYLES.rose
                                const members = squad.members || []

                                return (
                                    <div
                                        key={squad.id}
                                        className={`rounded-3xl bg-[#080d22]/95 border-2 ${style.border} ${style.borderHover} ${style.cardGlow} p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative group hover:-translate-y-1`}
                                    >
                                        {/* Card Top: Code, Priority, Viral Gauge */}
                                        <div className="space-y-4">
                                            
                                            {/* Header Bar */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-xl text-xs font-mono font-black border ${style.badgeBg} ${style.badgeText} shadow-sm`}>
                                                        {squad.code}
                                                    </span>
                                                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                                                        {squad.priority}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800">
                                                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Poder:</span>
                                                    <span className={`text-xs font-mono font-black ${style.accentText}`}>
                                                        {squad.viralScore}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Squad Title & Mission */}
                                            <div>
                                                <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                                                    {squad.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-300 mt-0.5">
                                                    {squad.subtitle}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                                                    {squad.mission}
                                                </p>
                                            </div>

                                            {/* ── BOTONES DE CADA CATEGORÍA (NIVEL 1) ── */}
                                            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                                                <div className="flex items-center justify-between text-[11px] font-mono">
                                                    <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                                                        <FolderTree size={13} />
                                                        Líneas de la Escuadra ({squad.categories.length})
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">Clic para abrir</span>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-1.5">
                                                    {squad.categories.map((catName) => {
                                                        const detail = squad.categoryDetails?.find(c => c.name.toLowerCase() === catName.toLowerCase())
                                                        const count = detail?.count ?? 0
                                                        const landingSlug = getCategoryLandingSlug(catName, squad.id)
                                                        return (
                                                            <div key={catName} className="inline-flex items-center rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400 transition-all shadow-sm">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenCategoryDirectly(squad, catName)}
                                                                    className="group/cat flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
                                                                    title={`Explorar subcategorías de ${catName}`}
                                                                >
                                                                    <span className="font-semibold">{catName}</span>
                                                                    {count > 0 && (
                                                                        <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                                                                            {count}
                                                                        </span>
                                                                    )}
                                                                    <ChevronRight size={12} className="text-slate-500 group-hover/cat:text-cyan-400 group-hover/cat:translate-x-0.5 transition-transform" />
                                                                </button>
                                                                <a
                                                                    href={`/bienvenida/categoria/${landingSlug}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1.5 pr-2 text-slate-400 hover:text-cyan-300 border-l border-slate-800 transition-colors"
                                                                    title={`Abrir Landing de Bienvenida de ${catName}`}
                                                                >
                                                                    <ExternalLink size={11} />
                                                                </a>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Viral Hook Quote Card */}
                                            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                                                <div className="flex items-center justify-between text-[11px] font-mono">
                                                    <span className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wider">
                                                        <Sparkles size={12} />
                                                        Gancho Psicológico Viral:
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(squad.viralHook, `hook-${squad.id}`)}
                                                        className="text-amber-400 hover:text-white transition-colors cursor-pointer p-0.5"
                                                        title="Copiar gancho al portapapeles"
                                                    >
                                                        {copiedKey === `hook-${squad.id}` ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-amber-100/90 italic font-sans leading-relaxed">
                                                    &ldquo;{squad.viralHook}&rdquo;
                                                </p>
                                            </div>

                                            {/* Assigned Operatives */}
                                            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                                                <div className="flex items-center justify-between text-[11px] font-mono">
                                                    <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Users size={13} className="text-cyan-400" />
                                                        Operativos Asignados ({members.length})
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAssigningSquadId(squad.id)}
                                                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${style.badgeBg} ${style.badgeText} hover:scale-105`}
                                                    >
                                                        <UserPlus size={12} />
                                                        <span>+ Asignar</span>
                                                    </button>
                                                </div>

                                                {members.length === 0 ? (
                                                    <div className="py-2 px-3 rounded-xl border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
                                                        Sin colaborador asignado aún. Clic en &apos;+ Asignar&apos;.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                                                        {members.map((m) => (
                                                            <div
                                                                key={m.id}
                                                                className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] text-black shrink-0 ${style.btnPrimary}`}>
                                                                        {m.avatar || m.name.slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="font-bold text-white text-xs truncate">{m.name}</div>
                                                                        <div className="text-[10px] font-mono text-slate-400 truncate">{m.role || "Ventas"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                        {m.status || "GRABANDO"}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveMember(squad.id, m.id)}
                                                                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                                                        title="Remover miembro"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Flagship Products Preview Mini-Grid */}
                                            <div className="pt-2 border-t border-slate-800/80">
                                                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                                                    <span className="font-semibold">Top Ventas Insignia:</span>
                                                    <span className="text-cyan-400 font-bold">{squad.productCount} productos</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {squad.flagships.slice(0, 2).map((item, i) => (
                                                        <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                                            <div className="text-xs font-bold text-white line-clamp-1" title={item.name}>
                                                                {item.name}
                                                            </div>
                                                            <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                                                                <span className="text-emerald-400 font-bold">${item.price.toFixed(2)}</span>
                                                                <span className="text-slate-500">Stock: {item.stock}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Buttons */}
                                        <div className="pt-4 mt-5 border-t border-slate-800 space-y-2">
                                            <a
                                                href={`/bienvenida/categoria/${getCategoryLandingSlug(squad.categories[0] || '', squad.id)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2 px-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm group/landing"
                                            >
                                                <Sparkles size={13} className="text-cyan-400 group-hover/landing:animate-spin" />
                                                <span>🌐 Ver Landing de Bienvenida</span>
                                                <ExternalLink size={12} className="text-cyan-400" />
                                            </a>

                                            <div className="flex gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSquadForPlaybook(squad)}
                                                    className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                                >
                                                    <FileText size={14} className="text-cyan-400" />
                                                    <span>Plan & Guión</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenSquadCategories(squad)}
                                                    className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${style.btnPrimary}`}
                                                >
                                                    <Eye size={14} />
                                                    <span>Explorar ({squad.productCount})</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* 3. TAB 2: SPEECHES & TÉCNICAS DE VENTA EN VIVO (REEMPLAZA PLAYBOOK)        */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "speeches" && (
                <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Flame size={13} />
                                <span>Bóveda Táctica de Conversión</span>
                            </span>
                            <h2 className="text-lg sm:text-xl font-black text-white">
                                Speeches & Técnicas de Venta en Vivo
                            </h2>
                            <p className="text-xs text-slate-400 font-mono">
                                Guiones probados para llamadas en frío, ofertas flash a clientes anteriores y derribo de objeciones duras con audio guía IA.
                            </p>
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-slate-950 border border-slate-800 self-stretch sm:self-auto shrink-0">
                            {[
                                { id: "all", label: "Todos (6)" },
                                { id: "frio", label: "❄️ En Frío" },
                                { id: "caliente", label: "🔥 Clientes Anteriores" },
                                { id: "objeciones", label: "🛡️ Objeciones Duras" },
                                { id: "cierre", label: "⚡ Cierres" }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setSpeechFilter(f.id as any)}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        speechFilter === f.id
                                            ? "bg-rose-500 text-black font-black shadow-md shadow-rose-500/30"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Speeches Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SPEECHES_VAULT.filter(s => speechFilter === "all" || s.category === speechFilter).map((speech) => {
                            const isSpeaking = speakingSpeechId === speech.id
                            const isCopied = copiedKey === `speech-${speech.id}`

                            return (
                                <div
                                    key={speech.id}
                                    className="p-5 rounded-3xl bg-[#080d22] border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                                                {speech.badge}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500 truncate">
                                                🎯 {speech.target}
                                            </span>
                                        </div>

                                        <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                                            {speech.title}
                                        </h3>

                                        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line select-all">
                                            {speech.script}
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 font-sans italic">
                                            💡 <strong className="text-slate-300 font-medium">Clave del éxito:</strong> {speech.tips}
                                        </div>
                                    </div>

                                    {/* Action Buttons: Audio and Copy */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => speakText(speech.script, speech.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                isSpeaking
                                                    ? "bg-rose-500 text-black font-black animate-pulse shadow-md shadow-rose-500/40"
                                                    : "bg-slate-900 text-rose-300 hover:bg-slate-800 border border-rose-500/30"
                                            }`}
                                        >
                                            {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                            <span>{isSpeaking ? "Pausar Voz IA" : "Escuchar Tono IA"}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(speech.script, `speech-${speech.id}`)}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                isCopied
                                                    ? "bg-emerald-500 text-black font-black"
                                                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
                                            }`}
                                        >
                                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                                            <span>{isCopied ? "¡Copiado!" : "Copiar"}</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* 4. TAB 3: SIMULADOR DE LLAMADAS CON CLIENTE IA (ESTILO CHATGPT / GEMINI)   */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "simulator" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Radio size={13} className="text-amber-400 animate-pulse" />
                                <span>Entrenamiento de Audio & Objeciones en Tiempo Real</span>
                            </span>
                            <h2 className="text-lg sm:text-xl font-black text-white">
                                Simulador de Llamadas con Cliente IA
                            </h2>
                            <p className="text-xs text-slate-400 font-mono">
                                Entrena con clientes simulados que hablan con voz natural en español y presentan objeciones duras de precio, garantía y desconfianza.
                            </p>
                        </div>

                        {callStatus === "connected" && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>EN LLAMADA: 00:{String(callSeconds).padStart(2, '0')}</span>
                            </div>
                        )}
                    </div>

                    {/* Persona Selector Tabs */}
                    {callStatus === "idle" && (
                        <div className="space-y-3">
                            <span className="text-xs font-mono font-bold uppercase text-slate-400">
                                1. Selecciona el Tipo de Cliente para la Simulación:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(Object.keys(CLIENT_PERSONAS) as (keyof typeof CLIENT_PERSONAS)[]).map((key) => {
                                    const p = CLIENT_PERSONAS[key]
                                    const isSelected = selectedPersonaKey === key
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => setSelectedPersonaKey(key)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                                                isSelected
                                                    ? "bg-amber-950/30 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40"
                                                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl shrink-0">{p.avatar}</span>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-xs font-black text-white">{p.name}</h4>
                                                    <p className="text-[10px] text-amber-300 font-mono font-bold">{p.role}</p>
                                                    <p className="text-[10px] text-slate-400 font-sans mt-1">{p.personality}</p>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                                                <span className="text-slate-500">Dificultad:</span>
                                                <span className="font-bold text-amber-400">
                                                    {key === "marcelo" ? "⭐⭐⭐ Alta" : key === "valeria" ? "⭐⭐⭐ Corporativa" : "⭐⭐ Residencial"}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Call Initiate Box */}
                            <div className="p-6 rounded-3xl bg-[#080d22] border border-slate-800 text-center space-y-4 shadow-xl">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-black mx-auto shadow-lg shadow-amber-500/30">
                                    <PhoneCall size={28} className="animate-bounce" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-black text-white">
                                        ¿Listo para marcar a {CLIENT_PERSONAS[selectedPersonaKey].name}?
                                    </h3>
                                    <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
                                        El cliente responderá por voz. Escucha su postura inicial y responde derribando sus objeciones con las directivas de ATOMIC.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleStartCall}
                                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/30 hover:scale-105"
                                >
                                    📞 Iniciar Llamada de Prueba con Voz
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Calling Animation Screen */}
                    {callStatus === "calling" && (
                        <div className="p-12 rounded-3xl bg-[#080d22] border border-amber-500/40 text-center space-y-6 shadow-2xl">
                            <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mx-auto animate-pulse">
                                {CLIENT_PERSONAS[selectedPersonaKey].avatar}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-white">
                                    Llamando a {CLIENT_PERSONAS[selectedPersonaKey].name}...
                                </h3>
                                <p className="text-xs text-amber-400 font-mono animate-pulse">
                                    Conectando audio de prueba • Tono de llamada...
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCallStatus("idle")}
                                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}

                    {/* Active In-Call Conversation Screen */}
                    {callStatus === "connected" && (
                        <div className="p-5 sm:p-6 rounded-3xl bg-[#080d22] border-2 border-emerald-500/40 space-y-5 shadow-2xl">
                            {/* Call Header */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{CLIENT_PERSONAS[selectedPersonaKey].avatar}</span>
                                    <div>
                                        <h4 className="text-sm font-black text-white">
                                            {CLIENT_PERSONAS[selectedPersonaKey].name}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            {CLIENT_PERSONAS[selectedPersonaKey].role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                                        <Volume2 size={16} className="animate-pulse" />
                                        <span>Audio Activo</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleHangUp}
                                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <PhoneOff size={13} />
                                        <span>Colgar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Chat bubbles history */}
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                {callHistory.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex gap-2.5 ${item.speaker === "seller" ? "justify-end" : "justify-start"}`}
                                    >
                                        {item.speaker === "customer" && (
                                            <span className="text-2xl shrink-0 mt-0.5">
                                                {CLIENT_PERSONAS[selectedPersonaKey].avatar}
                                            </span>
                                        )}
                                        <div
                                            className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-mono leading-relaxed ${
                                                item.speaker === "seller"
                                                    ? "bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-md"
                                                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-1 text-[9px] text-slate-400 font-bold uppercase">
                                                <span>{item.speaker === "seller" ? "Tú (Asesor)" : CLIENT_PERSONAS[selectedPersonaKey].name}</span>
                                                <span>{item.time}</span>
                                            </div>
                                            <p className="text-xs font-sans">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tactical Rebuttal Suggestions */}
                            <div className="pt-3 border-t border-slate-800 space-y-2">
                                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                                    ⚡ Respuestas Tácticas Rápidas (Haz clic para responder):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {selectedPersonaKey === "marcelo" && [
                                        "Garantía oficial de 1 año y repuestos en bodega nacional.",
                                        "Ofrecemos visita técnica previa sin costo para revisar el condominio.",
                                        "Descuento del 10% por paquete de 18 cerraduras con factura SRI."
                                    ].map((opt, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSellerSubmitReply(opt)}
                                            className="p-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white text-[11px] font-sans text-left transition-all cursor-pointer leading-snug"
                                        >
                                            {opt}
                                        </button>
                                    ))}

                                    {selectedPersonaKey === "valeria" && [
                                        "Contamos con 100% de stock inmediato en bodega para entrega en 48h.",
                                        "Somos empresa jurídica con facturación electrónica SRI y crédito comercial.",
                                        "Nuestros técnicos entregan acta de inducción y manuales a propietarios."
                                    ].map((opt, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSellerSubmitReply(opt)}
                                            className="p-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white text-[11px] font-sans text-left transition-all cursor-pointer leading-snug"
                                        >
                                            {opt}
                                        </button>
                                    ))}

                                    {selectedPersonaKey === "carlos" && [
                                        "Usa baterías AA con 10 meses de autonomía y puerto USB-C de auxilio.",
                                        "Incluimos servicio de instalación a domicilio garantizado por técnicos.",
                                        "Aceptamos transferencias bancarias o tarjeta de crédito hasta 12 meses."
                                    ].map((opt, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSellerSubmitReply(opt)}
                                            className="p-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white text-[11px] font-sans text-left transition-all cursor-pointer leading-snug"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom text response input */}
                                <div className="flex gap-2 pt-2">
                                    <input
                                        type="text"
                                        value={sellerCustomText}
                                        onChange={(e) => setSellerCustomText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSellerSubmitReply(sellerCustomText); }}
                                        placeholder="O escribe tu propio argumento de venta y presiona Enter..."
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-cyan-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSellerSubmitReply(sellerCustomText)}
                                        disabled={!sellerCustomText.trim()}
                                        className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono transition-all disabled:opacity-50 cursor-pointer shadow-md"
                                    >
                                        Responder
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Call Ended Scorecard Screen */}
                    {callStatus === "ended" && callScores && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#080d22] border-2 border-emerald-500/40 space-y-6 shadow-2xl text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                                <Award size={32} />
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                                    Evaluación de Desempeño Comercial
                                </span>
                                <h3 className="text-xl font-black text-white">
                                    {callScores.summary}
                                </h3>
                            </div>

                            {/* Score Metrics */}
                            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Asertividad</span>
                                    <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{callScores.tone}%</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Objeciones</span>
                                    <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{callScores.objection}%</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Cierre</span>
                                    <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{callScores.closing}%</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => { setCallStatus("idle"); setCallHistory([]); }}
                                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/30"
                            >
                                🔄 Entrenar con Otro Cliente
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* 5. TAB 4: META EMPRESARIAL 2026 DASHBOARD (REEMPLAZA CALCULADORA)           */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {activeTab === "meta_empresarial" && (
                <div className="space-y-6 max-w-5xl mx-auto">
                    {/* Header Banner with Speedometer / Thermometer */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070b1a] via-[#0d1738] to-[#070b1a] border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Trophy size={14} className="text-emerald-400" />
                                    <span>Objetivo Corporativo Mensual • Toda la Empresa</span>
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Meta Colectiva 2026: ${companyMonthlyTarget.toLocaleString()} USD
                                </h2>
                                <p className="text-xs text-slate-300 font-mono">
                                    Facturación acumulada del mes por las 5 cuadrillas comerciales hacia la meta empresarial unificada.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/40 text-center min-w-[170px] shrink-0">
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">RECAUDADO A LA FECHA</span>
                                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5 block">
                                    ${companyCurrentRevenue.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                    Faltan ${(companyMonthlyTarget - companyCurrentRevenue).toLocaleString()} USD
                                </span>
                            </div>
                        </div>

                        {/* Thermometer Progress Bar with Milestones */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-400 font-bold">Progreso de la Empresa:</span>
                                <span className="text-emerald-400 font-black text-sm">
                                    {Math.round((companyCurrentRevenue / companyMonthlyTarget) * 100)}% Cumplido
                                </span>
                            </div>
                            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${Math.round((companyCurrentRevenue / companyMonthlyTarget) * 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
                                <span>$0 (Inicio)</span>
                                <span>$15,000 (50%)</span>
                                <span>$22,500 (75%)</span>
                                <span className="text-emerald-400 font-bold">$30,000 (Bono Pool Desbloqueado)</span>
                            </div>
                        </div>

                        {/* Run-Rate Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="text-[10px] font-mono text-slate-400 uppercase block">Días Restantes</span>
                                <span className="text-lg font-black text-white font-mono">12 Días</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="text-[10px] font-mono text-slate-400 uppercase block">Run-Rate Diario</span>
                                <span className="text-lg font-black text-cyan-400 font-mono">$879.16 / día</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="text-[10px] font-mono text-slate-400 uppercase block">Bono Pool Global</span>
                                <span className="text-lg font-black text-amber-400 font-mono">+$1,500 USD</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="text-[10px] font-mono text-slate-400 uppercase block">Estado de Cuadrillas</span>
                                <span className="text-lg font-black text-emerald-400 font-mono">5 Activas</span>
                            </div>
                        </div>
                    </div>

                    {/* Squad Contributions Breakdown */}
                    <div className="space-y-3">
                        <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <BarChart3 size={14} className="text-cyan-400" />
                            <span>Aporte por Escuadra al Objetivo de $30k:</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                {
                                    squad: "S-01: El Guardián Urbano",
                                    meta: 10000,
                                    actual: 7200,
                                    color: "border-rose-500/30 text-rose-400",
                                    icon: "📹",
                                    podium: "🥇 1er Lugar"
                                },
                                {
                                    squad: "S-02: Llave Cero",
                                    meta: 8000,
                                    actual: 5400,
                                    color: "border-emerald-500/30 text-emerald-400",
                                    icon: "🔐",
                                    podium: "🥈 2do Lugar"
                                },
                                {
                                    squad: "S-03: Anti-Apagones",
                                    meta: 4500,
                                    actual: 3150,
                                    color: "border-amber-500/30 text-amber-400",
                                    icon: "⚡",
                                    podium: "🥉 3er Lugar"
                                },
                                {
                                    squad: "S-04: Casa Futurista",
                                    meta: 4000,
                                    actual: 2100,
                                    color: "border-cyan-500/30 text-cyan-400",
                                    icon: "🏠",
                                    podium: "4to Lugar"
                                },
                                {
                                    squad: "S-05: Setup Máximo",
                                    meta: 3500,
                                    actual: 1600,
                                    color: "border-purple-500/30 text-purple-400",
                                    icon: "💻",
                                    podium: "5to Lugar"
                                }
                            ].map((sq, idx) => {
                                const sqProgress = Math.round((sq.actual / sq.meta) * 100)
                                return (
                                    <div key={idx} className={`p-4 rounded-2xl bg-slate-900 border ${sq.color} space-y-3`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <span>{sq.icon}</span>
                                                <span>{sq.squad}</span>
                                            </span>
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300">
                                                {sq.podium}
                                            </span>
                                        </div>

                                        <div className="flex items-baseline justify-between text-xs font-mono">
                                            <span className="text-white font-black text-sm">${sq.actual.toLocaleString()}</span>
                                            <span className="text-slate-400">Meta: ${sq.meta.toLocaleString()} ({sqProgress}%)</span>
                                        </div>

                                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                                                style={{ width: `${sqProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Corporate Incentive Pool Details */}
                    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                            <Award size={14} className="text-amber-400" />
                            <span>Bases de Distribución del Pool de Incentivos ($1,500 USD)</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-amber-400 font-bold block mb-1">1. Condición de Acceso:</span>
                                80% de asistencia mensual y cumplimiento de la Ruta del Día obligatoria.
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-emerald-400 font-bold block mb-1">2. Cuadrilla Campeona:</span>
                                40% del pool ($600) se reparte entre los integrantes de la escuadra con mayor porcentaje.
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-cyan-400 font-bold block mb-1">3. Bono Individual:</span>
                                Asesores con más de $3,500 en ventas personales reciben bono directo de $150.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL 1: ASIGNAR COLABORADOR                                                */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {assigningSquadId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
                        <div className="w-full max-w-md bg-[#090e24] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="font-black text-white text-base">Asignar Operativo a la Escuadra</h3>
                                <button
                                    type="button"
                                    onClick={() => setAssigningSquadId(null)}
                                    className="p-1 rounded-xl text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-3.5">
                                <div>
                                    <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                                        Seleccionar usuario registrado del sistema:
                                    </label>
                                    <select
                                        value={selectedUserToAdd}
                                        onChange={(e) => {
                                            setSelectedUserToAdd(e.target.value)
                                            if (e.target.value) setCustomUserName("")
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">-- Seleccionar usuario --</option>
                                        {systemUsers.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.name || u.email} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="text-center text-[10px] font-mono text-slate-500">
                                    - O ingresa un colaborador manual -
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                                        Nombre del Colaborador / Creador:
                                    </label>
                                    <input
                                        type="text"
                                        value={customUserName}
                                        onChange={(e) => {
                                            setCustomUserName(e.target.value)
                                            if (e.target.value) setSelectedUserToAdd("")
                                        }}
                                        placeholder="Ej: David Proaño (Tiktoker Oficial)"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setAssigningSquadId(null)}
                                    className="flex-1 py-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white font-mono text-xs font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddMember(assigningSquadId)}
                                    disabled={!selectedUserToAdd && !customUserName.trim()}
                                    className="flex-1 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black font-mono text-xs disabled:opacity-50 cursor-pointer shadow-md"
                                >
                                    Confirmar Asignación
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL 2: PLAYBOOK & GUIÓN VIRAL DEL SQUAD                                   */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedSquadForPlaybook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
                        <div className="w-full max-w-2xl bg-[#090e24] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                            {selectedSquadForPlaybook.code}
                                        </span>
                                        <h3 className="font-black text-white text-base">
                                            {selectedSquadForPlaybook.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                        {selectedSquadForPlaybook.subtitle}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSquadForPlaybook(null)}
                                    className="p-1 rounded-xl text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                                        <FileText size={14} />
                                        Guión Teleprompter Listo para Grabar:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(selectedSquadForPlaybook.scriptTeleprompter, "script-copy")}
                                        className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {copiedKey === "script-copy" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                        <span>{copiedKey === "script-copy" ? "¡Copiado!" : "Copiar Guión"}</span>
                                    </button>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line select-all">
                                    {selectedSquadForPlaybook.scriptTeleprompter}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold">
                                        Palabra Clave de Activación Bot WhatsApp:
                                    </span>
                                    <span className="text-base font-black text-white font-mono mt-0.5 block">
                                        &ldquo;{selectedSquadForPlaybook.whatsappKeyword}&rdquo;
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.open(`https://wa.me/593963226319?text=Hola,%20vi%20el%20video%20de%20${selectedSquadForPlaybook.whatsappKeyword}`, "_blank")
                                    }}
                                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                                >
                                    <MessageSquare size={13} />
                                    <span>Probar en WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL 3: EXPLORADOR JERÁRQUICO 3 NIVELES (REDESIGN HIGH-CONTRAST & SCALE)   */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {explorerOpen && activeSquad && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-150">
                        <div className="w-full max-w-6xl h-[92vh] bg-[#070b19] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
                            
                            {/* Breadcrumbs Navigation Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
                                <div className="flex items-center gap-3">
                                    {/* Botón Volver si está en Nivel 2 o 3 */}
                                    {explorerLevel > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleNavigateBack}
                                            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
                                            title="Volver al nivel anterior"
                                        >
                                            <ArrowLeft size={16} />
                                            <span className="hidden sm:inline">Volver</span>
                                        </button>
                                    )}

                                    <div>
                                        {/* Breadcrumbs interactivos */}
                                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                            <button
                                                type="button"
                                                onClick={() => { setExplorerLevel(1); setSelectedCategory(null); setSelectedSubcategory(null); }}
                                                className={`font-black flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                                                    explorerLevel === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white cursor-pointer'
                                                }`}
                                            >
                                                <span>{activeSquad.code} {activeSquad.name}</span>
                                            </button>

                                            {selectedCategory && (
                                                <>
                                                    <ChevronRight size={13} className="text-slate-600" />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setExplorerLevel(2); setSelectedSubcategory(null); }}
                                                        className={`font-bold px-2.5 py-1 rounded-lg transition-colors ${
                                                            explorerLevel === 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white cursor-pointer'
                                                        }`}
                                                    >
                                                        <span>{selectedCategory}</span>
                                                    </button>
                                                </>
                                            )}

                                            {selectedSubcategory && (
                                                <>
                                                    <ChevronRight size={13} className="text-slate-600" />
                                                    <span className="font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                        {selectedSubcategory.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400 font-mono mt-1">
                                            {explorerLevel === 1 && `Paso 1/3: Selecciona una de las categorías de la escuadra para explorar sus subfamilias.`}
                                            {explorerLevel === 2 && `Paso 2/3: Subfamilias de "${selectedCategory}". Selecciona una para ver todos los productos con PVP.`}
                                            {explorerLevel === 3 && `Paso 3/3: Catálogo con PVP Oficial (${totalProductsCount} productos). Añade a cotización formal o comparte en WhatsApp.`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/bienvenida/categoria/${getCategoryLandingSlug(selectedCategory || activeSquad.categories[0], activeSquad.id)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                                        title="Abrir Landing de Bienvenida pública de esta categoría"
                                    >
                                        <Sparkles size={13} className="text-cyan-400" />
                                        <span className="hidden sm:inline">Landing de Bienvenida</span>
                                        <ExternalLink size={12} />
                                    </a>

                                    {quoteItemsCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => window.open('/dashboard/quotes', '_blank')}
                                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                                            title="Abrir cotizador oficial PROP con los productos seleccionados"
                                        >
                                            <FileSpreadsheet size={13} />
                                            <span>Cotización ({quoteItemsCount})</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setExplorerOpen(false)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* ── VISTA NIVEL 1: CATEGORÍAS DE LA ESCUADRA ── */}
                            {explorerLevel === 1 && (
                                <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeSquad.categories.map((catName) => {
                                            const detail = activeSquad.categoryDetails?.find(c => c.name.toLowerCase() === catName.toLowerCase())
                                            const count = detail?.count ?? 0

                                            return (
                                                <div
                                                    key={catName}
                                                    onClick={() => handleOpenCategoryDirectly(activeSquad, catName)}
                                                    className="p-6 rounded-3xl bg-[#090e24] border-2 border-slate-800 hover:border-cyan-400 p-5 flex flex-col justify-between transition-all group hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-cyan-500/10"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-sm">
                                                                <FolderTree size={20} />
                                                            </div>
                                                            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-400">
                                                                {count} productos
                                                            </span>
                                                        </div>
                                                        <h4 className="font-black text-white text-base sm:text-lg group-hover:text-cyan-300 transition-colors">
                                                            {catName}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                                            Haz clic para desplegar las subfamilias y todos los equipos de esta línea.
                                                        </p>
                                                    </div>

                                                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                                                        <span>Ver Subcategorías</span>
                                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── VISTA NIVEL 2: SUBCATEGORÍAS ── */}
                            {explorerLevel === 2 && (
                                <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
                                    {subcategoriesLoading ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
                                            <RefreshCw size={24} className="animate-spin text-cyan-400" />
                                            <span>Consultando subcategorías e inventario en vivo...</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {subcategoriesList.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    onClick={() => handleSelectSubcategory(sub)}
                                                    className="p-6 rounded-3xl bg-[#090e24] border-2 border-slate-800 hover:border-emerald-400 p-5 flex flex-col justify-between transition-all group hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-sm">
                                                                <Layers size={20} />
                                                            </div>
                                                            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono font-black text-emerald-400">
                                                                {sub.count} productos
                                                            </span>
                                                        </div>

                                                        <h4 className="font-black text-white text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
                                                            {sub.name}
                                                        </h4>

                                                        {sub.description && (
                                                            <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                                                {sub.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                                                        <span>Desplegar Productos con PVP</span>
                                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── VISTA NIVEL 3: PRODUCTOS CON PVP PÚBLICO Y ACCIONES ── */}
                            {explorerLevel === 3 && (
                                <>
                                    {/* Search & Sort Filter Bar */}
                                    <div className="py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
                                        <div className="relative flex-1 min-w-[240px]">
                                            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                                            <input
                                                type="text"
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                placeholder={`Buscar por nombre, SKU o marca en ${selectedSubcategory?.name || 'subcategoría'}...`}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Ordenar:</span>
                                            <select
                                                value={productSort}
                                                onChange={(e) => setProductSort(e.target.value as any)}
                                                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                                            >
                                                <option value="price_asc">Menor PVP ($ → $$$)</option>
                                                <option value="price_desc">Mayor PVP ($$$ → $)</option>
                                                <option value="name_asc">Nombre A-Z</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Scrollable Product Grid */}
                                    <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                        {productsLoading ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
                                                <RefreshCw size={24} className="animate-spin text-emerald-400" />
                                                <span>Cargando productos con PVP Público...</span>
                                            </div>
                                        ) : productsList.length === 0 ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                                                No se encontraron productos coincidentes en esta subcategoría.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                                                {productsList.map((p) => {
                                                    let parsedImages: string[] = []
                                                    try {
                                                        if (p.images) {
                                                            const parsed = JSON.parse(p.images)
                                                            if (Array.isArray(parsed)) parsedImages = parsed
                                                        }
                                                    } catch (e) {
                                                        if (p.images && p.images.startsWith("http")) parsedImages = [p.images]
                                                    }

                                                    const photoUrl = parsedImages[0] || "/images/placeholder-product.png"
                                                    const pvp = p.pvp ?? p.price
                                                    const isCopied = copiedKey === `shared-${p.id}`
                                                    const quoteItem = quoteItems.find(it => it.productId === p.id)
                                                    const isAddedToQuote = !!quoteItem || copiedKey === `quoted-${p.id}`
                                                    const quoteQty = quoteItem?.quantity || (copiedKey === `quoted-${p.id}` ? 1 : 0)

                                                    return (
                                                        <div
                                                            key={p.id}
                                                            className="p-4 rounded-3xl bg-[#090e24] border border-slate-800/90 hover:border-emerald-400/60 flex flex-col justify-between transition-all group hover:scale-[1.01] shadow-lg"
                                                        >
                                                            <div className="space-y-3">
                                                                {/* Product Image / Preview */}
                                                                <div className="w-full h-40 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                                                                    <img
                                                                        src={photoUrl}
                                                                        alt={p.name}
                                                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                                        onError={(e) => {
                                                                            (e.target as any).src = "https://placehold.co/300x200/0f172a/38bdf8?text=ATOMIC"
                                                                        }}
                                                                    />
                                                                    <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-white/10 uppercase">
                                                                        {p.category?.name || "Catálogo"}
                                                                    </span>
                                                                    <span className={`absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                                                                        p.stock > 0 ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                                                    }`}>
                                                                        {p.stock > 0 ? `${p.stock} unid.` : 'Bajo Pedido'}
                                                                    </span>
                                                                </div>

                                                                {/* Title & SKU */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors" title={p.name}>
                                                                        {p.name}
                                                                    </h4>
                                                                    {p.sku && (
                                                                        <span className="text-[10px] font-mono text-slate-500 block mt-1">
                                                                            REF/SKU: {p.sku}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* PVP Público Highlighted Box */}
                                                                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                                                                    <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                                                                        <span>PVP PÚBLICO</span>
                                                                        <span className="text-[9px] text-slate-400 font-normal">INC. IVA</span>
                                                                    </div>
                                                                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                                                                        ${pvp.toFixed(2)}
                                                                    </div>
                                                                    {p.distributorPrice && p.distributorPrice > 0 && (
                                                                        <div className="text-[10px] font-mono text-slate-400 mt-1 flex justify-between border-t border-emerald-500/20 pt-1">
                                                                            <span>Costo: ${p.distributorPrice.toFixed(2)}</span>
                                                                            <span className="text-cyan-400 font-bold">
                                                                                Margen: +${(pvp - p.distributorPrice).toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons: 1) Añadir a Cotización, 2) Compartir WhatsApp, 3) Abrir */}
                                                            <div className="pt-3.5 mt-3.5 border-t border-slate-800 flex items-center gap-2">
                                                                {/* Botón 1: Añadir a Cotización */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAddToQuote(p)}
                                                                    className={`flex-1 py-2 px-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                                                        isAddedToQuote
                                                                            ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-[1.02]"
                                                                            : "bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 active:scale-95"
                                                                    }`}
                                                                    title="Añadir producto a la cotización oficial formal (PDF / Excel)"
                                                                >
                                                                    {isAddedToQuote ? <Check size={13} /> : <Plus size={13} />}
                                                                    <span>{isAddedToQuote ? `Cotizando (${quoteQty})` : "+ Cotizar"}</span>
                                                                </button>

                                                                {/* Botón 2: Compartir Pitch WhatsApp */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleShareProduct(p)}
                                                                    className={`flex-1 py-2 px-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                                                        isCopied
                                                                            ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                                            : "bg-slate-900 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 active:scale-95"
                                                                    }`}
                                                                    title="Copiar mensaje con PVP y enlace para WhatsApp o compartir"
                                                                >
                                                                    {isCopied ? <Check size={13} /> : <Share2 size={13} />}
                                                                    <span>{isCopied ? "¡Copiado!" : "Compartir"}</span>
                                                                </button>

                                                                {/* Botón 3: Abrir Producto en Tienda */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const targetUrl = p.publicUrl || `/web/product/${p.id}`
                                                                        window.open(targetUrl, "_blank")
                                                                    }}
                                                                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-black text-slate-300 border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-mono active:scale-95"
                                                                    title="Abrir página oficial del producto en la tienda web"
                                                                >
                                                                    <ExternalLink size={13} />
                                                                    <span className="hidden sm:inline">Abrir</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ── BARRA INFERIOR DE COTIZACIÓN ACTIVA (GLASS DOCK) ── */}
                            {quoteItemsCount > 0 && (
                                <div className="shrink-0 mt-3 p-4 bg-gradient-to-r from-amber-950/90 via-[#0a1029] to-emerald-950/90 border-t-2 border-amber-500/50 flex flex-wrap items-center justify-between gap-3 rounded-2xl shadow-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
                                            <FileSpreadsheet size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-black text-white">
                                                    COTIZACIÓN EN CURSO:
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                                                    {quoteItemsCount} {quoteItemsCount === 1 ? 'producto' : 'productos'}
                                                </span>
                                            </div>
                                            <div className="text-xs font-mono text-slate-300 mt-0.5">
                                                Total PVP Acumulado: <span className="text-emerald-400 font-black">${quoteTotalPvp.toFixed(2)}</span> (Inc. IVA)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                localStorage.removeItem('atomic_quote_items')
                                                setQuoteItems([])
                                            }}
                                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
                                            title="Vaciar productos de la cotización actual"
                                        >
                                            Vaciar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                window.open('/dashboard/quotes', '_blank')
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs font-mono flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 transition-all"
                                        >
                                            <FileText size={15} />
                                            <span>Generar Cotización PROP (PDF / Excel)</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
