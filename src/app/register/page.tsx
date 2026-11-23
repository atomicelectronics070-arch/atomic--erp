"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
    User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, 
    CreditCard, Briefcase, Sparkles, MapPin, 
    Phone, CheckCircle2, Eye, EyeOff, MessageSquare
} from "lucide-react"

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [step, setStep] = useState<"FORM" | "ACTIVATED">("FORM")
    const [showPassword, setShowPassword] = useState(false)
    
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
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

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

    // Registro con Activación Automática Inmediata
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (formData.password.length < 8) {
            setError("La clave de seguridad debe tener al menos 8 caracteres.")
            setLoading(false)
            return
        }

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
                setStep("ACTIVATED")
            }
        } catch (err) {
            setError("Error de conexión con el servidor. Inténtalo nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    // PANTALLA DE ÉXITO: ACTIVACIÓN AUTOMÁTICA CONFIRMADA
    if (step === "ACTIVATED") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070e23] text-white p-4 sm:p-6 font-sans relative overflow-hidden">
                {/* Iluminación sutil de fondo azul marino */}
                <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-cyan-600/15 blur-[140px] rounded-full pointer-events-none" />

                {/* Recuadro Blanco de Confirmación */}
                <div className="max-w-xl w-full bg-white text-slate-900 border border-slate-200 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl rounded-3xl z-10">
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 rounded-3xl shadow-sm">
                        <CheckCircle2 size={44} className="text-emerald-600" />
                    </div>
                    
                    <span className="inline-block px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-black text-xs uppercase tracking-widest rounded-full mb-3">
                        ✓ Cuenta Activada Automáticamente
                    </span>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mb-3 font-heading">
                        ¡Bienvenido al Equipo <span className="text-blue-600">ATOMIC</span>!
                    </h2>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        Tu perfil de <strong>{formData.role === "SALESPERSON" ? "Asesor de Ventas" : formData.role}</strong> ha sido habilitado con éxito en el sistema. Ya cuentas con acceso inmediato a nuestro cotizador web, lista de precios mayorista y cálculo del 20% de comisión.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 text-left space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                            <span className="text-slate-500 font-bold uppercase">Asesor:</span>
                            <span className="text-slate-900 font-semibold">{formData.name} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                            <span className="text-slate-500 font-bold uppercase">Correo de Acceso:</span>
                            <span className="text-blue-600 font-mono font-bold">{formData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 font-bold uppercase">Estado:</span>
                            <span className="text-emerald-600 font-black uppercase flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> Activo & Autorizado
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link 
                            href="/login" 
                            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/30"
                        >
                            Iniciar Sesión en el Cotizador <ArrowRight size={16} />
                        </Link>
                        
                        <a
                            href={`https://wa.me/593989476556?text=Saludos%20Stefy%2C%20acabo%20de%20registrarme%20en%20ATOMIC.%20Mi%20cuenta%20fue%20activada%20autom%C3%A1ticamente.%20Mi%20nombre%20es%20${encodeURIComponent(formData.name + ' ' + formData.lastName)}%20y%20mi%20correo%20es%20${encodeURIComponent(formData.email)}.%20Solicito%20acceso%20a%20los%20grupos%20de%20trabajo.`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md"
                        >
                            <MessageSquare size={16} />
                            Contactar a Coordinación (Stefy) en WhatsApp
                        </a>

                        <Link 
                            href="/web/precios-vendedor" 
                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
                        >
                            ⚡ Ver Portal de Precios & PVPs
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // FORMULARIO PRINCIPAL: FONDO AZUL MARINO CON DOS APARTADOS EN RECUADROS BLANCOS
    return (
        <div className="min-h-screen bg-[#070e23] text-slate-100 font-sans py-14 px-4 sm:px-6 relative overflow-hidden">
            {/* Ambient Lighting Azul Marino */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[550px] h-[550px] bg-blue-600/10 blur-[160px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[550px] h-[550px] bg-cyan-600/10 blur-[160px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                
                {/* Header Ejecutivo */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/60 text-blue-300 font-mono text-xs font-semibold">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>Convocatoria Comercial 2026 · Alta Inmediata</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                        ÚNETE AL EQUIPO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ATOMIC</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                        Completa tus datos para crear tu cuenta comercial. La activación es automática para que comiences a cotizar y vender en el acto.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-3 shadow-lg">
                        <Lock size={16} className="text-rose-400 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-8">
                    
                    {/* ════════════════════════════════════════════════════════════
                        APARTADO 01: RECUADRO BLANCO · DATOS PERSONALES & IDENTIFICACIÓN
                       ════════════════════════════════════════════════════════════ */}
                    <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/90 space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-[11px] font-black uppercase tracking-wider mb-2">
                                <User size={13} /> Apartado 01 · Información del Asesor
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                                Datos Personales & Identificación Oficial
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Información requerida para el registro en el escalafón comercial y asignación de cartera de clientes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Nombres */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Nombres <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="Ej. Juan Alberto"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>

                            {/* Apellidos */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Apellidos <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        required 
                                        value={formData.lastName} 
                                        onChange={handleChange} 
                                        placeholder="Ej. Pérez Morales"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>

                            {/* Cédula o RUC */}
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Cédula de Identidad o RUC <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        name="cedula" 
                                        required 
                                        value={formData.cedula} 
                                        onChange={handleChange} 
                                        placeholder="1723456789 (10 dígitos para cédula o 13 para RUC)"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-mono font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>

                            {/* Ciudad de Residencia */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Ciudad de Residencia <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        name="cityResidence" 
                                        required 
                                        value={formData.cityResidence} 
                                        onChange={handleChange} 
                                        placeholder="Ej. Quito / Guayaquil / Cuenca"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>

                            {/* Ciudad de Origen */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Ciudad de Origen (Opcional)
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        name="cityOrigin" 
                                        value={formData.cityOrigin} 
                                        onChange={handleChange} 
                                        placeholder="Ej. Loja / Ambato / Manta"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>

                            {/* Teléfono WhatsApp Activo */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Teléfono / WhatsApp Activo <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        required 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        placeholder="Ej. 0989476556"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>

                            {/* Correo Electrónico Activo */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Correo Electrónico Activo <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        required 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="tu-correo@gmail.com"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════════
                        APARTADO 02: RECUADRO BLANCO · ACCESO & ACTIVACIÓN AUTOMÁTICA
                       ════════════════════════════════════════════════════════════ */}
                    <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/90 space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-black uppercase tracking-wider mb-2">
                                <ShieldCheck size={13} /> Apartado 02 · Acceso a la Plataforma & Activación
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                                Perfil Comercial & Clave de Seguridad
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Define tus credenciales de acceso. Al enviar este formulario tu cuenta queda activada automáticamente.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Rol Comercial */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    ¿Cómo deseas registrarte? <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select 
                                        name="role" 
                                        value={formData.role} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-4 py-3.5 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="SALESPERSON">Vendedor (Asesor Comercial) - Activación Automática</option>
                                        <option value="TECNICO">Técnico (Instalador / Soporte Técnico)</option>
                                        <option value="CONSUMIDOR">Cliente Mayorista / Usuario Directo</option>
                                        <option value="ACADEMIA">Académico (Capacitaciones & Cursos)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">
                                    Clave de Seguridad (Mínimo 8 caracteres) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        required 
                                        minLength={8} 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="••••••••••••"
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-semibold rounded-xl pl-10 pr-12 py-3.5 outline-none transition-all placeholder:text-slate-400" 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Banner Informativo de Activación Automática Inmediata */}
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-3">
                            <Sparkles size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs text-slate-700">
                                <p className="font-bold text-blue-900">
                                    ⚡ Activación Automática Inmediata Garantizada:
                                </p>
                                <p className="leading-relaxed">
                                    Sin códigos de espera por correo ni demoras burocráticas. Al hacer clic en el botón inferior, tu usuario queda registrado con estatus <strong>APROBADO</strong> y podrás iniciar sesión directamente para usar el cotizador y ver tus comisiones.
                                </p>
                            </div>
                        </div>

                        {/* Botón de Submit */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-blue-600/25 flex justify-center items-center gap-2 hover:scale-[1.01]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Activando Cuenta en el Sistema...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Completar Registro y Activar Cuenta Inmediatamente</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer de Enlaces */}
                <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                        ¿Ya posees una cuenta activa?{" "}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 underline underline-offset-2">
                            Iniciar Sesión aquí
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#070e23] flex items-center justify-center"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>}>
            <RegisterForm />
        </Suspense>
    )
}
