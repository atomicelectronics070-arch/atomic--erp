"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    Home, Users, FileText, Settings, LogOut, CheckSquare,
    LayoutDashboard, Tag, Database, MessageSquare, ExternalLink,
    ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit,
    Bot, Globe, BarChart3, GraduationCap, Code2, User, Smartphone,
    Share2, Map, Layers, DollarSign, ShieldCheck, FileSpreadsheet,
    Table, Bell, Lock, Hexagon, ChevronDown, Sparkles
} from "lucide-react"
import { useState, useEffect } from "react"
import NotificationBell from "@/components/NotificationBell"
import PersonalBotBubble from "@/components/PersonalBotBubble"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const router = useRouter()
    const pathname = usePathname()
    const isDashboard = pathname.startsWith("/dashboard")
    const isStandalonePage = pathname === "/dashboard/matriz-precios" || pathname === "/dashboard/shop" || pathname === "/dashboard/precios-vendedor" || pathname === "/web/matriz-precios" || pathname === "/dashboard/ecosistema-tomc"

    useEffect(() => {
        if (status === "unauthenticated" && isDashboard) {
            router.push("/login")
        }
    }, [status, router, isDashboard])

    if (isStandalonePage) {
        return (
            <main className="min-h-screen bg-black text-slate-100 font-mono overflow-hidden">
                {children}
            </main>
        )
    }

    useEffect(() => {
        if (session?.user?.id && isDashboard) {
            fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "dashboard" }) }).catch(() => {})
        }
    }, [session?.user?.id, isDashboard])

    useEffect(() => {
        if (session?.user?.id && isDashboard) {
            const fetchUnread = async () => {
                try {
                    const res = await fetch("/api/messages?type=unread")
                    if (res.ok) {
                        const data = await res.json()
                        setUnreadCount(data.unreadCount)
                    }
                } catch (e) {
                    console.error("Failed to fetch unread messages", e)
                }
            }
            fetchUnread()
            const interval = setInterval(fetchUnread, 60000)
            return () => clearInterval(interval)
        }
    }, [session, isDashboard])

    if (!isDashboard) {
        return <>{children}</>
    }

    if (status === "loading" || !session) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#070a14] gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/30 via-[#070a14] to-[#070a14] z-0"></div>
                <div className="relative z-10">
                    <div className="w-28 h-28 border border-cyan-500/30 rounded-full animate-[spin_3s_linear_infinite] shadow-[0_0_25px_rgba(6,182,212,0.3)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 border-2 border-indigo-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 font-sans">
                    <span className="text-white/90 text-sm tracking-[2px] font-normal">atomic.ai</span>
                    <span className="text-cyan-400/80 text-[10px] tracking-widest font-mono uppercase">Cargando Ecosistema...</span>
                </div>
            </div>
        )
    }

    const role = session.user?.role

    return (
        <div className="flex h-screen bg-[#070a14] text-white/95 overflow-hidden font-sans relative selection:bg-cyan-500/30 selection:text-white">
            
            {/* Background Ambient Depth */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/25 via-[#070a14] to-[#070a14] pointer-events-none z-0"></div>
            
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Floating Personal AI Bot Bubble */}
            <PersonalBotBubble />

            {/* ═══════════════════════════════════════════════════════════
                AI GLASS FLOATING SIDEBAR (QUBE.AI / FIGMA STYLE)
            ═══════════════════════════════════════════════════════════ */}
            <aside className={`
                fixed top-4 left-4 bottom-4 w-[270px] z-50 flex flex-col
                rounded-[34px] border-[2px] border-white/[0.08]
                bg-[#090d1e]/70 backdrop-blur-[32px]
                shadow-[0_20px_60px_rgba(0,0,0,0.7)]
                transition-all duration-400 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+24px)]'} lg:translate-x-0
            `}>
                {/* ── HEADER: LOGO + ATOMIC.AI ──────────────────────── */}
                <header className="h-[72px] px-5 flex items-center justify-between shrink-0 border-b border-white/[0.06]">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        {/* Hexagon AI Logo mark */}
                        <div className="w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
                            <Hexagon size={20} className="text-cyan-300 stroke-[1.8]" />
                        </div>
                        <h1 className="text-[17px] font-normal tracking-[1px] text-white/95 font-sans leading-none">
                            atomic<span className="text-cyan-400">.ai</span>
                        </h1>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors lg:hidden"
                    >
                        <X size={18} />
                    </button>
                    
                    <div className="hidden lg:flex items-center text-white/40">
                        <Menu size={18} />
                    </div>
                </header>

                {/* ── NAV ITEMS (FIXED / ALL VISIBLE / NO COLLAPSE) ─── */}
                <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 custom-scrollbar">
                    
                    {/* General */}
                    <GlassNavItem href="/dashboard" icon={<Home size={18} strokeWidth={1.8} />} label="Home" isActive={pathname === '/dashboard'} />
                    <GlassNavItem href="/dashboard/analytics" icon={<BarChart3 size={18} strokeWidth={1.8} />} label="Analytics" isActive={pathname === '/dashboard/analytics'} />
                    
                    {/* Operaciones & Ventas */}
                    <div className="pt-3 pb-1 px-3.5 text-[11px] font-normal tracking-[0.5px] text-white/40">
                        Operaciones & Ventas
                    </div>
                    <GlassNavItem href="/dashboard/quotes" icon={<FileText size={18} strokeWidth={1.8} />} label="Cotizaciones" isActive={pathname.startsWith('/dashboard/quotes')} />
                    <GlassNavItem href="/dashboard/matriz-precios" icon={<Table size={18} strokeWidth={1.8} />} label="Matriz de Precios" isActive={pathname.startsWith('/dashboard/matriz-precios') || pathname.startsWith('/dashboard/shop') || pathname.startsWith('/dashboard/precios-vendedor')} />
                    {(role === "ADMIN" || role === "COORDINATOR" || role === "MANAGEMENT") && (
                        <GlassNavItem href="/dashboard/coordinacion" icon={<Users size={18} strokeWidth={1.8} />} label="Coordinación" isActive={pathname.startsWith('/dashboard/coordinacion')} />
                    )}
                    <GlassNavItem href="/dashboard/map-prospecting" icon={<Map size={18} strokeWidth={1.8} />} label="Prospección" isActive={pathname.startsWith('/dashboard/map-prospecting')} />
                    <GlassNavItem href="/dashboard/formularios" icon={<FileSpreadsheet size={18} strokeWidth={1.8} />} label="Contactos Web" isActive={pathname.startsWith('/dashboard/formularios')} />
                    
                    {/* WhatsApp & CRM */}
                    <div className="pt-3 pb-1 px-3.5 text-[11px] font-normal tracking-[0.5px] text-white/40">
                        WhatsApp & Leads
                    </div>
                    <GlassNavItem href="/dashboard/whatsapp/crm" icon={<Smartphone size={18} strokeWidth={1.8} />} label="CRM WhatsApp" isActive={pathname.startsWith('/dashboard/whatsapp/crm')} />
                    <GlassNavItem href="/dashboard/whatsapp/leads" icon={<Users size={18} strokeWidth={1.8} />} label="Gestión Leads" isActive={pathname.startsWith('/dashboard/whatsapp/leads')} />
                    <GlassNavItem href="/dashboard/blogs" icon={<Share2 size={18} strokeWidth={1.8} />} label="Social Command" isActive={pathname.startsWith('/dashboard/blogs')} />
                    
                    {/* Gestión & Finanzas */}
                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                        <>
                            <div className="pt-3 pb-1 px-3.5 text-[11px] font-normal tracking-[0.5px] text-white/40">
                                Gestión & Finanzas
                            </div>
                            <GlassNavItem href="/dashboard/finance" icon={<DollarSign size={18} strokeWidth={1.8} />} label="Finanzas" isActive={pathname.startsWith('/dashboard/finance')} />
                            <GlassNavItem href="/dashboard/marketing" icon={<BarChart3 size={18} strokeWidth={1.8} />} label="Marketing" isActive={pathname.startsWith('/dashboard/marketing')} />
                            <GlassNavItem href="/dashboard/benefits" icon={<Tag size={18} strokeWidth={1.8} />} label="Beneficios" isActive={pathname.startsWith('/dashboard/benefits')} />
                        </>
                    )}
                    <GlassNavItem href="/dashboard/storage" icon={<Database size={18} strokeWidth={1.8} />} label="Nube & Archivos" isActive={pathname.startsWith('/dashboard/storage')} />
                    <GlassNavItem href="/dashboard/documents" icon={<FileText size={18} strokeWidth={1.8} />} label="Documentos" isActive={pathname.startsWith('/dashboard/documents')} />

                    {/* Inteligencia & Equipo */}
                    <div className="pt-3 pb-1 px-3.5 text-[11px] font-normal tracking-[0.5px] text-white/40">
                        Inteligencia & Equipo
                    </div>
                    <GlassNavItem href="/dashboard/coach" icon={<BrainCircuit size={18} strokeWidth={1.8} />} label="AI Coach" isActive={pathname.startsWith('/dashboard/coach')} />
                    <GlassNavItem href="/dashboard/academy" icon={<GraduationCap size={18} strokeWidth={1.8} />} label="Academia Atomic" isActive={pathname.startsWith('/dashboard/academy') || pathname.startsWith('/dashboard/admin')} />
                    <GlassNavItem href="/dashboard/bot-ruta" icon={<Bot size={18} strokeWidth={1.8} />} label="Bot Ruta" isActive={pathname.startsWith('/dashboard/bot-ruta')} />
                    {(role === "ADMIN" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                        <GlassNavItem href="/dashboard/supervision" icon={<ShieldCheck size={18} strokeWidth={1.8} />} label="Supervisión" isActive={pathname.startsWith('/dashboard/supervision')} />
                    )}
                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                        <GlassNavItem href="/dashboard/evaluations" icon={<Users size={18} strokeWidth={1.8} />} label="Asesores RRHH" isActive={pathname.startsWith('/dashboard/evaluations')} />
                    )}
                </nav>

                {/* ── FOOTER: ACCOUNT & SETTINGS (EXACT QUBE.AI STYLE) ─ */}
                <div className="p-3 border-t border-white/[0.06] bg-black/20 shrink-0 space-y-1">
                    <GlassNavItem
                        href="/dashboard/profile"
                        icon={<User size={18} strokeWidth={1.8} />}
                        label="Account"
                        isActive={pathname.startsWith('/dashboard/profile')}
                    />
                    <GlassNavItem
                        href="/dashboard/admin"
                        icon={<Settings size={18} strokeWidth={1.8} />}
                        label="Settings"
                        isActive={pathname.startsWith('/dashboard/admin')}
                    />
                    
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-3.5 h-[44px] w-full px-4 rounded-[14px] text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-[14px] font-normal"
                    >
                        <LogOut size={16} strokeWidth={1.8} />
                        <span className="truncate">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════
                MAIN CONTENT CANVAS (ADAPTED FOR FLOATING SIDEBAR)
            ═══════════════════════════════════════════════════════════ */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative z-10 transition-all duration-300 lg:pl-[306px]">
                
                {/* Modern Glass Navbar Header */}
                <header className="h-16 lg:h-20 bg-transparent flex items-center justify-between px-6 lg:px-10 shrink-0 z-40 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 bg-white/[0.06] border border-white/[0.1] rounded-2xl text-white/80 hover:text-white hover:bg-white/[0.1] transition-all lg:hidden shadow-lg"
                        >
                            <Menu size={20} />
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            <span className="text-xs font-medium text-white/80 tracking-wide">Ecosistema Atomic ERP</span>
                        </div>

                        <Link 
                            href="/web" 
                            target="_blank"
                            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-xl hover:bg-white/[0.1] text-white/70 hover:text-white transition-all text-xs font-normal"
                        >
                            <ExternalLink size={13} />
                            <span>Visitar Tienda</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-4 border-r border-white/[0.08]">
                            <NotificationBell />
                        </div>
                        
                        {/* User pill */}
                        <Link href="/dashboard/profile" className="flex items-center gap-3 p-1 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] transition-all pr-3.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white/90 overflow-hidden text-xs font-bold">
                                {(session?.user as any)?.profilePicture ? (
                                    <img src={(session?.user as any).profilePicture} alt="P" className="w-full h-full object-cover" />
                                ) : (
                                    session.user?.name?.[0]?.toUpperCase() || "A"
                                )}
                            </div>
                            <div className="hidden sm:flex flex-col text-left leading-none">
                                <span className="text-xs font-medium text-white/90 truncate max-w-[120px]">{session.user?.name}</span>
                                <span className="text-[10px] text-cyan-400/80 mt-0.5">{role}</span>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Dashboard Page View */}
                <div className="flex-1 overflow-y-auto relative z-0">
                    <div className="mx-auto max-w-[1700px] p-4 lg:p-8 min-h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXACT QUBE.AI STYLE GLASS NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
function GlassNavItem({
    href,
    icon,
    label,
    isActive
}: {
    href: string
    icon: React.ReactNode
    label: string
    isActive?: boolean
}) {
    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`
                relative flex items-center gap-3.5 h-[46px] w-full px-4 rounded-[14px]
                font-sans text-[15px] font-normal leading-none tracking-normal
                transition-all duration-200 group
                ${isActive 
                    ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md' 
                    : 'text-white/85 hover:text-white hover:bg-white/[0.06]'}
            `}
        >
            {/* Left Icon */}
            <span className={`transition-colors shrink-0 ${isActive ? 'text-cyan-300' : 'text-white/80 group-hover:text-white'}`}>
                {icon}
            </span>
            
            {/* Label */}
            <span className="truncate flex-1 text-left">
                {label}
            </span>

            {/* Active Subtle Indicator */}
            {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0" />
            )}
        </Link>
    )
}
