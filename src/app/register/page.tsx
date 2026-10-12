"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
    User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, 
    CreditCard, Users, Briefcase, Bell, Sparkles, MapPin, 
    Phone, CheckCircle2, RefreshCw, KeyRound 
} from "lucide-react"

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [step, setStep] = useState<"FORM" | "VERIFY_CODE" | "AWAITING_APPROVAL">("FORM")
    
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        cedula: "",
        cityOrigin: "",
        cityResidence: "",
        email: "",
        phone: "",
        password: "",
        role: "SALESPERSON",
        referredBy: "",
        receivePromotions: true
    })
    
    const [verificationCode, setVerificationCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [infoMsg, setInfoMsg] = useState("")

    useEffect(() => {
        const roleParam = searchParams.get("role") || searchParams.get("type")
        if (roleParam) {
            const r = roleParam.toLowerCase()
            if (r.includes("emplead") || r.includes("vendedor") || r.includes("sales")) {
                setFormData(prev => ({ ...prev, role: "SALESPERSON" }))
            } else if (r.includes("tecnic") || r.includes("soporte") || r.includes("instal")) {
                setFormData(prev => ({ ...prev, role: "TECNICO" }))
            } else if (r.includes("academ") || r.includes("curso")) {
                setFormData(prev => ({ ...prev, role: "ACADEMIA" }))
            } else if (r.includes("comprad") || r.includes("client") || r.includes("consum") || r.includes("usuario")) {
                setFormData(prev => ({ ...prev, role: "CONSUMIDOR" }))
            } else {
                setFormData(prev => ({ ...prev, role: roleParam.toUpperCase() }))
            }
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        })
    }

    // Paso 1: Enviar datos y solicitar código de verificación
    const handleStartRegistration = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setInfoMsg("")

        try {
            const res = await fetch("/api/auth/register-conversational", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "start",
                    name: formData.name,
                    lastName: formData.lastName,
                    cedula: formData.cedula,
                    cityOrigin: formData.cityOrigin || formData.cityResidence,
                    cityResidence: formData.cityResidence,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    password: formData.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Error al procesar la solicitud.")
            } else {
                setInfoMsg(data.message || `Código enviado a ${formData.email}`)
                setStep("VERIFY_CODE")
            }
        } catch (err) {
            setError("Error de conexión con el servidor.")
        } finally {
            setLoading(false)
        }
    }

    // Paso 2: Verificar el código de 6 dígitos
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (verificationCode.trim().length !== 6) {
            setError("El código debe tener exactamente 6 dígitos numéricos.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register-conversational", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "verify",
                    email: formData.email,
                    code: verificationCode.trim(),
                    password: formData.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "El código ingresado es incorrecto.")
            } else {
                setStep("AWAITING_APPROVAL")
            }
        } catch (err) {
            setError("Error al validar el código. Por favor intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    // Reenviar código
    const handleResendCode = async () => {
        setLoading(true)
        setError("")
        setInfoMsg("")
        try {
            const res = await fetch("/api/auth/register-conversational", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "start",
                    name: formData.name,
                    lastName: formData.lastName,
                    cedula: formData.cedula,
                    cityOrigin: formData.cityOrigin || formData.cityResidence,
                    cityResidence: formData.cityResidence,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    password: formData.password
                })
            })
            const data = await res.json()
            if (res.ok) {
                setInfoMsg(`Nuevo código generado y enviado a ${formData.email}`)
            } else {
                setError(data.error || "No se pudo reenviar el código.")
            }
        } catch (err) {
            setError("Error de conexión al reenviar.")
        } finally {
            setLoading(false)
        }
    }

    // PANTALLA 3: MENSAJE EXACTO DE REVISIÓN ADMINISTRATIVA
    if (step === "AWAITING_APPROVAL") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070b19] text-white p-6 font-sans">
                <div className="max-w-lg w-full bg-[#0d142b] border border-cyan-500/30 p-10 md:p-14 text-center relative overflow-hidden shadow-2xl rounded-3xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[90px] rounded-full"></div>
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 rounded-2xl">
                        <CheckCircle2 size={42} className="text-emerald-400" />
                    </div>
                    
                    <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-widest rounded-full mb-4">
                        ✓ Correo Electrónico Confirmado
                    </span>
                    
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-6">
                        ¡CÓDIGO VERIFICADO <span className="text-cyan-400">CON ÉXITO!</span>
                    </h2>
                    
                    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl mb-8 text-left space-y-3">
                        <p className="text-slate-200 text-sm font-medium leading-relaxed">
                            <strong>Administración está revisando tu solicitud y en un máximo de 1 hora se activará tu perfil.</strong>
                        </p>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Te llegará una notificación a tu correo o puedes probar iniciar sesión en unos minutos.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link 
                            href="/login" 
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                        >
                            Ir a Iniciar Sesión <ArrowRight size={14} />
                        </Link>
                        <Link 
                            href="/web" 
                            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl border border-slate-700 transition-all"
                        >
                            Ver Catálogo Público
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // PANTALLA 2: INGRESO DE CÓDIGO DE 6 DÍGITOS
    if (step === "VERIFY_CODE") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070b19] text-white p-6 font-sans">
                <div className="max-w-md w-full bg-[#0d142b] border border-cyan-500/30 p-10 md:p-12 text-center relative overflow-hidden shadow-2xl rounded-3xl">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 blur-[80px] rounded-full"></div>
                    
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 rounded-2xl">
                        <KeyRound size={32} className="text-cyan-400" />
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                        Verifica tu <span className="text-cyan-400">Correo</span>
                    </h2>
                    
                    <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                        Te hemos enviado un código de confirmación de 6 dígitos a: <br/>
                        <strong className="text-cyan-300 font-mono text-sm">{formData.email}</strong> <br/>
                        <span className="text-[11px] text-slate-500">(Válido durante 24 horas)</span>
                    </p>

                    {infoMsg && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-xl">
                            {infoMsg}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Código de 6 Dígitos
                            </label>
                            <input 
                                type="text"
                                maxLength={6}
                                required
                                autoFocus
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-full bg-slate-900 border-2 border-cyan-500/50 focus:border-cyan-400 px-6 py-4 text-center text-3xl font-mono font-black tracking-[12px] text-cyan-300 rounded-xl outline-none transition-all placeholder:text-slate-700"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || verificationCode.length !== 6}
                            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20 flex justify-center items-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Confirmar Código <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
                        <button 
                            onClick={handleResendCode}
                            disabled={loading}
                            type="button"
                            className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-bold"
                        >
                            <RefreshCw size={12} /> Reenviar código
                        </button>
                        <button 
                            onClick={() => setStep("FORM")}
                            type="button"
                            className="text-slate-400 hover:text-slate-300"
                        >
                            Modificar datos
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // PANTALLA 1: FORMULARIO PRINCIPAL CON LOS CAMPOS SOLICITADOS
    return (
        <div className="min-h-screen bg-[#070b19] text-white font-sans py-16 px-6 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-cyan-500/30 bg-cyan-950/40 rounded-full mb-6">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-300">
                            Registro Oficial en el Sistema
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                        ÚNETE A <span className="text-cyan-400">ATOMIC.</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-3">
                        Plataforma Mayorista de Seguridad, Tecnología y Soluciones Integrales
                    </p>
                </div>

                <div className="bg-[#0d142b] border border-cyan-500/30 p-8 md:p-14 shadow-2xl relative rounded-3xl backdrop-blur-xl">
                    {error && (
                        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-3 rounded-xl">
                            <Lock size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleStartRegistration} className="space-y-8">
                        {/* 01. Identificación */}
                        <div>
                            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                                <User size={16} /> 01. Datos Personales & Cédula
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Nombres</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej. Juan Alberto"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Apellidos</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Ej. Pérez García"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Cédula de Ciudadanía (o RUC)</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="text" name="cedula" required value={formData.cedula} onChange={handleChange} placeholder="1723456789"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-mono font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 02. Ubicación & Contacto */}
                        <div>
                            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                                <MapPin size={16} /> 02. Ubicación Geográfica & Contacto
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Ciudad de Origen</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="text" name="cityOrigin" required value={formData.cityOrigin} onChange={handleChange} placeholder="Ej. Loja / Ambato"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Ciudad de Residencia</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="text" name="cityResidence" required value={formData.cityResidence} onChange={handleChange} placeholder="Ej. Quito / Guayaquil"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Correo Electrónico Activo</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="tu-correo@gmail.com"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Teléfono / WhatsApp Activo</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="0998765432"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 03. Perfil y Clave */}
                        <div>
                            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                                <Briefcase size={16} /> 03. Perfil de Acceso & Clave
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">¿Cómo deseas registrarte?</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <select name="role" value={formData.role} onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none appearance-none cursor-pointer">
                                            <option value="SALESPERSON">Vendedor (Asesor Comercial)</option>
                                            <option value="TECNICO">Técnico (Instalador / Soporte)</option>
                                            <option value="CONSUMIDOR">Usuario (Cliente / Tienda Online)</option>
                                            <option value="ACADEMIA">Académico (Cursos & Certificaciones)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider ml-1">Clave de Seguridad (Mínimo 8 caract.)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} placeholder="••••••••"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 px-11 py-3.5 text-white text-xs font-semibold rounded-xl outline-none transition-all placeholder:text-slate-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading}
                                className="w-full py-4 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 shadow-xl shadow-cyan-500/20 flex justify-center items-center gap-3">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Continuar y Enviar Código de Verificación <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-800 pt-6">
                        <p className="text-xs text-slate-400">
                            ¿Ya posees una cuenta autorizada?{" "}
                            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#070b19] flex items-center justify-center"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>}>
            <RegisterForm />
        </Suspense>
    )
}
