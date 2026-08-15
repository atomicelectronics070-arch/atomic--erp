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

    const isHomePage = pathname === "/web" || pathname === "/web/"

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
        { href: "/web/bobinas-cables", label: "Bobinas" },
        { href: "/web/mandos", label: "Mandos" },
        { href: "/web/cocinas", label: "Cocinas" },
        { href: "/web/conjuntos-smart", label: "Smart" },
    ]

    return (
        <div className="min-h-screen font-sans text-slate-100 bg-slate-950 relative overflow-x-hidden selection:bg-red-500/20">
            
            {/* ── BACKGROUND 3D CANVAS & NOISE ── */}
            {!isHomePage && (
                <>
                    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                        {mounted && <Atom3D theme="light" />}
                    </div>
                    <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.05]" 
                         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

                    {/* ── MINIMALIST NAVBAR FOR SUBPAGES ── */}
                    <nav className="fixed top-0 w-full z-50 px-6 py-4 md:px-12 flex items-center justify-between bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                        <Link href="/web" className="text-xl md:text-2xl font-black tracking-tighter uppercase text-red-500 flex items-center gap-2">
                            ATOMIC<span className="text-slate-100 text-xs tracking-normal font-bold">Tecnología, Industria y Hogar</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300
                                        ${pathname.startsWith(link.href) ? 'text-red-500' : 'text-slate-300 hover:text-white'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-5 text-slate-100">
                            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
                                <User size={18} />
                            </Link>
                            <Link href="/web/cart" className="relative text-slate-300 hover:text-white transition-colors">
                                <ShoppingCart size={18} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-3 text-[9px] font-black w-4 h-4 flex items-center justify-center bg-red-600 text-white rounded-full">
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
                </>
            )}

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {!isHomePage && isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-widest my-4 hover:text-red-500 transition-colors text-slate-100"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`relative z-10 ${isHomePage ? 'pt-0' : 'pt-24'} min-h-screen`}
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {/* ── FOOTER MINIMALISTA ── */}
            {!isHomePage && (
                <footer className="relative z-10 bg-slate-950 py-8 px-8 flex justify-center border-t border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} ATOMIC — Tecnología, Industria y Hogar
                    </p>
                </footer>
            )}

            <AISearchBot />
            <CartBotOverlay />
            <BuyerBotOverlay />
        </div>
    )
}
