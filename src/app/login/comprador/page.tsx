"use client"

import React, { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
    CheckCircle2, AlertCircle, ShoppingBag, ArrowLeft,
    Sparkles, ShieldCheck, Heart, PackageCheck
} from "lucide-react"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function CompradorLoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/web"
    const [mode, setMode] = useState<"login" | "signup">("login")

    // Form fields
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // State
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showReset, setShowReset] = useState(false)

    // Password reset
    const handleResetRequest = async () => {
        if (!email) return setError("Ingresa tu correo para recuperar tu contraseña")
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/reset-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(data.message || "Enlace enviado a tu correo.")
                setShowReset(false)
            } else {
                setError(data.error || "Error al procesar la solicitud")
            }
        } catch {
            setError("Error de conexión con el servidor")
        } finally {
            setLoading(false)
        }
    }

    // Login Submit
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Por favor completa tu correo y contraseña")
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: email.trim().toLowerCase(),
                password,
            })

            if (result?.error) {
                const errMap: Record<string, string> = {
                    "Credenciales inválidas": "Email o contraseña incorrectos.",
                    "Su cuenta está pendiente de aprobación.": "Tu cuenta está pendiente de activación.",
                    "Su cuenta ha sido desactivada por administración.": "Tu cuenta ha sido desactivada.",
                    "Credenciales incompletas": "Por favor llena todos los campos.",
                }
                setError(errMap[result.error] || result.error || "Credenciales incorrectas.")
            } else if (result?.ok) {
                // Auto-detect role or send to store
                let targetPath = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/web"
                try {
                    const resRole = await fetch(`/api/auth/user-role?email=${encodeURIComponent(email.trim().toLowerCase())}`)
                    const dataRole = await resRole.json()
                    const uRole = (dataRole?.role || "CONSUMIDOR").toUpperCase()
                    if (uRole === "CONSUMIDOR") targetPath = "/web"
                    else if (uRole === "ACADEMIA") targetPath = "/web/academy"
                    else if (uRole === "TECNICO") targetPath = "/dashboard"
                    else if (uRole === "SALESPERSON") targetPath = "/dashboard/asistencia"
                    else targetPath = "/dashboard"
                } catch {}
                
                router.push(targetPath)
                router.refresh()
            } else {
                setError("Ocurrió un error inesperado al iniciar sesión.")
            }
        } catch {
            setError("Error de conexión con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    // Sign Up Submit for Buyer
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email || !password) {
            setError("Por favor completa los campos obligatorios")
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    lastName: lastName.trim() || name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    role: "CONSUMIDOR",
                    phone: phone.trim(),
                    referredBy: "Tienda Online Atomic"
                })
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || "Error al crear la cuenta de comprador")
            } else {
                setSuccess("¡Cuenta de comprador creada con éxito! Ingresando a la tienda...")
                setTimeout(async () => {
                    const loginRes = await signIn("credentials", {
                        redirect: false,
                        email: email.trim().toLowerCase(),
                        password,
                    })
                    if (loginRes?.ok) {
                        router.push(callbackUrl || "/web")
                        router.refresh()
                    } else {
                        setMode("login")
                    }
                }, 1200)
            }
        } catch {
            setError("Error de conexión al registrar usuario")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#070b14] p-4 sm:p-6 font-sans text-slate-100 relative overflow-hidden selection:bg-blue-500/30">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Back to store link */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/web"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all backdrop-blur-md"
                >
                    <ArrowLeft size={14} /> Volver a la Tienda
                </Link>
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-w-[420px] rounded-[36px] bg-[#0d1424] border border-blue-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col relative z-10"
            >
                {/* Header Badge */}
                <div className="pt-8 pb-3 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-[0_0_25px_rgba(59,130,246,0.4)] mb-3">
                        <div className="w-full h-full bg-[#0d1424] rounded-2xl flex items-center justify-center">
                            <ShoppingBag className="text-cyan-400" size={28} />
                        </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold">
                        Portal de Compradores
                    </span>
                    <h1 className="text-xl font-black uppercase text-white tracking-tight mt-1">
                        ATOMIC <span className="text-cyan-400">SHOP</span>
                    </h1>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-snug">
                        {mode === "login"
                            ? "Accede a tus pedidos, descuentos y cotizaciones guardadas"
                            : "Crea tu cuenta de cliente para comprar al instante"}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center justify-center gap-8 border-b border-white/[0.06] px-8 pt-2 pb-3 relative">
                    <button
                        type="button"
                        onClick={() => { setMode("login"); setError(""); setSuccess("") }}
                        className={`text-sm font-bold transition-all relative pb-2 cursor-pointer ${
                            mode === "login" ? "text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        Ingresar
                        {mode === "login" && (
                            <motion.div
                                layoutId="compradorActiveTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                            />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(""); setSuccess("") }}
                        className={`text-sm font-bold transition-all relative pb-2 cursor-pointer ${
                            mode === "signup" ? "text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        Crear Cuenta
                        {mode === "signup" && (
                            <motion.div
                                layoutId="compradorActiveTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                            />
                        )}
                    </button>
                </div>

                {/* Form Area */}
                <div className="px-7 py-6 flex-1 flex flex-col justify-between">
                    {/* Alerts */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2"
                            >
                                <AlertCircle size={14} className="shrink-0 text-rose-400" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2"
                            >
                                <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                                <span>{success}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={mode === "login" ? handleLoginSubmit : handleSignUpSubmit} className="space-y-3.5">
                        {mode === "signup" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-cyan-400">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Nombre y Apellidos"
                                        required={mode === "signup"}
                                        className="w-full bg-[#131b2e] hover:bg-[#18233c] focus:bg-[#18233c] border border-white/[0.08] focus:border-cyan-400 text-white rounded-2xl pl-11 pr-4 py-3 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-cyan-400">
                                        <PackageCheck size={16} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="WhatsApp o Teléfono (Opcional)"
                                        className="w-full bg-[#131b2e] hover:bg-[#18233c] focus:bg-[#18233c] border border-white/[0.08] focus:border-cyan-400 text-white rounded-2xl pl-11 pr-4 py-3 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Email */}
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-cyan-400">
                                <Mail size={16} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Correo Electrónico"
                                required
                                autoComplete="email"
                                className="w-full bg-[#131b2e] hover:bg-[#18233c] focus:bg-[#18233c] border border-white/[0.08] focus:border-cyan-400 text-white rounded-2xl pl-11 pr-4 py-3 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-cyan-400">
                                <Lock size={16} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                required
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                className="w-full bg-[#131b2e] hover:bg-[#18233c] focus:bg-[#18233c] border border-white/[0.08] focus:border-cyan-400 text-white rounded-2xl pl-11 pr-11 py-3 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {/* Forgot password */}
                        {mode === "login" && !showReset && (
                            <div className="flex justify-end pt-0.5">
                                <button
                                    type="button"
                                    onClick={() => { setShowReset(true); setError(""); setSuccess("") }}
                                    className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        )}

                        {showReset && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 bg-[#131b2e] border border-cyan-500/30 rounded-2xl space-y-2"
                            >
                                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">
                                    Recuperar Contraseña
                                </span>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Confirma tu correo..."
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResetRequest}
                                        disabled={loading}
                                        className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-[10px] uppercase rounded-xl cursor-pointer"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowReset(false)}
                                    className="text-[9px] text-slate-400 hover:text-white cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={15} />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{mode === "login" ? "Ingresar a la Tienda" : "Crear Cuenta de Comprador"}</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Role selector note / Link to employee login */}
                    <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
                        <p className="text-[11px] text-slate-400">
                            ¿Eres colaborador o asesor de ventas?{" "}
                            <Link href="/login" className="text-cyan-400 hover:underline font-bold">
                                Ingreso Empleados →
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default function CompradorLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-[#070b14] text-cyan-400">
                <Loader2 className="animate-spin" size={36} />
            </div>
        }>
            <CompradorLoginForm />
        </Suspense>
    )
}
