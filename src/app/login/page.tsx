"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck, Users, ShoppingBag, GraduationCap } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [section, setSection] = useState("VENDEDOR")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (res?.error) {
                setError(res.error || "Credenciales inválidas. Por favor verifique su acceso.")
            } else {
                // Determine redirect based on selected section
                let targetPath = "/dashboard"
                
                if (section === "CONSUMIDOR") {
                    targetPath = "/shop" 
                } else if (section === "CURSOS") {
                    targetPath = "/web/academy/dashboard"
                } else {
                    targetPath = "/dashboard"
                }

                router.push(targetPath)
                router.refresh()
            }
        } catch (err: any) {
            setError("Error de conexión con el servidor central.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-marble text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#E8341A]/12 blur-[150px] rounded-none animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2563EB]/12 blur-[150px] rounded-none animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-md relative z-10 p-6">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#E8341A]/25 bg-[#E8341A]/10 backdrop-blur-md rounded-none mb-6">
                        <ShieldCheck size={14} className="text-[#E8341A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8341A]">Terminal de Acceso Unificado</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
                        ATOMIC<span className="text-[#E8341A]">.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.5em] mt-2">SISTEMA INTEGRAL DE ACCESO</p>
                </div>

                <div className="bg-slate-950/30 border border-white/10 backdrop-blur-3xl shadow-2xl shadow-[#E8341A]/5 rounded-none p-8 md:p-10 relative overflow-hidden group">
                    {/* Inner Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E8341A]/10 blur-[60px] rounded-none group-hover:bg-[#E8341A]/20 transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identificación</h2>
                            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mt-1">Sincronización de Elemento Operativo</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-none text-red-400 text-xs font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                                <Lock size={14} className="mr-3 shrink-0" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection Grid (More Visual) */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { id: 'VENDEDOR', label: 'Vendedor', icon: <Users size={14} /> },
                                    { id: 'ADMIN', label: 'Admin', icon: <ShieldCheck size={14} /> },
                                    { id: 'AFILIADO', label: 'Afiliado', icon: <Sparkles size={14} /> },
                                    { id: 'CONSUMIDOR', label: 'Tienda', icon: <ShoppingBag size={14} /> },
                                    { id: 'CURSOS', label: 'Cursos', icon: <GraduationCap size={14} /> }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSection(role.id)}
                                        className={`flex items-center justify-center gap-2 py-3 border transition-all text-[9px] font-black uppercase tracking-widest ${section === role.id ? 'bg-[#E8341A] border-[#E8341A] text-white shadow-[0_0_15px_rgba(232,52,26,0.3)]' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10'}`}
                                    >
                                        {role.icon} {role.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                                    Identificador Corporativo
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#E8341A] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-none border border-white/10 bg-white/5 text-white text-sm font-bold focus:ring-2 focus:ring-[#E8341A] focus:bg-white/10 transition-all outline-none placeholder:text-white/20"
                                        placeholder="usuario@atomic.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                                    Clave de Encriptación
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#E8341A] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-none border border-white/10 bg-white/5 text-white text-sm font-bold focus:ring-2 focus:ring-[#E8341A] focus:bg-white/10 transition-all outline-none placeholder:text-white/20"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 px-6 bg-[#E8341A] hover:bg-[#C0280F] text-white rounded-none font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-[0_10px_40px_-5px_rgba(232,52,26,0.35)] disabled:opacity-50 flex items-center justify-center active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                    ) : (
                                        <>
                                            Iniciar Sesión <ArrowRight size={16} className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/10 text-center">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                ¿Sin acceso autorizado?{" "}
                                <Link href="/register" className="text-[#E8341A] hover:text-[#C0280F] transition-colors font-black ml-1">
                                    Sincronizar Nuevo Elemento
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                        <Sparkles size={12} className="text-[#E8341A]/40" />
                        Atomic Core System v4.1.0 Unified
                    </div>
                    <div className="text-[9px] font-bold text-white/15 uppercase tracking-[0.3em]">
                        &copy; 2026 ATOMIC Solutions - All Systems Online
                    </div>
                </div>
            </div>
        </div>
    )
}
