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
    const [showReset, setShowReset] = useState(false)

    const handleResetRequest = async () => {
        if (!email) return setError("Ingrese su email para continuar")
        setLoading(true)
        try {
            const res = await fetch("/api/auth/reset-request", {
                method: "POST",
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (data.success) {
                alert(data.message)
                setShowReset(false)
            } else {
                setError(data.error)
            }
        } catch (e) {
            setError("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

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
                    targetPath = "/dashboard/academy"
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
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] overflow-hidden relative font-sans">
            
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#1E3A8A]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-200 blur-[150px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10 p-6">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-slate-200 bg-white shadow-sm rounded-full mb-6">
                        <ShieldCheck size={14} className="text-[#1E3A8A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Terminal de Acceso Unificado</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-[#0F172A] uppercase italic leading-none">
                        ATOMIC<span className="text-[#1E3A8A]">.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-2 italic">SISTEMA INTEGRAL DE ACCESO</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl p-8 md:p-10 relative overflow-hidden group">
                    {/* Inner Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1E3A8A]/5 blur-[60px] group-hover:bg-[#1E3A8A]/10 transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="mb-8 border-l-4 border-[#1E3A8A] pl-6">
                            <h2 className="text-2xl font-black text-[#0F172A] uppercase tracking-tighter italic">Identificación</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sincronización de Elemento Operativo</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                                <Lock size={14} className="mr-3 shrink-0" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { id: 'VENDEDOR', label: 'Vendedor', icon: <Users size={14} /> },
                                    { id: 'ADMIN', label: 'Admin', icon: <ShieldCheck size={14} /> },
                                    { id: 'AFILIADO', label: 'Afiliado', icon: <Sparkles size={14} /> },
                                    { id: 'CONSUMIDOR', label: 'Tienda', icon: <ShoppingBag size={14} /> },
                                    { id: 'CURSOS', label: 'Academia', icon: <GraduationCap size={14} /> }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSection(role.id)}
                                        className={`flex items-center justify-center gap-2 py-3 border transition-all text-[9px] font-black uppercase tracking-widest ${section === role.id ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {role.icon} {role.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Identificador Corporativo
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 text-[#0F172A] text-sm font-bold focus:border-[#1E3A8A] focus:bg-white transition-all outline-none placeholder:text-slate-300 italic"
                                        placeholder="usuario@atomic.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Clave de Encriptación
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 text-[#0F172A] text-sm font-bold focus:border-[#1E3A8A] focus:bg-white transition-all outline-none placeholder:text-slate-300"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 px-6 bg-[#1E3A8A] hover:bg-[#0F172A] text-white font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-xl shadow-[#1E3A8A]/10 disabled:opacity-50 flex items-center justify-center active:scale-[0.98] italic"
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

                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col gap-4">
                            {!showReset ? (
                                <button 
                                    onClick={() => setShowReset(true)}
                                    className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#1E3A8A] transition-colors italic text-center"
                                >
                                    ¿OLVIDÓ SU CLAVE DE ENCRIPTACIÓN?
                                </button>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-[9px] font-black text-[#1E3A8A] uppercase tracking-widest italic">SOLICITUD DE RESETEO DE EMERGENCIA</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="email"
                                            placeholder="CONFIRME SU CORREO..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 text-[10px] font-black text-[#0F172A] outline-none focus:border-[#1E3A8A] italic"
                                        />
                                        <button 
                                            onClick={handleResetRequest}
                                            className="bg-[#1E3A8A] px-4 py-3 text-[10px] font-black text-white uppercase italic"
                                        >
                                            ENVIAR
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setShowReset(false)}
                                        className="text-[8px] font-black text-slate-300 uppercase tracking-widest hover:text-[#0F172A] transition-colors"
                                    >
                                        CANCELAR SOLICITUD
                                    </button>
                                </div>
                            )}
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 text-center">
                                ¿Sin acceso autorizado?{" "}
                                <Link href="/register" className="text-[#1E3A8A] hover:underline transition-colors font-black ml-1">
                                    Sincronizar Nuevo Elemento
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        <Sparkles size={12} className="text-[#1E3A8A]/40" />
                        Atomic Core System v7.0.0 Stable
                    </div>
                    <div className="text-[9px] font-bold text-slate-200 uppercase tracking-[0.3em]">
                        &copy; 2026 ATOMIC Solutions - All Systems Online
                    </div>
                </div>
            </div>
        </div>
    )
}
