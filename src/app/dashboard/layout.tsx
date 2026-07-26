"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot, Globe, BarChart3, GraduationCap, Code2, User, Smartphone, Share2, Map, Layers, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"
import PersonalBotBubble from "@/components/PersonalBotBubble"
import { motion, AnimatePresence } from "framer-motion"
import { SellerBotOverlay } from "@/components/ui/SellerBotOverlay"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        operaciones: true, // Also open operations by default for convenience
        rrhh: false,
        comunicacion: false,
        marketing: true,
        ia: false,
        config: false
    })
    const router = useRouter()
    const pathname = usePathname()
    const isDashboard = pathname.startsWith("/dashboard")

    useEffect(() => {
        if (status === "unauthenticated" && isDashboard) {
            router.push("/login")
        }
    }, [status, router, isDashboard])

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

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

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

                <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar relative">
                    <div className="mb-6 space-y-2">
                        <NavLink href="/dashboard" icon={<Globe size={18} />} label="Dashboard" isActive={pathname === '/dashboard'} />
                        <NavLink href="/dashboard/analytics" icon={<LayoutDashboard size={18} />} label="Análisis" isActive={pathname === '/dashboard/analytics'} />
                    </div>

                    <div className="space-y-6">
                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "SALESPERSON" || role === "AFILIADO") && (
                            <>
                                <CollapsibleSection
                                    label="Apps"
                                    isOpen={openSections.operaciones}
                                    onToggle={() => toggleSection('operaciones')}
                                >
                                    {role === "ADMIN" && (
                                        <NavLink href="/dashboard/coordinacion" icon={<Users size={14} />} label="Coordinación" isSubItem />
                                    )}
                                    <NavLink href="/dashboard/quotes" icon={<FileText size={14} />} label="Cotizaciones" isSubItem />
                                    <NavLink href="/dashboard/shop" icon={<ShoppingBag size={14} />} label={role === "ADMIN" ? "Inventario y Precios" : "Lista Precios"} isSubItem />
                                    <NavLink href="/dashboard/map-prospecting" icon={<Map size={14} />} label="Prospección Mapa" isSubItem />
                                </CollapsibleSection>

                                <CollapsibleSection
                                    label="Archivo"
                                    isOpen={openSections.almacenamiento ?? false}
                                    onToggle={() => toggleSection('almacenamiento')}
                                >
                                    <NavLink href="/dashboard/storage" icon={<Database size={14} />} label="Nube" isSubItem />
                                    <NavLink href="/dashboard/documents" icon={<FileText size={14} />} label="Documentos" isSubItem />
                                </CollapsibleSection>

                                <CollapsibleSection
                                    label="WhatsApp CRM"
                                    isOpen={openSections.crm ?? true}
                                    onToggle={() => toggleSection('crm')}
                                >
                                    <NavLink href="/dashboard/whatsapp/crm" icon={<Smartphone size={14} />} label="CRM WhatsApp" isSubItem />
                                    <NavLink href="/dashboard/whatsapp/leads" icon={<Users size={14} />} label="Gestión de Leads" isSubItem />
                                </CollapsibleSection>

                                <CollapsibleSection
                                    label="Finanzas"
                                    isOpen={openSections.finanzas ?? false}
                                    onToggle={() => toggleSection('finanzas')}
                                >
                                    <NavLink href="/dashboard/finance" icon={<DollarSign size={14} />} label="Gestión" isSubItem />
                                </CollapsibleSection>

                                <CollapsibleSection
                                    label="Social Hub"
                                    isOpen={openSections.social ?? true}
                                    onToggle={() => toggleSection('social')}
                                >
                                    <NavLink href="/dashboard/blogs" icon={<Share2 size={14} />} label="Social Command" isSubItem />
                                </CollapsibleSection>

                                <CollapsibleSection
                                    label="Marketing"
                                    isOpen={openSections.marketing ?? false}
                                    onToggle={() => toggleSection('marketing')}
                                >
                                    <NavLink href="/dashboard/marketing" icon={<BarChart3 size={14} />} label="Command" isSubItem />
                                    <NavLink href="/dashboard/benefits" icon={<Tag size={14} />} label="Beneficios" isSubItem />
                                </CollapsibleSection>
                            </>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT") && (
                            <CollapsibleSection
                                label="RRHH"
                                isOpen={openSections.rrhh}
                                onToggle={() => toggleSection('rrhh')}
                            >
                                <NavLink href="/dashboard/evaluations" icon={<Users size={14} />} label="Asesores" isSubItem />
                            </CollapsibleSection>
                        )}

                        <CollapsibleSection
                            label="Inteligencia"
                            isOpen={openSections.ia ?? false}
                            onToggle={() => toggleSection('ia')}
                        >
                            <NavLink href="/dashboard/coach" icon={<BrainCircuit size={14} />} label="AI Coach" isSubItem />
                            <NavLink href="/dashboard/academy" icon={<GraduationCap size={14} />} label="Cursos" isSubItem />
                            <NavLink href="/dashboard/bot-ruta" icon={<Bot size={14} />} label="Bot Ruta" isSubItem />
                            {role === "ADMIN" && (
                                <NavLink href="/dashboard/admin/personal-management" icon={<Users size={14} />} label="Gestión de Personal" isSubItem />
                            )}
                        </CollapsibleSection>


                    </div>
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
            <SellerBotOverlay />
        </div>
    )
}

function NavLink({ href, icon, label, isActive, isSubItem }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean; isSubItem?: boolean }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center space-x-4 px-5 py-3 rounded-xl transition-all duration-300 group relative mx-2 mb-1
                ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]'}
                ${isSubItem ? 'ml-6 text-[9px] border-l border-slate-800 pl-4 py-2' : ''}
            `}
        >
            <span className={`transition-all duration-300 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110' : 'group-hover:text-indigo-400 group-hover:scale-110'}`}>
                {icon}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-300 ${isActive ? 'translate-x-1 text-cyan-100' : 'group-hover:translate-x-1'}`}>
                {label}
            </span>
        </Link>
    )
}

function CollapsibleSection({ label, children, isOpen, onToggle }: { label: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="space-y-1">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-5 py-3 group cursor-pointer transition-all duration-300 hover:bg-slate-800/40 rounded-lg mx-2"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-1 h-3 rounded-full transition-all duration-500 ${isOpen ? 'bg-cyan-400 h-4 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-700 group-hover:bg-indigo-400'}`}></div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.4em] italic transition-all duration-300 group-hover:text-indigo-300 ${isOpen ? 'text-cyan-300' : 'text-slate-500'}`}>
                        {label}
                    </span>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-600 group-hover:text-indigo-400'}`}>
                    <ChevronDown size={12} />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-1 py-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

