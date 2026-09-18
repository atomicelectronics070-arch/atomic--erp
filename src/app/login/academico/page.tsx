"use client"

import React, { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
    AlertCircle, GraduationCap, ArrowLeft
} from "lucide-react"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function AcademicoLoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return setError("Ingresa tus credenciales")
        setLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: email.trim().toLowerCase(),
                password,
            })

            if (result?.error) {
                setError("Email o contraseña incorrectos.")
            } else if (result?.ok) {
                router.push("/web/academy")
                router.refresh()
            } else {
                setError("Error al iniciar sesión.")
            }
        } catch {
            setError("Error de conexión.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#07090E] p-4 sm:p-6 font-sans text-slate-100 relative overflow-hidden">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all backdrop-blur-md"
                >
                    <ArrowLeft size={14} /> Login General
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-[400px] rounded-3xl bg-[#0F1420] border border-indigo-500/25 p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        <GraduationCap size={12} /> Academia Digital
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                        ATOMIC <span className="text-indigo-400">ACADEMY</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Acceso a Cursos, Certificados y Clases en Vivo
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0 text-rose-400" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="estudiante@atomic.com"
                                className="w-full bg-[#161D2E] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Tu contraseña"
                                className="w-full bg-[#161D2E] border border-white/10 rounded-2xl pl-11 pr-11 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={14} /> Accediendo...
                            </>
                        ) : (
                            <>
                                Ingresar a la Academia <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                        ¿Nuevo estudiante?{" "}
                        <Link href="/register/academico" className="text-indigo-400 font-bold hover:underline">
                            Inscripción Oficial a Cursos
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default function AcademicoLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-[#07090E] text-indigo-400">
                <Loader2 className="animate-spin" size={36} />
            </div>
        }>
            <AcademicoLoginForm />
        </Suspense>
    )
}
