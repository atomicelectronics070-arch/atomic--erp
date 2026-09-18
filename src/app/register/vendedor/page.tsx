"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, Phone, Briefcase, Sparkles, CheckCircle2 } from "lucide-react"

function VendedorRegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        cedula: "",
        email: "",
        password: "",
        phone: "",
        role: "SALESPERSON",
        referredBy: "Plan Laboral 30 Días",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Error al procesar el registro.")
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 2500)
            }
        } catch {
            setError("Error de conexión con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#07090E] text-slate-100 p-6 font-sans">
                <div className="max-w-md w-full bg-[#0F1420] border border-cyan-500/30 p-10 text-center rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={36} className="text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block mb-3">
                        Plan 30 Días Habilitado
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                        ¡Registro de Vendedor Exitoso!
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Tu cuenta ha sido creada y aprobada de forma automática. Te estamos redirigiendo al login para que ingreses y comiences a registrar tus evidencias diarias.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider hover:underline"
                    >
                        Ingresar Ahora <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090E] text-slate-100 p-4 sm:p-6 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#0F1420] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        <Briefcase size={12} /> Registro Oficial de Asesores ATOMIC Ventas
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                        ATOMIC <span className="text-cyan-400">VENTAS</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Crea tu perfil de vendedor para iniciar tu Plan Laboral de 30 Días
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Nombres y Apellidos</label>
                        <div className="relative flex items-center">
                            <User size={16} className="absolute left-3.5 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Carlos Mendoza"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Número de Cédula o Identificación</label>
                        <input
                            type="text"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            placeholder="Número de cédula para contrato"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Teléfono / WhatsApp de Contacto</label>
                        <div className="relative flex items-center">
                            <Phone size={16} className="absolute left-3.5 text-slate-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Ej: 0969043453"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Correo Electrónico (Para Iniciar Sesión)</label>
                        <div className="relative flex items-center">
                            <Mail size={16} className="absolute left-3.5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tuemail@ejemplo.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Contraseña</label>
                        <div className="relative flex items-center">
                            <Lock size={16} className="absolute left-3.5 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin text-slate-950" size={16} />
                                    <span>Registrando Perfil...</span>
                                </>
                            ) : (
                                <>
                                    <span>Habilitar Mi Cuenta de Vendedor</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <p className="text-[11px] text-slate-400">
                        ¿Ya tienes una cuenta activa?{" "}
                        <Link href="/login" className="text-cyan-400 font-bold hover:underline">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function VendedorRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#07090E] flex items-center justify-center"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>}>
            <VendedorRegisterForm />
        </Suspense>
    )
}
