"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, Upload, Phone, CheckCircle2, Settings, Users, Image as ImageIcon, X, Plus, Camera } from "lucide-react"

type Phase = "onboarding"|"loading_ads"|"ads_ready"|"upload_mode"|"phone_mode"

interface BotMsg { id: string; from: "bot"|"user"; text?: string; type?: "buttons"|"products"|"upload"|"phone_form"|"ad_texts"|"ad_images" }

const INITIAL_MSGS: BotMsg[] = [
  { id:"1", from:"bot", text:"¡Hola! 👋 Bienvenido a Atomic Industries. Soy tu asistente de ruta. Estoy aquí para asignarte tus productos estratégicos del día, generar tus diseños y darte los copys para que publiques." },
]

export default function BotRutaPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isAdmin = role === "ADMIN" || role === "MANAGEMENT"
  const [adminView, setAdminView] = useState(false)
  const [phase, setPhase] = useState<Phase>("onboarding")
  const [messages, setMessages] = useState<BotMsg[]>(INITIAL_MSGS)
  const [input, setInput] = useState("")
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [phones, setPhones] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({ name:"", phone:"", city:"", email:"", requirement:"" })
  const [rewardConfig, setRewardConfig] = useState({ start:"", end:"", goal:"5 capturas + 3 contactos" })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }) }, [messages])

  const [generatedAds, setGeneratedAds] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/public/shop/products").then(r=>r.json()).then(d => {
      const all = d.products || []
      // Prioritize some categories
      const priorities = ["portero", "campana", "barrera", "antena", "cerradura", "motor", "espia"]
      const matched = all.filter((p: any) => priorities.some(pr => p.name.toLowerCase().includes(pr)))
      const others = all.filter((p: any) => !priorities.some(pr => p.name.toLowerCase().includes(pr)))
      
      const shuffledMatched = matched.sort(() => Math.random() - 0.5)
      const shuffledOthers = others.sort(() => Math.random() - 0.5)
      
      const selected = [...shuffledMatched.slice(0, 2), ...shuffledOthers.slice(0, 1)].sort(() => Math.random() - 0.5)
      setProducts(selected)
    }).catch(()=>{})
  }, [])

  const addBotMsg = (text: string, type?: BotMsg["type"]) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), from:"bot", text, type }])
  }

  const handleDownloadPDF = () => {
    const htmlContent = `
      <html><head><title>Material Publicitario</title><style>body{font-family:sans-serif;padding:40px;color:#333;line-height:1.6} h1{color:#1E3A8A} .ad-box{border:2px dashed #CBD5E1;padding:20px;border-radius:10px;margin-bottom:20px;background:#F8FAFC} pre{white-space:pre-wrap;font-family:inherit;margin:0}</style></head>
      <body>
        <h1>Material Publicitario - Atomic Industries</h1>
        <p>Querido asesor a continuación se sitúan los textos que podrás usar para desarrollar tus publicaciones. Es importante que no te saltes estas indicaciones:</p>
        <p>1. <b>Título:</b> Colocarás el título que te proporcionamos pero puedes modificar a tu gusto. Es ley que tenga algún emoji.<br/>2. <b>Precio:</b> Colocaremos el precio exacto.<br/>3. <b>Descripción:</b> Copia y pega la descripción, o personalízala para tener mejores resultados.<br/>4. <b>Ubicación:</b> Lugares sugeridos para posicionar tu anuncio en clientes de tecnología residencial.<br/>5. <b>Palabras claves:</b> Copiar y pegar.<br/>6. <b>SKU:</b> No pondremos nada.</p>
        <hr/>
        ${generatedAds.map(ad => `<div class="ad-box"><pre>${ad.text}</pre></div>`).join("")}
        <script>window.print();</script>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const startAdGeneration = () => {
    setMessages(prev => [...prev, { id: Date.now().toString(), from:"user", text:"Comenzar mi día de trabajo" }])
    setPhase("loading_ads")
    setTimeout(() => {
      addBotMsg("Buscando productos estratégicos y generando diseños publicitarios con Inteligencia Artificial. Esto tomará unos segundos... ⏳")
      
      setTimeout(() => {
        const locations = ["Cumbayá, Quito", "Samborondón, Guayaquil", "La Carolina, Quito", "Valle de los Tumbaco", "Urdesa, Guayaquil"]
        const ads = products.map(p => {
          const randomLocation = locations[Math.floor(Math.random() * locations.length)]
          const priceStr = p.price ? `$${p.price.toFixed(2)}` : "Consultar precio"
          // Pollinations AI prompt for realistic banner
          const prompt = `Professional commercial advertisement banner for ${p.name}, clean white background, high quality lighting, generic standard features text, with a small flag of Ecuador and a simple black and white atom logo in the corner, 4k resolution`
          const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&width=1080&height=1080`
          
          return {
            id: p.id,
            img: imgUrl,
            text: `**Título:** 🌟 Increíble ${p.name} 🚀\n**Precio:** ${priceStr}\n**Descripción:** Mejora la seguridad y comodidad de tu hogar o negocio con este producto élite. Calidad garantizada, soporte continuo e instalación profesional. ¡Aprovecha ahora!\n**Ubicación:** ${randomLocation}\n**SKU:**\n**Palabras claves:** #tecnologia #seguridad #ecuador #atomicindustries #hogar #innovacion`
          }
        })
        
        setGeneratedAds(ads)
        
        addBotMsg("Querido asesor a continuación se sitúan los textos que podrás usar para desarrollar tus publicaciones. Es importante que no te saltes estas indicaciones:\n\n1. En **Título** usa uno llamativo con emojis.\n2. En **Precio** usa el indicado.\n3. En **Descripción** puedes copiarla o mejorarla para personalizarla.\n4. En **Ubicación** usa nuestras sugerencias estratégicas.\n5. En **Palabras claves** pégalas tal cual.\n6. En **SKU** no pongas nada.")
        
        setTimeout(() => {
            addBotMsg("", "ad_texts")
            setTimeout(() => {
                addBotMsg("Aquí tienes los diseños generados especialmente para ti, con la bandera de Ecuador y nuestro logo en formato profesional:", "ad_images")
                setPhase("ads_ready")
            }, 1000)
        }, 1000)

      }, 2500)
    }, 500)
  }

  const handleUserReply = (text: string) => {
    // Custom logic if user types something
    setMessages(prev => [...prev, { id: Date.now().toString(), from:"user", text }])
    if (phase === "onboarding") {
        startAdGeneration()
    } else if (phase === "ads_ready") {
        setPhase("upload_mode")
        addBotMsg("¡Excelente! Ahora procede a publicar estos anuncios. Cuando termines, sube tus evidencias aquí mismo.", "upload")
    } else {
        addBotMsg("Recibido. Usa los botones correspondientes a tu fase actual o sube tus capturas/teléfonos.")
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput("")
    if (phase === "phone_mode") {
      setMessages(prev => [...prev, { id: Date.now().toString(), from:"user", text }])
      if (/\d{7,}/.test(text)) {
        setPhones(prev => [...prev, text])
        setTimeout(() => {
          addBotMsg(`✅ ¡Perfecto! Ya van ${phones.length + 1} número(s) registrado(s). Es vital intentar siempre obtener los datos de tus clientes, aunque no son obligatorios si no desean dárlos. ¿Deseas añadir este contacto al historial completo?`)
          setShowContactForm(true)
        }, 500)
      } else {
        setTimeout(() => addBotMsg("Por favor ingresa un número de teléfono válido (mínimo 7 dígitos)."), 500)
      }
      return
    }
    handleUserReply(text)
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshots(prev => {
          const next = [...prev, reader.result as string]
          setTimeout(() => addBotMsg(`📸 ¡Genial! Vamos en **${next.length} captura(s)**. Recuerda que cada captura debe mostrar una publicación independiente. ¡Sigue así!`), 300)
          return next
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSaveContact = async () => {
    try {
      await fetch("/api/crm/historicos", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ ...contactForm, source: "BOT_RUTA" })
      })
    } catch {}
    setShowContactForm(false)
    setContactForm({ name:"", phone:"", city:"", email:"", requirement:"" })
    setTimeout(() => addBotMsg("✅ Contacto guardado en el historial. ¡Excelente trabajo! Recuerda que cada dato que obtienes de tus clientes es oro para tus futuras ventas."), 300)
  }

  if (isAdmin && adminView) {
    return (
      <div className="space-y-8 pb-32 font-sans animate-in fade-in duration-500">
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3"><Settings className="text-indigo-600"/> Admin · Bot Ruta</h1>
            <p className="text-sm text-slate-500 mt-1">Configura el período de recompensa y monitorea la actividad de asesores.</p>
          </div>
          <button onClick={() => setAdminView(false)} className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            Ver como Asesor
          </button>
        </div>

        {/* Reward Config */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={20}/> Configuración de Recompensa Semanal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Inicio</label>
              <input type="date" value={rewardConfig.start} onChange={e => setRewardConfig(p => ({...p, start:e.target.value}))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Cierre</label>
              <input type="date" value={rewardConfig.end} onChange={e => setRewardConfig(p => ({...p, end:e.target.value}))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Meta de la Semana</label>
              <input type="text" value={rewardConfig.goal} onChange={e => setRewardConfig(p => ({...p, goal:e.target.value}))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"/>
            </div>
          </div>
          <button onClick={() => alert("Configuración guardada. El bot usará estos datos.")} className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
            Guardar Configuración
          </button>
        </div>

        {/* Advisor Stats */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2"><Users className="text-indigo-600" size={20}/> Actividad de Asesores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label:"Capturas subidas esta semana", value: screenshots.length, color:"text-emerald-600", bg:"bg-emerald-50" },
              { label:"Contactos capturados", value: phones.length, color:"text-blue-600", bg:"bg-blue-50" },
              { label:"Meta semanal", value: rewardConfig.goal || "Sin configurar", color:"text-indigo-600", bg:"bg-indigo-50" },
            ].map((s,i) => (
              <div key={i} className={`${s.bg} p-5 rounded-xl border border-slate-100`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          {screenshots.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Capturas Subidas</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {screenshots.map((src,i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <img src={src} alt={`Cap ${i+1}`} className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-50 font-sans">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <Bot size={22} className="text-indigo-600"/>
            </div>
            <div>
              <h1 className="text-base font-black text-[#0F172A]">Bot Ruta · Atomic</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <p className="text-xs font-bold text-slate-500">En línea · {rewardConfig.start ? `Semana: ${rewardConfig.start} → ${rewardConfig.end}` : "Guía de incorporación"}</p>
              </div>
            </div>
          </div>
          {isAdmin && (
            <button onClick={() => setAdminView(true)} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings size={14}/> Admin
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => {
            if (msg.type === "ad_texts") {
              return (
                  <div key={msg.id} className="max-w-2xl space-y-4">
                      {generatedAds.map((ad, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm font-sans text-sm text-slate-700 whitespace-pre-wrap">
                              {ad.text.split('\n').map((line: string, idx: number) => {
                                  const isBold = line.startsWith('**') && line.includes('**', 2);
                                  if (isBold) {
                                      const parts = line.split('**');
                                      return <p key={idx} className="mb-1"><strong>{parts[1]}</strong>{parts.slice(2).join('')}</p>
                                  }
                                  return <p key={idx} className="mb-1">{line}</p>
                              })}
                          </div>
                      ))}
                      <button onClick={handleDownloadPDF} className="mt-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-200 transition-colors">
                          📄 Descargar Textos en PDF
                      </button>
                  </div>
              )
            }
            if (msg.type === "ad_images") {
                return (
                  <div key={msg.id} className="max-w-2xl mt-2">
                      <p className="text-sm font-medium text-slate-600 mb-3">{msg.text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {generatedAds.map((ad, i) => (
                              <div key={i} className="rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white">
                                  <img src={ad.img} className="w-full aspect-square object-cover" alt="Publicidad Generada" />
                              </div>
                          ))}
                      </div>
                  </div>
                )
            }
            if (msg.type === "upload") {
              return (
                <div key={msg.id} className="max-w-md">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-indigo-700">📸 Sube tus evidencias</p>
                    <p className="text-xs text-slate-600 font-medium">Recuerda que cada captura debe mostrar una publicación independiente en tus redes.</p>
                    <label className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-indigo-50 transition-colors w-full justify-center">
                      <Camera size={16}/> Seleccionar Imágenes
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleScreenshotUpload}/>
                    </label>
                    {screenshots.length > 0 && (
                      <p className="text-xs font-black text-emerald-600">✅ {screenshots.length} captura(s) subida(s)</p>
                    )}
                  </div>
                </div>
              )
            }
            return (
              <motion.div key={msg.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className={`flex ${msg.from==="user" ? "justify-end" : "justify-start"}`}>
                {msg.from==="bot" && (
                  <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center mr-2 shrink-0 mt-1">
                    <Bot size={16} className="text-indigo-600"/>
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${msg.from==="bot" ? "bg-slate-50 border border-slate-200 text-[#0F172A] rounded-tl-sm whitespace-pre-wrap" : "bg-indigo-600 text-white rounded-tr-sm"}`}>
                  {msg.text?.split("**").map((part, i) => i%2===1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>)}
                  {phase==="onboarding" && msg.id==="1" && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={startAdGeneration} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors w-full shadow-sm">🚀 Comenzar mi día de trabajo</button>
                    </div>
                  )}
                  {phase==="ads_ready" && msg.type==="ad_images" && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => { setPhase("upload_mode"); addBotMsg("¡Excelente! Ahora procede a publicar. Cuando termines, sube tus evidencias.", "upload") }} className="bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors w-full shadow-sm">📸 Ya publiqué, subir evidencias</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          {phase==="phone_mode" ? (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="Ingresa número de teléfono..." className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500"/>
              </div>
              <button onClick={() => { setInput(phoneInput); setPhoneInput(""); setTimeout(handleSend, 50) }} className="bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Añadir</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSend()} placeholder="Escribe tu respuesta..." className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/>
              <button onClick={handleSend} disabled={!input.trim()} className="bg-indigo-600 text-white w-12 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50">
                <Send size={18}/>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Summary */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Resumen de Actividad</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">{session?.user?.name}</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Captures counter */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Capturas Subidas</p>
            <p className="text-3xl font-black text-emerald-600">{screenshots.length}</p>
            <p className="text-xs text-slate-500 mt-1">Meta: {rewardConfig.goal || "5 capturas"}</p>
            {screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {screenshots.slice(-6).map((src,i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden border border-slate-200">
                    <img src={src} className="w-full h-full object-cover" alt=""/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts counter */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teléfonos Capturados</p>
            <p className="text-3xl font-black text-blue-600">{phones.length}</p>
            {phones.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {phones.slice(-5).map((ph,i) => (
                  <p key={i} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">{ph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Reminder */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs font-medium text-amber-800 space-y-1.5">
            <p className="font-black text-amber-900">📅 Recordatorios</p>
            <p>🔵 <strong>Lunes:</strong> Revisa chats del fin de semana</p>
            <p>🟡 <strong>Miércoles:</strong> Envía promoción a clientes</p>
            <p>🟢 <strong>Viernes:</strong> Anota contactos nuevos</p>
          </div>

          {/* Phone mode toggle */}
          {phase==="upload_mode" || phase==="active" || phase==="phone_mode" ? (
            <button onClick={() => { setPhase("phone_mode"); addBotMsg("¡Perfecto! Ingresa el número de teléfono de tu cliente y lo registraremos. Recuerda: es muy importante intentar obtener los datos, aunque no son obligatorios si el cliente no desea proporcionarlos.") }} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
              <Phone size={16}/> Registrar Teléfono
            </button>
          ) : null}
        </div>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowContactForm(false)}/>
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }} className="bg-white p-8 max-w-md w-full rounded-2xl shadow-xl relative z-10 border border-slate-200">
              <button onClick={() => setShowContactForm(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18}/></button>
              <h3 className="text-lg font-black text-[#0F172A] mb-2">Añadir a Historial</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Es vital intentar obtener los datos del cliente. Los campos opcionales puedes dejarlos vacíos si el cliente no desea compartirlos.</p>
              <div className="space-y-3">
                {[
                  { key:"name", label:"Nombre", required:true, placeholder:"Nombre del cliente" },
                  { key:"phone", label:"Teléfono", required:true, placeholder:"Número registrado" },
                  { key:"city", label:"Ciudad (opcional)", required:false, placeholder:"Ciudad" },
                  { key:"email", label:"Correo (opcional)", required:false, placeholder:"email@ejemplo.com" },
                  { key:"requirement", label:"Interés / Requerimiento (opcional)", required:false, placeholder:"¿Qué producto le interesa?" },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                      {field.label}
                      {field.required ? <span className="text-rose-500">*</span> : <span className="text-slate-400 text-[10px]">(opcional)</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={(contactForm as any)[field.key]}
                      onChange={e => setContactForm(p => ({...p, [field.key]: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowContactForm(false)} className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">Omitir</button>
                <button onClick={handleSaveContact} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">Guardar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
