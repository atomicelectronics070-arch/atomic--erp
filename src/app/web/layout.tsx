"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Shield, Zap, CheckCircle2 } from "lucide-react"
import { MoleculesBackground } from "@/components/ui/MoleculesBackground"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div
            className="min-h-screen font-sans text-[#0F0F0F] selection:bg-black/15 relative atomic-light-shell"
            style={{ background: "transparent" }}
            data-testid="web-layout-root"
        >
            {/* Interactive black-metaballs background — fixed behind everything */}
            <MoleculesBackground />

            {/* Global border + hover tokens for the light theme */}
            <style jsx global>{`
                .atomic-light-shell {
                    --atomic-border: rgba(255, 255, 255, 0.85);
                    --atomic-border-hover: rgba(0, 0, 0, 0.18);
                    --atomic-surface: rgba(255, 255, 255, 0.55);
                    --atomic-surface-hover: rgba(255, 255, 255, 0.7);
                }
                .atomic-card {
                    background: var(--atomic-surface);
                    border: 1px solid var(--atomic-border);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    transition: border-color 280ms ease, background 280ms ease,
                        box-shadow 280ms ease, transform 280ms ease;
                }
                .atomic-card:hover {
                    border-color: var(--atomic-border-hover);
                    background: var(--atomic-surface-hover);
                    box-shadow: 0 18px 44px -18px rgba(0, 0, 0, 0.18);
                }
                .atomic-bar {
                    background: rgba(255, 255, 255, 0.45);
                    border: 1px solid var(--atomic-border);
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                }
            `}</style>

            {/* ── Navbar ── */}
            <nav
                className="sticky top-0 w-full z-50 atomic-bar"
                data-testid="web-navbar"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link href="/web" className="text-2xl font-black tracking-tighter uppercase italic text-[#0F0F0F] group" data-testid="navbar-logo">
                            ATOMIC<span className="text-[#0F0F0F] group-hover:text-[#404040] transition-colors">.</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#0F0F0F]/55">
                            <Link
                                href="/web"
                                className={pathname === '/web' ? 'text-[#0F0F0F] border-b border-[#0F0F0F]/40 pb-1' : 'hover:text-[#0F0F0F] transition-colors'}
                                data-testid="nav-link-inicio"
                            >Inicio</Link>
                            <Link
                                href="/web#productos"
                                className={pathname.includes('/product') ? 'text-[#0F0F0F] border-b border-[#0F0F0F]/40 pb-1' : 'hover:text-[#0F0F0F] transition-colors'}
                                data-testid="nav-link-productos"
                            >Productos</Link>
                            <Link href="/web#categorias" className="hover:text-[#0F0F0F] transition-colors" data-testid="nav-link-categorias">Categorías</Link>
                            <Link
                                href="/web/software"
                                className={pathname === '/web/software' ? 'text-[#0F0F0F] border-b border-[#0F0F0F]/40 pb-1' : 'hover:text-[#0F0F0F] transition-colors'}
                                data-testid="nav-link-software"
                            >Desarrollo</Link>
                            <Link
                                href="/web/blogs"
                                className={pathname.startsWith('/web/blogs') ? 'text-[#0F0F0F] border-b border-[#0F0F0F]/40 pb-1' : 'hover:text-[#0F0F0F] transition-colors'}
                                data-testid="nav-link-blog"
                            >Blog</Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-[#0F0F0F]/55">
                        <button className="hover:text-[#0F0F0F] transition-colors" data-testid="navbar-search-btn"><Search size={18} /></button>
                        <Link href="/login" className="hover:text-[#0F0F0F] transition-colors" data-testid="navbar-user-btn"><User size={18} /></Link>
                        <div className="relative">
                            <button className="hover:text-[#0F0F0F] transition-colors" data-testid="navbar-cart-btn"><ShoppingCart size={18} /></button>
                            <span className="absolute -top-1 -right-1 bg-[#0F0F0F] text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-none">0</span>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0F0F0F]/15 to-transparent" />
            </nav>

            <main className="relative z-10">
                {children}
            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10 atomic-bar pt-28 pb-12 text-[#0F0F0F]" data-testid="web-footer">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/80 pb-16">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0F0F0F] flex items-center justify-center rounded-none shadow-lg shadow-black/20">
                                <div className="w-2 h-2 bg-white rounded-none" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic text-[#0F0F0F]">
                                ATOMIC<span className="text-[#0F0F0F]">.</span>
                            </span>
                        </div>
                        <p className="text-xs text-[#0F0F0F]/55 leading-relaxed font-medium max-w-xs uppercase tracking-widest">
                            Infraestructura Modular de Alto Nivel para el mercado global corporativo.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white/70 border border-white px-3 py-1.5 hover:border-black/20 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-none bg-[#0F0F0F] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0F0F0F]">Todos los sistemas online</span>
                        </div>
                    </div>

                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F0F0F]">Corporativo</h5>
                            <ul className="space-y-5 text-[10px] text-[#0F0F0F]/55 font-black uppercase tracking-widest">
                                <li className="hover:text-[#0F0F0F] transition-colors"><Link href="/web">Visión Técnica</Link></li>
                                <li className="hover:text-[#0F0F0F] transition-colors"><Link href="/web/software">Laboratorio de Software</Link></li>
                                <li className="hover:text-[#0F0F0F] transition-colors"><Link href="/web/blogs">Blog de Noticias</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F0F0F]">Soporte</h5>
                            <ul className="space-y-5 text-[10px] text-[#0F0F0F]/55 font-black uppercase tracking-widest">
                                <li className="hover:text-[#0F0F0F] transition-colors cursor-pointer">Centro de Ayuda</li>
                                <li className="hover:text-[#0F0F0F] transition-colors cursor-pointer">API Docs</li>
                                <li className="hover:text-[#0F0F0F] transition-colors cursor-pointer">Garantía ATOMIC</li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F0F0F]">Plataformas</h5>
                            <ul className="space-y-5 text-[10px] text-[#0F0F0F]/55 font-black uppercase tracking-widest">
                                <li className="hover:text-[#0F0F0F] transition-colors"><Link href="/web#productos">Catálogo</Link></li>
                                <li className="hover:text-[#0F0F0F] transition-colors"><Link href="/web#categorias">Categorías</Link></li>
                                <li className="hover:text-[#0F0F0F] transition-colors"><Link href="/login">Portal ERP</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-black uppercase text-[#0F0F0F]/40 tracking-[0.4em]">© 2026 ATOMIC ELECTRONICS GMBH. Ingeniería y Precisión.</p>
                    <div className="flex items-center space-x-6 opacity-50 text-[#0F0F0F]">
                        <Shield size={16} />
                        <Zap size={16} />
                        <CheckCircle2 size={16} />
                    </div>
                </div>
            </footer>
        </div>
    )
}
