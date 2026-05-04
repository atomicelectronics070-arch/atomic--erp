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
    const [success, setSuccess] = useState("")

    const handleResetRequest = async () => {
        if (!email) return setError("Ingrese su email para continuar")
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
            setError("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError("Complete todos los campos")
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
                    "Su cuenta está pendiente de aprobación.": "Su cuenta está pendiente de aprobación por el administrador.",
                    "Su cuenta ha sido desactivada por administración.": "Su cuenta ha sido desactivada. Contacte al administrador.",
                    "Credenciales incompletas": "Complete todos los campos requeridos.",
                }
                setError(errMap[result.error] || result.error || "Credenciales inválidas. Verifique su acceso.")
            } else if (result?.ok) {
                let targetPath = "/dashboard"
                if (section === "CONSUMIDOR") targetPath = "/web"
                else if (section === "CURSOS") targetPath = "/dashboard/academy"
                else targetPath = "/dashboard"
                router.push(targetPath)
                router.refresh()
            } else {
                setError("Error inesperado. Intente nuevamente.")
            }
        } catch {
            setError("Error de conexión con el servidor central.")
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        { id: "VENDEDOR", label: "Vendedor", icon: <Users size={14} /> },
        { id: "CONSUMIDOR", label: "Cliente", icon: <ShoppingBag size={14} /> },
        { id: "CURSOS", label: "Academia", icon: <GraduationCap size={14} /> },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] overflow-hidden relative font-sans">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1E3A8A]/3 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3B82F6]/3 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'radial-gradient(circle, #1E3A8A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-10">

                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 border-2 border-[#1E3A8A] flex items-center justify-center">
                            <div className="w-3 h-3 bg-[#1E3A8A]" />
                        </div>
                        <span className="text-sm font-black text-[#0F172A] tracking-[0.3em] uppercase">ATOMIC ERP</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acceso Corporativo Seguro</span>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 shadow-2xl shadow-slate-200/80 p-8">

                    <div className="mb-8">
                        <h1 className="text-xl font-black text-[#0F172A] uppercase tracking-tight mb-1">
                            Iniciar Sesión
                        </h1>
                        <p className="text-[11px] font-medium text-slate-400">Seleccione su perfil de acceso</p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* Role selector */}
                        <div className="grid grid-cols-3 gap-2">
                            {roles.map((role) => (
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

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Correo Corporativo
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 text-[#0F172A] text-sm font-bold focus:border-[#1E3A8A] focus:bg-white transition-all outline-none placeholder:text-slate-300"
                                    placeholder="usuario@atomic.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-4 py-4 border border-slate-200 bg-slate-50 text-[#0F172A] text-sm font-bold focus:border-[#1E3A8A] focus:bg-white transition-all outline-none placeholder:text-slate-300"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 px-6 bg-[#1E3A8A] hover:bg-[#0F172A] text-white font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-xl shadow-[#1E3A8A]/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Verificando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Iniciar Sesión</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer links */}
                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                        {!showReset ? (
                            <button
                                onClick={() => { setShowReset(true); setError(""); setSuccess("") }}
                                className="w-full text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#1E3A8A] transition-colors text-center"
                            >
                                ¿Olvidó su contraseña?
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-[#1E3A8A] uppercase tracking-widest">Solicitud de Reseteo</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Confirme su correo..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 text-[10px] font-bold text-[#0F172A] outline-none focus:border-[#1E3A8A]"
                                    />
                                    <button
                                        onClick={handleResetRequest}
                                        disabled={loading}
                                        className="bg-[#1E3A8A] px-4 py-3 text-[10px] font-black text-white uppercase disabled:opacity-50"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowReset(false)}
                                    className="text-[8px] font-black text-slate-300 uppercase tracking-widest hover:text-[#0F172A] transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                            ¿Sin acceso?{" "}
                            <Link href="/register" className="text-[#1E3A8A] hover:underline font-black ml-1">
                                Solicitar Registro
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center flex flex-col items-center gap-2">
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
