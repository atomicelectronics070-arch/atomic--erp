"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [darkMode, setDarkMode] = useState(false)
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
            // Polling every minute
            const interval = setInterval(fetchUnread, 60000)
            return () => clearInterval(interval)
        }
    }, [session])

    if (status === "loading" || !session) {
        return <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] gap-8">
            <div className="w-24 h-24 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin shadow-[0_0_50px_rgba(255,99,71,0.2)]"></div>
            <div className="font-black text-secondary uppercase tracking-[0.8em] animate-pulse text-xs">Sincronizando Nodo Central...</div>
        </div>
    }

    const role = session.user?.role


    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <div className="flex h-screen bg-mesh text-white overflow-hidden font-sans relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-tomato-500/5 blur-[120px]" />
            </div>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-72 flex flex-col glass-panel !bg-slate-950/40 !border-r !border-white/5 z-40
                transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-32 flex flex-col items-center justify-center px-8 border-b border-white/5 relative bg-white/5">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-6 right-6 lg:hidden text-slate-400 hover:text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <img
                            src="/logo_atomic.jpg"
                            alt="ATOMIC Logo"
                            className="w-32 h-auto object-contain mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-1">INDUSTRIES</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-6 py-10 space-y-2 scrollbar-hide">
                    <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Centro de Control" />

                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "SALESPERSON") && (
                        <CollapsibleSection
                            label="Operaciones"
                            isOpen={openSections.operaciones}
                            onToggle={() => toggleSection('operaciones')}
                        >
                            <NavLink href="/dashboard/quotes" icon={<FileText size={18} />} label="Cotizaciones" />
                            <NavLink href="/dashboard/prices" icon={<Tag size={18} />} label="Lista de Precios" />
                            <NavLink href="/dashboard/shop" icon={<ShoppingBag size={18} />} label="Configurar Tienda" />
                            <NavLink href="/dashboard/storage" icon={<Database size={18} />} label="Banco de Almacenamiento" />
                            <NavLink href="/dashboard/documents" icon={<FileText size={18} />} label="Biblioteca" />
                            <NavLink href="/dashboard/crm" icon={<Users size={18} />} label="Gestión CRM" />
                            <NavLink href="/dashboard/finance" icon={<DollarSign size={18} />} label="Finanzas" />
                            <NavLink href="/dashboard/contracts" icon={<CheckSquare size={18} />} label="Contratos" />
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

                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT" || role === "SALESPERSON") && (
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
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all group relative"
                            >
                                <span className="text-slate-500 group-hover:text-secondary transition-colors uppercase"><Mail size={18} /></span>
                                <span className="tracking-wide uppercase font-bold text-[10px]">Mensajería Interna</span>
                                {unreadCount > 0 && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(255,99,71,0.5)] animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>

                            <NavLink href="/dashboard/whatsapp" icon={<MessageSquare size={18} />} label="Mensajería WhatsApp" />
                            <NavLink href="/dashboard/agenda" icon={<Calendar size={18} />} label="Agenda" />
                            <NavLink href="/dashboard/notes" icon={<Edit3 size={18} />} label="Bloc de Notas" />
                            <NavLink href="/dashboard/blogs" icon={<FileText size={18} />} label="Blogs Corporativos" />
                            <Link
                                href="/web"
                                target="_blank"
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black text-secondary hover:bg-secondary/10 transition-all group border border-secondary/20 mt-4 bg-secondary/5"
                            >
                                <ExternalLink size={18} className="uppercase text-secondary" />
                                <span className="tracking-widest uppercase font-bold text-[10px]">Página Web Pública</span>
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
                            <NavLink href="/dashboard/admin/prompt" icon={<Settings size={18} />} label="Configuración Cognitiva" />
                            <NavLink href="/dashboard/admin/users" icon={<Users size={18} />} label="Equipos" />
                        </CollapsibleSection>
                    )}

                    {role === "ADMIN" && (
                        <CollapsibleSection
                            label="Herramientas"
                            isOpen={openSections.herramientas ?? true}
                            onToggle={() => toggleSection('herramientas')}
                        >
                            <NavLink href="/dashboard/scraper" icon={<Bot size={18} />} label="Scraper Pro AI" />
                        </CollapsibleSection>
                    )}
                </nav>

                <div className="p-8 bg-white/5 border-t border-white/5 mt-auto">
                    <div className="flex items-center space-x-4 mb-8 px-1">
                        <div className="w-12 h-12 rounded-2xl glass-panel !bg-slate-900 border-white/10 shadow-xl text-white flex items-center justify-center font-black text-sm uppercase tracking-tighter shadow-azure-500/10">
                            {session.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-white truncate uppercase tracking-tight">{session.user?.name}</p>
                            <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mt-0.5">
                                {role === "COORD_ASSISTANT" ? "ASIST. COORDINACIÓN" : role === "ADMIN" ? "ADMINISTRADOR" : role === "MANAGEMENT" ? "GERENCIA" : role === "COORDINATOR" ? "COORDINADOR" : role === "SALESPERSON" ? "VENDEDOR" : role === "EDITOR" ? "EDITOR" : role}
                            </p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 text-xs font-black text-slate-500 hover:text-red-400 rounded-xl transition-all hover:bg-red-500/5 group">
                        <LogOut size={16} className="group-hover:translate-x-[-2px] transition-transform" />
                        <span className="uppercase tracking-widest">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                {/* Top Header */}
                <header className="h-20 glass-panel !bg-slate-950/40 !border-b !border-white/5 flex items-center justify-between px-8 lg:px-12 shrink-0 z-10">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-3 glass-panel text-slate-400 hover:text-white transition-colors rounded-xl"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden sm:flex items-center space-x-4">
                            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_15px_rgba(255,99,71,0.6)] animate-pulse"></div>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Sector Operativo v4.0.2 Stable</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <NotificationBell />
                        {(role === "ADMIN" || role === "MANAGEMENT") && (
                            <Link href="/dashboard/admin/settings" className="p-3 glass-panel text-slate-400 hover:text-secondary transition-all rounded-xl hover:scale-105">
                                <Settings size={20} />
                            </Link>
                        )}
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto relative z-0 scrollbar-hide">
                    <div className="mx-auto max-w-7xl p-8 lg:p-12 min-h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

function CollapsibleSection({ label, children, isOpen, onToggle }: { label: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="space-y-1 mt-6">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-slate-400 transition-colors group"
            >
                <span>{label}</span>
                {isOpen ? <ChevronDown size={12} className="text-slate-700" /> : <ChevronRight size={12} className="text-slate-700" />}
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-1 pt-2">
                    {children}
                </div>
            </div>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-4 px-4 py-3.5 rounded-xl text-xs font-black text-slate-400 hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/5 shadow-sm hover:shadow-azure-500/5"
        >
            <span className="text-slate-500 group-hover:text-primary transition-colors">{icon}</span>
            <span className="tracking-widest uppercase font-bold text-[10px]">{label}</span>
        </Link>
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}



