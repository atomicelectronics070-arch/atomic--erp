"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Loader2, Users, ShoppingBag, GraduationCap } from "lucide-react"

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
                    "Su cuenta está pendiente de aprobación.": "Cuenta pendiente de aprobación.",
                    "Su cuenta ha sido desactivada por administración.": "Cuenta desactivada.",
                    "Credenciales incompletas": "Campos incompletos.",
                }
                setError(errMap[result.error] || result.error || "Credenciales inválidas.")
            } else if (result?.ok) {
                let targetPath = "/dashboard"
                if (section === "CONSUMIDOR") targetPath = "/web"
                else if (section === "CURSOS") targetPath = "/dashboard/academy"
                else targetPath = "/dashboard"
                router.push(targetPath)
                router.refresh()
            } else {
                setError("Error inesperado.")
            }
        } catch {
            setError("Error de conexión.")
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
        <div className="min-h-screen flex items-center justify-center bg-white text-black overflow-hidden relative font-sans selection:bg-black/10">

            {/* Subtle background texture */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                         linear-gradient(to bottom, #000 1px, transparent 1px)`,
                        backgroundSize: `80px 80px`
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-4">
                        <AtomLogo />
                    </div>
                    <span className="text-2xl font-black text-black tracking-[0.15em] uppercase leading-none">
                        ATOMIC
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                        Acceso Seguro
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white border border-zinc-200 rounded-2xl w-full p-8 shadow-2xl shadow-black/5">
                    
                    <div className="mb-8 text-center">
                        <h1 className="text-xl font-black text-black uppercase tracking-[0.1em] mb-1">
                            Iniciar Sesión
                        </h1>
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Seleccione perfil</p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-5 p-3 bg-red-50/50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-xl">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-5 p-3 bg-emerald-50/50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-xl">
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
                                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest
                                        ${section === role.id 
                                            ? 'bg-black border-black text-white' 
                                            : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100 hover:text-black'}`}
                                >
                                    {role.icon} {role.label}
                                </button>
                            ))}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                                Correo
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-zinc-50 text-black text-sm font-bold focus:border-black focus:bg-white transition-all outline-none placeholder:text-zinc-300"
                                    placeholder="usuario@atomic.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 bg-zinc-50 text-black text-sm font-bold focus:border-black focus:bg-white transition-all outline-none placeholder:text-zinc-300"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-xl bg-black hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-[0.25em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Verificando</span>
                                </>
                            ) : (
                                <>
                                    <span>Acceder</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer links */}
                    <div className="mt-8 pt-6 border-t border-zinc-100 space-y-4">
                        {!showReset ? (
                            <button
                                onClick={() => { setShowReset(true); setError(""); setSuccess("") }}
                                className="w-full text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:text-black transition-colors text-center"
                            >
                                ¿Olvidó su contraseña?
                            </button>
                        ) : (
                            <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <p className="text-[9px] font-black text-black uppercase tracking-widest">Reseteo de Clave</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Confirme su correo..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-[10px] font-bold text-black outline-none focus:border-black"
                                    />
                                    <button
                                        onClick={handleResetRequest}
                                        disabled={loading}
                                        className="bg-black rounded-lg px-4 py-2 text-[10px] font-black text-white uppercase disabled:opacity-50"
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowReset(false)}
                                    className="text-[8px] font-black text-zinc-400 uppercase tracking-widest hover:text-black transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                            ¿Sin acceso?{" "}
                            <Link href="/register" className="text-black hover:underline font-black ml-1">
                                Solicitar Registro
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center flex flex-col items-center gap-2">
                    <div className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
                        &copy; 2026 ATOMIC INDUSTRIAS
                    </div>
                </div>
            </div>
        </div>
    )
}

function AtomLogo() {
    return (
        <svg width="48" height="48" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="5" fill="#000" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />
            <circle cx="66" cy="36" r="2.5" fill="#000" />
            <circle cx="21" cy="10.5" r="2.5" fill="#000" />
            <circle cx="21" cy="61.5" r="2.5" fill="#000" />
        </svg>
    )
}
