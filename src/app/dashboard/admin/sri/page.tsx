"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
    Shield, FileCode, Key, Server, CheckCircle2, 
    AlertCircle, Upload, Save, Building, Info, 
    Zap, Globe, Lock
} from "lucide-react"
import { CyberCard, NeonButton, GlassPanel, CyberInput } from "@/components/ui/CyberUI"

export default function SRISettingsPage() {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [formData, setFormData] = useState({
        ruc: "",
        businessName: "",
        environment: "pruebas",
        establishment: "001",
        emissionPoint: "001",
        certificatePassword: "",
        sequentialInvoice: "000000001"
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/sri");
                if (res.ok) {
                    const data = await res.json();
                    if (data.ruc) {
                        setFormData({
                            ruc: data.ruc,
                            businessName: data.businessName,
                            environment: data.environment,
                            establishment: data.establishment,
                            emissionPoint: data.emissionPoint,
                            certificatePassword: data.password || "",
                            sequentialInvoice: data.lastSequential?.toString().padStart(9, '0') || "000000001"
                        });
                    }
                }
            } catch (err) {
                console.error("Fetch SRI settings failed", err);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/sri", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ruc: formData.ruc,
                    businessName: formData.businessName,
                    environment: formData.environment,
                    establishment: formData.establishment,
                    emissionPoint: formData.emissionPoint,
                    password: formData.certificatePassword
                })
            });
            
            if (res.ok) {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            }
        } catch (error) {
            console.error("Save error", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[#E8341A] mb-2">
                        <Shield size={18} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Seguridad & Tributación</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        FACTURACIÓN <span className="text-[#E8341A]">SRI</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        Configuración de Firma Electrónica y Emisión de Comprobantes
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className={`px-4 py-2 border flex items-center gap-3 ${formData.environment === 'produccion' ? 'border-red-500/50 bg-red-500/10' : 'border-emerald-500/50 bg-emerald-500/10'}`}>
                        <div className={`w-2 h-2 rounded-full ${formData.environment === 'produccion' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Entorno: {formData.environment}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    <CyberCard className="space-y-8 !p-8">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <Building size={20} className="text-[#E8341A]" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Datos del Emisor</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">RUC de la Empresa</label>
                                <CyberInput 
                                    value={formData.ruc}
                                    onChange={(val) => setFormData({...formData, ruc: val})}
                                    placeholder="17XXXXXXXX001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Razón Social</label>
                                <CyberInput 
                                    value={formData.businessName}
                                    onChange={(val) => setFormData({...formData, businessName: val})}
                                    placeholder="Nombre oficial del RUC"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Establecimiento</label>
                                <CyberInput 
                                    value={formData.establishment}
                                    onChange={(val) => setFormData({...formData, establishment: val})}
                                    placeholder="001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Punto de Emisión</label>
                                <CyberInput 
                                    value={formData.emissionPoint}
                                    onChange={(val) => setFormData({...formData, emissionPoint: val})}
                                    placeholder="001"
                                />
                            </div>
                        </div>
                    </CyberCard>

                    <CyberCard className="space-y-8 !p-8 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-8 opacity-5">
                            <Key size={80} />
                        </div>
                        
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <Lock size={20} className="text-[#E8341A]" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Firma Electrónica (.p12)</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-white/10 p-10 text-center hover:border-[#E8341A]/50 transition-all cursor-pointer group bg-white/[0.02]">
                                <Upload size={32} className="mx-auto text-slate-600 group-hover:text-[#E8341A] transition-colors mb-4" />
                                <p className="text-xs font-black text-white uppercase tracking-widest">Arrastra tu archivo .p12 aquí</p>
                                <p className="text-[9px] text-slate-500 mt-2 uppercase">Tamaño máximo: 2MB</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Contraseña del Certificado</label>
                                <div className="relative">
                                    <CyberInput 
                                        type="password"
                                        value={formData.certificatePassword}
                                        onChange={(val) => setFormData({...formData, certificatePassword: val})}
                                        placeholder="••••••••••••"
                                    />
                                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                </div>
                            </div>
                        </div>
                    </CyberCard>
                </div>

                {/* Sidebar / Status */}
                <div className="space-y-8">
                    <GlassPanel className="!p-8 space-y-6 border-[#E8341A]/20">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Estado del Sistema</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Firma Cargada</span>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Token SRI</span>
                                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 font-mono">ACTIVE_VALID</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                <Server size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Servidor SOAP Online</span>
                            </div>
                            <p className="text-[8px] text-slate-600 uppercase leading-relaxed">Conexión directa con los Web Services del SRI establecida satisfactoriamente.</p>
                        </div>
                    </GlassPanel>

                    <CyberCard className="!p-8">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6">Acciones Rápidas</h3>
                        <div className="space-y-4">
                            <button className="w-full py-4 border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-widest transition-all text-left px-6 flex items-center justify-between group">
                                Prueba de Conexión <Zap size={14} className="text-[#E8341A] group-hover:scale-125 transition-transform" />
                            </button>
                            <button className="w-full py-4 border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-widest transition-all text-left px-6 flex items-center justify-between group">
                                Sincronizar Secuenciales <Globe size={14} className="text-blue-500 group-hover:scale-125 transition-transform" />
                            </button>
                        </div>
                    </CyberCard>

                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-[#E8341A] hover:bg-[#E8341A]/80 text-white py-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(232,52,26,0.3)] disabled:opacity-50"
                    >
                        {loading ? "PROCESANDO..." : saved ? "GUARDADO CON ÉXITO" : (
                            <>
                                <Save size={18} />
                                <span>Guardar Configuración</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Info Footer */}
            <GlassPanel className="!p-10 flex flex-col md:flex-row items-center gap-8 opacity-60">
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Info size={24} className="text-blue-400" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-2 italic">Sobre la Firma Electrónica en Ecuador</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight">
                        La firma debe ser en formato .p12 emitida por una entidad certificadora autorizada (BCE, Security Data, ANF, etc). 
                        Recuerde que para el entorno de producción, su RUC debe tener el convenio de débito bancario activo en el portal del SRI.
                    </p>
                </div>
            </GlassPanel>
        </div>
    )
}
