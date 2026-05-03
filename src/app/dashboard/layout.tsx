"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot, Globe, BarChart3, GraduationCap, Code2 } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"
import { AISearchBot } from "@/components/ui/AISearchBot"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        operaciones: false,
        rrhh: false,
        comunicacion: false,
        ia: false,
        config: false
    })
    const router = useRouter()
    const pathname = usePathname()
    const isDashboard = pathname.startsWith("/dashboard")

    useEffect(() => {
        // Solo redirigir a login si estamos intentando acceder a una ruta de dashboard
        if (status === "unauthenticated" && isDashboard) {
            router.push("/login")
        }
    }, [status, router, isDashboard])

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
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#000103] gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-fixed"></div>
                <div className="relative">
                    <div className="w-32 h-32 border border-primary/20 rounded-none animate-[spin_3s_linear_infinite] shadow-[0_0_50px_rgba(99,102,241,0.1)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-2 border-primary animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="font-black text-primary uppercase tracking-[1em] animate-pulse text-[10px] italic">Sincronización Neuronal</div>
                    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-1/2"
                        />
                    </div>
                </div>
            </div>
        )
    }

    const role = session.user?.role

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    return (
        <div className="flex h-screen bg-[#000103] text-white overflow-hidden font-sans relative selection:bg-primary/30 selection:text-white">
            {/* Background Orbs - Optimized */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-secondary/5 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-fixed"></div>
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
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            {/* Sidebar - Precision Glass Engineering */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 flex flex-col glass-panel !bg-slate-950/80 !border-r !border-white/5 z-40
                transition-transform duration-500 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-24 flex flex-col items-center justify-center px-6 border-b border-white/5 relative group bg-white/[0.02]">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-primary transition-all lg:hidden"
                    >
                        <X size={20} />
                    </button>
                    <Link href="/web" target="_blank" className="flex flex-col items-center relative z-10 transition-transform duration-700 group-hover:scale-105 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-none bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse"></div>
                            <span className="text-base font-black text-white uppercase tracking-[0.3em] italic">ATOMIC</span>
                        </div>
                        <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.5em] italic mt-1">SOLUTIONS</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar relative">
                    <div className="mb-6 space-y-2">
                        <NavLink href="/dashboard" icon={<Globe size={18} />} label="Red Social" isActive={pathname === '/dashboard'} />
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
                                    <NavLink href="/dashboard/quotes" icon={<FileText size={14} />} label="Cotizaciones" isSubItem />
                                    <NavLink href="/dashboard/prices" icon={<Tag size={14} />} label="Lista Precios" isSubItem />
                                    <NavLink href="/dashboard/shop" icon={<ShoppingBag size={14} />} label="Inventario" isSubItem />
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
                                    label="CRM"
                                    isOpen={openSections.crm ?? false}
                                    onToggle={() => toggleSection('crm')}
                                >
                                    <NavLink href="/dashboard/crm" icon={<Users size={14} />} label="Clientes" isSubItem />
                                    <NavLink href="/dashboard/whatsapp" icon={<MessageSquare size={14} />} label="WhatsApp" isSubItem />
                                </CollapsibleSection>

                                <CollapsibleSection
                                    label="Finanzas"
                                    isOpen={openSections.finanzas ?? false}
                                    onToggle={() => toggleSection('finanzas')}
                                >
                                    <NavLink href="/dashboard/finance" icon={<DollarSign size={14} />} label="Gestión" isSubItem />
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
                            label="Academia"
                            isOpen={openSections.ia ?? false}
                            onToggle={() => toggleSection('ia')}
                        >
                            <NavLink href="/dashboard/academy" icon={<GraduationCap size={14} />} label="Cursos" isSubItem />
                        </CollapsibleSection>
                    </div>
                </nav>

                <div className="p-6 shrink-0 border-t border-white/5 bg-white/[0.01]">
                    <div className="flex items-center space-x-4 mb-6 px-2">
                        <div className="w-10 h-10 rounded-none border border-white/10 flex items-center justify-center font-black text-sm text-white italic overflow-hidden bg-slate-900">
                            {(session?.user as any)?.profilePicture ? (
                                <img src={(session?.user as any).profilePicture} alt="U" className="w-full h-full object-cover" />
                            ) : (
                                session.user?.name?.[0] || "U"
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black text-white truncate uppercase italic">{session.user?.name}</p>
                            <p className="text-[8px] font-black text-primary uppercase tracking-widest truncate italic opacity-60">
                                {role}
                            </p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 text-[9px] font-black text-slate-500 hover:text-red-400 rounded-none transition-all hover:bg-red-500/5 group italic border border-transparent hover:border-red-500/10">
                        <LogOut size={14} />
                        <span className="uppercase tracking-widest">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Engineering */}
            <main className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-500 ${sidebarOpen ? "lg:ml-64" : ""}`}>
                {/* Precision Glass Header */}
                <header className="h-16 lg:h-20 glass-panel !bg-slate-950/60 !border-b !border-white/5 flex items-center justify-between px-6 lg:px-10 shrink-0 z-50 backdrop-blur-3xl shadow-xl">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-3 glass-panel text-slate-500 hover:text-white transition-all rounded-none border-white/5"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-none bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"></div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">ATOMIC INDUSTRIAS</span>
                            </div>
                        </div>
                        <Link 
                            href="/web" 
                            target="_blank"
                            className="hidden md:flex items-center space-x-2 px-4 py-2 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all rounded-none"
                        >
                            <ExternalLink size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Visitar Web</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center gap-4 pr-6 border-r border-white/5">
                            <NotificationBell />
                        </div>
                        
                        <Link href="/dashboard/profile" className="flex items-center gap-3 p-1 glass-panel !bg-slate-900 border-white/10 hover:scale-105 transition-all group pr-4">
                            <div className="w-8 h-8 bg-slate-950 flex items-center justify-center text-primary overflow-hidden border-r border-white/5">
                                {(session?.user as any)?.profilePicture ? (
                                    <img src={(session?.user as any).profilePicture} alt="P" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                            <Settings size={14} className="text-slate-500 group-hover:rotate-45 transition-transform" />
                        </Link>

                        <div className="hidden lg:flex flex-col items-end border-l border-white/5 pl-6">
                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter italic leading-none">SISTEMA INTERNO</span>
                             <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">v4.0.1</span>
                        </div>
                    </div>
                </header>

                {/* Performance Scrollable Region */}
                <div className="flex-1 overflow-y-auto relative z-0 scrollbar-hide">
                    <div className="mx-auto max-w-[1800px] p-4 lg:p-8 min-h-full">
                        {children}
                    </div>
                </div>
            </main>
            {/* JarvisAI removido temporalmente por petición del usuario */}
        </div>
    )
}

function NavLink({ href, icon, label, isActive, isSubItem }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean; isSubItem?: boolean }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center space-x-4 px-5 py-3 rounded-none transition-all duration-300 group relative
                ${isActive 
                    ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'}
                ${isSubItem ? 'ml-4 border-l border-white/5 pl-6' : ''}
            `}
        >
            <span className={`transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'group-hover:text-primary group-hover:scale-110'}`}>
                {icon}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
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
                className="w-full flex items-center justify-between px-5 py-3 group cursor-pointer transition-all duration-300 hover:bg-white/[0.02]"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-1 h-3 bg-slate-800 transition-all duration-500 ${isOpen ? 'bg-primary h-4' : 'group-hover:bg-slate-600'}`}></div>
                    <span className={`text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic transition-all duration-300 group-hover:text-slate-300 ${isOpen ? 'text-white' : ''}`}>
                        {label}
                    </span>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-700 group-hover:text-slate-400'}`}>
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







