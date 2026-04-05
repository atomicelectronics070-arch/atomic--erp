"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Shield, Zap, CheckCircle2 } from "lucide-react"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    
    // Todo el portal público (/web/*) ahora usa el Dark Theme para coherencia con el ERP
    const isDarkGlobal = pathname.startsWith('/web')

    return (
        <div className={`min-h-screen font-sans bg-neutral-950 text-white selection:bg-indigo-500/30`}>
            {/* Navbar Global */}
            <nav className="sticky top-0 w-full z-50 px-6 py-4 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link href="/web" className="text-2xl font-black tracking-tighter uppercase italic text-white group">
                            ATOMIC<span className="text-indigo-500 group-hover:text-pink-500 transition-colors">.</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                            <Link href="/web" className={pathname === '/web' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-indigo-400 transition-colors'}>Inicio</Link>
                            <Link href="/web#productos" className={pathname.includes('/product') ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-indigo-400 transition-colors'}>Productos</Link>
                            <Link href="/web#categorias" className="hover:text-indigo-400 transition-colors">Categorías</Link>
                            <Link href="/web/software" className={pathname === '/web/software' ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-indigo-400 transition-colors'}>Desarrollo</Link>
                            <Link href="/web/blogs" className={pathname.startsWith('/web/blogs') ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-indigo-400 transition-colors'}>Blog</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6 text-white/60">
                        <button className="hover:text-indigo-400 transition-colors"><Search size={18} /></button>
                        <Link href="/login" className="hover:text-indigo-400 transition-colors"><User size={18} /></Link>
                        <div className="relative">
                            <button className="hover:text-indigo-400 transition-colors"><ShoppingCart size={18} /></button>
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]">0</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="relative">
                {children}
            </main>

            {/* Footer Global */}
            <footer className="bg-slate-950/20 pt-32 pb-12 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 border-b border-white/5 pb-20">
                    <div className="space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 glass-panel flex items-center justify-center rounded-lg">
                              <div className="w-2 h-2 bg-indigo-500" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic text-white">
                                ATOMIC<span className="text-indigo-500">.</span>
                            </span>
                        </div>
                        <p className="text-xs text-white/30 leading-relaxed font-medium max-w-xs uppercase tracking-widest">
                            Infraestructura Modular de Alto Nivel para el mercado global corporativo.
                        </p>
                    </div>
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Corporativo</h5>
                            <ul className="space-y-5 text-[10px] text-white/20 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors"><Link href="/web">Visión Técnica</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/software">Laboratorio de Software</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/blogs">Blog de Noticias</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Soporte</h5>
                            <ul className="space-y-5 text-[10px] text-white/20 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                                <li className="hover:text-white transition-colors cursor-pointer">API Docs</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Garantía ATOMIC</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className="text-[9px] font-black uppercase text-white/10 tracking-[0.4em]">© 2026 ATOMIC ELECTRONICS GMBH. Ingeniería y Precisión.</p>
                    <div className="flex items-center space-x-8 opacity-10">
                        <Shield size={16} />
                        <Zap size={16} />
                        <CheckCircle2 size={16} />
                    </div>
                </div>
            </footer>
        </div>

    )
}
