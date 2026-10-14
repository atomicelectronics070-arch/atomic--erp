"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, CheckCircle2, Copy, Check, X, CalendarCheck, Share2, MapPin, Sparkles, MessageCircle } from "lucide-react"

interface BajoComisionModalProps {
    isOpen: boolean
    onClose: () => void
    advisorName?: string
}

export default function BajoComisionModal({
    isOpen,
    onClose,
    advisorName = "Asesor"
}: BajoComisionModalProps) {
    const [copied, setCopied] = useState(false)

    if (!isOpen) return null

    const CONDICION_TEXT = `¿Sabías que para pertenecer al grupo bajo comisión debes marcar tu asistencia todos los días aquí en la plataforma, hacer 5 publicaciones cada día, además de recolectar 15 números de teléfono a la semana de clientes potenciales de Google Maps que registrarás en la plataforma y les escribirás ofertando nuestros servicios? Son las únicas tres tareas condicionantes y obligatorias para pertenecer al grupo bajo comisión.`

    const WHATSAPP_FORMATTED = `🚨 *REGLAMENTO OBLIGATORIO — GRUPO BAJO COMISIÓN ATOMIC* 🚨
Hola ${advisorName}, por disposición de Coordinación General:

¿Sabías que para pertenecer al grupo bajo comisión debes cumplir estrictamente estas 3 tareas?:
1️⃣ *Marcar tu asistencia todos los días* en la plataforma oficial ATOMIC ERP.
2️⃣ *Hacer 5 publicaciones cada día* (Marketplace y catálogo oficial).
3️⃣ *Recolectar 15 números de teléfono a la semana* de clientes potenciales de Google Maps que registrarás en la plataforma y les escribirás ofertando nuestros servicios.

📌 *Son las únicas tres tareas condicionantes y obligatorias para permanecer activo en el grupo bajo comisión.*

🌐 Plataforma: https://atomiccotizador.shop/login`

    const handleCopy = () => {
        navigator.clipboard.writeText(WHATSAPP_FORMATTED)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-gradient-to-b from-[#0c1229] via-[#090d1f] to-[#04060e] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] text-white space-y-6 z-10"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                                <ShieldAlert size={26} />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Sparkles size={12} />
                                    <span>Normativa Condicionante</span>
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                    Grupo Bajo Comisión
                                </h3>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Main Condition Callout */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-sm sm:text-base leading-relaxed font-medium">
                        "{CONDICION_TEXT}"
                    </div>

                    {/* 3 Pillars Breakdown */}
                    <div className="space-y-3">
                        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                            Las 3 Tareas Obligatorias y Condicionantes:
                        </div>

                        <div className="grid gap-2.5">
                            {/* Task 1 */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                                    <CalendarCheck size={18} />
                                </div>
                                <div className="text-xs sm:text-sm">
                                    <strong className="text-white block font-bold">1. Marcar asistencia diaria</strong>
                                    <span className="text-slate-300">Timbrar en la plataforma todos los días en la opción de asistencia o asistencia rápida.</span>
                                </div>
                            </div>

                            {/* Task 2 */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                                    <Share2 size={18} />
                                </div>
                                <div className="text-xs sm:text-sm">
                                    <strong className="text-white block font-bold">2. 5 publicaciones diarias</strong>
                                    <span className="text-slate-300">Publicar 5 productos en Marketplace de Facebook y redes de lunes a viernes.</span>
                                </div>
                            </div>

                            {/* Task 3 */}
                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="text-xs sm:text-sm">
                                    <strong className="text-white block font-bold">3. 15 números de Google Maps a la semana</strong>
                                    <span className="text-slate-300">Recolectar 15 números de clientes potenciales en Maps, registrarlos en la plataforma y escribirles ofertando nuestros servicios.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    <span>¡Copiado para WhatsApp!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>Copiar para Enviar por WhatsApp</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all cursor-pointer"
                        >
                            Entendido y Aceptado
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
