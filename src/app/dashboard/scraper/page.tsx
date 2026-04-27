"use client"

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, Bot, Search, Settings, Sparkles, Store, Trash2, Globe, Plus, ChevronDown, ChevronUp, Activity, Play, ChevronRight, History, Eye, FileSpreadsheet, FileText, Save, LayoutGrid, List, CheckCircle2, X, Clock, Database, Download, AlertCircle, WifiOff } from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface Config {
    infiniteScroll: boolean;
    fullScrap: boolean;
    supabaseUrl: string;
    supabaseKey: string;
    multiplier: number;
    fields: string[];
    aiInstruction: string;
    auth: { enabled: boolean; username: string; password: string; cookies: string; };
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ScraperPage() {
    const [url, setUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [providers, setProviders] = useState<any[]>([]);
    const [isLoadingProviders, setIsLoadingProviders] = useState(false);
    const [config, setConfig] = useState<Config>({
        infiniteScroll: true, fullScrap: false,
        supabaseUrl: '', supabaseKey: '', multiplier: 0,
        fields: ['title', 'price', 'description', 'images', 'catalog'],
        aiInstruction: '',
        auth: { enabled: false, username: '', password: '', cookies: '' }
    });
    const [selectedFields, setSelectedFields] = useState(['title', 'price', 'images']);
    const [results, setResults] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [promptHistory, setPromptHistory] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [lastHistoryId, setLastHistoryId] = useState<string | null>(null);
    const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
    const [openSection, setOpenSection] = useState<string | null>('general');

    useEffect(() => {
        const saved = localStorage.getItem('prompt_history');
        if (saved) { try { setPromptHistory(JSON.parse(saved)); } catch (e) {} }
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            // Use the Next.js proxy rewrite to avoid CORS and IPv6 resolution issues locally
            const response = await fetch('/scraper-api/history');
            if (response.ok) {
                setBackendOnline(true);
                fetchProviders();
            } else {
                setBackendOnline(false);
            }
        } catch (e) {
            setBackendOnline(false);
        }
    };

    const fetchProviders = async () => {
        setIsLoadingProviders(true);
        try {
            const res = await axios.get('/scraper-api/providers', { timeout: 5000 });
            if (res.data.success) setProviders(res.data.providers);
            setBackendOnline(true);
        } catch { setBackendOnline(false); }
        finally { setIsLoadingProviders(false); }
    };

    const startScraping = async () => {
        if (!url) return;
        setError(''); setSuccess(''); setIsScraping(true); setResults([]);
        try {
            const res = await axios.post('/scraper-api/scrape', { url, config }, { timeout: 120000 });
            if (res.data.success) {
                setResults(res.data.data || []);
                setLastHistoryId(res.data.historyId);
                if (res.data.total === 0) {
                    setError('Se extrajeron 0 productos. Prueba activando "Acceso Protegido" con Cookies.');
                } else {
                    setSuccess(`✓ Se extrajeron ${res.data.total} productos con éxito.`);
                }
                if (config.aiInstruction) {
                    const updated = [config.aiInstruction, ...promptHistory.filter(p => p !== config.aiInstruction)].slice(0, 5);
                    setPromptHistory(updated);
                    localStorage.setItem('prompt_history', JSON.stringify(updated));
                }
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message;
            setError('Error al extraer: ' + msg);
        } finally { setIsScraping(false); }
    };

    const fetchHistory = async () => {
        setError('');
        try {
            const res = await axios.get('/scraper-api/history', { timeout: 5000 });
            setHistory(res.data.history || []);
            setShowHistory(true);
        } catch { setError('Error al cargar historial. ¿Está el servidor corriendo?'); }
    };

    const handlePreview = async () => {
        setError('');
        if (!lastHistoryId && results.length === 0) { setError('Primero extrae datos para previsualizar.'); return; }
        try {
            const res = await axios.post('/scraper-api/preview', { fields: selectedFields, historyId: lastHistoryId }, { timeout: 10000 });
            if (res.data.success) { setPreviewData(res.data); setShowPreview(true); }
            else setError(res.data.message || res.data.error || 'Sin datos para previsualizar.');
        } catch (err: any) { setError('Error al previsualizar: ' + (err.response?.data?.error || err.message)); }
    };

    const handleExport = async (format: string, historyId?: string) => {
        const hId = historyId || lastHistoryId;
        if (results.length === 0 && !hId) return;
        setError(''); setIsExporting(true);
        try {
            const res = await axios.post('/scraper-api/export', { format, fields: selectedFields, historyId: hId }, { timeout: 30000 });
            if (res.data.success) {
                const blob = await axios.get(`/scraper-download${res.data.downloadUrl}`, { responseType: 'blob', timeout: 30000 });
                const blobUrl = window.URL.createObjectURL(new Blob([blob.data]));
                const a = document.createElement('a');
                a.href = blobUrl; a.download = res.data.fileName;
                document.body.appendChild(a); a.click(); a.remove();
                setSuccess(`${format.toUpperCase()} descargado.`);
            }
        } catch (err: any) { setError('Error al exportar: ' + (err.response?.data?.error || err.message)); }
        finally { setIsExporting(false); }
    };

    const handleExportStore = async (id: string | null = lastHistoryId) => {
        setError(''); setIsExporting(true);
        try {
            const res = await axios.post('/scraper-api/export-store', { historyId: id, supabaseUrl: config.supabaseUrl, supabaseKey: config.supabaseKey }, { timeout: 60000 });
            if (res.data.success) { setSuccess(res.data.message || 'Exportado a la tienda.'); fetchProviders(); }
        } catch (err: any) { setError('Error al exportar a tienda: ' + (err.response?.data?.error || err.message)); }
        finally { setIsExporting(false); }
    };

    const handleCleanupDuplicates = async () => {
        if (!window.confirm('¿Eliminar todos los duplicados 100% idénticos?')) return;
        setIsExporting(true);
        try {
            const res = await axios.post('/scraper-api/cleanup-duplicates', {}, { timeout: 30000 });
            if (res.data.success) { setSuccess(res.data.message); fetchProviders(); }
        } catch { setError('Error al limpiar duplicados'); }
        finally { setIsExporting(false); }
    };

    const toggleExportField = (f: string) => setSelectedFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    const toggleField = (f: string) => setConfig(prev => ({ ...prev, fields: prev.fields.includes(f) ? prev.fields.filter(x => x !== f) : [...prev.fields, f] }));

    return (
        <div className="w-full min-h-full">
            {/* Sub-header */}
            <div className="flex items-center justify-between px-0 py-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-none">
                        <Bot size={18} className="text-indigo-400" />
                    </div>
                    <div>
                        <span className="text-[11px] font-black text-slate-200 uppercase tracking-[0.2em] block">Scraper Pro AI</span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest">Admin Direct · Puerto 5005</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-none flex items-center gap-1 ${backendOnline === true ? 'bg-green-500/10 text-green-400 border-green-500/20' : backendOnline === false ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-none ${backendOnline === true ? 'bg-green-400 animate-pulse' : backendOnline === false ? 'bg-red-500' : 'bg-slate-600'}`} />
                        {backendOnline === true ? 'ONLINE' : backendOnline === false ? 'OFFLINE' : '...'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { checkBackendStatus(); setResults([]); setError(''); setSuccess(''); }}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest border border-slate-700 px-3 py-1.5 hover:border-slate-500 transition-all rounded-none"
                    >
                        <RefreshCw size={10} />
                        Limpiar
                    </button>
                    <a href="/scraper/index.html" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-3 py-1.5 hover:border-indigo-600 transition-all rounded-none"
                    >
                        <ExternalLink size={10} />
                        Vista Legacy
                    </a>
                </div>
            </div>

            {/* Backend Offline Banner */}
            <AnimatePresence>
                {backendOnline === false && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mb-6 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-6 py-4 rounded-none flex items-start gap-3 overflow-hidden"
                    >
                        <WifiOff size={18} className="mt-0.5 shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Servidor Scraper no disponible (puerto 5005)</p>
                            <p className="text-xs text-orange-400/70 mt-1">Inicia el servidor con: <code className="bg-black/30 px-2 py-0.5 rounded-none font-mono">cd scraper-pro/server && node index.js</code></p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error / Success Alerts */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-none flex items-center gap-3 overflow-hidden"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        <span className="text-sm font-medium flex-1">{error}</span>
                        <button onClick={() => setError('')}><X size={16} /></button>
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-none flex items-center gap-3 overflow-hidden"
                    >
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span className="text-sm font-medium flex-1">{success}</span>
                        <button onClick={() => setSuccess('')}><X size={16} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-500/20 rounded-none"><Sparkles className="text-indigo-400" size={16} /></div>
                    <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">Atomic Suite</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                    Scraper <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Pro AI</span>
                </h1>
                <p className="text-slate-400 max-w-xl text-base leading-relaxed">
                    Extracción inteligente de datos con motores de IA y automatización para tu tienda.
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* ── SIDEBAR col-span-1 ── */}
                <aside className="lg:col-span-1 space-y-5">
                    {/* Action Panel */}
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-none p-6">
                        <div className="flex items-center gap-2 text-indigo-300 font-bold mb-5 text-xs uppercase tracking-widest">
                            <Activity size={16} />
                            Control de Extracción
                        </div>
                        <div className="space-y-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                <input type="text"
                                    className="w-full bg-slate-950/40 border border-white/10 rounded-none px-4 py-3 pl-11 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                                    placeholder="https://tienda.com/productos"
                                    value={url} onChange={e => setUrl(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !isScraping && url && startScraping()}
                                />
                            </div>
                            <button onClick={startScraping} disabled={isScraping || !url || backendOnline === false}
                                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 py-4 rounded-none font-bold text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.7)] disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center gap-3 transition-all text-sm"
                            >
                                {isScraping ? <div className="animate-spin rounded-none h-5 w-5 border-2 border-white/30 border-t-white" /> : <Play size={18} fill="currentColor" />}
                                <span>{isScraping ? 'EXTRAYENDO...' : 'INICIAR EXTRACCIÓN'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Config Accordions */}
                    <div className="space-y-2">
                        <Accordion id="general" title="Configuración General" icon={<Settings size={16} />} isOpen={openSection === 'general'} toggle={() => setOpenSection(openSection === 'general' ? null : 'general')}>
                            <div className="space-y-4">
                                <Toggle label="Paginación Automática" checked={config.fullScrap} onChange={(v: boolean) => setConfig({ ...config, fullScrap: v })} description="Navega por páginas 'Siguiente' automáticamente." />
                                <Toggle label="Desplazamiento Infinito" checked={config.infiniteScroll} onChange={(v: boolean) => setConfig({ ...config, infiniteScroll: v })} description="Hace scroll automático antes de leer." />
                                <div>
                                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter block mb-2">Campos a extraer</label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {['title', 'price', 'description', 'images', 'catalog', 'brand'].map(f => (
                                            <button key={f} onClick={() => toggleField(f)}
                                                className={`px-2 py-2 rounded-none text-[10px] font-semibold border transition-all ${config.fields.includes(f) ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/10'}`}
                                            >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Accordion>

                        <Accordion id="store" title="Tienda (Supabase)" icon={<Store size={16} />} isOpen={openSection === 'store'} toggle={() => setOpenSection(openSection === 'store' ? null : 'store')}>
                            <div className="space-y-3">
                                <Field label="Project URL" value={config.supabaseUrl} placeholder="https://xyz.supabase.co" onChange={(v: string) => setConfig({ ...config, supabaseUrl: v })} />
                                <Field label="Service Role Key" value={config.supabaseKey} placeholder="Secret key..." type="password" onChange={(v: string) => setConfig({ ...config, supabaseKey: v })} />
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Multiplicador de Precio (%)</label>
                                    <div className="relative">
                                        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                        <input type="number" className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-2.5 pl-8 text-xs text-white focus:border-indigo-500 focus:outline-none"
                                            placeholder="20" value={config.multiplier || ''} onChange={e => setConfig({ ...config, multiplier: parseFloat(e.target.value) || 0 })} />
                                    </div>
                                </div>
                            </div>
                        </Accordion>

                        <Accordion id="ai" title="IA & Acceso Protegido" icon={<Sparkles size={16} />} isOpen={openSection === 'ai'} toggle={() => setOpenSection(openSection === 'ai' ? null : 'ai')}>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2"><Sparkles size={12} className="text-pink-400" />Instrucciones IA</label>
                                    <textarea className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-3 text-xs text-white resize-none min-h-[80px] focus:border-indigo-500 focus:outline-none"
                                        placeholder="Ej: Extraer solo talle M..." value={config.aiInstruction}
                                        onChange={e => setConfig({ ...config, aiInstruction: e.target.value })} />
                                </div>
                                <div className="border-t border-white/5 pt-3">
                                    <Toggle label="Activar Login / Cookies" checked={config.auth.enabled} onChange={(v: boolean) => setConfig({ ...config, auth: { ...config.auth, enabled: v } })} description="Usa tu sesión de navegador." />
                                    <AnimatePresence>
                                        {config.auth.enabled && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3 space-y-2">
                                                <textarea className="w-full bg-black/40 border border-indigo-500/20 rounded-none px-4 py-3 min-h-[60px] text-[10px] text-indigo-100 font-mono focus:outline-none"
                                                    placeholder='[{"name": "...", "value": "..."}, ...]'
                                                    value={config.auth.cookies} onChange={e => setConfig({ ...config, auth: { ...config.auth, cookies: e.target.value } })} />
                                                <p className="text-[10px] text-indigo-200/50 italic">Exporta JSON de "EditThisCookie" para sitios con login.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </Accordion>
                    </div>

                    {/* Maintenance */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-none p-5">
                        <div className="flex items-center gap-2 text-red-400 font-bold mb-3 text-xs uppercase tracking-widest"><Trash2 size={14} />Mantenimiento</div>
                        <button onClick={handleCleanupDuplicates} disabled={isExporting || backendOnline === false}
                            className="w-full py-2.5 text-[10px] font-black bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-none text-red-500 transition-all uppercase tracking-widest disabled:opacity-40"
                        >LIMPIAR DUPLICADOS EXACTOS</button>
                    </div>

                    {/* Providers */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-none p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest"><Globe size={14} />Fuentes Activas</div>
                            <button onClick={fetchProviders} className="text-slate-600 hover:text-slate-400 transition-colors"><RefreshCw size={12} /></button>
                        </div>
                        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                            {isLoadingProviders ? (
                                <div className="py-4 text-center text-xs text-slate-600">Cargando...</div>
                            ) : providers.length > 0 ? (
                                providers.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-none bg-slate-900/60 border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-400 truncate uppercase">{p.name}</span>
                                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-none font-bold">{p.count}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center text-[10px] text-slate-600 italic">
                                    {backendOnline === false ? 'Servidor offline' : 'No hay datos previos'}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ── RESULTS col-span-2 ── */}
                <section className="lg:col-span-2">
                    {results.length === 0 && !isScraping ? (
                        <div className="bg-slate-900/30 border border-white/5 rounded-none p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-none flex items-center justify-center mb-6 border border-indigo-500/20">
                                <Search size={32} className="text-indigo-400 opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Listo para extraer</h3>
                            <p className="text-slate-500 max-w-sm text-sm">Introduce una URL y configura los campos que deseas obtener desde la web.</p>
                            {backendOnline === false && (
                                <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-none text-left max-w-sm">
                                    <p className="text-orange-300 text-xs font-bold mb-1">⚠ Backend no disponible</p>
                                    <p className="text-orange-400/70 text-[11px] font-mono">cd scraper-pro/server<br />node index.js</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-900/30 border border-white/5 rounded-none overflow-hidden">
                            {/* Toolbar */}
                            <div className="p-6 border-b border-white/5">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <ChevronRight className="text-pink-500" size={20} />
                                            Resultados
                                            <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-none text-indigo-300 font-bold">{results.length} ÍTEMS</span>
                                        </h2>
                                        <div className="flex bg-slate-900/60 p-1 rounded-none border border-white/5">
                                            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-none transition-all ${viewMode === 'table' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}><List size={16} /></button>
                                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-none transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}><LayoutGrid size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <ActionBtn icon={<History size={14} />} label="Historial" onClick={fetchHistory} />
                                        <ActionBtn icon={<Eye size={14} />} label="Preview" onClick={handlePreview} disabled={results.length === 0 || isExporting} />
                                        <div className="w-px h-6 bg-white/10 self-center hidden xl:block" />
                                        <ExportBtn icon={<FileSpreadsheet size={14} />} label="Excel" color="green" onClick={() => handleExport('xlsx')} loading={isExporting} disabled={results.length === 0} />
                                        <ExportBtn icon={<FileText size={14} />} label="CSV" color="blue" onClick={() => handleExport('csv')} loading={isExporting} disabled={results.length === 0} />
                                        <ExportBtn icon={<Save size={14} />} label="→ Tienda" color="purple" onClick={() => handleExportStore()} loading={isExporting} disabled={results.length === 0} highlighted />
                                    </div>
                                </div>

                                {/* Field selector */}
                                {results.length > 0 && (
                                    <div className="mt-5 p-4 bg-white/[0.03] rounded-none border border-white/5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle2 size={12} className="text-green-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Columnas de exportación</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {config.fields.map(f => (
                                                <button key={f} onClick={() => toggleExportField(f)}
                                                    className={`px-3 py-1.5 rounded-none text-[10px] font-black uppercase border transition-all ${selectedFields.includes(f) ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-slate-900 border-white/10 text-slate-500 hover:border-white/20'}`}
                                                >{f}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Results body */}
                            <div className="p-6">
                                {isScraping ? (
                                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-none animate-spin mb-4" />
                                        <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Escaneando sitio web...</p>
                                    </div>
                                ) : viewMode === 'table' ? (
                                    <TableView results={results} fields={config.fields} />
                                ) : (
                                    <GridView results={results} fields={config.fields} />
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* ── MODALS ── */}
            <AnimatePresence>
                {/* History Modal */}
                {showHistory && (
                    <Modal title="Historial de Extracciones" subtitle="Registros históricos de tus sesiones." onClose={() => setShowHistory(false)}>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {history.length === 0 ? (
                                <div className="py-16 flex flex-col items-center text-slate-600">
                                    <Clock size={36} className="mb-3 opacity-30" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Sin extracciones previas</p>
                                </div>
                            ) : history.map(item => (
                                <div key={item.id} className="p-5 bg-slate-900/60 border border-white/5 hover:border-indigo-500/20 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Database size={12} className="text-indigo-400" />
                                            <p className="text-sm font-bold text-slate-200 truncate max-w-[300px]">{item.url}</p>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <span className="text-[10px] text-slate-500 uppercase">{item.date}</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-none font-black">{item.total} ÍTEMS</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={async () => { try { const r = await axios.post('/scraper-api/export', { format: 'xlsx', fields: selectedFields, historyId: item.id }); window.open(`/scraper-download${r.data.downloadUrl}`); } catch { setError('Error al exportar'); setShowHistory(false); }}}
                                            className="p-2.5 border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-none transition-all" title="Excel"><FileSpreadsheet size={14} /></button>
                                        <button onClick={async () => { try { const r = await axios.post('/scraper-api/export', { format: 'csv', fields: selectedFields, historyId: item.id }); window.open(`/scraper-download${r.data.downloadUrl}`); } catch { setError('Error al exportar'); setShowHistory(false); }}}
                                            className="p-2.5 border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-none transition-all" title="CSV"><FileText size={14} /></button>
                                        <button onClick={() => { handleExportStore(item.id); setShowHistory(false); }}
                                            className="p-2.5 border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-none transition-all" title="Exportar a Tienda"><Save size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Modal>
                )}

                {/* Preview Modal */}
                {showPreview && previewData && (
                    <Modal title="Vista Previa" subtitle={`Mostrando ${previewData.previewCount ?? previewData.data?.length} de ${previewData.total} registros.`}
                        onClose={() => setShowPreview(false)}
                        footer={
                            <div className="flex gap-3">
                                <button onClick={() => setShowPreview(false)} className="px-5 py-2 bg-slate-800 text-slate-400 rounded-none hover:bg-slate-700 text-xs font-bold uppercase">Cancelar</button>
                                <button onClick={() => { handleExport('xlsx'); setShowPreview(false); }} disabled={isExporting}
                                    className="px-5 py-2 bg-green-600 text-white rounded-none hover:bg-green-500 flex items-center gap-2 text-xs font-bold uppercase disabled:opacity-50">
                                    <Download size={14} /> Descargar Excel
                                </button>
                            </div>
                        }
                    >
                        <div className="overflow-auto max-h-[55vh] rounded-none border border-white/5">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900 border-b border-white/10 sticky top-0"><tr>
                                    {selectedFields.map(f => <th key={f} className="py-3 px-5 text-slate-500 font-bold text-[10px] uppercase tracking-widest">{f}</th>)}
                                </tr></thead>
                                <tbody>{(previewData.data || []).map((item: any, i: number) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        {selectedFields.map(f => (
                                            <td key={f} className="py-3 px-5 text-xs text-slate-300 max-w-[200px] truncate">
                                                {f === 'images' && item[f] ? (
                                                    <div className="flex -space-x-2">{(item[f] as string).split(', ').slice(0, 3).map((img, idx) => <img key={idx} src={img} className="h-7 w-7 rounded-none ring-2 ring-slate-950 object-cover bg-slate-800" alt="" />)}</div>
                                                ) : (item[f] || '-')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Accordion({ id, title, icon, children, isOpen, toggle }: any) {
    return (
        <div className={`bg-slate-900/40 border border-white/5 rounded-none overflow-hidden transition-all ${isOpen ? 'ring-1 ring-indigo-500/30' : ''}`}>
            <button onClick={toggle} className="w-full p-5 flex items-center justify-between text-slate-200 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3">
                    <div className={`transition-colors ${isOpen ? 'text-indigo-400' : 'text-slate-500'}`}>{icon}</div>
                    <span className={`text-xs font-bold ${isOpen ? 'text-white' : 'text-slate-300'}`}>{title}</span>
                </div>
                {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
    return (
        <label className="flex items-start justify-between gap-4 p-3 rounded-none hover:bg-white/[0.03] transition-all cursor-pointer group">
            <div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors block">{label}</span>
                {description && <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{description}</span>}
            </div>
            <div onClick={e => { e.preventDefault(); onChange(!checked); }}
                className={`mt-1 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors ${checked ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-none bg-white shadow transition duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </label>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{label}</label>
            <input type={type} className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );
}

function ActionBtn({ icon, label, onClick, disabled }: any) {
    return (
        <button onClick={onClick} disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/60 border border-white/10 rounded-none text-slate-400 hover:text-white hover:border-white/20 transition-all text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed">
            {icon}<span>{label}</span>
        </button>
    );
}

function ExportBtn({ icon, label, color, onClick, loading, disabled, highlighted }: any) {
    const colors: any = {
        green: 'bg-green-600/10 border-green-500/30 text-green-400 hover:bg-green-600/30',
        blue: 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/30',
        purple: 'bg-purple-600/10 border-purple-500/40 text-purple-400 hover:bg-purple-600/30'
    };
    return (
        <button onClick={onClick} disabled={disabled || loading}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-none transition-all text-xs font-bold uppercase tracking-wider ${colors[color]} ${highlighted ? 'ring-1 ring-purple-500/20' : ''} disabled:opacity-30 disabled:cursor-not-allowed active:scale-95`}>
            {loading ? <div className="animate-spin rounded-none h-3 w-3 border-2 border-current border-t-transparent" /> : icon}
            <span>{label}</span>
        </button>
    );
}

function TableView({ results, fields }: any) {
    return (
        <div className="overflow-x-auto rounded-none border border-white/5 bg-black/20">
            <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-950/40 border-b border-white/5">
                    {fields.map((f: string) => <th key={f} className="py-3 px-5 text-slate-500 font-bold text-[10px] uppercase tracking-widest">{f}</th>)}
                </tr></thead>
                <tbody>{results.slice(0, 100).map((item: any, i: number) => (
                    <motion.tr key={i} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.008 }}
                        className="border-b border-white/5 hover:bg-indigo-500/5 transition-colors">
                        {fields.map((f: string) => (
                            <td key={f} className="py-3 px-5 text-xs text-slate-300 max-w-[220px] truncate">
                                {f === 'images' && item[f] ? (
                                    <div className="flex -space-x-2">{(item[f] as string).split(', ').slice(0, 4).map((img: string, idx: number) => (
                                        <img key={idx} src={img} referrerPolicy="no-referrer" className="h-8 w-8 rounded-none ring-2 ring-slate-950 object-cover bg-slate-800" alt="" />
                                    ))}</div>
                                ) : (item[f] || <span className="opacity-20">—</span>)}
                            </td>
                        ))}
                    </motion.tr>
                ))}</tbody>
            </table>
        </div>
    );
}

function GridView({ results, fields }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {results.slice(0, 50).map((item: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                    className="bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 transition-all rounded-none overflow-hidden group">
                    <div className="relative h-44 bg-slate-950 overflow-hidden">
                        {item.images ? (
                            <img src={item.images.split(', ')[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20"><Activity size={28} className="text-white" /></div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-none text-xs font-bold border border-white/10 text-white">{item.price || 'N/A'}</div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{item.title || 'Sin Título'}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description || 'Sin descripción.'}</p>
                        <div className="mt-3 pt-2 border-t border-white/5">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.catalog || 'General'}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function Modal({ title, subtitle, children, footer, onClose }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 lg:p-10"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-none w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}>
                <div className="p-7 border-b border-white/5 flex justify-between items-center bg-indigo-500/5">
                    <div><h2 className="text-xl font-bold text-white">{title}</h2>{subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}</div>
                    <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-none transition-all"><X size={20} /></button>
                </div>
                <div className="p-7 overflow-y-auto">{children}</div>
                {footer && <div className="p-7 border-t border-white/5 flex justify-end bg-slate-950/20">{footer}</div>}
            </motion.div>
        </motion.div>
    );
}


