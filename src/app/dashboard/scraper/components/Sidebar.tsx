"use client"

import React, { useState } from 'react';
import { 
    Search, Settings, Sparkles, Store, Trash2, Globe, Plus, 
    ChevronDown, ChevronUp, Activity, Play 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    url: string;
    setUrl: (url: string) => void;
    config: any;
    setConfig: (config: any) => void;
    startScraping: () => void;
    isScraping: boolean;
    providers: any[];
    isLoadingProviders: boolean;
    fetchProviders: () => void;
    handleCleanupDuplicates: () => void;
    isExporting: boolean;
    promptHistory: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
    url, setUrl, 
    config, setConfig, 
    startScraping, isScraping, 
    providers, isLoadingProviders,
    handleCleanupDuplicates, isExporting
}) => {
    const [openSection, setOpenSection] = useState<string | null>('general');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const toggleField = (field: string) => {
        setConfig((prev: any) => ({
            ...prev,
            fields: prev.fields.includes(field) 
                ? prev.fields.filter((f: string) => f !== field)
                : [...prev.fields, field]
        }));
    };

    return (
        <aside className="lg:col-span-1 space-y-6">
            {/* MAIN ACTION PANEL */}
            <div className="glass-panel p-6 border-indigo-500/20 bg-indigo-500/5 rounded-none">
                <div className="flex items-center gap-2 text-indigo-300 font-bold mb-6 text-sm uppercase tracking-widest">
                    <Activity size={18} />
                    <span>Control de Extracción</span>
                </div>
                
                <div className="space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            className="w-full bg-slate-950/40 border border-white/10 rounded-none px-4 py-3 pl-12 text-white group-hover:border-white/20 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600" 
                            placeholder="https://tienda-ejemplo.com/productos"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={startScraping}
                        disabled={isScraping || !url}
                        className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 py-4 rounded-none font-bold text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:shadow-none hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center gap-3 transition-all"
                    >
                        {isScraping ? (
                            <div className="animate-spin rounded-none h-5 w-5 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            <Play size={20} fill="currentColor" />
                        )}
                        <span className="tracking-wide">{isScraping ? 'EXTRAYENDO...' : 'INICIAR EXTRACCIÓN'}</span>
                    </button>
                </div>
            </div>

            {/* CONFIGURATIONS */}
            <div className="space-y-3">
                <ConfigAccordion 
                    id="general"
                    title="Configuración General"
                    icon={<Settings size={18} />}
                    isOpen={openSection === 'general'}
                    toggle={() => toggleSection('general')}
                >
                    <div className="space-y-5 py-2">
                        <div className="flex flex-col gap-2">
                            <ToggleItem 
                                label="Paginación Automática" 
                                checked={config.fullScrap}
                                onChange={(val) => setConfig({...config, fullScrap: val})}
                                description="Busca botones de 'Siguiente' para extraer todo."
                            />
                            <ToggleItem 
                                label="Desplazamiento Infinito" 
                                checked={config.infiniteScroll}
                                onChange={(val) => setConfig({...config, infiniteScroll: val})}
                                description="Hace scroll automáticamente antes de leer."
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter text-indigo-400">Campos a extraer</label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {['title', 'price', 'description', 'images', 'catalog', 'brand'].map(field => (
                                    <button 
                                        key={field}
                                        onClick={() => toggleField(field)}
                                        className={`px-3 py-2 rounded-none text-xs font-semibold border transition-all ${
                                            config.fields.includes(field) 
                                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                                            : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/10'
                                        }`}
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ConfigAccordion>

                <ConfigAccordion 
                    id="store"
                    title="Tienda (Supabase)"
                    icon={<Store size={18} />}
                    isOpen={openSection === 'store'}
                    toggle={() => toggleSection('store')}
                >
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Project URL</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                                placeholder="https://xyz.supabase.co"
                                value={config.supabaseUrl || ''}
                                onChange={(e) => setConfig({...config, supabaseUrl: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Service Role Key</label>
                            <input 
                                type="password" 
                                className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                                placeholder="Secret key..."
                                value={config.supabaseKey || ''}
                                onChange={(e) => setConfig({...config, supabaseKey: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Multiplicador de Precio (%)</label>
                            <div className="relative">
                                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-2.5 pl-8 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                                    placeholder="20"
                                    value={config.multiplier || ''}
                                    onChange={(e) => setConfig({...config, multiplier: parseFloat(e.target.value) || 0})}
                                />
                            </div>
                        </div>
                    </div>
                </ConfigAccordion>

                <ConfigAccordion 
                    id="advanced"
                    title="IA & Acceso Protegido"
                    icon={<Sparkles size={18} />}
                    isOpen={openSection === 'advanced'}
                    toggle={() => toggleSection('advanced')}
                >
                    <div className="space-y-5 py-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                <Sparkles size={14} className="text-pink-400" />
                                Instrucciones IA
                            </label>
                            <textarea 
                                className="w-full bg-slate-950/20 border border-white/10 rounded-none px-4 py-3 text-xs text-white resize-none min-h-[100px] focus:border-indigo-500 focus:outline-none" 
                                placeholder="Ej: Extraer solo talle M..."
                                value={config.aiInstruction}
                                onChange={(e) => setConfig({...config, aiInstruction: e.target.value})}
                            />
                        </div>

                        <div className="pt-2 border-t border-white/5 space-y-4">
                            <ToggleItem 
                                label="Activar Login / Cookies" 
                                checked={config.auth.enabled}
                                onChange={(val) => setConfig({...config, auth: {...config.auth, enabled: val}})}
                                description="Usa tu sesión de navegador."
                            />
                            
                            <AnimatePresence>
                                {config.auth.enabled && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        <textarea 
                                            className="w-full bg-black/40 border border-indigo-500/20 rounded-none px-4 py-3 min-h-[60px] text-[10px] text-indigo-100 font-mono focus:outline-none" 
                                            placeholder='[{"name": "...", "value": "..."}, ...]'
                                            value={config.auth.cookies}
                                            onChange={(e) => setConfig({...config, auth: {...config.auth, cookies: e.target.value}})}
                                        />
                                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-none text-[10px] text-indigo-200/60 leading-relaxed italic">
                                            Exporta el JSON de "EditThisCookie" para sitios con login.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </ConfigAccordion>
            </div>

            {/* MAINTENANCE TOOLS */}
            <div className="glass-panel p-6 border-red-500/10 bg-red-500/5 rounded-none">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-4 text-xs uppercase tracking-widest">
                    <Trash2 size={16} />
                    <span>Mantenimiento</span>
                </div>
                <button 
                    onClick={handleCleanupDuplicates}
                    disabled={isExporting}
                    className="w-full py-2.5 text-[10px] font-black bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-none text-red-500 transition-all uppercase tracking-widest disabled:opacity-50"
                >
                    LIMPIAR DUPLICADOS EXACTOS
                </button>
            </div>

            {/* PROVIDERS LIST */}
            <div className="glass-panel p-6 rounded-none">
                <div className="flex items-center gap-2 text-slate-400 font-bold mb-4 text-xs uppercase tracking-widest">
                    <Globe size={16} />
                    <span>Fuentes activas</span>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {isLoadingProviders ? (
                        <div className="py-4 text-center text-xs text-slate-600">Cargando...</div>
                    ) : providers.length > 0 ? (
                        providers.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-none bg-slate-900/40 border border-white/5 hover:border-indigo-500/20 transition-all group">
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 truncate uppercase">{p.name}</span>
                                <span className="text-[10px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-none font-bold">{p.count}</span>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-[10px] text-slate-600 italic">No hay datos previos</div>
                    )}
                </div>
            </div>
        </aside>
    );
};

// HELPERS
interface AccordionProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    toggle: () => void;
}

const ConfigAccordion: React.FC<AccordionProps> = ({ title, icon, children, isOpen, toggle }) => (
    <div className={`glass-panel overflow-hidden transition-all duration-300 rounded-none ${isOpen ? 'ring-1 ring-indigo-500/30' : ''}`}>
        <button 
            onClick={toggle}
            className="w-full p-6 flex items-center justify-between text-slate-200 hover:bg-white/5 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className={`${isOpen ? 'text-indigo-400' : 'text-slate-500'} transition-colors`}>{icon}</div>
                <span className={`text-sm font-bold ${isOpen ? 'text-white' : 'text-slate-300'}`}>{title}</span>
            </div>
            {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 overflow-hidden"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
    description?: string;
}

const ToggleItem: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => (
    <label className="flex items-start justify-between gap-4 p-3 rounded-none hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group">
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
            {description && <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{description}</span>}
        </div>
        <div 
            onClick={(e) => {
                e.preventDefault();
                onChange(!checked);
            }}
            className={`mt-1 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-indigo-500' : 'bg-slate-800'}`}
        >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-none bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
    </label>
);

export default Sidebar;
