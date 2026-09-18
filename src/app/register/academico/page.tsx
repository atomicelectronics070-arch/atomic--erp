"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ArrowRight, Loader2, Phone, GraduationCap, CheckCircle2 } from "lucide-react"

function AcademicoRegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        cedula: "",
        email: "",
        password: "",
        phone: "",
        role: "ACADEMIA",
        referredBy: "Academia Digital ATOMIC",
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
                <div className="max-w-md w-full bg-[#0F1420] border border-indigo-500/30 p-10 text-center rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={36} className="text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block mb-3">
                        Perfil Académico Creado
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                        ¡Bienvenido a la Academia!
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Tu perfil de estudiante ha sido activado. Ingresa al sistema para acceder a tus cursos, capacitaciones y certificaciones técnicas.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider hover:underline"
                    >
                        Ingresar a la Plataforma <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090E] text-slate-100 p-4 sm:p-6 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#0F1420] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        <GraduationCap size={12} /> Academia Digital & Capacitación
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                        ATOMIC <span className="text-indigo-400">ACADEMIA</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Crea tu perfil de estudiante para certificar tus habilidades técnicas
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
                                placeholder="Ej: Diana Paredes"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
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
                            placeholder="Número de cédula para certificado"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
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
                                placeholder="Ej: 0991234567"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Correo Electrónico</label>
                        <div className="relative flex items-center">
                            <Mail size={16} className="absolute left-3.5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="estudiante@ejemplo.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
                            />
                        </div>
                    </div>

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin text-white" size={16} />
                                    <span>Creando Matrícula...</span>
                                </>
                            ) : (
                                <>
                                    <span>Registrar Perfil Académico</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <p className="text-[11px] text-slate-400">
                        ¿Ya tienes una cuenta de alumno?{" "}
                        <Link href="/login" className="text-indigo-400 font-bold hover:underline">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function AcademicoRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#07090E] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}>
            <AcademicoRegisterForm />
        </Suspense>
    )
}
