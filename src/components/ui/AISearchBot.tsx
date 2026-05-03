"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, Bot, User, RefreshCw, Sparkles, ShoppingCart, ArrowRight } from "lucide-react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

interface Message { role: 'bot' | 'user'; content: string; hasCartButton?: boolean }

const KEYWORD_MAP: Array<{ keys: string[], query: string, reply: string }> = [
    { keys: ['camara','cámara','seguridad','vigilancia','cctv'], query: 'camaras seguridad', reply: 'Tenemos cámaras HD, 4K, con visión nocturna y acceso remoto. He actualizado el catálogo con las mejores opciones de seguridad. ¿Las necesitas para interior o exterior?' },
    { keys: ['espía','espia','oculta','mini camara'], query: 'camara espia oculta', reply: 'Las cámaras espía son uno de nuestros productos más solicitados. He filtrado los modelos disponibles. ¿Buscas una con grabación continua o por movimiento?' },
    { keys: ['power bank','banco','bateria','batería','carga'], query: 'power bank banco poder', reply: 'Contamos con power banks desde 10.000 mAh hasta modelos industriales de 40.000 mAh. He mostrado el catálogo actualizado. ¿Cuántos dispositivos necesitas cargar?' },
    { keys: ['cerradura','smart lock','acceso','puerta'], query: 'cerraduras smart acceso', reply: 'Nuestras cerraduras smart incluyen control por huella, PIN y app. He filtrado las opciones disponibles. ¿Es para uso residencial o comercial?' },
    { keys: ['gaming','gamer','consola','juego','videojuego'], query: 'gaming consolas juegos', reply: 'Tenemos consolas, accesorios y periféricos gaming de alta gama. Catálogo actualizado. ¿Buscas una consola específica o accesorios?' },
    { keys: ['antena','internet','señal','wifi','router'], query: 'antenas internet señal', reply: 'Nuestras antenas mejoran cobertura hasta 5km en exterior. He mostrado los modelos disponibles. ¿Es para interior o exterior?' },
    { keys: ['alarma','sensor','detector','movimiento'], query: 'alarmas sensores seguridad', reply: 'Sistema de alarmas con sensores de movimiento, apertura y humo. Catálogo actualizado. ¿Para hogar o negocio?' },
    { keys: ['laptop','computador','computadora','pc','notebook'], query: 'laptop computadora', reply: 'Manejamos repuestos y accesorios para laptops de las principales marcas. He filtrado el inventario. ¿Qué marca o modelo tienes?' },
    { keys: ['iluminacion','iluminación','led','luz','foco','bombillo'], query: 'iluminacion led smart', reply: 'Iluminación LED smart con control remoto y por voz. Catálogo disponible. ¿Buscas para decoración o iluminación funcional?' },
    { keys: ['energia','energía','solar','bateria','inversor','ups'], query: 'energia solar inversor ups', reply: 'Contamos con soluciones de energía solar, inversores y UPS. He mostrado el catálogo de energía. ¿Cuántos watts necesitas cubrir?' },
    { keys: ['precio','costo','valor','cuanto','cuánto'], query: '', reply: 'Los precios en nuestra web son al público general. Si eres afiliado o distribuidor, inicia sesión para ver tus precios especiales. ¿Qué producto te interesa cotizar?' },
    { keys: ['envio','envío','delivery','entrega','despacho'], query: '', reply: '¡Buenas noticias! En tu PRIMERA COMPRA el envío es TOTALMENTE GRATIS. A partir de la segunda compra o en pedidos mayores a $100, también te aplicamos un 10% DE DESCUENTO adicional.' },
    { keys: ['garantia','garantía','soporte','reparacion'], query: '', reply: 'Todos nuestros productos tienen garantía de fábrica. Contamos con soporte técnico directo. ¿Sobre qué producto necesitas información de garantía?' },
    { keys: ['hola','buenos','buenas','saludos','hi'], query: '', reply: '¡Hola! Bienvenido a Atomic. Estoy aquí para ayudarte a encontrar el equipo perfecto. ¿Qué tecnología estás buscando hoy?' },
    { keys: ['pago','pagar','comprar','carrito','orden'], query: '', reply: 'Puedes pagar mediante transferencia, depósito, tarjeta de débito o Contra Entrega. Recuerda que pedidos mayores a $100 tienen un 10% de descuento.' },
]

const FALLBACK_REPLIES = [
    "Entendido. He actualizado el catálogo con tu búsqueda. Usa la barra de búsqueda para explorar. ¿Puedes darme más detalles de lo que buscas?",
    "Buen punto. Nuestro catálogo tiene más de 500 productos. ¿Me das más pistas? Por ejemplo, ¿es para hogar, oficina o negocio?",
    "Interesante. Para darte la mejor recomendación, ¿cuál es tu presupuesto aproximado y para qué uso lo necesitas?",
]
let fallbackIndex = 0

