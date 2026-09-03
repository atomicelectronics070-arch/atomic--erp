"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Send, Loader2, Sparkles, Phone, MapPin, Calendar, Users, Star,
    ChevronRight, Printer, FileText, Upload, Zap, ShieldCheck, Check,
    Clock, AlertCircle, UserCheck, Trash2, StickyNote, Image as ImageIcon,
    Volume2, Compass, Shield, Sword, Scroll, Coins, Heart, MessageSquare
} from "lucide-react"
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator"
import { RealisticAvatar } from "@/components/office/RealisticAvatars"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
    currentModule?: string
    session?: any
    recentQuotes?: any[]
}

interface RPGEntity {
    id: string
    name: string
    title: string
    type: "npc" | "quest_client" | "portal" | "chest" | "board" | "throne" | "oracle" | "forge"
    x: number
    y: number
    avatarType: any
    level: number
    questStatus?: "available" | "in_progress" | "completed"
    dialogue: string
    icon: string
    color: string
}

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    alpha: number
    size: number
    color: string
}

export default function VirtualOfficeWorkspace({ currentModule = "ventas", session, recentQuotes = [] }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    // Player position and movement in world
    const [playerPos, setPlayerPos] = useState({ x: 420, y: 360 })
    const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null)
    const [playerFacing, setPlayerFacing] = useState<"left" | "right">("right")
    const [clickMarker, setClickMarker] = useState<{ x: number; y: number; time: number } | null>(null)

    // UI state
    const [activeEntity, setActiveEntity] = useState<RPGEntity | null>(null)
    const [activeModal, setActiveModal] = useState<"quest_carlos" | "atencion" | "cartelera" | "impresora" | "oraculo" | "perfil" | "nueva_cita" | null>(null)
    const [fullscreen, setFullscreen] = useState(false)

    // Attention / Quest Form for Carlos
    const [attentionSummary, setAttentionSummary] = useState("")
    const [attentionNeed, setAttentionNeed] = useState("16 Cámaras IP 4K + 4 Cerraduras Biométricas con App Móvil")
    const [attentionUrgency, setAttentionUrgency] = useState("ALTA")
    const [attentionBudget, setAttentionBudget] = useState("3800")
    const [isSavingAttention, setIsSavingAttention] = useState(false)
    const [questCompleted, setQuestCompleted] = useState(false)

    // New Client Appointment Form
    const [newClientName, setNewClientName] = useState("")
    const [newClientTime, setNewClientTime] = useState("11:30")
    const [newClientPhone, setNewClientPhone] = useState("")
    const [newClientPurpose, setNewClientPurpose] = useState("")

    // General Chat (Hablar en Voz Alta)
    const [chatMessages, setChatMessages] = useState<any[]>([
        { id: "1", from: "Luis G. [Coordinador]", text: "¡Por la Alianza de ATOMIC! El emisario Carlos Mendoza aguarda en la Sala de Visitas.", time: "09:00", channel: "General" },
        { id: "2", from: "Milorieta [Ventas]", text: "Tengo los pergaminos de propuesta listos para forjar el contrato.", time: "09:05", channel: "Gremio" },
        { id: "3", from: "Supervisor QC", text: "Registro de guardia matutina a las 6:00 AM completado con honor.", time: "09:10", channel: "General" }
    ])
    const [chatInput, setChatInput] = useState("")
    const [chatChannel, setChatChannel] = useState<"General" | "Gremio">("General")
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Cartelera / Edictos del Reino
    const [carteleraNotes, setCarteleraNotes] = useState<any[]>([
        { id: "n-1", title: "📜 Misión Principal: Cierre Carlos Mendoza", message: "Concretar la propuesta de CCTV 4K para el Condominio Central hoy antes de las 18:00.", from: "Luis G.", time: "Hace 20 min" },
        { id: "n-2", title: "🛡️ Edicto de Guardia 6:00 AM", message: "Supervisión calificada 10/10 en el plano cartesiano por ingreso anticipado.", from: "Supervisor QC", time: "Hace 1 hora" }
    ])
    const [newNoteTitle, setNewNoteTitle] = useState("")
    const [newNoteMessage, setNewNoteMessage] = useState("")

    // Oracle / Consejero IA
    const [oracleQuery, setOracleQuery] = useState("")
    const [oracleReplies, setOracleReplies] = useState<{ sender: "user" | "oracle"; text: string }[]>([
        { sender: "oracle", text: "¡Saludos, paladín de ATOMIC! Soy el Oráculo Arcano. Pregúntame sobre técnicas de persuasión, objeciones de clientes o cómo forjar tu camino al rango Maestro." }
    ])
    const [isOracleLoading, setIsOracleLoading] = useState(false)

    // Quotes for Printer Chest
    const [printerQuotes, setPrinterQuotes] = useState<any[]>(recentQuotes)

    // Profile Setup (Insistent)
    const [profileName, setProfileName] = useState(session?.user?.name || "Campeón")
    const [profilePhone, setProfilePhone] = useState("")
    const [profileCity, setProfileCity] = useState("Quito, Ecuador")
    const [profileSchedule, setProfileSchedule] = useState("08:00 - 17:00")
    const [profileHasPC, setProfileHasPC] = useState(true)

    const defaultWhatsApp = "593992223344"
    const getWAUrl = (phone?: string, text?: string) => {
        const clean = (phone || defaultWhatsApp).replace(/\D/g, "")
        return `https://wa.me/${clean}?text=${encodeURIComponent(text || "Saludos desde el Reino de ATOMIC.")}`
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // RPG WORLD ENTITIES (Warcraft Guild Fortress layout)
    // ─────────────────────────────────────────────────────────────────────────────
    const entities: RPGEntity[] = useMemo(() => [
        {
            id: "carlos_npc",
            name: "Carlos Mendoza",
            title: "Emisario VIP • Buscador de Seguridad",
            type: "quest_client",
            x: 220,
            y: 280,
            avatarType: "carlos",
            level: 70,
            questStatus: questCompleted ? "completed" : "available",
            dialogue: "¡Saludos, aventurero de ATOMIC! He viajado desde lejos para equipar mi fortaleza con un sistema defensivo de 16 cámaras 4K y cerraduras biométricas. ¿Deseas negociar los términos?",
            icon: "👑",
            color: "#F59E0B"
        },
        {
            id: "ceo_throne",
            name: "Trono del Gran Maestre (CEO)",
            title: "Ing. Santiago • Liderazgo Supremo",
            type: "throne",
            x: 480,
            y: 130,
            avatarType: "ceo",
            level: 100,
            dialogue: "Has entrado a la cámara presidencial. Toda decisión aquí forja el destino comercial y tecnológico de ATOMIC en la región.",
            icon: "🏛️",
            color: "#EF4444"
        },
        {
            id: "milorieta_npc",
            name: "Milorieta",
            title: "Archimaga de Ventas & Negociación",
            type: "npc",
            x: 360,
            y: 380,
            avatarType: "ventas",
            level: 85,
            dialogue: "¡Por el honor de la venta! Tengo el inventario de cámaras y cerraduras listo. Si Carlos necesita cotización, yo misma redacto el pergamino.",
            icon: "💼",
            color: "#10B981"
        },
        {
            id: "luis_npc",
            name: "Luis G.",
            title: "Comandante de Rutas & Logística",
            type: "npc",
            x: 620,
            y: 290,
            avatarType: "coordinador",
            level: 82,
            dialogue: "Nuestros mensajeros y técnicos están desplegados en Quito y Guayaquil. Cualquier orden será despachada con la velocidad del rayo.",
            icon: "🎯",
            color: "#0D9488"
        },
        {
            id: "supervisor_npc",
            name: "Supervisor de Calidad",
            title: "Alto Inquisidor • Guardia 6:00 AM",
            type: "npc",
            x: 640,
            y: 430,
            avatarType: "supervisor",
            level: 90,
            dialogue: "Mi reloj solar no perdona un segundo. Quien ingresa a las 6:00 AM recibe la bendición 10/10 en el plano de honor.",
            icon: "🛡️",
            color: "#3B82F6"
        },
        {
            id: "ian_npc",
            name: "Ian Editor",
            title: "Mago de Ilusiones 4K & Multimedia",
            type: "npc",
            x: 740,
            y: 230,
            avatarType: "edicion",
            level: 80,
            dialogue: "Estoy renderizando los hechizos visuales y spots publicitarios que deslumbrarán a los clientes en Meta y TikTok.",
            icon: "🎬",
            color: "#8B5CF6"
        },
        {
            id: "chest_printer",
            name: "Cofre de Pergaminos (Impresora)",
            title: "Archivo de Cotizaciones Formales",
            type: "chest",
            x: 480,
            y: 440,
            avatarType: "custom",
            level: 1,
            dialogue: "Un antiguo cofre rúnico donde reposan las propuestas comerciales unificadas listas para imprimir y firmar.",
            icon: "🖨️",
            color: "#06B6D4"
        },
        {
            id: "quest_board",
            name: "Tablón de Edictos (Cartelera)",
            title: "Noticias, Edictos & Misiones Generales",
            type: "board",
            x: 140,
            y: 420,
            avatarType: "custom",
            level: 1,
            dialogue: "El tablón central de madera donde el gremio publica anuncios, avisos urgentes y metas de la campaña.",
            icon: "📌",
            color: "#D97706"
        },
        {
            id: "oracle_sphere",
            name: "Oráculo de Sabiduría (Consejero IA)",
            title: "Esfera Arcana de Inteligencia",
            type: "oracle",
            x: 280,
            y: 160,
            avatarType: "custom",
            level: 99,
            dialogue: "Las energías místicas de ATOMIC responden tus dudas y te entregan planes de acción inmediatos para elevar tu poder.",
            icon: "🔮",
            color: "#14B8A6"
        }
    ], [questCompleted])

    // Load initial external state
    useEffect(() => {
        fetch("/api/office/notes").then(r => r.json()).then(d => { if (d.notes) setCarteleraNotes(d.notes) }).catch(() => {})
        if (recentQuotes.length === 0) {
            fetch("/api/quotes?limit=5").then(r => r.json()).then(d => { if (d.quotes) setPrinterQuotes(d.quotes.slice(0, 5)) }).catch(() => {})
        }
    }, [recentQuotes])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    // ─────────────────────────────────────────────────────────────────────────────
    // CANVAS GAME ENGINE (Isometric Warcraft Fortress)
    // ─────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        // Spawn atmospheric golden mana motes & torch embers
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -Math.random() * 0.8 - 0.2,
                alpha: Math.random() * 0.7 + 0.2,
                size: Math.random() * 2.5 + 1,
                color: Math.random() > 0.4 ? "#F59E0B" : "#10B981"
            })
        }

        const render = () => {
            // Smooth movement towards targetPos
            setPlayerPos(current => {
                if (!targetPos) return current
                const dx = targetPos.x - current.x
                const dy = targetPos.y - current.y
                const dist = Math.hypot(dx, dy)

                if (dist < 4) {
                    setTargetPos(null)
                    return current
                }

                if (dx < 0) setPlayerFacing("left")
                else if (dx > 0) setPlayerFacing("right")

                const speed = 3.5
                return {
                    x: current.x + (dx / dist) * speed,
                    y: current.y + (dy / dist) * speed
                }
            })

            // Clear Canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 1. BASE STONE / MARBLE FORTRESS FLOOR
            const tileSize = 48
            for (let x = 0; x < canvas.width; x += tileSize) {
                for (let y = 0; y < canvas.height; y += tileSize) {
                    const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0
                    ctx.fillStyle = isAlt ? "#0B1120" : "#090E1A"
                    ctx.fillRect(x, y, tileSize, tileSize)

                    // Subtle stone joint borders
                    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)"
                    ctx.lineWidth = 1
                    ctx.strokeRect(x, y, tileSize, tileSize)
                }
            }

            // 2. CENTRAL ROYAL CARPET (Warcraft Guild Hall Runner)
            const carpetGrad = ctx.createLinearGradient(0, 80, 0, canvas.height)
            carpetGrad.addColorStop(0, "#7F1D1D")
            carpetGrad.addColorStop(0.5, "#991B1B")
            carpetGrad.addColorStop(1, "#7F1D1D")

            ctx.fillStyle = carpetGrad
            ctx.fillRect(400, 80, 160, canvas.height - 120)

            // Carpet Gold Filigree Borders
            ctx.strokeStyle = "#F59E0B"
            ctx.lineWidth = 3
            ctx.strokeRect(402, 82, 156, canvas.height - 124)

            // Golden Runes on Carpet
            ctx.fillStyle = "rgba(245, 158, 11, 0.15)"
            for (let gy = 140; gy < canvas.height - 100; gy += 90) {
                ctx.beginPath()
                ctx.arc(480, gy, 28, 0, Math.PI * 2)
                ctx.fill()
                ctx.strokeStyle = "rgba(245, 158, 11, 0.3)"
                ctx.stroke()
            }

            // 3. ARCHITECTURAL WALLS & CHAMBERS (Physical room boundaries)
            const drawWall = (x: number, y: number, w: number, h: number, label: string, accentColor: string) => {
                // Wall Foundation
                ctx.fillStyle = "#030712"
                ctx.fillRect(x, y, w, h)

                // Outer Wall Border with Glowing Runes
                ctx.strokeStyle = accentColor
                ctx.lineWidth = 2.5
                ctx.strokeRect(x, y, w, h)

                // Room Header Name Banner
                ctx.fillStyle = "rgba(15, 23, 42, 0.95)"
                ctx.fillRect(x + 10, y - 10, w - 20, 20)
                ctx.strokeStyle = accentColor
                ctx.lineWidth = 1.5
                ctx.strokeRect(x + 10, y - 10, w - 20, 20)

                ctx.fillStyle = "#FFFFFF"
                ctx.font = "bold 9px 'Cinzel', 'Trajan Pro', serif, sans-serif"
                ctx.textAlign = "center"
                ctx.fillText(label.toUpperCase(), x + w / 2, y + 4)
            }

            // Draw Rooms / Zones
            // Top Left: Taberna de Visitas & Recepción VIP (Carlos)
            drawWall(60, 60, 310, 260, "🏰 Salón de Visitas & Emisarios VIP", "#F59E0B")

            // Top Center: Cámara del Trono (CEO)
            drawWall(410, 40, 140, 150, "👑 Trono Presidencial", "#EF4444")

            // Top Right: Estudio Arcano Multimedia & I+D
            drawWall(590, 60, 310, 210, "⚡ Estudio de Artífices & Edición 4K", "#8B5CF6")

            // Bottom Left: Tablón del Gremio & Bazar Comercial
            drawWall(60, 350, 310, 180, "📜 Edictos & Showroom de Ventas", "#10B981")

            // Bottom Right: Bastión de Coordinación & Guardia 6:00 AM
            drawWall(590, 300, 310, 230, "🛡️ Guardia Operativa 6:00 AM", "#3B82F6")

            // 4. CLICK RETICULE (Warcraft Golden Target Circle)
            if (clickMarker && Date.now() - clickMarker.time < 900) {
                const age = (Date.now() - clickMarker.time) / 900
                const radius = 10 + age * 18
                ctx.save()
                ctx.beginPath()
                ctx.arc(clickMarker.x, clickMarker.y, radius, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(245, 158, 11, ${1 - age})`
                ctx.lineWidth = 3
                ctx.stroke()

                // Crosshairs
                ctx.beginPath()
                ctx.moveTo(clickMarker.x - 6, clickMarker.y)
                ctx.lineTo(clickMarker.x + 6, clickMarker.y)
                ctx.moveTo(clickMarker.x, clickMarker.y - 6)
                ctx.lineTo(clickMarker.x, clickMarker.y + 6)
                ctx.stroke()
                ctx.restore()
            }

            // 5. ATMOSPHERIC PARTICLES (Embers & Mana)
            particles.forEach(p => {
                p.x += p.vx
                p.y += p.vy
                if (p.y < 0) {
                    p.y = canvas.height
                    p.x = Math.random() * canvas.width
                }
                ctx.fillStyle = p.color
                ctx.globalAlpha = p.alpha
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })
            ctx.globalAlpha = 1.0

            // 6. DRAW ALL ENTITIES & NPCS
            entities.forEach(ent => {
                ctx.save()

                // Highlight circle beneath entity
                const entGrad = ctx.createRadialGradient(ent.x, ent.y + 16, 4, ent.x, ent.y + 16, 24)
                entGrad.addColorStop(0, ent.color + "66")
                entGrad.addColorStop(1, "transparent")
                ctx.fillStyle = entGrad
                ctx.beginPath()
                ctx.arc(ent.x, ent.y + 16, 24, 0, Math.PI * 2)
                ctx.fill()

                // Special Warcraft Quest Marker for Carlos Mendoza!
                if (ent.id === "carlos_npc") {
                    const bounce = Math.sin(Date.now() / 250) * 4
                    ctx.fillStyle = ent.questStatus === "completed" ? "#10B981" : "#F59E0B"
                    ctx.font = "bold 26px sans-serif"
                    ctx.textAlign = "center"
                    ctx.shadowColor = "#F59E0B"
                    ctx.shadowBlur = 12
                    ctx.fillText(ent.questStatus === "completed" ? "✓" : "!", ent.x, ent.y - 32 + bounce)
                    ctx.shadowBlur = 0
                }

                // Entity Pedestal / Base
                ctx.fillStyle = "rgba(15, 23, 42, 0.9)"
                ctx.beginPath()
                ctx.ellipse(ent.x, ent.y + 16, 18, 8, 0, 0, Math.PI * 2)
                ctx.fill()
                ctx.strokeStyle = ent.color
                ctx.lineWidth = 1.5
                ctx.stroke()

                // Entity Name & Level Tag (Warcraft Unit Style)
                ctx.fillStyle = "rgba(0, 0, 0, 0.85)"
                ctx.fillRect(ent.x - 55, ent.y - 24, 110, 16)
                ctx.strokeStyle = ent.color
                ctx.lineWidth = 1
                ctx.strokeRect(ent.x - 55, ent.y - 24, 110, 16)

                ctx.fillStyle = "#F8FAFC"
                ctx.font = "bold 8.5px sans-serif"
                ctx.textAlign = "center"
                ctx.fillText(`[Lv.${ent.level}] ${ent.name.split(" ")[0]}`, ent.x, ent.y - 12)

                ctx.restore()
            })

            // 7. DRAW PLAYER CHARACTER (Your Champion)
            ctx.save()
            const pX = playerPos.x
            const pY = playerPos.y

            // Player Aura & Foot Shadow
            const auraGrad = ctx.createRadialGradient(pX, pY + 16, 4, pX, pY + 16, 26)
            auraGrad.addColorStop(0, "rgba(59, 130, 246, 0.6)")
            auraGrad.addColorStop(1, "transparent")
            ctx.fillStyle = auraGrad
            ctx.beginPath()
            ctx.arc(pX, pY + 16, 26, 0, Math.PI * 2)
            ctx.fill()

            // Player Nameplate (Golden Dragon Style Tag)
            ctx.fillStyle = "rgba(10, 15, 30, 0.9)"
            ctx.fillRect(pX - 60, pY - 32, 120, 18)
            ctx.strokeStyle = "#F59E0B"
            ctx.lineWidth = 1.5
            ctx.strokeRect(pX - 60, pY - 32, 120, 18)

            ctx.fillStyle = "#FBBF24"
            ctx.font = "bold 9px 'Cinzel', serif, sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(`[Lv.85 Campeón] ${profileName.split(" ")[0]} (Tú)`, pX, pY - 20)

            // Health Bar above player
            ctx.fillStyle = "#0F172A"
            ctx.fillRect(pX - 40, pY - 12, 80, 4)
            ctx.fillStyle = "#22C55E"
            ctx.fillRect(pX - 40, pY - 12, 80, 4)

            ctx.restore()

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [targetPos, clickMarker, entities, profileName])

    // Handle Canvas Click (Walk or Interact)
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width
        const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height

        setClickMarker({ x: clickX, y: clickY, time: Date.now() })
        setTargetPos({ x: clickX, y: clickY })

        // Check if clicked an entity
        const clicked = entities.find(ent => Math.hypot(ent.x - clickX, ent.y - clickY) < 36)
        if (clicked) {
            setActiveEntity(clicked)
            if (clicked.id === "carlos_npc") setActiveModal("quest_carlos")
            else if (clicked.id === "chest_printer") setActiveModal("impresora")
            else if (clicked.id === "quest_board") setActiveModal("cartelera")
            else if (clicked.id === "oracle_sphere") setActiveModal("oraculo")
            else if (clicked.id === "ceo_throne") setActiveEntity(clicked)
        }
    }

    // Handlers
    const handleAcceptCarlosQuest = () => {
        setActiveModal("atencion")
    }

    const handleCompleteAttention = async () => {
        setIsSavingAttention(true)
        try {
            await fetch("/api/supervision/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "ATTEND_CLIENT",
                    payload: {
                        appointmentId: "apt-carlos",
                        summary: attentionSummary || "Atención presencial en la fortaleza comercial.",
                        need: attentionNeed,
                        urgency: attentionUrgency,
                        budget: attentionBudget,
                        recontact: true
                    }
                })
            })
            setQuestCompleted(true)
            setActiveModal(null)
            alert("✨ ¡MISIÓN CUMPLIDA! Carlos Mendoza ha sido atendido con éxito. Propuesta comercial registrada en el ERP.")
        } catch (e) {
            console.error(e)
        } finally {
            setIsSavingAttention(false)
        }
    }

    const handleSendPublicChat = () => {
        if (!chatInput.trim()) return
        const now = new Date()
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
        setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            from: `${profileName.split(" ")[0]} [Tú]`,
            text: chatInput.trim(),
            time: timeStr,
            channel: chatChannel
        }])
        setChatInput("")
    }

    const handleAskOracle = async () => {
        const text = oracleQuery.trim()
        if (!text || isOracleLoading) return
        const msgs = [...oracleReplies, { sender: "user" as const, text }]
        setOracleReplies(msgs)
        setOracleQuery("")
        setIsOracleLoading(true)
        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, roleOverride: "COUNSELOR", botNameOverride: "Oráculo de ATOMIC" })
            })
            const data = await res.json()
            setOracleReplies([...msgs, { sender: "oracle", text: data.text || "Las runas revelan un camino de prosperidad comercial..." }])
        } catch {
            setOracleReplies([...msgs, { sender: "oracle", text: "La energía arcana se renueva. Pregúntame sobre tus metas y te mostraré el sendero." }])
        } finally {
            setIsOracleLoading(false)
        }
    }

    const handleDownloadProposal = async (q: any) => {
        try {
            const safeParseArray = (str: any) => { try { return Array.isArray(str) ? str : JSON.parse(str || "[]") } catch { return [] } }
            const parsedItems = safeParseArray(q.items)
            const rawSub = parsedItems.reduce((a: number, i: any) => a + i.quantity * i.unitPrice, 0)
            const tax = rawSub * 0.15
            await generateAtomicUnifiedProposalPDF({
                quoteNumber: q.quoteNumber, clientName: q.clientName || "Carlos Mendoza",
                clientPhone: q.clientPhone || "", clientCity: q.city || "Quito",
                clientEmail: q.clientEmail || "", quoteSubject: q.quoteSubject || "Propuesta CCTV 4K & Seguridad",
                advisorName: session?.user?.name?.toUpperCase() || "ATOMIC",
                items: parsedItems, subtotal: rawSub, taxAmount: tax, taxPercent: 15,
                discountAmount: 0, total: q.total || rawSub + tax,
                deliveryAddress: q.deliveryAddress || ""
            })
        } catch (e) { console.error(e) }
    }

    return (
        <div className={`relative ${fullscreen ? "fixed inset-0 z-[999] bg-[#020409]" : "w-full"} select-none font-sans text-slate-100`}>
            
            {/* ── WARCRAFT TOP HUD (Unit Frame & Realm Stats) ─────────── */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-[#0a0f1d] via-[#111827] to-[#0a0f1d] border-b-2 border-amber-500/50 shadow-2xl relative z-30">
                
                {/* Player Dragon Frame (Top Left) */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full ring-4 ring-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.5)] overflow-hidden bg-slate-900 border-2 border-amber-300">
                            <RealisticAvatar type="carlos" size={56} showBadge={false} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] border border-black shadow">
                            Lv.85
                        </span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black tracking-wider text-amber-300 font-serif">
                                {profileName}
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                                Paladín de Ventas
                            </span>
                        </div>

                        {/* Health & Mana Bars */}
                        <div className="space-y-1 mt-1 w-44">
                            <div className="h-2 rounded bg-slate-950 border border-slate-700 overflow-hidden relative">
                                <div className="h-full bg-gradient-to-r from-emerald-600 to-green-500 w-[100%]" />
                                <span className="absolute inset-0 flex items-center justify-center text-[7px] font-mono font-bold text-white drop-shadow">
                                    HP 100 / 100
                                </span>
                            </div>
                            <div className="h-2 rounded bg-slate-950 border border-slate-700 overflow-hidden relative">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 w-[100%]" />
                                <span className="absolute inset-0 flex items-center justify-center text-[7px] font-mono font-bold text-white drop-shadow">
                                    MANA 100 / 100
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Realm Title & Quest Status */}
                <div className="hidden md:flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <Shield className="text-amber-400 animate-pulse" size={16} />
                        <h1 className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-serif uppercase">
                            BASTIÓN COMERCIAL DE ATOMIC • RPG WORLD
                        </h1>
                        <Shield className="text-amber-400 animate-pulse" size={16} />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">
                        Misión Activa: {questCompleted ? "✓ Carlos Mendoza Atendido" : "⚠️ Emisario Carlos Mendoza en Espera de Atención"}
                    </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveModal("nueva_cita")}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black rounded-xl text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-amber-300 cursor-pointer"
                    >
                        <span>🛎️ Agendar Cita</span>
                    </button>

                    <button
                        onClick={() => setActiveModal("perfil")}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                        <UserCheck size={13} />
                        <span>Ficha (30m)</span>
                    </button>

                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                        title="Pantalla Completa"
                    >
                        <Zap size={14} className="text-amber-400" />
                    </button>
                </div>
            </div>

            {/* ── RPG WORLD CANVAS STAGE ─────────────────────────────── */}
            <div className="relative overflow-hidden bg-black" style={{ height: fullscreen ? "calc(100vh - 120px)" : "620px" }}>
                
                {/* HTML5 Game Canvas */}
                <canvas
                    ref={canvasRef}
                    width={960}
                    height={580}
                    onClick={handleCanvasClick}
                    className="w-full h-full object-cover cursor-crosshair"
                />

                {/* Overlaid Animated Avatars over Entities for 100% Realism */}
                {entities.map(ent => (
                    <div
                        key={ent.id}
                        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: `${(ent.x / 960) * 100}%`,
                            top: `${(ent.y / 580) * 100}%`
                        }}
                    >
                        <div className="relative cursor-pointer pointer-events-auto group" onClick={() => {
                            setActiveEntity(ent)
                            if (ent.id === "carlos_npc") setActiveModal("quest_carlos")
                            else if (ent.id === "chest_printer") setActiveModal("impresora")
                            else if (ent.id === "quest_board") setActiveModal("cartelera")
                            else if (ent.id === "oracle_sphere") setActiveModal("oraculo")
                        }}>
                            {/* Realistic Corporate Avatar Character */}
                            {ent.avatarType !== "custom" ? (
                                <RealisticAvatar type={ent.avatarType} size={46} status={ent.questStatus === "available" ? "waiting" : "online"} />
                            ) : (
                                <div className="w-11 h-11 rounded-2xl bg-slate-900/90 border-2 border-amber-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                                    {ent.icon}
                                </div>
                            )}

                            {/* Hover tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-950/95 border border-amber-500/60 text-[9px] font-mono text-white whitespace-nowrap shadow-xl z-30">
                                Click para interactuar con {ent.name}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Overlaid Player Avatar */}
                <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{
                        left: `${(playerPos.x / 960) * 100}%`,
                        top: `${(playerPos.y / 580) * 100}%`,
                        transform: `translate(-50%, -50%) scaleX(${playerFacing === "left" ? -1 : 1})`
                    }}
                >
                    <RealisticAvatar type="carlos" size={48} showBadge={false} />
                </div>

                {/* ── WARCRAFT BOTTOM-LEFT CHAT (Hablar en Voz Alta) ──── */}
                <div className="absolute bottom-3 left-4 w-88 max-w-[42vw] bg-slate-950/85 border border-amber-500/40 rounded-2xl p-2.5 backdrop-blur-md shadow-2xl z-20 flex flex-col h-44">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setChatChannel("General")}
                                className={`text-[9px] font-black font-mono px-2 py-0.5 rounded transition-all ${
                                    chatChannel === "General" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:text-white"
                                }`}
                            >
                                [1. Voz Alta]
                            </button>
                            <button
                                onClick={() => setChatChannel("Gremio")}
                                className={`text-[9px] font-black font-mono px-2 py-0.5 rounded transition-all ${
                                    chatChannel === "Gremio" ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                                }`}
                            >
                                [2. Gremio]
                            </button>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">Público para el bastión</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 text-[10px]">
                        {chatMessages.map(m => (
                            <div key={m.id} className="leading-snug">
                                <span className={`font-black mr-1 ${m.channel === "Gremio" ? "text-emerald-400" : "text-amber-400"}`}>
                                    [{m.channel}] {m.from}:
                                </span>
                                <span className="text-slate-200">{m.text}</span>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-1.5 pt-1.5 border-t border-slate-800">
                        <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendPublicChat()}
                            placeholder="Escribe al chat del reino..."
                            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-[10px] outline-none focus:border-amber-400"
                        />
                        <button
                            onClick={handleSendPublicChat}
                            className="p-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg"
                        >
                            <Send size={11} />
                        </button>
                    </div>
                </div>

                {/* ── WARCRAFT BOTTOM ACTION BAR (Hotbar) ─────────────── */}
                <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-slate-950/90 border-2 border-amber-500/50 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md z-20">
                    {[
                        { label: "[1] Atender Cita", icon: "🛎️", action: () => { setActiveModal("quest_carlos") } },
                        { label: "[2] Cofre PDF", icon: "🖨️", action: () => { setActiveModal("impresora") } },
                        { label: "[3] Edictos", icon: "📌", action: () => { setActiveModal("cartelera") } },
                        { label: "[4] Oráculo", icon: "🔮", action: () => { setActiveModal("oraculo") } },
                        { label: "[5] Ficha Perfil", icon: "📜", action: () => { setActiveModal("perfil") } }
                    ].map((btn, idx) => (
                        <button
                            key={idx}
                            onClick={btn.action}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 transition-all flex flex-col items-center gap-0.5 group cursor-pointer"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">{btn.icon}</span>
                            <span className="text-[7.5px] font-mono text-slate-400 group-hover:text-amber-300">{btn.label}</span>
                        </button>
                    ))}
                </div>

                {/* Movement hint */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-500/40 text-[9px] font-mono text-amber-300 pointer-events-none z-10 shadow-lg">
                    ⚔️ Click en el terreno para caminar • Click en Carlos o personajes para interactuar
                </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 1: QUEST DE CARLOS MENDOZA (WARCRAFT QUEST DIALOGUE)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "quest_carlos" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0e1322] border-2 border-amber-500 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600" />
                                
                                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <RealisticAvatar type="carlos" size={54} status="waiting" />
                                        <div>
                                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded uppercase">
                                                Misión Comercial • Grado VIP
                                            </span>
                                            <h3 className="text-base font-black text-amber-300 font-serif tracking-wide mt-0.5">
                                                Encomienda de Carlos Mendoza
                                            </h3>
                                            <p className="text-[10px] font-mono text-slate-400">Emisario de Edificio Central • Cita 11:00 AM</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Warcraft Lore / Quest Text */}
                                <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl space-y-2 text-xs text-slate-200 leading-relaxed font-serif">
                                    <p className="italic text-amber-200">
                                        "¡Saludos, honorable paladín de ATOMIC! He viajado para asegurar la fortaleza de mi comunidad. Requerimos un sistema de 16 cámaras 4K de alta precisión y 4 cerraduras biométricas con control por aplicación móvil."
                                    </p>
                                    <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                                        <span>Recompensa de Victoria: Venta Cerrada ($3,800)</span>
                                        <span className="text-emerald-400 font-bold">Comisión Garantizada</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={handleAcceptCarlosQuest}
                                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-yellow-200 cursor-pointer"
                                    >
                                        <Sword size={14} />
                                        <span>Aceptar Misión & Abrir Registro de Atención</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            const txt = `🔔 *ENCOMIENDA DE CARLOS MENDOZA*\nCliente VIP en espera de propuesta CCTV 4K.\nHora: 11:00 AM\nCelular: +593998765432`
                                            window.open(getWAUrl(defaultWhatsApp, txt), "_blank")
                                        }}
                                        className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Phone size={13} />
                                        <span>Enviar Cuervo / WhatsApp a Coordinación</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 2: FORMULARIO DE ESTADO DE ATENCIÓN (ATENDER CLIENTE)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "atencion" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <RealisticAvatar type="carlos" size={42} showBadge={false} />
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider font-serif">REGISTRAR ATENCIÓN COMERCIAL</h3>
                                            <p className="text-[10px] font-mono text-emerald-400">Cliente: Carlos Mendoza • Presupuesto: ${attentionBudget}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Resumen del Diálogo *</label>
                                        <textarea
                                            rows={2}
                                            value={attentionSummary}
                                            onChange={e => setAttentionSummary(e.target.value)}
                                            placeholder="Detalla lo acordado en la sesión de negociación..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs resize-none outline-none focus:border-emerald-400 font-sans"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Requerimiento Concreto</label>
                                        <input
                                            value={attentionNeed}
                                            onChange={e => setAttentionNeed(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs outline-none focus:border-emerald-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Nivel de Urgencia</label>
                                            <select
                                                value={attentionUrgency}
                                                onChange={e => setAttentionUrgency(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold outline-none"
                                            >
                                                <option value="ALTA">🔴 Alta (Cierre Inmediato)</option>
                                                <option value="MEDIA">🟡 Media (Esta Semana)</option>
                                                <option value="BAJA">🟢 Baja (Exploratorio)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Presupuesto ($)</label>
                                            <input
                                                value={attentionBudget}
                                                onChange={e => setAttentionBudget(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setActiveModal(null)}
                                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleCompleteAttention}
                                            disabled={isSavingAttention}
                                            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                                        >
                                            {isSavingAttention ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                            <span>Guardar en el ERP</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 3: COFRE DE PERGAMINOS (IMPRESORA DE COTIZACIONES)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "impresora" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl">🖨️</span>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider font-serif">COFRE DE PERGAMINOS FORMALES</h3>
                                            <p className="text-[10px] font-mono text-cyan-400">Emisión de Propuestas Unificadas en PDF</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                    {printerQuotes.map(q => (
                                        <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">{q.quoteNumber}</span>
                                                <span className="text-emerald-400 font-black">${q.total?.toFixed(2)}</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-white truncate">{q.clientName}</p>
                                            <button
                                                onClick={() => handleDownloadProposal(q)}
                                                className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow"
                                            >
                                                <Scroll size={12} />
                                                <span>Imprimir / Descargar Propuesta PDF</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 4: ORÁCULO DE SABIDURÍA (CONSEJERO IA)
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "oraculo" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b141d] border-2 border-teal-500/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl">🔮</span>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider font-serif">ORÁCULO ARCANO DE ATOMIC</h3>
                                            <p className="text-[10px] font-mono text-teal-400">Sabiduría Comercial & Planes de Crecimiento</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1 text-xs">
                                    {oracleReplies.map((m, idx) => (
                                        <div key={idx} className={`p-3 rounded-2xl ${m.sender === "user" ? "bg-teal-600/30 text-teal-100 ml-6" : "bg-slate-900 border border-slate-800 text-slate-200 mr-6"}`}>
                                            {m.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        value={oracleQuery}
                                        onChange={e => setOracleQuery(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleAskOracle()}
                                        placeholder="Consulta al Oráculo..."
                                        className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-400"
                                    />
                                    <button
                                        onClick={handleAskOracle}
                                        disabled={isOracleLoading}
                                        className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold"
                                    >
                                        <Send size={13} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 5: TABLÓN DE EDICTOS & CARTELERA
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "cartelera" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#111626] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl">📌</span>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider font-serif">TABLÓN DE EDICTOS DEL GREMIO</h3>
                                            <p className="text-[10px] font-mono text-amber-400">Cartelera General de Noticias & Metas</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                    {carteleraNotes.map(n => (
                                        <div key={n.id} className="p-3 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-1 relative group">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="font-bold text-amber-300 font-serif">{n.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 font-mono">{n.time}</span>
                                                    <button
                                                        onClick={() => setCarteleraNotes(prev => prev.filter(x => x.id !== n.id))}
                                                        className="text-slate-600 hover:text-rose-400 transition-colors"
                                                        title="Eliminar Edicto"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-200">{n.message}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                                    <input
                                        value={newNoteTitle}
                                        onChange={e => setNewNoteTitle(e.target.value)}
                                        placeholder="Título del nuevo edicto..."
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none focus:border-amber-400"
                                    />
                                    <textarea
                                        rows={2}
                                        value={newNoteMessage}
                                        onChange={e => setNewNoteMessage(e.target.value)}
                                        placeholder="Contenido del anuncio..."
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none focus:border-amber-400 resize-none"
                                    />
                                    <button
                                        onClick={() => {
                                            if (!newNoteMessage.trim()) return
                                            setCarteleraNotes(prev => [{
                                                id: Date.now().toString(),
                                                title: newNoteTitle || "Aviso Oficial",
                                                message: newNoteMessage,
                                                time: "Justo ahora"
                                            }, ...prev])
                                            setNewNoteTitle("")
                                            setNewNoteMessage("")
                                        }}
                                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs uppercase"
                                    >
                                        Fijar Edicto en el Tablón
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODAL 6: AGENDAR NUEVA CITA CON EMISARIO
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {activeModal === "nueva_cita" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" onClick={() => setActiveModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                            <div className="bg-[#0b101f] border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-serif">AGENDAR NUEVA CITA DE CLIENTE</h3>
                                    <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        value={newClientName}
                                        onChange={e => setNewClientName(e.target.value)}
                                        placeholder="Nombre del Cliente..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs outline-none focus:border-amber-400"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="time"
                                            value={newClientTime}
                                            onChange={e => setNewClientTime(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs font-mono outline-none"
                                        />
                                        <input
                                            value={newClientPhone}
                                            onChange={e => setNewClientPhone(e.target.value)}
                                            placeholder="Celular..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs font-mono outline-none"
                                        />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={newClientPurpose}
                                        onChange={e => setNewClientPurpose(e.target.value)}
                                        placeholder="Motivo de la cita..."
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs outline-none resize-none"
                                    />
                                    <button
                                        onClick={async () => {
                                            if (!newClientName.trim()) return
                                            await fetch("/api/supervision/appointments", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    action: "CREATE_APPOINTMENT",
                                                    payload: {
                                                        clientName: newClientName,
                                                        scheduledTime: newClientTime,
                                                        scheduledDate: new Date().toISOString().split("T")[0],
                                                        purpose: newClientPurpose,
                                                        phone: newClientPhone
                                                    }
                                                })
                                            })
                                            alert("🔔 Cita registrada exitosamente con aviso a todo el equipo.")
                                            setActiveModal(null)
                                        }}
                                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                                    >
                                        Registrar Cita & Enviar Campanazo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    )
}
