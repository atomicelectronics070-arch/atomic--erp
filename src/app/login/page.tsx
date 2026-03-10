"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

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
        <div className="min-h-screen flex items-center justify-center bg-white  p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-none -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-none -ml-48 -mb-48 blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <h1 className="text-4xl font-bold tracking-tighter text-neutral-900   uppercase">
                    ATOMIC <span className="text-orange-600">INDUSTRIES</span>
                </h1>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mt-1 ml-1">INDUSTRIAS ATOMIC</p>

                <div className="bg-white  rounded-none shadow-2xl border border-neutral-100  p-10 backdrop-blur-sm">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-neutral-900  uppercase tracking-tight">Acceso Restringido</h2>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Ingrese sus credenciales corporativas</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50  border border-red-100  rounded-none text-red-600  text-xs font-bold uppercase tracking-widest flex items-center animate-in slide-in-from-top-2">
                            <Lock size={14} className="mr-3 shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-neutral-500  uppercase tracking-widest ml-1">
                                Terminal de Usuario (Email)
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full pl-12 pr-4 py-4 rounded-none border border-neutral-100  bg-neutral-50  text-neutral-900  text-sm font-bold focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none placeholder:text-neutral-300"
                                    placeholder="usuario@atomicelectronica.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-neutral-500  uppercase tracking-widest ml-1">
                                Clave de Seguridad
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-none border border-neutral-100  bg-neutral-50  text-neutral-900  text-sm font-bold focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none placeholder:text-neutral-300"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-none font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                ) : (
                                    <>
                                        Validar Acceso <ArrowRight size={16} className="ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-neutral-50  text-center">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            ¿Sin terminal autorizada?{" "}
                            <Link href="/register" className="text-orange-600  hover:text-orange-700 transition-colors font-bold ml-1">
                                Solicitar Registro
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-bold text-neutral-300  uppercase tracking-[0.5em]">
                    &copy; 2026 ATOMIC INDUSTRIES. All Rights Reserved.
                </div>
            </div>
        </div>
    )
}






