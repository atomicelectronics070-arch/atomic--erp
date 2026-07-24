import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldAlert, Wrench, Share2, Instagram, Facebook, Youtube } from 'lucide-react';

export const metadata = {
    title: 'Guía Definitiva de Barreras Antipánico | Modelos y Servicios de Instalación',
    description: 'Aprende todo sobre los diferentes modelos de barras antipánico (Push, Verticales, Toallero) y conoce nuestro servicio especializado de instalación profesional.',
};

export default function BlogBarrerasAntipanico() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-200 font-sans selection:bg-[#FF6347] selection:text-white pb-24">
            
            {/* HERO DEL BLOG */}
            <header className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-gray-900">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#FF6347]/10 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/web/barreras-antipanico" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold mb-10 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Volver al Catálogo
                    </Link>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6347]/20 text-[#FF6347] font-bold text-xs uppercase tracking-widest mb-6 border border-[#FF6347]/30">
                        <ShieldAlert size={14} /> Artículo Especializado
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                        Todo lo que debes saber sobre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6347] to-[#FF4500]">Barreras Antipánico</span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10">
                        Una salida de emergencia bloqueada puede ser la diferencia entre la vida y la muerte. En esta guía, exploramos los tipos de cerraduras antipánico y la vital importancia de una instalación profesional.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-800">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Síguenos en:</span>
                        <a href="https://www.instagram.com/atomic_industries_26?igsh=bDczYW9xN2F6NXFs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 transition-all">
                            <Instagram size={18} />
                        </a>
                        <a href="https://www.facebook.com/share/18sPVQW2mN/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all transition-all">
                            <Facebook size={18} />
                        </a>
                        <a href="https://youtu.be/_rI46cUolfQ?si=9UDW8WG4SeFQM-RL" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all">
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-4xl mx-auto px-6 mt-16 prose prose-invert prose-lg prose-headings:font-black prose-a:text-[#FF6347]">
                
                <h2>¿Por qué son obligatorias las Barreras Antipánico?</h2>
                <p>
                    Las normativas internacionales de seguridad industrial exigen que cualquier edificación con alto tráfico de personas cuente con vías de escape garantizadas. 
                    Las puertas de salida de emergencia no pueden requerir llaves ni movimientos finos para abrirse. Ante un incendio o avalancha, el pánico impide a las personas manipular manijas tradicionales.
                </p>
                <p>
                    <strong>La solución es simple:</strong> Un dispositivo que se abre al ser empujado con el cuerpo. Esa es la función exacta de una barra antipánico.
                </p>

                {/* YOUTUBE EMBED */}
                <div className="my-16 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,99,71,0.1)] border border-gray-800 aspect-video">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/_rI46cUolfQ" 
                        title="Demostración en Video" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>

                <h2>Tipos de Barreras Antipánico</h2>
                <p>
                    Existen diferentes tecnologías dependiendo del nivel de seguridad requerido y el tamaño de la puerta. Conocer la diferencia es crucial para no invertir mal.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-[#FF6347] transition-colors">
                        <h3 className="text-2xl font-black text-white mb-4">1. Tipo "Push" (Empuje)</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Es el modelo más robusto y moderno. Todo el mecanismo está oculto dentro de un bloque metálico rectangular. 
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Sin partes expuestas</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Soporta el mayor impacto</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Ideal para áreas de alto tráfico</li>
                        </ul>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-[#FF6347] transition-colors">
                        <h3 className="text-2xl font-black text-white mb-4">2. Tipo "Toallero" (Tubo)</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            El diseño clásico que utiliza un tubo cilíndrico separado del marco. Es excelente para presupuestos ajustados.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Menor costo de mantenimiento</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Fácil adaptación mecánica</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Estética tradicional</li>
                        </ul>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-[#FF6347] transition-colors">
                        <h3 className="text-2xl font-black text-white mb-4">3. De 3 Puntos (Vertical)</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Utiliza varillas de acero que anclan la puerta arriba y abajo al mismo tiempo, garantizando el triple de resistencia ante intrusiones.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Seguridad anti-intrusos extrema</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Cierre superior e inferior</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#FF6347]" /> Para puertas de doble hoja</li>
                        </ul>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-[#FF6347] transition-colors">
                        <h3 className="text-2xl font-black text-white mb-4">4. Manija Exterior Reversa</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Complemento obligatorio si deseas poder entrar por la misma puerta de emergencia desde el exterior usando llave tradicional o tarjeta inteligente.
                        </p>
                    </div>
                </div>

                <h2>Servicio de Instalación Certificada</h2>
                <p>
                    Comprar la mejor barra antipánico del mercado no sirve de nada si la instalación es defectuosa. Un tornillo mal colocado puede provocar que el mecanismo se trabe por el peso de la puerta.
                </p>
                <div className="p-8 bg-gradient-to-br from-[#FF6347]/10 to-transparent border border-[#FF6347]/30 rounded-2xl my-8">
                    <h3 className="flex items-center gap-3 text-2xl font-black text-white mt-0 mb-4">
                        <Wrench className="text-[#FF6347]" /> Por qué elegirnos para la instalación
                    </h3>
                    <ul>
                        <li><strong>Calibración Milimétrica:</strong> Medimos la tolerancia del marco contra el suelo para evitar que la fricción detenga la barra.</li>
                        <li><strong>Modificación de Puertas:</strong> Adaptamos puertas de madera, vidrio o metal para alojar los anclajes con precisión láser.</li>
                        <li><strong>Garantía de Resistencia:</strong> Nuestros pernos expansivos soportan la presión de cientos de kilos empujando en un momento de pánico.</li>
                    </ul>
                </div>

                <p>
                    No arriesgues la integridad de tu personal o clientes. Contáctanos hoy para realizar una inspección de tus vías de escape.
                </p>

                <div className="mt-16 text-center">
                    <Link href="/web/barreras-antipanico#catalogo" className="inline-block px-10 py-5 bg-[#FF6347] text-white font-black hover:bg-[#FF4500] transition-colors rounded-2xl shadow-[0_10px_40px_rgba(255,99,71,0.4)] hover:-translate-y-1 transform duration-300">
                        Ver Catálogo de Precios
                    </Link>
                </div>
            </main>
        </div>
    );
}
