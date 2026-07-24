import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomeCategoryBanner({ activeMainCategoryId, categories }: any) {
    const hogarId = categories?.find((c: any) => c.slug === 'hogar')?.id;
    
    const isGlobal = !activeMainCategoryId;
    const isMatch = activeMainCategoryId === hogarId;
    
    if (!isGlobal && !isMatch) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto px-6 mt-8 mb-4"
        >
            <div className="relative w-full aspect-[21/9] md:aspect-[24/7] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,85,254,0.15)] border-2 border-[#0055fe] group">
                <Image 
                    src="/assets/ecommerce/smart_home_banner.jpg" 
                    alt="Smart Home"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent flex flex-col justify-center p-8 md:p-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="max-w-xl"
                    >
                        <h3 className="text-sm font-bold tracking-[0.4em] uppercase text-[#0055fe] mb-4">
                            Línea Hogar
                        </h3>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-black leading-[0.9] mb-4 md:mb-6">
                            EL FUTURO <br /> VIVE AQUÍ
                        </h2>
                        <p className="text-xs md:text-sm font-medium text-black/70 leading-relaxed max-w-md">
                            Automatización inteligente, cerraduras biométricas, iluminación inteligente y tecnología de primer nivel diseñada para transformar tu hogar en un ecosistema de confort absoluto.
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
