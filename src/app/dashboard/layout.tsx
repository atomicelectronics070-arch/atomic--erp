"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit } from "lucide-react"
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
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    const [unreadCount, setUnreadCount] = useState(0)

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
        return <div className="h-screen w-screen flex items-center justify-center bg-white  font-bold text-orange-600 uppercase tracking-widest animate-pulse">ATOMIC...</div>
    }

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const role = session.user?.role

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        operaciones: true,
        rrhh: false,
        comunicacion: true,
        config: false
    })

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <div className="flex h-screen bg-[#fcfcfc] text-neutral-900 overflow-hidden font-sans relative">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 flex flex-col bg-white border-r border-neutral-100/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40
                transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-32 flex flex-col items-center justify-center px-8 border-b border-neutral-50 relative">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-6 right-6 lg:hidden text-neutral-300 hover:text-orange-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <img
                            src="/logo_atomic.jpg"
                            alt="ATOMIC Logo"
                            className="w-32 h-auto object-contain mb-3 grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-[0.4em] ml-1">INDUSTRIES</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5">
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

                    {(role === "ADMIN" || role === "MANAGEMENT" || role === "COORDINATOR" || role === "COORD_ASSISTANT" || role === "SALESPERSON") && (
                        <CollapsibleSection
                            label="Crecimiento"
                            isOpen={openSections.rrhh}
                            onToggle={() => toggleSection('rrhh')}
                        >
                            <NavLink href="/dashboard/evaluations" icon={<CheckSquare size={18} />} label="Rúbricas" />
                            <NavLink href="/dashboard/training" icon={<BrainCircuit size={18} />} label="Tutor IA Cognitivo" />
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
                                className="flex items-center space-x-3 px-4 py-3 rounded-none text-xs font-bold text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all group relative"
                            >
                                <span className="text-neutral-300 group-hover:text-orange-600 transition-colors uppercase"><Mail size={18} /></span>
                                <span className="tracking-wide uppercase font-bold text-[10px]">Mensajería Interna</span>
                                {unreadCount > 0 && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>

                            <NavLink href="/dashboard/whatsapp" icon={<MessageSquare size={18} />} label="Mensajería WhatsApp" />
                            <NavLink href="/dashboard/agenda" icon={<Calendar size={18} />} label="Agenda" />
                            <NavLink href="/dashboard/notes" icon={<Edit3 size={18} />} label="Bloc de Notas" />
                            <Link
                                href="/web"
                                target="_blank"
                                className="flex items-center space-x-3 px-4 py-3 rounded-none text-xs font-bold text-orange-600 hover:bg-orange-50 transition-all group border border-orange-100/30 mt-2"
                            >
                                <ExternalLink size={18} className="uppercase text-orange-600" />
                                <span className="tracking-wide uppercase font-bold text-[10px]">Página Web</span>
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
                </nav>

                <div className="p-6 bg-neutral-50/30 border-t border-neutral-50">
                    <div className="flex items-center space-x-3 mb-6 px-1">
                        <div className="w-10 h-10 rounded-none bg-neutral-900 shadow-lg shadow-neutral-200 text-white flex items-center justify-center font-bold text-xs">
                            {session.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-neutral-800 truncate">{session.user?.name}</p>
                            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                                {role === "COORD_ASSISTANT" ? "ASIST. COORDINACIÓN" : role === "ADMIN" ? "ADMINISTRADOR" : role === "MANAGEMENT" ? "GERENCIA" : role === "COORDINATOR" ? "COORDINADOR" : role === "SALESPERSON" ? "VENDEDOR" : role === "EDITOR" ? "EDITOR" : role}
                            </p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-3 px-3 py-2.5 text-xs font-bold text-neutral-400 hover:text-red-500 rounded-none transition-all hover:bg-red-50">
                        <LogOut size={16} />
                        <span>Finalizar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-100/50 flex items-center justify-between px-6 lg:px-10 shrink-0 z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-neutral-400 hover:text-orange-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="w-1.5 h-1.5 rounded-none bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em]">Plataforma Operativa v2.6.4</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        {(role === "ADMIN" || role === "MANAGEMENT") && (
                            <Link href="/dashboard/admin/settings" className="p-2 rounded-none text-neutral-300 hover:text-orange-600 hover:bg-neutral-50 transition-all">
                                <Settings size={20} />
                            </Link>
                        )}
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#fcfcfc] relative z-0">
                    <div className="mx-auto max-w-7xl p-10 lg:p-14">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

function CollapsibleSection({ label, children, isOpen, onToggle }: { label: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="space-y-0.5">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 pt-6 pb-2 text-[9px] font-bold text-neutral-300 uppercase tracking-[0.2em] hover:text-neutral-500 transition-colors group"
            >
                <span>{label}</span>
                {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-1">
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
            className="flex items-center space-x-3 px-4 py-3 rounded-none text-xs font-bold text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all group"
        >
            <span className="text-neutral-300 group-hover:text-orange-600 transition-colors uppercase">{icon}</span>
            <span className="tracking-wide uppercase font-bold text-[10px]">{label}</span>
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



