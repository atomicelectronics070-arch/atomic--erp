"use client"

import { motion } from "framer-motion"
import React from "react"

export const CyberCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <motion.div 
        whileHover={onClick ? { scale: 1.01, borderColor: "rgba(30, 58, 138, 0.5)" } : {}}
        onClick={onClick}
        className={`relative overflow-hidden bg-white border border-slate-200 p-8 shadow-sm group transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {/* Accent lines (Navy) */}
        <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {children}
    </motion.div>
)

export const NeonButton = ({ children, onClick, variant = "primary", className = "", disabled = false }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary" | "outline", className?: string, disabled?: boolean }) => {
    const colors = {
        primary: "bg-[#1E3A8A] text-white shadow-lg hover:shadow-[#1E3A8A]/20",
        secondary: "bg-[#3B82F6] text-white shadow-lg hover:shadow-[#3B82F6]/20",
        outline: "bg-transparent border border-slate-200 text-[#0F172A] hover:bg-slate-50"
    }

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05, filter: "brightness(1.1)" } : {}}
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
        {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic ml-2">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />}
            <input 
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border border-slate-200 p-6 text-[#0F172A] font-black tracking-widest focus:border-[#1E3A8A] focus:bg-white outline-none transition-all placeholder:text-slate-300 italic ${Icon ? 'pl-16' : ''}`}
            />
        </div>
    </div>
)

export const GlassPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl ${className}`}>
        {children}
    </div>
)
