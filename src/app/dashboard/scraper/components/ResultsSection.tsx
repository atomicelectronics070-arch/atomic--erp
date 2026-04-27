"use client"

import React, { useState } from 'react';
import { 
    ChevronRight, History, Eye, FileSpreadsheet, FileText, Save, 
    LayoutGrid, List, CheckCircle2, Search, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultItem {
    title?: string;
    description?: string;
    price?: string;
    images?: string;
    catalog?: string;
    [key: string]: any;
}

interface ResultsSectionProps {
    results: ResultItem[];
    config: any;
    fetchHistory: () => void;
    handlePreview: () => void;
    handleExport: (format: 'xlsx' | 'csv') => void;
    handleExportStore: () => void;
    selectedFields: string[];
    toggleExportField: (field: string) => void;
    isExporting: boolean;
    isScraping: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
    results, config, 
    fetchHistory, handlePreview, 
    handleExport, handleExportStore, 
    selectedFields, toggleExportField,
    isExporting, isScraping
}) => {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    if (results.length === 0 && !isScraping) {
        return (
            <section className="lg:col-span-2">
                <div className="glass-panel p-20 flex flex-col items-center justify-center text-center rounded-none">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-none flex items-center justify-center mb-6 border border-indigo-500/20">
                        <Search size={32} className="text-indigo-400 opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Listo para extraer</h3>
                    <p className="text-slate-500 max-w-sm">Introduce una URL en el panel lateral y configura los campos que deseas obtener de la web.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-none">
                {/* TOOLBAR */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <ChevronRight className="text-pink-500" size={24} />
                            Resultados
                            <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-none text-indigo-300 font-bold tracking-widest">{results.length} ÍTEMS</span>
                        </h2>
                        
                        <div className="flex bg-slate-900/60 p-1 rounded-none border border-white/5">
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-none transition-all ${viewMode === 'table' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <List size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-none transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <ActionButton icon={<History size={16} />} label="Historial" onClick={fetchHistory} />
                        <ActionButton icon={<Eye size={16} />} label="Vista Previa" onClick={handlePreview} disabled={results.length === 0} />
                        
                        <div className="h-8 w-[1px] bg-white/10 mx-2 hidden xl:block"></div>
                        
                        <ExportButton 
                            icon={<FileSpreadsheet size={16} />} 
                            label="Excel" 
                            color="green" 
                            onClick={() => handleExport('xlsx')} 
                            loading={isExporting} 
                            disabled={results.length === 0} 
                        />
                        <ExportButton 
                            icon={<FileText size={16} />} 
                            label="CSV" 
                            color="blue" 
                            onClick={() => handleExport('csv')} 
                            loading={isExporting} 
                            disabled={results.length === 0} 
                        />
                        <ExportButton 
                            icon={<Save size={16} />} 
                            label="Tienda" 
                            color="purple" 
                            onClick={handleExportStore} 
                            loading={isExporting} 
                            disabled={results.length === 0} 
                            highlighted
                        />
                    </div>
                </div>

                {/* FIELD SELECTOR FOR EXPORT */}
                {results.length > 0 && (
                    <div className="mb-8 p-5 bg-white/5 rounded-none border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configurar Columnas de Salida</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {config.fields.map((field: string) => (
                                <button 
                                    key={field}
                                    onClick={() => toggleExportField(field)}
                                    className={`px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-tighter border transition-all ${
                                        selectedFields.includes(field) 
                                        ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                        : 'bg-slate-900 border-white/10 text-slate-500 hover:border-white/20'
                                    }`}
                                >
                                    {field}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* RESULTS VIEW */}
                <div className="min-h-[400px]">
                    {isScraping && results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-none animate-spin mb-4"></div>
                            <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Escaneando sitio web...</p>
                        </div>
                    ) : viewMode === 'table' ? (
                        <TableView results={results} fields={config.fields} />
                    ) : (
                        <GridView results={results} fields={config.fields} />
                    )}
                </div>
            </div>
        </section>
    );
};

// SUB-COMPONENTS
const ActionButton = ({ icon, label, onClick, disabled }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-white/10 rounded-none text-slate-400 hover:text-white hover:border-white/20 transition-all text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed"
    >
        {icon}
        <span>{label}</span>
    </button>
);

const ExportButton = ({ icon, label, color, onClick, loading, disabled, highlighted }: any) => {
    const colors: any = {
        green: 'bg-green-600/10 border-green-500/30 text-green-400 hover:bg-green-600/40 hover:text-white',
        blue: 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/40 hover:text-white',
        purple: 'bg-purple-600/10 border-purple-500/40 text-purple-400 hover:bg-purple-600/40 hover:text-white ring-purple-500/20 ring-offset-slate-900'
    };
    
    return (
        <button 
            onClick={onClick}
            disabled={disabled || loading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-none transition-all text-xs font-bold uppercase tracking-wider ${colors[color]} ${highlighted ? 'ring-2' : ''} disabled:opacity-30 disabled:cursor-not-allowed active:scale-95`}
        >
            {loading ? <div className="animate-spin rounded-none h-3 w-3 border-2 border-current border-t-transparent"></div> : icon}
            <span>{label}</span>
        </button>
    );
};

const TableView = ({ results, fields }: { results: Array<any>, fields: string[] }) => (
    <div className="overflow-x-auto rounded-none border border-white/5 bg-black/20">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-950/40 border-b border-white/5">
                    {fields.map(f => (
                        <th key={f} className="py-4 px-6 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">{f}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {results.slice(0, 100).map((item, i) => (
                    <motion.tr 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.01 }}
                        key={i} 
                        className="border-b border-white/5 hover:bg-indigo-500/5 group transition-colors"
                    >
                        {fields.map(f => (
                            <td key={f} className="py-4 px-6 text-sm text-slate-300 max-w-[240px] truncate font-medium">
                                {f === 'images' && item[f] ? (
                                    <div className="flex -space-x-2 group-hover:-space-x-1 transition-all">
                                        {(item[f] as string).split(', ').slice(0, 4).map((img, idx) => (
                                            <img key={idx} src={img} referrerPolicy="no-referrer" className="h-9 w-9 rounded-none ring-2 ring-slate-950 object-cover bg-slate-800 shadow-xl" alt="" />
                                        ))}
                                    </div>
                                ) : (item[f] || <span className="opacity-20">-</span>)}
                            </td>
                        ))}
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>
);

const GridView = ({ results, fields }: { results: Array<any>, fields: string[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-2">
        {results.slice(0, 50).map((item, i) => (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                key={i}
                className="glass-panel group hover:border-indigo-500/40 transition-all flex flex-col rounded-none overflow-hidden"
            >
                {/* IMAGE AREA */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                    {item.images ? (
                        <img 
                            src={item.images.split(', ')[0]} 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            alt={item.title} 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20"><Activity size={32} className="text-white" /></div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-none text-xs font-bold border border-white/10 text-white">
                        {item.price || 'N/A'}
                    </div>
                </div>
                
                {/* CONTENT AREA */}
                <div className="p-4 space-y-2 flex-grow">
                    <h3 className="font-bold text-white line-clamp-1">{item.title || 'Sin Título'}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
                        {item.description || 'Sin descripción disponible para este producto.'}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{item.catalog || 'General'}</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-none bg-slate-700"></div>
                            <div className="w-1 h-1 rounded-none bg-slate-700"></div>
                            <div className="w-1 h-1 rounded-none bg-slate-700"></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
    </div>
);

export default ResultsSection;


