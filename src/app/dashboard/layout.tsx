"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot, Globe, BarChart3, GraduationCap, Code2, User, Smartphone, Share2, Map, Layers, DollarSign, ShieldCheck, FileSpreadsheet, Table } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
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
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 z-0"></div>
                <div className="relative z-10">
                    <div className="w-32 h-32 border border-cyan-500/30 rounded-full animate-[spin_3s_linear_infinite] shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-2 border-indigo-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase tracking-[0.5em] animate-pulse text-[10px] italic drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Sincronización Operativa</div>
                </div>
            </div>
        )
    }

    const role = session.user?.role

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-x-hidden font-sans relative selection:bg-cyan-500/30 selection:text-white">
            
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>
            
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[black]/40 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Floating Personal AI Bot Bubble with Memory */}
            <PersonalBotBubble />

            {/* Sidebar - Executive White/Navy */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 flex flex-col bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 z-40
                transition-transform duration-500 ease-out shadow-[4px_0_24px_rgba(0,0,0,0.5)]
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            `}>
                <div className="h-24 flex flex-col items-center justify-center px-6 border-b border-slate-800/50 relative group">
                    <Link href="/web" target="_blank" className="flex flex-col items-center relative z-10 transition-transform duration-700 group-hover:scale-105 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                            <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase tracking-[0.3em] italic drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">ATOMIC</span>
                        </div>
                        <span className="text-[7px] font-black text-indigo-400/70 uppercase tracking-[0.5em] italic mt-1">SOLUTIONS</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar relative">
                    <NavLink href="/dashboard" icon={<Globe size={16} />} label="Dashboard" isActive={pathname === '/dashboard'} />
                    <NavLink href="/dashboard/analytics" icon={<LayoutDashboard size={16} />} label="Análisis" isActive={pathname === '/dashboard/analytics'} />
                    
                    <div className="pt-4 pb-1 px-3 text-[9px] font-black text-cyan-400/80 uppercase tracking-[0.25em] italic flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        Operaciones & Ventas
                    </div>
                    <NavLink href="/dashboard/quotes" icon={<FileText size={16} />} label="Cotizaciones" isActive={pathname.startsWith('/dashboard/quotes')} />
                    <NavLink href="/dashboard/matriz-precios" icon={<Table size={16} />} label="Matriz de Precios" isActive={pathname.startsWith('/dashboard/matriz-precios') || pathname.startsWith('/dashboard/shop') || pathname.startsWith('/dashboard/precios-vendedor')} />
                    {(role === "ADMIN" || role === "COORDINATOR" || role === "MANAGEMENT") && (
                        <NavLink href="/dashboard/coordinacion" icon={<Users size={16} />} label="Coordinación" isActive={pathname.startsWith('/dashboard/coordinacion')} />
                    )}
                    <NavLink href="/dashboard/map-prospecting" icon={<Map size={16} />} label="Prospección" isActive={pathname.startsWith('/dashboard/map-prospecting')} />
                    <NavLink href="/dashboard/formularios" icon={<FileSpreadsheet size={16} />} label="Contactos de Landing" isActive={pathname.startsWith('/dashboard/formularios')} />
                    
                    <div className="pt-4 pb-1 px-3 text-[9px] font-black text-indigo-400/80 uppercase tracking-[0.25em] italic flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        WhatsApp & CRM
                    </div>
                    <NavLink href="/dashboard/whatsapp/crm" icon={<Smartphone size={16} />} label="CRM WhatsApp" isActive={pathname.startsWith('/dashboard/whatsapp/crm')} />
                    <NavLink href="/dashboard/whatsapp/leads" icon={<Users size={16} />} label="Gestión de Leads" isActive={pathname.startsWith('/dashboard/whatsapp/leads')} />
                    <NavLink href="/dashboard/blogs" icon={<Share2 size={16} />} label="Social Command" isActive={pathname.startsWith('/dashboard/blogs')} />
                    
                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                        <>
                            <div className="pt-4 pb-1 px-3 text-[9px] font-black text-emerald-400/80 uppercase tracking-[0.25em] italic flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Gestión & Finanzas
                            </div>
                            <NavLink href="/dashboard/finance" icon={<DollarSign size={16} />} label="Finanzas" isActive={pathname.startsWith('/dashboard/finance')} />
                            <NavLink href="/dashboard/marketing" icon={<BarChart3 size={16} />} label="Marketing" isActive={pathname.startsWith('/dashboard/marketing')} />
                            <NavLink href="/dashboard/benefits" icon={<Tag size={16} />} label="Beneficios" isActive={pathname.startsWith('/dashboard/benefits')} />
                        </>
                    )}
                    <NavLink href="/dashboard/storage" icon={<Database size={16} />} label="Nube & Archivos" isActive={pathname.startsWith('/dashboard/storage')} />
                    <NavLink href="/dashboard/documents" icon={<FileText size={16} />} label="Documentos" isActive={pathname.startsWith('/dashboard/documents')} />
                    
                    <div className="pt-4 pb-1 px-3 text-[9px] font-black text-purple-400/80 uppercase tracking-[0.25em] italic flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        Inteligencia & Equipo
                    </div>
                    <NavLink href="/dashboard/coach" icon={<BrainCircuit size={16} />} label="AI Coach" isActive={pathname.startsWith('/dashboard/coach')} />
                    <NavLink href="/dashboard/academy" icon={<GraduationCap size={16} />} label="Academia & Admin Central" isActive={pathname.startsWith('/dashboard/academy') || pathname.startsWith('/dashboard/admin')} />
                    <NavLink href="/dashboard/bot-ruta" icon={<Bot size={16} />} label="Bot Ruta" isActive={pathname.startsWith('/dashboard/bot-ruta')} />
                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                        <NavLink href="/dashboard/evaluations" icon={<Users size={16} />} label="Asesores RRHH" isActive={pathname.startsWith('/dashboard/evaluations')} />
                    )}
                    {(role === "ADMIN" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                        <NavLink href="/dashboard/supervision" icon={<ShieldCheck size={16} />} label="Supervisión" isActive={pathname.startsWith('/dashboard/supervision')} />
                    )}
                </nav>

                <div className="p-6 shrink-0 border-t border-slate-800/50 bg-slate-950/50">
                    <div className="flex items-center space-x-4 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center font-black text-sm text-slate-300 italic overflow-hidden bg-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            {(session?.user as any)?.profilePicture ? (
                                <img src={(session?.user as any).profilePicture} alt="U" className="w-full h-full object-cover" />
                            ) : (
                                session.user?.name?.[0] || "U"
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black text-slate-200 truncate uppercase italic">{session.user?.name}</p>
                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest truncate italic drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">
                                {role}
                            </p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center justify-center space-x-3 px-4 py-3 text-[9px] font-black text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all group italic border border-slate-800 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <LogOut size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="uppercase tracking-widest">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative z-10 transition-all duration-500 lg:ml-64`}>
                {/* Header */}
                <header className="h-16 lg:h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 lg:px-10 shrink-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative">
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em] italic drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">ATOMIC INDUSTRIAS</span>
                            </div>
                        </div>
                        <Link 
                            href="/web" 
                            target="_blank"
                            className="hidden md:flex items-center space-x-2 px-4 py-2 border border-slate-700 rounded-lg hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        >
                            <ExternalLink size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Visitar Web</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center gap-4 pr-6 border-r border-slate-800">
                            <NotificationBell />
                        </div>
                        
                        <Link href="/dashboard/profile" className="flex items-center gap-3 p-1.5 bg-slate-900/50 rounded-full border border-slate-700 hover:border-indigo-500/50 transition-all group pr-4 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 overflow-hidden border border-slate-700">
                                {(session?.user as any)?.profilePicture ? (
                                    <img src={(session?.user as any).profilePicture} alt="P" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                            <Settings size={14} className="text-slate-400 group-hover:text-indigo-400 group-hover:rotate-45 transition-all" />
                        </Link>

                        <div className="hidden lg:flex flex-col items-end border-l border-slate-800 pl-6">
                             <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter italic leading-none drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">SISTEMA ACTIVO</span>
                             <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest mt-1">v7.0.0 Neon</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto relative z-0 scrollbar-hide">
                    <div className="mx-auto max-w-[1800px] p-4 lg:p-8 min-h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

function NavLink({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center space-x-3.5 px-4 py-2.5 rounded-xl transition-all duration-300 group relative mx-1
                ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.15)] font-bold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]'}
            `}
        >
            <span className={`transition-all duration-300 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110' : 'text-slate-500 group-hover:text-indigo-400 group-hover:scale-110'}`}>
                {icon}
            </span>
            <span className={`text-[10.5px] font-black uppercase tracking-[0.15em] italic transition-all duration-300 ${isActive ? 'translate-x-1 text-cyan-100' : 'group-hover:translate-x-1'}`}>
                {label}
            </span>
        </Link>
    )
}

