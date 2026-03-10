"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Loader2 } from "lucide-react"

type Message = {
    role: "user" | "model"
    content: string
}

interface ChatInterfaceProps {
    botType: "CAPACITADOR" | "TUTOR"
    title: string
    subtitle: string
    welcomeMessage: string
    IconComponent: any
    colorTheme: "orange" | "purple"
}

export default function ChatInterface({ botType, title, subtitle, welcomeMessage, IconComponent, colorTheme }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setIsLoading(true)

        try {
            const apiMessages = [...messages, { role: "user", content: userMsg }]
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages, botType })
            })

            if (res.ok) {
                const data = await res.json()
                setMessages(prev => [...prev, { role: "model", content: data.text }])
            } else {
                setMessages(prev => [...prev, { role: "model", content: "Lo siento, ha ocurrido un error al procesar tu solicitud. Comunícate con soporte." }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", content: "Error de red. Verifica tu conexión e intenta otra vez." }])
        } finally {
            setIsLoading(false)
        }
    }

    // Color Theme Classes
    const bgHeader = colorTheme === 'orange' ? 'bg-orange-600' : 'bg-purple-600'
    const shadowHeader = colorTheme === 'orange' ? 'shadow-orange-600/20' : 'shadow-purple-600/20'
    const textTitle = colorTheme === 'orange' ? 'text-orange-600' : 'text-purple-600'
    const borderBot = colorTheme === 'orange' ? 'border-orange-200' : 'border-purple-200'
    const bgBot = colorTheme === 'orange' ? 'bg-orange-50' : 'bg-purple-50'

    return (
        <div className="flex flex-col h-full bg-white border border-neutral-200 shadow-sm relative overflow-hidden">
            {/* Header */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${bgHeader} flex items-center justify-center text-white shadow-lg ${shadowHeader}`}>
                        <IconComponent size={20} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-neutral-900 uppercase tracking-tight">{title}</h1>
                        <p className={`text-[9px] font-bold ${textTitle} uppercase tracking-widest flex items-center mt-0.5`}>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30">
                {/* Static Welcome Message */}
                <div className="flex justify-start">
                    <div className="flex flex-row items-start gap-4 max-w-[90%]">
                        <div className={`w-8 h-8 shrink-0 flex items-center justify-center border ${bgBot} ${borderBot} ${textTitle}`}>
                            <IconComponent size={16} />
                        </div>
                        <div className="p-4 text-sm font-medium leading-relaxed bg-white border text-neutral-800 border-neutral-200 shadow-sm">
                            {welcomeMessage}
                        </div>
                    </div>
                </div>

                {/* Dynamic Messages */}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-4`}>
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center border ${msg.role === "user" ? "bg-neutral-900 border-neutral-800 text-white" : `${bgBot} ${borderBot} ${textTitle}`}`}>
                                {msg.role === "user" ? <User size={14} /> : <IconComponent size={16} />}
                            </div>
                            <div className={`p-4 text-sm font-medium leading-relaxed ${msg.role === "user" ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/10" : "bg-white border text-neutral-800 border-neutral-200 shadow-sm"}`}>
                                {msg.content.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-center gap-4">
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center border ${bgBot} ${borderBot} ${textTitle}`}>
                                <IconComponent size={16} />
                            </div>
                            <div className={`p-3 bg-white border border-neutral-200 shadow-sm flex items-center space-x-3 ${textTitle}`}>
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Procesando...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-neutral-200 shrink-0">
                <div className="flex space-x-3 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Mensaje..."
                        className={`flex-1 bg-neutral-50 border border-neutral-200 p-3 pt-4 text-sm text-neutral-900 focus:ring-2 ${colorTheme === 'orange' ? 'focus:ring-orange-500' : 'focus:ring-purple-500'} outline-none transition-all resize-none min-h-[50px] max-h-[120px]`}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`${bgHeader} h-14 w-14 shrink-0 flex items-center justify-center text-white disabled:opacity-50 hover:bg-neutral-900 transition-colors shadow-lg ${shadowHeader}`}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
