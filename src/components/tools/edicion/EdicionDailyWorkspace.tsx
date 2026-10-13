"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
    Clock, CheckCircle2, Circle, Sparkles, Folder, 
    UploadCloud, Plus, Copy, Check, Edit2, Share2, 
    Image as ImageIcon, Video, FileText, Users, Eye, 
    Layers, Trash2, X, ChevronRight, BarChart2, Calendar, 
    Send, Smartphone, Globe, AlertCircle, Save
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SUICIDE_SQUAD_CATEGORIES } from "@/lib/data/suicideSquadCategories"

interface AssignedEmployee {
    id: string
    nombre: string
    apellido?: string
    telefono: string
    categoriaSlug: string
    categoriaNombre: string
    createdAt: string
}

interface PromptItem {
    id: string
    type: "blanco" | "real" | "catalogo" | "combo" | "tabla"
    titulo: string
    texto: string
}

const DEFAULT_PROMPTS: PromptItem[] = [
    {
        id: "p-blanco",
        type: "blanco",
        titulo: "1. Foto en Blanco (Fondo Puro de Estudio)",
        texto: "Genera una imagen publicitaria de producto con fondo blanco puro de estudio usando el artículo que te proporciono, colocando un título comercial limpio y una descripción genérica acorde al artículo que ves."
    },
    {
        id: "p-real",
        type: "real",
        titulo: "2. Foto Real (Escenario Cotidiano de Alto Nivel)",
        texto: "Crea un anuncio publicitario de alto nivel generando un escenario hiperrealista de la vida real donde se utilizaría el producto, con iluminación ambiental y cinematográfica, junto a un título persuasivo y descripción acorde al artículo que te envío."
    },
    {
        id: "p-catalogo",
        type: "catalogo",
        titulo: "3. Foto de Catálogo (Estilo Editorial Revista)",
        texto: "Genera una foto de catálogo publicitaria con el artículo que te doy, haciendo énfasis en una composición estética premium que parezca la página de una revista de tecnología de alto impacto con acabados nítidos."
    },
    {
        id: "p-combo",
        type: "combo",
        titulo: "4. Foto de Combo Promocional (Dúo de Productos)",
        texto: "Genera una foto de un combo promocional que integre el artículo que te envío junto a un producto complementario de la misma categoría. Coloca un titular que mencione 'Promoción en Combo de [Artículo 1] y [Artículo 2]', junto a una descripción genérica atractiva según los artículos."
    },
    {
        id: "p-tabla",
        type: "tabla",
        titulo: "5. Foto con Tabla de Beneficios y Pros",
        texto: "Genera una foto promocional con marcado tono comercial para el artículo que te envío, con un título y descripción genéricos en base al producto, generando en una de las esquinas del anuncio una tabla comparativa gráfica con los beneficios, ventajas y pros de comprar el artículo mencionado."
    }
]

