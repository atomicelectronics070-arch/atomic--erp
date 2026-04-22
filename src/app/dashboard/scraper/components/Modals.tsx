"use client"

import React from 'react';
import { X, Clock, Database, FileSpreadsheet, FileText, Save, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ModalManagerProps {
    showPreview: boolean;
    setShowPreview: (val: boolean) => void;
    previewData: any;
    showHistory: boolean;
    setShowHistory: (val: boolean) => void;
    history: any[];
    handleExport: (format: 'xlsx' | 'csv') => void;
    handleExportStore: (id?: string) => void;
    selectedFields: string[];
    isExporting: boolean;
}

const ModalManager: React.FC<ModalManagerProps> = ({ 
    showPreview, setShowPreview, previewData, 
    showHistory, setShowHistory, history, 
    handleExport, handleExportStore,
    selectedFields, isExporting
}) => {
    return (
        <AnimatePresence mode='wait'>
            {/* PREVIEW MODAL */}
            {showPreview && previewData && (
                <Modal 
                    title="Vista Previa de Exportación" 
                    subtitle={`Mostrando ${previewData.previewCount} de ${previewData.total} registros extraídos.`}
                    onClose={() => setShowPreview(false)}
                    footer={
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="px-6 py-2 bg-slate-800 text-slate-400 rounded-none hover:bg-slate-700 hover:text-white transition-all text-xs font-bold uppercase"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => { handleExport('xlsx'); setShowPreview(false); }}
                                disabled={isExporting}
                                className="px-6 py-2 bg-green-600 text-white rounded-none hover:bg-green-500 shadow-xl shadow-green-500/20 flex items-center gap-2 text-xs font-bold uppercase transition-all"
                            >
                                <Download size={16} /> Descargar Archivo Excel
                            </button>
                        </div>
                    }
                >
                    <div className="overflow-auto max-h-[60vh] rounded-none border border-white/5 bg-slate-950/40 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900 border-b border-white/10 sticky top-0 z-10">
                                <tr>
                                    {selectedFields.map(f => (
                                        <th key={f} className="py-4 px-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">{f}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.data.map((item: any, i: number) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        {selectedFields.map(f => (
                                            <td key={f} className="py-4 px-6 text-sm text-slate-300 max-w-[200px] truncate">
                                                {f === 'images' && item[f] ? (
                                                    <div className="flex -space-x-2">
                                                        {(item[f] as string).split(', ').slice(0, 3).map((img, idx) => (
                                                            <img key={idx} src={img} className="h-8 w-8 rounded-none ring-2 ring-slate-950 object-cover bg-slate-800" alt="" />
                                                        ))}
                                                    </div>
                                                ) : (item[f] || '-')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            {/* HISTORY MODAL */}
            {showHistory && (
                <Modal 
                    title="Historial de Extracciones" 
                    subtitle="Registros históricos de tus sesiones de raspado de datos."
                    onClose={() => setShowHistory(false)}
                >
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                                <Clock size={40} className="mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">No hay extracciones previas</p>
                            </div>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="p-5 glass-panel border-white/5 hover:border-indigo-500/20 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group transition-all rounded-none overflow-hidden">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Database size={14} className="text-indigo-400" />
                                            <p className="text-sm font-bold text-slate-200 truncate max-w-[300px]">{item.url}</p>
                                        </div>
                                        <div className="flex gap-4 mt-1 items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.date}</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-none font-black">{item.total} ÍTEMS</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <HistoryActionButton 
                                            icon={<FileSpreadsheet size={16} />} 
                                            color="green" 
                                            onClick={async () => {
                                                const res = await axios.post('/scraper-api/export', { format: 'xlsx', fields: selectedFields, historyId: item.id });
                                                window.open(`/scraper-download${res.data.downloadUrl}`);
                                            }}
                                        />
                                        <HistoryActionButton 
                                            icon={<FileText size={16} />} 
                                            color="blue" 
                                            onClick={async () => {
                                                const res = await axios.post('/scraper-api/export', { format: 'csv', fields: selectedFields, historyId: item.id });
                                                window.open(`/scraper-download${res.data.downloadUrl}`);
                                            }}
                                        />
                                        <HistoryActionButton 
                                            icon={<Save size={16} />} 
                                            color="purple" 
                                            onClick={() => {
                                                handleExportStore(item.id);
                                                setShowHistory(false);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
};

// MODAL BASE COMPONENT
interface ModalProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, subtitle, children, footer, onClose }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 lg:p-10"
        onClick={onClose}
    >
        <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-white/10 rounded-none w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
        >
            {/* HEADER */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-indigo-500/5">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
                </div>
                <button 
                    onClick={onClose} 
                    className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-none transition-all"
                >
                    <X size={24} />
                </button>
            </div>

            {/* BODY */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
                {children}
            </div>

            {/* FOOTER */}
            {footer && (
                <div className="p-8 border-t border-white/5 flex justify-end bg-slate-950/20">
                    {footer}
                </div>
            )}
        </motion.div>
    </motion.div>
);

const HistoryActionButton = ({ icon, color, onClick }: any) => {
    const colors: any = {
        green: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white',
        purple: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white'
    };
    return (
        <button 
            onClick={onClick}
            className={`flex-1 md:flex-none p-3 border rounded-none transition-all ${colors[color]} active:scale-90`}
        >
            {icon}
        </button>
    );
};

export default ModalManager;
