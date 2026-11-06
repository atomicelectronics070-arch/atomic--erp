'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    CheckCircle2, Clock, AlertTriangle, ArrowRight, 
    Smartphone, Download, ShoppingBag, ShieldCheck, Copy, Check 
} from 'lucide-react';

function ConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderNumber = searchParams.get('orderNumber') || searchParams.get('clientTransactionId');
    const transactionId = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!orderNumber && !transactionId) {
            setError('No se proporcionó número de orden');
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                const query = new URLSearchParams();
                if (orderNumber) query.set('orderNumber', orderNumber);
                if (transactionId) query.set('id', transactionId);

                const res = await fetch(`/api/checkout/payphone/confirm?${query.toString()}`);
                const data = await res.json();

                if (res.ok && (data.success || data.status === 'PAID')) {
                    setOrderData(data.order);
                } else {
                    setError(data.message || data.error || 'Pago pendiente o no autorizado');
                }
            } catch (err: any) {
                setError(err.message || 'Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [orderNumber, transactionId]);

    const handleCopy = (text: string) => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070a14] text-white flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_25px_rgba(6,182,212,0.3)]"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-2">Verificando Pago en Línea...</h2>
                <p className="text-sm text-slate-400 font-mono">Conectando con la pasarela de pagos de PayPhone Ecuador</p>
            </div>
        );
    }

    if (error && !orderData) {
        return (
            <div className="min-h-screen bg-[#070a14] text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Estado de Transacción</h2>
                    <p className="text-sm text-slate-300 mb-6">{error}</p>
                    <div className="flex flex-col gap-3">
                        <Link href="/web/cart" className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs uppercase tracking-widest text-white hover:brightness-110 transition-all">
                            Volver al Carrito
                        </Link>
                        <a 
                            href="https://wa.me/593969043453?text=Hola%20Atomic,%20tuve%20un%20inconveniente%20con%20mi%20pago%20en%20línea" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-full py-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 font-bold text-xs uppercase tracking-widest text-emerald-400 hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Smartphone size={16} /> Contactar Asistencia por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const items = orderData?.itemsData ? JSON.parse(orderData.itemsData) : [];

    return (
        <div className="min-h-screen bg-[#070a14] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 rounded-[32px] p-8 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative z-10">
                
                {/* Header Icon */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                        <CheckCircle2 size={44} strokeWidth={2.5} />
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <ShieldCheck size={12} /> Pago Aprobado Exitosamente
                    </span>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white">¡Gracias por tu compra!</h1>
                    <p className="text-xs text-slate-400 mt-1">Tu pedido ya está siendo preparado para despacho en bodega.</p>
                </div>

                {/* Order Meta Box */}
                <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 mb-6 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <span className="text-slate-400">Número de Orden:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-300">{orderData?.orderNumber}</span>
                            <button onClick={() => handleCopy(orderData?.orderNumber)} className="text-slate-400 hover:text-white transition-colors" title="Copiar número de orden">
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <span className="text-slate-400">Cliente:</span>
                        <span className="font-bold text-white">{orderData?.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <span className="text-slate-400">Email de Entrega:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">{orderData?.customerEmail}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-sm">
                        <span className="text-slate-300 font-bold">Total Pagado:</span>
                        <span className="text-xl font-black text-emerald-400 font-sans">${Number(orderData?.totalAmount || 0).toFixed(2)} USD</span>
                    </div>
                </div>

                {/* Items List */}
                <div className="mb-8">
                    <h3 className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-400 mb-3">Detalle de Productos</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[10px]">
                                        {it.quantity}x
                                    </span>
                                    <span className="text-slate-200 font-medium truncate max-w-[220px]">{it.name}</span>
                                </div>
                                <span className="font-mono font-bold text-white">${(Number(it.price) * (Number(it.quantity) || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <a 
                        href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola Atomic, acabé de pagar la orden #${orderData?.orderNumber} por $${Number(orderData?.totalAmount).toFixed(2)} USD. Deseo coordinar el envío y recepción.`)}`}
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-black text-xs uppercase tracking-wider text-black hover:brightness-110 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                        <Smartphone size={16} /> Coordinar Envío Inmediato por WhatsApp <ArrowRight size={16} />
                    </a>
                    <Link 
                        href="/web" 
                        className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs uppercase tracking-widest text-slate-300 hover:text-white transition-all text-center flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={14} /> Continuar en la Tienda Oficial
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ClientConfirm() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#070a14] text-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ConfirmContent />
        </Suspense>
    );
}
