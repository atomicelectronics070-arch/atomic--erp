"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
    MessageSquare, Table, Plus, User, Users, Scan, 
    ShoppingBag, Map, GraduationCap, Grid, Wrench, Shield, 
    Layers, Cpu, ChevronUp, X, Home, Flame, CalendarCheck, Globe, CheckSquare,
    KeyRound, ShieldAlert, Sparkles, Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TeamContactsModal from "./TeamContactsModal"
import BarcodeScannerModal from "@/components/scanner/BarcodeScannerModal"
import ToolsModal from "@/components/tools/ToolsModal"
import RutaDelDiaWorkspace from "@/components/tools/RutaDelDiaWorkspace"
import BajoComisionModal from "@/components/coordinacion/BajoComisionModal"
import EquipoAsistenciasModal from "@/components/coordinacion/EquipoAsistenciasModal"
import GestorCuentasModal from "@/components/coordinacion/GestorCuentasModal"

function MobileBottomDockInner() {
    const { data: session } = useSession()
    const userRole = String((session?.user as any)?.role || "SALESPERSON").toUpperCase()
    const isAdministrative = userRole.includes("ADMIN") || userRole.includes("COORDINATOR") || userRole.includes("MANAGEMENT")

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentTab = searchParams ? searchParams.get("tab") : null

    const [showTeamModal, setShowTeamModal] = useState(false)
    const [showScannerModal, setShowScannerModal] = useState(false)
    const [showToolsModal, setShowToolsModal] = useState(false)
    const [showRutaModal, setShowRutaModal] = useState(false)
    const [toolsInitialTab, setToolsInitialTab] = useState<any>("grid")
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [showBajoComisionModal, setShowBajoComisionModal] = useState(false)
    const [showEquipoAsistenciasModal, setShowEquipoAsistenciasModal] = useState(false)
    const [showGestorCuentasModal, setShowGestorCuentasModal] = useState(false)
    const [quickClockLoading, setQuickClockLoading] = useState(false)
    const [quickClockToast, setQuickClockToast] = useState<string | null>(null)

    const handleQuickClock = async () => {
        setQuickClockLoading(true)
        try {
            const res = await fetch("/api/admin/attendance-team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "quick_clock" })
            })
            const data = await res.json()
            if (data.success) {
                setQuickClockToast(`✅ ${data.message}`)
                setTimeout(() => setQuickClockToast(null), 3500)
            } else {
                alert(data.error || "No se pudo registrar asistencia rápida")
            }
        } catch (e: any) {
            alert(e.message || "Error al registrar asistencia")
        } finally {
            setQuickClockLoading(false)
        }
    }

    const isCrmActive = pathname.startsWith("/dashboard/whatsapp")
    const isAsistenciaActive = pathname.startsWith("/dashboard/asistencia")
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
            <ToolsModal isOpen={showToolsModal} onClose={() => setShowToolsModal(false)} initialTab={toolsInitialTab} />
            <RutaDelDiaWorkspace isOpen={showRutaModal} onClose={() => setShowRutaModal(false)} />
            <BajoComisionModal isOpen={showBajoComisionModal} onClose={() => setShowBajoComisionModal(false)} advisorName={session?.user?.name || "Asesor"} />
            <EquipoAsistenciasModal isOpen={showEquipoAsistenciasModal} onClose={() => setShowEquipoAsistenciasModal(false)} />
            <GestorCuentasModal isOpen={showGestorCuentasModal} onClose={() => setShowGestorCuentasModal(false)} />

            {/* Quick Clock Floating Toast */}
            {quickClockToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-60 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
                    <CheckSquare size={16} />
                    <span>{quickClockToast}</span>
                </div>
            )}

            {/* ── POPUP: MÁS MÓDULOS DE ATOMIC (ACCESO RÁPIDO OPERACIONAL) ── */}
            <AnimatePresence>
                {showMoreMenu && (
                    <>
                        {/* Backdrop to close when clicking outside */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMoreMenu(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 cursor-pointer"
                        />

                        <motion.div 
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="fixed bottom-20 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-55 bg-[#090d1e]/98 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_60px_rgba(0,0,0,0.95)] space-y-4 max-h-[80vh] overflow-y-auto"
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
                            {/* ── BOTÓN OFICIAL: ASISTENCIA RÁPIDA (UNIVERSAL PARA TODOS LOS PERFILES LOGUEADOS) ── */}
                            <button 
                                type="button"
                                disabled={quickClockLoading}
                                onClick={handleQuickClock}
                                className="col-span-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white border-2 border-emerald-300 hover:border-white flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/60 transition-all active:scale-98 cursor-pointer group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-black/30 text-white">
                                        <Clock size={18} className={quickClockLoading ? "animate-spin" : "stroke-[2.5]"} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                                            <span>Asistencia Rápida</span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-emerald-300 font-bold">1 CLIC</span>
                                        </div>
                                        <div className="text-[10px] text-emerald-100 font-medium">
                                            Timbra tu jornada diaria al instante (Entrada / Salida)
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono px-2.5 py-1 rounded-full bg-white text-emerald-950 font-black uppercase shrink-0 shadow-md">
                                    {quickClockLoading ? "TIMBRANDO..." : "TIMBRAR"}
                                </span>
                            </button>

                            {/* ── BOTÓN: BAJO COMISIÓN (REGLAMENTO CONDICIONANTE) ── */}
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowMoreMenu(false)
                                    setShowBajoComisionModal(true)
                                }}
                                className="p-3 rounded-2xl bg-gradient-to-b from-amber-500/25 to-orange-600/25 border-2 border-amber-400/80 hover:border-amber-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-950/50"
                            >
                                <div className="p-2 rounded-xl bg-amber-500 text-black shadow-md">
                                    <ShieldAlert size={18} className="stroke-[2.5]" />
                                </div>
                                <span className="text-amber-200 font-extrabold">Bajo Comisión</span>
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-black uppercase">REGLAMENTO</span>
                            </button>

                            {/* Si es administrativo: Asistencias de Equipo y Gestor de Cuentas */}
                            {isAdministrative && (
                                <>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowMoreMenu(false)
                                            setShowEquipoAsistenciasModal(true)
                                        }}
                                        className="p-3 rounded-2xl bg-gradient-to-b from-cyan-500/25 to-blue-600/25 border-2 border-cyan-400/80 hover:border-cyan-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-950/50"
                                    >
                                        <div className="p-2 rounded-xl bg-cyan-400 text-black shadow-md">
                                            <CalendarCheck size={18} className="stroke-[2.5]" />
                                        </div>
                                        <span className="text-cyan-200 font-extrabold">Ajustar Asistencias</span>
                                        <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-400 text-black font-black uppercase">EQUIPO</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowMoreMenu(false)
                                            setShowGestorCuentasModal(true)
                                        }}
                                        className="p-3 rounded-2xl bg-gradient-to-b from-amber-500/25 to-yellow-600/25 border-2 border-amber-400/80 hover:border-amber-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-950/50"
                                    >
                                        <div className="p-2 rounded-xl bg-amber-400 text-black shadow-md">
                                            <KeyRound size={18} className="stroke-[2.5]" />
                                        </div>
                                        <span className="text-amber-200 font-extrabold">Gestor Cuentas</span>
                                        <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-black uppercase">DELEGACIÓN</span>
                                    </button>
                                </>
                            )}
                            {/* 0. Ruta del Día (Tile Cuadrado Destacado) */}
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowMoreMenu(false)
                                    setShowRutaModal(true)
                                }}
                                className="p-3 rounded-2xl bg-gradient-to-b from-emerald-500/25 to-teal-600/25 border-2 border-emerald-400/80 hover:border-emerald-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-950/50"
                            >
                                <div className="p-2 rounded-xl bg-emerald-500 text-black shadow-md">
                                    <CalendarCheck size={18} className="stroke-[2.5]" />
                                </div>
                                <span className="text-emerald-200 font-extrabold">Ruta del Día</span>
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500 text-black font-black uppercase">PLAN DIARIO</span>
                            </button>

                            {/* 1. Suicide Squad War Room (Tile Cuadrado Destacado) */}
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowMoreMenu(false)
                                    setToolsInitialTab("suicide_squad")
                                    setShowToolsModal(true)
                                }}
                                className="p-3 rounded-2xl bg-gradient-to-b from-rose-500/25 to-red-600/25 border-2 border-rose-400/80 hover:border-rose-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-rose-950/50"
                            >
                                <div className="p-2 rounded-xl bg-rose-500 text-black shadow-md">
                                    <Flame size={18} className="stroke-[2.5]" />
                                </div>
                                <span className="text-rose-200 font-extrabold">Suicide Squad</span>
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500 text-black font-black uppercase">5 SQUADS</span>
                            </button>

                            {/* 2. Herramientas PRO (Tile Cuadrado Destacado) */}
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowMoreMenu(false)
                                    setToolsInitialTab("grid")
                                    setShowToolsModal(true)
                                }}
                                className="p-3 rounded-2xl bg-gradient-to-b from-cyan-500/25 to-indigo-600/25 border-2 border-cyan-400/70 hover:border-cyan-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-950/50"
                            >
                                <div className="p-2 rounded-xl bg-cyan-400 text-black shadow-md">
                                    <Wrench size={18} className="stroke-[2.5]" />
                                </div>
                                <span className="text-cyan-200 font-extrabold">Herramientas</span>
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-400 text-black font-black uppercase">12 PRO</span>
                            </button>

                            {/* 3. Landings ATOMIC 2026 (Acceso Rápido Oficial) */}
                            <Link 
                                href="/bienvenida/categoria"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-gradient-to-b from-blue-500/25 to-indigo-600/25 border-2 border-blue-400/80 hover:border-blue-300 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-950/50"
                            >
                                <div className="p-2 rounded-xl bg-blue-500 text-white shadow-md">
                                    <Globe size={18} className="stroke-[2.5]" />
                                </div>
                                <span className="text-blue-200 font-extrabold">Landings 2026</span>
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500 text-white font-black uppercase">11 CATEGORÍAS</span>
                            </Link>

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

                            <Link 
                                href="/dashboard/academy"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <GraduationCap size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Academia</span>
                            </Link>

                            <Link 
                                href="/web"
                                target="_blank"
                                onClick={() => setShowMoreMenu(false)}
                                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                            >
                                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                                    <ShoppingBag size={18} />
                                </div>
                                <span className="text-slate-200 font-bold">Tienda Web</span>
                            </Link>
                        </div>
                    </motion.div>
                </>
                )}
            </AnimatePresence>

            {/* ── EXPANDED MOBILE & DESKTOP BOTTOM DOCK (SIGUE A TODO LADO) ── */}
            {/* ── EXPANDED MOBILE & DESKTOP BOTTOM DOCK (SIGUE A TODO LADO) ── */}
            <nav 
                aria-label="Navegación Rápida Expandida ATOMIC"
                className="fixed bottom-2.5 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-40 select-none"
            >
                <div className="relative mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-[#090d1e]/95 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.95)] px-1.5 py-1 flex items-center justify-between overflow-visible">
                    
                    {/* ══ ALA IZQUIERDA: ESPACIADO SIMÉTRICO Y UNIFORME ══ */}
                    <div className="flex-1 flex items-center justify-around">
                        
                        {/* 0. Inicio / Home */}
                        <Link
                            href="/dashboard"
                            className="flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                            title="Inicio Dashboard"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${pathname === '/dashboard' ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-400 group-hover:text-white'}`}>
                                <Home size={16} className={pathname === '/dashboard' ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${pathname === '/dashboard' ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                                Inicio
                            </span>
                            {pathname === '/dashboard' && (
                                <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
                            )}
                        </Link>

                        {/* 1. CRM WhatsApp (Solo Administrativos) o Inicio del Día (Ventas) */}
                        {isAdministrative ? (
                            <Link
                                href="/dashboard/whatsapp/crm"
                                className="flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                                title="CRM WhatsApp Oficial"
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
                        ) : (
                            <Link
                                href="/dashboard/asistencia"
                                className="flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                                title="Inicio del Día (Asistencia & Metas)"
                            >
                                <div className={`p-1.5 rounded-xl transition-colors ${isAsistenciaActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-400 group-hover:text-emerald-200'}`}>
                                    <CalendarCheck size={16} className={isAsistenciaActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                                </div>
                                <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isAsistenciaActive ? 'text-white' : 'text-emerald-400'}`}>
                                    Inicio Día
                                </span>
                                {isAsistenciaActive && (
                                    <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
                                )}
                            </Link>
                        )}

                        {/* 2. Matriz de Precios */}
                        <Link
                            href="/dashboard/matriz-precios"
                            className="flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                            title="Matriz de Precios"
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

                        {/* 3. Tienda / Catálogo (Visible en pantallas medianas+) */}
                        <Link
                            href="/web"
                            className="hidden sm:flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                            title="Tienda Web Oficial"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isShopActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                                <ShoppingBag size={16} className={isShopActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isShopActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                                Tienda
                            </span>
                        </Link>

                        {/* 4. Radar / Prospección (Visible en pantallas medianas+) */}
                        <Link
                            href="/dashboard/map-prospecting"
                            className="hidden sm:flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                            title="Radar de Clientes en Mapa"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isRadarActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                                <Map size={16} className={isRadarActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isRadarActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                                Radar
                            </span>
                        </Link>

                    </div>

                    {/* ══ CENTRO MATEMÁTICO: SLOT EXCLUSIVO RESERVADO PARA BOTÓN FLOTANTE COTIZAR (+) ══ */}
                    <div className="relative flex flex-col items-center justify-end shrink-0 w-14 sm:w-16 px-0.5 z-30 pointer-events-auto">
                        <Link
                            href="/dashboard/quotes"
                            onClick={() => {
                                if (pathname === "/dashboard/quotes" || pathname.startsWith("/dashboard/quotes")) {
                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                }
                            }}
                            className="w-12 h-12 sm:w-14 sm:h-14 -mt-6 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 flex items-center justify-center text-white border-2 border-white/50 shadow-[0_0_25px_rgba(249,115,22,0.7)] active:scale-90 transition-transform cursor-pointer group"
                            title="Hacer Nueva Cotización Oficial PROP"
                        >
                            <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-200" />
                        </Link>
                        <span className="block text-center text-[8px] font-black uppercase tracking-wider text-amber-300 mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] whitespace-nowrap">
                            Cotizar
                        </span>
                    </div>

                    {/* ══ ALA DERECHA: ESPACIADO SIMÉTRICO Y UNIFORME ══ */}
                    <div className="flex-1 flex items-center justify-around">

                        {/* 5. Escáner de Códigos de Barras Móvil */}
                        <button
                            type="button"
                            onClick={() => setShowScannerModal(true)}
                            className="flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer"
                            title="Escanear Código de Barras con la Cámara"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isScannerActive ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                                <Scan size={16} className={isScannerActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isScannerActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                                Escáner
                            </span>
                        </button>

                        {/* 6. Inicio del Día (Asistencia & Metas Diarias) */}
                        <Link
                            href="/dashboard/asistencia"
                            className="flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer"
                            title="Inicio del Día: Registro diario de Asistencia, Llamadas, Publicaciones, Grupos y Estados"
                        >
                            <div className="p-1.5 rounded-xl transition-colors bg-gradient-to-br from-emerald-500/25 to-teal-500/25 text-emerald-300 group-hover:text-emerald-100 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                                <CalendarCheck size={16} className="stroke-[2.2]" />
                            </div>
                            <span className="text-[8px] font-black tracking-tight mt-0.5 text-emerald-300 group-hover:text-white truncate">
                                Inicio Día
                            </span>
                        </Link>

                        {/* 7. Equipo / Contactos (Visible en pantallas medianas+) */}
                        <button
                            type="button"
                            onClick={() => setShowTeamModal(true)}
                            className="hidden sm:flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer"
                            title="Contactos del Equipo"
                        >
                            <div className="p-1.5 rounded-xl transition-colors text-slate-400 group-hover:text-cyan-400">
                                <Users size={16} className="stroke-[1.8]" />
                            </div>
                            <span className="text-[8px] font-bold tracking-tight mt-0.5 text-slate-400 group-hover:text-cyan-300">
                                Equipo
                            </span>
                        </button>

                        {/* 8. Perfil (Visible en pantallas medianas+) */}
                        <Link
                            href="/dashboard/profile"
                            className="hidden sm:flex flex-col items-center justify-center py-1 transition-all group active:scale-90"
                            title="Mi Perfil"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isProfileActive || isThemesActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                                <User size={16} className={isProfileActive || isThemesActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isProfileActive || isThemesActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                                Perfil
                            </span>
                        </Link>

                        {/* 9. Más Módulos Drawer */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowMoreMenu(prev => !prev)
                            }}
                            className={`flex flex-col items-center justify-center py-1 transition-all group active:scale-90 cursor-pointer ${showMoreMenu ? 'text-cyan-400' : 'text-slate-400'}`}
                            title="Más módulos y herramientas operativas"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${showMoreMenu ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`}>
                                <Grid size={16} className="stroke-[1.8]" />
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${showMoreMenu ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-cyan-300'}`}>
                                Más
                            </span>
                        </button>

                    </div>

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
