import { Shield, Zap, Smartphone, TrendingUp, Sun, Droplets, Eye, Mic, Film, Heart, Waves, Moon, Lock, Bell, Music, UserPlus, Leaf, AppWindow as WindowIcon, Search, Wrench as Tool, HardHat, Layout, Key, Cloud, Thermometer, Battery, Monitor, Puzzle, HelpCircle, Smile, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BenefitsPage() {
    const benefits = [
        { icon: <Shield size={24} />, title: "Seguridad Inteligente 24/7", desc: "Monitoreo constante con detecci\u00f3n de anomal\u00edas mediante IA para una protecci\u00f3n total." },
        { icon: <Zap size={24} />, title: "Ahorro Energ\u00e9tico", desc: "Optimizaci\u00f3n autom\u00e1tica de luces y dispositivos para reducir dr\u00e1sticamente el costo de las planillas." },
        { icon: <Smartphone size={24} />, title: "Control Total M\u00f3vil", desc: "Gestione toda su residencia desde cualquier parte del mundo con una interfaz intuitiva." },
        { icon: <TrendingUp size={24} />, title: "Valorizaci\u00f3n Inmobiliaria", desc: "Aumente el valor de mercado de su propiedad integrando infraestructura de vanguardia." },
        { icon: <Sun size={24} />, title: "Confort Adaptativo", desc: "Sistemas que aprenden sus preferencias de clima e iluminaci\u00f3n para un hogar siempre perfecto." },
        { icon: <Droplets size={24} />, title: "Prevenci\u00f3n de Inundaciones", desc: "Sensores que detectan fugas de agua y cierran v\u00e1lvulas autom\u00e1ticamente para evitar da\u00f1os." },
        { icon: <Eye size={24} />, title: "Disuasi\u00f3n Activa", desc: "C\u00e1maras que emiten alertas sonoras y visuales al detectar intrusos antes de que ingresen." },
        { icon: <Mic size={24} />, title: "Integraci\u00f3n JARVIS", desc: "Sincronizaci\u00f3n total con nuestro asistente de voz para comandos naturales y fluidos." },
        { icon: <Film size={24} />, title: "Escenas Personalizadas", desc: "Configure ambientes con un solo toque: 'Modo Cine', 'Modo Cena' o 'Modo Salida'." },
        { icon: <Heart size={24} />, title: "Cuidado de Familia", desc: "Siga de cerca el bienestar de adultos mayores y ni\u00f1os con alertas de actividad inusual." },
        { icon: <Waves size={24} />, title: "Optimizaci\u00f3n de Agua", desc: "Gesti\u00f3n inteligente del consumo h\u00eddrico en interiores y exteriores." },
        { icon: <Moon size={24} />, title: "Iluminaci\u00f3n Circadiana", desc: "Luces que cambian de tonalidad seg\u00fan la hora del d\u00eda para mejorar su ciclo de sue\u00f1o." },
        { icon: <Lock size={24} />, title: "Cerraduras Biom\u00e9tricas", desc: "Acceso seguro mediante huella o rostro, olvidando para siempre las llaves f\u00edsicas." },
        { icon: <Bell size={24} />, title: "Notificaciones Real-Time", desc: "Alertas inmediatas en su smartphone sobre cualquier evento relevante en su hogar." },
        { icon: <Music size={24} />, title: "Audio Multi-room", desc: "M\u00fasica ambiental sincronizada en todas las habitaciones con fidelidad audi\u00f3fila." },
        { icon: <UserPlus size={24} />, title: "Accesos Remotos", desc: "Abra la puerta a visitas o personal de servicio desde su oficina con total seguridad." },
        { icon: <Leaf size={24} />, title: "Sustentabilidad", desc: "Reduzca su huella de carbono mediante una gesti\u00f3n eficiente de recursos." },
        { icon: <WindowIcon size={24} />, title: "Persianas Inteligentes", desc: "Apertura y cierre seg\u00fan la posici\u00f3n del sol para proteger muebles y ahorrar energ\u00eda." },
        { icon: <Search size={24} />, title: "Vigilancia con IA", desc: "Reconocimiento de personas, veh\u00edculos y mascotas para filtrar falsas alarmas." },
        { icon: <Tool size={24} />, title: "Mantenimiento Preventivo", desc: "El sistema le avisa cu\u00e1ndo un equipo necesita revisi\u00f3n antes de que falle." },
        { icon: <Shield size={24} />, title: "Seguros m\u00e1s Econ\u00f3micos", desc: "Las aseguradoras ofrecen mejores primas para hogares con sistemas de seguridad activa." },
        { icon: <Layout size={24} />, title: "Interfaz Unificada", desc: "Diga adi\u00f3s a tener 20 aplicaciones; controle todo desde un solo ecosistema Atomic." },
        { icon: <Key size={24} />, title: "Privacidad Encriptada", desc: "Sus datos y videos viajan con encriptaci\u00f3n de grado militar para su total tranquilidad." },
        { icon: <Waves size={24} />, title: "Riego Inteligente", desc: "Riegue su jard\u00edn solo cuando es necesario, bas\u00e1ndose en el pron\u00f3stico del clima." },
        { icon: <Thermometer size={24} />, title: "Calidad de Aire", desc: "Monitoreo de CO2 y part\u00edculas para activar purificadores y ventilaci\u00f3n." },
        { icon: <Battery size={24} />, title: "Respaldo Energ\u00e9tico", desc: "Integraci\u00f3n con sistemas solares y UPS para mantener la casa viva durante apagones." },
        { icon: <Monitor size={24} />, title: "Entretenimiento Next-Gen", desc: "Cine en casa con automatizaci\u00f3n de proyector, sonido y cortinas en segundos." },
        { icon: <Puzzle size={24} />, title: "Escalabilidad Modular", desc: "Empiece con lo b\u00e1sico y a\u00f1ada funciones seg\u00fan sus necesidades y presupuesto." },
        { icon: <HelpCircle size={24} />, title: "Soporte Remoto", desc: "Nuestro equipo t\u00e9cnico puede diagnosticar y optimizar su sistema a distancia." },
        { icon: <Smile size={24} />, title: "Paz Mental", desc: "La tranquilidad de saber que su hogar y su familia est\u00e1n protegidos por tecnolog\u00eda \u00e9lite." }
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all/10">
            {/* Hero Section */}
            <div className="relative py-48 overflow-hidden bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border-b border-slate-200">
                <div className="absolute inset-0 bg-blue-500/[0.03] blur-[140px] rounded-full -top-[20%] -right-[10%]" />
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="inline-flex items-center gap-4 mb-10 text-blue-600/60 text-[9px] font-bold uppercase tracking-[0.6em]">
                        <div className="w-16 h-px bg-current opacity-30"></div>
                        Vivir en el Futuro
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic mb-12 text-[#1E3A8A]">
                        BENEFICIOS <br/> <span className="text-blue-600 font-black">RESIDENCIALES.</span>
                    </h1>
                    <p className="max-w-xl text-slate-400 text-xs uppercase tracking-[0.3em] font-bold leading-relaxed italic">
                        La infraestructura esencial para la eficiencia y seguridad del siglo XXI.
                    </p>
                </div>
            </div>

            {/* 30 Benefits Grid */}
            <section className="max-w-7xl mx-auto px-8 py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <div key={i} className="group p-8 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-2xl relative overflow-hidden">
                            <div className="text-blue-600/40 mb-6 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-500">{b.icon}</div>
                            <h3 className="text-sm font-black uppercase tracking-tight mb-3 italic text-slate-800">{b.title}</h3>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed font-bold group-hover:text-slate-500 transition-colors">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How to Save Section */}
            <section className="bg-slate-50 text-slate-900 py-40 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col lg:flex-row gap-32 items-center">
                        <div className="lg:w-1/2 space-y-16">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic text-[#1E3A8A]">
                                \u00bfC\u00d3MO <span className="text-blue-600">AHORRAR</span> <br/> CON TU SISTEMA?
                            </h2>
                            <div className="space-y-12">
                                {[
                                    { id: "01", title: "Detecci\u00f3n de Presencia", desc: "El sistema apaga autom\u00e1ticamente luces y clima en zonas desocupadas." },
                                    { id: "02", title: "Gesti\u00f3n de Horarios Pico", desc: "Programaci\u00f3n inteligente de alto consumo en tarifas el\u00e9ctricas reducidas." },
                                    { id: "03", title: "Uso de Dimmers y LED", desc: "Reducci\u00f3n imperceptible del brillo para ahorrar hasta un 20% mensual." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="text-4xl font-black text-slate-200 group-hover:text-blue-600 transition-colors italic leading-none">{item.id}</div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-tight mb-2 italic text-slate-800">{item.title}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-12 md:p-20 text-slate-900 space-y-12 relative overflow-hidden border border-slate-200 shadow-2xl rounded-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[100px]" />
                            <h3 className="text-2xl font-black uppercase tracking-widest italic border-b border-slate-100 pb-8 text-[#1E3A8A]">MANTENIMIENTO <span className="text-blue-600">ELITE</span></h3>
                            <ul className="space-y-8 text-[9px] font-bold uppercase tracking-[0.3em]">
                                <li className="flex items-center gap-6 text-slate-400 hover:text-slate-900 transition-colors"><CheckCircle2 size={12} className="text-blue-600" /> Actualizaciones de Firmware Mensuales</li>
                                <li className="flex items-center gap-6 text-slate-400 hover:text-slate-900 transition-colors"><CheckCircle2 size={12} className="text-blue-600" /> Limpieza de Sensores y Lentes Opticos</li>
                                <li className="flex items-center gap-6 text-slate-400 hover:text-slate-900 transition-colors"><CheckCircle2 size={12} className="text-blue-600" /> Auditor\u00eda de Seguridad Digital</li>
                            </ul>
                            <button className="w-full py-5 bg-[#1E3A8A] text-white hover:from-cyan-400 hover:to-indigo-500 transition-all text-[9px] font-black uppercase tracking-[0.4em] italic shadow-[0_12px_40px_rgba(0,0,0,0.5)]">Agendar Revisi\u00f3n T\u00e9cnica</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-40 text-center relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <div className="absolute inset-0 bg-blue-500/[0.02] blur-[120px]" />
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-12 relative z-10 text-[#1E3A8A]">
                    \u00bfLISTO PARA <span className="text-blue-600">TRANSFORMAR</span> <br/> TU HOGAR?
                </h2>
                <Link href="/web/contact" className="inline-flex items-center gap-4 px-16 py-6 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all text-white font-black uppercase tracking-[0.4em] text-[12px] italic hover:scale-105 transition-all relative z-10 shadow-2xl">
                    Solicitar Consultor\u00eda <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    )
}
