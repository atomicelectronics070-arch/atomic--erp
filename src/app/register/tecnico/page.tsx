"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ArrowRight, Loader2, Phone, Wrench, CheckCircle2 } from "lucide-react"

function TecnicoRegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        cedula: "",
        email: "",
        password: "",
        phone: "",
        role: "TECNICO",
        referredBy: "Red Técnica Homologada ATOMIC",
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
                <div className="max-w-md w-full bg-[#0F1420] border border-amber-500/30 p-10 text-center rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={36} className="text-amber-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block mb-3">
                        Red Técnica Homologada
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                        ¡Registro Técnico Completado!
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Tu perfil de instalador y técnico homologado ha sido creado. Ingresa al sistema para consultar órdenes de servicio, protocolos de instalación y garantías.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider hover:underline"
                    >
                        Ingresar a la Plataforma <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090E] text-slate-100 p-4 sm:p-6 font-sans selection:bg-amber-500/30 relative overflow-hidden">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#0F1420] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        <Wrench size={12} /> Red Técnica Homologada
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                        ATOMIC <span className="text-amber-400">TÉCNICOS</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Forma parte de la red de instaladores y especialistas de campo de ATOMIC
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
                                placeholder="Ej: Roberto Vaca"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
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
                            placeholder="Número de cédula para homologación"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
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
                                placeholder="Ej: 0987654321"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
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
                                placeholder="tecnico@ejemplo.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
                            />
                        </div>
                    </div>

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin text-slate-950" size={16} />
                                    <span>Homologando Perfil...</span>
                                </>
                            ) : (
                                <>
                                    <span>Registrar Perfil Técnico</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <p className="text-[11px] text-slate-400">
                        ¿Ya estás registrado como técnico?{" "}
                        <Link href="/login" className="text-amber-400 font-bold hover:underline">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function TecnicoRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#07090E] flex items-center justify-center"><Loader2 className="animate-spin text-amber-400" size={32} /></div>}>
            <TecnicoRegisterForm />
        </Suspense>
    )
}
