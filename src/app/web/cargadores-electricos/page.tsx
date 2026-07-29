import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0; // Sin caché para actualizaciones inmediatas

export default async function CargadoresElectricosPage() {
  let evProducts: any[] = [];
  try {
    evProducts = await prisma.product.findMany({
      where: {
        OR: [
          { sku: { startsWith: 'EV-' } },
          { name: { contains: 'cargador', mode: 'insensitive' } },
          { name: { contains: 'wallbox', mode: 'insensitive' } },
          { name: { contains: 'eléctrico', mode: 'insensitive' } },
        ],
        isDeleted: false,
      },
      orderBy: { price: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching EV products:', err);
    evProducts = [];
  }

  const getImage = (p: any, fallback: string): string => {
    if (!p?.images) return fallback;
    try {
      const arr = JSON.parse(p.images);
      return (Array.isArray(arr) && arr[0]) ? arr[0] : fallback;
    } catch { return fallback; }
  };

  // Lista detallada con especificaciones técnicas completas para cada modelo
  const models = [
    {
      sku: 'EV-GO-7KW',
      title: 'Cargador Portátil EV Wallbox Go',
      powerBadge: '7.4 kW Monofásico',
      idealFor: 'Residencias, Casas & Garajes',
      price: 448.50,
      comparePrice: 520.00,
      img: '/img/cargadores/ev_wallbox_7kw.png',
      features: [
        'Corriente Ajustable 8A a 32A desde botón táctil',
        'Pantalla OLED en vivo con kWh, tiempo y temperatura',
        'Conector Universal Tipo 2 / GB/T (100% compatible BYD, Tesla, MG)',
        'Protección estanca IP66 contra lluvias torrenciales e impacto IK10',
        'Protección de fuga a tierra integrada (RCD CA 30mA + CC 6mA)',
      ],
      specs: [
        { name: 'Potencia', val: '7.4 kW (monofásico 220V)' },
        { name: 'Velocidad', val: 'hasta 45 km/h de carga' },
        { name: 'Protección', val: 'IP66 e IK10' },
        { name: 'Certificación', val: 'CE & TÜV Rheinland' },
      ]
    },
    {
      sku: 'EV-PULSAR-11KW',
      title: 'Estación Smart EV Pulsar Pro',
      powerBadge: '11 kW Trifásico Smart',
      idealFor: 'Casas de Lujo, Conjuntos & Edificios',
      price: 782.00,
      comparePrice: 890.00,
      img: '/img/cargadores/ev_pulsar_11kw.png',
      features: [
        'Control total por App Móvil iOS/Android vía WiFi y Bluetooth',
        'Lector de Tarjetas RFID para acceso exclusivo de propietarios',
        'Balanceo Dinámico Power Boost: evita caídas de brekes en casa',
        'Programación de carga en tarifa nocturna económica',
        'Chasis ultra compacto de ingeniería con acabado antirrayaduras',
      ],
      specs: [
        { name: 'Potencia', val: '11 kW (trifásico 380V-400V)' },
        { name: 'Conectividad', val: 'WiFi + Bluetooth + App' },
        { name: 'Control de Acceso', val: 'App + Tarjetas RFID' },
        { name: 'Certificación', val: 'ISO 9001, CE, IEC 61851' },
      ]
    },
    {
      sku: 'EV-ULTRA-22KW',
      title: 'Estación Comercial EV Ultra Fast Dual',
      powerBadge: '22 kW Comercial Dual',
      idealFor: 'Hoteles, Plazas, Parqueaderos & Flotas',
      price: 1437.50,
      comparePrice: 1650.00,
      img: '/img/cargadores/ev_ultra_22kw.png',
      features: [
        'Protocolo Abierto OCPP 1.6J para monetización y cobranza automática',
        'Pantalla Táctil HD de 7 pulgadas con instrucciones paso a paso',
        'Medidor de energía MID certificado Clase 1 para facturación exacta',
        'Cables dobles o tomas independientes para cargar 2 autos a la vez',
        'Carcasa de acero inoxidable grado industrial e IP65 antirrobo',
      ],
      specs: [
        { name: 'Potencia', val: '22 kW (trifásico 400V 32A)' },
        { name: 'Protocolo', val: 'OCPP 1.6 JSON Abierto' },
        { name: 'Pantalla', val: 'Táctil HD 7" Industrial' },
        { name: 'Certificación', val: 'MID, TÜV, CE Europeo' },
      ]
    },
    {
      sku: 'EV-TRAVEL-3.7KW',
      title: 'Cargador de Viaje Compact EV Travel',
      powerBadge: '3.7 kW Multivoltaje',
      idealFor: 'Viajes, Emergencias & Enchufe 110V/220V',
      price: 276.00,
      comparePrice: 320.00,
      img: '/img/cargadores/ev_travel_3kw.png',
      features: [
        'Enchúfalo en cualquier tomacorriente doméstico NEMA o industrial CEE',
        'Cable TPU de 6 metros resistente al pisado involuntario de ruedas',
        'Sensor de temperatura en enchufe para apagado automático a 75°C',
        'Gratis: Maletín rígido e impermeable shockproof para llevar en la cajuela',
        'Ideal para viajes a provincias o quintas de fin de semana',
      ],
      specs: [
        { name: 'Potencia', val: '3.7 kW (220V) / 1.8 kW (110V)' },
        { name: 'Amperaje', val: 'Ajustable 6A a 16A' },
        { name: 'Accesorios', val: 'Maletín Rígido Gratis' },
        { name: 'Certificación', val: 'CE, RoHS, IP67' },
      ]
    },
  ];

  return (
    <div className="-mt-32 overflow-x-hidden font-sans bg-[#080808]">

      {/* ================= HERO HEADER ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#051a14] via-[#080808] to-[#080808]">
        {/* Glows verdes de energía EV */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[180px] -translate-y-1/3" />
          <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[150px] translate-y-1/4" />
        </div>

        {/* Electric Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: '55px 55px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-32 pt-44">

          {/* TEXTO HERO */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2.5 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              🇪🇺 Calidad y Fabricación Europea · Respaldo Oficial en Ecuador
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight text-white">
                CARGADORES<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  AUTOS ELÉCTRICOS
                </span><br />
                <span className="text-3xl md:text-4xl tracking-widest text-zinc-300">INGENIERÍA EV EUROPA</span>
              </h1>
              <p className="text-zinc-500 text-xs mt-3 font-mono">
                Línea Residencial, Comercial & Flotas Corporativas
              </p>
            </div>

            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
              Carga tu vehículo eléctrico de manera inteligente, ultra rápida y 100% segura. Soluciones compatibles con <strong className="text-white">BYD, Tesla, BMW, Audi, MG, Kia, Hyundai, Chery y más</strong>.
            </p>

            {/* Badges de Certificación */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '3 Años', label: 'Garantía Europea' },
                { val: 'TÜV / CE', label: 'Certificados UE' },
                { val: '100%', label: 'Compatibles GB/T & T2' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-emerald-500/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-black text-emerald-400">{s.val}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA WhatsApp */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a
                href="https://wa.me/593969043453?text=Hola%2C%20necesito%20asesor%C3%ADa%20para%20comprar%20un%20*Cargador%20para%20Auto%20El%C3%A9ctrico*%20con%20Garant%C3%ADa%20Europea"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-black text-lg rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-1 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Asesoría e Instalación
              </a>
            </div>
          </div>

          {/* FOTO HERO / IMAGE PREVIEW */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />
            <div className="relative z-10 p-6 bg-white/5 border border-emerald-500/30 rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden">
              <img
                src="/img/cargadores/ev_wallbox_7kw.png"
                alt="Cargador para Auto Eléctrico EV Wallbox Europa"
                className="w-full max-w-md mx-auto object-cover rounded-2xl drop-shadow-[0_30px_60px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute top-6 right-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl rotate-2">
              ⚡ Certificación CE / TÜV
            </div>
            <div className="absolute bottom-6 left-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl">
              🛡️ 3 Años Garantía Oficial
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN DEDICADA A CADA MODELO DE CARGADOR ================= */}
      <section id="modelos" className="py-24 px-6 bg-[#080808] border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Catálogo Exclusivo
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white">
              Nuestros Modelos de <span className="text-emerald-400">Cargadores EV</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mt-4">
              Diseñados a medida para cada necesidad: portátiles de viaje, residenciales inteligentes y estaciones comerciales de alta potencia.
            </p>
          </div>

          <div className="space-y-16">
            {models.map((m, idx) => (
              <div
                key={m.sku}
                className={`grid lg:grid-cols-2 gap-12 items-center bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 md:p-12 hover:border-emerald-500/40 transition-all duration-500 ${
                  idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Imagen del Modelo */}
                <div className={`relative flex justify-center ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-3xl" />
                  <div className="relative z-10 w-full h-80 md:h-96 rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={m.img}
                      alt={m.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-full shadow-lg">
                    {m.powerBadge}
                  </div>
                </div>

                {/* Info & Especificaciones del Modelo */}
                <div className="space-y-6">
                  <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                    {m.idealFor} · SKU: {m.sku}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    {m.title}
                  </h3>

                  {/* Lista de características */}
                  <ul className="space-y-3">
                    {m.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Grid de Specs */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {m.specs.map((sp) => (
                      <div key={sp.name} className="bg-white/5 border border-white/5 rounded-xl p-3">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{sp.name}</div>
                        <div className="text-xs font-bold text-white mt-0.5">{sp.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Precio & CTA individual */}
                  <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Precio Venta (15% Margen)</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">${(m.price ?? 0).toFixed(2)}</span>
                        <span className="text-sm text-zinc-600 line-through">${(m.comparePrice ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">IVA Incluido · Incluye Margen 15%</div>
                    </div>

                    <a
                      href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20cotizar%20el%20modelo%20*${encodeURIComponent(m.title)}*%20(SKU%3A%20${m.sku})%20al%20precio%20de%20%24${(m.price ?? 0).toFixed(2)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
                    >
                      <span>Cotizar {m.sku}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APARTADO DE BENEFICIOS ================= */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Impacto Financiero & Comodidad</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
              Beneficios de Cargar tu Auto en <span className="text-emerald-400">Casa u Oficina</span>
            </h2>
            <p className="text-zinc-400 text-base max-w-xl mx-auto mt-3">
              Descubre por qué instalar una estación EV propia transforma tu experiencia de movilidad eléctrica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '💰',
                title: 'Ahorro Hasta el 80%',
                desc: 'Llenar la batería de tu auto en casa cuesta aproximadamente un 80% menos en dólares frente al gasto equivalente en gasolina de tanque lleno.'
              },
              {
                icon: '🌙',
                title: 'Carga Nocturna Inteligente',
                desc: 'Programa desde la App el horario de carga mientras duermes para aprovechar las tarifas eléctricas nocturnas de menor costo.'
              },
              {
                icon: '⚡',
                title: '10 veces más Rápido',
                desc: 'Olvídate de esperar 24 horas en enchufes convencionales. Nuestras estaciones de 7.4 kW a 22 kW cargan tu auto en pocas horas.'
              },
              {
                icon: '📱',
                title: 'Control en tiempo Real',
                desc: 'Monitorea el consumo exacto de kWh, el historial de carga, los costos de cada viaje y recibe notificaciones cuando tu batería esté al 100%.'
              },
            ].map((b) => (
              <div key={b.title} className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-300">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APARTADO DE VENTAJAS TECNOLÓGICAS ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#080808] border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Ingeniería de Vanguardia</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
              Ventajas Tecnológicas <span className="text-cyan-400">Punta de Lanza</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔌',
                title: 'Compatibilidad 100% Universal',
                desc: 'Contamos con adaptadores e interfaces nativas para todos los estándares internacionales de conectores: GB/T (Marcas Chinas), Tipo 2 (Europeas) y Tipo 1 (Norteamericanas).'
              },
              {
                icon: '🛡️',
                title: 'Protección IP65 / IP66 e IK10',
                desc: 'Nuestros equipos soportan el clima extremo ecuatoriano: lluvias torrenciales, humedad de costa, frío de sierra y caídas accidentales con certificación anti-impacto IK10.'
              },
              {
                icon: '⚖️',
                title: 'Balanceo Dinámico (Power Boost)',
                desc: 'Sistema inteligente que monitorea el consumo del edificio o residencia en tiempo real y regula automáticamente la energía del cargador para jamás provocar un corte por sobrecarga.'
              },
              {
                icon: '📶',
                title: 'Conectividad Multi-Protocolo',
                desc: 'Equipados con WiFi Dual Band, Bluetooth 5.0, Ethernet y 4G LTE opcional para una comunicación continua sin interrupciones.'
              },
              {
                icon: '📊',
                title: 'Protocolo Comercial OCPP 1.6J',
                desc: 'Listos para integrarse a cualquier plataforma comercial de cobranza. Permite tarifar kWh a clientes en restaurantes, plazas y estaciones de servicio.'
              },
              {
                icon: '🧯',
                title: 'Protección Eléctrica Integrada',
                desc: 'Incluyen interruptores diferenciales RCD AC 30mA y detección de fuga continua DC 6mA integrada para protección absoluta de tu vehículo y familia.'
              },
            ].map((v) => (
              <div key={v.title} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:bg-white/[0.05] transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APARTADO DEDICADO A LA GARANTÍA EUROPEA ================= */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#06241b] via-[#071d18] to-[#051814] border-y border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-5 py-2 text-emerald-300 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            🇪🇺 Estándar de Excelencia Europea
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Garantía de Fabricación Europea & Certificación Internacional
          </h2>
          <p className="text-zinc-300 text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
            Cada cargador de nuestra línea es ensamblado bajo las normas europeas más exigentes de la industria automotriz. No comercializamos genéricos sin certificación; ofrecemos equipos probados ante sobrevoltajes, picos térmicos y cortocircuitos.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400 mb-2">CE & TÜV</div>
              <div className="text-sm font-bold text-white mb-1">Normativa Certificada</div>
              <div className="text-xs text-zinc-400">Aprobados por TÜV Rheinland y marcado CE de conformidad europea en seguridad de laboratorio.</div>
            </div>
            <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400 mb-2">3 Años</div>
              <div className="text-sm font-bold text-white mb-1">Garantía Directa en Ecuador</div>
              <div className="text-xs text-zinc-400">Garantía por escrito de 36 meses respaldada con stock local de módulos, cables y piezas originales.</div>
            </div>
            <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-black text-emerald-400 mb-2">Soporte 24/7</div>
              <div className="text-sm font-bold text-white mb-1">Técnicos Certificados</div>
              <div className="text-xs text-zinc-400">Equipo técnico especializado para asesoría de instalación trifásica/monofásica a nivel nacional.</div>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="https://wa.me/593969043453?text=Hola%2C%20quiero%20consultar%20sobre%20la%20*Garant%C3%ADa%20Europea*%20y%20asistencia%20de%20instalaci%C3%B3n%20para%20Cargador%20EV"
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 bg-white text-emerald-950 font-black text-lg rounded-full hover:bg-emerald-400 hover:text-black transition-all shadow-xl inline-flex items-center gap-3"
            >
              <span>Hablar con un Ingeniero EV</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ================= CATÁLOGO INFERIOR EN DB ================= */}
      {Array.isArray(evProducts) && evProducts.length > 0 && (
        <section className="py-20 px-6 bg-[#080808]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Listado en Base de Datos de Cargadores EV
              </h2>
              <p className="text-zinc-500 text-base">Todos los modelos con 15% de margen comercial aplicado en tiempo real.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {evProducts.map((p) => {
                const img = getImage(p, '/img/cargadores/ev_wallbox_7kw.png');
                const priceNum = (typeof p?.price === 'number') ? p.price : 0;
                const compareNum = (typeof p?.compareAtPrice === 'number') ? p.compareAtPrice : 0;

                return (
                  <Link
                    key={p.id}
                    href={`/web/product/${p.id}`}
                    className="group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-emerald-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 p-4"
                  >
                    <div className="aspect-square bg-black/40 rounded-xl flex items-center justify-center p-3 overflow-hidden mb-3">
                      <img
                        src={img}
                        alt={p.name || 'Cargador EV'}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </h3>
                    <div className="text-xs font-mono text-zinc-500 mb-2">SKU: {p.sku || 'N/A'}</div>
                    <div className="text-emerald-400 font-black text-xl">${priceNum.toFixed(2)}</div>
                    {compareNum > 0 && (
                      <div className="text-xs text-zinc-500 line-through">${compareNum.toFixed(2)}</div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
