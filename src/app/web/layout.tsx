"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Shield, Zap, CheckCircle2 } from "lucide-react"
import { useCart } from "@/context/CartContext"

import { AISearchBot } from "@/components/ui/AISearchBot"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { totalItems } = useCart()

    return (
        <div className="min-h-screen font-sans text-white bg-[#020617] relative">
            {/* ── Navbar ── */}
            <nav className="sticky top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-sm shadow-[#E8341A]/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo + Links */}
                    <div className="flex items-center space-x-12">
                        <Link href="/web" className="text-2xl font-black tracking-tighter uppercase italic text-white group">
                            ATOMIC<span className="text-[#E8341A] neon-text group-hover:text-[#FF4D2D] transition-colors">.</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            <Link
                                href="/web"
                                className={pathname === '/web' ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                            >Inicio</Link>
                            <Link
                                href="/web/products"
                                className={pathname.includes('/product') ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                            >Productos</Link>
                            <Link
                                href="/web/categories"
                                className={pathname === '/web/categories' ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                            >Categorías</Link>
                            <Link href="/web#demos" className="hover:text-blue-500 transition-colors">Demos Web</Link>
                            <Link
                                href="/web/software"
                                className={pathname === '/web/software' ? 'text-[#2563EB] border-b-2 border-[#2563EB] pb-1' : 'hover:text-[#2563EB] transition-colors'}
                            >Software</Link>
                            <Link
                                href="/web/academy"
                                className={pathname.startsWith('/web/academy') ? 'text-[#00F0FF] border-b-2 border-[#00F0FF] pb-1' : 'hover:text-[#00F0FF] transition-colors'}
                            >Academia</Link>
                            <Link
                                href="/web/benefits"
                                className={pathname === '/web/benefits' ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                            >Beneficios</Link>
                            <Link
                                href="/web/contact"
                                className={pathname === '/web/contact' ? 'text-[#E8341A] border-b-2 border-[#E8341A] pb-1' : 'hover:text-[#E8341A] transition-colors'}
                            >Contacto</Link>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-6 text-white/40">
                        <motion.button 
                            whileHover={{ scale: 1.2, color: '#E8341A' }}
                            whileTap={{ scale: 0.9 }}
                            className="transition-colors"
                        >
                            <Search size={18} />
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.2, color: '#E8341A' }} whileTap={{ scale: 0.9 }}>
                            <Link href="/login" className="transition-colors"><User size={18} /></Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.2, color: '#E8341A' }} whileTap={{ scale: 0.9 }} className="relative">
                            <Link href="/web/cart" className="transition-colors flex items-center">
                                <ShoppingCart size={18} />
                            </Link>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E8341A] text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-none shadow-[0_0_8px_rgba(232,52,26,0.5)]">
                                    {totalItems}
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Tomato accent line at the very bottom of navbar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E8341A]/30 to-transparent" />
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

            {/* ── Footer ── */}
            <footer className="bg-[#0F1923] pt-28 pb-12 text-white">

                {/* Top section */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/8 pb-16">

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
                        <p className="text-xs text-white/25 leading-relaxed font-medium max-w-xs uppercase tracking-widest">
                            Infraestructura Modular de Alto Nivel para el mercado global corporativo.
                        </p>
                        {/* Blue accent tag */}
                        <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-none px-3 py-1.5">
                            <div className="w-1.5 h-1.5 rounded-none bg-[#3B82F6] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#3B82F6]">Todos los sistemas online</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8341A]">Corporativo</h5>
                            <ul className="space-y-5 text-[10px] text-white/20 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors"><Link href="/web">Visión Técnica</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/software">Laboratorio de Software</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/benefits">Beneficios</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/blogs">Blog de Noticias</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2563EB]">Soporte</h5>
                            <ul className="space-y-5 text-[10px] text-white/20 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                                <li className="hover:text-white transition-colors cursor-pointer">API Docs</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Garantía ATOMIC</li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5611A]">Plataformas</h5>
                            <ul className="space-y-5 text-[10px] text-white/20 font-black uppercase tracking-widest">
                                <li className="hover:text-white transition-colors"><Link href="/web/products">Catálogo</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/categories">Categorías</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/web/contact">Reseñas y Contacto</Link></li>
                                <li className="hover:text-white transition-colors"><Link href="/login">Portal ERP</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-black uppercase text-white/10 tracking-[0.4em]">© 2026 ATOMIC ELECTRONICS GMBH. Ingeniería y Precisión.</p>
                    <div className="flex items-center space-x-6 opacity-15">
                        <Shield size={16} />
                        <Zap size={16} />
                        <CheckCircle2 size={16} />
                    </div>
                </div>

                {/* Footer top tomato glow */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8341A]/20 to-transparent pointer-events-none" />
            </footer>
            <AISearchBot />
        </div>
    )
}