export default function EdicionDailyWorkspace() {
    const today = new Date().toISOString().split("T")[0]

    // Tabs principales de Edición
    const [edicionTab, setEdicionTab] = useState<"plan" | "asignaciones" | "banco" | "redes">("plan")

    // Timbrado
    const [clockInTime, setClockInTime] = useState<string | null>(null)
    const [clockOutTime, setClockOutTime] = useState<string | null>(null)

    // Tareas semanales de Edición
    const [juntaSemanal, setJuntaSemanal] = useState(false)
    const [propuestaViernes, setPropuestaViernes] = useState(false)
    const [postsCount, setPostsCount] = useState(5)
    const [phonesCount, setPhonesCount] = useState(10)

    // Empleados y Asignaciones
    const [employees, setEmployees] = useState<AssignedEmployee[]>([
        { id: "emp-1", nombre: "Kevin", apellido: "Barrera", telefono: "0963226319", categoriaSlug: "camaras-de-seguridad", categoriaNombre: "Cámaras de Seguridad & CCTV", createdAt: today },
        { id: "emp-2", nombre: "Nicolás", apellido: "Carrera", telefono: "0999047979", categoriaSlug: "alarmas-y-seguridad", categoriaNombre: "Cercos Eléctricos & Alarmas", createdAt: today },
        { id: "emp-3", nombre: "Luisa", apellido: "Sabando", telefono: "0984252528", categoriaSlug: "cerraduras-inteligentes", categoriaNombre: "Cerraduras Inteligentes & Digitales", createdAt: today }
    ])
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
    const [newEmpNombre, setNewEmpNombre] = useState("")
    const [newEmpApellido, setNewEmpApellido] = useState("")
    const [newEmpTelefono, setNewEmpTelefono] = useState("")
    const [newEmpCategoria, setNewEmpCategoria] = useState(SUICIDE_SQUAD_CATEGORIES[0]?.slug || "")

    // Prompts
    const [prompts, setPrompts] = useState<PromptItem[]>(DEFAULT_PROMPTS)
    const [editingPromptId, setEditingPromptId] = useState<string | null>(null)
    const [editingPromptText, setEditingPromptText] = useState("")
    const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

    // Banco de Anuncios
    const [selectedProjectFolder, setSelectedProjectFolder] = useState<"NONE" | "SOFT" | "ATOMIC">("NONE")
    const [atomicSubView, setAtomicSubView] = useState<"MENU" | "GENERAL" | "CATEGORIAS">("MENU")
    const [softFiles, setSoftFiles] = useState<{ id: string; name: string; type: "image" | "video" | "gif"; date: string }[]>([
        { id: "sf-1", name: "hero_softres_banner.png", type: "image", date: today },
        { id: "sf-2", name: "demo_deploy_terminal.mp4", type: "video", date: today },
        { id: "sf-3", name: "ui_interaction_pulse.gif", type: "gif", date: today }
    ])
    const [atomicGeneralImages, setAtomicGeneralImages] = useState<string[]>([
        "/images/products/camara_imou_360.jpg",
        "/images/products/cercos_jfl.jpg",
        "/images/products/camara_imou_ranger_3mp.jpg",
        "/images/products/camara-sk-4mp.jpg"
    ])

    // Subida estricta por categoría (exactamente 5 imágenes y 1 PDF)
    const [uploadingCategoryAdvisor, setUploadingCategoryAdvisor] = useState<{ advisorName: string; categoryName: string } | null>(null)
    const [advisorImages, setAdvisorImages] = useState<string[]>([])
    const [advisorPdf, setAdvisorPdf] = useState<string | null>(null)
    const [advisorUploadProgress, setAdvisorUploadProgress] = useState<Record<string, number>>({})

    // Redes Sociales
    const [atomicSocialPost, setAtomicSocialPost] = useState({ file: null as any, fb: true, ig: true, tt: true })
    const [softSocialPost, setSoftSocialPost] = useState({ file: null as any, fb: true, ig: false, tt: true })
    const [socialSendSuccess, setSocialSendSuccess] = useState<string | null>(null)

    // Cargar localStorage
    useEffect(() => {
        try {
            const savedEmp = localStorage.getItem("atomic_edicion_employees")
            if (savedEmp) setEmployees(JSON.parse(savedEmp))

            const savedPrompts = localStorage.getItem("atomic_edicion_prompts")
            if (savedPrompts) setPrompts(JSON.parse(savedPrompts))

            const savedClocks = localStorage.getItem(`atomic_edicion_clocks_${today}`)
            if (savedClocks) {
                const p = JSON.parse(savedClocks)
                if (p.in) setClockInTime(p.in)
                if (p.out) setClockOutTime(p.out)
            }
        } catch (e) {
            console.error("Error loading edicion storage", e)
        }
    }, [today])

    const handleClock = (type: "in" | "out") => {
        const timeNow = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
        if (type === "in") setClockInTime(timeNow)
        else setClockOutTime(timeNow)

        localStorage.setItem(`atomic_edicion_clocks_${today}`, JSON.stringify({
            in: type === "in" ? timeNow : clockInTime,
            out: type === "out" ? timeNow : clockOutTime
        }))
    }

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newEmpNombre.trim()) return

        const cat = SUICIDE_SQUAD_CATEGORIES.find(c => c.slug === newEmpCategoria) || SUICIDE_SQUAD_CATEGORIES[0]
        const newEmp: AssignedEmployee = {
            id: `emp-${Date.now()}`,
            nombre: newEmpNombre.trim(),
            apellido: newEmpApellido.trim() || undefined,
            telefono: newEmpTelefono.trim() || "0990000000",
            categoriaSlug: cat.slug,
            categoriaNombre: cat.name,
            createdAt: today
        }

        const updated = [...employees, newEmp]
        setEmployees(updated)
        localStorage.setItem("atomic_edicion_employees", JSON.stringify(updated))

        setNewEmpNombre("")
        setNewEmpApellido("")
        setNewEmpTelefono("")
        setShowAddEmployeeModal(false)
    }

    const handleDeleteEmployee = (id: string) => {
        const updated = employees.filter(e => e.id !== id)
        setEmployees(updated)
        localStorage.setItem("atomic_edicion_employees", JSON.stringify(updated))
    }

    const copyPrompt = (id: string, text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedPromptId(id)
        setTimeout(() => setCopiedPromptId(null), 2000)
    }

    const saveEditedPrompt = () => {
        if (!editingPromptId) return
        const updated = prompts.map(p => p.id === editingPromptId ? { ...p, texto: editingPromptText } : p)
        setPrompts(updated)
        localStorage.setItem("atomic_edicion_prompts", JSON.stringify(updated))
        setEditingPromptId(null)
    }

    // Manejo de subida para Soft
    const handleAddSoftFile = () => {
        const fileNames = ["landing_mockup_soft.png", "video_pitch_multitenant.mp4", "banner_soft_oferta.gif"]
        const randomName = fileNames[Math.floor(Math.random() * fileNames.length)]
        const type = randomName.endsWith(".png") ? "image" : randomName.endsWith(".mp4") ? "video" : "gif"
        const next = [...softFiles, { id: `sf-${Date.now()}`, name: randomName, type, date: today }]
        setSoftFiles(next)
    }

    // Guardar paquete de 5 imágenes y 1 PDF
    const handleSaveAdvisorPackage = () => {
        if (!uploadingCategoryAdvisor) return
        const key = `${uploadingCategoryAdvisor.advisorName}_${uploadingCategoryAdvisor.categoryName}`
        // Progreso = (imágenes / 5 * 80) + (pdf ? 20 : 0)
        const prog = Math.round((advisorImages.length / 5) * 80 + (advisorPdf ? 20 : 0))
        setAdvisorUploadProgress({ ...advisorUploadProgress, [key]: prog })
        setUploadingCategoryAdvisor(null)
        setAdvisorImages([])
        setAdvisorPdf(null)
    }

    // Envío a redes sociales
    const handleSendSocial = (type: "ATOMIC" | "SOFT") => {
        setSocialSendSuccess(type)
        setTimeout(() => setSocialSendSuccess(null), 3000)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* ── HEADER DE EDICIÓN: STEFY / MEDIA ── */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-pink-950/40 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
                <div className="space-y-1.5 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest">
                            Edición & Multimedia • Stefy (stefy@atomicedicion.com)
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
                        <span>Diseño Publicitario, Banco de Anuncios & Prompts IA</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                        Distribución en 5 formatos clave, asignaciones de vendedores por categoría y control multimedia.
                    </p>
                </div>

                {/* Timbrado */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleClock("in")}
                        disabled={Boolean(clockInTime)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                            clockInTime 
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                        }`}
                    >
                        <Clock size={16} />
                        <span>{clockInTime ? `Entrada: ${clockInTime}` : "Timbrar Entrada"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleClock("out")}
                        disabled={Boolean(clockOutTime)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                            clockOutTime 
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" 
                                : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:scale-105 active:scale-95 cursor-pointer"
                        }`}
                    >
                        <Clock size={16} />
                        <span>{clockOutTime ? `Salida: ${clockOutTime}` : "Timbrar Salida"}</span>
                    </button>
                </div>
            </div>

            {/* ── NAVEGACIÓN POR SUB-PESTAÑAS DE EDICIÓN ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                    { id: "plan", label: "📋 Plan & Asistencia", icon: "🗓️" },
                    { id: "asignaciones", label: "👥 Equipo, Pastel Neón & Prompts", icon: "🎨" },
                    { id: "banco", label: "📁 Banco de Anuncios (SOFT & ATOMIC)", icon: "🗂️" },
                    { id: "redes", label: "📲 Redes Sociales (Meta & TikTok)", icon: "🚀" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setEdicionTab(tab.id as any)}
                        className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                            edicionTab === tab.id
                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-102"
                                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════════════════
                PESTAÑA 1: PLAN DIARIO, PUNTUALIDAD & ASISTENCIA
            ═══════════════════════════════════════════════════════════ */}
            {edicionTab === "plan" && (
                <div className="space-y-5">
                    
                    {/* Tareas Semanales Fijas de Edición */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                            onClick={() => setJuntaSemanal(!juntaSemanal)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                juntaSemanal ? "bg-purple-950/30 border-purple-500/50" : "bg-slate-900 border-slate-800 hover:border-purple-500/30"
                            }`}
                        >
                            <div className={`p-2 rounded-xl ${juntaSemanal ? "bg-purple-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white">Junta Semanal de Decisiones de Diseño</h4>
                                <p className="text-[10px] text-slate-400 font-mono">Evaluación de nuevos artes, estilos y feedback de ventas</p>
                            </div>
                        </div>

                        <div 
                            onClick={() => setPropuestaViernes(!propuestaViernes)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                propuestaViernes ? "bg-purple-950/30 border-purple-500/50" : "bg-slate-900 border-slate-800 hover:border-purple-500/30"
                            }`}
                        >
                            <div className={`p-2 rounded-xl ${propuestaViernes ? "bg-purple-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white">Propuestas de Mejora de los Viernes</h4>
                                <p className="text-[10px] text-slate-400 font-mono">Entrega semanal de conceptos visuales disruptivos</p>
                            </div>
                        </div>
                    </div>

                    {/* Módulo pequeño de subir publicaciones y teléfonos */}
                    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers size={14} className="text-purple-400" />
                            <span>Módulo Operativo de Entrega Diaria</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Publicaciones Listas</span>
                                    <span className="text-2xl font-black text-purple-400">{postsCount}</span>
                                    <span className="text-[9px] text-slate-500 font-mono block">Artes entregados a ventas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setPostsCount(Math.max(0, postsCount - 1))}
                                        className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700"
                                    >-</button>
                                    <button 
                                        type="button" 
                                        onClick={() => setPostsCount(postsCount + 1)}
                                        className="w-8 h-8 rounded-lg bg-purple-500 text-black font-bold hover:bg-purple-400"
                                    >+</button>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Números de Teléfono Verificados</span>
                                    <span className="text-2xl font-black text-cyan-400">{phonesCount}</span>
                                    <span className="text-[9px] text-slate-500 font-mono block">Para prospección comercial</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setPhonesCount(Math.max(0, phonesCount - 1))}
                                        className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700"
                                    >-</button>
                                    <button 
                                        type="button" 
                                        onClick={() => setPhonesCount(phonesCount + 1)}
                                        className="w-8 h-8 rounded-lg bg-cyan-400 text-black font-bold hover:bg-cyan-300"
                                    >+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                PESTAÑA 2: EQUIPO, PASTEL NEÓN & PROMPTS DE IA
            ═══════════════════════════════════════════════════════════ */}
            {edicionTab === "asignaciones" && (
                <div className="space-y-6">
                    
                    {/* ── 1. TABLA / CUADRÍCULA DE USUARIOS Y EMPLEADOS ── */}
                    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h3 className="text-sm font-black text-white flex items-center gap-2">
                                    <Users size={16} className="text-purple-400" />
                                    <span>Tabla de Usuarios y Empleados (Asignaciones Suicide Squad)</span>
                                </h3>
                                <p className="text-[10px] text-slate-400 font-mono">
                                    Asigna a cada colaborador su categoría correspondiente para la entrega de anuncios.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddEmployeeModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-xs font-mono uppercase rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                <Plus size={15} />
                                <span>Agregar Empleado</span>
                            </button>
                        </div>

                        {/* Tarjetas de Empleados */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {employees.map(emp => (
                                <div key={emp.id} className="p-4 rounded-2xl bg-black/40 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2 relative group">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-xs font-black text-white">{emp.nombre} {emp.apellido || ""}</h4>
                                            <p className="text-[10px] text-cyan-400 font-mono">{emp.telefono}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteEmployee(emp.id)}
                                            className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>

                                    <div className="pt-1 border-t border-white/5">
                                        <span className="text-[8px] font-mono uppercase text-slate-500 block">Categoría asignada:</span>
                                        <span className="text-[10px] font-mono font-bold text-purple-300 block truncate">
                                            {emp.categoriaNombre}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── 2. GRÁFICO PASTEL NEÓN PERMANENTE (5 PARTES IGUALES) ── */}
                    <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-5">
                        <div className="text-center space-y-1">
                            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
                                Estándar Creativo Oficial ATOMIC 2026
                            </span>
                            <h3 className="text-base font-black text-white">
                                Distribución de Anuncios (5 Formatos Equitativos)
                            </h3>
                            <p className="text-xs text-slate-400 font-mono">
                                Cada producto debe contar con estas 5 tipologías gráficas en rotación continua (20% cada una).
                            </p>
                        </div>

                        {/* Rueda / Pastel Neón en SVG Puro */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2">
                            <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {/* 5 segmentos de 20% (72 grados cada uno). Perímetro círculo radio 40 = 251.32. Dash = 50.26 */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f8fafc" strokeWidth="14" strokeDasharray="50.26 201.06" strokeDashoffset="0" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="14" strokeDasharray="50.26 201.06" strokeDashoffset="-50.26" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="14" strokeDasharray="50.26 201.06" strokeDashoffset="-100.52" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="14" strokeDasharray="50.26 201.06" strokeDashoffset="-150.78" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="14" strokeDasharray="50.26 201.06" strokeDashoffset="-201.04" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                </svg>
                                
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    <span className="text-xl font-black text-white">5</span>
                                    <span className="text-[8px] font-mono uppercase text-purple-300 font-bold">FORMATOS</span>
                                </div>
                            </div>

                            {/* Leyenda de los 5 colores */}
                            <div className="grid grid-cols-1 gap-2.5 text-xs font-mono w-full max-w-sm">
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-slate-800">
                                    <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                                    <span className="text-white font-bold flex-1">1. Foto en Blanco</span>
                                    <span className="text-slate-500 font-bold">20%</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-slate-800">
                                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                                    <span className="text-white font-bold flex-1">2. Foto Real</span>
                                    <span className="text-slate-500 font-bold">20%</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-slate-800">
                                    <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                                    <span className="text-white font-bold flex-1">3. Foto de Catálogo</span>
                                    <span className="text-slate-500 font-bold">20%</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-slate-800">
                                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                                    <span className="text-white font-bold flex-1">4. Foto de Algún Combo</span>
                                    <span className="text-slate-500 font-bold">20%</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-slate-800">
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                                    <span className="text-white font-bold flex-1">5. Foto de Tabla con Beneficios</span>
                                    <span className="text-slate-500 font-bold">20%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 3. INSTRUCTIVO O PROMPTS PARA GENERAR IMÁGENES CON IA ── */}
                    <div className="space-y-4">
                        <div className="px-1">
                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-400" />
                                <span>Instructivo o Prompts para Generar Imágenes con IA</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 font-mono">
                                Haz clic en Copiar para usar directamente en Midjourney, ChatGPT o Flux, o en Editar para personalizar.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {prompts.map(p => {
                                const isEditing = editingPromptId === p.id
                                const isCopied = copiedPromptId === p.id

                                return (
                                    <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-purple-300 font-mono">{p.titulo}</h4>
                                            
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (isEditing) {
                                                            saveEditedPrompt()
                                                        } else {
                                                            setEditingPromptId(p.id)
                                                            setEditingPromptText(p.texto)
                                                        }
                                                    }}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                                                >
                                                    {isEditing ? <Save size={12} className="text-emerald-400" /> : <Edit2 size={12} />}
                                                    <span>{isEditing ? "Guardar" : "Editar"}</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => copyPrompt(p.id, p.texto)}
                                                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                                                >
                                                    {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                    <span>{isCopied ? "¡Copiado!" : "Copiar"}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <textarea
                                                value={editingPromptText}
                                                onChange={e => setEditingPromptText(e.target.value)}
                                                rows={3}
                                                className="w-full bg-slate-950 border border-purple-500/50 rounded-xl p-3 text-xs font-mono text-white outline-none resize-none"
                                            />
                                        ) : (
                                            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                                                "{p.texto}"
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                PESTAÑA 3: BANCO DE ANUNCIOS (CARPETAS SOFT & ATOMIC)
            ═══════════════════════════════════════════════════════════ */}
            {edicionTab === "banco" && (
                <div className="space-y-6">
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-white">📁 PROYECTOS</h3>
                            <p className="text-xs text-slate-400 font-mono">Selecciona la carpeta raíz para gestionar los archivos</p>
                        </div>

                        {selectedProjectFolder !== "NONE" && (
                            <button
                                type="button"
                                onClick={() => { setSelectedProjectFolder("NONE"); setAtomicSubView("MENU") }}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
                            >
                                ← Volver a Proyectos
                            </button>
                        )}
                    </div>

                    {/* VISTA RAÍZ: LAS DOS CARPETAS (SOFT & ATOMIC) */}
                    {selectedProjectFolder === "NONE" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            
                            {/* Carpeta SOFT */}
                            <div
                                onClick={() => setSelectedProjectFolder("SOFT")}
                                className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer group space-y-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Folder size={26} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-white">SOFT</h4>
                                        <span className="text-[10px] font-mono text-indigo-300">Software & Infraestructura</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">
                                    Repositorio multimedia de recursos, banners y clips para aplicaciones y servicios de SOFT.
                                </p>
                                <div className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    <span>Abrir carpeta</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>

                            {/* Carpeta ATOMIC */}
                            <div
                                onClick={() => setSelectedProjectFolder("ATOMIC")}
                                className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer group space-y-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                        <Folder size={26} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-white">ATOMIC</h4>
                                        <span className="text-[10px] font-mono text-cyan-300">Ecosistema & Suicide Squad</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">
                                    Banco general de imágenes y asignaciones por categoría para la fuerza comercial.
                                </p>
                                <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    <span>Abrir carpeta</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ── INTERIOR DE CARPETA SOFT ── */}
                    {selectedProjectFolder === "SOFT" && (
                        <div className="space-y-5">
                            {/* 3 Cuadros Estadísticos */}
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Total Archivos</span>
                                    <span className="text-2xl font-black text-white">{softFiles.length}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Imágenes / GIF</span>
                                    <span className="text-2xl font-black text-cyan-400">
                                        {softFiles.filter(f => f.type === "image" || f.type === "gif").length}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Videos</span>
                                    <span className="text-2xl font-black text-purple-400">
                                        {softFiles.filter(f => f.type === "video").length}
                                    </span>
                                </div>
                            </div>

                            {/* Botón para subir archivos */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/30">
                                <span className="text-xs font-mono text-slate-300">Acepta imágenes (.png, .jpg), videos (.mp4) y gifs</span>
                                <button
                                    type="button"
                                    onClick={handleAddSoftFile}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                                >
                                    <UploadCloud size={15} />
                                    <span>Subir Archivo a SOFT</span>
                                </button>
                            </div>

                            {/* Lista de Archivos */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {softFiles.map(f => (
                                    <div key={f.id} className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 flex items-center gap-3">
                                        {f.type === "video" ? <Video size={18} className="text-purple-400" /> : <ImageIcon size={18} className="text-cyan-400" />}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-mono text-white truncate font-bold">{f.name}</p>
                                            <span className="text-[9px] font-mono text-slate-500">{f.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── INTERIOR DE CARPETA ATOMIC ── */}
                    {selectedProjectFolder === "ATOMIC" && (
                        <div className="space-y-6">
                            
                            {/* Las Dos Tarjetas de Entrada */}
                            {atomicSubView === "MENU" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div
                                        onClick={() => setAtomicSubView("GENERAL")}
                                        className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer space-y-3"
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                            <ImageIcon size={22} />
                                        </div>
                                        <h4 className="text-base font-black text-white">1. Banco General de Imágenes</h4>
                                        <p className="text-xs text-slate-400 font-mono">
                                            Galería completa con todas las imágenes trabajadas dentro de ATOMIC.
                                        </p>
                                    </div>

                                    <div
                                        onClick={() => setAtomicSubView("CATEGORIAS")}
                                        className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer space-y-3"
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                            <Layers size={22} />
                                        </div>
                                        <h4 className="text-base font-black text-white">2. Asignaciones por Categoría</h4>
                                        <p className="text-xs text-slate-400 font-mono">
                                            Matriz horizontal de Suicide Squad, asignación de asesores y subida de 5 fotos + 1 PDF.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* SUB-VISTA 1: BANCO GENERAL DE IMÁGENES */}
                            {atomicSubView === "GENERAL" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black text-white">Galería General de Imágenes ATOMIC</h4>
                                        <button
                                            type="button"
                                            onClick={() => setAtomicSubView("MENU")}
                                            className="text-xs font-mono text-slate-400 hover:text-white"
                                        >
                                            ← Volver
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {atomicGeneralImages.map((src, i) => (
                                            <div key={i} className="aspect-square rounded-2xl bg-black/50 border border-slate-800 overflow-hidden relative group">
                                                <img src={src} alt="Atomic Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-white">
                                                    Foto #{i + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SUB-VISTA 2: ASIGNACIONES POR CATEGORÍA & SUBIDA ESTRICTA */}
                            {atomicSubView === "CATEGORIAS" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-black text-white">Matriz de Categorías & Asignaciones Suicide Squad</h4>
                                            <p className="text-[10px] text-slate-400 font-mono">Vista horizontal con las categorías y asesores designados</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAtomicSubView("MENU")}
                                            className="text-xs font-mono text-slate-400 hover:text-white"
                                        >
                                            ← Volver
                                        </button>
                                    </div>

                                    {/* MATRIZ HORIZONTAL DE TODAS LAS CATEGORÍAS */}
                                    <div className="overflow-x-auto pb-3 scrollbar-none">
                                        <div className="flex items-start gap-3 min-w-[900px]">
                                            {SUICIDE_SQUAD_CATEGORIES.map(cat => {
                                                const assigned = employees.filter(e => e.categoriaSlug === cat.slug)

                                                return (
                                                    <div key={cat.slug} className="w-56 shrink-0 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                                                        <span className="text-[9px] font-mono text-purple-400 font-bold block truncate uppercase">
                                                            {cat.squadName}
                                                        </span>
                                                        <h5 className="text-xs font-black text-white line-clamp-1">{cat.name}</h5>

                                                        <div className="pt-2 border-t border-white/5 space-y-1">
                                                            <span className="text-[8px] font-mono text-slate-500 uppercase block">Asesor asignado:</span>
                                                            {assigned.length > 0 ? (
                                                                assigned.map(a => (
                                                                    <div key={a.id} className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded-md truncate">
                                                                        👤 {a.nombre}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span className="text-[9px] font-mono text-slate-600 italic block">Sin asesor</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* TARJETAS DE CADA ASESOR CON BOTÓN "SUBIR ANUNCIOS DE ESTA CATEGORÍA" */}
                                    <div className="space-y-3 pt-2">
                                        <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                                            Subida de Anuncios por Asesor (Exactamente 5 Imágenes y 1 PDF):
                                        </span>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {employees.map(emp => {
                                                const key = `${emp.nombre}_${emp.categoriaNombre}`
                                                const progress = advisorUploadProgress[key] || 0

                                                return (
                                                    <div key={emp.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                                                        <div>
                                                            <h5 className="text-xs font-black text-white">{emp.nombre} {emp.apellido || ""}</h5>
                                                            <p className="text-[10px] text-purple-300 font-mono truncate">{emp.categoriaNombre}</p>
                                                        </div>

                                                        {/* Barra de Progreso */}
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                                                                <span>Progreso Subida:</span>
                                                                <span className="font-bold text-cyan-400">{progress}%</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                                                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => setUploadingCategoryAdvisor({ advisorName: emp.nombre, categoryName: emp.categoriaNombre })}
                                                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                                                        >
                                                            Subir Anuncios de esta Categoría
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                PESTAÑA 4: REDES SOCIALES (ATOMIC & SOFT)
            ═══════════════════════════════════════════════════════════ */}
            {edicionTab === "redes" && (
                <div className="space-y-6">
                    <div className="text-center space-y-1">
                        <h3 className="text-base font-black text-white">📲 Difusión Unificada en Redes Sociales</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Carga el arte o video, selecciona los canales simultáneos y programa el lanzamiento.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* 1. Apartado para ATOMIC */}
                        <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 shadow-xl">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                                <h4 className="text-sm font-black text-white flex items-center gap-2">
                                    <Globe size={16} className="text-cyan-400" />
                                    <span>Campaña Oficial ATOMIC</span>
                                </h4>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300">
                                    Ecosistema ERP
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/40 border border-dashed border-slate-700 text-center space-y-2">
                                <UploadCloud size={24} className="mx-auto text-slate-400" />
                                <span className="text-xs font-mono text-slate-300 block">Subir Imagen o Video de ATOMIC</span>
                                <input type="file" className="text-[10px] font-mono text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Canales simultáneos:</span>
                                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={atomicSocialPost.fb} onChange={e => setAtomicSocialPost({ ...atomicSocialPost, fb: e.target.checked })} />
                                        <span>Facebook</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={atomicSocialPost.ig} onChange={e => setAtomicSocialPost({ ...atomicSocialPost, ig: e.target.checked })} />
                                        <span>Instagram</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={atomicSocialPost.tt} onChange={e => setAtomicSocialPost({ ...atomicSocialPost, tt: e.target.checked })} />
                                        <span>TikTok</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSendSocial("ATOMIC")}
                                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                {socialSendSuccess === "ATOMIC" ? "✅ Publicado en ATOMIC" : "Enviar a Redes ATOMIC"}
                            </button>
                        </div>

                        {/* 2. Apartado para SOFT */}
                        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                                <h4 className="text-sm font-black text-white flex items-center gap-2">
                                    <Globe size={16} className="text-indigo-400" />
                                    <span>Campaña Oficial SOFT</span>
                                </h4>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300">
                                    Plataforma Tech
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/40 border border-dashed border-slate-700 text-center space-y-2">
                                <UploadCloud size={24} className="mx-auto text-slate-400" />
                                <span className="text-xs font-mono text-slate-300 block">Subir Imagen o Video de SOFT</span>
                                <input type="file" className="text-[10px] font-mono text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Canales simultáneos:</span>
                                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={softSocialPost.fb} onChange={e => setSoftSocialPost({ ...softSocialPost, fb: e.target.checked })} />
                                        <span>Facebook</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={softSocialPost.ig} onChange={e => setSoftSocialPost({ ...softSocialPost, ig: e.target.checked })} />
                                        <span>Instagram</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={softSocialPost.tt} onChange={e => setSoftSocialPost({ ...softSocialPost, tt: e.target.checked })} />
                                        <span>TikTok</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSendSocial("SOFT")}
                                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                {socialSendSuccess === "SOFT" ? "✅ Publicado en SOFT" : "Enviar a Redes SOFT"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ── MODAL: AGREGAR EMPLEADO / ASIGNACIÓN ── */}
            <AnimatePresence>
                {showAddEmployeeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h3 className="text-base font-black text-white">Agregar Empleado & Asignación</h3>
                                <button onClick={() => setShowAddEmployeeModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs font-mono">
                                <div className="space-y-1">
                                    <label className="text-slate-300 font-bold block">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEmpNombre}
                                        onChange={e => setNewEmpNombre(e.target.value)}
                                        placeholder="Ej: Carlos"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-slate-300 font-bold block">Apellido (Opcional)</label>
                                    <input
                                        type="text"
                                        value={newEmpApellido}
                                        onChange={e => setNewEmpApellido(e.target.value)}
                                        placeholder="Ej: Andrade"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-slate-300 font-bold block">Número de Teléfono</label>
                                    <input
                                        type="tel"
                                        required
                                        value={newEmpTelefono}
                                        onChange={e => setNewEmpTelefono(e.target.value)}
                                        placeholder="Ej: 0984252528"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-slate-300 font-bold block">Categoría Suicide Squad</label>
                                    <select
                                        value={newEmpCategoria}
                                        onChange={e => setNewEmpCategoria(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-purple-400"
                                    >
                                        {SUICIDE_SQUAD_CATEGORIES.map(c => (
                                            <option key={c.slug} value={c.slug}>{c.name} ({c.squadName})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddEmployeeModal(false)}
                                        className="px-4 py-2 text-slate-400 hover:text-white"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md"
                                    >
                                        Guardar Empleado
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MODAL: SUBIDA ESTRICTA DE 5 IMÁGENES Y 1 PDF ── */}
            <AnimatePresence>
                {uploadingCategoryAdvisor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div>
                                    <h3 className="text-base font-black text-white">Subir Anuncios de Categoría</h3>
                                    <p className="text-[10px] text-purple-300 font-mono">
                                        Asesor: {uploadingCategoryAdvisor.advisorName} • {uploadingCategoryAdvisor.categoryName}
                                    </p>
                                </div>
                                <button onClick={() => setUploadingCategoryAdvisor(null)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-2xl text-[11px] font-mono text-purple-200">
                                ⚠️ <strong>Regla estricta:</strong> Se permite exactamente <strong>1 documento PDF</strong> y hasta <strong>5 imágenes</strong> por asesor.
                            </div>

                            {/* Subida de Imágenes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                                    <span>Imágenes del Pack ({advisorImages.length} de 5):</span>
                                    {advisorImages.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => setAdvisorImages([...advisorImages, `anuncio_${Date.now()}.png`])}
                                            className="text-purple-400 font-bold hover:underline"
                                        >
                                            + Agregar Foto
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    {[0, 1, 2, 3, 4].map(idx => (
                                        <div key={idx} className="aspect-square rounded-xl bg-black/40 border border-slate-800 flex flex-col items-center justify-center text-center p-1">
                                            {advisorImages[idx] ? (
                                                <div className="text-emerald-400 text-[9px] font-mono">
                                                    <Check size={16} className="mx-auto" />
                                                    <span>Foto {idx + 1}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-mono text-slate-600">Slot {idx + 1}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subida de PDF */}
                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-mono text-slate-300 block">Catálogo Oficial en PDF (1 máximo):</span>
                                <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} className="text-rose-400" />
                                        <span className="text-xs font-mono text-white">
                                            {advisorPdf || "Sin archivo PDF seleccionado"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAdvisorPdf(advisorPdf ? null : "catalogo_oficial_categoria.pdf")}
                                        className="text-xs font-mono text-purple-400 font-bold hover:underline"
                                    >
                                        {advisorPdf ? "Quitar" : "Cargar PDF"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setUploadingCategoryAdvisor(null)}
                                    className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveAdvisorPackage}
                                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-mono font-bold text-xs rounded-xl shadow-md"
                                >
                                    Guardar y Registrar Paquete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
