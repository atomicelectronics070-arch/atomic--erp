"use client"

import { motion } from "framer-motion"
import React from "react"

export const CyberCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <motion.div 
        whileHover={onClick ? { scale: 1.01, borderColor: "rgba(232, 52, 26, 0.5)" } : {}}
        onClick={onClick}
        className={`relative overflow-hidden bg-slate-950/60 backdrop-blur-3xl border border-white/5 p-8 shadow-2xl group transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {/* Accent lines */}
        <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#E8341A] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#E8341A] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#E8341A] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#E8341A] opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {children}
    </motion.div>
)

export const NeonButton = ({ children, onClick, variant = "primary", className = "", disabled = false }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary" | "outline", className?: string, disabled?: boolean }) => {
    const colors = {
        primary: "bg-[#E8341A] text-white shadow-[0_0_30px_rgba(232,52,26,0.3)]",
        secondary: "bg-[#00F0FF] text-slate-950 shadow-[0_0_30px_rgba(0,240,255,0.3)]",
        outline: "bg-transparent border border-white/10 text-white hover:bg-white/5"
    }

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05, filter: "brightness(1.2)" } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] italic flex items-center gap-4 transition-all disabled:opacity-50 ${colors[variant]} ${className}`}
        >
            {children}
        </motion.button>
    )
}

export const CyberInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon }: { label?: string, value: string | number, onChange: (val: any) => void, placeholder?: string, type?: string, icon?: any }) => (
    <div className="space-y-3 w-full group">
        {label && <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic ml-2">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#E8341A] transition-colors" size={18} />}
            <input 
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-white/5 border border-white/5 p-6 text-white font-black tracking-widest focus:border-[#E8341A] focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10 italic ${Icon ? 'pl-16' : ''}`}
            />
        </div>
    </div>
)

export const GlassPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-950/40 backdrop-blur-3xl border border-white/5 shadow-2xl ${className}`}>
        {children}
    </div>
)
