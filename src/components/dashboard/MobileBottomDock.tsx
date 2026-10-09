"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { 
    MessageSquare, Table, Plus, User, Users, Scan, 
    ShoppingBag, Map, GraduationCap, Grid, Wrench, Shield, 
    Layers, Cpu, ChevronUp, X 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TeamContactsModal from "./TeamContactsModal"
import BarcodeScannerModal from "@/components/scanner/BarcodeScannerModal"
import ToolsModal from "@/components/tools/ToolsModal"

function MobileBottomDockInner() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentTab = searchParams ? searchParams.get("tab") : null

    const [showTeamModal, setShowTeamModal] = useState(false)
    const [showScannerModal, setShowScannerModal] = useState(false)
    const [showToolsModal, setShowToolsModal] = useState(false)
    const [showMoreMenu, setShowMoreMenu] = useState(false)

    const isCrmActive = pathname.startsWith("/dashboard/whatsapp")
    const isPricesActive = pathname.startsWith("/dashboard/matriz-precios") || pathname.startsWith("/dashboard/shop") || pathname.startsWith("/dashboard/precios-vendedor")
    const isQuotesActive = pathname.startsWith("/dashboard/quotes")
    const isShopActive = pathname.startsWith("/dashboard/shop") || pathname === "/web"
    const isRadarActive = pathname.startsWith("/dashboard/map-prospecting")
    const isAcademyActive = pathname.startsWith("/dashboard/academy")
    const isScannerActive = pathname.startsWith("/dashboard/scanner") || showScannerModal
    const isThemesActive = pathname === "/dashboard/profile" && currentTab === "themes"
    const isProfileActive = pathname === "/dashboard/profile" && currentTab !== "themes"

    return (
        <>
            <TeamContactsModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} />
            <BarcodeScannerModal isOpen={showScannerModal} onClose={() => setShowScannerModal(false)} />
            <ToolsModal isOpen={showToolsModal} onClose={() => setShowToolsModal(false)} />

            {/* ── POPUP: MÁS MÓDULOS DE ATOMIC (ACCESO RÁPIDO OPERACIONAL) ── */}
            <AnimatePresence>
                {showMoreMenu && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="lg:hidden fixed bottom-20 left-4 right-4 z-50 bg-[#090d1e]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <Grid size={16} className="text-cyan-400" />
                                <span className="text-xs font-mono font-black uppercase text-white tracking-wider">
                                    Módulos Operacionales ATOMIC
                                </span>
                            </div>
                            <button 
                                onClick={() => setShowMoreMenu(false)}
                                className="p-1 rounded-full text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-mono">
                            <Link 
                                href="/dashboard/tecnicos"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                                    <Wrench size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Técnicos</span>
                            </Link>

                            <Link 
                                href="/dashboard/coordinacion"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                                    <Layers size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Coordinación</span>
                            </Link>

                            <Link 
                                href="/dashboard/software"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Cpu size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Software/IA</span>
                            </Link>

                            <Link 
                                href="/dashboard/superadmin"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Shield size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Super Admin</span>
                            </Link>

                            <button 
                                onClick={() => {
                                    setShowMoreMenu(false)
                                    setShowScannerModal(true)
                                }}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                            >
                                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                                    <Scan size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Escáner</span>
                            </button>

                            <Link 
                                href="/dashboard/marketing"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                                    <Users size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Publicidad</span>
                            </Link>

                            <button 
                                type="button"
                                onClick={() => {
                                    setShowMoreMenu(false)
                                    setShowToolsModal(true)
                                }}
                                className="col-span-3 p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-indigo-600/20 to-purple-600/20 border border-cyan-400/40 hover:border-cyan-300 flex items-center justify-between px-4 transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-950/40"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-xl bg-cyan-400 text-black">
                                        <Wrench size={16} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-white">Caja de Herramientas</div>
                                        <div className="text-[9px] text-cyan-300 font-mono">Descargador YouTube & Bot Personal</div>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-cyan-400 text-black uppercase">
                                    PRO
                                </span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── EXPANDED MOBILE BOTTOM DOCK (MÁS DE 2 OPCIONES POR LADO) ── */}
            <nav 
                aria-label="Navegación Móvil Rápida Expandida"
                className="lg:hidden fixed bottom-2.5 left-2 right-2 z-40 select-none"
            >
                <div className="relative mx-auto max-w-lg rounded-[26px] border border-white/10 bg-[#090d1e]/95 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.9)] px-1 py-1 flex items-center justify-between overflow-visible">
                    
                    {/* ══ LADO IZQUIERDO: 4 OPCIONES ══ */}
                    
                    {/* 1. CRM WhatsApp */}
                    <Link
                        href="/dashboard/whatsapp/crm"
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isCrmActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                            <MessageSquare size={16} className={isCrmActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                        </div>
                        <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isCrmActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                            CRM
                        </span>
                        {isCrmActive && (
                            <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full theme-dot mt-0.5" />
                        )}
                    </Link>

                    {/* 2. Matriz de Precios */}
                    <Link
                        href="/dashboard/matriz-precios"
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isPricesActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                            <Table size={16} className={isPricesActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                        </div>
                        <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isPricesActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                            Precios
                        </span>
                        {isPricesActive && (
                            <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full theme-dot mt-0.5" />
                        )}
                    </Link>

                    {/* 3. Escáner de Códigos de Barras Móvil */}
                    <button
                        type="button"
                        onClick={() => setShowScannerModal(true)}
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer"
                        title="Escanear Código de Barras con la Cámara"
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isScannerActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                            <Scan size={16} className={isScannerActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                        </div>
                        <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isScannerActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                            Escáner
                        </span>
                    </button>

                    {/* 4. Tienda / Catálogo */}
                    <Link
                        href="/web"
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isShopActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                            <ShoppingBag size={16} className={isShopActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                        </div>
                        <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isShopActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                            Tienda
                        </span>
                    </Link>

                    {/* ══ CENTRO: BOTÓN DESTACADO COTIZAR (+) NO CORTADO ══ */}
                    <div className="relative -top-4 px-1 shrink-0 z-20 flex flex-col items-center">
                        <Link
                            href="/dashboard/quotes"
                            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 flex items-center justify-center text-white border-2 border-white/30 shadow-[0_0_25px_rgba(249,115,22,0.6)] active:scale-90 transition-transform cursor-pointer group"
                            title="Hacer Cotización"
                        >
                            <Plus size={24} strokeWidth={2.8} className="group-hover:rotate-90 transition-transform duration-200" />
                        </Link>
                        <span className="block text-center text-[8px] font-black uppercase tracking-wider text-amber-300 mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            Cotizar
                        </span>
                    </div>

                    {/* ══ LADO DERECHO: 4 OPCIONES ══ */}

                    {/* 5. Radar / Prospección */}
                    <Link
                        href="/dashboard/map-prospecting"
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isRadarActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                            <Map size={16} className={isRadarActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                        </div>
                        <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isRadarActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                            Radar
                        </span>
                    </Link>

                    {/* 6. Equipo */}
                    <button
                        onClick={() => setShowTeamModal(true)}
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer"
                    >
                        <div className="p-1.5 rounded-xl transition-colors text-slate-400 group-hover:text-cyan-400">
                            <Users size={16} className="stroke-[1.8]" />
                        </div>
                        <span className="text-[8px] font-bold tracking-tight mt-0.5 text-slate-400 group-hover:text-cyan-300">
                            Equipo
                        </span>
                    </button>

                    {/* 7. Perfil */}
                    <Link
                        href="/dashboard/profile"
                        className="flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${isProfileActive || isThemesActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                            <User size={16} className={isProfileActive || isThemesActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                        </div>
                        <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isProfileActive || isThemesActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                            Perfil
                        </span>
                    </Link>

                    {/* 8. Más Módulos Drawer */}
                    <button
                        onClick={() => setShowMoreMenu(prev => !prev)}
                        className={`flex-1 min-w-[38px] flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer ${showMoreMenu ? 'text-cyan-400' : 'text-slate-400'}`}
                    >
                        <div className="p-1.5 rounded-xl transition-colors text-slate-400 group-hover:text-cyan-400">
                            <Grid size={16} className="stroke-[1.8]" />
                        </div>
                        <span className="text-[8px] font-bold tracking-tight mt-0.5 text-slate-400 group-hover:text-cyan-300">
                            Más
                        </span>
                    </button>

                </div>
            </nav>
        </>
    )
}

export default function MobileBottomDock() {
    return (
        <Suspense fallback={null}>
            <MobileBottomDockInner />
        </Suspense>
    )
}
