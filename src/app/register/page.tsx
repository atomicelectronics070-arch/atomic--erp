"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profileData: "",
        aspirations: "",
        availability: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

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
                throw new Error(data.error || "Something went wrong")
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 4000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh p-4 relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-none bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-none bg-pink-600/10 blur-[120px]" />
                
                <div className="w-full max-w-md glass-panel p-12 text-center relative z-10 rounded-none-[3rem] border-white/5 shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-none flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">Solicitud <span className="text-primary">Enviada</span></h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                        Tu protocolo de acceso ha sido recibido y se encuentra en fase de validación administrativa. Serás redirigido en breve.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh p-4 py-20 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-none bg-indigo-500/5 blur-[150px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-none bg-pink-500/5 blur-[150px]" />

            <div className="w-full max-w-3xl glass-panel p-12 relative z-10 rounded-none-[3.5rem] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center space-x-3 text-primary mb-4">
                        <div className="w-2 h-2 rounded-none bg-primary animate-pulse shadow-[0_0_10px_currentColor]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] Protocolo de Reclutamiento">Protocolo de Reclutamiento</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Únete a <span className="text-primary">ATOMIC</span> INDUSTRIES</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-4">Inyecta tus credenciales para la fase de aprobación sistémica</p>
                </div>

                {error && (
                    <div className="mb-10 p-6 bg-red-950/20 border-l-4 border-red-500 text-red-400 text-[11px] font-black uppercase tracking-widest rounded-none animate-in slide-in-from-left-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Identidad Civil</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="NOMBRE COMPLETO"
                                className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-none text-white text-xs font-black uppercase tracking-widest focus:border-primary transition-all outline-none placeholder:text-slate-800" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Vector de Comunicación</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="EMAIL CORPORATIVO"
                                className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-none text-white text-xs font-black uppercase tracking-widest focus:border-primary transition-all outline-none placeholder:text-slate-800" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Clave de Acceso</label>
                        <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} placeholder="MÍNIMO 8 CARACTERES"
                            className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-none text-white text-xs font-black uppercase tracking-widest focus:border-primary transition-all outline-none placeholder:text-slate-800" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Perfil & Trayectoria</label>
                        <textarea name="profileData" rows={3} required value={formData.profileData} onChange={handleChange} placeholder="DESCRIPCIÓN TÁCTICA DE TU PERFIL..."
                            className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-none text-white text-xs font-black uppercase tracking-widest focus:border-primary transition-all outline-none resize-none placeholder:text-slate-800 italic" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Misión & Aspiraciones</label>
                        <textarea name="aspirations" rows={2} required value={formData.aspirations} onChange={handleChange} placeholder="OBJETIVOS DENTRO DEL ECOSISTEMA..."
                            className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-none text-white text-xs font-black uppercase tracking-widest focus:border-primary transition-all outline-none resize-none placeholder:text-slate-800 italic" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 italic">Parámetro de Disponibilidad</label>
                        <input type="text" name="availability" required value={formData.availability} onChange={handleChange} placeholder="EJ: TIEMPO COMPLETO / 40 HRS WEEK"
                            className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-none text-white text-xs font-black uppercase tracking-widest focus:border-primary transition-all outline-none placeholder:text-slate-800" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-6 px-4 bg-primary hover:bg-white hover:text-primary text-white rounded-none font-black text-[11px] uppercase tracking-[0.5em] transition-all disabled:opacity-50 mt-10 shadow-[0_20px_60px_-10px_rgba(99,102,241,0.4)] flex justify-center items-center active:scale-[0.98]">
                        {loading ? "Sincronizando..." : "Enviar Protocolo de Solicitud"}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">¿Ya posees autorización? </span>
                    <Link href="/login" className="text-primary hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest underline underline-offset-8">
                        Inicia Sesión Aquí
                    </Link>
                </div>
            </div>
        </div>
    )
}




