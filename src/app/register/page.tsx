"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, CreditCard, Users, Briefcase, Bell } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        cedula: "",
        email: "",
        password: "",
        role: "CONSUMIDOR",
        referredBy: "",
        receivePromotions: true
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        })
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
                setError(data.error || "Error al procesar la solicitud.")
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 5000)
            }
        } catch (err) {
            setError("Error de conexion con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6">
                <div className="max-w-md w-full glass-panel p-12 text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8341A]/20 blur-[80px] rounded-none"></div>
                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">ESPERANDO <span className="text-[#E8341A]">AUTORIZACIÓN</span></h2>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                        Tu solicitud ha sido recibida. Solo el administrador central puede autorizar el acceso a este sistema. Por favor, contacta a soporte si la espera es prolongada.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-2 text-[#E8341A] font-black text-[10px] uppercase tracking-widest hover:underline">
                        Ir al Login Ahora <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans py-20 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2563EB]/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#E8341A]/20 bg-[#E8341A]/5 backdrop-blur-md mb-8">
                        <Users size={14} className="text-[#E8341A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8341A]">Registro de Nuevos Socios</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                        UNETE A <span className="text-[#E8341A]">ATOMIC.</span>
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-[0.5em] mt-4">Gestion de Cuentas y Fidelizacion Corporativa</p>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-3xl p-10 md:p-16 shadow-2xl">
                    {error && (
                        <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                            <Lock size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Seccion 1: Identidad */}
                        <div>
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">01. Identificacion Personal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nombres</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="JUAN ALBERTO"
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none placeholder:text-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Apellidos</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="PEREZ GARCIA"
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none placeholder:text-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Cedula de Identidad</label>
                                    <div className="relative group">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <input type="text" name="cedula" required value={formData.cedula} onChange={handleChange} placeholder="0999999999"
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none placeholder:text-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion 2: Acceso */}
                        <div>
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">02. Credenciales de Acceso</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Corporativo</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="USUARIO@ATOMIC.COM"
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none placeholder:text-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Clave de Seguridad</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} placeholder="MINIMO 8 CARACTERES"
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none placeholder:text-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion 3: Relacion */}
                        <div>
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">03. Perfil de Colaboracion</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Tipo de Cuenta Solicitada</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <select name="role" value={formData.role} onChange={handleChange}
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none appearance-none cursor-pointer">
                                            <option value="CONSUMIDOR">CONSUMIDOR FINAL (PERSONA COMUN)</option>
                                            <option value="AFILIADO">AFILIADO (SOCIO 15% DESC)</option>
                                            <option value="SALESPERSON">VENDEDOR / DISTRIBUIDOR (SOCIO 20% DESC)</option>
                                            <option value="CURSOS">ESTUDIANTE (PLATAFORMA CURSOS)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Referido Por (Usuario Atomic)</label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                                        <input type="text" name="referredBy" required value={formData.referredBy} onChange={handleChange} placeholder="NOMBRE DEL USUARIO"
                                            className="w-full bg-black/50 border border-white/10 px-12 py-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] transition-all outline-none placeholder:text-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion 4: Preferencias */}
                        <div className="pt-4">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" name="receivePromotions" checked={formData.receivePromotions} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-6 h-6 border-2 border-white/10 group-hover:border-[#E8341A]/50 transition-all peer-checked:bg-[#E8341A] peer-checked:border-[#E8341A] flex items-center justify-center">
                                        <Bell size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors italic">Deseo recibir ofertas exclusivas y promociones tecnologicas</span>
                            </label>
                        </div>

                        <div className="pt-10">
                            <button type="submit" disabled={loading}
                                className="w-full py-6 px-10 bg-[#E8341A] hover:bg-white hover:text-[#E8341A] text-white rounded-none font-black text-[11px] uppercase tracking-[0.5em] transition-all disabled:opacity-50 shadow-[0_20px_50px_rgba(232,52,26,0.3)] flex justify-center items-center gap-4 group active:scale-[0.98]">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Enviar Solicitud de Registro <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-16 text-center border-t border-white/5 pt-10">
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                            Ya posees una cuenta autorizada?{" "}
                            <Link href="/login" className="text-[#E8341A] hover:text-white transition-colors underline underline-offset-8 ml-2">
                                Iniciar Sesion
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
