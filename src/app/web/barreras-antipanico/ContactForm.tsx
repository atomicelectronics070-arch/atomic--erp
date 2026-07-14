'use client'

import { useState } from 'react'
import { submitLeadContactForm } from '@/app/actions/contact'
import { Send, CheckCircle } from 'lucide-react'

export function ContactForm() {
    const [pending, setPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState("")

    async function handleAction(formData: FormData) {
        setPending(true)
        const res = await submitLeadContactForm(formData)
        setMessage(res.message)
        if (res.success) {
            setSuccess(true)
        }
        setPending(false)
    }

    if (success) {
        return (
            <div className="p-8 bg-green-500/10 border border-green-500/30 rounded-3xl text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">¡Recibido!</h3>
                <p className="text-green-400 font-medium">{message}</p>
            </div>
        )
    }

    return (
        <form action={handleAction} className="bg-[#0A0A0A] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6347]/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <h3 className="text-3xl font-black text-white mb-2 relative z-10">Solicita una Cotización</h3>
            <p className="text-gray-400 font-medium mb-8 relative z-10">
                Déjanos tus datos y un experto en seguridad industrial te contactará en breve.
            </p>

            <div className="space-y-5 relative z-10">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Nombre Completo</label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347] transition-all"
                        placeholder="Ej. Juan Pérez"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Número de Teléfono</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        required 
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347] transition-all"
                        placeholder="Ej. 0991234567"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Correo Electrónico (Opcional)</label>
                    <input 
                        type="email" 
                        name="email" 
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347] transition-all"
                        placeholder="juan@empresa.com"
                    />
                </div>

                {message && !success && (
                    <p className="text-[#FF6347] text-sm font-bold mt-2">{message}</p>
                )}

                <button 
                    type="submit" 
                    disabled={pending}
                    className="w-full mt-4 px-8 py-5 bg-gradient-to-r from-[#FF6347] to-[#FF4500] hover:from-[#E5533D] hover:to-[#E03E00] text-white font-black rounded-xl shadow-[0_10px_30px_rgba(255,99,71,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {pending ? 'Enviando...' : 'Quiero ser Contactado'}
                    {!pending && <Send size={18} />}
                </button>
            </div>
        </form>
    )
}
