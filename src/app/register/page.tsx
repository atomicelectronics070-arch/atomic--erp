"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, CreditCard, Users, Briefcase, Bell, Sparkles } from "lucide-react"

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
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] p-6 font-sans">
                <div className="max-w-md w-full bg-white border border-slate-200 p-12 text-center relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E3A8A]/5 blur-[80px] rounded-full"></div>
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">ESPERANDO <span className="text-[#1E3A8A]">AUTORIZACIÓN</span></h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                        Tu solicitud ha sido recibida. Solo el administrador central puede autorizar el acceso a este sistema. Por favor, contacta a soporte si la espera es prolongada.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-2 text-[#1E3A8A] font-black text-[10px] uppercase tracking-widest hover:underline">
                        Ir al Login Ahora <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans py-20 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#1E3A8A]/5 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-200 blur-[150px] rounded-full"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-slate-200 bg-white shadow-sm rounded-full mb-8">
                        <Users size={14} className="text-[#1E3A8A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Registro de Nuevos Socios</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                        ÚNETE A <span className="text-[#1E3A8A]">ATOMIC.</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.5em] mt-4 italic">Gestión de Cuentas y Fidelización Corporativa</p>
                </div>

                <div className="bg-white border border-slate-200 p-10 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1E3A8A]/5 blur-[60px] rounded-full"></div>
                    
                    {error && (
                        <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                            <Lock size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        {/* Seccion 1: Identidad */}
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">01. Identificación Personal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombres</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="JUAN ALBERTO"
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none placeholder:text-slate-300 italic" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellidos</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="PEREZ GARCIA"
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none placeholder:text-slate-300 italic" />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cédula de Identidad</label>
                                    <div className="relative group">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <input type="text" name="cedula" required value={formData.cedula} onChange={handleChange} placeholder="0999999999"
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none placeholder:text-slate-300 italic" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion 2: Acceso */}
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">02. Credenciales de Acceso</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Corporativo</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="USUARIO@ATOMIC.COM"
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none placeholder:text-slate-300 italic" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clave de Seguridad</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} placeholder="MINIMO 8 CARACTERES"
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none placeholder:text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion 3: Relacion */}
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">03. Perfil de Colaboración</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Cuenta Solicitada</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <select name="role" value={formData.role} onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none appearance-none cursor-pointer italic">
                                            <option value="CONSUMIDOR">CONSUMIDOR FINAL (PERSONA COMÚN)</option>
                                            <option value="AFILIADO">AFILIADO (SOCIO 15% DESC)</option>
                                            <option value="SALESPERSON">VENDEDOR / DISTRIBUIDOR (SOCIO 20% DESC)</option>
                                            <option value="CURSOS">ESTUDIANTE (PLATAFORMA CURSOS)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referido Por (Usuario Atomic)</label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                                        <input type="text" name="referredBy" required value={formData.referredBy} onChange={handleChange} placeholder="NOMBRE DEL USUARIO"
                                            className="w-full bg-slate-50 border border-slate-200 px-12 py-5 text-[#0F172A] text-xs font-black uppercase tracking-widest focus:border-[#1E3A8A] transition-all outline-none placeholder:text-slate-300 italic" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion 4: Preferencias */}
                        <div className="pt-4">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" name="receivePromotions" checked={formData.receivePromotions} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-6 h-6 border-2 border-slate-200 group-hover:border-[#1E3A8A]/50 transition-all peer-checked:bg-[#1E3A8A] peer-checked:border-[#1E3A8A] flex items-center justify-center">
                                        <Bell size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#0F172A] transition-colors italic">Deseo recibir ofertas exclusivas y promociones tecnológicas</span>
                            </label>
                        </div>

                        <div className="pt-10">
                            <button type="submit" disabled={loading}
                                className="w-full py-6 px-10 bg-[#1E3A8A] hover:bg-[#0F172A] text-white font-black text-[11px] uppercase tracking-[0.5em] transition-all disabled:opacity-50 shadow-xl shadow-[#1E3A8A]/10 flex justify-center items-center gap-4 group active:scale-[0.98] italic">
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

                    <div className="mt-16 text-center border-t border-slate-100 pt-10">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                            ¿Ya posees una cuenta autorizada?{" "}
                            <Link href="/login" className="text-[#1E3A8A] hover:underline transition-colors ml-2">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                    <Sparkles size={12} className="text-[#1E3A8A]/40" />
                    Atomic Core System v7.0.0 Stable
                </div>
            </div>
        </div>
    )
}
