"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { MessageSquare, Table, Plus, User, Palette } from "lucide-react"
import { motion } from "framer-motion"

export default function MobileBottomDock() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get("tab")

    const isCrmActive = pathname.startsWith("/dashboard/whatsapp")
    const isPricesActive = pathname.startsWith("/dashboard/matriz-precios") || pathname.startsWith("/dashboard/shop") || pathname.startsWith("/dashboard/precios-vendedor")
    const isQuotesActive = pathname.startsWith("/dashboard/quotes")
    const isThemesActive = pathname === "/dashboard/profile" && currentTab === "themes"
    const isProfileActive = pathname === "/dashboard/profile" && currentTab !== "themes"

    return (
        <nav 
            aria-label="Navegación Móvil Rápida"
            className="lg:hidden fixed bottom-3 left-3 right-3 z-50 select-none"
        >
            <div className="relative mx-auto max-w-md rounded-[28px] border border-white/10 bg-[#090d1e]/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] px-3 py-2 flex items-center justify-between">
                
                {/* 1. Izquierda 1: WhatsApp CRM */}
                <Link
                    href="/dashboard/whatsapp/crm"
                    className="flex-1 flex flex-col items-center justify-center py-1 transition-all group active:scale-95"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isCrmActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                        <MessageSquare size={20} className={isCrmActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                    </div>
                    <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isCrmActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                        CRM
                    </span>
                    {isCrmActive && (
                        <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full theme-dot mt-0.5" />
                    )}
                </Link>

                {/* 2. Izquierda 2: Matriz de Precios */}
                <Link
                    href="/dashboard/matriz-precios"
                    className="flex-1 flex flex-col items-center justify-center py-1 transition-all group active:scale-95"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isPricesActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                        <Table size={20} className={isPricesActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                    </div>
                    <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isPricesActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                        Precios
                    </span>
                    {isPricesActive && (
                        <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full theme-dot mt-0.5" />
                    )}
                </Link>

                {/* 3. CENTRO: Botón Grande Destacado con "+" para Cotizaciones */}
                <div className="relative -top-5 px-2">
                    <Link
                        href="/dashboard/quotes"
                        className="w-14 h-14 rounded-full theme-btn-primary flex items-center justify-center text-white border-2 border-white/20 shadow-[0_0_25px_var(--theme-glow,rgba(6,182,212,0.5))] active:scale-90 transition-transform cursor-pointer group"
                        title="Hacer Cotización"
                    >
                        <Plus size={28} strokeWidth={2.6} className="group-hover:rotate-90 transition-transform duration-200" />
                    </Link>
                    <span className="block text-center text-[9px] font-black uppercase tracking-wider text-slate-300 mt-1">
                        Cotizar
                    </span>
                </div>

                {/* 4. Derecha 1: Perfil */}
                <Link
                    href="/dashboard/profile"
                    className="flex-1 flex flex-col items-center justify-center py-1 transition-all group active:scale-95"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isProfileActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                        <User size={20} className={isProfileActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                    </div>
                    <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isProfileActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                        Perfil
                    </span>
                    {isProfileActive && (
                        <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full theme-dot mt-0.5" />
                    )}
                </Link>

                {/* 5. Derecha 2: Perfil y Temas */}
                <Link
                    href="/dashboard/profile?tab=themes"
                    className="flex-1 flex flex-col items-center justify-center py-1 transition-all group active:scale-95"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isThemesActive ? 'bg-white/10 theme-text' : 'text-slate-400 group-hover:text-white'}`}>
                        <Palette size={20} className={isThemesActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                    </div>
                    <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isThemesActive ? 'text-white theme-text' : 'text-slate-400'}`}>
                        Temas
                    </span>
                    {isThemesActive && (
                        <motion.div layoutId="dock-dot" className="w-1 h-1 rounded-full theme-dot mt-0.5" />
                    )}
                </Link>
            </div>
        </nav>
    )
}
