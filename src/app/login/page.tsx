"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
    CheckCircle2, AlertCircle, ShieldCheck, Sparkles, CreditCard,
    Phone, Users, ShoppingBag, GraduationCap
} from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<"login" | "signup">("login")

    // Form fields
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [cedula, setCedula] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("VENDEDOR")

    // State
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showReset, setShowReset] = useState(false)

    // Password reset
    const handleResetRequest = async () => {
        if (!email) return setError("Ingresa tu correo electrónico para continuar")
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
                setSuccess(data.message)
                setShowReset(false)
            } else {
                setError(data.error || "Error al procesar la solicitud")
            }
        } catch {
            setError("Error de conexión al servidor")
        } finally {
            setLoading(false)
        }
    }

    // Login Submit
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Por favor completa todos los campos")
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
                    "Su cuenta está pendiente de aprobación.": "Tu cuenta está pendiente de aprobación por el administrador.",
                    "Su cuenta ha sido desactivada por administración.": "Tu cuenta ha sido desactivada.",
                    "Credenciales incompletas": "Por favor llena todos los campos.",
                }
                setError(errMap[result.error] || result.error || "Credenciales inválidas.")
            } else if (result?.ok) {
                let targetPath = "/dashboard"
                if (role === "CONSUMIDOR") targetPath = "/web"
                else if (role === "CURSOS") targetPath = "/dashboard/academy"
                else targetPath = "/dashboard"
                router.push(targetPath)
                router.refresh()
            } else {
                setError("Ocurrió un error inesperado.")
            }
        } catch {
            setError("Error de conexión con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    // Sign Up Submit
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email || !password) {
            setError("Por favor completa los campos requeridos")
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
                    cedula: cedula.trim() || "0000000000",
                    email: email.trim().toLowerCase(),
                    password,
                    role: role === "CONSUMIDOR" ? "CONSUMIDOR" : "SALESPERSON",
                    phone: phone.trim()
                })
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || "Error al crear la cuenta")
            } else {
                setSuccess(data.message || "¡Cuenta creada exitosamente! Iniciando sesión...")
                setTimeout(async () => {
                    const loginRes = await signIn("credentials", {
                        redirect: false,
                        email: email.trim().toLowerCase(),
                        password,
                    })
                    if (loginRes?.ok) {
                        router.push(role === "CONSUMIDOR" ? "/web" : "/dashboard")
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
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0c1d] p-4 sm:p-6 font-sans text-slate-100 relative overflow-hidden selection:bg-purple-500/30">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Phone/App Style Card matching user's reference */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[390px] rounded-[36px] bg-[#14132b] border border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col relative"
            >
                {/* ── TOP STYLIZED ATOMIC LOGO ──────────────────────── */}
                <div className="pt-10 pb-4 flex flex-col items-center justify-center">
                    <div className="relative group cursor-pointer">
                        {/* Stylized Glowing "A" lettermark */}
                        <div className="w-18 h-18 flex items-center justify-center relative">
                            <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="atomicGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="50%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#c084fc" />
                                    </linearGradient>
                                    <filter id="atomicGlow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                
                                {/* Orbital Ring */}
                                <ellipse cx="50" cy="50" rx="42" ry="16" stroke="url(#atomicGrad)" strokeWidth="3" opacity="0.35" transform="rotate(-25 50 50)" />
                                
                                {/* Bold Curved "A" Lettermark matching reference curved style */}
                                <path
                                    d="M 50 14 C 44 14 39 19 36 26 L 18 70 C 15 77 19 84 27 84 C 32 84 37 80 39 74 L 43 64 L 57 64 L 61 74 C 63 80 68 84 73 84 C 81 84 85 77 82 70 L 64 26 C 61 19 56 14 50 14 Z M 50 36 L 54 52 L 46 52 Z"
                                    fill="url(#atomicGrad)"
                                    filter="url(#atomicGlow)"
                                />
                            </svg>
                        </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-300 font-bold mt-2">
                        Atomic Electronics
                    </span>
                </div>

                {/* ── TAB SWITCHER: LOGIN vs SIGN UP ─────────────────── */}
                <div className="flex items-center justify-center gap-10 border-b border-white/[0.06] px-8 pt-2 pb-3 relative">
                    <button
                        type="button"
                        onClick={() => { setMode("login"); setError(""); setSuccess("") }}
                        className={`text-base font-bold transition-all relative pb-2 ${
                            mode === "login" ? "text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        Login
                        {mode === "login" && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                            />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(""); setSuccess("") }}
                        className={`text-base font-bold transition-all relative pb-2 ${
                            mode === "signup" ? "text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        Sign Up
                        {mode === "signup" && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                            />
                        )}
                    </button>
                </div>

                {/* ── FORM CONTENT ───────────────────────────────────── */}
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

                    {/* Role Selector Pill */}
                    <div className="flex items-center justify-center gap-1.5 mb-5 p-1 rounded-2xl bg-[#1d1c38] border border-white/[0.05]">
                        {[
                            { id: "VENDEDOR", label: "Vendedor", icon: <Users size={12} /> },
                            { id: "CONSUMIDOR", label: "Cliente", icon: <ShoppingBag size={12} /> },
                            { id: "CURSOS", label: "Academia", icon: <GraduationCap size={12} /> },
                        ].map(r => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                                    role === r.id
                                        ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md font-black"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {r.icon}
                                <span>{r.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={mode === "login" ? handleLoginSubmit : handleSignUpSubmit} className="space-y-4">
                        
                        {/* Name Field (In Sign Up Mode) */}
                        {mode === "signup" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-1"
                            >
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-cyan-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Nombre y Apellidos"
                                        required={mode === "signup"}
                                        className="w-full bg-[#1e1d3b] hover:bg-[#232244] focus:bg-[#232244] border border-white/[0.06] focus:border-cyan-400/80 text-white rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-cyan-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                autoComplete="email"
                                className="w-full bg-[#1e1d3b] hover:bg-[#232244] focus:bg-[#232244] border border-white/[0.06] focus:border-cyan-400/80 text-white rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-cyan-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                className="w-full bg-[#1e1d3b] hover:bg-[#232244] focus:bg-[#232244] border border-white/[0.06] focus:border-cyan-400/80 text-white rounded-2xl pl-12 pr-11 py-3.5 text-xs font-medium outline-none transition-all placeholder:text-slate-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-slate-400 hover:text-white transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Forgot password link in Login */}
                        {mode === "login" && !showReset && (
                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={() => { setShowReset(true); setError(""); setSuccess("") }}
                                    className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        )}

                        {/* Password Reset Box */}
                        {showReset && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="p-3 bg-[#1e1d3b] border border-cyan-500/30 rounded-2xl space-y-2"
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
                                        className="px-3 py-1.5 bg-cyan-500 text-black font-black text-[10px] uppercase rounded-xl"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowReset(false)}
                                    className="text-[9px] text-slate-400 hover:text-white"
                                >
                                    Cancelar
                                </button>
                            </motion.div>
                        )}

                        {/* Main Action Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-[#262447] hover:bg-[#312e5c] border border-indigo-500/30 text-white font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin text-cyan-400" size={16} />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{mode === "login" ? "Login" : "Sign Up"}</span>
                                        <ArrowRight size={14} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── BOTTOM DECORATIVE CURVED GRADIENT WAVE ─────────── */}
                <div className="relative mt-auto overflow-hidden">
                    {/* Curved Wave Background */}
                    <div
                        className="w-full pt-10 pb-6 px-6 bg-gradient-to-r from-[#1d4ed8] via-[#6366f1] to-[#a855f7] relative"
                        style={{
                            borderTopLeftRadius: "60% 30px",
                            borderTopRightRadius: "60% 30px"
                        }}
                    >
                        <p className="text-[10px] text-center text-white/90 leading-relaxed font-sans max-w-xs mx-auto drop-shadow">
                            By using this software program you agree to our{" "}
                            <Link href="/web" className="underline font-semibold hover:text-white">
                                privacy policy
                            </Link>{" "}
                            and{" "}
                            <Link href="/web" className="underline font-semibold hover:text-white">
                                terms of use
                            </Link>
                            .
                        </p>
                    </div>
                </div>

            </motion.div>

        </div>
    )
}
