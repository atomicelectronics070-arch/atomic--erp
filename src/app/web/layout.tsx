"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import Atom3D from "@/components/ui/Atom3D"

import { AISearchBot } from "@/components/ui/AISearchBot"
import { CartBotOverlay } from "@/components/ui/CartBotOverlay"
import { BuyerBotOverlay } from "@/components/ui/BuyerBotOverlay"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { totalItems } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "web" })
        }).catch(() => {})
    }, [pathname])

    const navLinks = [
        { href: "/web/products", label: "Productos" },
        { href: "/web/categories", label: "Categorías" },
        { href: "/web/demos", label: "Desarrollo" },
        { href: "/web/conjuntos-smart", label: "Smart" },
        { href: "/web/chat-bots", label: "Bots" },
    ]

    return (
        <div className="min-h-screen font-sans text-slate-100 bg-slate-950 relative overflow-x-hidden selection:bg-cyan-500/20">
            
            {/* ── BACKGROUND 3D CANVAS & NOISE ── */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                {mounted && <Atom3D theme="light" />}
            </div>
            {/* White theme grain texture */}
            <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.05]" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

            {/* ── MINIMALIST NAVBAR (Light Ether Studio Style) ── */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none mix-blend-multiply bg-transparent">
                
                {/* Logo */}
                <Link href="/web" className="text-xl md:text-2xl font-black tracking-tighter uppercase pointer-events-auto text-slate-100">
                    ATOMIC<span className="text-slate-100/30">STORE</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 pointer-events-auto">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300
                                ${pathname.startsWith(link.href) ? 'text-slate-100' : 'text-slate-100/40 hover:text-slate-100'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pointer-events-auto text-slate-100">
                    <Link href="/login" className="text-slate-100/50 hover:text-slate-100 transition-colors">
                        <User size={18} />
                    </Link>
                    <Link href="/web/cart" className="relative text-slate-100/50 hover:text-slate-100 transition-colors">
                        <ShoppingCart size={18} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-3 text-[9px] font-black w-4 h-4 flex items-center justify-center bg-black text-white rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-slate-100 ml-2"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 flex flex-col items-center justify-center"
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-widest my-4 hover:text-[#0055fe] transition-colors text-slate-100"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MAIN CONTENT ── */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 pt-32 min-h-screen"
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {/* ── FOOTER MINIMALISTA ── */}
            <footer className="relative z-10 bg-transparent py-12 px-8 flex justify-center border-t border-black/5 mt-20">
                <p className="text-[10px] font-medium text-slate-100/30 uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} Atomic Industrias — Store
                </p>
            </footer>

            <AISearchBot />
            <CartBotOverlay />
            <BuyerBotOverlay />
        </div>
    )
}
