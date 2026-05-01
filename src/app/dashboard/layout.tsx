"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot, Globe, BarChart3, GraduationCap, Code2 } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"
import { AISearchBot } from "@/components/ui/AISearchBot"
import { AISearchBot } from "@/components/ui/AISearchBot"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(true)
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
            {/* Background Orbs - Deep Visual Hierarchy */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-none bg-indigo-600/5 blur-[120px] animate-pulse transition-all duration-10000" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-none bg-pink-600/5 blur-[120px] animate-pulse transition-all duration-7000" />
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-none bg-violet-600/5 blur-[100px]" />
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
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Precision Glass Engineering */}
            <aside className={`
                fixed inset-y-0 left-0 w-80 flex flex-col shadow-[10px_0_50px_rgba(0,0,0,0.5)] glass-panel !bg-slate-950/40 !border-r !border-white/5 z-40
                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-40 flex flex-col items-center justify-center px-10 border-b border-white/5 relative group bg-white/[0.02]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-8 right-8 text-slate-500 hover:text-primary transition-all hover:rotate-90 z-10"
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
                            <div className="w-1.5 h-1.5 rounded-none bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic">ATOMIC SOLUTIONS</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-8 py-12 space-y-4 custom-scrollbar relative">
                    <div className="mb-10 space-y-4">
                        <NavLink href="/dashboard" icon={<Globe size={20} />} label="Red Social Corporativa" isActive={pathname === '/dashboard'} />
                        <NavLink href="/dashboard/analytics" icon={<LayoutDashboard size={20} />} label="Centro de AnÃ¡lisis" isActive={pathname === '/dashboard/analytics'} />
                    </div>

                    <div className="space-y-10">
                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "SALESPERSON" || role === "AFILIADO") && (
                            <CollapsibleSection
                                label="Operaciones"
                                isOpen={openSections.operaciones}
                                onToggle={() => toggleSection('operaciones')}
                            >
                                <NavLink href="/dashboard/quotes" icon={<FileText size={16} />} label="Cotizaciones" isSubItem />
                                <NavLink href="/dashboard/prices" icon={<Tag size={16} />} label="Lista de Precios" isSubItem />
                                <NavLink href="/dashboard/shop" icon={<ShoppingBag size={16} />} label="Inventario" isSubItem />
                                <NavLink href="/dashboard/storage" icon={<Database size={16} />} label="Centro de Archivos" isSubItem />
                                <NavLink href="/dashboard/documents" icon={<FileText size={16} />} label="Emisión de Documentos" isSubItem />
                                <NavLink href="/dashboard/crm" icon={<Users size={16} />} label="GestiÃ³n CRM" isSubItem />
                                <NavLink href="/dashboard/finance" icon={<DollarSign size={16} />} label="Finanzas" isSubItem />
                                <NavLink href="/dashboard/contracts" icon={<CheckSquare size={16} />} label="Legales y Contratos" isSubItem />
                                <NavLink href="/dashboard/quarterly" icon={<Calendar size={16} />} label="Plan Trimestral" isSubItem />
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT" || role === "SALESPERSON" || role === "EDITOR" || role === "AFILIADO") && (
                            <CollapsibleSection
                                label="Cerebro IA"
                                isOpen={openSections.ia}
                                onToggle={() => toggleSection('ia')}
                            >
                                <NavLink href="/dashboard/training" icon={<BrainCircuit size={16} />} label="IA Asistente" isSubItem />
                                <NavLink href="/dashboard/software" icon={<Code2 size={16} />} label="Desarrollo Software" isSubItem />
                                <NavLink href="/academy" icon={<GraduationCap size={16} />} label="Academia Pública" isSubItem />
                                {(role === "ADMIN" || role === "MANAGEMENT") && (
                                    <NavLink href="/dashboard/academy" icon={<GraduationCap size={16} />} label="Gestión Academia" isSubItem />
                                )}
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT" || role === "SALESPERSON") && (role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR") && (
                            <CollapsibleSection
                                label="Recursos Humanos"
                                isOpen={openSections.rrhh}
                                onToggle={() => toggleSection('rrhh')}
                            >
                                <NavLink href="/dashboard/evaluations" icon={<Users size={16} />} label="Creación de Perfiles" isSubItem />
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT" || role === "SALESPERSON" || role === "AFILIADO") && (
                            <CollapsibleSection
                                label="Comunicación"
                                isOpen={openSections.comunicacion}
                                onToggle={() => toggleSection('comunicacion')}
                            >
                                <Link
                                    href="/dashboard/messages"
                                    className="flex items-center space-x-4 px-5 py-3 ml-4 border-l border-white/5 pl-6 rounded-none text-[10px] font-black text-slate-500 hover:bg-white/5 hover:text-white transition-all group relative italic"
                                >
                                    <Mail size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
                                    <span className="tracking-[0.2em] uppercase">MensajerÃ­a_Env</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-none shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <NavLink href="/dashboard/whatsapp" icon={<MessageSquare size={16} />} label="Mensajería" isSubItem />
                                <NavLink href="/dashboard/agenda" icon={<Calendar size={16} />} label="Agenda" isSubItem />
                                <NavLink href="/dashboard/notes" icon={<Edit3 size={16} />} label="Bloc Notas" isSubItem />
                                <NavLink href="/dashboard/blogs" icon={<FileText size={16} />} label="Blog Corporativo" isSubItem />
                                
                                <div className="px-5 pt-4">
                                    <Link
                                        href="/web"
                                        target="_blank"
                                        className="flex items-center space-x-4 px-4 py-3 rounded-none text-[9px] font-black text-primary hover:bg-primary/10 transition-all group border border-primary/20 bg-primary/5 italic shadow-2xl shadow-primary/5"
                                    >
                                        <ExternalLink size={16} className="text-primary group-hover:rotate-12 transition-transform" />
                                        <span className="tracking-[0.2em] uppercase">PÃ¡gina PÃºblica</span>
                                    </Link>
                                </div>
                            </CollapsibleSection>
                        )}

                        {(role === "ADMIN" || role === "MANAGEMENT") && (
                            <CollapsibleSection
                                label="ConfiguraciÃ³n"
                                isOpen={openSections.config}
                                onToggle={() => toggleSection('config')}
                            >
                                <NavLink href="/dashboard/admin/prompt" icon={<Settings size={16} />} label="IA Config" isSubItem />
                                <NavLink href="/dashboard/admin/users" icon={<Users size={16} />} label="Mi Equipo" isSubItem />
                            </CollapsibleSection>
                        )}

                        {role === "ADMIN" && (
                            <CollapsibleSection
                                label="Herramientas"
                                isOpen={openSections.herramientas ?? true}
                                onToggle={() => toggleSection('herramientas')}
                            >
                                <NavLink href="/dashboard/scraper" icon={<Bot size={16} />} label="Scraper Pro" isSubItem />
                            </CollapsibleSection>
                        )}
                    </div>
                </nav>

                <div className="p-10 shrink-0 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center space-x-6 mb-10 px-2 transition-all group cursor-default">
                        <div className="w-14 h-14 rounded-none glass-panel !bg-slate-900 border-white/10 shadow-2xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform duration-500 shadow-primary/10 text-white italic">
                            {session.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-white truncate uppercase tracking-tighter italic">{session.user?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1 h-1 rounded-none bg-emerald-500 animate-pulse"></div>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] truncate italic opacity-80">
                                    {role === "COORD_ASSISTANT" ? "ASIST. COORD" : role === "ADMIN" ? "ADMINISTRADOR" : role === "MANAGEMENT" ? "GERENCIA" : role === "COORDINATOR" ? "COORDINADOR" : role === "SALESPERSON" ? "VENDEDOR" : role === "AFILIADO" ? "AFILIADO" : role}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-4 px-5 py-4 text-[10px] font-black text-slate-500 hover:text-red-400 rounded-none transition-all hover:bg-red-500/5 group border border-transparent hover:border-red-500/20 italic">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="uppercase tracking-[0.3em]">Cerrar SesiÃ³n</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Engineering */}
            <main className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-700 ${sidebarOpen ? "lg:ml-80" : ""}`}>
                {/* Precision Glass Header */}
                <header className="h-28 glass-panel !bg-slate-950/40 !border-b !border-white/5 flex items-center justify-between px-10 lg:px-16 shrink-0 z-50 backdrop-blur-3xl shadow-2xl">
                    <div className="flex items-center space-x-10">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-4 glass-panel text-slate-500 hover:text-white transition-all rounded-none shadow-xl hover:scale-105 active:scale-95 border-white/10"
                        >
                            <Menu size={28} />
                        </button>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-4 mb-1">
                                <div className="w-2.5 h-2.5 rounded-none bg-primary shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse"></div>
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic leading-none">SISTEMA ERP</span>
                            </div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] ml-6 opacity-60">Status: Sistema Activo</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-10">
                        <div className="flex items-center gap-4 border-r border-white/5 pr-10">
                            <NotificationBell />
                        </div>
                        {(role === "ADMIN" || role === "MANAGEMENT") && (
                            <Link href="/dashboard/admin/settings" className="p-4 glass-panel text-slate-500 hover:text-primary transition-all rounded-none shadow-xl hover:scale-105 active:scale-95 border-white/10 group">
                                <Settings size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                            </Link>
                        )}
                        <div className="hidden lg:flex flex-col items-end border-l border-white/5 pl-10">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none mb-1">Carga de Datos</span>
                             <span className="text-[11px] font-black text-emerald-400 uppercase tracking-tighter italic">Nivel Ã“ptimo 99.8%</span>
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







