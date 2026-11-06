"use client";

import React, { useState } from 'react';
import { Mail, Phone, User, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface NewsletterCardProps {
    defaultTopic?: string;
    title?: string;
    subtitle?: string;
    className?: string;
}

export function NewsletterCard({
    defaultTopic = 'Seguridad Electrónica & CCTV',
    title = 'Círculo Tecnológico & Precios VIP para Instaladores',
    subtitle = 'Accede a listas de precios mayoristas, manuales de configuración y diagramas de conexión directa para técnicos e integradores en Ecuador.',
    className = ''
}: NewsletterCardProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [topic, setTopic] = useState(defaultTopic);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const topics = [
        'Seguridad Electrónica & CCTV',
        'Cerraduras Inteligentes & Biometría',
        'Barreras Vehiculares & Motores',
        'Cercos Eléctricos & Perimetral',
        'Domótica & Redes IP'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!email && !phone) {
            setErrorMsg('Por favor ingresa tu correo o número de WhatsApp');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, topic })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setErrorMsg(data.error || 'Ocurrió un error al registrar tu suscripción');
            }
        } catch (err: any) {
            setErrorMsg('Fallo de conexión. Por favor reintenta en unos instantes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-black p-8 md:p-12 shadow-[0_0_60px_rgba(6,182,212,0.12)] backdrop-blur-xl ${className}`}>
            {/* Ambient decorative glowing circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/40 text-cyan-300">
                        <Sparkles size={12} className="text-cyan-400" />
                        Acceso Exclusivo • Ecuador
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 bg-slate-800/60 border border-white/5">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        Sin Spam • Desuscripción en 1 Click
                    </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
                    {title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                    {subtitle}
                </p>

                {success ? (
                    <div className="p-8 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 text-center animate-fade-in">
                        <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
                        <h4 className="text-xl font-bold text-white mb-2">¡Bienvenido al Círculo Tecnológico!</h4>
                        <p className="text-slate-300 text-sm max-w-lg mx-auto">
                            Tu suscripción ha sido confirmada. {phone ? 'Karen ya te envió un mensaje de bienvenida a tu WhatsApp con el enlace directo al catálogo mayorista 2026.' : 'Recibirás nuestras ediciones VIP y ofertas directamente en tu bandeja.'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Nombre o Empresa
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Ej: Ing. Marco Salgado / SegurTech"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                    WhatsApp Oficial (Recomendado)
                                </label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                                    <input
                                        type="tel"
                                        placeholder="Ej: 0998765432 o 5939..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="contacto@tuempresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Selector de Interés */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Especialidad o Interés Principal
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((t) => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setTopic(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            topic === t
                                                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                                                : 'bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {errorMsg && (
                            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-lg">
                                {errorMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black uppercase tracking-wider text-sm text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Activando Membresía...</span>
                                </>
                            ) : (
                                <>
                                    <span>Unirme al Círculo & Descargar Catálogo</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
export default NewsletterCard;
