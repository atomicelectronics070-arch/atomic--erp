"use client"

import React from 'react';
import { Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
    isScraping: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScraping }) => {
    return (
        <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="p-2 bg-indigo-500/20 rounded-none">
                        <Sparkles className="text-indigo-400" size={24} />
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">Atomic Suite</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-2"
                >
                    Scraper <span className="text-gradient">Pro AI</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 mt-4 max-w-md text-lg leading-relaxed"
                >
                    Extracción inteligente de datos con motores de IA y automatización para tu tienda.
                </motion.p>
            </div>

            {isScraping && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-none text-indigo-300 text-sm font-medium"
                >
                    <Activity size={16} className="animate-pulse" />
                    <span>Motor de extracción activo...</span>
                </motion.div>
            )}
        </header>
    );
};

export default Header;
