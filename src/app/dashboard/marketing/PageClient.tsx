"use client"

import React, { useState, useMemo, useEffect } from "react"
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

    const [isLoading, setIsLoading] = useState(true);

    const fetchCampaigns = async () => {
        try {
            const [budgetRes, campaignsRes] = await Promise.all([
                fetch('/api/marketing/budget', { cache: 'no-store' }),
                fetch('/api/marketing/campaigns', { cache: 'no-store' })
            ]);
            if (budgetRes.ok) {
                const budgetData = await budgetRes.json();
                setMasterBudget(budgetData.totalAmount || 0);
            }
            if (campaignsRes.ok) {
                const campaignsData = await campaignsRes.json();
                setCampaigns(campaignsData.map((c: any) => ({
                    ...c,
                    spendLog: c.spendLogs
                })));
            }
        } catch (error) {
            console.error("Error loading marketing data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Master Calculations
    const masterTax = masterBudget * 0.15;
    
    const allocatedBudget = campaigns.reduce((acc, c) => {
        if (c.status === 'CLOSED') {
            return acc + ((c.realBudgetDebited || 0) * 1.15); // Treated as NET, converted to GROSS
        }
        return acc + c.assignedBudget;
    }, 0);
    const availableBudget = masterBudget - allocatedBudget;

    const realSpentGross = campaigns.reduce((acc, c) => {
        const netSpent = c.status === 'CLOSED' ? (c.realBudgetDebited || 0) : c.currentSpent;
        return acc + (netSpent * 1.15);
    }, 0);
    const availableReal = masterBudget - realSpentGross;

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

    // Handlers
    const handleUpdateMasterBudget = async () => {
        try {
            await fetch('/api/marketing/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalAmount: masterBudget })
            });
            alert("Presupuesto Maestro guardado exitosamente");
        } catch (error) {
            alert("Error al guardar presupuesto maestro");
        }
    };

    const handleArchiveMasterBudget = async () => {
        if (!confirm("¿Deseas archivar la meta actual y reiniciar el presupuesto maestro a $0?")) return;
        try {
            await fetch('/api/marketing/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalAmount: 0 })
            });
            setMasterBudget(0);
            alert("Presupuesto archivado y reiniciado a $0");
        } catch (error) {
            alert("Error al reiniciar presupuesto");
        }
    };

    const handleAddCampaign = async () => {
        if (masterBudget <= 0) {
            alert("¡Alto ahí! Primero debes ingresar y 'Guardar' el Presupuesto Maestro antes de crear campañas.");
            return;
        }

        if (newCampaign.assignedBudget! > availableBudget) {
            alert(`No puedes exceder el presupuesto maestro disponible. Tienes $${availableBudget.toFixed(2)} disponibles.`);
            return;
        }

        try {
            const response = await fetch('/api/marketing/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    publishedAd: newCampaign.publishedAd!,
                    platform: newCampaign.platform as Platform,
                    assignedBudget: newCampaign.assignedBudget!,
                    taxDeducted: 0,
                    usableBudget: newCampaign.assignedBudget!,
                    startDate: newCampaign.startDate!,
                    endDate: newCampaign.endDate!,
                    targetHours: newCampaign.targetHours!
                })
            });
            if (response.ok) {
                await fetchCampaigns();
                setIsAddModalOpen(false);
                setNewCampaign({ publishedAd: '', platform: 'Facebook', assignedBudget: 0, startDate: '', endDate: '', targetHours: 0, currentSpent: 0 });
            }
        } catch (error) {
            alert("Error creando campaña");
        }
    };

    const handleDeleteCampaign = async (campaignId: string) => {
        if (!confirm("¿Estás seguro de eliminar completamente esta campaña? Esta acción no se puede deshacer.")) return;
        
        try {
            const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchCampaigns();
            } else {
                alert("Error eliminando campaña");
            }
        } catch (error) {
            alert("Error eliminando campaña");
        }
    };

    const handleAddSpendEntry = async () => {
        if (!selectedCampaignId || !newSpendEntry.date || newSpendEntry.amount <= 0) return;
        
        try {
            const response = await fetch('/api/marketing/spend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: selectedCampaignId,
                    date: newSpendEntry.date,
                    amount: newSpendEntry.amount
                })
            });
            if (response.ok) {
                await fetchCampaigns();
                setNewSpendEntry({ date: '', amount: 0 });
            }
        } catch (error) {
            alert("Error añadiendo gasto");
        }
    };

    const handleDeleteSpendEntry = async (entryId: string) => {
        if(!confirm("¿Estás seguro de eliminar este registro de gasto?")) return;
        try {
            const response = await fetch(`/api/marketing/spend/${entryId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchCampaigns();
            }
        } catch (error) {
            alert("Error eliminando gasto");
        }
    };

    const handleEditBudget = async () => {
        if (!selectedCampaign) return;
        
        const budgetDifference = editBudgetAmount - selectedCampaign.assignedBudget;
        
        if (budgetDifference > availableBudget) {
            alert("No puedes exceder el presupuesto maestro disponible.");
            return;
        }

        const tax = editBudgetAmount * 0.15;
        const usable = editBudgetAmount - tax;

        try {
            const response = await fetch(`/api/marketing/campaigns/${selectedCampaignId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignedBudget: editBudgetAmount,
                    taxDeducted: tax,
                    usableBudget: usable
                })
            });
            if (response.ok) {
                await fetchCampaigns();
                setIsEditBudgetModalOpen(false);
            }
        } catch (error) {
            alert("Error actualizando presupuesto");
        }
    };

    const handleCloseCampaign = async () => {
        if (!selectedCampaign) return;

        const investmentDeduction = closeStats.realBudgetDebited;
        const grossMargin = closeStats.realSales - investmentDeduction;
        const minExpectedReturn = selectedCampaign.assignedBudget;

        try {
            const response = await fetch(`/api/marketing/campaigns/${selectedCampaignId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'CLOSED',
                    realEndDate: closeStats.realEndDate,
                    realSales: closeStats.realSales,
                    realConsultants: closeStats.realConsultants,
                    realBudgetDebited: closeStats.realBudgetDebited,
                    grossMargin,
                    minExpectedReturn
                })
            });
            if (response.ok) {
                await fetchCampaigns();
                setIsCloseModalOpen(false);
            }
        } catch (error) {
            alert("Error cerrando campaña");
        }
    };

    const renderPlatformIcon = (platform: Platform) => {
        // Simplified icon logic, using text/color as replacement for external brand icons
        const colors = {
            'Facebook': 'bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all',
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050914] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white p-6 sm:p-10 pt-28 lg:pt-28 font-sans selection:bg-cyan-500/30">
            {/* Header */}
            <header className="mb-12">
                <div className="inline-flex items-center gap-4 mb-4 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-[0.5em]">
                    <div className="w-12 h-px bg-cyan-400 opacity-60"></div>
                    Módulo Estratégico & Pautas
                </div>
                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none italic bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                    MARKETING <span className="text-cyan-400">COMMAND.</span>
                </h1>
            </header>

            {/* Master Budget Dashboard */}
            <section className="mb-16">
                <GlassPanel className="p-8 sm:p-10 rounded-3xl bg-[#080d1e]/85 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.12)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row gap-10 lg:items-center justify-between relative z-10">
                        <div className="lg:w-1/3">
                            <h2 className="text-lg font-black uppercase tracking-widest text-cyan-300 mb-6 flex items-center gap-3">
                                <DollarSign size={22} className="text-cyan-400" /> Presupuesto Maestro
                            </h2>
                            <CyberInput 
                                label="Fondo Total Asignado ($)" 
                                type="number"
                                value={masterBudget || ''} 
                                onChange={(val) => setMasterBudget(Number(val))} 
                                icon={Target}
                                placeholder="Ej: 5000"
                            />
                            <div className="flex gap-2 mt-4">
                                <button onClick={handleUpdateMasterBudget} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-102 transition-all text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:from-cyan-400 hover:to-indigo-500 flex items-center justify-center gap-2 cursor-pointer">
                                    <CheckCircle2 size={14} /> Guardar Maestro
                                </button>
                                <button onClick={handleArchiveMasterBudget} className="px-4 py-3 bg-white/[0.06] text-white/50 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center cursor-pointer" title="Archivar/Reiniciar Meta a 0">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="bg-[#050914] p-5 rounded-2xl border border-white/10 shadow-lg">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Total Declarado</p>
                                <p className="text-2xl font-black italic text-white">${masterBudget.toFixed(2)}</p>
                                <p className="text-[9px] uppercase tracking-widest mt-1 text-white/40">Neto: ${(masterBudget / 1.15).toFixed(2)}</p>
                            </div>
                            <div className="bg-rose-950/30 p-5 rounded-2xl border border-rose-500/30 text-rose-300 relative overflow-hidden">
                                <Percent className="absolute -right-4 -bottom-4 w-16 h-16 text-rose-500/10 pointer-events-none" />
                                <p className="text-[9px] font-black uppercase tracking-widest text-rose-400/80 mb-1">Reserva IVA (15%)</p>
                                <p className="text-2xl font-black italic text-rose-400">-${masterTax.toFixed(2)}</p>
                            </div>
                            <div className="bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/30 text-indigo-300 relative overflow-hidden">
                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400/80 mb-1">Disponible Estimado</p>
                                <p className="text-3xl font-black italic text-indigo-300">${availableBudget.toFixed(2)}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest mt-1 text-indigo-400/60 leading-tight">Según asignaciones<br/>Neto: ${(availableBudget / 1.15).toFixed(2)}</p>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-500/20 via-indigo-600/20 to-purple-600/20 p-5 rounded-2xl border border-cyan-400/50 shadow-xl shadow-cyan-950/40 text-white relative overflow-hidden">
                                <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-cyan-400/10 pointer-events-none" />
                                <p className="text-[9px] font-black uppercase tracking-widest text-cyan-300 mb-1">Disponible Real</p>
                                <p className="text-3xl font-black italic text-cyan-300">${availableReal.toFixed(2)}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest mt-1 text-cyan-200/70 leading-tight">Fondos actuales en banco<br/>Neto: ${(availableReal / 1.15).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </section>

            {/* Campaigns Section */}
            <section>
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5">
                    <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight italic text-white flex items-center gap-3">
                        <Crosshair size={26} className="text-cyan-400" /> Despliegue de Campañas
                    </h2>
                    <NeonButton variant="primary" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} /> Agregar Campaña
                    </NeonButton>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory custom-scrollbar">
                    {campaigns.length === 0 && (
                        <div className="w-full py-28 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl text-white/40">
                            <Crosshair size={44} className="mb-4 opacity-30 text-cyan-400" />
                            <p className="text-xs font-mono font-black uppercase tracking-[0.3em] text-white/50">Sin campañas activas actualmente</p>
                        </div>
                    )}

                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="min-w-[400px] max-w-[450px] snap-center shrink-0">
                            <CyberCard className="h-full rounded-[2rem] flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        {renderPlatformIcon(campaign.platform)}
                                        <div>
                                            <h3 className="font-black text-lg text-white uppercase tracking-tighter italic leading-none">{campaign.publishedAd}</h3>
                                            <p className="text-[10px] text-cyan-400/80 font-mono font-bold tracking-widest uppercase mt-2">{campaign.platform}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest ${campaign.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/10 text-white/50 border border-white/20'}`}>
                                            {campaign.status}
                                        </div>
                                        <button onClick={() => handleDeleteCampaign(campaign.id)} className="text-white/40 hover:text-rose-400 transition-colors cursor-pointer" title="Eliminar Campaña">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-5 flex-1">
                                    {/* Budget Breakdown & Real-time Spend */}
                                    {(() => {
                                        const isClosed = campaign.status === 'CLOSED';
                                        const netSpent = isClosed ? (campaign.realBudgetDebited || 0) : campaign.currentSpent;
                                        const grossSpent = netSpent * 1.15;
                                        const ivaSpent = netSpent * 0.15;
                                        const remaining = campaign.assignedBudget - grossSpent;

                                        return (
                                            <div className="bg-[#050914] rounded-2xl p-5 border border-white/10 shadow-inner">
                                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                                                    <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                        Presupuesto Asignado
                                                        {!isClosed && (
                                                            <button onClick={() => { setSelectedCampaignId(campaign.id); setEditBudgetAmount(campaign.assignedBudget); setIsEditBudgetModalOpen(true); }} className="p-1 bg-white/10 hover:bg-cyan-500/20 text-white/70 hover:text-cyan-300 rounded transition-colors cursor-pointer" title="Editar Presupuesto">
                                                                <Edit size={12} />
                                                            </button>
                                                        )}
                                                    </span>
                                                    <span className="font-black text-white text-base">${campaign.assignedBudget.toFixed(2)}</span>
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Gasto Neto (Plataforma)</span>
                                                        <span className="font-bold text-white/80 text-sm">${netSpent.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-mono text-rose-400/80 uppercase tracking-widest">+ IVA (15%) Generado</span>
                                                        <span className="font-bold text-rose-400 text-sm">${ivaSpent.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Gasto Total Acumulado</span>
                                                        <span className="font-black text-cyan-300 text-lg">${grossSpent.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Progress Bar */}
                                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                                                    <div 
                                                        className={`h-full ${isClosed ? 'bg-white/30' : (grossSpent > campaign.assignedBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-indigo-500')}`} 
                                                        style={{ width: `${Math.min((grossSpent / campaign.assignedBudget) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                
                                                {/* Restante */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Restante Total</span>
                                                    <span className={`font-black text-sm ${remaining < 0 ? 'text-rose-400' : 'text-indigo-300'}`}>
                                                        ${remaining.toFixed(2)}
                                                    </span>
                                                </div>

                                                {!isClosed && (
                                                    <button 
                                                        onClick={() => { setSelectedCampaignId(campaign.id); setUpdateSpent(campaign.currentSpent); setIsUpdateModalOpen(true); }}
                                                        className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider underline underline-offset-4 w-full text-left cursor-pointer transition-colors"
                                                    >
                                                        Actualizar gasto en tiempo real
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Dates & Hours */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> Inicio</span>
                                            <span className="text-xs font-bold text-white/80">{new Date(campaign.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> Objetivo</span>
                                            <span className="text-xs font-bold text-white/80">{campaign.targetHours} Horas</span>
                                        </div>
                                    </div>

                                    {/* Closed Stats Summary */}
                                    {campaign.status === 'CLOSED' && (
                                        <div className="mt-6 pt-5 border-t border-white/10">
                                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-300 mb-4 flex items-center gap-2">
                                                <BarChart3 size={14} /> Resumen de Resultados
                                            </h4>
                                            
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-[#050914] p-3 rounded-xl border border-white/10 text-center">
                                                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Ventas</p>
                                                    <p className="text-lg font-black text-emerald-400 italic">${campaign.realSales?.toFixed(2)}</p>
                                                </div>
                                                <div className="bg-[#050914] p-3 rounded-xl border border-white/10 text-center">
                                                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Consultantes</p>
                                                    <p className="text-lg font-black text-cyan-400 italic">{campaign.realConsultants}</p>
                                                </div>
                                            </div>

                                            {/* Recharts Visualization */}
                                            <div className="h-44 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={[
                                                            { name: 'Inversión', val: campaign.realBudgetDebited, fill: '#ef4444' },
                                                            { name: 'Ventas', val: campaign.realSales, fill: '#10b981' },
                                                            { name: 'Margen', val: campaign.grossMargin, fill: '#06b6d4' }
                                                        ]}
                                                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(value) => `$${value}`} />
                                                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#090e1f', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.3)', color: '#fff', fontSize: '12px' }} formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Monto']} />
                                                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                                            {
                                                                [
                                                                    { name: 'Inversión', val: campaign.realBudgetDebited, fill: '#ef4444' },
                                                                    { name: 'Ventas', val: campaign.realSales, fill: '#10b981' },
                                                                    { name: 'Margen', val: campaign.grossMargin, fill: '#06b6d4' }
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
                                    <div className="mt-6 pt-5 border-t border-white/10">
                                        <button 
                                            onClick={() => { setSelectedCampaignId(campaign.id); setIsCloseModalOpen(true); }}
                                            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
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
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-3xl bg-[#080d1e] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
                        >
                            <div className="bg-[#0c1329] p-6 border-b border-white/10 flex justify-between items-center text-white shrink-0">
                                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4 italic">
                                    <PlusCircle size={24} className="text-blue-400" /> Nueva Campaña
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-[#060914]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CyberInput label="Nombre del Anuncio" value={newCampaign.publishedAd || ''} onChange={(v) => setNewCampaign({...newCampaign, publishedAd: v})} placeholder="Ej: Promo Verano 2026" />
                                    
                                    <div className="space-y-2 w-full group">
                                        <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest ml-1">Plataforma</label>
                                        <select 
                                            value={newCampaign.platform}
                                            onChange={(e) => setNewCampaign({...newCampaign, platform: e.target.value as Platform})}
                                            className="w-full h-12 bg-[#090e21] border border-white/15 px-4 rounded-xl text-white font-mono text-sm focus:border-cyan-400 outline-none transition-all cursor-pointer"
                                        >
                                            <option value="Facebook" className="bg-[#090e21] text-white">Facebook</option>
                                            <option value="Instagram" className="bg-[#090e21] text-white">Instagram</option>
                                            <option value="WhatsApp" className="bg-[#090e21] text-white">WhatsApp</option>
                                            <option value="TikTok" className="bg-[#090e21] text-white">TikTok</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 bg-[#090e21] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                                        <DollarSign className="absolute -right-8 -bottom-8 w-40 h-40 text-cyan-500/5 pointer-events-none" />
                                        <CyberInput 
                                            label="Presupuesto Asignado (Bruto)" 
                                            type="number" 
                                            value={newCampaign.assignedBudget || ''} 
                                            onChange={(v) => setNewCampaign({...newCampaign, assignedBudget: Number(v)})} 
                                            placeholder="Monto a invertir"
                                        />
                                        <div className="mt-4 flex justify-between items-end border-t border-white/10 pt-4">
                                            <div>
                                                <p className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest">Reserva IVA (15%)</p>
                                                <p className="text-lg font-black text-rose-400 italic">-${((newCampaign.assignedBudget || 0) * 0.15).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Disponible Neta Anuncio</p>
                                                <p className="text-3xl font-black text-cyan-300 italic">${((newCampaign.assignedBudget || 0) * 0.85).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <CyberInput label="Fecha Inicio" type="date" value={newCampaign.startDate || ''} onChange={(v) => setNewCampaign({...newCampaign, startDate: v})} />
                                    <CyberInput label="Fecha Fin" type="date" value={newCampaign.endDate || ''} onChange={(v) => setNewCampaign({...newCampaign, endDate: v})} />
                                    <CyberInput label="Horas de Objetivo" type="number" value={newCampaign.targetHours || ''} onChange={(v) => setNewCampaign({...newCampaign, targetHours: Number(v)})} placeholder="Ej: 72" />
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-white/10 bg-[#0c1329] flex justify-end shrink-0">
                                <NeonButton variant="primary" onClick={handleAddCampaign} disabled={!newCampaign.publishedAd || !newCampaign.assignedBudget || !newCampaign.startDate}>
                                    Crear Campaña <ArrowRight size={16} />
                                </NeonButton>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* UPDATE SPENT MODAL */}
                {isUpdateModalOpen && selectedCampaign && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#080d1e] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden text-white"
                        >
                            <div className="bg-[#0c1329] p-6 text-center border-b border-white/10">
                                <TrendingUp size={28} className="text-cyan-400 mx-auto mb-2" />
                                <h3 className="text-base font-black uppercase tracking-widest text-white italic">Bitácora de Gastos</h3>
                                <p className="text-xs text-cyan-300/70 font-mono mt-1 uppercase">{selectedCampaign.publishedAd}</p>
                            </div>
                            <div className="p-6 max-h-[45vh] overflow-y-auto custom-scrollbar bg-[#060914] border-b border-white/10">
                                {(!selectedCampaign.spendLog || selectedCampaign.spendLog.length === 0) ? (
                                    <p className="text-center text-white/40 text-xs font-mono py-6">No hay registros de gasto aún.</p>
                                ) : (
                                    <div className="space-y-2.5">
                                        {selectedCampaign.spendLog.map(entry => (
                                            <div key={entry.id} className="bg-[#090e21] p-3.5 rounded-xl border border-white/10 flex justify-between items-center group">
                                                <div>
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-0.5">{new Date(entry.date).toLocaleString()}</p>
                                                    <p className="font-bold text-white text-sm">${entry.amount.toFixed(2)} <span className="text-[9px] text-white/40 ml-1">(NETO)</span></p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-mono text-rose-400 uppercase tracking-widest">+ IVA</p>
                                                        <p className="font-bold text-rose-400 text-xs">${(entry.amount * 1.15).toFixed(2)}</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteSpendEntry(entry.id)} className="p-1.5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-[#080d1e] space-y-4">
                                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">Registrar Nuevo Gasto</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <CyberInput 
                                        label="Fecha y Hora" 
                                        type="datetime-local"
                                        value={newSpendEntry.date} 
                                        onChange={(v) => setNewSpendEntry({...newSpendEntry, date: v})} 
                                    />
                                    <CyberInput 
                                        label="Gasto Neto ($)" 
                                        type="number"
                                        value={newSpendEntry.amount || ''} 
                                        onChange={(v) => setNewSpendEntry({...newSpendEntry, amount: Number(v)})} 
                                    />
                                </div>
                                <button 
                                    onClick={handleAddSpendEntry} 
                                    disabled={!newSpendEntry.date || newSpendEntry.amount <= 0}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Plus size={14} /> Añadir a Bitácora
                                </button>
                            </div>
                            <div className="p-5 border-t border-white/10 bg-[#0c1329] flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-mono text-white/40 uppercase">Total Gastado Neto</p>
                                    <p className="text-lg font-black text-white">${selectedCampaign.currentSpent.toFixed(2)}</p>
                                </div>
                                <button onClick={() => setIsUpdateModalOpen(false)} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer">Cerrar</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* EDIT BUDGET MODAL */}
                {isEditBudgetModalOpen && selectedCampaign && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-[#080d1e] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden text-white"
                        >
                            <div className="bg-[#0c1329] p-6 text-center border-b border-white/10">
                                <DollarSign size={28} className="text-cyan-400 mx-auto mb-2" />
                                <h3 className="text-base font-black uppercase tracking-widest text-white italic">Modificar Presupuesto</h3>
                                <p className="text-xs text-cyan-300/70 font-mono mt-1 uppercase">{selectedCampaign.publishedAd}</p>
                            </div>
                            <div className="p-6 bg-[#060914] space-y-4">
                                <CyberInput 
                                    label="Nuevo Presupuesto Asignado (Bruto)" 
                                    type="number"
                                    value={editBudgetAmount || ''} 
                                    onChange={(v) => setEditBudgetAmount(Number(v))} 
                                />
                                <div className="flex justify-between items-center bg-[#090e21] p-3.5 rounded-xl border border-white/10">
                                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Nueva Reserva IVA</span>
                                    <span className="font-bold text-rose-400 text-sm">-${(editBudgetAmount * 0.15).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 p-3.5 rounded-xl border border-cyan-400/40 text-cyan-300">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Nueva Inversión Neta</span>
                                    <span className="font-black text-lg">${(editBudgetAmount * 0.85).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="p-5 border-t border-white/10 bg-[#0c1329] flex gap-3">
                                <button onClick={() => setIsEditBudgetModalOpen(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/5 rounded-xl transition-all cursor-pointer">Cancelar</button>
                                <button onClick={handleEditBudget} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer">Guardar Cambios</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* CLOSE CAMPAIGN MODAL */}
                {isCloseModalOpen && selectedCampaign && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-4xl bg-[#080d1e] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
                        >
                            <div className="bg-[#0c1329] p-6 border-b border-white/10 flex justify-between items-center text-white shrink-0">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 italic mb-0.5">
                                        <CheckCircle2 size={22} className="text-emerald-400" /> Conciliación Final
                                    </h3>
                                    <p className="text-[10px] text-cyan-400/70 font-mono uppercase tracking-widest">{selectedCampaign.publishedAd}</p>
                                </div>
                                <button onClick={() => setIsCloseModalOpen(false)} className="text-white/50 hover:text-white transition-colors cursor-pointer"><X size={22} /></button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#060914]">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/50 border-b border-white/10 pb-3">Métricas Reales (Resultados)</h4>
                                        <CyberInput label="Ventas Obtenidas ($)" type="number" value={closeStats.realSales || ''} onChange={(v) => setCloseStats({...closeStats, realSales: Number(v)})} />
                                        <CyberInput label="Consultantes (Leads) Obtenidos" type="number" value={closeStats.realConsultants || ''} onChange={(v) => setCloseStats({...closeStats, realConsultants: Number(v)})} />
                                        <CyberInput label="Presupuesto Real Debitado ($)" type="number" value={closeStats.realBudgetDebited || ''} onChange={(v) => setCloseStats({...closeStats, realBudgetDebited: Number(v)})} />
                                        <CyberInput label="Fecha y Hora Real Fin" type="datetime-local" value={closeStats.realEndDate || ''} onChange={(v) => setCloseStats({...closeStats, realEndDate: v})} />
                                    </div>

                                    <div className="bg-[#090e21] p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-cyan-400 mb-6">Proyección Analítica</h4>
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Inversión Real Debitada</span>
                                                    <span className="font-bold text-rose-400 text-base">-${closeStats.realBudgetDebited.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Ventas Totales</span>
                                                    <span className="font-bold text-emerald-400 text-base">${closeStats.realSales.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-[#050914] p-3.5 rounded-xl border border-white/10">
                                                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">Margen Bruto</span>
                                                    <span className="font-black text-cyan-400 text-xl italic">${(closeStats.realSales - closeStats.realBudgetDebited).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 bg-[#050914] p-4 rounded-xl border border-white/10 flex gap-4 items-center">
                                            <Target size={24} className="text-cyan-400 shrink-0" />
                                            <div>
                                                <p className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-0.5">Retorno Mínimo Esperado</p>
                                                <p className="text-lg font-black text-white italic">${selectedCampaign.assignedBudget.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-white/10 bg-[#0c1329] flex justify-end shrink-0">
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
