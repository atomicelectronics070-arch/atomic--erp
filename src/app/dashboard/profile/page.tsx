"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
    User, Mail, Phone, MapPin, Camera, 
    Save, ShieldCheck, Loader2, Award,
    Sparkles, Trash2, Edit3, Building2,
    ChevronRight, LogOut, Key
} from "lucide-react"

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        residenceSector: "",
        profilePicture: ""
    })

    const [requestRole, setRequestRole] = useState("")

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/user/profile")
            if (res.ok) {
                const data = await res.json()
                setFormData({
                    name: data.name || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    residenceSector: data.residenceSector || "",
                    profilePicture: data.profilePicture || ""
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({
                    ...formData,
                    requestRoleChange: requestRole
                })
            })
            if (res.ok) {
                alert("SINCRO-IDENTIDAD: Perfil actualizado exitosamente.")
                await update() // Update session
                if (requestRole) setRequestRole("")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-40">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 relative">
             {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-none bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] rounded-none bg-secondary/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                     <div className="flex items-center space-x-4 mb-4 text-primary">
                        <ShieldCheck size={20} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Seguridad de Identidad v2.1</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        PERFIL DE <span className="text-primary underline decoration-primary/30 underline-offset-8">USUARIO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Configuración de parámetros de identidad corporativa y credenciales de acceso al sistema ATOMIC INDUSTRIAS.
                    </p>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
                {/* Profile Card */}
                <div className="xl:col-span-1 space-y-12">
                     <div className="glass-panel border-white/10 p-12 rounded-none-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl backdrop-blur-xl flex flex-col items-center">
                        <div className="relative group mb-10">
                            <div className="w-48 h-48 bg-slate-950 border border-white/10 flex items-center justify-center text-primary text-7xl font-black italic shadow-inner rounded-none relative overflow-hidden">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    formData.name?.[0] || "U"
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                                    <Camera size={24} className="text-white" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Cambiar Foto</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{formData.name} {formData.lastName}</h3>
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 mt-4">
                                <Award size={14} className="text-primary" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">{session?.user?.role}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-6 pt-10 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-black italic">
                                <span className="text-slate-500 uppercase tracking-widest">Estado Sist:</span>
                                <span className="text-emerald-500 uppercase tracking-[0.3em]">NÚCLEO_ACTIVO</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black italic">
                                <span className="text-slate-500 uppercase tracking-widest">ID Operativo:</span>
                                <span className="text-white opacity-40">#{session?.user?.id?.slice(-8).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel border-white/10 p-10 rounded-none-[3rem] bg-slate-950/40 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={120} /></div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic mb-6">Solicitud de Cambio de Rol</h3>
                        <div className="space-y-4">
                             <select 
                                value={requestRole}
                                onChange={(e) => setRequestRole(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all italic shadow-inner"
                             >
                                <option value="">SELECCIONAR NUEVO RANGO...</option>
                                <option value="ADMIN">ADMINISTRADOR</option>
                                <option value="MANAGEMENT">GERENCIA</option>
                                <option value="COORDINATOR">COORDINADOR</option>
                             </select>
                             <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic leading-relaxed">
                                Esta solicitud enviará una notificación formal al administrador para su revisión y aprobación.
                             </p>
                        </div>
                    </div>
                </div>

                {/* Form Editor */}
                <div className="xl:col-span-2">
                    <form onSubmit={handleSave} className="glass-panel border-white/10 p-16 rounded-none-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 text-primary pointer-events-none -rotate-12"><User size={200} /></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Nombre Operativo</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors"><Edit3 size={18} /></div>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                                        className="w-full bg-slate-950 border border-white/5 pl-16 pr-8 py-6 text-sm font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all shadow-inner italic"
                                        placeholder="NOMBRE..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Apellidos</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors"><Edit3 size={18} /></div>
                                    <input 
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value.toUpperCase()})}
                                        className="w-full bg-slate-950 border border-white/5 pl-16 pr-8 py-6 text-sm font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all shadow-inner italic"
                                        placeholder="APELLIDOS..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Correo Institucional</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 transition-colors"><Mail size={18} /></div>
                                    <input 
                                        type="email"
                                        disabled
                                        value={formData.email}
                                        className="w-full bg-slate-950 border border-white/5 pl-16 pr-8 py-6 text-sm font-black tracking-widest text-slate-600 outline-none rounded-none italic cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Teléfono de Contacto</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors"><Phone size={18} /></div>
                                    <input 
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                        className="w-full bg-slate-950 border border-white/5 pl-16 pr-8 py-6 text-sm font-black tracking-widest text-white outline-none rounded-none focus:border-primary transition-all shadow-inner italic"
                                        placeholder="+593..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Sector de Residencia</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors"><MapPin size={18} /></div>
                                    <input 
                                        type="text"
                                        value={formData.residenceSector}
                                        onChange={(e) => setFormData({...formData, residenceSector: e.target.value.toUpperCase()})}
                                        className="w-full bg-slate-950 border border-white/5 pl-16 pr-8 py-6 text-sm font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all shadow-inner italic"
                                        placeholder="CIUDAD, SECTOR, CALLES..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                            <button 
                                type="submit"
                                disabled={saving}
                                className="w-full bg-primary text-white px-16 py-7 text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_25px_60px_-10px_rgba(99,102,241,0.6)] rounded-none-[2.5rem] skew-x-[-12deg] group flex items-center justify-center gap-5"
                            >
                                <div className="skew-x-[12deg] flex items-center gap-4">
                                    {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                    <span>{saving ? 'SINCRONIZANDO...' : 'Sincronizar Identidad'}</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
