'use client';
import { motion } from 'framer-motion';

export default function AcerNitroBanner() {
  const whatsappNumber = "593969043453"; // Assuming Ecuador (+593) based on 09...
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Atomic, estoy interesado en comprar la Laptop Gamer Acer Nitro V 15. ¿Tienen disponibilidad?')}`;

  return (
    <div className="flex flex-col gap-12 w-full mt-10 overflow-hidden rounded-[3rem]">
      
      {/* 1. HERO SECTION (NEÓN & PERFORMANCE) */}
      <div className="relative bg-slate-900 rounded-[3rem] p-12 lg:p-20 overflow-hidden flex flex-col lg:flex-row items-center justify-between min-h-[600px]">
        {/* Luces Neón de Fondo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 max-w-xl text-left"
        >
          <div className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 font-bold text-sm tracking-widest mb-6">
            NUEVA GENERACIÓN 2024
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Desata tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Poder Interior.</span>
          </h2>
          <p className="text-slate-300 text-xl font-medium leading-relaxed mb-10">
            La Acer Nitro V 15 está diseñada para los jugadores más exigentes y creadores de contenido. Potenciada con tecnología de IA, DLSS 3 y la arquitectura Ada Lovelace de NVIDIA.
          </p>
          
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-8 py-5 rounded-[2rem] font-bold text-xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Comprar Ya por WhatsApp
          </a>
        </motion.div>
        
        {/* Imagen de la Laptop */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[800px] h-[600px] z-10 hidden lg:block group">
          <motion.img 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            src="https://m.media-amazon.com/images/I/71F-Wcriq4L._AC_SL1500_.jpg" 
            alt="Acer Nitro V 15" 
            className="w-full h-full object-contain rounded-3xl drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* 2. PROCESADOR INTEL & RTX 40 SERIES */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* CPU */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-12 rounded-[3rem] shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-colors"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-black mb-4 flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
              </span>
              Intel Core i7 13va Gen
            </h3>
            <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
              Arquitectura híbrida de rendimiento. Multitarea sin límites y tiempos de carga instantáneos para juegos pesados. Prepárate para renderizar, codificar y jugar al mismo tiempo sin sudar una gota.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-blue-400">✔</span> 10 Núcleos Híbridos</li>
              <li className="flex items-center gap-3"><span className="text-blue-400">✔</span> Frecuencia Turbo de hasta 4.90 GHz</li>
              <li className="flex items-center gap-3"><span className="text-blue-400">✔</span> Intel Thread Director optimizado</li>
            </ul>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-gradient-to-br from-green-900 to-slate-900 p-12 rounded-[3rem] shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-10 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/40 transition-colors"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h3 className="text-3xl font-black mb-4 flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
              </span>
              NVIDIA RTX Series 40
            </h3>
            <p className="text-green-100/80 text-lg leading-relaxed mb-8">
              Gráficos ultra realistas gracias al trazado de rayos completo (Ray Tracing) y el revolucionario DLSS 3 impulsado por IA que multiplica tus fotogramas mágicamente.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-green-400">✔</span> Arquitectura Ada Lovelace ultraeficiente</li>
              <li className="flex items-center gap-3"><span className="text-green-400">✔</span> NVIDIA Max-Q Technologies</li>
              <li className="flex items-center gap-3"><span className="text-green-400">✔</span> NVIDIA Reflex para la menor latencia</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. REFRIGERACIÓN & DISPLAY */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-12 lg:p-20 shadow-[0_20px_50px_rgba(0,0,0,0.03)] grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 rounded-3xl overflow-hidden relative shadow-2xl group border border-slate-200">
          <img 
            src="https://m.media-amazon.com/images/I/710JGMmTGJL._AC_SL1000_.jpg" 
            alt="Teclado y Ventilación Nitro V" 
            className="w-full h-full object-contain bg-white group-hover:scale-110 transition-transform duration-1000"
          />
        </div>
        <div className="order-1 lg:order-2">
          <div className="inline-block px-4 py-1.5 bg-red-100 border border-red-200 rounded-full text-red-700 font-bold text-sm tracking-widest mb-6">
            COOLING MÁXIMO
          </div>
          <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Siempre Fría Bajo Presión.</h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            El diseño térmico de la Acer Nitro V 15 incorpora ventiladores duales asimétricos de última generación y un eficaz sistema de escape de 4 puertos, garantizando que el chasis y tu teclado se mantengan fríos incluso durante los renders de video o torneos de esports más pesados.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-12">Pantalla 144Hz FHD</h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Dile adiós al ghosting. Con una tasa de refresco ultrarrápida de 144Hz, tus movimientos en los FPS shooters serán precisos, fluidos y mortales. Los colores vibrantes de su panel IPS IPS de 15.6" te sumergen por completo en el mapa.
          </p>
        </div>
      </div>

      {/* 4. NITROSENSE & CONECTIVIDAD */}
      <div className="bg-slate-950 rounded-[3rem] p-12 lg:p-20 grid lg:grid-cols-2 gap-16 items-center text-white">
        <div>
          <h3 className="text-4xl font-extrabold mb-6">El Comando en tus Manos: <span className="text-orange-500">NitroSense</span></h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Toma el control absoluto de tu laptop gamer. Con el software integrado NitroSense, puedes monitorizar la temperatura del CPU/GPU, ajustar la velocidad de los ventiladores en tiempo real, configurar perfiles de energía (Silencio, Rendimiento, Turbo) y personalizar modos de audio al instante.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-xl font-bold text-slate-200 mb-2">DTS X: Ultra</h4>
              <p className="text-slate-500 text-sm">Sonido espacial envolvente para localizar pasos enemigos.</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-xl font-bold text-slate-200 mb-2">Wi-Fi 6</h4>
              <p className="text-slate-500 text-sm">Ping ultra bajo y sin caídas de red durante tus rankeds.</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-xl font-bold text-slate-200 mb-2">Thunderbolt 4</h4>
              <p className="text-slate-500 text-sm">Transferencias de hasta 40Gbps y salida para doble monitor.</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-xl font-bold text-slate-200 mb-2">DDR5 RAM</h4>
              <p className="text-slate-500 text-sm">Memoria ultrarrápida 5200MHz para multitarea bestial.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden relative shadow-[0_0_80px_rgba(249,115,22,0.2)]">
          <img 
            src="https://m.media-amazon.com/images/I/61xBdjk+eTL._AC_SL1000_.jpg" 
            alt="Acer Nitro V Ports" 
            className="w-full h-full object-contain bg-white"
          />
        </div>
      </div>

      {/* 5. CALL TO ACTION (WHATSAPP) */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[3rem] p-16 text-center border border-emerald-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/50 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/50 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            ¿Listo para dar el gran salto?
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Llévate tu <strong>Acer Nitro V 15</strong> hoy mismo. Habla directamente con un asesor para confirmar stock, opciones de financiamiento y envíos a todo el país.
          </p>
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white px-10 py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_15px_40px_rgba(37,211,102,0.4)] hover:-translate-y-2 hover:scale-105"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Comprar Ahora (0969043453)
          </a>
          <p className="mt-8 text-sm text-slate-500 font-medium">Asistencia inmediata vía WhatsApp. Pagos seguros.</p>
        </div>
      </div>

    </div>
  );
}
