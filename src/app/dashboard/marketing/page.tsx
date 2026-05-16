"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    PieChart as PieIcon, TrendingUp, DollarSign, Calendar, Clock, Edit, 
    Trash2, Plus, X, BarChart3, Target, Crosshair, ArrowRight, Zap,
    CheckCircle2, AlertCircle, Percent
} from "lucide-react"
import { CyberCard, NeonButton, CyberInput, GlassPanel } from "@/components/ui/CyberUI"
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    Legend, ResponsiveContainer, Cell 
} from "recharts"

type Platform = 'Facebook' | 'WhatsApp' | 'Instagram' | 'TikTok';

export interface SpendEntry {
    id: string;
    date: string;
    amount: number;
}

interface Campaign {
    id: string;
    publishedAd: string;
    platform: Platform;
    assignedBudget: number;
    taxDeducted: number;
    usableBudget: number;
    startDate: string;
    endDate: string;
    targetHours: number;
    currentSpent: number;
    spendLog?: SpendEntry[];
    status: 'ACTIVE' | 'CLOSED';
    
    // Closed Stats
    realEndDate?: string;
    realBudgetDebited?: number;
    realSales?: number;
    realConsultants?: number;
    grossMargin?: number;
    minExpectedReturn?: number;
}

export default function MarketingDashboard() {
    const [masterBudget, setMasterBudget] = useState<number>(0);
    
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    
    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

    // Form states
    const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
        publishedAd: '',
        platform: 'Facebook',
        assignedBudget: 0,
        startDate: '',
        endDate: '',
        targetHours: 0,
        currentSpent: 0
    });

    const [updateSpent, setUpdateSpent] = useState<number>(0);
    const [newSpendEntry, setNewSpendEntry] = useState<{date: string, amount: number}>({ date: '', amount: 0 });
    const [editBudgetAmount, setEditBudgetAmount] = useState<number>(0);
    
    const [closeStats, setCloseStats] = useState({
        realEndDate: '',
        realSales: 0,
        realConsultants: 0,
        realBudgetDebited: 0
    });

    // Master Calculations
    const masterTax = masterBudget * 0.15;
    const masterUsable = masterBudget - masterTax;
    const allocatedBudget = campaigns.reduce((acc, c) => acc + c.assignedBudget, 0);
    const availableBudget = masterUsable - allocatedBudget;

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

    // Handlers
    const handleAddCampaign = () => {
        if (newCampaign.assignedBudget! > availableBudget) {
            alert("No puedes exceder el presupuesto maestro disponible.");
            return;
        }

        const tax = newCampaign.assignedBudget! * 0.15;
        const usable = newCampaign.assignedBudget! - tax;

        const campaignToCreate: Campaign = {
            id: Math.random().toString(36).substr(2, 9),
            publishedAd: newCampaign.publishedAd!,
            platform: newCampaign.platform as Platform,
            assignedBudget: newCampaign.assignedBudget!,
            taxDeducted: tax,
            usableBudget: usable,
            startDate: newCampaign.startDate!,
            endDate: newCampaign.endDate!,
            targetHours: newCampaign.targetHours!,
            currentSpent: newCampaign.currentSpent || 0,
            status: 'ACTIVE'
        };

        setCampaigns([campaignToCreate, ...campaigns]);
        setIsAddModalOpen(false);
        setNewCampaign({ publishedAd: '', platform: 'Facebook', assignedBudget: 0, startDate: '', endDate: '', targetHours: 0, currentSpent: 0 });
    };

    const handleAddSpendEntry = () => {
        if (!selectedCampaignId || !newSpendEntry.date || newSpendEntry.amount <= 0) return;
        const entry: SpendEntry = {
            id: Math.random().toString(36).substr(2, 9),
            date: newSpendEntry.date,
            amount: newSpendEntry.amount
        };
        setCampaigns(prev => prev.map(c => {
            if (c.id === selectedCampaignId) {
                const newLog = [...(c.spendLog || []), entry];
                const newTotal = newLog.reduce((acc, curr) => acc + curr.amount, 0);
                return { ...c, spendLog: newLog, currentSpent: newTotal };
            }
            return c;
        }));
        setNewSpendEntry({ date: '', amount: 0 });
    };

    const handleDeleteSpendEntry = (entryId: string) => {
        if(!confirm("¿Estás seguro de eliminar este registro de gasto?")) return;
        setCampaigns(prev => prev.map(c => {
            if (c.id === selectedCampaignId) {
                const newLog = (c.spendLog || []).filter(e => e.id !== entryId);
                const newTotal = newLog.reduce((acc, curr) => acc + curr.amount, 0);
                return { ...c, spendLog: newLog, currentSpent: newTotal };
            }
            return c;
        }));
    };

    const handleEditBudget = () => {
        if (!selectedCampaign) return;
        
        const budgetDifference = editBudgetAmount - selectedCampaign.assignedBudget;
        
        if (budgetDifference > availableBudget) {
            alert("No puedes exceder el presupuesto maestro disponible.");
            return;
        }

        const tax = editBudgetAmount * 0.15;
        const usable = editBudgetAmount - tax;

        setCampaigns(prev => prev.map(c => {
            if (c.id === selectedCampaignId) {
                return { ...c, assignedBudget: editBudgetAmount, taxDeducted: tax, usableBudget: usable };
            }
            return c;
        }));
        setIsEditBudgetModalOpen(false);
    };

    const handleCloseCampaign = () => {
        if (!selectedCampaign) return;

        const investmentDeduction = closeStats.realBudgetDebited;
        const grossMargin = closeStats.realSales - investmentDeduction;
        const minExpectedReturn = selectedCampaign.assignedBudget;

        setCampaigns(prev => prev.map(c => {
            if (c.id === selectedCampaignId) {
                return {
                    ...c,
                    status: 'CLOSED',
                    realEndDate: closeStats.realEndDate,
                    realSales: closeStats.realSales,
                    realConsultants: closeStats.realConsultants,
                    realBudgetDebited: closeStats.realBudgetDebited,
                    grossMargin,
                    minExpectedReturn
                };
            }
            return c;
        }));
        setIsCloseModalOpen(false);
    };

    const renderPlatformIcon = (platform: Platform) => {
        // Simplified icon logic, using text/color as replacement for external brand icons
        const colors = {
            'Facebook': 'bg-blue-600',
            'WhatsApp': 'bg-green-500',
            'Instagram': 'bg-pink-600',
            'TikTok': 'bg-black border border-white/20'
        };
        return (
            <div className={`w-8 h-8 rounded-full ${colors[platform]} flex items-center justify-center text-white text-[10px] font-black`}>
                {platform[0]}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8 pt-32 lg:p-16 lg:pt-32 font-sans selection:bg-blue-600/20">
            {/* Header */}
            <header className="mb-16">
                <div className="inline-flex items-center gap-4 mb-6 text-blue-600/80 text-[10px] font-bold uppercase tracking-[0.5em]">
                    <div className="w-12 h-px bg-current opacity-40"></div>
                    Módulo Estratégico
                </div>
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none italic text-[#1E3A8A]">
                    MARKETING <span className="text-blue-600">COMMAND.</span>
                </h1>
            </header>

            {/* Master Budget Dashboard */}
            <section className="mb-20">
                <GlassPanel className="p-10 rounded-[2rem] border-blue-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row gap-12 lg:items-center justify-between relative z-10">
                        <div className="lg:w-1/3">
                            <h2 className="text-xl font-black uppercase tracking-widest text-[#1E3A8A] mb-6 flex items-center gap-3">
                                <DollarSign size={24} className="text-blue-600" /> Presupuesto Maestro
                            </h2>
                            <CyberInput 
                                label="Fondo Total Asignado ($)" 
                                type="number"
                                value={masterBudget || ''} 
                                onChange={(val) => setMasterBudget(Number(val))} 
                                icon={Target}
                                placeholder="Ej: 5000"
                            />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Declarado</p>
                                <p className="text-3xl font-black italic text-slate-800">${masterBudget.toFixed(2)}</p>
                            </div>
                            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 relative overflow-hidden">
                                <Percent className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/5" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-600/70 mb-2">Impuestos (15% IVA)</p>
                                <p className="text-3xl font-black italic text-red-600">-${masterTax.toFixed(2)}</p>
                            </div>
                            <div className="bg-blue-600 p-6 rounded-2xl border border-blue-500 shadow-xl shadow-blue-600/20 text-white relative overflow-hidden">
                                <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Disponible Real</p>
                                <p className="text-4xl font-black italic">${availableBudget.toFixed(2)}</p>
                                <p className="text-[9px] uppercase tracking-widest mt-2 text-blue-200">De ${masterUsable.toFixed(2)} Utilizables</p>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </section>

            {/* Campaigns Section */}
            <section>
                <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic text-[#1E3A8A] flex items-center gap-4">
                        <Crosshair size={28} className="text-blue-600" /> Despliegue de Campañas
                    </h2>
                    <NeonButton variant="primary" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} /> Agregar Campaña
                    </NeonButton>
                </div>

                <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory custom-scrollbar">
                    {campaigns.length === 0 && (
                        <div className="w-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
                            <Crosshair size={48} className="mb-6 opacity-20" />
                            <p className="text-sm font-black uppercase tracking-[0.3em] italic">Sin campañas activas</p>
                        </div>
                    )}

                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="min-w-[400px] max-w-[450px] snap-center shrink-0">
                            <CyberCard className="h-full rounded-[2rem] flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        {renderPlatformIcon(campaign.platform)}
                                        <div>
                                            <h3 className="font-black text-lg text-[#1E3A8A] uppercase tracking-tighter italic leading-none">{campaign.publishedAd}</h3>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-2">{campaign.platform}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {campaign.status}
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {/* Budget Breakdown */}
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                Presupuesto Asignado
                                                {campaign.status === 'ACTIVE' && (
                                                    <button onClick={() => { setSelectedCampaignId(campaign.id); setEditBudgetAmount(campaign.assignedBudget); setIsEditBudgetModalOpen(true); }} className="p-1 bg-slate-200 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded transition-colors" title="Editar Presupuesto">
                                                        <Edit size={12} />
                                                    </button>
                                                )}
                                            </span>
                                            <span className="font-black text-slate-800">${campaign.assignedBudget.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[9px] font-bold text-red-500/70 uppercase tracking-widest">- IVA (15%) Reserva</span>
                                            <span className="font-bold text-red-500 text-sm">-${campaign.taxDeducted.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Inversión Neta</span>
                                            <span className="font-black text-blue-600 text-lg">${campaign.usableBudget.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Real-time Spend Progress */}
                                    {campaign.status === 'ACTIVE' && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                                        <TrendingUp size={12} /> Gasto Neto (Plataforma)
                                                    </span>
                                                    <div className="text-right">
                                                        <span className={`font-black text-xl ${campaign.currentSpent > campaign.usableBudget ? 'text-red-500' : 'text-slate-800'}`}>
                                                            ${campaign.currentSpent.toFixed(2)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold ml-1">/ ${campaign.usableBudget.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${campaign.currentSpent > campaign.usableBudget ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                        style={{ width: `${Math.min((campaign.currentSpent / campaign.usableBudget) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-red-600/70 uppercase tracking-widest">Gasto Total (+15% IVA)</span>
                                                    <span className={`font-black text-sm ${campaign.currentSpent * 1.15 > campaign.assignedBudget ? 'text-red-600' : 'text-red-500'}`}>
                                                        ${(campaign.currentSpent * 1.15).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Límite Total Asignado</span>
                                                    <span className="font-bold text-xs text-slate-600">${campaign.assignedBudget.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => { setSelectedCampaignId(campaign.id); setUpdateSpent(campaign.currentSpent); setIsUpdateModalOpen(true); }}
                                                className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest underline decoration-blue-600/30 underline-offset-4 w-full text-left mt-2"
                                            >
                                                Actualizar gasto en tiempo real
                                            </button>
                                        </div>
                                    )}

                                    {/* Dates & Hours */}
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> Inicio</span>
                                            <span className="text-xs font-bold text-slate-700">{new Date(campaign.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> Objetivo</span>
                                            <span className="text-xs font-bold text-slate-700">{campaign.targetHours} Horas</span>
                                        </div>
                                    </div>

                                    {/* Closed Stats Summary */}
                                    {campaign.status === 'CLOSED' && (
                                        <div className="mt-8 pt-6 border-t border-slate-200">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1E3A8A] mb-6 flex items-center gap-2">
                                                <BarChart3 size={14} /> Resumen de Resultados
                                            </h4>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ventas</p>
                                                    <p className="text-xl font-black text-emerald-600 italic">${campaign.realSales?.toFixed(2)}</p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Consultantes</p>
                                                    <p className="text-xl font-black text-blue-600 italic">{campaign.realConsultants}</p>
                                                </div>
                                            </div>

                                            {/* Recharts Visualization */}
                                            <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={[
                                                            { name: 'Inversión', val: campaign.realBudgetDebited, fill: '#ef4444' }, // Red
                                                            { name: 'Ventas', val: campaign.realSales, fill: '#10b981' }, // Emerald
                                                            { name: 'Margen', val: campaign.grossMargin, fill: '#3b82f6' } // Blue
                                                        ]}
                                                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                                                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Monto']} />
                                                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                                            {
                                                                [
                                                                    { name: 'Inversión', val: campaign.realBudgetDebited, fill: '#ef4444' },
                                                                    { name: 'Ventas', val: campaign.realSales, fill: '#10b981' },
                                                                    { name: 'Margen', val: campaign.grossMargin, fill: '#3b82f6' }
                                                                ].map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                ))
                                                            }
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {campaign.status === 'ACTIVE' && (
                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        <button 
                                            onClick={() => { setSelectedCampaignId(campaign.id); setIsCloseModalOpen(true); }}
                                            className="w-full py-4 bg-slate-900 text-white hover:bg-blue-600 transition-colors rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-lg flex items-center justify-center gap-3"
                                        >
                                            <CheckCircle2 size={16} /> Cerrar & Conciliar
                                        </button>
                                    </div>
                                )}
                            </CyberCard>
                        </div>
                    ))}
                </div>
            </section>

            {/* ADD CAMPAIGN MODAL */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="bg-[#1E3A8A] p-8 flex justify-between items-center text-white shrink-0">
                                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4 italic">
                                    <PlusCircle size={24} className="text-blue-400" /> Nueva Campaña
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            
                            <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <CyberInput label="Nombre del Anuncio" value={newCampaign.publishedAd || ''} onChange={(v) => setNewCampaign({...newCampaign, publishedAd: v})} placeholder="Ej: Promo Verano 2026" />
                                    
                                    <div className="space-y-3 w-full group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic ml-2">Plataforma</label>
                                        <select 
                                            value={newCampaign.platform}
                                            onChange={(e) => setNewCampaign({...newCampaign, platform: e.target.value as Platform})}
                                            className="w-full bg-slate-50 border border-slate-200 p-6 text-[#0F172A] font-black tracking-widest focus:border-[#1E3A8A] outline-none transition-all cursor-pointer"
                                        >
                                            <option value="Facebook">Facebook</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="WhatsApp">WhatsApp</option>
                                            <option value="TikTok">TikTok</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 bg-blue-50/50 border border-blue-100 p-8 rounded-2xl relative overflow-hidden">
                                        <DollarSign className="absolute -right-8 -bottom-8 w-40 h-40 text-blue-500/5 pointer-events-none" />
                                        <CyberInput 
                                            label="Presupuesto Asignado (Bruto)" 
                                            type="number" 
                                            value={newCampaign.assignedBudget || ''} 
                                            onChange={(v) => setNewCampaign({...newCampaign, assignedBudget: Number(v)})} 
                                            placeholder="Monto a invertir"
                                        />
                                        <div className="mt-6 flex justify-between items-end border-t border-blue-200/50 pt-6">
                                            <div>
                                                <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Reserva IVA (15%)</p>
                                                <p className="text-lg font-black text-red-500 italic">-${((newCampaign.assignedBudget || 0) * 0.15).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Disponible Neta Anuncio</p>
                                                <p className="text-3xl font-black text-blue-700 italic">${((newCampaign.assignedBudget || 0) * 0.85).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <CyberInput label="Fecha Inicio" type="date" value={newCampaign.startDate || ''} onChange={(v) => setNewCampaign({...newCampaign, startDate: v})} />
                                    <CyberInput label="Fecha Fin" type="date" value={newCampaign.endDate || ''} onChange={(v) => setNewCampaign({...newCampaign, endDate: v})} />
                                    <CyberInput label="Horas de Objetivo" type="number" value={newCampaign.targetHours || ''} onChange={(v) => setNewCampaign({...newCampaign, targetHours: Number(v)})} placeholder="Ej: 72" />
                                </div>
                            </div>
                            
                            <div className="p-8 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
                                <NeonButton variant="primary" onClick={handleAddCampaign} disabled={!newCampaign.publishedAd || !newCampaign.assignedBudget || !newCampaign.startDate}>
                                    Crear Campaña <ArrowRight size={16} />
                                </NeonButton>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* UPDATE SPENT MODAL */}
                {isUpdateModalOpen && selectedCampaign && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            <div className="bg-slate-100 p-8 text-center border-b border-slate-200">
                                <TrendingUp size={32} className="text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 italic">Bitácora de Gastos</h3>
                                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest">{selectedCampaign.publishedAd}</p>
                            </div>
                            <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar bg-slate-50 border-b border-slate-200">
                                {(!selectedCampaign.spendLog || selectedCampaign.spendLog.length === 0) ? (
                                    <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest py-8">No hay registros aún.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedCampaign.spendLog.map(entry => (
                                            <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm group">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(entry.date).toLocaleString()}</p>
                                                    <p className="font-black text-slate-800">${entry.amount.toFixed(2)} <span className="text-[9px] text-slate-400 ml-1">(NETO)</span></p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">+ IVA</p>
                                                        <p className="font-bold text-red-600 text-sm">${(entry.amount * 1.15).toFixed(2)}</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteSpendEntry(entry.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-8 bg-white space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Registrar Nuevo Gasto</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <CyberInput 
                                        label="Fecha y Hora" 
                                        type="datetime-local"
                                        value={newSpendEntry.date} 
                                        onChange={(v) => setNewSpendEntry({...newSpendEntry, date: v})} 
                                    />
                                    <CyberInput 
                                        label="Gasto Neta ($)" 
                                        type="number"
                                        value={newSpendEntry.amount || ''} 
                                        onChange={(v) => setNewSpendEntry({...newSpendEntry, amount: Number(v)})} 
                                    />
                                </div>
                                <button 
                                    onClick={handleAddSpendEntry} 
                                    disabled={!newSpendEntry.date || newSpendEntry.amount <= 0}
                                    className="w-full py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} /> Añadir a Bitácora
                                </button>
                            </div>
                            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Gastado Neto</p>
                                    <p className="text-xl font-black text-slate-800">${selectedCampaign.currentSpent.toFixed(2)}</p>
                                </div>
                                <button onClick={() => setIsUpdateModalOpen(false)} className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 rounded-xl shadow-lg transition-all">Cerrar</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* EDIT BUDGET MODAL */}
                {isEditBudgetModalOpen && selectedCampaign && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            <div className="bg-slate-100 p-8 text-center border-b border-slate-200">
                                <DollarSign size={32} className="text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 italic">Modificar Presupuesto</h3>
                                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest">{selectedCampaign.publishedAd}</p>
                            </div>
                            <div className="p-8">
                                <CyberInput 
                                    label="Nuevo Presupuesto Asignado (Bruto)" 
                                    type="number"
                                    value={editBudgetAmount || ''} 
                                    onChange={(v) => setEditBudgetAmount(Number(v))} 
                                />
                                <div className="mt-4 flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Nueva Reserva IVA</span>
                                    <span className="font-black text-red-500 text-sm">-${(editBudgetAmount * 0.15).toFixed(2)}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center bg-blue-600 p-4 rounded-xl text-white shadow-lg">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Nueva Inversión Neta</span>
                                    <span className="font-black text-lg">${(editBudgetAmount * 0.85).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-200 flex gap-4">
                                <button onClick={() => setIsEditBudgetModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors rounded-xl">Cancelar</button>
                                <button onClick={handleEditBudget} className="flex-1 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all rounded-xl">Guardar Cambios</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* CLOSE CAMPAIGN MODAL */}
                {isCloseModalOpen && selectedCampaign && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="bg-[#1E3A8A] p-8 flex justify-between items-center text-white shrink-0">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4 italic mb-1">
                                        <CheckCircle2 size={24} className="text-emerald-400" /> Conciliación Final
                                    </h3>
                                    <p className="text-[10px] text-blue-200 uppercase tracking-widest">{selectedCampaign.publishedAd}</p>
                                </div>
                                <button onClick={() => setIsCloseModalOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            
                            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-slate-200 pb-4">Métricas Reales (Resultados)</h4>
                                        <CyberInput label="Ventas Obtenidas ($)" type="number" value={closeStats.realSales || ''} onChange={(v) => setCloseStats({...closeStats, realSales: Number(v)})} />
                                        <CyberInput label="Consultantes (Leads) Obtenidos" type="number" value={closeStats.realConsultants || ''} onChange={(v) => setCloseStats({...closeStats, realConsultants: Number(v)})} />
                                        <CyberInput label="Presupuesto Real Debitado ($)" type="number" value={closeStats.realBudgetDebited || ''} onChange={(v) => setCloseStats({...closeStats, realBudgetDebited: Number(v)})} />
                                        <CyberInput label="Fecha y Hora Real Fin" type="datetime-local" value={closeStats.realEndDate || ''} onChange={(v) => setCloseStats({...closeStats, realEndDate: v})} />
                                    </div>

                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                                        <BarChart3 className="absolute -right-10 -top-10 w-48 h-48 text-slate-50 pointer-events-none" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8 relative z-10">Proyección Analítica</h4>
                                        
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Real Debitada</span>
                                                <span className="font-black text-red-500 text-lg">-${closeStats.realBudgetDebited.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas Totales</span>
                                                <span className="font-black text-emerald-500 text-lg">${closeStats.realSales.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
                                                <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest">Margen Bruto</span>
                                                <span className="font-black text-blue-600 text-2xl italic">${(closeStats.realSales - closeStats.realBudgetDebited).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl flex gap-6 items-center">
                                            <Target size={32} className="text-secondary shrink-0" />
                                            <div>
                                                <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Retorno Mínimo Esperado</p>
                                                <p className="text-xl font-black italic">${selectedCampaign.assignedBudget.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 border-t border-slate-200 bg-white flex justify-end shrink-0">
                                <NeonButton variant="primary" onClick={handleCloseCampaign}>
                                    Confirmar Cierre <ArrowRight size={16} />
                                </NeonButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PlusCircle(props: any) {
    return <Plus {...props} />
}
