"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Shield, Zap, CheckCircle2 } from "lucide-react"
import { GalaxyBackground } from "@/components/ui/GalaxyBackground"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div
            className="min-h-screen font-sans text-white selection:bg-[#E8341A]/40 relative"
            style={{ background: "transparent" }}
            data-testid="web-layout-root"
        >
            {/* ── 4K Interactive Galaxy Background (fixed, behind everything) ── */}
            <GalaxyBackground />

            {/* ── Navbar ── (30% opacity to prioritize galaxy) */}
            <nav
                className="sticky top-0 w-full z-50 bg-[#0F1923]/10 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
                data-testid="web-navbar"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo + Links */}
                    <div className="flex items-center space-x-12">
                        <Link href="/web" className="text-2xl font-black tracking-tighter uppercase italic text-white group" data-testid="navbar-logo">
                            ATOMIC<span className="text-[#E8341A] group-hover:text-[#FF8C42] transition-colors">.</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                            <Link
                                href="/web"
                                className={pathname === '/web' ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                                data-testid="nav-link-inicio"
                            >Inicio</Link>
                            <Link
                                href="/web#productos"
                                className={pathname.includes('/product') ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                                data-testid="nav-link-productos"
                            >Productos</Link>
                            <Link href="/web#categorias" className="hover:text-[#E8341A] transition-colors" data-testid="nav-link-categorias">Categorías</Link>
                            <Link
                                href="/web/software"
                                className={pathname === '/web/software' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6] pb-1' : 'hover:text-[#3B82F6] transition-colors'}
                                data-testid="nav-link-software"
                            >Desarrollo</Link>
                            <Link
                                href="/web/blogs"
                                className={pathname.startsWith('/web/blogs') ? 'text-[#3B82F6] border-b-2 border-[#3B82F6] pb-1' : 'hover:text-[#3B82F6] transition-colors'}
                                data-testid="nav-link-blog"
                            >Blog</Link>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-6 text-white/60">
                        <button className="hover:text-[#E8341A] transition-colors" data-testid="navbar-search-btn"><Search size={18} /></button>
                        <Link href="/login" className="hover:text-[#E8341A] transition-colors" data-testid="navbar-user-btn"><User size={18} /></Link>
                        <div className="relative">
                            <button className="hover:text-[#E8341A] transition-colors" data-testid="navbar-cart-btn"><ShoppingCart size={18} /></button>
                            <span className="absolute -top-1 -right-1 bg-[#E8341A] text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-none shadow-[0_0_8px_rgba(232,52,26,0.6)]">0</span>
                        </div>
                    </div>
                </div>

                {/* Tomato accent line at the very bottom of navbar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E8341A]/40 to-transparent" />
            </nav>

            {/* Page Content */}
            <main className="relative z-10">
                {children}
            </main>

            {/* ── Footer ── (30% opacity to prioritize galaxy) */}
            <footer className="relative z-10 bg-[#0F1923]/10 backdrop-blur-xl pt-28 pb-12 text-white border-t border-white/10" data-testid="web-footer">

                {/* Top section */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/10 pb-16">

                    {/* Brand */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#E8341A] flex items-center justify-center rounded-none shadow-lg shadow-[#E8341A]/30">
                                <div className="w-2 h-2 bg-white rounded-none" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic text-white">
                                ATOMIC<span className="text-[#E8341A]">.</span>
                            </span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed font-medium max-w-xs uppercase tracking-widest">
                            Infraestructura Modular de Alto Nivel para el mercado global corporativo.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#2563EB]/15 border border-[#3B82F6]/30 rounded-none px-3 py-1.5">
                            <div className="w-1.5 h-1.5 rounded-none bg-[#3B82F6] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#93C5FD]">Todos los sistemas online</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8341A]">Corporativo</h5>
                            <ul className="space-y-5 text-[10px] text-white/60 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors"><Link href="/web">Visión Técnica</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/software">Laboratorio de Software</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/blogs">Blog de Noticias</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3B82F6]">Soporte</h5>
                            <ul className="space-y-5 text-[10px] text-white/60 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                                <li className="hover:text-white transition-colors cursor-pointer">API Docs</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Garantía ATOMIC</li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5611A]">Plataformas</h5>
                            <ul className="space-y-5 text-[10px] text-white/60 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors"><Link href="/web#productos">Catálogo</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web#categorias">Categorías</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/login">Portal ERP</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.4em]">© 2026 ATOMIC ELECTRONICS GMBH. Ingeniería y Precisión.</p>
                    <div className="flex items-center space-x-6 opacity-40 text-white">
                        <Shield size={16} />
                        <Zap size={16} />
                        <CheckCircle2 size={16} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8341A]/30 to-transparent pointer-events-none" />
            </footer>
        </div>
    )
}
