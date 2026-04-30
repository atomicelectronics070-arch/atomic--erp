import { Shield, Zap, Smartphone, TrendingUp, Sun, Droplets, Eye, Mic, Film, Heart, Waves, Moon, Lock, Bell, Music, UserPlus, Leaf, AppWindow as WindowIcon, Search, Wrench as Tool, HardHat, Layout, Key, Cloud, Thermometer, Battery, Monitor, Puzzle, HelpCircle, Smile, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BenefitsPage() {
    const benefits = [
        { icon: <Shield size={24} />, title: "Seguridad Inteligente 24/7", desc: "Monitoreo constante con detección de anomalías mediante IA para una protección total." },
        { icon: <Zap size={24} />, title: "Ahorro Energético", desc: "Optimización automática de luces y dispositivos para reducir drásticamente el costo de las planillas." },
        { icon: <Smartphone size={24} />, title: "Control Total Móvil", desc: "Gestione toda su residencia desde cualquier parte del mundo con una interfaz intuitiva." },
        { icon: <TrendingUp size={24} />, title: "Valorización Inmobiliaria", desc: "Aumente el valor de mercado de su propiedad integrando infraestructura de vanguardia." },
        { icon: <Sun size={24} />, title: "Confort Adaptativo", desc: "Sistemas que aprenden sus preferencias de clima e iluminación para un hogar siempre perfecto." },
        { icon: <Droplets size={24} />, title: "Prevención de Inundaciones", desc: "Sensores que detectan fugas de agua y cierran válvulas automáticamente para evitar daños." },
        { icon: <Eye size={24} />, title: "Disuasión Activa", desc: "Cámaras que emiten alertas sonoras y visuales al detectar intrusos antes de que ingresen." },
        { icon: <Mic size={24} />, title: "Integración JARVIS", desc: "Sincronización total con nuestro asistente de voz para comandos naturales y fluidos." },
        { icon: <Film size={24} />, title: "Escenas Personalizadas", desc: "Configure ambientes con un solo toque: 'Modo Cine', 'Modo Cena' o 'Modo Salida'." },
        { icon: <Heart size={24} />, title: "Cuidado de Familia", desc: "Siga de cerca el bienestar de adultos mayores y niños con alertas de actividad inusual." },
        { icon: <Waves size={24} />, title: "Optimización de Agua", desc: "Gestión inteligente del consumo hídrico en interiores y exteriores." },
        { icon: <Moon size={24} />, title: "Iluminación Circadiana", desc: "Luces que cambian de tonalidad según la hora del día para mejorar su ciclo de sueño." },
        { icon: <Lock size={24} />, title: "Cerraduras Biométricas", desc: "Acceso seguro mediante huella o rostro, olvidando para siempre las llaves físicas." },
        { icon: <Bell size={24} />, title: "Notificaciones Real-Time", desc: "Alertas inmediatas en su smartphone sobre cualquier evento relevante en su hogar." },
        { icon: <Music size={24} />, title: "Audio Multi-room", desc: "Música ambiental sincronizada en todas las habitaciones con fidelidad audiófila." },
        { icon: <UserPlus size={24} />, title: "Accesos Remotos", desc: "Abra la puerta a visitas o personal de servicio desde su oficina con total seguridad." },
        { icon: <Leaf size={24} />, title: "Sustentabilidad", desc: "Reduzca su huella de carbono mediante una gestión eficiente de recursos." },
        { icon: <WindowIcon size={24} />, title: "Persianas Inteligentes", desc: "Apertura y cierre según la posición del sol para proteger muebles y ahorrar energía." },
        { icon: <Search size={24} />, title: "Vigilancia con IA", desc: "Reconocimiento de personas, vehículos y mascotas para filtrar falsas alarmas." },
        { icon: <Tool size={24} />, title: "Mantenimiento Preventivo", desc: "El sistema le avisa cuándo un equipo necesita revisión antes de que falle." },
        { icon: <ShieldCheck size={24} className="" />, title: "Seguros más Económicos", desc: "Las aseguradoras ofrecen mejores primas para hogares con sistemas de seguridad activa." },
        { icon: <Layout size={24} />, title: "Interfaz Unificada", desc: "Diga adiós a tener 20 aplicaciones; controle todo desde un solo ecosistema Atomic." },
        { icon: <Key size={24} />, title: "Privacidad Encriptada", desc: "Sus datos y videos viajan con encriptación de grado militar para su total tranquilidad." },
        { icon: <Waves size={24} />, title: "Riego Inteligente", desc: "Riegue su jardín solo cuando es necesario, basándose en el pronóstico del clima." },
        { icon: <Thermometer size={24} />, title: "Calidad de Aire", desc: "Monitoreo de CO2 y partículas para activar purificadores y ventilación." },
        { icon: <Battery size={24} />, title: "Respaldo Energético", desc: "Integración con sistemas solares y UPS para mantener la casa viva durante apagones." },
        { icon: <Monitor size={24} />, title: "Entretenimiento Next-Gen", desc: "Cine en casa con automatización de proyector, sonido y cortinas en segundos." },
        { icon: <Puzzle size={24} />, title: "Escalabilidad Modular", desc: "Empiece con lo básico y añada funciones según sus necesidades y presupuesto." },
        { icon: <HelpCircle size={24} />, title: "Soporte Remoto", desc: "Nuestro equipo técnico puede diagnosticar y optimizar su sistema a distancia." },
        { icon: <Smile size={24} />, title: "Paz Mental", desc: "La tranquilidad de saber que su hogar y su familia están protegidos por tecnología élite." }
    ]

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Hero Section */}
            <div className="relative py-48 overflow-hidden border-b border-white/[0.03]">
                <div className="absolute inset-0 bg-[#E8341A]/[0.03] blur-[140px] rounded-full -top-[20%] -right-[10%]" />
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="inline-flex items-center gap-4 mb-10 text-[#E8341A]/50 text-[9px] font-medium uppercase tracking-[0.6em]">
                        <div className="w-16 h-px bg-current opacity-20"></div>
                        Vivir en el Futuro
                    </div>
                    <h1 className="text-5xl md:text-8xl font-light uppercase tracking-tighter leading-[0.9] italic mb-12">
                        BENEFICIOS <br/> <span className="text-[#E8341A] font-black">RESIDENCIALES.</span>
                    </h1>
                    <p className="max-w-xl text-white/30 text-xs uppercase tracking-[0.3em] font-medium leading-relaxed italic">
                        La infraestructura esencial para la eficiencia y seguridad del siglo XXI.
                    </p>
                </div>
            </div>

            {/* 30 Benefits Grid */}
            <section className="max-w-7xl mx-auto px-8 py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <div key={i} className="group p-8 bg-white/[0.01] border border-white/[0.03] hover:border-[#E8341A]/20 transition-all hover:bg-white/[0.03] relative overflow-hidden">
                            <div className="text-[#E8341A]/40 mb-6 group-hover:scale-110 group-hover:text-[#E8341A] transition-all duration-500">{b.icon}</div>
                            <h3 className="text-sm font-black uppercase tracking-tight mb-3 italic text-white/80">{b.title}</h3>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest leading-relaxed font-medium group-hover:text-white/40 transition-colors">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How to Save Section */}
            <section className="bg-white text-[#0F1923] py-40">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col lg:flex-row gap-32 items-center">
                        <div className="lg:w-1/2 space-y-16">
                            <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter leading-none italic">
                                ¿CÓMO <span className="text-[#E8341A] font-black">AHORRAR</span> <br/> CON TU SISTEMA?
                            </h2>
                            <div className="space-y-12">
                                {[
                                    { id: "01", title: "Detección de Presencia", desc: "El sistema apaga automáticamente luces y clima en zonas desocupadas." },
                                    { id: "02", title: "Gestión de Horarios Pico", desc: "Programación inteligente de alto consumo en tarifas eléctricas reducidas." },
                                    { id: "03", title: "Uso de Dimmers y LED", desc: "Reducción imperceptible del brillo para ahorrar hasta un 20% mensual." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="text-4xl font-black text-slate-100 group-hover:text-[#E8341A] transition-colors italic leading-none">{item.id}</div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-tight mb-2 italic">{item.title}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-[#0F1923] p-12 md:p-20 text-white space-y-12 relative overflow-hidden border border-white/[0.05]">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8341A]/10 blur-[100px]" />
                            <h3 className="text-2xl font-light uppercase tracking-widest italic border-b border-white/5 pb-8">MANTENIMIENTO <span className="font-black">ELITE</span></h3>
                            <ul className="space-y-8 text-[9px] font-medium uppercase tracking-[0.3em]">
                                <li className="flex items-center gap-6 text-white/40 hover:text-white transition-colors"><CheckCircle2 size={12} className="text-[#E8341A]" /> Actualizaciones de Firmware Mensuales</li>
                                <li className="flex items-center gap-6 text-white/40 hover:text-white transition-colors"><CheckCircle2 size={12} className="text-[#E8341A]" /> Limpieza de Sensores y Lentes Opticos</li>
                                <li className="flex items-center gap-6 text-white/40 hover:text-white transition-colors"><CheckCircle2 size={12} className="text-[#E8341A]" /> Auditoría de Seguridad Digital</li>
                            </ul>
                            <button className="w-full py-5 border border-white/10 hover:bg-white hover:text-[#0F1923] transition-all text-[9px] font-black uppercase tracking-[0.4em] italic">Agendar Revisión Técnica</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-40 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#2563EB]/5 blur-[120px]" />
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-12 relative z-10">
                    ¿LISTO PARA <span className="text-[#E8341A]">TRANSFORMAR</span> <br/> TU HOGAR?
                </h2>
                <Link href="/web/contact" className="inline-flex items-center gap-4 px-16 py-6 bg-[#E8341A] text-white font-black uppercase tracking-[0.4em] text-[12px] italic hover:scale-105 transition-all relative z-10 shadow-[0_20px_50px_-10px_rgba(232,52,26,0.5)]">
                    Solicitar Consultoría <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    )
}

function ShieldCheck({ size, className }: { size: number, className: string }) {
    return <Shield size={size} className={className} />
}
