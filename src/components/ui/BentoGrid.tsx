"use client";

import React, { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
    return (
        <div className={`grid w-full grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[22rem] ${className}`}>
            {children}
        </div>
    );
}

interface BentoCardProps {
    name: string;
    className?: string;
    background?: ReactNode;
    Icon?: any;
    description: string;
    href?: string;
    cta?: string;
    badge?: string;
    accentColor?: string;
}

export function BentoCard({
    name,
    className = "",
    background,
    Icon,
    description,
    href,
    cta = "Explorar",
    badge,
    accentColor = "cyan"
}: BentoCardProps) {
    const isCyan = accentColor === "cyan";
    const isEmerald = accentColor === "emerald";
    const isPurple = accentColor === "purple";
    const isPink = accentColor === "pink";

    const glowClass = isCyan
        ? "hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:border-cyan-500/50"
        : isEmerald
        ? "hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:border-emerald-500/50"
        : isPurple
        ? "hover:shadow-[0_0_35px_rgba(168,85,247,0.25)] hover:border-purple-500/50"
        : "hover:shadow-[0_0_35px_rgba(236,72,153,0.25)] hover:border-pink-500/50";

    const textAccent = isCyan
        ? "text-cyan-400"
        : isEmerald
        ? "text-emerald-400"
        : isPurple
        ? "text-purple-400"
        : "text-pink-400";

    const badgeBg = isCyan
        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
        : isEmerald
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        : isPurple
        ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
        : "bg-pink-500/10 border-pink-500/30 text-pink-300";

    return (
        <div
            className={`group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 transition-all duration-500 ${glowClass} ${className}`}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                {background}
            </div>

            {/* Header info */}
            <div className="relative z-10 flex items-start justify-between">
                {Icon && (
                    <div className={`p-3 rounded-2xl bg-black/50 border border-white/10 ${textAccent} shadow-inner`}>
                        <Icon size={24} />
                    </div>
                )}
                {badge && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${badgeBg}`}>
                        {badge}
                    </span>
                )}
            </div>

            {/* Footer / Content */}
            <div className="relative z-10 space-y-2 mt-auto">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight group-hover:text-white transition-colors">
                    {name}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 line-clamp-2">
                    {description}
                </p>

                {href && (
                    <Link
                        href={href}
                        className={`inline-flex items-center gap-2 pt-2 text-xs font-black uppercase tracking-widest ${textAccent} group-hover:gap-3 transition-all`}
                    >
                        <span>{cta}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>
        </div>
    );
}
