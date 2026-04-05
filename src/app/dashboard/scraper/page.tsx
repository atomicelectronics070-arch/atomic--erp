"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, Bot } from "lucide-react";

// Native Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ResultsSection from './components/ResultsSection';
import ModalManager from './components/Modals';

export default function ScraperPage() {
    // --- STATE ---
    const [url, setUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [providers, setProviders] = useState<any[]>([]);
    const [isLoadingProviders, setIsLoadingProviders] = useState(false);
    
    const [config, setConfig] = useState({
        infiniteScroll: true,
        fullScrap: false,
        supabaseUrl: '',
        supabaseKey: '',
        multiplier: 0,
        fields: ['title', 'price', 'description', 'images', 'catalog'],
        aiInstruction: '',
        auth: {
            enabled: false,
            username: '',
            password: '',
            cookies: ''
        }
    });

    const [selectedFields, setSelectedFields] = useState(['title', 'price', 'images']);
    const [results, setResults] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [promptHistory, setPromptHistory] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [lastHistoryId, setLastHistoryId] = useState<string | null>(null);

    // --- EFFECTS ---
    useEffect(() => {
        const savedHistory = localStorage.getItem('prompt_history');
        if (savedHistory) {
            try {
                setPromptHistory(JSON.parse(savedHistory));
            } catch (e) {}
        }
        fetchProviders();
    }, []);

    // --- HANDLERS ---
    const fetchProviders = async () => {
        setIsLoadingProviders(true);
        try {
            const response = await axios.get('/scraper-api/providers');
            if (response.data.success) {
                setProviders(response.data.providers);
            }
        } catch (err) {
            console.error('Error fetching providers:', err);
        } finally {
            setIsLoadingProviders(false);
        }
    };

    const startScraping = async () => {
        setError('');
        setSuccess('');
        setIsScraping(true);
        try {
            const response = await axios.post('/scraper-api/scrape', { url, config });
            if (response.data.success) {
                setResults(response.data.data);
                if (response.data.total === 0) {
                    setError('Se extrajeron 0 productos. Prueba activando "Acceso Protegido" con Cookies.');
                } else {
                    setSuccess(`Se extrajeron ${response.data.total} productos con éxito.`);
                    setLastHistoryId(response.data.historyId);
                }
                
                if (config.aiInstruction) {
                    const newPrompts = [config.aiInstruction, ...promptHistory.filter(p => p !== config.aiInstruction)].slice(0, 5);
                    setPromptHistory(newPrompts);
                    localStorage.setItem('prompt_history', JSON.stringify(newPrompts));
                }
            }
        } catch (err: any) {
            setError('Error al extraer: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsScraping(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/scraper-api/history');
            setHistory(res.data.history);
            setShowHistory(true);
        } catch (err) {
            setError('Error al cargar historial');
        }
    };

    const handlePreview = async () => {
        setError('');
        try {
            const response = await axios.post('/scraper-api/preview', { 
                fields: selectedFields,
                historyId: lastHistoryId 
            });
            if (response.data.success) {
                setPreviewData(response.data);
                setShowPreview(true);
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            setError('Error al previsualizar: ' + err.message);
        }
    };

    const handleExport = async (format: string) => {
        if (results.length === 0 && !lastHistoryId) return;
        setError('');
        setIsExporting(true);
        try {
            const response = await axios.post('/scraper-api/export', { 
                format, 
                fields: selectedFields,
                historyId: lastHistoryId
            });
            
            if (response.data.success) {
                const downloadResponse = await axios.get(`/scraper-download${response.data.downloadUrl}`, {
                    responseType: 'blob'
                });
                
                const blobUrl = window.URL.createObjectURL(new Blob([downloadResponse.data]));
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', response.data.fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
                setSuccess(`${format.toUpperCase()} descargado.`);
            }
        } catch (err: any) {
            setError('Error al exportar: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportStore = async (id: string | null = lastHistoryId) => {
        if (!config.supabaseUrl || !config.supabaseKey) {
            setError('Configura Supabase en el panel de avanzado.');
            return;
        }
        
        setError('');
        setIsExporting(true);
        try {
            const response = await axios.post('/scraper-api/export-store', { 
                historyId: id,
                supabaseUrl: config.supabaseUrl,
                supabaseKey: config.supabaseKey
            });
            
            if (response.data.success) {
                setSuccess(response.data.message || `Exportado a la tienda.`);
                fetchProviders();
            }
        } catch (err: any) {
            setError('Error al exportar a tienda: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsExporting(false);
        }
    };

    const handleCleanupDuplicates = async () => {
        if (!window.confirm('¿Eliminar todos los duplicados 100% idénticos?')) return;
        setIsExporting(true);
        try {
            const response = await axios.post('/scraper-api/cleanup-duplicates');
            if (response.data.success) {
                setSuccess(response.data.message);
                fetchProviders();
            }
        } catch (err) {
            setError('Error al limpiar duplicados');
        } finally {
            setIsExporting(false);
        }
    };

    const toggleExportField = (field: string) => {
        setSelectedFields(prev => 
            prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
        );
    };

    return (
        <div className="flex flex-col h-full -m-10 lg:-m-14 bg-mesh min-h-screen overflow-x-hidden">
            {/* Native Sub-header */}
            <div className="flex items-center justify-between px-8 py-4 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 shrink-0 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <Bot size={18} className="text-indigo-400" />
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em]">Scraper Pro AI Native</span>
                    <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 uppercase tracking-widest px-2 py-0.5 border border-indigo-500/20 rounded-md">
                        Admin Direct
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { fetchProviders(); setResults([]); setError(''); setSuccess(''); }}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest border border-slate-700 px-3 py-1.5 hover:border-slate-500 transition-all rounded-lg"
                        title="Resetear Vista"
                    >
                        <RefreshCw size={10} />
                        Limpiar
                    </button>
                    <a
                        href="/scraper/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-3 py-1.5 hover:border-indigo-600 transition-all rounded-lg"
                    >
                        <ExternalLink size={10} />
                        Legacy View
                    </a>
                </div>
            </div>

            {/* Main Native Content */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <Header isScraping={isScraping} />

                <div className="max-w-7xl mx-auto mb-6">
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-4 font-medium flex items-center gap-3 overflow-hidden"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl mb-4 font-medium flex items-center gap-3 overflow-hidden"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                    <Sidebar 
                        url={url} setUrl={setUrl}
                        config={config} setConfig={setConfig}
                        startScraping={startScraping} isScraping={isScraping}
                        providers={providers} isLoadingProviders={isLoadingProviders} fetchProviders={fetchProviders}
                        handleCleanupDuplicates={handleCleanupDuplicates} isExporting={isExporting}
                        promptHistory={promptHistory}
                    />

                    <ResultsSection 
                        results={results} config={config}
                        fetchHistory={fetchHistory} handlePreview={handlePreview}
                        handleExport={handleExport} handleExportStore={handleExportStore}
                        selectedFields={selectedFields} toggleExportField={toggleExportField}
                        isExporting={isExporting} isScraping={isScraping}
                    />
                </main>

                <ModalManager 
                    showPreview={showPreview} setShowPreview={setShowPreview} previewData={previewData}
                    showHistory={showHistory} setShowHistory={setShowHistory} history={history}
                    handleExport={handleExport} handleExportStore={handleExportStore}
                    selectedFields={selectedFields} isExporting={isExporting}
                />
            </div>
        </div>
    );
}
