"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ShoppingBag, ArrowRight, Loader2, Phone, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function CompradorRegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: "CONSUMIDOR",
        referredBy: "Tienda Online ATOMIC",
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
                    router.push("/login/comprador")
                }, 2000)
            }
        } catch {
            setError("Error de conexión con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-slate-100 p-6 font-sans">
                <div className="max-w-md w-full bg-[#0d1424] border border-cyan-500/30 p-10 text-center rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={36} className="text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block mb-3">
                        Comprador Verificado
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                        ¡Registro de Cliente Exitoso!
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Tu cuenta de comprador ha sido creada con éxito. Redirigiéndote al acceso para ingresar a la tienda...
                    </p>
                    <Link
                        href="/login/comprador"
                        className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider hover:underline"
                    >
                        Ingresar a la Tienda <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b14] text-slate-100 p-4 sm:p-6 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/web"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all backdrop-blur-md"
                >
                    <ArrowLeft size={14} /> Volver a la Tienda
                </Link>
            </div>

            <div className="w-full max-w-md bg-[#0d1424] border border-blue-500/20 rounded-3xl p-8 shadow-2xl relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                        <ShoppingBag size={12} /> Portal Oficial de Compradores
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                        ATOMIC <span className="text-cyan-400">CLIENTES</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Crea tu perfil para acceder a descuentos, pedidos y seguimiento
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Juan"
                                    className="w-full bg-[#131b2e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Apellido</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Pérez"
                                    className="w-full bg-[#131b2e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@correo.com"
                                className="w-full bg-[#131b2e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">WhatsApp / Teléfono</label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0999999999"
                                className="w-full bg-[#131b2e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full bg-[#131b2e] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={14} /> Creando Cuenta...
                            </>
                        ) : (
                            <>
                                Crear Cuenta de Comprador <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                        ¿Ya tienes cuenta de cliente?{" "}
                        <Link href="/login/comprador" className="text-cyan-400 font-bold hover:underline">
                            Inicia Sesión
                        </Link>
                    </p>
                    <p className="text-[11px] text-slate-500">
                        ¿Eres personal comercial o técnico?{" "}
                        <Link href="/login" className="text-slate-400 font-bold hover:text-white">
                            Acceso Empleados
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function CompradorRegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-[#070b14] text-cyan-400">
                <Loader2 className="animate-spin" size={36} />
            </div>
        }>
            <CompradorRegisterForm />
        </Suspense>
    )
}
