"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot, Globe, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        operaciones: true,
        rrhh: false,
        comunicacion: true,
        ia: true,
        config: false
    })
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    useEffect(() => {
        if (session?.user?.id) {
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
    }, [session])

    if (status === "loading" || !session) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-mesh gap-8">
                <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_50px_rgba(99,102,241,0.2)]"></div>
                <div className="font-black text-primary uppercase tracking-[0.8em] animate-pulse text-xs italic text-center px-8">Sincronizando Nodo Central...</div>
            </div>
        )
    }

    const role = session.user?.role

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    return (
        <div className="flex h-screen bg-[#000103] text-white overflow-hidden font-sans relative selection:bg-primary/30 selection:text-white">
            {/* Background Orbs - Deep Visual Hierarchy */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] animate-pulse transition-all duration-10000" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-pink-600/5 blur-[120px] animate-pulse transition-all duration-7000" />
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full bg-violet-600/5 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-fixed"></div>
            </div>

            {/* Top Security Line (Visual Accent) */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-[100]"></div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Precision Glass Engineering */}
            <aside className={`
                fixed inset-y-0 left-0 w-80 flex flex-col glass-panel !bg-slate-950/40 !border-r !border-white/5 z-40
                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 lg:static
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-40 flex flex-col items-center justify-center px-10 border-b border-white/5 relative group bg-white/[0.02]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-8 right-8 lg:hidden text-slate-500 hover:text-primary transition-all hover:rotate-90"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex flex-col items-center relative z-10 transition-transform duration-700 group-hover:scale-105">
                        <img
                            src="/logo_atomic.jpg"
                            alt="ATOMIC Logo"
                            className="w-40 h-auto object-contain mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] grayscale group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic">Industries_HQ</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-8 py-12 space-y-4 custom-scrollbar relative">
                    <div className="mb-10 space-y-4">
                        <NavLink href="/dashboard" icon={<Globe size={20} />} label="Red Corporativa" isActive={pathname === '/dashboard'} />
                        <NavLink href="/dashboard/analytics" icon={<LayoutDashboard size={20} />} label="Centro de Análisis" isActive={pathname === '/dashboard/analytics'} />
                    </div>

                    <div className="space-y-10">
                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "SALESPERSON") && (
                            <CollapsibleSection
                                label="Operaciones"
                                isOpen={openSections.operaciones}
                                onToggle={() => toggleSection('operaciones')}
                            >
                                <NavLink href="/dashboard/quotes" icon={<FileText size={18} />} label="Cotizaciones" />
                                <NavLink href="/dashboard/prices" icon={<Tag size={18} />} label="Lista de Precios" />
                                <NavLink href="/dashboard/shop" icon={<ShoppingBag size={18} />} label="Inv. Maestro" />
                                <NavLink href="/dashboard/storage" icon={<Database size={18} />} label="Archivo_Vect" />
                                <NavLink href="/dashboard/documents" icon={<FileText size={18} />} label="Biblioteca" />
                                <NavLink href="/dashboard/crm" icon={<Users size={18} />} label="Gestión CRM" />
                                <NavLink href="/dashboard/finance" icon={<DollarSign size={18} />} label="Finanzas" />
                                <NavLink href="/dashboard/contracts" icon={<CheckSquare size={18} />} label="Protocolos" />
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT" || role === "SALESPERSON" || role === "EDITOR") && (
                            <CollapsibleSection
                                label="Cerebro IA"
                                isOpen={openSections.ia}
                                onToggle={() => toggleSection('ia')}
                            >
                                <NavLink href="/dashboard/training" icon={<BrainCircuit size={18} />} label="IA Cognitiva" />
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT" || role === "SALESPERSON") && (role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR") && (
                            <CollapsibleSection
                                label="Crecimiento"
                                isOpen={openSections.rrhh}
                                onToggle={() => toggleSection('rrhh')}
                            >
                                <NavLink href="/dashboard/evaluations" icon={<CheckSquare size={18} />} label="Rúbricas" />
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "SALESPERSON") && (
                            <CollapsibleSection
                                label="Comunicación"
                                isOpen={openSections.comunicacion}
                                onToggle={() => toggleSection('comunicacion')}
                            >
                                <Link
                                    href="/dashboard/messages"
                                    className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-[10px] font-black text-slate-500 hover:bg-white/5 hover:text-white transition-all group relative border border-transparent hover:border-white/5 italic"
                                >
                                    <Mail size={18} className="text-slate-600 group-hover:text-primary transition-colors" />
                                    <span className="tracking-[0.2em] uppercase">Mensajería_Env</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <NavLink href="/dashboard/whatsapp" icon={<MessageSquare size={18} />} label="WhatsApp_API" />
                                <NavLink href="/dashboard/agenda" icon={<Calendar size={18} />} label="Agenda" />
                                <NavLink href="/dashboard/notes" icon={<Edit3 size={18} />} label="Bloc Notas" />
                                <NavLink href="/dashboard/blogs" icon={<FileText size={18} />} label="Blogs Corporativos" />
                                <Link
                                    href="/web"
                                    target="_blank"
                                    className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-[10px] font-black text-primary hover:bg-primary/10 transition-all group border border-primary/20 mt-6 bg-primary/5 italic shadow-2xl shadow-primary/5"
                                >
                                    <ExternalLink size={18} className="text-primary group-hover:rotate-12 transition-transform" />
                                    <span className="tracking-[0.2em] uppercase">Página Pública</span>
                                </Link>
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT") && (
                            <CollapsibleSection
                                label="Configuración"
                                isOpen={openSections.config}
                                onToggle={() => toggleSection('config')}
                            >
                                <NavLink href="/dashboard/extraction" icon={<Database size={18} />} label="Herramienta Web" />
                                <NavLink href="/dashboard/admin/prompt" icon={<Settings size={18} />} label="IA Config" />
                                <NavLink href="/dashboard/admin/users" icon={<Users size={18} />} label="Equipos_Vect" />
                            </CollapsibleSection>
                        )}

                        {role === "ADMIN" && (
                            <CollapsibleSection
                                label="Herramientas"
                                isOpen={openSections.herramientas ?? true}
                                onToggle={() => toggleSection('herramientas')}
                            >
                                <NavLink href="/dashboard/scraper" icon={<Bot size={18} />} label="Scraper Pro" />
                            </CollapsibleSection>
                        )}
                    </div>
                </nav>

                <div className="p-10 shrink-0 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center space-x-6 mb-10 px-2 transition-all group cursor-default">
                        <div className="w-14 h-14 rounded-2xl glass-panel !bg-slate-900 border-white/10 shadow-2xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform duration-500 shadow-primary/10 text-white italic">
                            {session.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-white truncate uppercase tracking-tighter italic">{session.user?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] truncate italic opacity-80">
                                    {role === "COORD_ASSISTANT" ? "ASIST. COORD" : role === "ADMIN" ? "ADMINISTRADOR" : role === "MANAGEMENT" ? "GERENCIA" : role === "COORDINATOR" ? "COORDINADOR" : role === "SALESPERSON" ? "VENDEDOR" : role}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-4 px-5 py-4 text-[10px] font-black text-slate-500 hover:text-red-400 rounded-2xl transition-all hover:bg-red-500/5 group border border-transparent hover:border-red-500/20 italic">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="uppercase tracking-[0.3em]">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Engineering */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-700">
                {/* Precision Glass Header */}
                <header className="h-28 glass-panel !bg-slate-950/40 !border-b !border-white/5 flex items-center justify-between px-10 lg:px-16 shrink-0 z-50 backdrop-blur-3xl shadow-2xl">
                    <div className="flex items-center space-x-10">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-4 glass-panel text-slate-500 hover:text-white transition-all rounded-2xl shadow-xl hover:scale-105 active:scale-95 border-white/10"
                        >
                            <Menu size={28} />
                        </button>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-4 mb-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse"></div>
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Sector Operativo v4.0.2</span>
                            </div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] ml-6 opacity-60">Status: Terminal Sincronizada</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-10">
                        <div className="flex items-center gap-4 border-r border-white/5 pr-10">
                            <NotificationBell />
                        </div>
                        {(role === "ADMIN" || role === "MANAGEMENT") && (
                            <Link href="/dashboard/admin/settings" className="p-4 glass-panel text-slate-500 hover:text-primary transition-all rounded-2xl shadow-xl hover:scale-105 active:scale-95 border-white/10 group">
                                <Settings size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                            </Link>
                        )}
                        <div className="hidden lg:flex flex-col items-end border-l border-white/5 pl-10">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none mb-1">Carga de Datos</span>
                             <span className="text-[11px] font-black text-emerald-400 uppercase tracking-tighter italic">Nivel Óptimo 99.8%</span>
                        </div>
                    </div>
                </header>

                {/* Performance Scrollable Region */}
                <div className="flex-1 overflow-y-auto relative z-0 scrollbar-hide bg-gradient-to-b from-transparent to-black/20">
                    <div className="mx-auto max-w-[1600px] p-10 lg:p-16 min-h-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
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
                flex items-center space-x-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden
                ${isActive 
                    ? 'bg-white/5 text-white shadow-2xl shadow-azure-500/5 border border-white/10' 
                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-white border border-transparent hover:border-white/5'}
            `}
        >
            <div className={`absolute top-0 left-0 w-1 h-full bg-primary transition-transform duration-700 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
            <span className={`transition-all duration-500 group-hover:scale-110 ${isActive ? 'text-primary scale-110' : 'group-hover:text-primary'}`}>
                {icon}
            </span>
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] italic transition-all duration-500 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                {label}
            </span>
        </Link>
    )
}

function CollapsibleSection({ label, children, isOpen, onToggle }: { label: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="space-y-4">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-2 group cursor-pointer transition-all duration-500"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-1 h-4 bg-slate-800 transition-all duration-500 group-hover:bg-slate-400 ${isOpen ? 'bg-primary h-6' : ''}`}></div>
                    <span className={`text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic transition-all duration-500 group-hover:text-slate-300 ${isOpen ? 'text-white' : ''}`}>
                        {label}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronDown size={14} className="text-primary animate-bounce-subtle" />
                ) : (
                    <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
                        exit={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 pt-2 px-4 border-l-2 border-white/5 ml-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DollarSign(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}

import { motion, AnimatePresence } from "framer-motion"
