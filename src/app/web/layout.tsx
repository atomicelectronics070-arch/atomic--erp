"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, ShoppingCart, User, Shield, Zap, CheckCircle2, Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

import { AISearchBot } from "@/components/ui/AISearchBot"
import { CartBotOverlay } from "@/components/ui/CartBotOverlay"
import { BuyerBotOverlay } from "@/components/ui/BuyerBotOverlay"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { totalItems } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "web" })
        }).catch(() => {})
    }, [pathname])

    const navLinks = [
        { href: "/", label: "Inicio" },
        { href: "/web/products", label: "Productos" },
        { href: "/web/categories", label: "Categorías" },
        { href: "/web/demos", label: "Desarrollo" },
        { href: "/web/gestores", label: "Gestores" },
        { href: "/web/conjuntos-smart", label: "Conjuntos Smart" },
        { href: "/web/chat-bots", label: "Chat Bots" },
        { href: "/web/consolas", label: "Consolas" },
        { href: "/web/academy", label: "Academia" },
        { href: "/web/benefits", label: "Beneficios" },
        { href: "/web/bajo-pedido", label: "Bajo Pedido" },
        { href: "/web/trabajos", label: "Trabajos" },
        { href: "/web/repuestos", label: "Repuestos" },
        { href: "/web/contact", label: "Contacto" },
    ]

    return (
        <div className="min-h-screen font-sans text-white bg-[#080808] relative">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 w-full z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo + Links */}
                    <div className="flex items-center space-x-8 overflow-hidden w-full">
                        <Link href="/web" className="shrink-0 flex items-center group">
                            <svg width="40" height="40" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                                <circle cx="36" cy="36" r="5" fill="#0055fe" className="animate-pulse" />
                                <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                                <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />
                                <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />
                                <circle cx="66" cy="36" r="2.5" fill="#fff" />
                                <circle cx="21" cy="10.5" r="2.5" fill="#fff" />
                                <circle cx="21" cy="61.5" r="2.5" fill="#fff" />
                            </svg>
                        </Link>
                        <div className="hidden md:flex overflow-x-auto items-center gap-3 pb-2 pt-2 flex-1 scrollbar-hide mask-edges">
                            {navLinks.map(link => {
                                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`whitespace-nowrap px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                                            ${isActive 
                                                ? 'bg-[#0055fe] text-white border-[#0055fe] shadow-lg shadow-[#0055fe]/20' 
                                                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10 hover:shadow-sm hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 md:space-x-6 text-slate-400">
                        <motion.button 
                            whileHover={{ scale: 1.2, color: '#1E3A8A' }}
                            whileTap={{ scale: 0.9 }}
                            className="transition-colors"
                        >
                            <Search size={18} />
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.2, color: '#1E3A8A' }} whileTap={{ scale: 0.9 }}>
                            <Link href="/login" className="transition-colors"><User size={18} /></Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.2, color: '#1E3A8A' }} whileTap={{ scale: 0.9 }} className="relative">
                            <Link href="/web/cart" className="transition-colors flex items-center">
                                <ShoppingCart size={18} />
                            </Link>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#1E3A8A] text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-none shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </motion.div>
                        {/* Hamburger Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden ml-2 text-slate-800 p-1"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Navy accent line at the very bottom of navbar */}
                <div className="h-[1px] w-full bg-white/5" />

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                        >
                            <div className="px-6 py-4 flex flex-col space-y-4 max-h-[70vh] overflow-y-auto">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-xs font-black uppercase tracking-[0.2em] py-2 border-b border-slate-100 ${
                                            pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) 
                                                ? 'text-[#1E3A8A]' 
                                                : 'text-slate-500 hover:text-[#1E3A8A]'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            {/* Page Content with Smooth Transition */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative"
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {/* WhatsApp Floating Button */}
            <motion.a
                href="https://wa.me/593969043453"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-32 right-8 z-[900] w-14 h-14 bg-[#25D366] text-white flex items-center justify-center rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)]"
            >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            </motion.a>

            {/* ── Footer Minimalista ── */}
            <footer className="bg-black py-8 text-white border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="36" cy="36" r="5" fill="#fff" />
                            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#fff" strokeWidth="2" fill="none" />
                            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#fff" strokeWidth="2" fill="none" transform="rotate(60 36 36)" />
                            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#fff" strokeWidth="2" fill="none" transform="rotate(120 36 36)" />
                            <circle cx="66" cy="36" r="2.5" fill="#fff" />
                            <circle cx="21" cy="10.5" r="2.5" fill="#fff" />
                            <circle cx="21" cy="61.5" r="2.5" fill="#fff" />
                        </svg>
                        <span className="text-sm font-black tracking-[0.2em] uppercase italic text-white">ATOMIC</span>
                    </div>
                    <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.4em]">© 2026 ATOMIC INDUSTRIAS.</p>
                </div>
            </footer>
            <AISearchBot />
            <CartBotOverlay />
            <BuyerBotOverlay />
        </div>
    )
}
