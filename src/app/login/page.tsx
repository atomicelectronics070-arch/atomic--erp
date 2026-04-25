"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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
                setError("Credenciales inválidas. Por favor verifique su acceso.")
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err: any) {
            setError("Error de conexión con el servidor central.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#0F1923] overflow-hidden relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#E8341A]/8 blur-[150px] rounded-none animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2563EB]/8 blur-[150px] rounded-none animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-md relative z-10 p-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#E8341A]/25 bg-[#E8341A]/8 backdrop-blur-md rounded-none mb-6">
                        <ShieldCheck size={14} className="text-[#E8341A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8341A]">Terminal de Acceso Seguro</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-[#0F1923] uppercase italic leading-none">
                        ATOMIC<span className="text-[#E8341A]">.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-[#0F1923]/35 uppercase tracking-[0.5em] mt-2">INDUSTRIAS TECNOLÓGICAS</p>
                </div>

                <div className="bg-white border border-[#0F1923]/6 shadow-xl shadow-[#E8341A]/5 rounded-none p-8 md:p-10 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E8341A]/6 blur-[60px] rounded-none group-hover:bg-[#E8341A]/12 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-[#0F1923] uppercase tracking-tighter">Entrar al Sistema</h2>
                            <p className="text-[10px] font-bold text-[#0F1923]/35 uppercase tracking-widest mt-1">Sincronización de Nodo Operativo</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-none text-red-400 text-xs font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                                <Lock size={14} className="mr-3 shrink-0" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Identificador Corporativo
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F1923]/25 group-focus-within:text-[#E8341A] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                        className="w-full pl-12 pr-4 py-4 rounded-none border border-[#0F1923]/8 bg-[#F5F3F0] text-[#0F1923] text-sm font-bold focus:ring-2 focus:ring-[#E8341A] focus:bg-white transition-all outline-none placeholder:text-[#0F1923]/25"
                                        placeholder="usuario@atomic.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Clave de Encriptación
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F1923]/25 group-focus-within:text-[#E8341A] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-none border border-[#0F1923]/8 bg-[#F5F3F0] text-[#0F1923] text-sm font-bold focus:ring-2 focus:ring-[#E8341A] focus:bg-white transition-all outline-none placeholder:text-[#0F1923]/25"
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

                        <div className="mt-10 pt-8 border-t border-[#0F1923]/6 text-center">
                            <p className="text-[10px] font-bold text-[#0F1923]/30 uppercase tracking-widest">
                                ¿Sin acceso autorizado?{" "}
                                <Link href="/register" className="text-[#E8341A] hover:text-[#C0280F] transition-colors font-black ml-1">
                                    Sincronizar Nuevo Nodo
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#0F1923]/20 uppercase tracking-[0.4em]">
                        <Sparkles size={12} className="text-[#E8341A]/40" />
                        Atomic Core System v4.0.2 Stable
                    </div>
                    <div className="text-[9px] font-bold text-[#0F1923]/15 uppercase tracking-[0.3em]">
                        &copy; 2026 ATOMIC INDUSTRIES - All Systems Online
                    </div>
                </div>
            </div>
        </div>
    )
}
