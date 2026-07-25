'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NfcContactModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'options' | 'form'>('options');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    whatsapp: '',
  });

  const handleWaDirect = () => {
    const text = encodeURIComponent("¡Hola Atomic! Vengo de la página web, me interesa conocer más sobre las soluciones NFC y agendar una asesoría gratuita.");
    window.open(`https://wa.me/593969043453?text=${text}`, '_blank');
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombres, apellidos, correo, whatsapp } = formData;
    const msg = `¡Hola! Soy ${nombres} ${apellidos}. Me interesa agendar una asesoría sobre soluciones NFC.\nCorreo: ${correo}\nMi WhatsApp es: ${whatsapp}`;
    window.open(`https://wa.me/593969043453?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              {step === 'options' ? (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Agendar Asesoría</h3>
                  <p className="text-slate-600 mb-8">¿Cómo prefieres que nos pongamos en contacto contigo?</p>
                  
                  <div className="space-y-4">
                    <button onClick={handleWaDirect} className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-500/30">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Contacto directo por WhatsApp
                    </button>
                    
                    <button onClick={() => setStep('form')} className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-semibold transition-colors border border-slate-200">
                      Llenar formulario para registro
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="flex items-center gap-3 mb-6">
                    <button type="button" onClick={() => setStep('options')} className="text-slate-400 hover:text-slate-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 className="text-xl font-bold text-slate-900">Tus Datos</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                      <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Número de WhatsApp</label>
                      <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-colors">
                      Enviar a WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
