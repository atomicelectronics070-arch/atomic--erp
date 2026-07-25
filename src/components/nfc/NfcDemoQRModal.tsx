'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NfcDemoQRModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'qr'>('form');
  const [formData, setFormData] = useState({
    negocio: '',
    telefono: '',
    correo: '',
  });

  const qrData = `BEGIN:VCARD
VERSION:3.0
FN:${formData.negocio}
TEL:${formData.telefono}
EMAIL:${formData.correo}
END:VCARD`;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('qr');
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              {step === 'form' ? (
                <form onSubmit={handleGenerate}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Demo con QR</h3>
                  <p className="text-slate-600 mb-6 text-sm">Llama la atención de tus clientes con un QR inteligente. Llena tus datos para probarlo.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del negocio</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={formData.negocio} onChange={e => setFormData({...formData, negocio: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                      <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Correo (Opcional)</label>
                      <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full mt-4 py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-black/20 transition-colors">
                      Generar QR Automático
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Listo!</h3>
                  <p className="text-slate-600 mb-6 text-sm">Los datos que proporcionaste puedes verlos escaneando este QR con tu celular. Y ya.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                    <QRCodeSVG value={qrData} size={180} />
                  </div>
                  
                  <button onClick={() => setStep('form')} className="text-slate-500 hover:text-slate-800 font-medium underline text-sm">
                    Volver a editar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
