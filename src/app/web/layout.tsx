"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Shield, Zap, CheckCircle2 } from "lucide-react"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    
    // Si estamos en la Home o en Software, es Dark Theme con header superpuesto (absolute)
    const isDarkGlobal = pathname === '/web' || pathname === '/web/software'

    return (
        <div className={`min-h-screen font-sans ${isDarkGlobal ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'}`}>
            {/* Navbar Global */}
            <nav className={isDarkGlobal ? 
                "absolute top-0 w-full z-50 px-6 py-6 border-b border-white/10 bg-gradient-to-b from-neutral-900/80 to-transparent" : 
                "sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100"
            }>
                <div className={`max-w-7xl mx-auto flex items-center justify-between ${isDarkGlobal ? '' : 'h-20 px-6'}`}>
                    <div className="flex items-center space-x-12">
                        <Link href="/web" className={`text-2xl font-black tracking-tighter uppercase italic ${isDarkGlobal ? 'text-white' : 'text-neutral-900'}`}>
                            ATOMIC<span className={`${isDarkGlobal ? 'text-orange-500' : 'text-orange-600'}`}>.</span>
                        </Link>
                        <div className={`hidden md:flex space-x-8 ${isDarkGlobal ? 'text-[10px] font-black uppercase tracking-widest text-white/50' : 'text-[11px] font-bold uppercase tracking-widest text-neutral-500'}`}>
                            <Link href="/web" className={pathname === '/web' ? (isDarkGlobal ? 'text-white' : 'text-orange-600 border-b-2 border-orange-600 pb-1') : 'hover:text-orange-500 transition-colors'}>Inicio</Link>
                            <Link href={isDarkGlobal ? '#productos' : '/web#productos'} className={pathname.includes('/product') ? 'text-orange-600 border-b-2 border-orange-600 pb-1' : 'hover:text-orange-500 transition-colors'}>Productos</Link>
                            <Link href={isDarkGlobal ? '#categorias' : '/web#categorias'} className="hover:text-orange-500 transition-colors">Categorías</Link>
                            <Link href="/web/software" className={pathname === '/web/software' ? (isDarkGlobal ? 'text-orange-500' : 'text-orange-600 border-b-2 border-orange-600 pb-1') : 'hover:text-orange-500 transition-colors'}>Desarrollo</Link>
                        </div>
                    </div>
                    <div className={`flex items-center space-x-6 ${isDarkGlobal ? 'text-white/60' : 'text-neutral-400'}`}>
                        <button className="hover:text-orange-500 transition-colors"><Search size={20} /></button>
                        <button className="hover:text-orange-500 transition-colors"><User size={20} /></button>
                        <div className="relative">
                            <button className="hover:text-orange-500 transition-colors"><ShoppingCart size={20} /></button>
                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center shadow-sm">0</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main>
                {children}
            </main>

            {/* Footer Global */}
            <footer className="bg-neutral-900 pt-32 pb-12 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 border-b border-white/5 pb-20">
                    <div className="space-y-10">
                        <span className="text-4xl font-black tracking-tighter uppercase italic text-white flex items-center">
                            ATOMIC<span className="text-orange-600">.</span>
                        </span>
                        <p className="text-sm text-white/40 leading-relaxed font-medium max-w-xs">
                            Líderes en tecnología industrial, ecosistemas digitales y soluciones de alto rendimiento para el mercado global corporativo.
                        </p>
                    </div>
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-600">Corporativo</h5>
                            <ul className="space-y-5 text-[11px] text-white/30 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors"><Link href="/web">Visión Técnica</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/software">Laboratorio de Software</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web">Garantía Global</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-600">Soporte</h5>
                            <ul className="space-y-5 text-[11px] text-white/30 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Manuales y Documentación</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Contactar Especialista</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">© 2026 INDUSTRIAS ATOMIC. Ingeniería y Precisión.</p>
                    <div className="flex items-center space-x-8 opacity-20">
                        <Shield size={18} />
                        <Zap size={18} />
                        <CheckCircle2 size={18} />
                    </div>
                </div>
            </footer>
        </div>
    )
}
