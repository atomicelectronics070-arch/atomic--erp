"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
    User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, Phone, Briefcase, 
    Sparkles, CheckCircle2, ChevronRight, Zap, TrendingUp, Calendar, 
    Clock, Award, HelpCircle, Check, DollarSign 
} from "lucide-react"

type ModalityType = "PLAN_LABORAL_30D" | "COMISIONISTA_AFILIADO"

function VendedorRegisterForm() {
    const router = useRouter()
    const [modality, setModality] = useState<ModalityType>("PLAN_LABORAL_30D")
    const [showDetailsModal, setShowDetailsModal] = useState<ModalityType | null>(null)
    
    // Step 1: Form data, Step 2: OTP verification
    const [step, setStep] = useState<"FORM" | "OTP">("FORM")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })
    const [otpCode, setOtpCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Paso 1: Enviar código OTP al correo
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register-vendedor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "send_code",
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    modality
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Error al solicitar código de verificación.")
            } else {
                setStep("OTP")
            }
        } catch {
            setError("Error de conexión con el servidor. Revisa tu red.")
        } finally {
            setLoading(false)
        }
    }

    // Paso 2: Verificar código y activar automáticamente
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register-vendedor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "verify_code",
                    email: formData.email,
                    code: otpCode
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Código de verificación inválido.")
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login?registered=true")
                }, 3000)
            }
        } catch {
            setError("Error al validar código.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#07090E] text-slate-100 p-6 font-sans">
                <div className="max-w-md w-full bg-[#0F1420] border border-cyan-500/40 p-8 sm:p-10 text-center rounded-3xl shadow-2xl shadow-cyan-950/40 relative overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={36} className="text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block mb-3">
                        {modality === "PLAN_LABORAL_30D" ? "Plan Laboral 30 Días" : "Vendedor Afiliado"}
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                        ¡Registro y Activación Exitosa!
                    </h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        ¡Felicidades, <strong className="text-white">{formData.name}</strong>! Tu cuenta ha sido activada automáticamente como Vendedor Oficial de ATOMIC. 🚀
                    </p>
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-left mb-6 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                            <Check size={14} className="text-cyan-400 shrink-0" />
                            <span>Mensaje oficial de bienvenida enviado a tu WhatsApp.</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                            <Check size={14} className="text-cyan-400 shrink-0" />
                            <span>Asistente inteligente configurado para acompañarte en tu ruta.</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <Loader2 size={16} className="animate-spin text-cyan-400" />
                        <span>Redirigiendo a tu panel de acceso...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
                <Link href="/web" className="inline-flex items-center gap-2 mb-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                        <Briefcase className="text-white" size={20} />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">TALENT</span></span>
                </Link>

                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                    Registro Automático de Vendedores
                </h1>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">
                    Únete al equipo comercial de ATOMIC. Registro directo con código a tu correo y acompañamiento por WhatsApp.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-[#0D121D] border border-white/10 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">

                    {/* SELECTOR DE MODALIDAD */}
                    <div className="mb-8">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                            <span>1. Selecciona tu Modalidad de Venta</span>
                            <span className="text-[11px] text-cyan-400 normal-case font-sans flex items-center gap-1">
                                <Sparkles size={12} /> Clic en la tarjeta para ver detalles
                            </span>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Modalidad 1: Plan Laboral 30 Días */}
                            <div
                                onClick={() => setModality("PLAN_LABORAL_30D")}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                    modality === "PLAN_LABORAL_30D"
                                        ? "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/50"
                                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            modality === "PLAN_LABORAL_30D" ? "bg-cyan-500 text-slate-950" : "bg-white/10 text-slate-300"
                                        }`}>
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">Plan Laboral 30 Días</h3>
                                            <span className="text-[10px] text-cyan-400 font-medium">Base + Comisiones</span>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="modality"
                                        checked={modality === "PLAN_LABORAL_30D"}
                                        onChange={() => setModality("PLAN_LABORAL_30D")}
                                        className="accent-cyan-400 mt-1 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                    Sueldo base de $100 a $450 según cumplimiento + comisiones. Escalamiento en Mes 2 a $450-$650 fijo con contrato formal.
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDetailsModal("PLAN_LABORAL_30D")
                                    }}
                                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4"
                                >
                                    Ver eslabones y condiciones <ChevronRight size={12} />
                                </button>
                            </div>

                            {/* Modalidad 2: Vendedor Bajo Comisión Afiliado */}
                            <div
                                onClick={() => setModality("COMISIONISTA_AFILIADO")}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                    modality === "COMISIONISTA_AFILIADO"
                                        ? "bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-950/50"
                                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            modality === "COMISIONISTA_AFILIADO" ? "bg-blue-500 text-white" : "bg-white/10 text-slate-300"
                                        }`}>
                                            <DollarSign size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">Comisión Afiliado</h3>
                                            <span className="text-[10px] text-blue-400 font-medium">100% Freelance</span>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="modality"
                                        checked={modality === "COMISIONISTA_AFILIADO"}
                                        onChange={() => setModality("COMISIONISTA_AFILIADO")}
                                        className="accent-blue-400 mt-1 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                    100% independiente sin horarios ni timbraje forzoso. Comisiones altas directas del 10% al 25% liquidadas por proforma cobrada.
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDetailsModal("COMISIONISTA_AFILIADO")
                                    }}
                                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 underline underline-offset-4"
                                >
                                    Ver condiciones de afiliado <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* PASO 1: FORMULARIO PRINCIPAL */}
                    {step === "FORM" && (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej: Carlos Alberto Mendoza"
                                        className="w-full bg-[#07090E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tu-correo@gmail.com"
                                            className="w-full bg-[#07090E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">
                                        Te llegará un código OTP de 6 dígitos aquí.
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Número de WhatsApp
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0991234567 o 593991234567"
                                            className="w-full bg-[#07090E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                    <span className="text-[10px] text-cyan-400/80 mt-1 block">
                                        Tu bot asistente te escribirá y guiará por aquí.
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Contraseña de Acceso
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Mínimo 6 caracteres"
                                        className="w-full bg-[#07090E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3 px-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Generando código de confirmación...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar Código de Activación al Correo</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* PASO 2: VERIFICACIÓN OTP */}
                    {step === "OTP" && (
                        <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in zoom-in duration-200">
                            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-center">
                                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Mail className="text-cyan-400" size={24} />
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">
                                    Código de Verificación Enviado
                                </h3>
                                <p className="text-xs text-slate-300">
                                    Ingresa el código numérico de 6 dígitos que enviamos a: <br />
                                    <strong className="text-cyan-400">{formData.email}</strong>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 text-center">
                                    Código de 6 Dígitos
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                    placeholder="• • • • • •"
                                    className="w-full max-w-xs mx-auto block bg-[#07090E] border-2 border-cyan-500/50 rounded-2xl py-3 text-center text-2xl font-mono font-black tracking-[0.4em] text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                />
                                <span className="text-[11px] text-slate-500 text-center block mt-2">
                                    ¿No te llegó? Revisa en tu carpeta de spam o correo no deseado.
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep("FORM")}
                                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-wider transition-colors"
                                >
                                    Corregir Datos
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || otpCode.length < 6}
                                    className="flex-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Activando Vendedor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={16} />
                                            <span>Validar y Activar Cuenta</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-xs text-slate-400">
                            ¿Ya tienes una cuenta activa?{" "}
                            <Link href="/login" className="text-cyan-400 font-bold hover:underline">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL DETALLES: PLAN LABORAL 30 DÍAS */}
            {showDetailsModal === "PLAN_LABORAL_30D" && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0D121D] border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                    Estructura Oficial
                                </span>
                                <h2 className="text-xl font-black text-white mt-1">Plan Laboral de 30 Días</h2>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(null)}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 text-xs text-slate-300">
                            {/* Beneficios */}
                            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                                <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
                                    <Award size={16} /> Compensación y Horarios
                                </h4>
                                <ul className="space-y-1.5 text-slate-300">
                                    <li>• <strong>Sueldo Base:</strong> $100 a $450 según cumplimiento de metas.</li>
                                    <li>• <strong>Comisiones Adicionales:</strong> Comisión neta por cada venta cerrada en ruta o web.</li>
                                    <li>• <strong>Dedicación:</strong> Flexible de 2 a 4 horas al día.</li>
                                </ul>
                            </div>

                            {/* Los 3 Eslabones */}
                            <div>
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-cyan-400" /> Los 3 Eslabones de tu Primer Mes
                                </h4>
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                                        <div className="flex items-center gap-2 font-bold text-cyan-400 text-xs mb-1">
                                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">1</span>
                                            Eslabón 1 (Días 1 a 10): Inducción & 5 Publicaciones Diarias
                                        </div>
                                        <p className="text-slate-400 text-[11px] leading-relaxed">
                                            Capacitación en catálogo bandera (videoporteros, barreras Dítec, antenas antihurto, cámaras). Mínimo 5 publicaciones diarias en Marketplace para captar los primeros prospectos calientes.
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                                        <div className="flex items-center gap-2 font-bold text-cyan-400 text-xs mb-1">
                                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">2</span>
                                            Eslabón 2 (Días 11 a 20): Prospección de Ruta & Seguimiento
                                        </div>
                                        <p className="text-slate-400 text-[11px] leading-relaxed">
                                            Visitas y cotizaciones activas a condominios, urbanizaciones y locales comerciales. Coordinación de proformas y registro en CRM.
                                        </p>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                                        <div className="flex items-center gap-2 font-bold text-cyan-400 text-xs mb-1">
                                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">3</span>
                                            Eslabón 3 (Días 21 a 30): Cierres de Venta & Liquidación
                                        </div>
                                        <p className="text-slate-400 text-[11px] leading-relaxed">
                                            Cierres efectivos de clientes cotizados. Liquidación del sueldo base y comisiones acumuladas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Escalamiento Mes 2 */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/30">
                                <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                    <Sparkles size={16} /> Escalamiento al Mes 2
                                </h4>
                                <p className="text-slate-300 leading-relaxed text-[11px]">
                                    Al completar con éxito tus primeros 30 días, escalas a <strong>Sueldo Base Fijo de $450.00 a $650.00 mensuales</strong> + 5% a 8% de comisión neta por venta + <strong>Contrato Indefinido Formal</strong> con estabilidad y beneficios de ley.
                                </p>
                            </div>

                            {/* Condición de Timbraje */}
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90">
                                <h4 className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                                    <Clock size={14} /> Requisito de Asistencia Diaria
                                </h4>
                                <p className="text-[11px] leading-relaxed">
                                    Para que el sistema compute con exactitud tus días trabajados y tu sueldo base se liquide puntualmente al finalizar tu ciclo, es indispensable registrar tu asistencia diaria en la plataforma cada mañana al iniciar tus actividades. El bot te enviará un recordatorio amigable cada día.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(null)}
                                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
                            >
                                Entendido, Seleccionar Este Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DETALLES: VENDEDOR AFILIADO BAJO COMISIÓN */}
            {showDetailsModal === "COMISIONISTA_AFILIADO" && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0D121D] border border-blue-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    Libertad Total
                                </span>
                                <h2 className="text-xl font-black text-white mt-1">Vendedor Bajo Comisión Afiliado</h2>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(null)}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 text-xs text-slate-300">
                            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                                <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                                    <Zap size={16} /> Características Principales
                                </h4>
                                <ul className="space-y-2 text-slate-300 text-[11px]">
                                    <li>• <strong>100% Flexible y Sin Horarios:</strong> Trabajas a tu propio ritmo, desde cualquier ciudad de Ecuador o de forma digital.</li>
                                    <li>• <strong>Sin Timbraje de Asistencia Obligatorio:</strong> No tienes compromiso de horas mínimas ni penalizaciones.</li>
                                    <li>• <strong>Altas Comisiones por Venta:</strong> Ganas entre el 10% y el 25% del valor neto del producto vendido.</li>
                                    <li>• <strong>Liquidación Inmediata:</strong> Cobras tus comisiones inmediatamente después de que el cliente cancela su proforma.</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                                <h4 className="text-xs font-bold text-white mb-2">Tabla Referencial de Ganancias por Venta:</h4>
                                <div className="space-y-1.5 text-[11px] text-slate-400">
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span>Barrera Automática Dítec 2027 ($1,928.90):</span>
                                        <strong className="text-emerald-400">$190 a $380 USD</strong>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span>Videoportero Residencial 2 Pantallas HD ($285):</span>
                                        <strong className="text-emerald-400">$35 a $60 USD</strong>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span>Antenas Antihurto Acrílicas ($745):</span>
                                        <strong className="text-emerald-400">$75 a $150 USD</strong>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span>Mantenimiento Preventivo Generadores ($50):</span>
                                        <strong className="text-emerald-400">$10 USD c/u</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(null)}
                                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider"
                            >
                                Entendido, Seleccionar Comisión Afiliado
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function VendedorRegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-cyan-400">
                <Loader2 size={32} className="animate-spin" />
            </div>
        }>
            <VendedorRegisterForm />
        </Suspense>
    )
}
