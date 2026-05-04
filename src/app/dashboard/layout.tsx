"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, FileText, Settings, LogOut, CheckSquare, Sun, Moon, LayoutDashboard, Tag, Database, MessageSquare, ExternalLink, ShoppingBag, Menu, X, Calendar, Edit3, Mail, BrainCircuit, Bot, Globe, BarChart3, GraduationCap, Code2, User, Smartphone, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"
import { AISearchBot } from "@/components/ui/AISearchBot"
import { motion, AnimatePresence } from "framer-motion"

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
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-8 relative overflow-hidden">
                <div className="relative">
                    <div className="w-32 h-32 border border-[#1E3A8A]/20 animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-2 border-[#1E3A8A] animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="font-black text-[#1E3A8A] uppercase tracking-[1em] animate-pulse text-[10px] italic">Sincronización Operativa</div>
                </div>
            </div>
        )
    }

    const role = session.user?.role

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden font-sans relative selection:bg-[#1E3A8A]/10 selection:text-[#1E3A8A]">
            
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Executive White/Navy */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 flex flex-col bg-white border-r border-slate-200 z-40
                transition-transform duration-500 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            `}>
                <div className="h-24 flex flex-col items-center justify-center px-6 border-b border-slate-100 relative group">
                    <Link href="/web" target="_blank" className="flex flex-col items-center relative z-10 transition-transform duration-700 group-hover:scale-105 cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#1E3A8A]"></div>
                            <span className="text-base font-black text-[#0F172A] uppercase tracking-[0.3em] italic">ATOMIC</span>
                        </div>
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.5em] italic mt-1">SOLUTIONS</span>
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
                                    label="WhatsApp CRM"
                                    isOpen={openSections.crm ?? true}
                                    onToggle={() => toggleSection('crm')}
                                >
                                    <NavLink href="/dashboard/whatsapp-crm" icon={<Smartphone size={14} />} label="Centro de Control" isSubItem />
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
                        </CollapsibleSection>
                    </div>
                </nav>

                <div className="p-6 shrink-0 border-t border-slate-100 bg-slate-50/30">
                    <div className="flex items-center space-x-4 mb-6 px-2">
                        <div className="w-10 h-10 border border-slate-200 flex items-center justify-center font-black text-sm text-[#0F172A] italic overflow-hidden bg-white">
                            {(session?.user as any)?.profilePicture ? (
                                <img src={(session?.user as any).profilePicture} alt="U" className="w-full h-full object-cover" />
                            ) : (
                                session.user?.name?.[0] || "U"
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black text-[#0F172A] truncate uppercase italic">{session.user?.name}</p>
                            <p className="text-[8px] font-black text-[#1E3A8A] uppercase tracking-widest truncate italic">
                                {role}
                            </p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 text-[9px] font-black text-slate-400 hover:text-red-500 rounded-none transition-all hover:bg-red-50/5 group italic border border-transparent">
                        <LogOut size={14} />
                        <span className="uppercase tracking-widest">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-500 lg:ml-64`}>
                {/* Header */}
                <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 z-50 shadow-sm">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-3 bg-slate-50 text-slate-400 hover:text-[#1E3A8A] transition-all lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#1E3A8A]"></div>
                                <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.3em] italic">ATOMIC INDUSTRIAS</span>
                            </div>
                        </div>
                        <Link 
                            href="/web" 
                            target="_blank"
                            className="hidden md:flex items-center space-x-2 px-4 py-2 border border-slate-200 hover:border-[#1E3A8A] text-slate-500 hover:text-[#1E3A8A] transition-all"
                        >
                            <ExternalLink size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Visitar Web</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
                            <NotificationBell />
                        </div>
                        
                        <Link href="/dashboard/profile" className="flex items-center gap-3 p-1 bg-slate-50 border border-slate-200 hover:border-[#1E3A8A] transition-all group pr-4">
                            <div className="w-8 h-8 bg-white flex items-center justify-center text-[#1E3A8A] overflow-hidden border-r border-slate-100">
                                {(session?.user as any)?.profilePicture ? (
                                    <img src={(session?.user as any).profilePicture} alt="P" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                            <Settings size={14} className="text-slate-400 group-hover:rotate-45 transition-transform" />
                        </Link>

                        <div className="hidden lg:flex flex-col items-end border-l border-slate-100 pl-6">
                             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter italic leading-none">SISTEMA ACTIVO</span>
                             <span className="text-[7px] text-slate-300 font-black uppercase tracking-widest">v7.0.0</span>
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

function NavLink({ href, icon, label, isActive, isSubItem }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean; isSubItem?: boolean }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center space-x-4 px-5 py-3 rounded-none transition-all duration-300 group relative
                ${isActive 
                    ? 'bg-[#1E3A8A]/5 text-[#1E3A8A] border-r-2 border-[#1E3A8A]' 
                    : 'text-slate-400 hover:text-[#0F172A] hover:bg-slate-50'}
                ${isSubItem ? 'ml-4 border-l border-slate-100 pl-6' : ''}
            `}
        >
            <span className={`transition-all duration-300 ${isActive ? 'text-[#1E3A8A] scale-110' : 'group-hover:text-[#1E3A8A] group-hover:scale-110'}`}>
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
                className="w-full flex items-center justify-between px-5 py-3 group cursor-pointer transition-all duration-300 hover:bg-slate-50"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-1 h-3 bg-slate-200 transition-all duration-500 ${isOpen ? 'bg-[#1E3A8A] h-4' : 'group-hover:bg-slate-400'}`}></div>
                    <span className={`text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic transition-all duration-300 group-hover:text-[#0F172A] ${isOpen ? 'text-[#0F172A]' : ''}`}>
                        {label}
                    </span>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-300 group-hover:text-slate-500'}`}>
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