export const AISearchBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const { totalItems } = useCart()
    const lastItemsCount = useRef(totalItems)
    
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: '¡Hola! Soy el Asistente de Atomic. Puedo ayudarte a encontrar cámaras, power banks, cerraduras smart, antenas, iluminación y más. ¿Qué estás buscando hoy?' }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const [context, setContext] = useState<string | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Trigger bot on Add to Cart
    useEffect(() => {
        if (totalItems > lastItemsCount.current) {
            setIsOpen(true)
            const botMsg: Message = { 
                role: 'bot', 
                content: '¡Excelente elección! He visto que añadiste un producto. ¿Te ayudo a finalizar tu pedido? Ve a pagar tu compra y obtén ENVÍO GRATIS por ser tu primera compra. 🚀',
                hasCartButton: true
            }
            setMessages(prev => [...prev, botMsg])
        }
        lastItemsCount.current = totalItems
    }, [totalItems])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const updateGlobalSearch = (term: string) => {
        if (!term) return
        window.dispatchEvent(new CustomEvent('atomic-search-update', { detail: term }))
    }

    const handleSend = () => {
        const text = query.trim()
        if (!text) return
        setMessages(prev => [...prev, { role: 'user', content: text }])
        setQuery("")
        setIsTyping(true)

        setTimeout(() => {
            const lower = text.toLowerCase()
            
            // 1. Check for specific numeric context (e.g. "dime el de 40" referring to power banks)
            if (context === 'powerbank' && (lower.includes('40') || lower.includes('20') || lower.includes('10'))) {
                const mah = lower.includes('40') ? '40.000 mAh' : (lower.includes('20') ? '20.000 mAh' : '10.000 mAh')
                const reply = `El modelo de ${mah} es uno de nuestros más vendidos. He filtrado los resultados para que lo veas. ¿Quieres saber el precio exacto o ver las especificaciones?`
                updateGlobalSearch(`power bank ${mah.replace('.','')}`)
                setMessages(prev => [...prev, { role: 'bot', content: reply }])
                setIsTyping(false)
                return
            }

            // 2. Normal keyword mapping
            const match = KEYWORD_MAP.find(k => k.keys.some(kw => lower.includes(kw)))

            let reply: string
            if (match) {
                reply = match.reply
                if (match.query) {
                    updateGlobalSearch(match.query)
                    if (match.query.includes('power bank')) setContext('powerbank')
                    else if (match.query.includes('camara')) setContext('camara')
                    else setContext(null)
                }
            } else {
                reply = FALLBACK_REPLIES[fallbackIndex % FALLBACK_REPLIES.length]
                fallbackIndex++
                updateGlobalSearch(text)
            }

            setMessages(prev => [...prev, { role: 'bot', content: reply }])
            setIsTyping(false)
        }, 900)
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(o => !o)}
                className="fixed bottom-8 right-8 z-[1000] flex flex-col items-center gap-1.5 group"
            >
                <div className="relative">
                    <div className="absolute -inset-3 bg-[#E8341A]/15 blur-xl group-hover:bg-[#E8341A]/30 transition-all rounded-full" />
                    <div className="relative w-16 h-16 bg-[#E8341A] text-white flex items-center justify-center rounded-xl shadow-[0_10px_30px_rgba(232,52,26,0.4)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                        {isOpen ? <X size={22} className="relative z-10" /> : <Bot size={26} className="relative z-10 group-hover:scale-110 transition-transform" />}
                        {totalItems > 0 && !isOpen && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-white text-[#E8341A] text-[9px] font-black flex items-center justify-center rounded-none shadow-lg animate-bounce">
                                {totalItems}
                            </span>
                        )}
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-100" />
                        </span>
                    </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 px-3 py-1 rounded-lg shadow-lg">
                    <p className="text-[9px] font-semibold text-white uppercase tracking-widest leading-none">ATOMIC BOT</p>
                </div>
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-32 right-8 w-[360px] h-[550px] z-[1000] flex flex-col bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                        style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui" }}
                    >
                        {/* Header */}
                        <div className="bg-[#E8341A] px-5 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3 text-white">
                                <Sparkles size={16} />
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-widest leading-none">Asistente Atomic</p>
                                    <p className="text-[9px] text-white/60 mt-0.5">Vendedor Virtual · En línea</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cart Shortcut */}
                        {totalItems > 0 && (
                            <Link href="/web/cart" className="bg-emerald-500/10 border-b border-slate-800 p-4 flex items-center justify-between group hover:bg-emerald-500/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={16} className="text-emerald-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Tienes {totalItems} items en carrito</span>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase">
                                    PAGAR <ArrowRight size={12} />
                                </div>
                            </Link>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${m.role === 'bot' ? 'bg-[#E8341A]/15 text-[#E8341A]' : 'bg-slate-700 text-slate-300'}`}>
                                        {m.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                    <div className="flex flex-col gap-2 max-w-[80%]">
                                        <div className={`px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed font-normal ${m.role === 'bot' ? 'bg-slate-800 text-slate-200 border border-slate-700/50' : 'bg-[#E8341A] text-white'}`}>
                                            {m.content}
                                        </div>
                                        {m.hasCartButton && (
                                            <Link href="/web/cart" className="w-full bg-[#E8341A] text-white py-2 rounded-lg text-center text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all">
                                                Ir al Carrito Ahora
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span className="text-[10px] font-medium">Escribiendo...</span>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribe tu consulta..."
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-[12px] text-white placeholder-slate-500 outline-none focus:border-[#E8341A] transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!query.trim()}
                                    className="bg-[#E8341A] text-white px-4 rounded-lg hover:bg-red-500 disabled:opacity-40 transition-all"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
