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
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px]"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10 p-6">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md rounded-full mb-6">
                        <ShieldCheck size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Terminal de Acceso</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
                        ATOMIC<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.5em] mt-2">INDUSTRIAS TECNOLÓGICAS</p>
                </div>

                <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                    {/* Inner Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Entrar al Sistema</h2>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Nivel de Seguridad: Encriptado E2E</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                                <Lock size={14} className="mr-3 shrink-0" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                                    Identificador Corporativo
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/5 bg-white/5 text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all outline-none placeholder:text-neutral-600"
                                        placeholder="usuario@atomic.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
                                    Clave de Encriptación
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/5 bg-white/5 text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all outline-none placeholder:text-neutral-600"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 px-6 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                    ) : (
                                        <>
                                            Acceder a Terminal <ArrowRight size={16} className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                ¿Sin acceso autorizado?{" "}
                                <Link href="/register" className="text-white hover:text-indigo-400 transition-colors font-black ml-1">
                                    Registrar Nodo
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">
                        <Sparkles size={12} className="text-indigo-500/50" />
                        Atomic Core System v4.0
                    </div>
                    <div className="text-[9px] font-bold text-neutral-700 uppercase tracking-[0.3em]">
                        &copy; 2026 ATOMIC INDUSTRIES - All Systems Online
                    </div>
                </div>
            </div>
        </div>
    )
}






