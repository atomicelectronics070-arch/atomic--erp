"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
    User, Mail, Phone, MapPin, Camera, 
    Save, ShieldCheck, Loader2, Award,
    Sparkles, Trash2, Edit3, Building2,
    ChevronRight, LogOut, Key, Map, Search, DollarSign, Package,
    Palette, Check, Zap, Eye, RefreshCw, Sun, Moon, Shield
} from "lucide-react"

interface ThemeOption {
    id: string
    name: string
    desc: string
    primaryColor: string
    accentColor: string
    bgGrad: string
    borderClass: string
    badgeBg: string
}

const SYSTEM_THEMES: ThemeOption[] = [
    {
        id: "cyber-neon",
        name: "Cyber Neon (Cyan & Indigo)",
        desc: "La estética oficial de alto contraste de ATOMIC",
        primaryColor: "#06B6D4",
        accentColor: "#6366F1",
        bgGrad: "from-cyan-500/20 via-indigo-500/10 to-transparent",
        borderClass: "border-cyan-500/50 text-cyan-300",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    },
    {
        id: "emerald-matrix",
        name: "Emerald Matrix (Verde Esmeralda)",
        desc: "Estilo financiero de alta rentabilidad y precisión",
        primaryColor: "#10B981",
        accentColor: "#059669",
        bgGrad: "from-emerald-500/20 via-teal-500/10 to-transparent",
        borderClass: "border-emerald-500/50 text-emerald-300",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
        id: "midnight-purple",
        name: "Midnight Amethyst (Púrpura & Violeta)",
        desc: "Ambiente ejecutivo profundo con acentos violeta",
        primaryColor: "#A855F7",
        accentColor: "#7C3AED",
        bgGrad: "from-purple-500/20 via-indigo-500/10 to-transparent",
        borderClass: "border-purple-500/50 text-purple-300",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    },
    {
        id: "solar-amber",
        name: "Solar Amber (Ámbar Tecnológico)",
        desc: "Tonalidades cálidas doradas y enfoque industrial",
        primaryColor: "#F59E0B",
        accentColor: "#D97706",
        bgGrad: "from-amber-500/20 via-orange-500/10 to-transparent",
        borderClass: "border-amber-500/50 text-amber-300",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
    },
    {
        id: "oled-black",
        name: "OLED Pure Dark (Minimalista)",
        desc: "Negro absoluto de máxima concentración y bajo brillo",
        primaryColor: "#E2E8F0",
        accentColor: "#94A3B8",
        bgGrad: "from-slate-700/20 via-slate-800/10 to-transparent",
        borderClass: "border-slate-600 text-slate-200",
        badgeBg: "bg-slate-800 text-slate-300 border-slate-700"
    }
]

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<"info" | "themes" | "security">("info")
    const [currentTheme, setCurrentTheme] = useState("cyber-neon")
    
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        residenceSector: "",
        profilePicture: "",
        bio: "Asesor Técnico Comercial en ATOMIC ECUADOR",
        department: "OPERACIONES & COMERCIAL"
    })

    const [requestRole, setRequestRole] = useState("")

    useEffect(() => {
        // Load saved theme
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("atomic_theme") || "cyber-neon"
            setCurrentTheme(savedTheme)
        }
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/user/profile")
            if (res.ok) {
                const data = await res.json()
                setFormData(prev => ({
                    ...prev,
                    name: data.name || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    residenceSector: data.residenceSector || "",
                    profilePicture: data.profilePicture || ""
                }))
            }
        } catch (e) {
            console.error("Error fetching profile:", e)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    residenceSector: formData.residenceSector,
                    profilePicture: formData.profilePicture,
                    requestRoleChange: requestRole
                })
            })
            if (res.ok) {
                alert("✅ ¡Perfil actualizado correctamente!")
                await update()
                if (requestRole) setRequestRole("")
            } else {
                alert("⚠️ Error al guardar los datos.")
            }
        } catch (e) {
            console.error(e)
            alert("Error de conexión al sincronizar.")
        } finally {
            setSaving(false)
        }
    }

    const handleApplyTheme = (themeId: string) => {
        setCurrentTheme(themeId)
        if (typeof window !== "undefined") {
            localStorage.setItem("atomic_theme", themeId)
            document.documentElement.setAttribute("data-theme", themeId)
            window.dispatchEvent(new CustomEvent("theme-changed", { detail: themeId }))
        }
    }

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Cargando perfil...</span>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative max-w-6xl mx-auto pb-24">
            
            {/* Header Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 p-1 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex items-center justify-center overflow-hidden">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black italic">
                                    {formData.name?.[0] || session?.user?.name?.[0] || "A"}
                                </div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold uppercase gap-1">
                            <Camera size={20} />
                            <span>Cambiar</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onload = (ev) => {
                                            if (ev.target?.result) {
                                                setFormData(prev => ({ ...prev, profilePicture: ev.target!.result as string }))
                                            }
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                        </label>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-md">
                            ONLINE
                        </div>
                    </div>

                    {/* Name & Details */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                {formData.name || session?.user?.name} {formData.lastName}
                            </h1>
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                                {session?.user?.role || "ASESOR"}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 uppercase">
                                ATOMIC INDUSTRIAS
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-xl font-medium">
                            {formData.email || session?.user?.email} • {formData.phoneNumber || "+593 96 904 3453"}
                        </p>
                        <p className="text-[11px] text-slate-500 italic">
                            Sector: <span className="text-slate-300 font-semibold">{formData.residenceSector || "Quito, Ecuador"}</span>
                        </p>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="hidden lg:flex flex-col gap-2 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl shrink-0">
                        <div className="flex items-center justify-between gap-6 text-[11px]">
                            <span className="text-slate-400">Estado de Cuenta:</span>
                            <span className="font-black text-emerald-400 font-mono">ACTIVO</span>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-[11px]">
                            <span className="text-slate-400">ID Operativo:</span>
                            <span className="font-black text-cyan-400 font-mono">#{session?.user?.id?.slice(-6).toUpperCase() || "ATOMIC"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-[11px]">
                            <span className="text-slate-400">Tema Activo:</span>
                            <span className="font-bold text-indigo-300 font-mono uppercase">{currentTheme}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs Selector */}
                <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-800/60 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === "info"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                        <User size={15} />
                        <span>Datos de Identidad</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("themes")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === "themes"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                        <Palette size={15} />
                        <span>Temas del Ecosistema</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[9px] font-mono font-bold">5</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeTab === "security"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                        <ShieldCheck size={15} />
                        <span>Seguridad & Rol</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: Información Personal */}
            {activeTab === "info" && (
                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
                        <div className="border-b border-slate-800 pb-4">
                            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Edit3 size={18} className="text-cyan-400" />
                                <span>Información General</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Actualiza tus nombres, datos de contacto y ubicación de residencia.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-bold uppercase text-slate-400">Nombre Operativo *</label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="Nombre..."
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-bold uppercase text-slate-400">Apellidos *</label>
                                <input 
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="Apellidos..."
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-bold uppercase text-slate-400">Correo Electrónico</label>
                                <input 
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-bold uppercase text-slate-400">Teléfono / WhatsApp *</label>
                                <input 
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono font-bold text-emerald-400 outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="Ej. 0969043453"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-[11px] font-mono font-bold uppercase text-slate-400">Sector de Residencia / Ciudad *</label>
                                <input 
                                    type="text"
                                    value={formData.residenceSector}
                                    onChange={(e) => setFormData({ ...formData, residenceSector: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-400 transition-colors"
                                    placeholder="Ej. Quito / Sector Norte / Av. Amazonas"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-3 cursor-pointer"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right side info card */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                <Shield size={16} />
                                <span>Privacidad y Rol</span>
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Tu cuenta cuenta con permisos de nivel <strong className="text-white">{session?.user?.role}</strong>. Tus cotizaciones y acciones operativas son respaldadas en tiempo real.
                            </p>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 space-y-1">
                                <div>• Sesión Cifrada SSL</div>
                                <div>• ID de Usuario: #{session?.user?.id?.slice(-8)}</div>
                                <div>• Sincronización Automática CRM</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/30 rounded-3xl p-6 space-y-3">
                            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                                <Sparkles size={16} />
                                <span>¿Personalizar Apariencia?</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Puedes cambiar los colores y contraste de todo el sistema en la pestaña <strong>Temas del Ecosistema</strong>.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveTab("themes")}
                                className="w-full py-2.5 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                                Cambiar Tema Visual
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* TAB 2: Apartado de Temas */}
            {activeTab === "themes" && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
                    <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <Palette size={22} className="text-cyan-400" />
                            <h3 className="text-lg font-black text-white uppercase tracking-wider">
                                Personalización de Temas del Sistema
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Elige la paleta visual que mejor se adapte a tu estilo de trabajo. Los cambios se aplican de inmediato en toda la plataforma.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SYSTEM_THEMES.map((t) => {
                            const isSelected = currentTheme === t.id
                            return (
                                <div
                                    key={t.id}
                                    onClick={() => handleApplyTheme(t.id)}
                                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                                        isSelected
                                            ? `bg-slate-950 ${t.borderClass} shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-2 ring-cyan-400/40`
                                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div 
                                                    className="w-5 h-5 rounded-full shadow-md" 
                                                    style={{ backgroundColor: t.primaryColor }} 
                                                />
                                                <div 
                                                    className="w-3.5 h-3.5 rounded-full opacity-70" 
                                                    style={{ backgroundColor: t.accentColor }} 
                                                />
                                            </div>
                                            {isSelected && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-400 text-black flex items-center gap-1">
                                                    <Check size={12} /> ACTIVO
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                                {t.name}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                {t.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Preview mini bar */}
                                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                                        <span className="text-slate-500">Preview:</span>
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${t.badgeBg}`}>
                                            ATOMIC ERP
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                        <span>💡 El tema seleccionado se sincroniza automáticamente en tu navegador.</span>
                        <button
                            onClick={() => handleApplyTheme("cyber-neon")}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase text-[10px] transition-colors cursor-pointer"
                        >
                            Restablecer Predeterminado
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 3: Seguridad & Cambio de Rango */}
            {activeTab === "security" && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
                    <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={22} className="text-emerald-400" />
                            <h3 className="text-lg font-black text-white uppercase tracking-wider">
                                Permisos de Rango & Solicitudes
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Consulta tu jerarquía en la organización y solicita ascensos o cambios de departamento.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Rol Actual</h4>
                            <div className="text-2xl font-black text-white font-mono uppercase">
                                {session?.user?.role || "ASESOR COMERCIAL"}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Tienes acceso a la emisión de cotizaciones, prospección de leads y visualización de recursos.
                            </p>
                        </div>

                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Solicitar Cambio de Rol</h4>
                            <select 
                                value={requestRole}
                                onChange={(e) => setRequestRole(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-xs font-black text-white outline-none focus:border-cyan-400 uppercase font-mono"
                            >
                                <option value="">SELECCIONAR NUEVO RANGO...</option>
                                <option value="COORDINATOR">COORDINADOR REGIONAL</option>
                                <option value="MANAGEMENT">GERENCIA COMERCIAL</option>
                                <option value="ADMIN">ADMINISTRADOR TOTAL</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!requestRole || saving}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                            >
                                Enviar Solicitud a Dirección
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
