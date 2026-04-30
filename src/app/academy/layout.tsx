import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

export const metadata: Metadata = {
    title: "Atomic Academy — Capacitación Tecnológica Profesional",
    description: "Accede gratuitamente a cursos de tecnología, reparación, redes, ciberseguridad y más. Formación profesional de Atomic Solutions.",
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#000103] text-white font-sans">
            {/* Top accent line */}
            <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E8341A] to-transparent z-[100]" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-2xl bg-black/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/academy" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-[#E8341A]/10 border border-[#E8341A]/30 flex items-center justify-center group-hover:bg-[#E8341A]/20 transition-all">
                            <GraduationCap size={20} className="text-[#E8341A]" />
                        </div>
                        <div>
                            <span className="text-white font-black uppercase tracking-widest text-sm italic">
                                ATOMIC <span className="text-[#E8341A]">ACADEMY</span>
                            </span>
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-bold">Centro de Capacitación</p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/academy" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors italic">
                            Cursos
                        </Link>
                        <Link href="/web" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors italic">
                            Sitio Web
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest italic hover:bg-[#E8341A]/80 transition-all hover:shadow-[0_0_20px_rgba(232,52,26,0.4)]"
                        >
                            Ingresar al ERP
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Background orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-indigo-600/5 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-fixed" />
            </div>

            <main className="relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-32 py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black italic">
                        © {new Date().getFullYear()} ATOMIC SOLUTIONS · TODOS LOS DERECHOS RESERVADOS
                    </p>
                    <p className="text-[9px] text-white/10 uppercase tracking-widest mt-2 font-bold italic">
                        Capacitación Tecnológica de Acceso Libre · Quito, Ecuador
                    </p>
                </div>
            </footer>
        </div>
    )
}
